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
You might already know this, but AWS has a lot of database products(DynamoDB, RDS, ElastiCache, DocumentDB, etc) and among all of them, the most popular one is most likely Amazon Aurora. It becomes confusing because Aurora isn't just a single database offering, there are four different Aurora products, and each one is quite different. I read the Aurora DSQL and Aurora Limitless research papers, so I have a better understanding of the differences (and so you don't have to). I'll be focusing more on the differences in their architecture and design rather than on how application developers use them.

To start off, there are four offerings under the Amazon Aurora umbrella:

- [Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMySQL.html)
- [Aurora PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraPostgreSQL.html)
- [Aurora PostgreSQL Limitless Database](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/limitless.html)
- [Aurora DSQL](https://docs.aws.amazon.com/aurora-dsql/latest/userguide/what-is-aurora-dsql.html)
`
};

export default post;
