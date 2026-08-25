import React, { useId, useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import jackedDudeComputer from '../../Pictures/jacked-dude-computer.jpeg';

const loop = {
  duration: 11,
  ease: 'linear',
  repeat: Infinity,
  repeatDelay: 1,
};

const Node = ({ x, y, width, height, eyebrow, label, className = '' }) => (
  <g className={`aurora-node dsql-node ${className}`}>
    <rect x={x} y={y} width={width} height={height} rx="8" />
    <text className="aurora-node-eyebrow" x={x + width / 2} y={y + 25} textAnchor="middle">{eyebrow}</text>
    <text className="aurora-node-label" x={x + width / 2} y={y + 52} textAnchor="middle">{label}</text>
  </g>
);

const Journal = ({ x, y, width = 100, height = 130, number }) => (
  <g className="dsql-journal">
    <rect x={x} y={y} width={width} height={height} rx="8" />
    <text x={x + width / 2} y={y + height / 2 - 8} textAnchor="middle">JOURNAL</text>
    <text className="dsql-journal-number" x={x + width / 2} y={y + height / 2 + 18} textAnchor="middle">{number}</text>
  </g>
);

const FlowDot = ({ animate, kind, x, y, times, delay = 0, radius = 6 }) => (
  <motion.circle
    className={`aurora-flow-dot is-${kind}`}
    r={radius}
    initial={{ cx: x[0], cy: y[0], opacity: 0 }}
    animate={animate ? {
      cx: x,
      cy: y,
      opacity: x.map((_, index) => index === 0 || index === x.length - 1 ? 0 : 1),
    } : { opacity: 0 }}
    transition={{ ...loop, delay, times }}
  />
);

const Client = ({ mobile = false, clipId }) => {
  const frame = mobile
    ? { x: 110, y: -105, width: 180, height: 100 }
    : { x: 355, y: -105, width: 170, height: 90 };

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
        href={jackedDudeComputer}
        {...frame}
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${clipId})`}
      />
      <rect className="aurora-client-image-frame" {...frame} rx="8" />
    </g>
  );
};

const Clock = ({ animate, x, y }) => (
  <g className="dsql-clock">
    <motion.circle
      className="dsql-clock-pulse"
      cx={x}
      cy={y}
      r="25"
      animate={animate ? { opacity: [0, 0, 0.3, 0, 0], scale: [0.8, 0.8, 1.2, 1.5, 1.5] } : { opacity: 0 }}
      transition={{ ...loop, times: [0, 0.38, 0.43, 0.52, 1] }}
      style={{ transformOrigin: `${x}px ${y}px` }}
    />
    <circle cx={x} cy={y} r="18" />
    <path d={`M${x} ${y} V${y - 9} M${x} ${y} L${x + 7} ${y + 5}`} />
    <text x={x} y={y + 34} textAnchor="middle">CLOCK</text>
  </g>
);

const Storage = ({ mobile = false }) => {
  const cards = mobile
    ? [{ x: 35, label: 'A-F' }, { x: 150, label: 'G-S' }, { x: 265, label: 'T-Z' }]
    : [{ x: 100, label: 'A-F' }, { x: 350, label: 'G-S' }, { x: 600, label: 'T-Z' }];
  const y = mobile ? 595 : 570;
  const width = mobile ? 100 : 180;

  return cards.map((card) => (
    <Node
      key={card.label}
      x={card.x}
      y={y}
      width={width}
      height={68}
      eyebrow={`KEYS ${card.label}`}
      label="Storage"
    />
  ));
};

const DesktopDiagram = ({ animate, titleId, descriptionId, clipId }) => (
  <svg
    className="aurora-diagram aurora-diagram-desktop dsql-diagram"
    viewBox="0 -125 880 790"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
  >
    <title id={titleId}>Aurora DSQL query processor, adjudicators, journals, crossbar, and storage</title>
    <desc id={descriptionId}>
      Reads travel directly from the query processor to storage. Commits pass through transaction adjudicators and journals, converge at a crossbar, and fan out to distributed storage.
    </desc>

    <g className="aurora-connectors dsql-commit-connectors">
      <path d="M440 -15 V25" />
      <path d="M440 105 V130 H290 V150" />
      <path d="M440 130 H590 V150" />
      <path d="M290 232 V270" />
      <path d="M590 232 V270" />
      <path d="M290 400 L390 440" />
      <path d="M590 400 L490 440" />
      <path d="M440 515 V540 H190 V570" />
      <path d="M440 540 V570" />
      <path d="M440 540 H690 V570" />
    </g>
    <g className="dsql-read-connectors">
      <path d="M355 65 H80 V540 H190 V570" />
    </g>
    <path className="dsql-clock-connector" d="M525 65 H552" />

    <Client clipId={clipId} />
    <Node x={355} y={25} width={170} height={80} eyebrow="SQL FRONTEND" label="Query processor" className="is-router" />
    <Clock animate={animate} x={575} y={65} />
    <Node x={200} y={150} width={180} height={82} eyebrow="TRANSACTION" label="Adjudicator 1" />
    <Node x={500} y={150} width={180} height={82} eyebrow="TRANSACTION" label="Adjudicator 2" />
    <Journal x={240} y={270} number="1" />
    <Journal x={540} y={270} number="2" />
    <Node x={340} y={440} width={200} height={75} eyebrow="ROUTING" label="Crossbar" className="is-router" />

    <g className="aurora-storage-layer dsql-storage-layer">
      <rect x="80" y="540" width="720" height="108" rx="10" />
      <Storage />
    </g>

    <FlowDot
      animate={animate}
      kind="read"
      x={[440, 440, 440]}
      y={[-15, -15, 25]}
      times={[0, 0.01, 0.05]}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[355, 355, 80, 80, 190, 190, 80, 80, 355, 355]}
      y={[65, 65, 65, 540, 540, 570, 540, 65, 65, 65]}
      times={[0, 0.06, 0.11, 0.23, 0.28, 0.32, 0.37, 0.48, 0.53, 0.56]}
    />
    <FlowDot
      animate={animate}
      kind="write"
      x={[440, 440, 440]}
      y={[-15, -15, 25]}
      times={[0, 0.36, 0.42]}
    />
    <FlowDot
      animate={animate}
      kind="write"
      x={[420, 420, 290, 290, 290, 290, 390, 390]}
      y={[105, 130, 130, 150, 232, 270, 440, 440]}
      times={[0, 0.42, 0.47, 0.5, 0.56, 0.59, 0.7, 0.72]}
    />
    <FlowDot
      animate={animate}
      kind="write"
      x={[460, 460, 590, 590, 590, 590, 490, 490]}
      y={[105, 130, 130, 150, 232, 270, 440, 440]}
      times={[0, 0.42, 0.47, 0.5, 0.56, 0.59, 0.7, 0.72]}
      delay={0.18}
    />
    <FlowDot animate={animate} kind="write" radius={5} x={[440, 440, 190, 190]} y={[515, 540, 540, 570]} times={[0, 0.73, 0.8, 0.85]} />
    <FlowDot animate={animate} kind="write" radius={5} x={[440, 440, 440, 440]} y={[515, 540, 540, 570]} times={[0, 0.73, 0.8, 0.85]} delay={0.12} />
    <FlowDot animate={animate} kind="write" radius={5} x={[440, 440, 690, 690]} y={[515, 540, 540, 570]} times={[0, 0.73, 0.8, 0.85]} delay={0.24} />
  </svg>
);

const MobileDiagram = ({ animate, titleId, descriptionId, clipId }) => (
  <svg
    className="aurora-diagram aurora-diagram-mobile dsql-diagram"
    viewBox="0 -125 400 855"
    role="img"
    aria-labelledby={`${titleId} ${descriptionId}`}
  >
    <title id={titleId}>Aurora DSQL query processor, adjudicators, journals, crossbar, and storage</title>
    <desc id={descriptionId}>
      Reads travel directly to storage. Commits pass through adjudicators, journals, and the crossbar before reaching distributed storage.
    </desc>

    <g className="aurora-connectors dsql-commit-connectors">
      <path d="M200 -5 V30" />
      <path d="M200 110 V135 H105 V155" />
      <path d="M200 135 H295 V155" />
      <path d="M105 237 V275 M295 237 V275" />
      <path d="M110 405 L150 445 M300 405 L250 445" />
      <path d="M200 520 V555 H85 V595" />
      <path d="M200 555 V595" />
      <path d="M200 555 H315 V595" />
    </g>
    <g className="dsql-read-connectors">
      <path d="M115 70 H15 V555 H85 V595" />
    </g>
    <path className="dsql-clock-connector" d="M285 70 H307" />

    <Client mobile clipId={clipId} />
    <Node x={115} y={30} width={170} height={80} eyebrow="SQL FRONTEND" label="Query processor" className="is-router" />
    <Clock animate={animate} x={330} y={70} />
    <Node x={20} y={155} width={170} height={82} eyebrow="TRANSACTION" label="Adjudicator 1" />
    <Node x={210} y={155} width={170} height={82} eyebrow="TRANSACTION" label="Adjudicator 2" />
    <Journal x={70} y={275} width={80} height={130} number="1" />
    <Journal x={260} y={275} width={80} height={130} number="2" />
    <Node x={100} y={445} width={200} height={75} eyebrow="ROUTING" label="Crossbar" className="is-router" />

    <g className="aurora-storage-layer dsql-storage-layer">
      <rect x="20" y="555" width="360" height="125" rx="10" />
      <Storage mobile />
    </g>

    <FlowDot
      animate={animate}
      kind="read"
      x={[200, 200, 200]}
      y={[-5, -5, 30]}
      times={[0, 0.01, 0.05]}
    />
    <FlowDot
      animate={animate}
      kind="read"
      x={[115, 115, 15, 15, 85, 85, 15, 15, 115, 115]}
      y={[70, 70, 70, 555, 555, 595, 555, 70, 70, 70]}
      times={[0, 0.06, 0.11, 0.23, 0.28, 0.32, 0.37, 0.48, 0.53, 0.56]}
    />
    <FlowDot animate={animate} kind="write" x={[200, 200, 200]} y={[-5, -5, 30]} times={[0, 0.36, 0.42]} />
    <FlowDot animate={animate} kind="write" x={[180, 180, 105, 105, 105, 110, 150, 150]} y={[110, 135, 135, 155, 237, 405, 445, 445]} times={[0, 0.42, 0.47, 0.5, 0.56, 0.64, 0.7, 0.72]} />
    <FlowDot animate={animate} kind="write" x={[220, 220, 295, 295, 295, 300, 250, 250]} y={[110, 135, 135, 155, 237, 405, 445, 445]} times={[0, 0.42, 0.47, 0.5, 0.56, 0.64, 0.7, 0.72]} delay={0.18} />
    <FlowDot animate={animate} kind="write" radius={5} x={[200, 200, 85, 85]} y={[520, 555, 555, 595]} times={[0, 0.73, 0.8, 0.85]} />
    <FlowDot animate={animate} kind="write" radius={5} x={[200, 200, 200, 200]} y={[520, 555, 555, 595]} times={[0, 0.73, 0.8, 0.85]} delay={0.12} />
    <FlowDot animate={animate} kind="write" radius={5} x={[200, 200, 315, 315]} y={[520, 555, 555, 595]} times={[0, 0.73, 0.8, 0.85]} delay={0.24} />
  </svg>
);

const AuroraDsqlAnimation = () => {
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
    <figure ref={figureRef} className="aurora-architecture dsql-architecture">
      <div className="aurora-architecture-key" aria-hidden="true">
        <span><i className="is-write" /> Commit path</span>
        <span><i className="is-read" /> Read path</span>
      </div>
      <DesktopDiagram animate={shouldAnimate} titleId={desktopTitleId} descriptionId={desktopDescriptionId} clipId={desktopClipId} />
      <MobileDiagram animate={shouldAnimate} titleId={mobileTitleId} descriptionId={mobileDescriptionId} clipId={mobileClipId} />
    </figure>
  );
};

export default AuroraDsqlAnimation;
