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
Looking at the image above, you can see the xmin of both tuples is 100. That means a transaction with txid 100 inserted both of those tuples. The xmax for both of these tuples is 0 which means these tuples have not been deleted by any transaction yet.
For the purposes of simplicity, let's ignore t_cid and t_ctid since they aren't central to MVCC.

You might already be seeing how these fields help with MVCC, but let's continue with an example. We will use transaction IDs 100 and 101 to keep the tuple versions easy to follow.

#### Setup

First, let's assume there are two accounts with $100 each, as shown in the image above. Transaction 100 created both tuples and has already committed:

~~~text
 xmin | xmax | name  | balance
------+------+-------+--------
  100 |    0 | Alice |     100
  100 |    0 | Bob   |     100
~~~

This is the state of the table before our example sessions begin. The **xmin** value is 100 for both tuples because transaction 100 created them. Their **xmax** is 0 because no transaction has deleted or updated them yet. You can run all the following commands in psql to see everything for yourself!

#### Session A: long-running reader

Session A uses **REPEATABLE READ** (INCLUDE LINK HERE), which reuses the snapshot acquired by its first query for the rest of the transaction.

~~~sql
BEGIN ISOLATION LEVEL REPEATABLE READ;

SELECT xmin, name, balance FROM accounts;

 xmin | name  | balance
------+-------+--------
  100 | Alice |     100
  100 | Bob   |     100
~~~

Leave Session A open. Its ordinary **SELECT** does not hold row-level locks on Alice or Bob; it only retains the snapshot needed to decide which tuple versions are visible.

#### Session B: writer

While Session A remains open, Session B transfers $50 from Alice to Bob and commits:

~~~sql
BEGIN; -- txid 101

UPDATE accounts
SET balance = balance - 50
WHERE name = 'Alice';

UPDATE accounts
SET balance = balance + 50
WHERE name = 'Bob';

COMMIT;
~~~

Session B does not have to wait for Session A because Session A holds no conflicting row lock. Postgres does not overwrite the Alice and Bob tuples in place. It creates new tuples with **xmin = 101** and sets **xmax = 101** on the old tuples.

![Postgres heap page after account transfer update](/images/postgres-mvcc-account-update.svg)

After Session B commits, the old tuples are no longer visible to new snapshots. However, Postgres cannot remove them yet because Session A's older snapshot can still see them.

#### Session C: new reader

Session C queries the table after Session B commits:

~~~sql
SELECT xmin, name, balance FROM accounts;

 xmin | name  | balance
------+-------+--------
  101 | Alice |      50
  101 | Bob   |     150
~~~

Session C receives a new snapshot. Transaction 101 had committed before that snapshot was taken, so the new tuples are visible.

#### Back in Session A

Session A runs the same query again after Session B commits:

~~~sql
SELECT xmin, name, balance FROM accounts;

 xmin | name  | balance
------+-------+--------
  100 | Alice |     100
  100 | Bob   |     100

COMMIT;
~~~

Session A still sees the old balances because **REPEATABLE READ** continues using its original snapshot. It sees neither dirty data nor a mixture of old and new values; it sees the same self-consistent version of the rows for the entire transaction. Once Session A commits, a new transaction will acquire a new snapshot and see the tuples created by transaction 101.

With strict two-phase locking instead of MVCC, Session A's reads would take shared row locks and Session B's updates would need conflicting exclusive locks. Session B would then wait for Session A to commit. MVCC avoids that conflict for ordinary reads by preserving the old tuple versions rather than overwriting them. Writers can still block other writers that update the same rows.

If you are curious, you can check out the actual implementation in Postgres: [htup_details.h](https://github.com/postgres/postgres/blob/ee943004466418595363d567f18c053bae407792/src/include/access/htup_details.h)

(NOTE ABOUT FREEZING)

### Snapshots
The snapshot is what turns the transaction IDs in each tuple into a consistent view of the database. It records an upper transaction ID boundary along with the transactions that were still active when the snapshot was acquired. A transaction ID being lower than another transaction's ID is not enough by itself to make its changes visible; it must also have committed before the snapshot was taken.

In the example above, transaction 101 started after Session A acquired its snapshot. The new tuples with **xmin = 101** are therefore too new for Session A, while the old tuples' **xmax = 101** is also too new to hide them from that snapshot. Session C's later snapshot sees the opposite: transaction 101 is committed, so its new tuples are visible and the old versions are hidden.

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
