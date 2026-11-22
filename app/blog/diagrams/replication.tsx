"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import styles from "./replication.module.css";

export function ReplicationAnimation() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount: 0.25 });
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const running = inView && !reducedMotion;
  const current = reducedMotion ? 3 : step;

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setStep((value) => (value + 1) % 4), 1400);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <figure ref={ref} className={styles.figure} aria-label="The primary receives the client's SQL, writes a record into its WAL, then streams WAL over TCP to two replicas." data-running={running}>
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
            <i className={styles.entry} aria-hidden="true" />
          </div>
        </div>
      </div>
      <div className={styles.branch}>
        <span className={styles.transport}>WAL / TCP</span>
        <svg viewBox="0 0 400 56" aria-hidden="true">
          <path className={styles.wire} d="M200 0V20H100V54m100-34h100v34M96 49l4 5 4-5m192 0 4 5 4-5" />
          {[100, 300].map((x) => (
            <motion.rect
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
              transition={{ duration: 1.2, times: [0, 0.2, 0.75, 1], ease: "linear" }}
            />
          ))}
        </svg>
      </div>
      <div className={styles.replicas}>
        {[1, 2].map((replica) => (
          <div key={replica} className={styles.node} data-active={current === 3}>
            <span className={styles.eyebrow}>Replica {replica}</span>
            <strong>{current === 3 ? "Replayed ✓" : "—"}</strong>
          </div>
        ))}
      </div>
    </figure>
  );
}
