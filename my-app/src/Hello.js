import * as React from 'react'
import { useTrail, useChain, useSprings, animated, useSpringRef } from '@react-spring/web'

import styles from './styles.module.css'

const COORDS = [
  [10, 20],
  [20, 20],
  [30, 20],
  [40, 20],
  [30, 30],
  [30, 40],
  [30, 50],
  [30, 60],
  [20, 60],
  [10, 60],
  [10, 50],
  [60, 20],
  [70, 20],
  [80, 20],
  [80, 30],
  [80, 40],
  [80, 50],
  [80, 60],
  [70, 60],
  [60, 60],
  [60, 50],
  [60, 40],
  [60, 30],
  [60, 20],
  [100, 20],
  [100, 30],
  [100, 40],
  [100, 50],
  [100, 60],
  [110, 20],
  [120, 20],
  [110, 40],
  [120, 40],
  [110, 60],
  [120, 60]
]

const STROKE_WIDTH = 0.5

const OFFSET = STROKE_WIDTH / 2

const MAX_WIDTH = 140 + OFFSET * 2
const MAX_HEIGHT = 90 + OFFSET * 2

export default function Grid() {
  const gridApi = useSpringRef()

  const gridSprings = useTrail(16, {
    ref: gridApi,
    from: {
      x2: 0,
      y2: 0,
    },
    to: {
      x2: MAX_WIDTH,
      y2: MAX_HEIGHT,
    },
  })

  const boxApi = useSpringRef()

  const [boxSprings] = useSprings(35, i => ({
    ref: boxApi,
    from: {
      scale: 0,
    },
    to: {
      scale: 1,
    },
    delay: i * 100,
    config: {
      mass: 1,
      tension: 400,
      friction: 20
    },
  }))

  useChain([gridApi, boxApi], [0, 1], 1500)

  return (
    <div className={styles['background-container-grid']}>
      <div className={styles.containergrid}>
        <svg viewBox={`0 0 ${MAX_WIDTH} ${MAX_HEIGHT}`}>
          <g>
            {gridSprings.map(({ x2 }, index) => (
              <animated.line
                x1={0}
                y1={index * 10 + OFFSET}
                x2={x2}
                y2={index * 10 + OFFSET}
                key={index}
                strokeWidth={STROKE_WIDTH}
                stroke="currentColor"
              />
            ))}
            {gridSprings.map(({ y2 }, index) => (
              <animated.line
                x1={index * 10 + OFFSET}
                y1={0}
                x2={index * 10 + OFFSET}
                y2={y2}
                key={index}
                strokeWidth={STROKE_WIDTH}
                stroke="currentColor"
              />
            ))}
          </g>
          {boxSprings.map(({ scale }, index) => (
            <animated.rect
              key={index}
              width={10}
              height={10}
              fill="currentColor"
              speed={30}
              style={{
                transformOrigin: `${5 + OFFSET * 2}px ${5 + OFFSET * 2}px`,
                transform: `translate(${COORDS[index][0] + OFFSET}px, ${COORDS[index][1] + OFFSET}px)`,
                scale,
              }}
            />
          ))}
        </svg>
      </div>
    </div>
  )
}
