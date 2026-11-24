const post = {
  slug: 'how-database-replication-works',
  frontmatter: {
    title: 'How Database Replication Works',
    subtitle: '(mostly in postgres)',
    description: 'How database replication works, why it is likely more complicated than you think, and the tradeoffs behind each approach.',
    date: '2026-11-20',
    tags: [],
    readingTime: 10,
    cover: null,
  },
  content: `
Database replication seems fairly simple. The basic idea is to copy data from one database server to another, typically for fault tolerance and read scalability. 
But there's a lot to consider: sync vs async replication, logical vs physical replication, single-leader vs multi-leader, replication lag, failovers, fencing.

I ran into a lot of these questions even while building the simplest possible [Postgres failover controller in Rust](https://github.com/JoeS51/rust-systems-examples/tree/main/crates/pg-failover), which inevitably nerd-sniped me...

![Nerd sniping comic with a database replication question on the sign](/images/nerd-sniping-replication.png)

There are many flavors of database replication, so I won't be able to cover all the details, but my goal is to teach you how database replication actually works
, so the tradeoffs become clear!

### What does the primary send to its replicas?

In database replication, the primary obviously needs to communicate with the replicas to keep them updated. Since the primary and replicas are usually on different
 servers entirely, this communications happens over the network. In Postgres, the primary listens on port \`5432\` by default and the replicas will create their own 
TCP connection to that port to establish communication. Once a replica connects to this port, what does the primary send?

Well, the primary could send the original SQL query to its replicas. For example:

\`\`\`sql
INSERT INTO table1 (name, created_at) VALUES ('joe', NOW());
\`\`\`

You might have noticed a problem here. If the primary and replica both recieve and execute this query separately, then they will each evaluate \`NOW()\` for themselves.
The primary might store 12:00:00 in \`created_at\`, while the replica stores 12:00:01. Storing different data in the primary and replica would defeat the purpose of replication,
so we need a different strategy (fun fact: there are actually ways to do replication properly using this method, and it's called *statement-based replication*).

Instead of sending the exact SQL queries from the primary to the replicas, we need to send the exact data we want to write on the replica and where to write it to in the database.
Thankfully, we have the perfect thing for that: the write-ahead log (WAL).
You can think of the WAL as one long append-only file where each change to the database is recorded.
The WAL is comprised of these things called the <u>WAL records</u>.

Let's use the SQL query above as an example. The WAL records for that might look like this:

\`\`\`text
LSN: 0/1000100
Transaction ID: 742
Resource manager: Heap
Operation: INSERT
Relation (tablespace/database/file): 1663/16384/24576
Fork: main
Block: 0
Tuple offset: 1
Tuple data (decoded for readability):
  name: 'joe'
  created_at: '2026-11-20 12:00:00+00'

LSN: 0/1000180
Transaction ID: 742
Resource manager: Transaction
Operation: COMMIT
\`\`\`

> The WAL in Postgres won't look like this exactly since the WAL is all binary data, but this example should help paint the picture. 
If you're interested in looking at the WAL in Postgres yourself, you can try using the \`pg_waldump\`!

There are two WAL records here: one for the actual inserted data and the other for the COMMIT.
You can see that the first WAL record contains
the timestamp already computed on the primary, so if we can just send the replicas these WAL records, we avoid our earlier problem entirely.
And that's what <u>physical replication</u> does! In physical replication, the primary just sends the raw WAL data to its replicas.

A common alternative to physical replication is <u>logical replication</u>. In logical replication, Postgres reads the WAL to determine which rows were inserted, updated, or deleted.
It then sends those changes to the replicas. In our example, that means sending the new row’s values, including the timestamp the primary already computed.

From here on out, we will be focusing on physical replication, but the core idea remains the same.

### How does the replica receive and apply the WAL?

Before a replica can keep up with new changes from the primary, it needs a copy of the data that's already on the primary. A new physical replica typically starts from a <u>base backup</u> of the primary, 
which is just a copy of the primary's database cluster on disk (e.g. the pages that store the tables and indexes). 

From there, the replica applies WAL to bring itself up to date. As the primary generates more WAL, it streams it to the replica, which keeps applying it to stay caught up.

Now is a good time to also bring up that when I say that the primary "streams its WAL" to the replica, I am describing **streaming replication**. There is also ...

If we look again at the WAL records above, we'll see something called the LSN.

<dl>
<dt>Log Sequence Number (LSN)</dt>
<dd>the byte offset of a WAL record in the WAL</dd>
</dl>

In Postgres, the LSN is a single 64-bit integer represented by 32-bit integer / 32-bit integer (I know it's weird). So in the example above, the first INSERT record 
is at byte offset 0x1000100 in the WAL and the second COMMIT record is at a byte offset 0x1000180. You can see how this can be important in database replication.
By comparing the primary's current LSN with the LSN the replica has replayed up to, you can tell how far behind the replica is (**replica lag** but we will get into more of that later)

In Postgres streaming replication, the replica first connects to the primary and sends its latest LSN. This tells the primary how far behind the replica is.

1. If the LSN of the primary and the replica already match, then perfect! The primary doesn't need to send anything to the replica at that moment. 
2. If the LSN of the replica is behind the primary's, then the primary will send all the WAL data from the replica's LSN onwards. The replica will receive all this WAL data and write that data directly into its own WAL

As the primary continues to receives writes from the clients and append to its WAL, it will keep sending its WAL records to the replica. The replica will also
periodically report its LSN to the primary.

When the replica receives the WAL records from the primary, it has to do two things:
1. Put that WAL data into its OWN WAL - for durability purposes
2. Replay that WAL data, which essentially means applying the changes described by the WAL records to the replica's own database pages

This WAL replay is the same mechanism that is used when a database crashes and you need to bring your database up-to-speed.

[[REPLICATION_ANIMATION]]

### When is a write considered successful? 

In the animation above, I intentionally left out a crucial detail about when can we tell the client that their transaction has been committed.
The answer to that depends on whether you are using synchronous replication or asynchronous replication.

<div class="blog-definitions">
<dl>
<dt>Synchronous replication</dt>
<dd>The primary waits for the required replicas to acknowledge the transaction before reporting success to the client</dd>
</dl>
<dl>
<dt>Asynchronous replication</dt>
<dd>The primary reports a successful commit without waiting for replica acknowledgements. Replicas catch up independently</dd>
</dl>
</div>

Which one you should use depends on what you care about. 
With async replication, the primary can report a successful COMMIT without waiting for the replica. That keeps the replica off the commit path, but if the primary fails before 
the replica receives the commit record, then you could have lost data. 

With sync replication, the primary waits for the required replica(s) to acknowledge the commit before telling the client it has succeeded. It's important to note here that there are different <u>levels</u> of sync replication.

In Postgres, you can choose what the standby has to do before it sends that acknowledgment back to the primary.
The [\`synchronous_commit\`](https://postgresqlco.nf/doc/en/param/synchronous_commit/) setting gives you three options when synchronous standbys are configured:
- \`remote_write\` - waits for the standby to write the commit record to its own WAL. At this point, the operating system can still have the write buffered in memory ([link](https://biriukov.dev/docs/page-cache/2-essential-page-cache-theory/) if you want to understand this better)
- \`on\` - this is the default in Postgres. The primary waits for the standby to save the commit record durably in its own WAL on disk. The standby can recover the transaction
from its WAL, but a query there can still miss the new row until replay catches up
- \`remote_apply\` - waits for the replicas to replay the commit record. By the time the primary tells the client that COMMIT succeeded, a new query on that standby can see the row

[[SYNCHRONOUS_COMMIT_ANIMATION]]

### What if the primary fails?

In this article, I mainly covered <u>single-leader replication</u>, but there are other models where there isn't just a single primary.

<div class="blog-definitions blog-definitions-three">
<dl>
<dt>Single-leader replication</dt>
<dd>A single primary takes care of all the writes and sends them to the replicas</dd>
</dl>
<dl>
<dt>Multi-leader replication</dt>
<dd>Multiple nodes can independently accept writes and replicate their changes to each other</dd>
</dl>
<dl>
<dt>Leaderless replication</dt>
<dd>There is no designated primary. Clients can send writes to multiple replicas, often using quorums to determine whether reads and writes are successful</dd>
</dl>
</div>

In single-leader replication, if the primary crashes, then we need to promote one of the replicas as the new primary, this is called a <u>failover</u>.

At a high level, failover usually involves these three steps:
1. Detect that the primary has gone down
2. Choose a replica to promote as the new primary
3. Redirect clients/replicas to the new primary

Each step, as you can imagine, comes with its own challenges. For example, how do you tell that the primary has actually gone down?
One common technique is to use heartbeats. If the primary hasn't responded in some amount of time, then we say it has failed and start the failover process.

For the second step, how do you know which replica to promote? Well, ideally you want to promote the replica with the highest LSN because that's the replica that has the most recent data.
However, with asynchronous replication, even the replica with the highest LSN could be missing data that was on the primary. This means that transactions that were successfully committed
and acknowledged to the client could be lost during failover.

Another interesting problem is determining whether the primary has actually failed.
What if the primary is still running but we temporarily lost network connectivity to it?
If we promote a replica while the old primary is still accepting writes, we now have two primaries that can independently accept writes.
Their data can start to diverge, and this situation is known as <u>split-brain</u> (even the name is scary).

One way to prevent split-brain this is through a mechanism called <u>fencing</u>, where we ensure that the old primary can no longer accept writes before allowing
the new primary to do so. This can involve shutting down the old primary's machine, revoking its access to shared storage, etc.

### Conclusion

Database replication clearly has a lot of layers, and there's still more to the story than what I covered, but like I mentioned earlier, I strongly beleive that if you understand
the principles behind it, then a lot of these database concepts become clear.

For example, take <u>point-in-time recovery</u> (PITR), which is a feature in Postgres and other databases where you can recover the state of the database back to what it was at some point-in-time.
The mechanism behind PITR is very similar to what we covered with replication. If you have a base backup and the WAL, you can restore the database from the base backup 
and then replay the WAL until you reach the point you want. If that sounds familiar, you already understand the basic idea behind PITR.

If you got this far, thank you, it really means a lot! If you have any feedback at all, please let me know joesluis51@gmail.com.


### Bonus 

Whenever I read articles, I like to ask myself questions about the content to see if I actually understood what I read (active recall ftw).

So I assembled some questions [here](/blog/how-database-replication-works/quiz) that you can try if it interests you!

### References
- https://www.interdb.jp/pg/pgsql11/index.html
- https://manual.christiansoftware.org/en/topics/database-replication-failover/
- https://transactional.blog/blog/2024-data-replication-design-spectrum
- https://biriukov.dev/docs/page-cache/2-essential-page-cache-theory/

`,
};

export default post;
