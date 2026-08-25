import React, { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import dogComputer from '../../Pictures/dog-computer.jpg';

const transition = {
  duration: 10,
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

const Shard = ({ x, y, width, label, keys, mobile = false }) => (
  <g className="aurora-node limitless-node limitless-shard">
    <rect x={x} y={y} width={width} height={mobile ? 95 : 100} rx="8" />
    <text className="aurora-node-eyebrow" x={x + width / 2} y={y + 23} textAnchor="middle">
      HASHED KEY SUBSET
    </text>
    <text className="aurora-node-label" x={x + width / 2} y={y + 49} textAnchor="middle">
      {label}
    </text>
    <text className="limitless-shard-keys" x={x + width / 2} y={y + 76} textAnchor="middle">
      {keys}
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

const KeyFlow = ({ animate, value, x, y, times, delay = 0 }) => (
  <motion.g
    className="limitless-key-flow"
    initial={{ x: x[0], y: y[0], opacity: 0 }}
    animate={animate ? {
      x,
      y,
      opacity: x.map((_, index) => index === 0 || index === x.length - 1 ? 0 : 1),
    } : { opacity: 0 }}
    transition={{ ...transition, delay, times }}
  >
    <circle r="6" />
    <text x="0" y="-11" textAnchor="middle">{value}</text>
  </motion.g>
);

const Client = ({ mobile = false, clipId }) => {
  const frame = mobile
    ? { x: 110, y: 30, width: 180, height: 80 }
    : { x: 355, y: 25, width: 170, height: 80 };

  return (
    <g className="aurora-client-image">
      <defs>
        <clipPath id={clipId}>
          <rect {...frame} rx="8" />
        </clipPath>
      </defs>
      <text className="aurora-client-label" x={frame.x + frame.width / 2} y={frame.y - 10} textAnchor="middle">
        CLIENT
      </text>
      <image
        href={dogComputer}
        {...frame}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
      <rect className="aurora-client-image-frame" {...frame} rx="8" />
    </g>
  );
};

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
        transition={{ ...transition, delay: index * 0.12, times: [0, 0.4, 0.47, 0.56, 0.64, 1] }}
      />
      <text className="aurora-storage-az" x={cell.x + width / 2} y={y + 27} textAnchor="middle">{cell.label}</text>
      <text className="aurora-storage-copy" x={cell.x + width / 2} y={y + 50} textAnchor="middle">storage copies</text>
    </g>
  ));
};

