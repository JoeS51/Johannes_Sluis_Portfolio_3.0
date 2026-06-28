import React, { useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const accountsQuery = 'SELECT name, balance\nFROM accounts\nWHERE name IN (\'Alice\', \'Bob\');';

const accountsBefore = ` name  | balance\n-------+---------\n Alice |     100\n Bob   |     100\n(2 rows)`;

const accountsAfter = ` name  | balance\n-------+---------\n Alice |      50\n Bob   |     150\n(2 rows)`;

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
    takeaway: 'No MVCC yet: imagine the database has only one version of each account row.',
    title: 'Starting balances',
    left: [shell('$ psql -d bank'), sql(`bank=# ${accountsQuery}`), output(accountsBefore)],
  },
  {
    label: 'Step 2',
    activePane: 'A',
    takeaway: 'Transaction A starts a transfer and will need exclusive access to the account rows it changes.',
    left: [shell('$ psql -d bank'), sql('bank=# BEGIN;'), output('BEGIN')],
    right: [shell('$ psql -d bank'), comment('bank=# -- still idle')],
  },
  {
    label: 'Step 3',
    activePane: 'A',
    takeaway: 'Transaction A changes the only row versions. Until commit, a reader could see a half-finished transfer.',
    left: [
      shell('$ psql -d bank'),
      sql('bank=# BEGIN;'),
      sql("bank=*# UPDATE accounts\nSET balance = balance - 50\nWHERE name = 'Alice';"),
      output('UPDATE 1'),
      sql("bank=*# UPDATE accounts\nSET balance = balance + 50\nWHERE name = 'Bob';"),
      output('UPDATE 1'),
    ],
    right: [shell('$ psql -d bank'), comment('bank=# -- Transaction A has not committed')],
  },
  {
    label: 'Step 4',
    activePane: 'B',
    takeaway: 'Reader blocked by writer: Transaction B begins, tries to read balances, and waits on A.',
    left: [
      shell('$ psql -d bank'),
      sql('bank=# BEGIN;'),
      sql("bank=*# UPDATE accounts\nSET balance = balance - 50\nWHERE name = 'Alice';"),
      output('UPDATE 1'),
      sql("bank=*# UPDATE accounts\nSET balance = balance + 50\nWHERE name = 'Bob';"),
      output('UPDATE 1'),
      comment('bank=*# -- transaction still open'),
    ],
    right: [
      shell('$ psql -d bank'),
      sql('bank=# BEGIN;'),
      output('BEGIN'),
      sql(`bank=*# ${accountsQuery}`),
      blocked('waiting... Transaction A holds the account rows'),
      comment('-- with only one row version, B must wait for A to commit or roll back'),
    ],
  },
  {
    label: 'Step 5',
    activePane: 'B',
    takeaway: 'After A commits, B is unblocked and can finally read the completed transfer.',
    left: [
      shell('$ psql -d bank'),
      sql('bank=# BEGIN;'),
      sql("bank=*# UPDATE accounts\nSET balance = balance - 50\nWHERE name = 'Alice';"),
      output('UPDATE 1'),
      sql("bank=*# UPDATE accounts\nSET balance = balance + 50\nWHERE name = 'Bob';"),
      output('UPDATE 1'),
      sql('bank=*# COMMIT;'),
      output('COMMIT'),
    ],
    right: [
      shell('$ psql -d bank'),
      sql('bank=# BEGIN;'),
      output('BEGIN'),
      sql(`bank=*# ${accountsQuery}`),
      blocked('waiting... Transaction A holds the account rows'),
      output(accountsAfter, { delay: 1.35 }),
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
    const match = block.text.match(/^(\w+=(?:\*|)#\s)([\s\S]*)$/);

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

const SimpleMvccView = () => (
  <section className="mvcc-simple-view-text" aria-label="Simplified no-MVCC blocking explanation">
    <p>
      Start with two bank accounts. In the database, the rows look like this:
    </p>

    <pre aria-label="Starting account balances table">{accountsBefore}</pre>

    <p>
      Now imagine the database does not use MVCC, so there is only one version of each row. Transaction A transfers
      $50 from Alice to Bob, but has not committed yet.
    </p>

    <p>
      If Transaction B reads those rows immediately, it could see a half-finished transfer or changes that later roll back. To avoid that dirty
      read, Transaction B has to wait until Transaction A commits or rolls back.
    </p>
  </section>
);

const MvccTransactionAnimation = () => {
  const demoRef = useRef(null);
  const hasEnteredView = useInView(demoRef, { once: true, amount: 0.3 });
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [viewMode, setViewMode] = useState('animated');
  const activeStep = steps[activeStepIndex];

  return (
    <figure ref={demoRef} className="mvcc-demo mvcc-demo-initial" aria-label="No-MVCC account transfer steps in Zellij and psql">
      <div className="mvcc-view-toggle" aria-label="MVCC visual display mode">
        <button
          type="button"
          className={viewMode === 'animated' ? 'is-active' : ''}
          onClick={() => setViewMode('animated')}
        >
          Animated
        </button>
        <button
          type="button"
          className={viewMode === 'simple' ? 'is-active' : ''}
          onClick={() => setViewMode('simple')}
        >
          Simple
        </button>
      </div>

      <div className={`mvcc-animated-view${viewMode === 'simple' ? ' is-hidden-by-choice' : ''}`}>
        <div className="mvcc-psql-terminal">
        <div className="mvcc-zellij-tabbar">
          <span className="mvcc-zellij-title">Zellij (mvcc-bank-transfer)</span>
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
      </div>

      <div className={`mvcc-simple-view${viewMode === 'animated' ? ' is-hidden-by-choice' : ''}`}>
        <SimpleMvccView />
      </div>
    </figure>
  );
};

export default MvccTransactionAnimation;
