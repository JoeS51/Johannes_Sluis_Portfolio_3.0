"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { drawWireframeLogo } from "./wireframe-logo";

export function SpinningLogo({ home }: { home: boolean }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const orientation = useRef<DOMMatrix | null>(null);
  const drag = useRef<{ id: number; x: number; y: number } | null>(null);
  const moved = useRef(false);

  // Pre-multiply rotations so dragging always uses screen axes, not the shape's
  // rotated local axes (which can point backwards after an idle spin).
  const rotate = (x: number, y: number) => {
    const current = orientation.current ?? new DOMMatrix().rotate(-24, 0, 0).rotate(0, -32, 0);
    orientation.current = new DOMMatrix().rotate(x, y, 0).multiply(current);
    if (canvas.current) drawWireframeLogo(canvas.current, orientation.current);
  };

  useEffect(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    const tick = (now: number) => {
      const elapsed = previous ? Math.min(now - previous, 50) : 0;
      previous = now;
      if (!drag.current) rotate(0, elapsed * 0.03);
      frame = requestAnimationFrame(tick);
    };
    const update = () => {
      cancelAnimationFrame(frame);
      previous = 0;
      rotate(0, 0);
      if (!reducedMotion.matches) frame = requestAnimationFrame(tick);
    };
    update();
    reducedMotion.addEventListener("change", update);
    const themeObserver = new MutationObserver(() => rotate(0, 0));
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-ink-theme"] });
    return () => {
      cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", update);
      themeObserver.disconnect();
    };
  }, []);

  return (
    <Link
      className="ink-nav-home"
      href="/"
      aria-label="Joe Sluis, home"
      aria-description="Drag the 3D hexagon to spin it. Click to go home."
      aria-current={home ? "page" : undefined}
      draggable={false}
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return;
        moved.current = false;
        drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={(event) => {
        const start = drag.current;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (!moved.current && Math.hypot(dx, dy) < 4) return;
        moved.current = true;
        // The canvas projects 3D Y upward, unlike CSS's downward Y axis.
        rotate(dy * 1.5, dx * 1.5);
        start.x = event.clientX;
        start.y = event.clientY;
      }}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; }}
      onLostPointerCapture={() => { drag.current = null; }}
      onClick={(event) => {
        if (moved.current && event.detail !== 0) event.preventDefault();
        moved.current = false;
      }}
    >
      <span className="ink-nav-logo" aria-hidden="true">
        <canvas ref={canvas} className="ink-logo-canvas" width={80} height={80} />
      </span>
    </Link>
  );
}
