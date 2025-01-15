import React, { useState } from 'react'
import { useTrail, a } from '@react-spring/web'

import styles from './styles.module.css'

import Trail from './Components/Trail.js'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'

import ResponsiveAppBar from './Components/Navbar.js'

import Home from './Home.js'
import Main from './Main.js'
import Experience from './Experience.js'
import { SlideTabs } from './Components/SlideTabs.js'

export default function App() {
  const [open, set] = useState(true)
  const alignCenter = { display: 'flex', alignItems: 'center' }
  return (
    <div>
      {/* <ResponsiveAppBar/> */}
      {/* <SlideTabs/> */}
      <Home />
    </div>
  )
}

