import React, { useState } from 'react'
import { useTrail, a } from '@react-spring/web'

import styles from './styles.module.css'

import Trail from './Components/Trail'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'

import ResponsiveAppBar from './Components/Navbar'

import Home from './Home'
import Main from './Main'
import Experience from './Experience'
import { SlideTabs } from './Components/SlideTabs.js'

export default function App() {
  const [open, set] = useState(true)
  const alignCenter = { display: 'flex', alignItems: 'center' }
  return (
    <div>
      {/* <ResponsiveAppBar/> */}
      {/* <SlideTabs/> */}
      <Home/>
    </div>
  )
}

