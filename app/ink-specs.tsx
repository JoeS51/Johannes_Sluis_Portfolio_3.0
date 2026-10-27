import type { ReactNode } from "react";

export type Spec = { label: string; ja?: string; value: ReactNode };

// Spec-sheet rows like the back of a box: an English label, its Japanese as a faint tag, then the value.
export function InkSpecs({ specs }: { specs: Spec[] }) {
  return (
    <dl className="ink-specs">
      {specs.map((spec) => (
        <div key={spec.label}>
          <dt>{spec.label}{spec.ja && <span lang="ja" aria-hidden="true">{spec.ja}</span>}</dt>
          <dd>{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}

// Japanese kicker, a big word, its reading underneath, then the rule.
export function InkHeader({ ja, big, reading }: { ja: string; big: ReactNode; reading: string }) {
  return (
    <header>
      <p className="ink-kicker" lang="ja">{ja}</p>
      <h1 className="ink-name">{big}</h1>
      <p className="ink-kana" lang="ja">{reading}</p>
      <hr className="ink-rule" />
    </header>
  );
}

// Section pages: a small Japanese label over the English title, then the rule.
export function InkTitle({ ja, title }: { ja: string; title: string }) {
  return (
    <header>
      <p className="ink-title-ja" lang="ja">{ja}</p>
      <h1 className="ink-title">{title}</h1>
      <hr className="ink-rule" />
    </header>
  );
}
