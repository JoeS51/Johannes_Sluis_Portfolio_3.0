import React, { useState, useEffect } from 'react'
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
import { motion } from "framer-motion";

export default function Home() {
  const [open, set] = useState(true)
  const [flip, setFlip] = useState(false);
  const alignCenter = { display: 'flex', alignItems: 'center' }

  useEffect(() => {
    // Set an interval to flip the card every 5 seconds (adjust as needed)
    const interval = setInterval(() => {
      setFlip((prevFlip) => !prevFlip); // Toggle the flip state
    }, 5000); // Flip every 5 seconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-0">
      <Parallax pages={3}>
      <WavyBackground className="max-w-4xl mx-auto pb-40">
      <ParallaxLayer
        offset={0}
        speed={0}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
      >
        <div className={styles.container} id='root'>
        <motion.div
          style={{ width: '250px', height: '250px', perspective: '1000px' }} // Maintain perspective
        >
          <motion.div
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              transformStyle: 'preserve-3d',
            }}
            animate={{ rotateY: flip ? 360 : 0 }} // Flip 180 degrees based on the flip state
            transition={{
              duration: 2, // Duration of the flip animation
              ease: 'easeInOut', // Smooth ease in and out of the flip
            }}
          >
            {/* Front of the card */}
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                position: 'absolute',
              }}
              className="front"
            >
              <img
                src={pfp}
                alt="Pfp"
                width="250"
                height="250"
                style={{ marginRight: '40px' }}
              />
            </motion.div>

            {/* Back of the card */}
            <motion.div
              style={{
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                position: 'absolute',
                transform: 'rotateY(180deg)',
              }}
              className="back"
            >
              <img
                src={pic}
                width="250"
                height="250"
                style={{ margin: '20px 0' }}
                alt="Profile Pic"
              />
            </motion.div>
          </motion.div>
        </motion.div>
          <Trail open={open}>
            <span>Johannes</span>
            <span>Sluis</span>
            <span>Portfolio</span>
          </Trail>
        </div>
        </ParallaxLayer>
        </WavyBackground>
        <ParallaxLayer id='about' offset={1} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: '#ffffff'}}>
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

