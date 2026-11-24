"use client";

import { useId, useState } from "react";
import styles from "./replication-quiz.module.css";

const questions = [
  {
    title: "The sync replication trap",
    scenario: "You use synchronous replication. Does that mean replica lag is impossible?",
    answers: [
      "Yes - a successful commit means every replica is fully caught up",
      "No - a replica can acknowledge WAL before replaying it",
      "No - but only when the primary has crashed",
    ],
    correct: 1,
    explanation: "Synchronous replication doesn't always mean the changes are already visible to queries. Depending on the acknowledgment level, a replica can acknowledge WAL before replaying it, so replay lag can still exist. Even when acknowledgment requires replay, the guarantee applies to the required replicas and the acknowledged transaction—not every replica or newer writes.",
  },
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
    title: "The failover trap",
    scenario: "The primary stops responding to heartbeats. You promote the most up-to-date replica. Is it safe to let it accept writes immediately?",
    answers: [
      "Yes, the replica has the most recent data.",
      "Yes, missing heartbeats prove the old primary has stopped.",
      "Not necessarily. The old primary could still accept writes, causing split-brain.",
    ],
    correct: 2,
    explanation: "Losing contact with the primary doesn't prove it stopped running. Fencing prevents the old primary from accepting writes before the new primary takes over.",
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