const DesktopDiagram = ({ animate, titleId, descriptionId, clipId }) => (
  <svg
    className="aurora-diagram aurora-diagram-desktop limitless-diagram"
    viewBox="0 0 880 630"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
  >
    <title id={titleId}>Aurora Limitless architecture with routers, shards, control plane, and distributed storage</title>
    <desc id={descriptionId}>
      One read request enters one router. The router hashes each dog ID, reads from the shards that own those noncontiguous key subsets, and returns one combined result.
    </desc>

    <rect className="limitless-boundary" x="20" y="130" width="840" height="485" rx="12" />
    <g className="aurora-connectors">
      <path d="M440 105 V175" />
      <path d="M435 257 V300" />
      <path d="M115 300 H595" />
      <path d="M115 300 V335 M275 300 V335 M435 300 V335 M595 300 V335" />
      <path d="M115 435 V485 M275 435 V485 M435 435 V485 M595 435 V485" />
    </g>
    <g className="limitless-control-connectors">
      <path d="M710 225 H690 V120 H500 V175" />
    </g>

    <Client clipId={clipId} />
    <Node x={50} y={175} width={130} height={82} eyebrow="QUERY LAYER" label="Router 1" className="is-router" />
    <Node x={210} y={175} width={130} height={82} eyebrow="QUERY LAYER" label="Router 2" className="is-router" />
    <Node x={370} y={175} width={130} height={82} eyebrow="SELECTED ROUTER" label="Router 3" className="is-router is-selected" />
    <Node x={530} y={175} width={130} height={82} eyebrow="QUERY LAYER" label="Router 4" className="is-router" />
    <text className="limitless-query-keys" x="548" y="78">SELECT dog_treats FROM dogs</text>
    <text className="limitless-query-keys" x="548" y="98">WHERE dog_id IN (17, 42, 8)</text>
    <text className="limitless-hash-label" x="435" y="286" textAnchor="middle">hash(dog_id)</text>
    <Shard x={50} y={335} width={130} label="Shard 1" keys="17 · 104 · 901" />
    <Shard x={210} y={335} width={130} label="Shard 2" keys="42 · 205 · 777" />
    <Shard x={370} y={335} width={130} label="Shard 3" keys="8 · 319 · 650" />
    <Shard x={530} y={335} width={130} label="Shard 4" keys="63 · 488 · 812" />

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

    <FlowDot animate={animate} kind="read" x={[440, 440, 440, 440, 435]} y={[105, 105, 145, 175, 257]} times={[0, 0.05, 0.108, 0.151, 0.24]} />
    <KeyFlow animate={animate} value="17" x={[435, 435, 435, 115, 115, 115, 115, 115, 115, 115, 435, 435, 435]} y={[257, 257, 300, 300, 335, 435, 485, 435, 335, 300, 300, 257, 257]} times={[0, 0.24, 0.26, 0.412, 0.429, 0.476, 0.5, 0.524, 0.571, 0.588, 0.74, 0.76, 0.78]} />
    <KeyFlow animate={animate} value="42" x={[435, 435, 435, 275, 275, 275, 275, 275, 275, 275, 435, 435, 435]} y={[257, 257, 300, 300, 335, 435, 485, 435, 335, 300, 300, 257, 257]} times={[0, 0.24, 0.26, 0.336, 0.353, 0.4, 0.424, 0.448, 0.495, 0.512, 0.588, 0.608, 0.628]} />
    <KeyFlow animate={animate} value="8" x={[435, 435, 435, 435, 435, 435, 435, 435, 435, 435, 435]} y={[257, 257, 300, 335, 435, 485, 435, 335, 300, 257, 257]} times={[0, 0.24, 0.26, 0.277, 0.324, 0.348, 0.372, 0.419, 0.436, 0.456, 0.476]} />
    <FlowDot animate={animate} kind="read" x={[435, 435, 435, 440, 440, 440]} y={[257, 257, 175, 145, 145, 105]} times={[0, 0.8, 0.873, 0.9, 0.904, 0.94]} />
    <FlowDot animate={animate} kind="control" x={[710, 710, 690, 690, 500, 500]} y={[225, 225, 225, 120, 120, 175]} times={[0, 0.08, 0.099, 0.201, 0.386, 0.44]} delay={4.5} />
  </svg>
);

