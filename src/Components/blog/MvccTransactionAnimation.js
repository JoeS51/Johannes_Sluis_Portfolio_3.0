import React, { useState } from 'react';
import { motion } from 'framer-motion';

const scoreQuery = 'SELECT team_name, goals_for, goals_against\nFROM world_cup_score\nWHERE match_id = 26;';

const scoreOneOne = ` team_name   | goals_for | goals_against\n-------------+-----------+---------------\n Argentina   |         1 |             1\n Netherlands |         1 |             1\n(2 rows)`;

const scoreTwoOne = ` team_name   | goals_for | goals_against\n-------------+-----------+---------------\n Argentina   |         2 |             1\n Netherlands |         1 |             2\n(2 rows)`;

const steps = [
  {
    label: 'Step 1',
    activePane: 'A',
    left: ['$ psql -d worldcup', `worldcup=# ${scoreQuery}\n${scoreOneOne}`],
    right: ['$ psql -d worldcup', 'worldcup=# -- Session B is ready'],
  },
  {
    label: 'Step 2',
    activePane: 'A',
    left: ['$ psql -d worldcup', 'worldcup=# BEGIN;', 'BEGIN'],
    right: ['$ psql -d worldcup', 'worldcup=# -- still idle'],
  },
  {
    label: 'Step 3',
    activePane: 'A',
    left: [
      '$ psql -d worldcup',
      'worldcup=# BEGIN;',
      "worldcup=*# UPDATE world_cup_score\nSET goals_for = goals_for + 1\nWHERE match_id = 26\n  AND team_name = 'Argentina';\nUPDATE 1",
      "worldcup=*# UPDATE world_cup_score\nSET goals_against = goals_against + 1\nWHERE match_id = 26\n  AND team_name = 'Netherlands';\nUPDATE 1",
    ],
    right: ['$ psql -d worldcup', 'worldcup=# -- the writer has not committed'],
  },
  {
    label: 'Step 4',
    activePane: 'B',
    left: [
      '$ psql -d worldcup',
      'worldcup=# BEGIN;',
      "worldcup=*# UPDATE world_cup_score\nSET goals_for = goals_for + 1\nWHERE match_id = 26\n  AND team_name = 'Argentina';\nUPDATE 1",
      "worldcup=*# UPDATE world_cup_score\nSET goals_against = goals_against + 1\nWHERE match_id = 26\n  AND team_name = 'Netherlands';\nUPDATE 1",
      'worldcup=*# -- transaction still open',
    ],
    right: ['$ psql -d worldcup', `worldcup=# ${scoreQuery}\n${scoreOneOne}`],
  },
  {
    label: 'Step 5',
    activePane: 'B',
    left: [
      '$ psql -d worldcup',
      'worldcup=# BEGIN;',
      "worldcup=*# UPDATE world_cup_score\nSET goals_for = goals_for + 1\nWHERE match_id = 26\n  AND team_name = 'Argentina';\nUPDATE 1",
      "worldcup=*# UPDATE world_cup_score\nSET goals_against = goals_against + 1\nWHERE match_id = 26\n  AND team_name = 'Netherlands';\nUPDATE 1",
      'worldcup=*# COMMIT;\nCOMMIT',
    ],
    right: ['$ psql -d worldcup', `worldcup=# ${scoreQuery}\n${scoreTwoOne}`],
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
          key={`${title}-${index}-${block}`}
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
          <ZellijPane title="Session A" active={activeStep.activePane === 'A'} blocks={activeStep.left} />
          <ZellijPane title="Session B" active={activeStep.activePane === 'B'} blocks={activeStep.right} />
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
