import React, { useState, useEffect, useRef } from 'react'
import { useTrail, a } from '@react-spring/web'
import styles from './styles.module.css'
import Trail from './Components/Trail.js'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import ResponsiveAppBar from './Components/Navbar.js'
import pfp from './Pictures/pfp.png'
import resume from './Pictures/resume.pdf'
import pic from './Pictures/profilepic.jpeg';
import microsoftLogo from './Pictures/microsoft.svg'
import jenniLogo from './Pictures/jenni-logo.png'
import blueOriginLogo from './Pictures/blue.png'
import Experience from './Experience.js'
import Divider from '@mui/material/Divider';
import { WavyBackground } from './Components/Wave.js'
import { motion } from "framer-motion";
import { SlideTabs } from './Components/SlideTabs.js'
import Projects from './Components/Projects.js'
import Contact from './Components/Contact.js'
import DarkMode from './Components/DarkMode.js'
import { TextField, Stack, Button, Box } from '@mui/material'
import emailjs from "emailjs-com";
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
  const [isMobile, setIsMobile] = useState(false)
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
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      console.log(window.innerWidth)
      console.log(isMobile)
    }

    checkMobile();
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setFlip((prevFlip) => !prevFlip);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-0" id="home">
      {!isMobile && (<Contact />)}
      <SlideTabs parallaxRef={parallaxRef} />
      {/*<DarkMode />*/}
      <Parallax ref={parallaxRef} pages={7}>
        <WavyBackground className="max-w-4xl mx-auto pb-100">
          <ParallaxLayer
            offset={0}
            speed={0}
            style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'center',
              minHeight: isMobile ? '130vh' : '100vh',
            }}
          >
            <div className={styles.container} id='root'>
              {!isMobile && (

                < motion.div
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
              )}
              <div style={{
                marginLeft: isMobile ? '0' : '50px',
                marginTop: isMobile ? (window.innerWidth <= 375 ? '-90px' : '-400px') : '-220px',
                textAlign: isMobile ? 'center' : 'left'
              }}>
                <Trail open={open}>
                  <span>Johannes</span>
                  <span>Sluis</span>
                  <span>Portfolio</span>
                </Trail>
                {isMobile && (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginTop: '30px',
                    marginBottom: '50px'
                  }}>
                    <img
                      src={pfp}
                      alt="Mobile View"
                      style={{ width: "180px", height: "180px" }}
                    />
                  </div>
                )}
              </div>
            </div>
          </ParallaxLayer>
        </WavyBackground>
        <ParallaxLayer id='about' offset={1} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: 'transparent', zIndex: 3 }}>
          <div className={styles.topcontainer}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '36px',
              width: '100%',
              padding: '0 24px'
            }}>
              <motion.span
                initial={{ opacity: 0.5, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                style={{
                  fontSize: 'clamp(40px, 7vw, 88px)',
                  fontWeight: 800,
                  letterSpacing: '0.01em',
                  color: 'var(--text-color)'
                }}
              >
                About
              </motion.span>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.1 }}
                style={{
                  margin: 0,
                  fontSize: 'clamp(18px, 2.2vw, 28px)',
                  maxWidth: '900px',
                  textAlign: 'center',
                  color: 'var(--text-color)',
                  opacity: 0.9
                }}
              >
                I build polished, high-impact products end-to-end - from idea to launch.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  justifyContent: 'center',
                  maxWidth: '900px'
                }}
              >
                {[
                  {
                    label: 'Microsoft software engineer',
                    logo: microsoftLogo,
                    alt: 'Microsoft logo',
                    isCurrent: true
                  },
                  {
                    label: 'Jenni AI intern',
                    logo: jenniLogo,
                    alt: 'Jenni AI logo',
                    logoSize: 28
                  },
                  { label: 'Blue Origin intern', logo: blueOriginLogo, alt: 'Blue Origin logo' }
                ].map((chip) => (
                  <span
                    key={chip.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      borderRadius: '999px',
                      border: chip.isCurrent ? '1px solid #60A5FA' : '1px solid var(--text-color)',
                      backgroundColor: chip.isCurrent ? 'rgba(96, 165, 250, 0.14)' : 'transparent',
                      color: 'var(--text-color)',
                      fontWeight: 600,
                      fontSize: '14px',
                      letterSpacing: '0.01em'
                    }}
                  >
                    <img
                      src={chip.logo}
                      alt={chip.alt}
                      style={{
                        width: `${chip.logoSize || 18}px`,
                        height: `${chip.logoSize || 18}px`,
                        objectFit: 'contain',
                        borderRadius: '4px'
                      }}
                    />
                    {chip.label}
                    {chip.isCurrent && (
                      <span
                        style={{
                          marginLeft: '4px',
                          padding: '4px 8px',
                          borderRadius: '999px',
                          backgroundColor: '#3B82F6',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          textTransform: 'uppercase'
                        }}
                      >
                        Current
                      </span>
                    )}
                  </span>
                ))}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  margin: 0,
                  fontSize: 'clamp(18px, 2.1vw, 26px)',
                  lineHeight: 1.6,
                  maxWidth: '980px',
                  textAlign: 'center',
                  color: 'var(--text-color)'
                }}
              >
                I'm Johannes Sluis (Joe), a UW Computer Science senior focused on thoughtful UI,
                fast iteration, and shipping work that feels great to use. I care about the details
                - the ones users notice and the ones they never have to.
              </motion.p>
            </div>
          </div>
          <Divider flexItem orientation="horizontal" sx={{ bgcolor: "black" }} />
        </ParallaxLayer>
        <ParallaxLayer
          offset={1.5}
          speed={0}
          style={{
            ...alignCenter,
            justifyContent: 'center',
            backgroundColor: '#FFF',
            height: '100vh',
            zIndex: 2
          }}>
          <div id='resume-section' style={{
            display: "flex",
            flexDirection: "column",
            gap: "100px"
          }}>
            <Divider
              sx={{
                bgcolor: "#e0e0e0",
                height: "4px",
                width: "300px",
                margin: "0 auto",
                marginTop: "250px"
              }}
            />
            <motion.span
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: "easeInOut"
              }} >
              <Trail open={open} style={{ marginBottom: '400px' }}>
                <center><span>{isMobile ? "Exp. 💹" : "Experience 💹"}</span></center>
              </Trail>
            </motion.span>
            <motion.div
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                ease: "easeInOut"
              }}>
              <Experience />
            </motion.div>
          </div>
        </ParallaxLayer>
        <ParallaxLayer
          offset={isMobile ? 3.2 : 2.9}
          speed={0}
          style={{
            ...alignCenter,
            justifyContent: 'center',
            backgroundColor: '#FFF'
          }}>
          <div id='resume-section' style={{ display: "flex", flexDirection: "column", gap: "150px" }}>
            <Divider
              sx={{
                bgcolor: "#e0e0e0",
                height: "4px",
                width: "300px",
                margin: "0 auto",
                marginTop: "400px"
              }}
            />
            <motion.span
              initial={{ opacity: 0.5, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.2,
                duration: 0.8,
                ease: "easeInOut"
              }}>
              <Trail open={open} style={{ marginBottom: '400px' }}>
                <center><span>Projects 💻</span></center>
              </Trail>
            </motion.span>
            <Projects></Projects>
          </div>
        </ParallaxLayer>

        <ParallaxLayer offset={isMobile ? 5.25 : 4.15} speed={0} style={{ ...alignCenter, justifyContent: 'center', backgroundColor: 'transparent' }}>
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
              <motion.span
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: -50 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  ease: "easeInOut"
                }}>
                <center><span>Contact 📨</span></center>
              </motion.span>
              <motion.div
                initial={{ opacity: 0.5, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.2,
                  duration: 0.8,
                  ease: "easeInOut"
                }}>
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
              </motion.div>
            </Trail>
          </div>
        </ParallaxLayer>
      </Parallax>
    </div >
  )
}
