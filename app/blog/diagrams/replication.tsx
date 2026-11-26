"use client";

import { useEffect, useRef, useState } from "react";
import { m, useInView, useReducedMotion } from "framer-motion";
import styles from "./replication.module.css";

const durations = [330, 2400, 1520, 2400, 1100];
const totalDuration = durations.reduce((total, duration) => total + duration, 0);

export function ReplicationAnimation() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const running = inView && !reducedMotion;
  const current = reducedMotion ? 4 : step;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => setStep((value) => (value + 1) % 5), durations[step]);
    return () => window.clearTimeout(timer);
  }, [running, step]);

  const progressStart = durations.slice(0, current).reduce((total, duration) => total + duration, 0) / totalDuration;
  const progressEnd = progressStart + durations[current] / totalDuration;

  return (
    <figure ref={ref} className={styles.figure} aria-label="The primary writes INSERT and COMMIT records to WAL, then streams them over TCP to two replicas. Each replica writes the received WAL locally before replaying it." data-running={running}>
      <div className={styles.trunk}>
        <div className={styles.node} data-active={current === 0}>
          <span className={styles.eyebrow}>Client</span>
          <strong>INSERT</strong>
        </div>
        <div className={styles.link} aria-hidden="true">
          <span>SQL</span>
          {current === 0 && <i />}
        </div>
        <div className={`${styles.node} ${styles.primary}`} data-active={current === 1}>
          <span className={styles.eyebrow}>Primary</span>
          {current === 1 && <i className={styles.internalPacket} aria-hidden="true" />}
          <div className={styles.wal} data-writing={current === 1} data-written={current >= 2}>
            <span className={styles.eyebrow}>WAL</span>
            <span className={styles.entry}>INSERT</span>
            <span className={styles.entry}>COMMIT</span>
          </div>
        </div>
      </div>
      <div className={styles.branch}>
        <span className={styles.transport}>WAL / TCP</span>
        <svg viewBox="0 0 400 56" aria-hidden="true">
          <path className={styles.wire} d="M200 0V20H100V54m100-34h100v34M96 49l4 5 4-5m192 0 4 5 4-5" />
          {[100, 300].map((x) => (
            <m.rect
              key={`${x}-${current}`}
              className={styles.packet}
              width="7"
              height="7"
              initial={{ x: 196.5, y: -3.5, opacity: 0 }}
              animate={current === 2 && running ? {
                x: [196.5, 196.5, x - 3.5, x - 3.5],
                y: [-3.5, 16.5, 16.5, 48.5],
                opacity: [0, 1, 1, 0],
              } : { opacity: 0 }}
              transition={{ duration: 1.52, times: [0, 20 / 152, 120 / 152, 1], ease: "linear" }}
            />
          ))}
        </svg>
      </div>
      <div className={styles.replicas}>
        {[1, 2].map((replica) => (
          <div key={replica} className={`${styles.node} ${styles.replica}`} data-active={current >= 3}>
            <span className={styles.eyebrow}>Replica {replica}</span>
            {current === 3 && <i className={styles.internalPacket} aria-hidden="true" />}
            <div className={styles.wal} data-writing={current === 3} data-written={current === 4}>
              <span className={styles.eyebrow}>WAL</span>
              <span className={styles.entry}>INSERT</span>
              <span className={styles.entry}>COMMIT</span>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.progress} aria-hidden="true">
        <m.div
          key={current}
          initial={{ scaleX: reducedMotion ? 1 : progressStart }}
          animate={{ scaleX: reducedMotion ? 1 : running ? progressEnd : progressStart }}
          transition={{ duration: running ? durations[current] / 1000 : 0, ease: "linear" }}
        />
      </div>
    </figure>
  );
}
