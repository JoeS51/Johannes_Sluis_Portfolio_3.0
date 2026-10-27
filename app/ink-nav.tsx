"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/blog", name: "Writing" },
  { href: "/about", name: "About" },
];

type Theme = "light" | "dark";

// 白 / 黒 with the current one inked in; clicking flips it and remembers the choice.
function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(document.documentElement.dataset.inkTheme === "dark" ? "dark" : "light"), []);

  const flip = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.inkTheme = next;
    try { localStorage.setItem("ink-theme", next); } catch {}
    setTheme(next);
  };

  if (!theme) return null;
  const mark = (value: Theme, glyph: string) => theme === value ? <b>{glyph}</b> : <span aria-hidden="true">{glyph}</span>;
  return (
    <button className="ink-theme" type="button" lang="ja" onClick={flip} aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}>
      {mark("light", "白")}{mark("dark", "黒")}
    </button>
  );
}

export function InkNav() {
  const pathname = usePathname();
  return (
    <nav className="ink-nav" aria-label="Site">
      <Link className="ink-nav-home" href="/" lang="ja" aria-label="Joe Sluis, home" aria-current={pathname === "/" ? "page" : undefined}>ジョー</Link>
      <ThemeSwitch />
      <div className="ink-nav-links">
        {links.map((link) => (
          <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.name}</Link>
        ))}
      </div>
    </nav>
  );
}
