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

![Nerd sniping comic](/images/nerd-sniping.png)

There are many many flavors of database replication, but if you understand how database replication actually works, then the tradeoffs become clear.

In database replication, the primary communicates with the replica(s) in order to keep their data up-to-date. Since the primary and replica(s) are usually on different
 servers entirely, they have to communicate over the network (typically using TCP). In Postgres, the primary will listen on port \`5432\` and all replicas will create its own 
TCP connection to that port. If the primary is sending data to its replicas over the network, then there can certainly be cases where the replicas fail to receive messages from the primary
causing it to fall behind. This is called **replica lag**.

### What does the primary send to its replica(s)

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
# This is a simplified illustration, not the actual binary WAL format

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
If you're interested in trying this out on your own, you can try pg_waldump!

There are two WAL records here: one for the actual inserted data and the other for the COMMIT.
You don't need to understand everything in this WAL record, but you can see that the first WAL record contains
the timestamp already computed on the primary, so when the replica receives these two WAL records, it will just use
the timestamp data it received rather than computing its own.

Database replication heavily relies on the WAL, so it is important to understand.

### How does the replica receive and apply the WAL?

[[REPLICATION_ANIMATION]]

### replication lag

We mentioned earlier that the primary communicates with the replica(s) in order to keep them up-to-date. Since the WAL records are sent to the replica(s) over the network,
 there are scenarios where the replica falls behind. THis is called replica lag. If you're using synchronous replication, then you won't have replica lag since the replica needs to ack
any transaction before the primary commits it. Replica lag happens with async replication

### What are the different ways to replicate data

### Logical vs. physical replication

### Synchronous vs Asynchronous replication

### Sharding vs replicating

### IDEAS 

- add a quiz at the end TO MAKE SURE READER ACTUALLY UNDERSTANDS (holy cook)
- add nice animations embedded in the actual site. like there is no bacgkround for the thing
- how much of log does primaru sennd? how doesnit know??


### References:
- https://www.interdb.jp/pg/pgsql11/index.html

`,
};

export default post;
