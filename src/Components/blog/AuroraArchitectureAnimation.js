import React, { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import nerdKid from '../../Pictures/nerd-kid.jpg';

const loopTransition = {
  duration: 8,
  ease: 'linear',
  repeat: Infinity,
  repeatDelay: 0.8,
};

const Node = ({ x, y, width, height, eyebrow, label, className = '' }) => (
  <g className={`aurora-node ${className}`}>
    <rect x={x} y={y} width={width} height={height} rx="8" />
    <text className="aurora-node-eyebrow" x={x + width / 2} y={y + 27} textAnchor="middle">
      {eyebrow}
    </text>
    <text className="aurora-node-label" x={x + width / 2} y={y + 53} textAnchor="middle">
      {label}
    </text>
  </g>
);

const FlowDot = ({ animate, x, y, times, kind, delay = 0 }) => (
  <motion.circle
    className={`aurora-flow-dot is-${kind}`}
    r="6"
    initial={{ cx: x[0], cy: y[0], opacity: 0 }}
    animate={animate ? { cx: x, cy: y, opacity: x.map((_, index) => index === 0 || index === x.length - 1 ? 0 : 1) } : { opacity: 0 }}
    transition={{ ...loopTransition, delay, times }}
  />
);

const Client = ({ mobile = false, clipId }) => {
  const frame = mobile
    ? { x: 110, y: 45, width: 180, height: 80 }
    : { x: 355, y: 40, width: 170, height: 90 };

  return (
    <g className="aurora-client-image">
      <defs>
        <clipPath id={clipId}>
          <rect {...frame} rx="8" />
        </clipPath>
      </defs>
      <text className="aurora-client-label" x={frame.x + frame.width / 2} y={frame.y - 12} textAnchor="middle">
        CLIENT
      </text>
      <image
        href={nerdKid}
        {...frame}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
      <rect className="aurora-client-image-frame" {...frame} rx="8" />
    </g>
  );
};

const StorageLayer = ({ animate, mobile = false }) => {
  const cells = mobile
    ? [
        { x: 34, label: 'AZ 1' },
        { x: 151, label: 'AZ 2' },
        { x: 268, label: 'AZ 3' },
      ]
    : [
        { x: 45, label: 'AZ 1' },
        { x: 305, label: 'AZ 2' },
        { x: 565, label: 'AZ 3' },
      ];
  const y = mobile ? 455 : 408;
  const width = mobile ? 98 : 230;
  const height = mobile ? 100 : 62;

  return (
    <g className="aurora-storage-cells">
      {cells.map((cell, index) => (
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
            transition={{ ...loopTransition, delay: index * 0.12, times: [0, 0.28, 0.34, 0.46, 0.54, 1] }}
          />
          <text className="aurora-storage-az" x={cell.x + width / 2} y={y + 26} textAnchor="middle">
            {cell.label}
          </text>
          <text className="aurora-storage-copy" x={cell.x + width / 2} y={y + 51} textAnchor="middle">
            storage copies
          </text>
        </g>
      ))}
    </g>
  );
};

const DesktopDiagram = ({ animate, titleId, descriptionId, clipId }) => (
  <svg
    className="aurora-diagram aurora-diagram-desktop"
    viewBox="0 0 880 520"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
  >
    <title id={titleId}>Aurora writer, read replicas, and distributed storage architecture</title>
    <desc id={descriptionId}>
      Applications send writes to one writer and reads to multiple replicas. All compute instances use the same storage distributed across three availability zones.
    </desc>

    <text className="aurora-flow-label" x="235" y="138">write</text>
    <text className="aurora-flow-label" x="570" y="148">reads</text>

    <g className="aurora-connectors">
      <path d="M400 130 V150 H120 V200" />
      <path d="M480 130 V160 M320 160 H720" />
      <path d="M320 160 V200 M520 160 V200 M720 160 V200" />
      <path d="M120 282 V365" />
      <path d="M320 282 V365 M520 282 V365 M720 282 V365" />
    </g>

    <Client clipId={clipId} />
    <Node x={45} y={200} width={150} height={82} eyebrow="ONE INSTANCE" label="Writer" className="is-writer" />
    <Node x={245} y={200} width={150} height={82} eyebrow="READ ONLY" label="Replica 1" />
    <Node x={445} y={200} width={150} height={82} eyebrow="READ ONLY" label="Replica 2" />
    <Node x={645} y={200} width={150} height={82} eyebrow="READ ONLY" label="Replica 3" />

    <g className="aurora-storage-layer">
      <rect x="25" y="365" width="770" height="135" rx="10" />
      <text className="aurora-storage-title" x="45" y="393">SHARED DISTRIBUTED STORAGE</text>
      <StorageLayer animate={animate} />
    </g>

    <FlowDot
      animate={animate}
      kind="write"
      x={[400, 400, 120, 120, 120]}
      y={[130, 150, 150, 200, 365]}
      times={[0, 0.06, 0.18, 0.23, 0.38]}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[480, 480, 320, 320, 320, 320, 320, 480, 480]}
      y={[130, 160, 160, 200, 365, 200, 160, 160, 130]}
      times={[0, 0.06, 0.16, 0.2, 0.34, 0.48, 0.52, 0.62, 0.68]}
      delay={3.5}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[480, 480, 520, 520, 520, 520, 520, 480, 480]}
      y={[130, 160, 160, 200, 365, 200, 160, 160, 130]}
      times={[0, 0.06, 0.16, 0.2, 0.34, 0.48, 0.52, 0.62, 0.68]}
      delay={3.75}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[480, 480, 720, 720, 720, 720, 720, 480, 480]}
      y={[130, 160, 160, 200, 365, 200, 160, 160, 130]}
      times={[0, 0.06, 0.16, 0.2, 0.34, 0.48, 0.52, 0.62, 0.68]}
      delay={4}
    />
  </svg>
);

