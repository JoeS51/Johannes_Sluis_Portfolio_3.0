import React, { useState, useEffect } from 'react'
import { useTrail, a } from '@react-spring/web'
import styles from './styles.module.css'
import Trail from './Components/Trail.js'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import ResponsiveAppBar from './Components/Navbar.js'
import Home from './Home.js'
import Main from './Main.js'
import Experience from './Experience.js'
import { SlideTabs } from './Components/SlideTabs.js'
import ResponsiveHome from './ResponsiveHome.js'
import './index.css'
import './global.css'  // Import the global CSS for Bootstrap overrides

// Check if a saved theme preference exists in localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.toggle('dark-mode', savedTheme === 'dark');

export default function App() {
  const [open, set] = useState(true)
  const alignCenter = { display: 'flex', alignItems: 'center' }
  return (
    <div style={{
      backgroundColor: document.documentElement.classList.contains('dark-mode') ? '#121212' : 'var(--background-color)',
      color: 'var(--text-color)',
      minHeight: '100vh',
      width: '100%',
      transition: 'background-color var(--transition-speed) ease, color var(--transition-speed) ease'
    }}>
      {/* <ResponsiveAppBar/> */}
      {/* <SlideTabs/> */}
      {/* <Home /> */}
      <ResponsiveHome />
    </div>
  )
}

