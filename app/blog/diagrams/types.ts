import type { Transition } from "framer-motion";

export type DiagramProps = { animate: boolean; titleId: string; descriptionId: string; clipId: string };
export type NodeProps = { x: number; y: number; width: number; height: number; eyebrow?: string; label: string; className?: string };
export type FlowDotProps = { animate: boolean; kind: string; x: number[]; y: number[]; times: number[]; delay?: number; radius?: number; animationTransition?: Transition };
export type ClientProps = { mobile?: boolean; clipId: string };
export type StorageProps = { animate?: boolean; mobile?: boolean };
