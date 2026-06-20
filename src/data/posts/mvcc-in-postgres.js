const post = {
  slug: 'mvcc-in-postgres',
  frontmatter: {
    title: 'MVCC in Postgres',
    description:
      'Learn about how MVCC in Postgres works',
    date: '2026-06-15',
    tags: [],
    cover: null,
  },
  content: `
### Intro
Recently, I found myself becoming increasingly interested in systems and database internals in particular. Around the same time that this interest started blooming, I joined the Microsoft Systems group. As the name implies, we read a lot of technical articles on distributed systems, database systems, operating systems, etc. Most recently, the group has been going through the *PostgreSQL 14 Internals* book. The first part of the book focuses heavily on MVCC and isolation, so I felt inclined to summarize my learnings in this article.

### What is MVCC
A quick refresher on what MVCC is - MVCC stands for multi-version concurrency control, and it is when a database maintains multiple versions of one row to make sure database transactions don't step on each others' toes.
It's easy to understand the importance of MVCC by thinking about what would happen if a row DIDN'T have multiple versions. Take this example:

[[MVCC_TRANSACTION_ANIMATION]]

`,
};

export default post;
