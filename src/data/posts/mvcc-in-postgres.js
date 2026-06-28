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

### Concurrency Control
If one transaction has modified a row but hasn't committed yet, should other transactions see that row? Usually, the answer is no. 

Reading another transaction's uncommitted change is called a **dirty read**. The issue with dirty reads is that a transaction might read data from a transaction that eventually rolls back, meaning that data never officially existed.

Most databases prevent concurrency anomalies, like dirty reads, by using one of these three concurrency control mechanisms:
1. MVCC
2. Strict two-phase locking (S2PL) - Writers take exclusive locks on rows they modify, and readers may need shared locks before reading those rows 
3. Optimistic concurrency control (OCC) 

There are tradeoffs for each of these options, but the main argument for MVCC is that it is faster compared to S2PL. We can see why with this example below where a database DOESN'T use MVCC:

[[MVCC_TRANSACTION_ANIMATION]]

There's a clear issue in the example above: readers are blocked by writers. That means a long-running write transaction can block all read operations. The vice versa is true too where long-running read operations on a row can block writers.
MVCC solves this problem.

### MVCC in Postgres
Each transaction in postgres is associated with a 32-bit integer for its transaction ID (txid). Each row in Postgres is physically stored as a heap tuple, and every tuple carries some hidden metadata fields that make MVCC work. 
Each tuple contains:
- t_xmin - the txid of the transaction that created this tuple
- t_xmax - the txid of the transaction that deleted this tuple
- t_cid - a counter within a transaction that tracks which SQL command created or deleted a tuple
- t_ctid - a physical pointer to the current version of a tuple. It stores the page number and offset of where the tuple lives

![Postgres heap page and tuple metadata](/images/postgres-mvcc-tuple-header.svg)
Looking at the image above, you can see the xmin of both tuples is 99. That means a transaction with txid 99 inserted both of those tuples. The xmax for both of these tuples is 0 which means these tuples have not been deleted by any transaction yet.
For the purposes of simplicity, let's ignore t_cid and t_ctid since they aren't central to MVCC.

You might already be seeing how these fields help with MVCC, but we will continue with an example. Let's say Alice sends Bob $50:

~~~sql
BEGIN; -- txid 100

UPDATE accounts
SET balance = balance - 50
WHERE name = 'Alice';

UPDATE accounts
SET balance = balance + 50
WHERE name = 'Bob';

COMMIT;
~~~

![Postgres heap page after account transfer update](/images/postgres-mvcc-account-update.svg)



If you are curious, you can check out the actual implementation in Postgres: [htup_details.h](https://github.com/postgres/postgres/blob/ee943004466418595363d567f18c053bae407792/src/include/access/htup_details.h)

(NOTE ABOUT FREEZING)

### Snapshots

### VACUUM
Postgres needs to eventually garbage collect all the extra tuples that were deleted. This garbage collection process is called **VACUUMing** in Postgres. 
The VACUUM process is very involved and complex, so I'll only be going over it at a high level. If you're interested in learning more, check out the references at the bottom. 

### HOT Updates (?)

### References
- [The internals of PostgreSQL by Hironobu Suzuki](https://www.interdb.jp/pg/pgsql05/index.html)
- [PostgreSQL 14 internals by Egor Rogov](https://postgrespro.com/community/books/internals)

`,
};

export default post;
