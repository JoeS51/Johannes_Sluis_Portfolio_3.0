import React, { useState, useEffect, useRef } from 'react'
import { useTrail, a } from '@react-spring/web'
import styles from './styles.module.css'
import Trail from './Components/Trail'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import ResponsiveAppBar from './Components/Navbar'
import pfp from './Pictures/pfp.png'
import resume from './Pictures/resume.pdf'
import pic from './Pictures/profilepic.jpeg';
import Experience from './Experience'
import Divider from '@mui/material/Divider';
import Signature from './Components/Signature'
import { WavyBackground } from './Components/Wave'
import { motion } from "framer-motion";
import { SlideTabs } from './Components/SlideTabs.js'
import Projects from './Components/Projects.js'
import Algoviz from './Pictures/algoviz.JPG'
import Contact from './Components/Contact.js'
import DarkMode from './Components/DarkMode.js'
import { TextField, Stack, Box, Button, FormControl, FormGroup } from '@mui/material'
import { Form } from 'react-router-dom'
import emailjs, { send } from "emailjs-com";
import { FidgetSpinner } from 'react-loader-spinner'

export default function Home() {
  const [open, set] = useState(true)
  const [flip, setFlip] = useState(false);
  const alignCenter = { display: 'flex', alignItems: 'center' }
  const words = ['Student', 'Developer', 'Leader'];
  const [visibleWord, setVisibleWord] = useState('');
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [contactButton, setContactButton] = useState("Send");
  const [loading, setLoading] = useState(false)
  const parallaxRef = useRef();

  const subjectChange = (e) => {
    setSubject(e.target.value)
  }

  const messageChange = (e) => {
    setMessage(e.target.value)
  }

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true)
    const templateParams = {
      subject,
      message,
    };

    emailjs
      .send(
        "service_5jo8tjd",
        "template_cpwd3s8",
        templateParams,
        "N-gkjHJLoKESLpaki"
      )
      .then(
        (result) => {
          console.log(result.text);
          setSubject("")
          setMessage("")
          setContactButton('👏🏼 Sent 👏🏼');
          setLoading(false)
          setTimeout(() => {
            setContactButton('Send');
          }, 3000);
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send email.");
        }
      );
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setFlip((prevFlip) => !prevFlip);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-0" id="home">
      <Contact />
      <SlideTabs parallaxRef={parallaxRef} />
      {/*<DarkMode />*/}
      <Parallax ref={parallaxRef} pages={6}>
        <WavyBackground className="max-w-4xl mx-auto pb-100">
          <ParallaxLayer
            offset={0}
            speed={0}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
          >
            <div className={styles.container} id='root'>
              <motion.div
                style={{ width: '250px', height: '250px', perspective: '1000px' }}
              >
                <motion.div
                  style={{
                    width: '100%',
                    height: '100%',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                  }}
                  animate={{ rotateY: flip ? 360 : 0 }}
                  transition={{
                    duration: 2,
                    ease: 'easeInOut',
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
                      style={{ marginTop: '-100px' }}
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
                      style={{ marginTop: '-100px' }}
                      alt="Profile Pic"
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
              <div style={{ marginLeft: '50px', marginTop: '-220px' }}>
                <Trail open={open}>
                  <span>Johannes</span>
                  <span>Sluis</span>
                  <span>Portfolio</span>
                </Trail>
              </div>
            </div>
          </ParallaxLayer>
        </WavyBackground>
        <ParallaxLayer id='about' offset={1} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: '#ffffff' }}>
          <div className={styles.topcontainer}>
            <Trail open={open}>
              <span>About Me 👨‍💻</span>
            </Trail>
            {/* <img src={pic} width="200" height="200" style={{ margin: '20px 0' }}/> */}
            <h1 style={{ marginTop: '100px' }}>Hi, I'm Johannes (Joe) Sluis! I'm a Senior at the University of Washington, majoring in Computer Science with a minor in Business Administration. While I have strong experience in front-end development, I'm eager to broaden my skill set and explore new areas of software engineering. As I approach graduation, I'm focused on learning as much as possible!<br></br><br></br>Feel free to message me with any questions or opportunities!
            </h1>
          </div>
          <Divider flexItem orientation="horizontal" sx={{ bgcolor: "black" }} />
        </ParallaxLayer>
        <ParallaxLayer offset={1.75} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: '#FFF' }}>
          <div id='resume-section' style={{ display: "flex", flexDirection: "column", gap: "150px" }}>
            <Divider
              sx={{
                bgcolor: "#e0e0e0",
                height: "4px", // Thickness of the border
                width: "70%", // Adjust to match your layout
                margin: "0 auto", // Center the divider
                marginTop: "250px"
              }}
            />
            <Trail open={open} style={{ marginBottom: '400px' }}>
              <center><span>Experience 💹</span></center>
            </Trail>
            <Experience />
          </div>
        </ParallaxLayer>
        <ParallaxLayer offset={3.25} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: '#FFF' }}>
          <div id='resume-section' style={{ display: "flex", flexDirection: "column", gap: "150px" }}>
            <Divider
              sx={{
                bgcolor: "#e0e0e0",
                height: "4px",
                width: "70%",
                margin: "0 auto",
                marginTop: "250px"
              }}
            />
            <Trail open={open} style={{ marginBottom: '400px' }}>
              <center><span>Projects 💻</span></center>
            </Trail>

            <Projects></Projects>
            {/* <Contact /> */}
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={4.5} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: 'transparent' }}>
          <div id='resume-section' style={{ display: "flex", flexDirection: "column", gap: "150px" }}>
            <Divider
              sx={{
                bgcolor: "#e0e0e0",
                height: "4px",
                width: "70%",
                margin: "0 auto",
                marginTop: "250px"
              }}
            />
            <Trail open={open} style={{ marginBottom: '400px' }}>
              <center><span>Contact 📨</span></center>
              <Box sx={{ padding: 5 }}>
                <Stack
                  spacing={2}
                >
                  <TextField
                    label="Subject"
                    value={subject}
                    onChange={subjectChange}
                  />
                  <TextField
                    label="Message"
                    minRows={5}
                    value={message}
                    onChange={messageChange}
                    multiline
                  />
                  <Button
                    color='success'
                    variant='outlined'
                    onClick={sendEmail}
                  >
                    {loading && <FidgetSpinner
                      visible={true}
                      height="30"
                      width="30"
                      ariaLabel="fidget-spinner-loading"
                      wrapperStyle={{}}
                      wrapperClass="fidget-spinner-wrapper"
                    />}
                    {contactButton}
                  </Button>
                </Stack>
              </Box>
            </Trail>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div >
  )
}

