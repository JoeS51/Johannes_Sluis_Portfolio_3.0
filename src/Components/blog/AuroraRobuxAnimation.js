import React, { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import nerdKid from '../../Pictures/nerd-kid.jpg';

const loop = {
  duration: 8,
  ease: 'linear',
  repeat: Infinity,
  repeatDelay: 1,
};

const QueryBubble = ({ animate, mobile = false }) => {
  const x = mobile ? 35 : 295;
  const y = mobile ? 235 : 52;
  const width = mobile ? 330 : 285;
  const height = mobile ? 108 : 112;

  return (
    <motion.g
      className="robux-query"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={animate ? {
        opacity: [0, 1, 1, 0, 0],
        scale: [0.92, 1, 1, 0.96, 0.96],
      } : { opacity: 1, scale: 1 }}
      transition={{ ...loop, times: [0, 0.08, 0.3, 0.38, 1] }}
      style={{ transformOrigin: `${x + width / 2}px ${y + height / 2}px` }}
    >
      <rect x={x} y={y} width={width} height={height} rx="10" />
      <text className="robux-query-prompt" x={x + 18} y={y + 25}>production=#</text>
      <text x={x + 18} y={y + 49}>UPDATE wallets</text>
      <text x={x + 18} y={y + 69}>SET robux = 999999</text>
      <text x={x + 18} y={y + 89}>WHERE user_id = 'me';</text>
    </motion.g>
  );
};

const Writer = ({ animate, mobile = false }) => {
  const x = mobile ? 115 : 650;
  const y = mobile ? 380 : 105;
  const width = mobile ? 170 : 180;
  const height = 90;

  return (
    <g className="aurora-node is-writer robux-writer">
      <rect x={x} y={y} width={width} height={height} rx="8" />
      <motion.rect
        className="robux-writer-flash"
        x={x}
        y={y}
        width={width}
        height={height}
        rx="8"
        animate={animate ? { opacity: [0, 0, 0.55, 0, 0] } : { opacity: 0 }}
        transition={{ ...loop, times: [0, 0.38, 0.46, 0.57, 1] }}
      />
      <text className="aurora-node-eyebrow" x={x + width / 2} y={y + 28} textAnchor="middle">CLASSIC AURORA</text>
      <text className="aurora-node-label" x={x + width / 2} y={y + 57} textAnchor="middle">Writer</text>
    </g>
  );
};

const Storage = ({ animate, mobile = false }) => {
  const outer = mobile
    ? { x: 35, y: 520, width: 330, height: 120 }
    : { x: 535, y: 310, width: 325, height: 135 };
  const cellY = mobile ? 565 : 355;
  const cellWidth = mobile ? 92 : 85;
  const cells = mobile ? [50, 154, 258] : [555, 660, 765];

  return (
    <g className="aurora-storage-layer robux-storage">
      <rect {...outer} rx="10" />
      <text className="aurora-storage-title" x={outer.x + 18} y={outer.y + 28}>DISTRIBUTED STORAGE</text>
      {cells.map((x, index) => (
        <g key={x}>
          <rect className="aurora-storage-cell" x={x} y={cellY} width={cellWidth} height="62" rx="6" />
          <motion.rect
            className="robux-storage-flash"
            x={x}
            y={cellY}
            width={cellWidth}
            height="62"
            rx="6"
            animate={animate ? { opacity: [0, 0, 0.35, 0.35, 0, 0] } : { opacity: 0 }}
            transition={{ ...loop, delay: index * 0.1, times: [0, 0.48, 0.54, 0.62, 0.7, 1] }}
          />
          <text className="aurora-storage-az" x={x + cellWidth / 2} y={cellY + 26} textAnchor="middle">AZ {index + 1}</text>
          <text className="aurora-storage-copy" x={x + cellWidth / 2} y={cellY + 48} textAnchor="middle">saved</text>
        </g>
      ))}
    </g>
  );
};

const RobuxReward = ({ animate, mobile = false }) => {
  const startX = mobile ? 200 : 715;
  const startY = mobile ? 500 : 265;
  const endX = mobile ? 200 : 245;
  const endY = mobile ? 195 : 265;

  return (
    <motion.g
      className="robux-reward"
      initial={{ opacity: 0, x: startX, y: startY }}
      animate={animate ? {
        opacity: [0, 0, 1, 1, 0],
        x: [startX, startX, startX, endX, endX],
        y: [startY, startY, startY, endY, endY],
        rotate: [0, 0, -8, 8, 8],
      } : { opacity: 1, x: endX, y: endY, rotate: 0 }}
      transition={{ ...loop, times: [0, 0.62, 0.67, 0.82, 0.92] }}
    >
      <rect x="-74" y="-25" width="148" height="50" rx="25" />
      <text x="0" y="6" textAnchor="middle">+999,999 ROBUX</text>
    </motion.g>
  );
};

const CommitMessage = ({ animate, mobile = false }) => (
  <motion.g
    className="robux-commit-message"
    initial={{ opacity: 0, scale: 0.9 }}
    animate={animate ? {
      opacity: [0, 0, 1, 1, 0],
      scale: [0.9, 0.9, 1.04, 1, 1],
    } : { opacity: 1, scale: 1 }}
    transition={{ ...loop, times: [0, 0.7, 0.76, 0.9, 1] }}
    style={{ transformOrigin: mobile ? '200px 675px' : '300px 425px' }}
  >
    <text x={mobile ? 200 : 280} y={mobile ? 680 : 430} textAnchor="middle">TRANSACTION COMMITTED. ECONOMY DESTROYED.</text>
  </motion.g>
);

const Diagram = ({ animate, mobile, titleId, descriptionId, clipId }) => {
  const client = mobile
    ? { x: 85, y: 35, width: 230, height: 165 }
    : { x: 25, y: 80, width: 230, height: 165 };

  return (
    <svg
      className={`aurora-diagram ${mobile ? 'aurora-diagram-mobile' : 'aurora-diagram-desktop'} robux-diagram`}
      viewBox={mobile ? '0 0 400 710' : '0 0 880 470'}
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
    >
      <title id={titleId}>A client sends a Robux update query through classic Aurora</title>
      <desc id={descriptionId}>
        A meme client sends an update query to the Aurora writer. The writer persists it to distributed storage and sends Robux back to the client.
      </desc>
      <defs>
        <clipPath id={clipId}>
          <rect {...client} rx="12" />
        </clipPath>
      </defs>

      <text className="robux-meme-title" x={client.x + client.width / 2} y={client.y - 14} textAnchor="middle">CLIENT IS LOCKED IN</text>
      <image href={nerdKid} {...client} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clipId})`} />
      <rect className="robux-client-frame" {...client} rx="12" />

      {!mobile && <QueryBubble animate={animate} />}
      <g className="aurora-connectors robux-connectors">
        {mobile ? (
          <>
            <path d="M200 343 V380" />
            <path d="M200 470 V520" />
          </>
        ) : (
          <>
            <path d="M255 165 H650" />
            <path d="M740 195 V310" />
          </>
        )}
      </g>
      <Writer animate={animate} mobile={mobile} />
      <Storage animate={animate} mobile={mobile} />

      <motion.circle
        className="aurora-flow-dot is-write"
        r="7"
        initial={{ opacity: 0 }}
        animate={animate ? {
          cx: mobile ? [200, 200, 200, 200, 200, 200] : [255, 255, 450, 650, 740, 740],
          cy: mobile ? [343, 343, 380, 470, 520, 520] : [165, 165, 165, 165, 195, 310],
          opacity: [0, 0, 1, 1, 1, 0],
        } : { opacity: 0 }}
        transition={{ ...loop, times: [0, 0.28, 0.34, 0.43, 0.52, 0.6] }}
      />
      <RobuxReward animate={animate} mobile={mobile} />
      <CommitMessage animate={animate} mobile={mobile} />
    </svg>
  );
};

const AuroraRobuxAnimation = () => {
  const figureRef = useRef(null);
  const desktopTitleId = useId();
  const desktopDescriptionId = useId();
  const desktopClipId = useId().replace(/:/g, '');
  const mobileTitleId = useId();
  const mobileDescriptionId = useId();
  const mobileClipId = useId().replace(/:/g, '');
  const isInView = useInView(figureRef, { amount: 0.2 });
  const reduceMotion = useReducedMotion();
  const shouldAnimate = isInView && !reduceMotion;

  return (
    <figure ref={figureRef} className="aurora-architecture aurora-robux-animation">
      <Diagram animate={shouldAnimate} titleId={desktopTitleId} descriptionId={desktopDescriptionId} clipId={desktopClipId} />
      <Diagram animate={shouldAnimate} mobile titleId={mobileTitleId} descriptionId={mobileDescriptionId} clipId={mobileClipId} />
    </figure>
  );
};

export default AuroraRobuxAnimation;
