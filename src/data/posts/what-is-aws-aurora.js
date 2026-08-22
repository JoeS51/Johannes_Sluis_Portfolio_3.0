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
AWS has many database products: DynamoDB, RDS, ElastiCache, DocumentDB, and more. Perhaps the most popular among them is Amazon Aurora, but Aurora isn't just one database. There are four different Aurora offerings, and each one is quite different. As an outsider, this can be very confusing. So let's dive into the differences, focusing more on their architecture and systems design than on how application developers use them.

Under the Amazon Aurora umbrella, there are four offerings:

- [Aurora MySQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraMySQL.html)
- [Aurora PostgreSQL](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.AuroraPostgreSQL.html)
- [Aurora PostgreSQL Limitless Database](https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/limitless.html)
- [Aurora DSQL](https://docs.aws.amazon.com/aurora-dsql/latest/userguide/what-is-aurora-dsql.html)
`
};

export default post;
