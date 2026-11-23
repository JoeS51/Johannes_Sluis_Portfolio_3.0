const post = {
  slug: 'how-database-replication-works',
  frontmatter: {
    title: 'How Database Replication Works',
    subtitle: '(mostly in postgres)',
    description: '',
    date: '2026-11-20',
    tags: [],
    readingTime: 10,
    cover: null,
  },
  content: `
Database replication seems fairly simple. The basic idea is to copy data from one database server to another, typically for fault tolerance and read scalability. 
But there's a lot to consider: sync vs. async replication, logical vs. physical replication, single-leader vs. multi-leader, replication lag, failovers, fencing, etc.

I ran into a lot of these questions even while building the simplest possible [Postgres failover controller in Rust](https://github.com/JoeS51/rust-systems-examples/tree/main/crates/pg-failover), which inevitably nerd-sniped me...

![Nerd sniping comic with a database replication question on the sign](/images/nerd-sniping-replication.png)

There are many flavors of database replication, so I won't be able to cover all the details, but if you understand how database replication actually works, then the tradeoffs become pretty clear!

### What does the primary send to its replicas?

In database replication, the primary has to communicate with the replicas in order to keep them up-to-date. Since the primary and replicas are usually on different
 servers entirely, they have to communicate over the network. In Postgres, the primary listens on port \`5432\` and the replicas will create their own 
TCP connection to that port to establish communication. Once a replica connects to this port, what does the primary send?

One approach would be to send the original SQL query and have the replica run it too. But consider this example:

\`\`\`sql
INSERT INTO table1 (name, created_at) VALUES ('joe', NOW());
\`\`\`

If the primary and replica both recieve and execute this query separately, then they will each evaluate \`NOW()\` for themselves.
The primary might store 12:00:00 in created_at, while the replica stores 12:00:01. This violates the contract of database replication. The whole point is to have the same data on the primary and replicas!

Instead of sending the exact SQL queries from the primary to replicas, we need to send the exact data we want to write on the replica and where to write it to in the database.
Thankfully, we have the perfect thing for that: the write-ahead log (WAL).
The WAL keeps track of changes as they're made to the database. You can think of the WAL as one long append-only file where the database records each change to the database.
The WAL is comprised of something called <u>WAL records</u>.

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
If you're interested in trying this out on your own, you can try using \`pg_waldump\`!

There are two WAL records here: one for the actual inserted data and the other for the COMMIT.
You don't need to understand everything in this WAL record, but you can see that the first WAL record contains
the timestamp already computed on the primary, so if we can just send the replicas these WAL records, we avoid our earlier problem entirely.
And that's what physical replication does! In physical replication, the primary just sends the raw WAL data to its replicas.

The alternative to physical replication is logical replication. In logical replication, Postgres reads the WAL to determine which rows were inserted, updated, or deleted.
It then sends those changes to the replicas. In our example, that means sending the new row’s values, including the timestamp the primary already computed.

From here on out, we will be focusing on physical replication, but the core idea remains the same.


### How does the replica receive and apply the WAL?

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
2. Replay that WAL data, which essentially means get the changes that the WAL data is describing into your buffer pool (or shared buffers in Postgres) because once you get it into the buffer pool
then the replica has the up-to-date data

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
the replica receives the commit record, then you have lost data. 

With sync replication, the primary waits for the required replica(s) to acknowledge the commit before telling the client it has succeeded. It's important to note here that there are different <u>levels</u> of sync replication.

In Postgres, you can choose what the standby has to do before it sends that acknowledgment back to the primary.
The [\`synchronous_commit\`](https://postgresqlco.nf/doc/en/param/synchronous_commit/) setting gives you three options when synchronous standbys are configured:
- \`remote_write\` - waits for the standby to write the commit record to its own WAL. At this point, the operating system can still have the write buffered in memory
- \`on\` - this is the default in Postgres. The primary waits for the standby to save the commit record durably in its own WAL on disk. The standby can recover the transaction
from its WAL, but a query there can still miss the new row until replay catches up
- \`remote_apply\` - waits for the replicas to replay the commit record. By the time the primary tells the client that COMMIT succeeded, a new query on that standby can see the row

[[SYNCHRONOUS_COMMIT_ANIMATION]]

### Failovers


### Logical vs. physical replication

### Sharding vs replicating

### IDEAS 

- add a quiz at the end TO MAKE SURE READER ACTUALLY UNDERSTANDS (holy cook)

### References:
- https://www.interdb.jp/pg/pgsql11/index.html

`,
};

export default post;
