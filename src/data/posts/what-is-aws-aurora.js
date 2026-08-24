const post = {
  slug: 'what-is-aws-aurora',
  frontmatter: {
    title: 'What is AWS Aurora and why are there so many?',
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

Note: I don't work for AWS and am not affiliated with them at all

### Aurora MySQL/PostgreSQL
This is the classic Aurora offering and the first in the Aurora series, GA'ing in 2015. If you're familiar with AlloyDB, HorizonDB, or Neon, then you can think of it as something similar to those systems. The basic idea is that your Postgres/MySQL database doesn't live on a single machine. Aurora disaggregates compute and storage (basically Query Processor and Storage engine are separated). There is a single writer compute instance and you can add multiple read replicas, which are all backed by the same distributed storage layer.



`
};

export default post;
