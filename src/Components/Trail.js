import React from 'react'
import { useTrail, a } from '@react-spring/web'

import styles from '../styles.module.css'

const Trail = ({ open, children, animationConfig, itemHeight = 110, trailStyle }) => {
  const items = React.Children.toArray(children)
  const trail = useTrail(items.length, {
    config: animationConfig || { mass: 5, tension: 120, friction: 80 },
    opacity: open ? 1 : 0,
    x: open ? 0 : 20,
    height: open ? itemHeight : 0,
    from: { opacity: 0, x: 20, height: 0 },
    delay: 300
  })
  return (
    <div>
      {trail.map(({ height, ...style }, index) => (
        <a.div
          key={index}
          className={styles.trailsText}
          style={{
            ...style,
            height: `${itemHeight}px`,
            lineHeight: `${itemHeight}px`,
            ...trailStyle
          }}
        >
          <a.div style={{ height }}>{items[index]}</a.div>
        </a.div>
      ))}
    </div>
  )
}

export default Trail
