import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const scoreQuery = 'SELECT team_name, goals_for, goals_against\nFROM world_cup_score\nWHERE match_id = 26;';

const scoreOneOne = ` team_name   | goals_for | goals_against\n-------------+-----------+---------------\n Argentina   |         1 |             1\n Netherlands |         1 |             1\n(2 rows)`;

const scoreTwoOne = ` team_name   | goals_for | goals_against\n-------------+-----------+---------------\n Argentina   |         2 |             1\n Netherlands |         1 |             2\n(2 rows)`;

const shell = (text, options = {}) => ({ kind: 'shell', text, ...options });
const sql = (text, options = {}) => ({ kind: 'sql', text, ...options });
const output = (text, options = {}) => ({ kind: 'output', text, ...options });
const comment = (text, options = {}) => ({ kind: 'comment', text, ...options });
const blocked = (text, options = {}) => ({ kind: 'blocked', text, ...options });

const steps = [
  {
    label: 'Step 1',
    layout: 'single',
    activePane: 'A',
    takeaway: 'No MVCC yet: imagine the database has only one version of each score row.',
    title: 'Starting score',
    left: [shell('$ psql -d worldcup'), sql(`worldcup=# ${scoreQuery}`), output(scoreOneOne)],
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
    takeaway: 'Reader blocked by writer: Transaction B begins, tries to read, and waits on A.',
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
      sql('worldcup=# BEGIN;'),
      output('BEGIN'),
      sql(`worldcup=*# ${scoreQuery}`),
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
    right: [
      shell('$ psql -d worldcup'),
      sql('worldcup=# BEGIN;'),
      output('BEGIN'),
      sql(`worldcup=*# ${scoreQuery}`),
      blocked('waiting... Transaction A holds the score rows'),
      output(scoreTwoOne, { delay: 1.35 }),
    ],
  },
];

const TerminalLine = ({ block }) => {
  if (block.kind === 'shell') {
    return (
      <>
        <span className="mvcc-shell-prompt">$</span>
        <span className="mvcc-shell-command">{block.text.slice(1)}</span>
      </>
    );
  }

  if (block.kind === 'sql') {
    const match = block.text.match(/^(worldcup=(?:\*|)#\s)([\s\S]*)$/);

    if (match) {
      return (
        <>
          <span className="mvcc-psql-prompt">{match[1]}</span>
          <span className="mvcc-sql-command">{match[2]}</span>
        </>
      );
    }
  }

  return block.text;
};

const ZellijPane = ({ title, active, blocks, shouldAnimate, delayStart = 0 }) => (
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
          animate={shouldAnimate ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ delay: delayStart + (block.delay ?? index * 0.14), duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          <TerminalLine block={block} />
        </motion.code>
      ))}
    </pre>
  </section>
);

const MvccTransactionAnimation = () => {
  const demoRef = useRef(null);
  const hasEnteredView = useInView(demoRef, { once: true, amount: 0.3 });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = steps[activeStepIndex];

  return (
    <figure ref={demoRef} className="mvcc-demo mvcc-demo-initial" aria-label="MVCC transaction steps in Zellij and psql">
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

        <div className={`mvcc-zellij-panes${activeStep.layout === 'single' ? ' is-single-pane' : ''}`}>
          {activeStep.layout === 'single' ? (
            <ZellijPane title={activeStep.title} active blocks={activeStep.left} shouldAnimate={hasEnteredView} />
          ) : (
            <>
              <ZellijPane
                title="Transaction A"
                active={activeStep.activePane === 'A'}
                blocks={activeStep.left}
                shouldAnimate={hasEnteredView}
              />
              <ZellijPane
                title="Transaction B"
                active={activeStep.activePane === 'B'}
                blocks={activeStep.right}
                shouldAnimate={hasEnteredView}
              />
            </>
          )}
        </div>

        <motion.div
          key={activeStep.takeaway}
          className="mvcc-zellij-status"
          initial={{ opacity: 0, y: 6 }}
          animate={hasEnteredView ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
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
