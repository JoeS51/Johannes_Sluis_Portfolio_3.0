const post = {
  slug: 'mvcc-in-postgres',
  frontmatter: {
    title: 'How Postgres Implements MVCC',
    description:
      'Learn about how MVCC in Postgres works',
    date: '2026-06-22',
    tags: [],
    readingTime: 20,
    cover: null,
  },
  content: `
### What is MVCC
In Postgres, whenever you UPDATE a row, you are actually creating a new row in the database rather than modifying the original row in-place. This came as a surprise to me initially
because it feels unintuitive and like wasted work. Why would you want to clog up your database with extra rows rather than updating rows in-place?
As it turns out, this isn't a bug in Postgres but an intentional feature called MVCC, or multi-version concurrency control, where a database maintains multiple versions of its rows.

It also turns out that many major OLTP databases like MySQL, Turso, etc. all use some form of MVCC. In this article, I'll only be covering how MVCC works in Postgres (ignoring some of the specifics like freezing).
To understand the broader picture, let's quickly go over isolation levels and dirty reads.

### Dirty Reads
If one transaction has modified a row but hasn't committed yet, should other transactions see that row? Usually, the answer is no. 

Reading another transaction's uncommitted change is called a **dirty read**. The issue with dirty reads is that a transaction might read data from a transaction that eventually rolls back, meaning that data never officially existed.

Most databases prevent dirty reads in one of two ways:
1. Writers take exclusive locks on rows they modify, and readers may need shared locks before reading those rows
2. MVCC

The first option sounds easier to implement, but it slows things down. We can see why with this example below where a database DOESN'T use MVCC:

[[MVCC_TRANSACTION_ANIMATION]]
`,
};

export default post;