const MobileDiagram = ({ animate, titleId, descriptionId, clipId }) => (
  <svg
    className="aurora-diagram aurora-diagram-mobile limitless-diagram"
    viewBox="0 0 400 700"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
  >
    <title id={titleId}>Aurora Limitless architecture with routers, shards, control plane, and distributed storage</title>
    <desc id={descriptionId}>
      One dog-treat read enters one router, which hashes multiple dog IDs, reads the relevant shards, and returns one combined result.
    </desc>

    <rect className="limitless-boundary" x="10" y="155" width="380" height="525" rx="12" />
    <g className="aurora-connectors">
      <path d="M200 110 V145 H156 V180" />
      <path d="M156 262 V315" />
      <path d="M62 315 H250" />
      <path d="M62 315 V345 M156 315 V345 M250 315 V345" />
      <path d="M62 440 V510 M156 440 V510 M250 440 V510" />
    </g>
    <g className="limitless-control-connectors">
      <path d="M305 225 H300 V165 H198 V180" />
    </g>

    <Client mobile clipId={clipId} />
    <Node x={20} y={180} width={84} height={82} eyebrow="QUERY" label="Router 1" className="is-router" />
    <Node x={114} y={180} width={84} height={82} eyebrow="SELECTED" label="Router 2" className="is-router is-selected" />
    <Node x={208} y={180} width={84} height={82} eyebrow="QUERY" label="Router 3" className="is-router" />
    <text className="limitless-query-keys" x="200" y="128" textAnchor="middle">SELECT dog_treats FROM dogs</text>
    <text className="limitless-query-keys" x="200" y="144" textAnchor="middle">WHERE dog_id IN (17, 42, 8)</text>
    <text className="limitless-hash-label" x="156" y="302" textAnchor="middle">hash(dog_id)</text>
    <Shard mobile x={20} y={345} width={84} label="Shard 1" keys="17,104,901" />
    <Shard mobile x={114} y={345} width={84} label="Shard 2" keys="42,205,777" />
    <Shard mobile x={208} y={345} width={84} label="Shard 3" keys="8,319,650" />

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

    <FlowDot animate={animate} kind="read" x={[200, 200, 200, 156, 156, 156]} y={[110, 110, 145, 145, 180, 262]} times={[0, 0.05, 0.093, 0.147, 0.19, 0.24]} />
    <KeyFlow animate={animate} value="17" x={[156, 156, 156, 62, 62, 62, 62, 62, 62, 62, 156, 156, 156]} y={[262, 262, 315, 315, 345, 440, 510, 440, 345, 315, 315, 262, 262]} times={[0, 0.24, 0.281, 0.353, 0.376, 0.449, 0.503, 0.557, 0.63, 0.653, 0.725, 0.766, 0.786]} />
    <KeyFlow animate={animate} value="42" x={[156, 156, 156, 156, 156, 156, 156, 156, 156, 156, 156]} y={[262, 262, 315, 345, 440, 510, 440, 345, 315, 262, 262]} times={[0, 0.24, 0.281, 0.304, 0.377, 0.431, 0.485, 0.558, 0.581, 0.622, 0.642]} />
    <KeyFlow animate={animate} value="8" x={[156, 156, 156, 250, 250, 250, 250, 250, 250, 250, 156, 156, 156]} y={[262, 262, 315, 315, 345, 440, 510, 440, 345, 315, 315, 262, 262]} times={[0, 0.24, 0.281, 0.353, 0.376, 0.449, 0.503, 0.557, 0.63, 0.653, 0.725, 0.766, 0.786]} />
    <FlowDot animate={animate} kind="read" x={[156, 156, 156, 200, 200, 200]} y={[262, 262, 180, 145, 145, 110]} times={[0, 0.8, 0.863, 0.89, 0.923, 0.95]} />
    <FlowDot animate={animate} kind="control" x={[305, 305, 300, 300, 198, 198]} y={[225, 225, 225, 165, 165, 180]} times={[0, 0.08, 0.09, 0.209, 0.41, 0.44]} delay={4.5} />
  </svg>
);

const AuroraLimitlessAnimation = () => {
  const figureRef = useRef(null);
  const titleId = useId();
  const descriptionId = useId();
  const desktopClipId = useId().replace(/:/g, '');
  const mobileTitleId = useId();
  const mobileDescriptionId = useId();
  const mobileClipId = useId().replace(/:/g, '');
  const isInView = useInView(figureRef, { amount: 0.25 });
  const reduceMotion = useReducedMotion();
  const shouldAnimate = isInView && !reduceMotion;

  return (
    <figure ref={figureRef} className="aurora-architecture limitless-architecture">
      <div className="aurora-architecture-key" aria-hidden="true">
        <span><i className="is-read" /> Read path</span>
        <span><i className="is-control" /> Control plane</span>
      </div>
      <DesktopDiagram animate={shouldAnimate} titleId={titleId} descriptionId={descriptionId} clipId={desktopClipId} />
      <MobileDiagram animate={shouldAnimate} titleId={mobileTitleId} descriptionId={mobileDescriptionId} clipId={mobileClipId} />
    </figure>
  );
};

export default AuroraLimitlessAnimation;
