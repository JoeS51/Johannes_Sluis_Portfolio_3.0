const post = {
  slug: 'what-is-amazon-aurora',
  frontmatter: {
    title: 'What Is Amazon Aurora and Why Are There So Many?',
    description: '',
    date: '2026-08-22',
    readingTime: 10,
    tags: ['AWS', 'Databases'],
    cover: null
  },
  content: `

### Intro

Out of all the hyperscalers, AWS has the most database products. There's DynamoDB, RDS, ElastiCache, DocumentDB, Neptune, MemoryDB and the list goes on. One of the more popular offerings is Amazon Aurora. The confusing part is that there are multiple database offerings with Aurora in the name.

In fact, there are four (or you could argue three) offerings under the Amazon Aurora umbrella:

- [Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMySQL.html)
- [Aurora PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraPostgreSQL.html)
- [Aurora PostgreSQL Limitless Database](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/limitless.html)
- [Aurora DSQL](https://docs.aws.amazon.com/aurora-dsql/latest/userguide/what-is-aurora-dsql.html)

That's a lot! Why did they name them all Aurora? Why did they create DSQL when they already had limitless? Do they just love Postgres? I read the Aurora DSQL and Aurora Limitless research papers to hopefully answer these questions. Also, I'll be focusing more on the differences in their architecture and design rather than on how application developers use them. I am [databasemaxxing](https://pthorpe92.dev/databasemaxxing/) after all.

### Aurora MySQL/PostgreSQL
This is the classic Aurora offering and the first in the Aurora series, GA'ing in 2015. If you're familiar with AlloyDB, HorizonDB, or Neon, then you can think of it as something similar to those systems. The basic idea is that your Postgres/MySQL database doesn't live on a single machine. Aurora disaggregates compute and storage (basically Query Processor and Storage engine are separated). There is a single writer compute instance and you can add multiple read replicas, which are all backed by the same distributed storage layer.

[[AURORA_ARCHITECTURE_ANIMATION]]

This animation shows the flow for both read and write paths. Writes pass through a dedicated writer instance and reads can pass through any of the read instances (these can be scaled up/out). The writer receives SQL queries from clients and generates redo/WAL records for the changes. Once the transaction commits, Aurora sends these redo/WAL records to its shared distributed storage layer (not S3) and waits for a quorum (4/6 storage copies ack the write). The storage layer of this system is replicated across three different AZs with six copies of the data across the AZs.

The single writer is the biggest limitation of classic Aurora. The single writer bottlenecks the write throughput of this system. You have the option to vertically scale your writer, but at some point, the vertical scaling won't be able to handle all your writes. At which point, you want to horizontally scale your writer. That leads us to Aurora Limitless.

### Aurora Limitless
The folks at Amazon noticed the bottlenecks of classic Aurora and wanted to tackle them in a new system called *Aurora Limitless* (which we find out has its own limits). Aurora Limitless builds on top of a lot of the same ideas that classic Aurora had. Instead of having a single writer responsible for the whole DB, Aurora Limitless introduces **routers** and **shards**. Routers accept SQL queries from clients, plan and coordinate queries and forward requests to the relevant shards. Each shard is a Postgres compute instance responsible for a subset of the data. Aurora limitless uses hash-based partitioning across these shards and the underlying data is still persisted in Aurora's distributed storage.

If a query touches only one shard, then the router can send the work directly there. Otherwise, the router uses 2PC to coordinate work across all the shards that a transaction touches. The 2PC protocol to coordinate a commit across multiple shards is super interesting, but I won't dive into that here. If you're curious look at page 180 in the [Aurora Limitless paper](https://dl.acm.org/doi/epdf/10.1145/3788853.3803089).

The last component is a **control plane** that manages the life cycle of the shards, monitors the health of all the routers/shards, handles auto-scaling, etc. 

[[AURORA_LIMITLESS_ANIMATION]]

In this animation, the client issues a read query to router 3. Router 3 then uses its hash function on the dog_ids + routing metadata to understand which shard each of them belong to. The router then sends the reads to those shards, combines their results and returns the result to the client.

You might be asking, "but what if one shard gets a majority of the requests?" That's where *shard splitting* comes in. Either the customer or the control plane notices that one of the shards needs more capacity and initiates a shard split. If a shard is already overloaded, the last thing that you want to do is make it read and rewrite all of its data into a new shard. Aurora Limitless avoids that initial overhead of copying data to a new shard through Aurora's storage level CoW mechansim.

There are other issues with sharding your data such as expensive joins. Limitless addresses some of these issues through **collocation**. With collocation, you can place related tables on the same shard to make JOINs less expensive. Additionally, Limitless supports three different table types: sharded, reference, and standard tables so tables can be distributed across the shards in different ways.



### Aurora DSQL
The final evolution of Aurora is Aurora DSQL.


built on s3, serverless, sharded differently.

[[AURORA_DSQL_ANIMATION]]


### Conclusion

To finish it off, I have some personal thoughts on all of these systems. First of all, I think these are all great systems and it's obviously easy to critique each of them just reading the research apper but an immense amount of effort goes into making these databases functional and stable. I've seen some critique about DSQL but I really like tha tAmazon is taking a lead and trying to innovate in the database space. 

`
};

export default post;
