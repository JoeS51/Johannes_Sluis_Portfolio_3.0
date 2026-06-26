import React from 'react';
import { motion } from 'framer-motion';

const leftPaneBlocks = [
  '$ psql -d worldcup',
  "worldcup=# SELECT * FROM world_cup_score WHERE match_id = 26;\n match_id |  team_name  | goals\n----------+-------------+-------\n       26 | Argentina   |     1\n       26 | Netherlands |     1\n(2 rows)",
];

const rightPaneBlocks = [
  '$ psql -d worldcup',
  'worldcup=# -- second session',
];

const ZellijPane = ({ title, active, blocks }) => (
  <section className={`mvcc-zellij-pane${active ? ' is-active' : ''}`}>
    <div className="mvcc-zellij-pane-title">
      <span>{title}</span>
    </div>
    <pre className="mvcc-sql-window">
      {blocks.map((block, index) => (
        <motion.code
          key={`${title}-${index}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.14, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {block}
        </motion.code>
      ))}
    </pre>
  </section>
);

const MvccTransactionAnimation = () => {
  return (
    <figure className="mvcc-demo mvcc-demo-initial" aria-label="Initial World Cup score database in Zellij and psql">
      <div className="mvcc-psql-terminal">
        <div className="mvcc-zellij-tabbar">
          <span className="mvcc-zellij-title">Zellij (mvcc-world-cup)</span>
          <span className="mvcc-zellij-tab is-active">Tab #1</span>
          <span className="mvcc-zellij-tab">Tab #2</span>
          <span className="mvcc-zellij-tab">Tab #3</span>
          <span className="mvcc-zellij-tab">Tab #4</span>
          <span className="mvcc-zellij-tab">Tab #5</span>
          <span className="mvcc-zellij-mode">Alt &lt;[]&gt; BASE</span>
        </div>

        <div className="mvcc-zellij-panes">
          <ZellijPane title="Session A" active blocks={leftPaneBlocks} />
          <ZellijPane title="Session B" blocks={rightPaneBlocks} />
        </div>

        <div className="mvcc-zellij-footer" aria-hidden="true">
          <span>Ctrl +</span>
          <span>&lt;<b>g</b>&gt; LOCK</span>
        </div>
      </div>
    </figure>
  );
};

export default MvccTransactionAnimation;
