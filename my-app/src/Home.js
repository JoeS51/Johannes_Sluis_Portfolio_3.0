import React, { useState } from 'react'
import { useTrail, a } from '@react-spring/web'
import styles from './styles.module.css'
import Trail from './Components/Trail'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import ResponsiveAppBar from './Components/Navbar'
import pfp from './Pictures/pfp.png'
import resume from './Pictures/resume.pdf'
import Stack from '@mui/material/Stack';
import pic from './Pictures/profilepic.jpeg';
import Experience from './Experience'
import Divider from '@mui/material/Divider';
import Signature from './Components/Signature'
import { WavyBackground } from './Components/Wave'

export default function Home() {
  const [open, set] = useState(true)
  const alignCenter = { display: 'flex', alignItems: 'center' }

  return (
    <div>
      <Parallax pages={3}>
      <WavyBackground className="max-w-4xl mx-auto pb-40">
        <ParallaxLayer offset={0} speed={0} style={{ ...alignCenter, justifyContent: 'center' }}>
        <div className={styles.container} id='root'>
          <img src={pfp}
            alt="Pfp"
            width="250"
            height="250"
            style={{ marginRight: '40px' }}
          />
          <Trail open={open}>
            <span>Johannes</span>
            <span>Sluis</span>
            <span>Portfolio</span>
          </Trail>
        </div>
        </ParallaxLayer>
        </WavyBackground>
        <ParallaxLayer id='about' offset={1} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: '#f2f6fc'}}>
        <div className={styles.topcontainer}>
          <Trail open={open}>
            <span>About Me</span>
          </Trail>
          <img src={pic} width="200" height="200" style={{ margin: '20px 0' }}/>
          <h1>Hello, I'm Johannes (Joe) Sluis! I am currently a Senior at the University of Washington, studying Computer Science
              and minoring in Business Administration. 
          </h1>
        </div>
        <Divider flexItem orientation="horizontal" sx={{ bgcolor: "secondary.light" }} />
        </ParallaxLayer>
        
        <ParallaxLayer offset={1.75} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: '#f2f6fc' }}>
          <div id='resume-section'>
            <Experience/>
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={2.75} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: '#f2f6fc' }}>
        </ParallaxLayer>
      </Parallax>
    </div>
  )
}

