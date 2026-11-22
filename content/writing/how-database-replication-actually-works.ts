const post = {
  slug: 'how-database-replication-actually-works',
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

There are many many flavors of database replication, but if you understand how database replication actually works, then the tradeoffs become clear.


### What does the primary send to its replica(s)

In database replication, the primary communicates with the replica(s) in order to keep their data up-to-date. Since the primary and replica(s) are usually on different
 servers entirely, they have to communicate over the network (typically using TCP). In Postgres, the primary will listen on port \`5432\` and all replicas will create its own 
TCP connection to that port. 

When the primary receives a SQL query from the client, it could just give that same SQL query to the secondary. But then what if the SQL query is something like this:

\`\`\`sql
INSERT INTO table1 (name, created_at) VALUES ('joe', NOW());
\`\`\`

If the primary and replica recieve and execute this query separately, then the inserted row will be different. 

Instead of sending SQL queries from the primary to replica(s), we need to send the exact data we want to write on the replica and where to write it to.
Well thankfully for us, that's exactly what the WAL is for!
The WAL is responsible for keeping track of changes as they're made to the database.
The WAL is comprised of WAL records which describe ....
A separate commit record marks a successful commit.
For example, the WAL records for the above SQL query might look like this:

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

> The WAL in Postgres won't look like this exactly since the WAL is also all binary, but this examples helps paint the picture. 
If you're interested in trying this out on your own, you can try using \`pg_waldump\`!

There are two WAL records here: one for the actual inserted data and the other for the COMMIT.
You don't need to understand everything in this WAL record, but you can see that the first WAL record contains
the timestamp already computed on the primary, so when the replica receives these two WAL records, it will just use
the timestamp data it received rather than computing its own.

Another important piece to look at here is the LSN.

<dl>
<dt>Log Sequence Number (LSN)</dt>
<dd>the byte offset of a WAL record in the WAL</dd>
</dl>

In Postgres, the LSN is a single 64-bit integer represented by 32-bit integer / 32-bit integer (I know it's weird). So in the example above, the first INSERT record 
is at byte offset 0x1000100 in the WAL and the second COMMIT record is at a byte offset 0x1000180. You can see how this can be important in database replication.
By comparing the primary's current LSN with the LSN the replica has replayed up to, you can tell how far behind the replica is (**replica lag** but we will get into more of that later)

### How does the replica receive and apply the WAL?

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

> In Postgres, there's a setting called \`synchronous_commit\` that determines what the primary waits for before reporting a successful commit. When synchronous replicas are configured, it can wait for them to write, flush, or replay the WAL.
> So even within synchronous replication, there are more layers...

Which one you should use depends on what you care about. Do you need replicas to server the most up-to-date data? Then use sync replication.
Do you care about commit latency? Use async replication. 

### replication lag

We mentioned earlier that the primary communicates with the replica(s) in order to keep them up-to-date. Since the WAL records are sent to the replica(s) over the network,
 there are scenarios where the replica falls behind. This is called replica lag. If you're using synchronous replication, then you won't have replica lag since the replica needs to ack
any transaction before the primary commits it. Replica lag happens with async replication

### What are the different ways to replicate data

### Logical vs. physical replication

### Synchronous vs Asynchronous replication

### Sharding vs replicating

### IDEAS 

- add a quiz at the end TO MAKE SURE READER ACTUALLY UNDERSTANDS (holy cook)
- add nice animations embedded in the actual site. like there is no bacgkround for the thing

### TO MENTION
- how much of log does primaru sennd? how doesnit know??
- streaming replication is BUILT in to postgres. some databases dont have this machinery built in
- specify differences in replica lag



### References:
- https://www.interdb.jp/pg/pgsql11/index.html

`,
};

export default post;
