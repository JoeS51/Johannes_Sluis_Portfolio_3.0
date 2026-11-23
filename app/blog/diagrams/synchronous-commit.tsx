"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./synchronous-commit.module.css";

const settings = [
  { value: "remote_write", milestone: 1, label: "Write to OS cache" },
  { value: "on", milestone: 2, label: "Flush to disk" },
  { value: "remote_apply", milestone: 3, label: "Replay changes" },
] as const;

const durations = [1800, 1800, 1800, 1800, 1300];
const totalDuration = durations.reduce((total, duration) => total + duration, 0);

function WalRecords({ visible }: { visible: boolean }) {
  return (
    <div className={styles.records} data-visible={visible}>
      <span>INSERT</span><span>COMMIT</span>
    </div>
  );
}

function CommitLoop({ selected }: { selected: typeof settings[number] }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.3 });
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);
  const running = inView && !reducedMotion;
  const current = reducedMotion ? 4 : step;
  const success = reducedMotion || acknowledged;
  const sendingAck = current === selected.milestone && running;
  const progressStart = durations.slice(0, current).reduce((total, duration) => total + duration, 0) / totalDuration;
  const progressEnd = progressStart + durations[current] / totalDuration;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => {
      setStep((value) => (value + 1) % 5);
      if (step === 4) setAcknowledged(false);
    }, durations[step]);
    return () => window.clearTimeout(timer);
  }, [running, step]);

  useEffect(() => {
    if (!sendingAck) return;
    const timer = window.setTimeout(() => setAcknowledged(true), 1600);
    return () => window.clearTimeout(timer);
  }, [sendingAck]);

  return (
    <figure
      ref={ref}
      className={styles.figure}
      data-running={running}
      aria-label={`${selected.value}: the primary waits for the synchronous standby to ${selected.label.toLowerCase()} before reporting success. The standby subsequently completes replay.`}
    >
      <div className={styles.flow}>
        <div className={`${styles.node} ${styles.client}`} data-active={success}>
          <span className={styles.label}>Client</span>
          <strong>{success ? "COMMIT ✓" : "Waiting…"}</strong>
        </div>
        <div className={styles.link} aria-hidden="true">
          <span>{sendingAck || success ? "OK" : "COMMIT"}</span>
          {current === 0 && <i className={styles.outgoing} />}
          {sendingAck && <i className={styles.successPacket} />}
        </div>
        <div className={styles.node}>
          <span className={styles.label}>Primary</span>
          <div className={styles.localWal}>
            <span className={styles.label}>WAL · disk</span>
            <WalRecords visible />
          </div>
        </div>
        <div className={styles.link} aria-hidden="true">
          <span>{sendingAck ? "ACK" : "WAL / TCP"}</span>
          {current === 0 && <i className={styles.walPacket} />}
          {sendingAck && <i className={styles.ackPacket} />}
        </div>
        <div className={`${styles.node} ${styles.standby}`}>
          <span className={styles.label}>Synchronous standby</span>
          <div className={styles.storage} data-active={current === 1} data-wait={selected.milestone === 1}>
            <span className={styles.label}>WAL · OS cache</span>
            <WalRecords visible={current >= 1} />
          </div>
          <span className={styles.down} data-active={current === 2} aria-hidden="true">↓ <span>flush</span></span>
          <div className={styles.storage} data-active={current === 2} data-wait={selected.milestone === 2}>
            <span className={styles.label}>WAL · disk</span>
            <WalRecords visible={current >= 2} />
          </div>
          <span className={styles.down} data-active={current === 3} aria-hidden="true">↓ <span>replay</span></span>
          <div className={styles.storage} data-active={current === 3} data-wait={selected.milestone === 3}>
            <span className={styles.label}>table1 · readable row</span>
            <div className={styles.row} data-visible={current >= 3}>
              <span>joe</span><span>12:00:00+00</span>
            </div>
          </div>
        </div>
      </div>
      <figcaption className={styles.caption}>Wait for: <strong>{selected.label}</strong></figcaption>
      <div className={styles.progress} aria-hidden="true">
        <motion.span
          key={current}
          initial={{ scaleX: reducedMotion ? 1 : progressStart }}
          animate={{ scaleX: reducedMotion ? 1 : running ? progressEnd : progressStart }}
          transition={{ duration: running ? durations[current] / 1000 : 0, ease: "linear" }}
        />
      </div>
    </figure>
  );
}

export function SynchronousCommitAnimation() {
  const [selected, setSelected] = useState<typeof settings[number]>(settings[0]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.selector} role="group" aria-label="synchronous_commit setting">
        {settings.map((setting) => (
          <button
            key={setting.value}
            type="button"
            aria-pressed={selected.value === setting.value}
            onClick={() => setSelected(setting)}
          >
            {setting.value}
          </button>
        ))}
      </div>
      <CommitLoop key={selected.value} selected={selected} />
    </div>
  );
}
