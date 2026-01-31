import React, { useState, useEffect, useRef } from 'react'
import { useTrail, a } from '@react-spring/web'
import styles from './styles.module.css'
import Trail from './Components/Trail.js'
import ResponsiveAppBar from './Components/Navbar.js'
import pfp from './Pictures/pfp.png'
import resume from './Pictures/resume.pdf'
import pic from './Pictures/profilepic.jpeg'
import microsoftLogo from './Pictures/microsoft.svg'
import jenniLogo from './Pictures/jenni-logo.png'
import blueOriginLogo from './Pictures/blue.png'
import Experience from './Experience.js'
import MobileExperience from './MobileExperience.js'
import Divider from '@mui/material/Divider'
import { WavyBackground } from './Components/Wave.js'
import { motion } from "framer-motion"
import { SlideTabs } from './Components/SlideTabs.js'
import Projects from './Components/Projects.js'
import Contact from './Components/Contact.js'
import DarkModeToggle from './Components/DarkMode.js'
import { useDarkMode } from './Components/DarkModeContext.js'
import { TextField, Stack, Button } from '@mui/material'
import emailjs from "emailjs-com"
import { FidgetSpinner } from 'react-loader-spinner'
import SendIcon from '@mui/icons-material/Send';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// Animated Gradient Text Component - Bold in light mode, animated in dark
const GradientText = ({ children, className, style, isDarkMode }) => {
  // Light mode: clean, bold, confident typography
  if (!isDarkMode) {
    return (
      <span
        className={className}
        style={{
          ...style,
          color: '#1a1a1a',
        }}
      >
        {children}
      </span>
    );
  }

  // Dark mode: animated gradient effect
  const gradientColors = ['#21CBF3', '#2196F3', '#1565C0'];

  return (
    <motion.span
      className={className}
      style={{
        ...style,
        background: `linear-gradient(90deg, ${gradientColors[0]}, ${gradientColors[1]}, ${gradientColors[2]}, ${gradientColors[1]}, ${gradientColors[0]})`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}
      animate={{
        backgroundPosition: ['0% center', '200% center'],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      {children}
    </motion.span>
  );
};

// Subtle Digital Glitch Profile Image Animation
const ProfileImage = ({ isMobile, sizeOverride }) => {
  const { isDarkMode } = useDarkMode();
  const size = sizeOverride || 250;
  const borderWidth = 4;
  const [isGlitching, setIsGlitching] = useState(false);
  const [showReal, setShowReal] = useState(false);

  // Gradient colors based on theme
  // Light mode: metallic gradient that fades from visible to near-white
  const gradientString = (deg) => isDarkMode
    ? `conic-gradient(from ${deg}deg, #21CBF3, #2196F3, #1565C0, #21CBF3)`
    : `conic-gradient(from ${deg}deg, 
            #9ca3af 0%, 
            #f3f4f6 15%, 
            #d1d5db 30%, 
            #f9fafb 45%, 
            #a1a1aa 60%, 
            #f5f5f5 75%, 
            #9ca3af 100%
          )`;

  // Trigger glitch effect periodically
  useEffect(() => {
    const interval = setInterval(() => {
      // Start glitch + show real photo
      setIsGlitching(true);
      setShowReal(true);

      // End glitch effect but keep real photo visible a bit longer
      setTimeout(() => setIsGlitching(false), 600);

      // Glitch again when transitioning back
      setTimeout(() => setIsGlitching(true), 1800);

      // Hide real photo
      setTimeout(() => setShowReal(false), 2000);

      // End second glitch
      setTimeout(() => setIsGlitching(false), 2400);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        width: `${size + borderWidth * 2}px`,
        height: `${size + borderWidth * 2}px`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
      }}
    >
      {/* Animated gradient border */}
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '4px',
          background: gradientString(0),
          zIndex: 0,
        }}
        animate={{
          background: [
            gradientString(0),
            gradientString(90),
            gradientString(180),
            gradientString(270),
            gradientString(360),
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      {/* Glow effect behind border */}
      <motion.div
        style={{
          position: 'absolute',
          inset: '-8px',
          borderRadius: '8px',
          background: gradientString(0),
          filter: 'blur(15px)',
          opacity: isDarkMode ? 0.5 : 0.3,
          zIndex: -1,
        }}
        animate={{
          background: [
            gradientString(0),
            gradientString(90),
            gradientString(180),
            gradientString(270),
            gradientString(360),
          ],
          opacity: isGlitching
            ? (isDarkMode ? [0.5, 0.8, 0.6, 0.5] : [0.3, 0.5, 0.4, 0.3])
            : (isDarkMode ? 0.5 : 0.3),
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          position: 'relative',
          zIndex: 1,
          borderRadius: '2px',
          overflow: 'hidden',
        }}
      >
        <motion.div
          style={{
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
          }}
          animate={{
            x: isGlitching ? [0, -3, 4, -2, 0] : 0,
          }}
          transition={{ duration: 0.3, ease: 'linear' }}
        >
          {/* Base cartoon image */}
          <img
            src={pfp}
            alt="Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
            }}
          />

          {/* Real photo - fades in/out smoothly */}
          <motion.img
            src={pic}
            alt="Real Profile"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              position: 'absolute',
            }}
            animate={{
              opacity: showReal ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          />

          {/* Cyan color shift layer (#21CBF3) */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${showReal ? pic : pfp})`,
              backgroundSize: 'cover',
              mixBlendMode: 'screen',
              opacity: 0,
            }}
            animate={{
              x: isGlitching ? [0, 6, -3, 0] : 0,
              opacity: isGlitching ? [0, 0.35, 0.15, 0] : 0,
              filter: isGlitching
                ? ['none', 'url(#cyan-tint)', 'url(#cyan-tint)', 'none']
                : 'none',
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Blue color shift layer (#2196F3) */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `url(${showReal ? pic : pfp})`,
              backgroundSize: 'cover',
              mixBlendMode: 'screen',
              opacity: 0,
            }}
            animate={{
              x: isGlitching ? [0, -5, 4, 0] : 0,
              opacity: isGlitching ? [0, 0.35, 0.15, 0] : 0,
              filter: isGlitching
                ? ['none', 'url(#blue-tint)', 'url(#blue-tint)', 'none']
                : 'none',
            }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
          />

          {/* Cyan overlay flash */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#21CBF3',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
            animate={{
              opacity: isGlitching ? [0, 0.2, 0.08, 0] : 0,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />

          {/* Blue overlay flash */}
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#2196F3',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
            animate={{
              opacity: isGlitching ? [0, 0.12, 0.15, 0] : 0,
            }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.08 }}
          />

          {/* Scanlines (subtle) */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `repeating-linear-gradient(
                            0deg,
                            transparent,
                            transparent 3px,
                            rgba(0, 0, 0, 0.02) 3px,
                            rgba(0, 0, 0, 0.02) 4px
                        )`,
              pointerEvents: 'none',
            }}
          />

          {/* Glitch slices with theme colors */}
          {isGlitching && (
            <>
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '22%',
                  height: '10%',
                  background: `linear-gradient(90deg, rgba(33, 203, 243, 0.35) 0%, transparent 100%)`,
                }}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: [0, 10, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
              <motion.div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: '58%',
                  height: '8%',
                  background: `linear-gradient(270deg, rgba(33, 150, 243, 0.35) 0%, transparent 100%)`,
                }}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: [0, -8, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.08 }}
              />
            </>
          )}
        </motion.div>

        {/* SVG Filters for cyan/blue tints */}
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <defs>
            <filter id="cyan-tint">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.13
                                        0 1 0 0 0.3
                                        0 0 1 0 0.4
                                        0 0 0 1 0"
              />
            </filter>
            <filter id="blue-tint">
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0.13
                                        0 0.6 0 0 0.2
                                        0 0 1 0 0.4
                                        0 0 0 1 0"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
};

const ResponsiveHome = () => {
  const { isDarkMode } = useDarkMode();
  const [open] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("idle"); // idle, success, error
  const [formAnimation, setFormAnimation] = useState(false);
  const [subjectFocused, setSubjectFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setViewportWidth(width);
      setIsMobile(width <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isLargeMobile = isMobile && viewportWidth >= 430;
  const mobileProfileSize = (() => {
    if (!isMobile) return 250;
    if (viewportWidth < 360) return 150;
    if (viewportWidth < 400) return 170;
    if (isLargeMobile) return 230;
    if (viewportWidth < 480) return 190;
    return 210;
  })();
  const heroPaddingBottom = isMobile ? (isLargeMobile ? '5vh' : '6vh') : '15vh';
  const heroPaddingTop = isMobile ? (isLargeMobile ? '0vh' : '2vh') : '0';
  const heroNameClass = isMobile
    ? `${isLargeMobile ? 'text-7xl' : 'text-6xl'} font-black text-center`
    : 'text-7xl md:text-8xl font-black';
  const heroTrailHeight = isMobile ? (isLargeMobile ? 78 : 64) : 110;
  const heroTrailStyle = isMobile
    ? { letterSpacing: isLargeMobile ? '-0.015em' : '-0.02em' }
    : undefined;
  const mobileHeroShift = isMobile ? (isLargeMobile ? '-6vh' : '-5vh') : '0vh';

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus("idle");
    const templateParams = { subject, message };

    emailjs.send(
      "service_5jo8tjd",
      "template_cpwd3s8",
      templateParams,
      "N-gkjHJLoKESLpaki"
    ).then(
      (result) => {
        setSubject("");
        setMessage("");
        setLoading(false);
        setFormStatus("success");
        setFormAnimation(true);
        setTimeout(() => {
          setFormStatus("idle");
          setFormAnimation(false);
        }, 3000);
      },
      (error) => {
        console.error(error);
        setFormStatus("error");
        setLoading(false);
        setTimeout(() => setFormStatus("idle"), 3000);
      }
    );
  };

  // Section Divider Component
  const SectionDivider = () => (
    <Divider
      sx={{
        bgcolor: "var(--divider-color)",
        height: "4px",
        width: "300px",
        margin: "0 auto",
        marginBottom: "10rem"
      }}
    />
  );

  return (
    <div className="min-h-screen" style={{
      backgroundColor: isDarkMode ? '#121212' : 'var(--background-color)',
      color: 'var(--text-color)'
    }}>
      {!isMobile && <Contact />}
      <SlideTabs />
      <DarkModeToggle />

      {/* Hero Section */}
      <section id="home" className="min-h-screen relative overflow-hidden">
        <div
          className="max-w-5xl mx-auto relative z-10 h-screen flex items-center justify-center px-4 md:px-8"
          style={{ paddingBottom: heroPaddingBottom, paddingTop: heroPaddingTop }}
        >
          {isMobile ? (
            /* Mobile layout - stacked */
            <div
              className="flex flex-col items-center justify-center gap-3"
              style={{ transform: `translateY(${mobileHeroShift})` }}
            >
              <ProfileImage isMobile={isMobile} sizeOverride={mobileProfileSize} />
              <div className="flex flex-col items-center">
                <Trail
                  open={open}
                  animationConfig={{ mass: 5, tension: 80, friction: 60 }}
                  itemHeight={heroTrailHeight}
                  trailStyle={heroTrailStyle}
                >
                  <GradientText className={heroNameClass} style={{ lineHeight: '1.1' }} isDarkMode={isDarkMode}>Johannes</GradientText>
                  <GradientText className={heroNameClass} style={{ lineHeight: '1.1' }} isDarkMode={isDarkMode}>Sluis</GradientText>
                  <GradientText className={heroNameClass} style={{ lineHeight: '1.1' }} isDarkMode={isDarkMode}>Portfolio</GradientText>
                </Trail>
              </div>
            </div>
          ) : (
            /* Desktop layout - side by side, vertically centered */
            <div className="flex flex-row items-center justify-center gap-12">
              <ProfileImage isMobile={isMobile} sizeOverride={250} />
              <div className="flex flex-col justify-center" style={{ marginTop: '-45px' }}>
                <Trail
                  open={open}
                  animationConfig={{ mass: 5, tension: 80, friction: 60 }}
                  itemHeight={heroTrailHeight}
                  trailStyle={heroTrailStyle}
                >
                  <GradientText className={heroNameClass} style={{ lineHeight: '1.1' }} isDarkMode={isDarkMode}>Johannes</GradientText>
                  <GradientText className={heroNameClass} style={{ lineHeight: '1.1' }} isDarkMode={isDarkMode}>Sluis</GradientText>
                  <GradientText className={heroNameClass} style={{ lineHeight: '1.1' }} isDarkMode={isDarkMode}>Portfolio</GradientText>
                </Trail>
              </div>
            </div>
          )}
        </div>
        <WavyBackground className="absolute inset-0" />
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 md:px-8 bg-transparent" style={{
        backgroundColor: isDarkMode ? '#121212' : 'var(--background-color)'
      }}>
        <div className="max-w-4xl mx-auto">
          <SectionDivider />
          <div className="text-center flex flex-col items-center" style={{ gap: '28px' }}>
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className={`${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'} font-black`}
              style={{ lineHeight: '1.05', letterSpacing: '0.01em' }}
            >
              About
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-xl md:text-2xl"
              style={{ maxWidth: '900px', opacity: 0.92 }}
            >
              I build polished, high-impact products end-to-end - from idea to launch.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex flex-wrap justify-center"
              style={{ gap: '10px', maxWidth: '920px' }}
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
                  className="text-sm md:text-base font-semibold"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 16px',
                    borderRadius: '999px',
                    border: chip.isCurrent ? '1px solid #60A5FA' : '1px solid var(--text-color)',
                    backgroundColor: chip.isCurrent ? 'rgba(96, 165, 250, 0.14)' : 'transparent',
                    color: 'var(--text-color)'
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
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-lg md:text-2xl"
              style={{ maxWidth: '980px', lineHeight: '1.7' }}
            >
              I'm Joe Sluis, a programmer.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4 md:px-8 bg-transparent" style={{
        backgroundColor: isDarkMode ? '#121212' : 'var(--background-color)'
      }}>
        <div className="max-w-6xl mx-auto">
          <SectionDivider />
          <motion.div className="text-center mb-16">
            <Trail open={open} animationConfig={{ mass: 5, tension: 80, friction: 60 }}>
              <span className={`${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'} font-black ${styles['highlight-text']}`} style={{ lineHeight: '1.1', letterSpacing: isMobile ? '0.01em' : '0.02em' }}>
                Experience
              </span>
            </Trail>
          </motion.div>
          {isMobile ? <MobileExperience /> : <Experience />}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4 md:px-8 bg-transparent" style={{
        backgroundColor: isDarkMode ? '#121212' : 'var(--background-color)'
      }}>
        <div className="max-w-6xl mx-auto">
          <SectionDivider />
          <motion.div className="text-center mb-16">
            <Trail open={open} animationConfig={{ mass: 5, tension: 80, friction: 60 }}>
              <span className={`${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'} font-black ${styles['highlight-text']}`} style={{ lineHeight: '1.1', letterSpacing: isMobile ? '0.01em' : '0.02em', whiteSpace: 'nowrap' }}>
                Projects
              </span>
            </Trail>
          </motion.div>
          <Projects />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 pb-10 px-4 md:px-8 bg-transparent relative z-10" style={{
        backgroundColor: isDarkMode ? '#121212' : 'var(--background-color)'
      }}>
        <div className="max-w-4xl mx-auto">
          <SectionDivider />
          <motion.div className="text-center mb-16">
            <Trail open={open} animationConfig={{ mass: 5, tension: 80, friction: 60 }}>
              <span className={`${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'} font-black ${styles['highlight-text']}`} style={{ lineHeight: '1.1', letterSpacing: isMobile ? '0.01em' : '0.02em', whiteSpace: 'nowrap' }}>
                Contact
              </span>
            </Trail>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="max-w-lg mx-auto p-8">
              <Stack spacing={4}>
                <motion.div
                  animate={{
                    scale: subjectFocused ? 1.02 : 1,
                    boxShadow: subjectFocused ? '0 8px 16px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)'
                  }}
                  transition={{ duration: 0.3 }}
                  className={styles['hover-lift']}
                >
                  <TextField
                    label="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    fullWidth
                    onFocus={() => setSubjectFocused(true)}
                    onBlur={() => setSubjectFocused(false)}
                    InputProps={{
                      startAdornment: (
                        <SubjectIcon sx={{ mr: 1, color: subjectFocused ? 'primary.main' : 'text.secondary' }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'var(--card-bg)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--primary-color)',
                          },
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--text-color)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'var(--text-color)',
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  animate={{
                    scale: messageFocused ? 1.02 : 1,
                    boxShadow: messageFocused ? '0 8px 16px rgba(0,0,0,0.1)' : '0 4px 8px rgba(0,0,0,0.05)'
                  }}
                  transition={{ duration: 0.3 }}
                  className={styles['hover-lift']}
                >
                  <TextField
                    label="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    multiline
                    rows={5}
                    fullWidth
                    onFocus={() => setMessageFocused(true)}
                    onBlur={() => setMessageFocused(false)}
                    InputProps={{
                      startAdornment: (
                        <MessageIcon sx={{ mr: 1, color: messageFocused ? 'primary.main' : 'text.secondary' }} />
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '12px',
                        transition: 'all 0.3s ease',
                        backgroundColor: 'var(--card-bg)',
                        backdropFilter: 'blur(4px)',
                        '&:hover': {
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'var(--primary-color)',
                          },
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--text-color)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'var(--text-color)',
                      },
                    }}
                  />
                </motion.div>

                <motion.div
                  animate={{
                    scale: formAnimation ? 1.05 : 1,
                    y: formAnimation ? -5 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={sendEmail}
                    disabled={loading || !subject || !message}
                    endIcon={loading ? (
                      <FidgetSpinner
                        visible={true}
                        height="20"
                        width="20"
                        ariaLabel="fidget-spinner-loading"
                        wrapperStyle={{}}
                        wrapperClass="fidget-spinner-wrapper"
                      />
                    ) : formStatus === "success" ? (
                      <CheckCircleIcon />
                    ) : formStatus === "error" ? (
                      <ErrorIcon />
                    ) : (
                      <SendIcon />
                    )}
                    sx={{
                      borderRadius: '12px',
                      py: 1.5,
                      px: 4,
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                      background: 'linear-gradient(45deg, var(--primary-color) 30%, var(--secondary-color) 90%)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(45deg, var(--primary-color) 30%, var(--secondary-color) 90%)',
                        boxShadow: '0 6px 20px 0 rgba(0,118,255,0.5)',
                        transform: 'translateY(-2px)',
                      },
                      '&:disabled': {
                        background: 'rgba(0, 0, 0, 0.12)',
                        color: 'rgba(0, 0, 0, 0.26)',
                      }
                    }}
                  >
                    {loading ? "Sending..." : formStatus === "success" ? "Message Sent!" : formStatus === "error" ? "Try Again" : "Send Message"}
                  </Button>
                </motion.div>

                {formStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center text-green-600 font-medium"
                  >
                    <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Your message has been sent successfully!
                  </motion.div>
                )}

                {formStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center text-red-600 font-medium"
                  >
                    <ErrorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    There was an error sending your message. Please try again.
                  </motion.div>
                )}
              </Stack>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ResponsiveHome; 
