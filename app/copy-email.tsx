"use client";

import { useEffect, useRef, useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState("");
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (reset.current) clearTimeout(reset.current);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      if (reset.current) clearTimeout(reset.current);
      setStatus("Copied");
      reset.current = setTimeout(() => setStatus(""), 2000);
    } catch {
      setStatus("Couldn't copy—select the address to copy manually.");
    }
  };

  return (
    <>
      <button className="ink-copy-email" type="button" onClick={copy} data-copied={status === "Copied"} aria-label={`Copy email address: ${email}`}>
        {email}
        <svg className="ink-copy-icon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {status === "Copied"
            ? <path key="check" className="ink-copy-check" d="m3 8 3 3 7-7" />
            : <><rect x="5.5" y="5.5" width="8" height="8" rx="1" /><path d="M10.5 5.5v-3h-8v8h3" /></>}
        </svg>
      </button>
      <span className="ink-copy-status" role="status">
        {status === "Copied" ? "" : status}
      </span>
    </>
  );
}
