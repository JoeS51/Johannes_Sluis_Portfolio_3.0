"use client";

import { LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

// Diagrams use the lightweight `m` components; the animation code loads in a separate chunk.
// `strict` throws if a full `motion` component sneaks back in and undoes the savings.
const loadFeatures = () => import("./motion-features").then((mod) => mod.default);

export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>;
}
