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

Why did they name them all Aurora? Why did they create DSQL when they already had limitless? Do they just love Postgres? I read the Aurora DSQL and Aurora Limitless research papers to hopefully answer these questions. Also, I'll be focusing more on the differences in their architecture and design rather than on how application developers use them. I am [databasemaxxing](https://pthorpe92.dev/databasemaxxing/) after all.

### Aurora MySQL/PostgreSQL
This is the classic Aurora offering and the first in the Aurora series, GA'ing in 2015. If you're familiar with AlloyDB, HorizonDB, or Neon, then you can think of it as something similar to those systems. The basic idea is that your Postgres/MySQL database doesn't live on a single machine. Aurora disaggregates compute and storage (basically Query Processor and Storage engine are separated). There is a single writer compute instance and you can add multiple read replicas, which are all backed by the same distributed storage layer.

[[AURORA_ARCHITECTURE_ANIMATION]]

This animation shows the flow for both read and write paths. Writes pass through a dedicated writer instance and reads can pass through any of the read instances (these can be scaled up/out). The writer receives SQL queries from clients and generates redo/WAL records for the changes. Once the transaction commits, Aurora sends these redo/WAL records to its shared distributed storage layer (not S3) and waits for a quorum (4/6 storage copies ack the write). The storage layer of this system is replicated across three different AZs with six copies of the data across the AZs.

The single writer is the biggest limitation of classic Aurora. The single writer bottlenecks the write throughput of this system. You have the option to vertically scale your writer, but at some point, the vertical scaling won't be able to handle all your writes. At which point, you want to horizontally scale your writer. That leads us to Aurora Limitless.

### Aurora Limitless
The folks at Amazon noticed the bottlenecks of classic Aurora and wanted to tackle them in a new system called *Aurora Limitless* (which we find out has its own limits). Aurora Limitless builds on top of a lot of the same ideas that classic Aurora had. Unlike classic Aurora, Aurora Limitless supports any number of writers, which they call **routers**, and the data in the system is all sharded. Each router handles client requests and forwards those requests to a **shard**, which is essentially just a Postgres instance, that fetches or modifies rows in the underlying data in Aurora distributed storage. Each shard is responsible for a subset of the data (they do hash-based partitioning)

The last component is a **control plane** that manages the life cycle of the shards, monitors the health of all the routers/shards, handles auto-scaling, etc. 

[[AURORA_LIMITLESS_ANIMATION]]

### Aurora DSQL
The final evolution of Aurora is Aurora DSQL.


built on s3, serverless, sharded differently.

[[AURORA_DSQL_ANIMATION]]

`
};

export default post;
