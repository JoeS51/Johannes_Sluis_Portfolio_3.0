import React, { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

const transition = {
  duration: 8.5,
  ease: 'linear',
  repeat: Infinity,
  repeatDelay: 0.8,
};

const Node = ({ x, y, width, height, eyebrow, label, className = '' }) => (
  <g className={`aurora-node limitless-node ${className}`}>
    <rect x={x} y={y} width={width} height={height} rx="8" />
    <text className="aurora-node-eyebrow" x={x + width / 2} y={y + 25} textAnchor="middle">
      {eyebrow}
    </text>
    <text className="aurora-node-label" x={x + width / 2} y={y + 51} textAnchor="middle">
      {label}
    </text>
  </g>
);

const FlowDot = ({ animate, x, y, times, kind, delay = 0 }) => (
  <motion.circle
    className={`aurora-flow-dot is-${kind}`}
    r="6"
    initial={{ cx: x[0], cy: y[0], opacity: 0 }}
    animate={animate ? {
      cx: x,
      cy: y,
      opacity: x.map((_, index) => index === 0 || index === x.length - 1 ? 0 : 1),
    } : { opacity: 0 }}
    transition={{ ...transition, delay, times }}
  />
);

const Storage = ({ animate, mobile = false }) => {
  const cells = mobile
    ? [{ x: 35, label: 'AZ 1' }, { x: 152, label: 'AZ 2' }, { x: 269, label: 'AZ 3' }]
    : [{ x: 55, label: 'AZ 1' }, { x: 265, label: 'AZ 2' }, { x: 475, label: 'AZ 3' }];
  const y = mobile ? 555 : 530;
  const width = mobile ? 96 : 185;
  const height = mobile ? 72 : 62;

  return cells.map((cell, index) => (
    <g key={cell.label}>
      <rect className="aurora-storage-cell" x={cell.x} y={y} width={width} height={height} rx="6" />
      <motion.rect
        className="aurora-storage-pulse"
        x={cell.x}
        y={y}
        width={width}
        height={height}
        rx="6"
        animate={animate ? { opacity: [0, 0, 0.18, 0.18, 0, 0] } : { opacity: 0 }}
        transition={{ ...transition, delay: index * 0.12, times: [0, 0.36, 0.42, 0.54, 0.62, 1] }}
      />
      <text className="aurora-storage-az" x={cell.x + width / 2} y={y + 27} textAnchor="middle">{cell.label}</text>
      <text className="aurora-storage-copy" x={cell.x + width / 2} y={y + 50} textAnchor="middle">storage copies</text>
    </g>
  ));
};

const DesktopDiagram = ({ animate, titleId, descriptionId }) => (
  <svg
    className="aurora-diagram aurora-diagram-desktop limitless-diagram"
    viewBox="0 0 880 630"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
  >
    <title id={titleId}>Aurora Limitless architecture with routers, shards, control plane, and distributed storage</title>
    <desc id={descriptionId}>
      Client queries pass through scalable routers to read and write shards. A separate control plane manages the routers and shards, which use distributed storage across three availability zones.
    </desc>

    <rect className="limitless-boundary" x="20" y="130" width="840" height="485" rx="12" />
    <g className="aurora-connectors">
      <path d="M440 105 V145 H595" />
      <path d="M115 145 H440" />
      <path d="M115 145 V175 M275 145 V175 M435 145 V175 M595 145 V175" />
      <path d="M115 257 V335" />
      <path d="M275 257 V300 H435 V335" />
      <path d="M435 257 V300 H275 V335" />
      <path d="M595 257 V335" />
      <path d="M115 417 V485 M275 417 V485 M435 417 V485 M595 417 V485" />
    </g>
    <g className="limitless-control-connectors">
      <path d="M710 225 H680 V145 H595" />
      <path d="M710 370 H670 V320 H595" />
    </g>

    <Node x={355} y={25} width={170} height={80} eyebrow="CLIENT" label="Application" />
    <Node x={50} y={175} width={130} height={82} eyebrow="QUERY LAYER" label="Router 1" className="is-router" />
    <Node x={210} y={175} width={130} height={82} eyebrow="QUERY LAYER" label="Router 2" className="is-router" />
    <Node x={370} y={175} width={130} height={82} eyebrow="QUERY LAYER" label="Router 3" className="is-router" />
    <Node x={530} y={175} width={130} height={82} eyebrow="QUERY LAYER" label="Router 4" className="is-router" />
    <Node x={50} y={335} width={130} height={82} eyebrow="READ / WRITE" label="Shard 1" />
    <Node x={210} y={335} width={130} height={82} eyebrow="READ / WRITE" label="Shard 2" />
    <Node x={370} y={335} width={130} height={82} eyebrow="READ / WRITE" label="Shard 3" />
    <Node x={530} y={335} width={130} height={82} eyebrow="READ / WRITE" label="Shard 4" />

    <g className="limitless-control-plane">
      <rect x="710" y="175" width="120" height="242" rx="8" />
      <text x="770" y="278" textAnchor="middle">CONTROL</text>
      <text className="limitless-control-title" x="770" y="302" textAnchor="middle">Control plane</text>
      <text className="limitless-control-copy" x="770" y="327" textAnchor="middle">coordinates</text>
      <text className="limitless-control-copy" x="770" y="344" textAnchor="middle">the cluster</text>
    </g>

    <g className="aurora-storage-layer">
      <rect x="35" y="485" width="645" height="120" rx="10" />
      <text className="aurora-storage-title" x="55" y="515">SHARED DISTRIBUTED STORAGE</text>
      <Storage animate={animate} />
    </g>

    <FlowDot animate={animate} kind="write" x={[420, 420, 115, 115, 115, 115]} y={[105, 145, 145, 175, 335, 485]} times={[0, 0.06, 0.17, 0.22, 0.36, 0.48]} />
    <FlowDot animate={animate} kind="write" x={[440, 440, 275, 275, 435, 435, 435]} y={[105, 145, 145, 257, 300, 335, 485]} times={[0, 0.06, 0.14, 0.24, 0.31, 0.36, 0.5]} delay={0.35} />
    <FlowDot animate={animate} kind="write" x={[460, 460, 595, 595, 595, 595]} y={[105, 145, 145, 175, 335, 485]} times={[0, 0.06, 0.15, 0.2, 0.36, 0.5]} delay={0.7} />
    <FlowDot animate={animate} kind="control" x={[710, 680, 680, 595]} y={[225, 225, 145, 145]} times={[0, 0.12, 0.26, 0.4]} delay={4.5} />
    <FlowDot animate={animate} kind="control" x={[710, 670, 670, 595]} y={[370, 370, 320, 320]} times={[0, 0.12, 0.26, 0.4]} delay={4.8} />
  </svg>
);

const MobileDiagram = ({ animate, titleId, descriptionId }) => (
  <svg
    className="aurora-diagram aurora-diagram-mobile limitless-diagram"
    viewBox="0 0 400 700"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
  >
    <title id={titleId}>Aurora Limitless architecture with routers, shards, control plane, and distributed storage</title>
    <desc id={descriptionId}>
      Client queries pass through routers to read and write shards. A control plane manages the cluster, and shards use distributed storage across three availability zones.
    </desc>

    <rect className="limitless-boundary" x="10" y="135" width="380" height="545" rx="12" />
    <g className="aurora-connectors">
      <path d="M200 110 V145 H250" />
      <path d="M62 145 H200" />
      <path d="M62 145 V180 M156 145 V180 M250 145 V180" />
      <path d="M62 262 V345 M156 262 V345 M250 262 V345" />
      <path d="M62 427 V510 M156 427 V510 M250 427 V510" />
    </g>
    <g className="limitless-control-connectors">
      <path d="M305 225 H285 V145 H250" />
      <path d="M305 385 H280 V315 H250" />
    </g>

    <Node x={110} y={30} width={180} height={80} eyebrow="CLIENT" label="Application" />
    <Node x={20} y={180} width={84} height={82} eyebrow="QUERY" label="Router 1" className="is-router" />
    <Node x={114} y={180} width={84} height={82} eyebrow="QUERY" label="Router 2" className="is-router" />
    <Node x={208} y={180} width={84} height={82} eyebrow="QUERY" label="Router 3" className="is-router" />
    <Node x={20} y={345} width={84} height={82} eyebrow="R / W" label="Shard 1" />
    <Node x={114} y={345} width={84} height={82} eyebrow="R / W" label="Shard 2" />
    <Node x={208} y={345} width={84} height={82} eyebrow="R / W" label="Shard 3" />

    <g className="limitless-control-plane">
      <rect x="305" y="180" width="75" height="247" rx="8" />
      <text x="342" y="281" textAnchor="middle">CONTROL</text>
      <text className="limitless-control-title" x="342" y="305" textAnchor="middle">Control</text>
      <text className="limitless-control-title" x="342" y="324" textAnchor="middle">plane</text>
    </g>

    <g className="aurora-storage-layer">
      <rect x="20" y="510" width="360" height="145" rx="10" />
      <text className="aurora-storage-title" x="35" y="540">SHARED DISTRIBUTED STORAGE</text>
      <Storage animate={animate} mobile />
    </g>

    <FlowDot animate={animate} kind="write" x={[185, 185, 62, 62, 62, 62]} y={[110, 145, 145, 180, 345, 510]} times={[0, 0.06, 0.16, 0.21, 0.36, 0.49]} />
    <FlowDot animate={animate} kind="write" x={[200, 200, 156, 156, 156, 156]} y={[110, 145, 145, 180, 345, 510]} times={[0, 0.06, 0.14, 0.2, 0.36, 0.49]} delay={0.35} />
    <FlowDot animate={animate} kind="write" x={[215, 215, 250, 250, 250, 250]} y={[110, 145, 145, 180, 345, 510]} times={[0, 0.06, 0.14, 0.2, 0.36, 0.49]} delay={0.7} />
    <FlowDot animate={animate} kind="control" x={[305, 285, 285, 250]} y={[225, 225, 145, 145]} times={[0, 0.12, 0.26, 0.4]} delay={4.5} />
    <FlowDot animate={animate} kind="control" x={[305, 280, 280, 250]} y={[385, 385, 315, 315]} times={[0, 0.12, 0.26, 0.4]} delay={4.8} />
  </svg>
);

const AuroraLimitlessAnimation = () => {
  const figureRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const mobileTitleId = useId();
  const mobileDescriptionId = useId();
  const isInView = useInView(figureRef, { amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const shouldAnimate = isInView && !reduceMotion;

  return (
    <figure ref={figureRef} className="aurora-architecture limitless-architecture">
      <div className="aurora-architecture-key" aria-hidden="true">
        <span><i className="is-write" /> Query path</span>
        <span><i className="is-control" /> Control plane</span>
      </div>
      <DesktopDiagram animate={shouldAnimate} titleId={titleId} descriptionId={descriptionId} />
      <MobileDiagram animate={shouldAnimate} titleId={mobileTitleId} descriptionId={mobileDescriptionId} />
    </figure>
  );
};

export default AuroraLimitlessAnimation;
