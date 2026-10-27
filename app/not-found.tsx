import Link from "next/link";
import { InkTitle } from "./ink-specs";

export default function NotFound() {
  return (
    <div className="ink-sheet">
      <InkTitle ja="迷子" title="Not found" />
      <p className="ink-prose">This page doesn&apos;t exist. <Link className="ink-post-title" href="/">Go home</Link></p>
    </div>
  );
}
