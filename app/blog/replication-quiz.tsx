"use client";

import { useId, useState } from "react";
import styles from "./replication-quiz.module.css";

const questions = [
  {
    title: "The timestamp trap",
    scenario: "The primary executes an INSERT containing NOW(). The replica receives the change two seconds later. How does physical replication preserve the original timestamp?",
    answers: [
      "The replica runs the SQL with its clock adjusted",
      "The replica replays WAL containing the value computed on the primary",
      "Postgres waits until both servers can execute the SQL simultaneously",
    ],
    correct: 1,
    explanation: "Replication reproduces the recorded change. Replaying it later still writes the timestamp computed on the primary",
  },
  {
    title: "The missing row",
    scenario: "Sync replication uses synchronous_commit = on. The client gets a successful COMMIT, then immediately queries the acknowledging standby. Could the new row still be missing?",
    answers: [
      "No - sync replication guarantees immediately readable data",
      "Yes - the standby might have flushed the WAL without replaying it yet",
      "Yes - but only if the standby lost its network connection",
    ],
    correct: 1,
    explanation: "Durability and visibility are different milestones. With on, the standby has durably flushed the WAL, but replay can still be behind. remote_apply waits for replay on the required standby",
  },
  {
    title: "The failover surprise",
    scenario: "With async replication, the primary acknowledges an INSERT, then fails before sending that transaction’s WAL to the replica. The replica takes over. What should you expect?",
    answers: [
      "The write must exist because the client received success.",
      "The promoted replica can reconstruct the write from its LSN.",
      "The write can be missing despite the successful response.",
    ],
    correct: 2,
    explanation: "The acknowledgement didn’t guarantee replication. An LSN tracks a position—it can’t reconstruct WAL the replica never received. The write may remain on the failed primary, but it isn’t available on the promoted replica.",
  },
];

export function ReplicationQuiz() {
  const id = useId();
  const [answers, setAnswers] = useState<Record<number, number>>({});

  return (
    <div className={styles.quiz}>
      {questions.map((question, index) => {
        const selected = answers[index];
        const answered = selected !== undefined;
        const correct = selected === question.correct;
        const feedbackId = `${id}-${index}-feedback`;

        return (
          <fieldset key={question.title} className={styles.question}>
            <legend>
              <span className={styles.number}>0{index + 1}</span>
              <span>{question.scenario}</span>
            </legend>
            <div className={styles.options}>
              {question.answers.map((answer, option) => (
                <label
                  key={answer}
                  className={styles.option}
                  data-selected={selected === option}
                  data-correct={answered && option === question.correct}
                >
                  <input
                    type="radio"
                    name={`${id}-${index}`}
                    checked={selected === option}
                    onChange={() => setAnswers((previous) => ({ ...previous, [index]: option }))}
                    aria-describedby={answered ? feedbackId : undefined}
                  />
                  <span className={styles.letter} aria-hidden="true">{String.fromCharCode(65 + option)}</span>
                  <span>{answer}</span>
                  {answered && option === question.correct && <span className={styles.answerLabel}>Correct answer</span>}
                </label>
              ))}
            </div>
            <div role="status" aria-live="polite" aria-atomic="true">
              {answered && (
                <div id={feedbackId} className={styles.feedback}>
                  <strong>{correct ? "nice!" : "not quite"}</strong>
                  <p>{question.explanation}</p>
                </div>
              )}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}
