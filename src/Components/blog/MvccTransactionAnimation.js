import React, { useState } from 'react';
import { motion } from 'framer-motion';

const scoreQuery = 'SELECT team_name, goals_for, goals_against\nFROM world_cup_score\nWHERE match_id = 26;';

const scoreOneOne = ` team_name   | goals_for | goals_against\n-------------+-----------+---------------\n Argentina   |         1 |             1\n Netherlands |         1 |             1\n(2 rows)`;

const scoreTwoOne = ` team_name   | goals_for | goals_against\n-------------+-----------+---------------\n Argentina   |         2 |             1\n Netherlands |         1 |             2\n(2 rows)`;

const shell = (text) => ({ kind: 'shell', text });
const sql = (text) => ({ kind: 'sql', text });
const output = (text) => ({ kind: 'output', text });
const comment = (text) => ({ kind: 'comment', text });
const blocked = (text) => ({ kind: 'blocked', text });

const steps = [
  {
    label: 'Step 1',
    activePane: 'A',
    takeaway: 'No MVCC yet: imagine the database has only one version of each score row.',
    left: [shell('$ psql -d worldcup'), sql(`worldcup=# ${scoreQuery}`), output(scoreOneOne)],
    right: [shell('$ psql -d worldcup'), comment('worldcup=# -- Transaction B is ready')],
  },
  {
    label: 'Step 2',
    activePane: 'A',
    takeaway: 'Transaction A starts a write transaction and will need exclusive access to the score rows.',
    left: [shell('$ psql -d worldcup'), sql('worldcup=# BEGIN;'), output('BEGIN')],
    right: [shell('$ psql -d worldcup'), comment('worldcup=# -- still idle')],
  },
  {
    label: 'Step 3',
    activePane: 'A',
    takeaway: 'Transaction A changes the only row versions. Until commit, those rows are not safe for readers.',
    left: [
      shell('$ psql -d worldcup'),
      sql('worldcup=# BEGIN;'),
      sql("worldcup=*# UPDATE world_cup_score\nSET goals_for = goals_for + 1\nWHERE match_id = 26\n  AND team_name = 'Argentina';"),
      output('UPDATE 1'),
      sql("worldcup=*# UPDATE world_cup_score\nSET goals_against = goals_against + 1\nWHERE match_id = 26\n  AND team_name = 'Netherlands';"),
      output('UPDATE 1'),
    ],
    right: [shell('$ psql -d worldcup'), comment('worldcup=# -- Transaction A has not committed')],
  },
  {
    label: 'Step 4',
    activePane: 'B',
    takeaway: 'Reader blocked by writer: Transaction B cannot read the only row versions while A is uncommitted.',
    left: [
      shell('$ psql -d worldcup'),
      sql('worldcup=# BEGIN;'),
      sql("worldcup=*# UPDATE world_cup_score\nSET goals_for = goals_for + 1\nWHERE match_id = 26\n  AND team_name = 'Argentina';"),
      output('UPDATE 1'),
      sql("worldcup=*# UPDATE world_cup_score\nSET goals_against = goals_against + 1\nWHERE match_id = 26\n  AND team_name = 'Netherlands';"),
      output('UPDATE 1'),
      comment('worldcup=*# -- transaction still open'),
    ],
    right: [
      shell('$ psql -d worldcup'),
      sql(`worldcup=# ${scoreQuery}`),
      blocked('waiting... Transaction A holds the score rows'),
      comment('-- with only one row version, B must wait for A to commit or roll back'),
    ],
  },
  {
    label: 'Step 5',
    activePane: 'B',
    takeaway: 'After A commits, B is unblocked and can finally read the new committed score.',
    left: [
      shell('$ psql -d worldcup'),
      sql('worldcup=# BEGIN;'),
      sql("worldcup=*# UPDATE world_cup_score\nSET goals_for = goals_for + 1\nWHERE match_id = 26\n  AND team_name = 'Argentina';"),
      output('UPDATE 1'),
      sql("worldcup=*# UPDATE world_cup_score\nSET goals_against = goals_against + 1\nWHERE match_id = 26\n  AND team_name = 'Netherlands';"),
      output('UPDATE 1'),
      sql('worldcup=*# COMMIT;'),
      output('COMMIT'),
    ],
    right: [shell('$ psql -d worldcup'), sql(`worldcup=# ${scoreQuery}`), output(scoreTwoOne)],
  },
];

const ZellijPane = ({ title, active, blocks }) => (
  <section className={`mvcc-zellij-pane${active ? ' is-active' : ''}`}>
    <div className="mvcc-zellij-pane-title">
      <span>{title}</span>
    </div>
    <pre className="mvcc-sql-window">
      {blocks.map((block, index) => (
        <motion.code
          key={`${title}-${index}-${block.text}`}
          className={`mvcc-terminal-${block.kind}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.14, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {block.text}
        </motion.code>
      ))}
    </pre>
  </section>
);

const MvccTransactionAnimation = () => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = steps[activeStepIndex];

  return (
    <figure className="mvcc-demo mvcc-demo-initial" aria-label="MVCC transaction steps in Zellij and psql">
      <div className="mvcc-psql-terminal">
        <div className="mvcc-zellij-tabbar">
          <span className="mvcc-zellij-title">Zellij (mvcc-world-cup)</span>
          {steps.map((step, index) => (
            <button
              key={step.label}
              type="button"
              className={`mvcc-zellij-tab${index === activeStepIndex ? ' is-active' : ''}`}
              aria-pressed={index === activeStepIndex}
              onClick={() => setActiveStepIndex(index)}
            >
              {step.label}
            </button>
          ))}
          <span className="mvcc-zellij-mode">Alt &lt;[]&gt; BASE</span>
        </div>

        <div className="mvcc-zellij-panes">
          <ZellijPane title="Transaction A" active={activeStep.activePane === 'A'} blocks={activeStep.left} />
          <ZellijPane title="Transaction B" active={activeStep.activePane === 'B'} blocks={activeStep.right} />
        </div>

        <motion.div
          key={activeStep.takeaway}
          className="mvcc-zellij-status"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {activeStep.takeaway}
        </motion.div>

        <div className="mvcc-zellij-footer" aria-hidden="true">
          <span>Ctrl +</span>
          <span>&lt;<b>g</b>&gt; LOCK</span>
        </div>
      </div>
    </figure>
  );
};

export default MvccTransactionAnimation;
