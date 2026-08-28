import React, { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import nerdKid from '../../Pictures/nerd-kid.jpg';

const loopTransition = {
  duration: 20,
  ease: 'linear',
  repeat: Infinity,
  repeatDelay: 1,
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

const SqlQuery = ({ animate, kind, mobile = false }) => {
  const isWrite = kind === 'write';
  const box = mobile
    ? { x: 35, y: 130, width: 330, height: 70 }
    : { x: isWrite ? 20 : 550, y: 48, width: 310, height: 78 };
  const targetX = mobile ? (isWrite ? 170 : 230) : (isWrite ? 400 : 480);
  const targetY = mobile ? 125 : 130;
  const centerX = box.x + box.width / 2;
  const centerY = box.y + box.height / 2;
  const queryAnimation = isWrite
    ? {
        opacity: [0, 1, 1, 1, 0, 0],
        x: [0, 0, 0, targetX - centerX, targetX - centerX, targetX - centerX],
        y: [0, 0, 0, targetY - centerY, targetY - centerY, targetY - centerY],
        scale: [0.96, 1, 1, 0.08, 0.08, 0.08],
        times: [0, 0.015, 0.1, 0.11, 0.13, 1],
      }
    : {
        opacity: [0, 0, 1, 1, 1, 0, 0],
        x: [0, 0, 0, 0, targetX - centerX, targetX - centerX, targetX - centerX],
        y: [0, 0, 0, 0, targetY - centerY, targetY - centerY, targetY - centerY],
        scale: [0.96, 0.96, 1, 1, 0.08, 0.08, 0.08],
        times: [0, 0.53, 0.55, 0.65, 0.68, 0.7, 1],
      };

  return (
    <motion.g
      className={`aurora-sql-query is-${kind}`}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0.96 }}
      animate={animate ? {
        opacity: queryAnimation.opacity,
        x: queryAnimation.x,
        y: queryAnimation.y,
        scale: queryAnimation.scale,
      } : { opacity: 0 }}
      transition={{ ...loopTransition, times: queryAnimation.times }}
      style={{ transformOrigin: `${centerX}px ${centerY}px` }}
    >
      <rect x={box.x} y={box.y} width={box.width} height={box.height} rx="8" />
      {isWrite ? (
        <>
          <text x={box.x + 14} y={box.y + 28}>UPDATE players SET robux = robux + 100</text>
          <text x={box.x + 14} y={box.y + 52}>WHERE username = 'Builderman';</text>
        </>
      ) : (
        <>
          <text x={box.x + 14} y={box.y + 28}>SELECT robux FROM players</text>
          <text x={box.x + 14} y={box.y + 52}>WHERE username = 'Builderman';</text>
        </>
      )}
    </motion.g>
  );
};

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
            transition={{ ...loopTransition, delay: index * 0.1, times: [0, 0.28, 0.32, 0.37, 0.4, 1] }}
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
      <rect x="15" y="365" width="810" height="135" rx="10" />
      <text className="aurora-storage-title" x="45" y="393">SHARED DISTRIBUTED STORAGE</text>
      <StorageLayer animate={animate} />
    </g>

    <SqlQuery animate={animate} kind="write" />
    <SqlQuery animate={animate} kind="read" />

    <FlowDot animate={animate} kind="write" x={[120, 120, 160, 160, 120]} y={[365, 365, 408, 408, 365]} times={[0, 0.29, 0.34, 0.38, 0.4]} />
    <FlowDot animate={animate} kind="write" x={[120, 120, 420, 420, 120]} y={[365, 365, 408, 408, 365]} times={[0, 0.29, 0.34, 0.38, 0.4]} delay={0.1} />
    <FlowDot animate={animate} kind="write" x={[120, 120, 680, 680, 120]} y={[365, 365, 408, 408, 365]} times={[0, 0.29, 0.34, 0.38, 0.4]} delay={0.2} />

    <FlowDot
      animate={animate}
      kind="write"
      x={[400, 400, 400, 120, 120, 120, 120, 120, 120, 400, 400]}
      y={[130, 130, 150, 150, 200, 365, 365, 200, 150, 150, 130]}
      times={[0, 0.13, 0.15, 0.19, 0.22, 0.28, 0.4, 0.45, 0.48, 0.51, 0.52]}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[480, 480, 480, 320, 320, 320, 320, 320, 480, 480]}
      y={[130, 130, 160, 160, 200, 365, 200, 160, 160, 130]}
      times={[0, 0.7, 0.73, 0.76, 0.79, 0.84, 0.89, 0.91, 0.94, 0.96]}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[480, 480, 480, 520, 520, 520, 520, 520, 480, 480]}
      y={[130, 130, 160, 160, 200, 365, 200, 160, 160, 130]}
      times={[0, 0.7, 0.73, 0.76, 0.79, 0.84, 0.89, 0.91, 0.94, 0.96]}
      delay={0.2}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[480, 480, 480, 720, 720, 720, 720, 720, 480, 480]}
      y={[130, 130, 160, 160, 200, 365, 200, 160, 160, 130]}
      times={[0, 0.7, 0.73, 0.76, 0.79, 0.84, 0.89, 0.91, 0.94, 0.96]}
      delay={0.4}
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
      <path d="M230 125 V175" />
      <path d="M148 175 H338" />
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

    <FlowDot animate={animate} kind="write" x={[52, 52, 98, 98, 52]} y={[420, 420, 455, 455, 420]} times={[0, 0.29, 0.34, 0.38, 0.4]} />
    <FlowDot animate={animate} kind="write" x={[52, 52, 202, 202, 52]} y={[420, 420, 455, 455, 420]} times={[0, 0.29, 0.34, 0.38, 0.4]} delay={0.1} />
    <FlowDot animate={animate} kind="write" x={[52, 52, 306, 306, 52]} y={[420, 420, 455, 455, 420]} times={[0, 0.29, 0.34, 0.38, 0.4]} delay={0.2} />

    <FlowDot
      animate={animate}
      kind="write"
      x={[170, 170, 170, 52, 52, 52, 52, 52, 52, 170, 170]}
      y={[125, 125, 160, 160, 215, 420, 420, 215, 160, 160, 125]}
      times={[0, 0.13, 0.15, 0.19, 0.22, 0.28, 0.4, 0.45, 0.48, 0.51, 0.52]}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[230, 230, 230, 148, 148, 148, 148, 148, 230, 230]}
      y={[125, 125, 175, 175, 215, 420, 215, 175, 175, 125]}
      times={[0, 0.7, 0.73, 0.76, 0.79, 0.84, 0.89, 0.91, 0.94, 0.96]}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[230, 230, 230, 243, 243, 243, 243, 243, 230, 230]}
      y={[125, 125, 175, 175, 215, 420, 215, 175, 175, 125]}
      times={[0, 0.7, 0.73, 0.76, 0.79, 0.84, 0.89, 0.91, 0.94, 0.96]}
      delay={0.2}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[230, 230, 230, 338, 338, 338, 338, 338, 230, 230]}
      y={[125, 125, 175, 175, 215, 420, 215, 175, 175, 125]}
      times={[0, 0.7, 0.73, 0.76, 0.79, 0.84, 0.89, 0.91, 0.94, 0.96]}
      delay={0.4}
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
