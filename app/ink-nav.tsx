"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/blog", name: "Writing" },
  { href: "/projects", name: "Projects" },
  { href: "/about", name: "About" },
];

function hasStoredTheme() {
  try { return localStorage.getItem("ink-theme") !== null; } catch { return false; }
}

// A square switch: follows the OS until clicked, then remembers the choice.
// The thumb's position comes from CSS, so it's right before hydration; this state only drives aria-checked.
function ThemeSwitch() {
  const [dark, setDark] = useState(false);

  // Colors swap instantly: hover transitions are paused for the flip so links don't lag behind the page.
  // Flushing styles while paused commits the new colors; only the thumb's slide still animates.
  const apply = (next: boolean) => {
    const root = document.documentElement;
    root.classList.add("ink-theme-switching");
    root.dataset.inkTheme = next ? "dark" : "light";
    getComputedStyle(root).color;
    root.classList.remove("ink-theme-switching");
    setDark(next);
  };

  useEffect(() => {
    setDark(document.documentElement.dataset.inkTheme === "dark");
    const os = matchMedia("(prefers-color-scheme: dark)");
    const onOsChange = (event: MediaQueryListEvent) => {
      if (!hasStoredTheme()) apply(event.matches);
    };
    os.addEventListener("change", onOsChange);
    return () => os.removeEventListener("change", onOsChange);
  }, []);

  const flip = () => {
    const next = document.documentElement.dataset.inkTheme !== "dark";
    try { localStorage.setItem("ink-theme", next ? "dark" : "light"); } catch {}
    apply(next);
  };

  return (
    <button className="ink-theme" type="button" role="switch" aria-checked={dark} aria-label="Dark mode" onClick={flip}>
      <span className="ink-theme-track" />
    </button>
  );
}

export function InkNav() {
  const pathname = usePathname();
  return (
    <nav className="ink-nav" aria-label="Site">
      <Link className="ink-nav-home" href="/" lang="ja" aria-label="Joe Sluis, home" aria-current={pathname === "/" ? "page" : undefined}>ジョー</Link>
      <div className="ink-nav-links">
        {links.map((link) => (
          <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.name}</Link>
        ))}
        <ThemeSwitch />
      </div>
    </nav>
  );
}
