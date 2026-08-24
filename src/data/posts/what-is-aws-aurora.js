const post = {
  slug: 'what-is-aws-aurora',
  frontmatter: {
    title: 'What Is AWS Aurora and Why Are There So Many?',
    description: '',
    date: '2026-08-22',
    tags: ['AWS', 'Databases'],
    cover: null
  },
  content: `

### Intro

Among all the hyperscalers, AWS has the most database products. There's DynamoDB, RDS, ElastiCache, DocumentDB, etc and the list goes on. Among them, there's a popular one named Amazon Aurora. The confusing thing is that there are multiple database offerings that have the name Aurora in it. 

In fact, you can argue there are four (or three if you count Aurora MySQL/PostgreSQL as the same) offerings under the Amazon Aurora umbrella:

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
The Amazon folks noticed the bottlenecks of classic Aurora and wanted to tackle it with a new system called Aurora Limitless (which we find out has its own limits).

[[AURORA_LIMITLESS_ANIMATION]]

### Aurora DSQL
The final evolution of Aurora is Aurora DSQL.


built on s3, serverless, sharded differently.

`
};

export default post;
