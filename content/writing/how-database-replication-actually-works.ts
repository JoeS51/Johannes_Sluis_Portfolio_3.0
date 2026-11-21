const post = {
  slug: 'how-database-replication-actually-works',
  frontmatter: {
    title: 'How Database Replication Works',
    subtitle: '(mostly in postgres)',
    description: '',
    date: '2026-11-20',
    tags: [],
    readingTime: 10,
    cover: null,
  },
  content: `
Database replication seems fairly simple. The basic idea is to copy data from one database server to another, typically for fault tolerance and read scalability. But there's a lot to consider, like sync vs. async replication, logical vs. physical replication, replication lag, failovers, and fencing.

I ran into a lot of these questions even while building the simplest possible [Postgres failover controller in Rust](https://github.com/JoeS51/rust-systems-examples/tree/main/crates/pg-failover), which inevitably nerd sniped me...

![Nerd sniping comic](/images/nerd-sniping.png)
`,
};

export default post;