const MobileDiagram = ({ animate, titleId, descriptionId, clipId }) => (
  <svg
    className="aurora-diagram aurora-diagram-mobile"
    viewBox="0 0 400 625"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
  >
    <title id={titleId}>Aurora writer, read replicas, and distributed storage architecture</title>
    <desc id={descriptionId}>
      Applications send writes to one writer and reads to multiple replicas. All compute instances use the same storage distributed across three availability zones.
    </desc>

    <text className="aurora-flow-label" x="66" y="148">write</text>
    <text className="aurora-flow-label" x="280" y="162">reads</text>

    <g className="aurora-connectors">
      <path d="M170 125 V160 H52 V215" />
      <path d="M230 125 V175 H338" />
      <path d="M148 175 V215 M243 175 V215 M338 175 V215" />
      <path d="M52 305 V420" />
      <path d="M148 305 V420 M243 305 V420 M338 305 V420" />
    </g>

    <Client mobile clipId={clipId} />
    <Node x={10} y={215} width={85} height={90} eyebrow="WRITES" label="Writer" className="is-writer" />
    <Node x={105} y={215} width={85} height={90} eyebrow="READ" label="Replica 1" />
    <Node x={200} y={215} width={85} height={90} eyebrow="READ" label="Replica 2" />
    <Node x={295} y={215} width={85} height={90} eyebrow="READ" label="Replica 3" />

    <g className="aurora-storage-layer">
      <rect x="20" y="420" width="365" height="180" rx="10" />
      <text className="aurora-storage-title" x="34" y="445">SHARED DISTRIBUTED STORAGE</text>
      <StorageLayer animate={animate} mobile />
    </g>

    <FlowDot
      animate={animate}
      kind="write"
      x={[170, 170, 52, 52, 52]}
      y={[125, 160, 160, 215, 420]}
      times={[0, 0.06, 0.18, 0.24, 0.4]}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[230, 230, 148, 148, 148, 148, 148, 230, 230]}
      y={[125, 175, 175, 215, 420, 215, 175, 175, 125]}
      times={[0, 0.07, 0.15, 0.2, 0.36, 0.52, 0.57, 0.66, 0.73]}
      delay={3.5}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[230, 230, 243, 243, 243, 243, 243, 230, 230]}
      y={[125, 175, 175, 215, 420, 215, 175, 175, 125]}
      times={[0, 0.07, 0.15, 0.2, 0.36, 0.52, 0.57, 0.66, 0.73]}
      delay={3.75}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[230, 230, 338, 338, 338, 338, 338, 230, 230]}
      y={[125, 175, 175, 215, 420, 215, 175, 175, 125]}
      times={[0, 0.07, 0.15, 0.2, 0.36, 0.52, 0.57, 0.66, 0.73]}
      delay={4}
    />
  </svg>
);

const AuroraArchitectureAnimation = () => {
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
    <figure ref={figureRef} className="aurora-architecture">
      <div className="aurora-architecture-key" aria-hidden="true">
        <span><i className="is-write" /> Write path</span>
        <span><i className="is-read" /> Read path</span>
      </div>
      <DesktopDiagram animate={shouldAnimate} titleId={titleId} descriptionId={descriptionId} clipId={desktopClipId} />
      <MobileDiagram animate={shouldAnimate} titleId={mobileTitleId} descriptionId={mobileDescriptionId} clipId={mobileClipId} />
    </figure>
  );
};

export default AuroraArchitectureAnimation;
