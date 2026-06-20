import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const fadeSlide = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
};

const rowMotion = {
  initial: { opacity: 0, x: -10, scale: 0.985 },
  animate: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: 10, scale: 0.985 },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
};

const steps = [
  {
    label: 'Initial state',
    tx1Status: 'idle',
    tx2Status: 'idle',
    tx1: [],
    tx2: [],
    note: 'Argentina has 1 goal. There is only one committed row version.',
    rows: [
      { version: 'v1', team: 'Argentina', goals: 1, state: 'committed', visibleToTx2: true },
    ],
  },
  {
    label: 'Tx1 updates the score',
    tx1Status: 'open',
    tx2Status: 'idle',
    tx1: [
      'BEGIN;',
      "UPDATE world_cup_score\nSET goals = 2\nWHERE team = 'Argentina';",
    ],
    tx2: [],
    note: 'VAR has not confirmed the goal yet. PostgreSQL keeps the old committed version and creates a new uncommitted version for Transaction 1.',
    rows: [
      { version: 'v1', team: 'Argentina', goals: 1, state: 'committed', visibleToTx2: true },
      { version: 'v2', team: 'Argentina', goals: 2, state: 'uncommitted by Tx1', visibleToTx2: false },
    ],
  },
  {
    label: 'Tx2 reads the score',
    tx1Status: 'open',
    tx2Status: 'open',
    tx1: [
      'BEGIN;',
      "UPDATE world_cup_score\nSET goals = 2\nWHERE team = 'Argentina';",
    ],
    tx2: [
      'BEGIN;',
      "SELECT goals\nFROM world_cup_score\nWHERE team = 'Argentina';\n\n goals\n-------\n   1",
    ],
    note: 'Transaction 2 does not see the uncommitted goals = 2 version. It reads the last committed version: goals = 1.',
    rows: [
      { version: 'v1', team: 'Argentina', goals: 1, state: 'committed', visibleToTx2: true },
      { version: 'v2', team: 'Argentina', goals: 2, state: 'uncommitted by Tx1', visibleToTx2: false },
    ],
  },
  {
    label: 'Goal is called offside',
    tx1Status: 'rolled back',
    tx2Status: 'open',
    tx1: [
      'BEGIN;',
      "UPDATE world_cup_score\nSET goals = 2\nWHERE team = 'Argentina';",
      'ROLLBACK; -- offside',
    ],
    tx2: [
      'BEGIN;',
      "SELECT goals\nFROM world_cup_score\nWHERE team = 'Argentina';\n\n goals\n-------\n   1",
    ],
    note: 'The uncommitted goals = 2 version is discarded. Transaction 2 avoided reading a score that never officially counted.',
    rows: [
      { version: 'v1', team: 'Argentina', goals: 1, state: 'committed', visibleToTx2: true },
    ],
  },
];

const SqlPanel = ({ title, subtitle, status, commands }) => (
  <section className="mvcc-tx-panel">
    <div className="mvcc-tx-panel-header">
      <div>
        <p className="mvcc-tx-eyebrow">{subtitle}</p>
        <h4>{title}</h4>
      </div>
      <span className="mvcc-tx-status">{status}</span>
    </div>

    <pre className="mvcc-sql-window" aria-label={`${title} SQL commands`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {commands.length === 0 ? (
          <motion.code key="waiting" className="mvcc-terminal-muted" {...fadeSlide}>
            -- waiting
          </motion.code>
        ) : (
          commands.map((command, index) => (
            <motion.code
              layout
              key={`${command}-${index}`}
              className={index === commands.length - 1 ? 'is-active' : ''}
              initial={{ opacity: 0, y: 8, backgroundColor: 'rgba(134, 239, 172, 0)' }}
              animate={{
                opacity: 1,
                y: 0,
                backgroundColor:
                  index === commands.length - 1
                    ? 'rgba(134, 239, 172, 0.08)'
                    : 'rgba(134, 239, 172, 0)',
              }}
              exit={{ opacity: 0, y: -8, backgroundColor: 'rgba(134, 239, 172, 0)' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="mvcc-sql-prompt">postgres=#</span> {command}
            </motion.code>
          ))
        )}
      </AnimatePresence>
    </pre>
  </section>
);

const MvccTransactionAnimation = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const canGoBack = stepIndex > 0;
  const canGoForward = stepIndex < steps.length - 1;

  const progressText = useMemo(() => `${stepIndex + 1} / ${steps.length}`, [stepIndex]);

  return (
    <div className="mvcc-demo" aria-label="Interactive MVCC transaction animation">
      <div className="mvcc-tx-grid">
        <SqlPanel title="Transaction 1" subtitle="Session A" status={step.tx1Status} commands={step.tx1} />
        <SqlPanel title="Transaction 2" subtitle="Session B" status={step.tx2Status} commands={step.tx2} />
      </div>

      <motion.section className="mvcc-db-panel" layout transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
        <div className="mvcc-db-header">
          <div>
            <p className="mvcc-tx-eyebrow">Shared database view</p>
            <h4>world_cup_score</h4>
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={step.label} className="mvcc-db-badge" {...fadeSlide}>
              {step.label}
            </motion.span>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p key={step.note} className="mvcc-step-note" {...fadeSlide}>
            {step.note}
          </motion.p>
        </AnimatePresence>

        <div className="mvcc-table-wrap">
          <table className="mvcc-world-cup-table">
            <thead>
              <tr>
                <th>row version</th>
                <th>team</th>
                <th>goals</th>
                <th>state</th>
                <th>visible to Tx2?</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout" initial={false}>
                {step.rows.map((row) => (
                  <motion.tr
                    layout
                    key={row.version}
                    className={row.visibleToTx2 ? 'is-visible-version' : 'is-hidden-version'}
                    {...rowMotion}
                  >
                    <td>{row.version}</td>
                    <td><span className="mvcc-team-ball">⚽</span>{row.team}</td>
                    <td>{row.goals}</td>
                    <td>{row.state}</td>
                    <td>{row.visibleToTx2 ? 'yes' : 'no'}</td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.section>

      <div className="mvcc-demo-controls">
        <button type="button" onClick={() => setStepIndex(stepIndex - 1)} disabled={!canGoBack}>
          Previous
        </button>
        <span>{progressText}</span>
        <button type="button" onClick={() => setStepIndex(stepIndex + 1)} disabled={!canGoForward}>
          Next
        </button>
      </div>
    </div>
  );
};

export default MvccTransactionAnimation;
