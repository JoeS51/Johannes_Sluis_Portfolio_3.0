import React, { useState } from 'react'
import { useTrail, a } from '@react-spring/web'

import styles from './styles.module.css'

import Trail from './Components/Trail'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'

import ResponsiveAppBar from './Components/Navbar'

import pfp from './Pictures/pfp.png'

import resume from './Pictures/resume.pdf'

export default function App() {
  const [open, set] = useState(true)
  const alignCenter = { display: 'flex', alignItems: 'center' }
  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Parallax pages={3}>
        <ParallaxLayer offset={0} speed={0} style={{ ...alignCenter, justifyContent: 'center' }}>
        <div className={styles.container}>
          <img src={pfp}
            alt="Pfp"
            width="200"
            height="200"
            style={{ marginRight: '40px' }}
          />
          <Trail open={open}>
            <span>Johannes</span>
            <span>Sluis</span>
            <span>Portfolio</span>
          </Trail>
        </div>
        </ParallaxLayer>

        <ParallaxLayer offset={1} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: '#ebebeb'}}>
          {/* <div className={`${styles.card} ${styles.parallax} ${styles.container}`}> */}
          <div className={styles.container} id='resume-section'>
            <iframe src={resume} title="description" height="500" width="400"></iframe>
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={2} speed={0} style={{ ...alignCenter, justifyContent: 'flex-end', backgroundColor: '#ccd5c4' }}>
          <div className={`${styles.card} ${styles.parallax} ${styles.blue}`}>
            <p>Neither am I</p>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div>
  )
}

