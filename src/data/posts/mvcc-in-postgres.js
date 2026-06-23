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
MVCC, or multi-version concurrency control, put simply is when a database maintains multiple versions of its rows.
This sounds counterintuitive because you would think that an update to some row is in-place update,
but with MVCC any update actually creates a new row with the updated value. The reason that some/most databases (Postgres, MySQL, Turso, etc.)
use some form of MVCC is to not block readers on writers and vice versa. 
It is easier to understand why this 

[[MVCC_TRANSACTION_ANIMATION]]

`,
};

export default post;
