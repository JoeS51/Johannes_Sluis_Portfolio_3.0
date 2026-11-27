import type { Metadata } from "next";
import Link from "next/link";
import { ReplicationQuiz } from "../../replication-quiz";
import "../../writing.css";

export const metadata: Metadata = {
  title: "Database Replication Quiz",
  description: "Three practical scenarios to check your understanding of WAL, synchronous replication, and failover.",
  alternates: { canonical: "/blog/how-database-replication-works/quiz" },
};

export default function ReplicationQuizPage() {
  return (
    <div className="ink-article">
      <Link className="ink-back" href="/blog/how-database-replication-works">{"←︎"} Back to the article</Link>
      <header className="ink-article-header">
        <p className="ink-post-meta">3 questions</p>
        <h1 className="ink-article-title">Super fun replication quiz</h1>
        <hr className="ink-rule" />
      </header>
      <div className="blog-post-content">
        <ReplicationQuiz />
      </div>
    </div>
  );
}
