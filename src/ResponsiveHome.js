import React, { useState, useEffect, useRef } from 'react'
import { useTrail, a } from '@react-spring/web'
import styles from './styles.module.css'
import Trail from './Components/Trail.js'
import ResponsiveAppBar from './Components/Navbar.js'
import pfp from './Pictures/pfp.png'
import resume from './Pictures/resume.pdf'
import pic from './Pictures/profilepic.jpeg'
import Experience from './Experience.js'
import MobileExperience from './MobileExperience.js'
import Divider from '@mui/material/Divider'
import Signature from './Components/Signature.js'
import { WavyBackground } from './Components/Wave.js'
import { motion } from "framer-motion"
import { SlideTabs } from './Components/SlideTabs.js'
import Projects from './Components/Projects.js'
import Algoviz from './Pictures/algoviz.JPG'
import Contact from './Components/Contact.js'
import DarkModeToggle from './Components/DarkMode.js'
import { TextField, Stack, Box, Button, FormControl, FormGroup, Paper, Typography, IconButton, Tooltip, Zoom } from '@mui/material'
import { Form } from 'react-router-dom'
import emailjs, { send } from "emailjs-com"
import { FidgetSpinner } from 'react-loader-spinner'
import SendIcon from '@mui/icons-material/Send';
import EmailIcon from '@mui/icons-material/Email';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// For the profile picture flip animation
const ProfileImage = ({ flip, isMobile }) => (
    <motion.div
        style={{
            width: isMobile ? '250px' : '250px',
            height: isMobile ? '250px' : '250px',
            perspective: '1000px'
        }}
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
                    width={isMobile ? "250" : "250"}
                    height={isMobile ? "250" : "250"}
                    style={{ marginTop: isMobile ? '-50px' : '-100px' }}
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
                    width={isMobile ? "250" : "250"}
                    height={isMobile ? "250" : "250"}
                    style={{ marginTop: isMobile ? '-50px' : '-100px' }}
                    alt="Profile Pic"
                />
            </motion.div>
        </motion.div>
    </motion.div>
);

const ResponsiveHome = () => {
    const [open, setOpen] = useState(true);
    const [flip, setFlip] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [contactButton, setContactButton] = useState("Send");
    const [loading, setLoading] = useState(false);
    const [formStatus, setFormStatus] = useState("idle"); // idle, success, error
    const [formAnimation, setFormAnimation] = useState(false);
    const [subjectFocused, setSubjectFocused] = useState(false);
    const [messageFocused, setMessageFocused] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setFlip(prev => !prev);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

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
                setContactButton('👏🏼 Sent 👏🏼');
                setLoading(false);
                setFormStatus("success");
                setFormAnimation(true);
                setTimeout(() => {
                    setContactButton('Send');
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
            backgroundColor: document.documentElement.classList.contains('dark-mode') ? '#121212' : 'var(--background-color)',
            color: 'var(--text-color)'
        }}>
            {!isMobile && <Contact />}
            <SlideTabs />
            <DarkModeToggle />

            {/* Hero Section */}
            <section id="home" className="min-h-screen relative overflow-hidden">
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="flex flex-col items-center justify-center min-h-screen px-4 md:px-8">
                        {isMobile && (
                            <div className="mb-4 flex justify-center" style={{ marginTop: '-100px', width: '100%' }}>
                                <div className="flex justify-center" style={{ width: '250px' }}>
                                    <ProfileImage flip={flip} isMobile={isMobile} />
                                </div>
                            </div>
                        )}
                        <div className="flex flex-row items-center justify-center gap-12">
                            {!isMobile && <ProfileImage flip={flip} isMobile={isMobile} />}
                            {/* Hero Text */}
                            <div className={`flex flex-col ${isMobile ? 'justify-center items-center w-full' : 'justify-center'}`} style={{ marginTop: isMobile ? '-75px' : '-220px' }}>
                                <Trail open={open} animationConfig={{ mass: 5, tension: 80, friction: 60 }}>
                                    <span className="text-7xl md:text-8xl font-black text-center" style={{ lineHeight: '1.1' }}>Johannes</span>
                                    <span className="text-7xl md:text-8xl font-black text-center" style={{ lineHeight: '1.1' }}>Sluis</span>
                                    <span className="text-7xl md:text-8xl font-black text-center" style={{ lineHeight: '1.1' }}>Portfolio</span>
                                </Trail>
                            </div>
                        </div>
                    </div>
                </div>
                <WavyBackground className="absolute inset-0" />
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 md:px-8 bg-transparent" style={{
                backgroundColor: document.documentElement.classList.contains('dark-mode') ? '#121212' : 'var(--background-color)'
            }}>
                <div className="max-w-4xl mx-auto">
                    <SectionDivider />
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <Trail open={open} animationConfig={{ mass: 5, tension: 80, friction: 60 }}>
                            <span className={`${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'} font-black ${styles['highlight-text']}`} style={{ lineHeight: '1.1', letterSpacing: isMobile ? '0.01em' : '0.02em', whiteSpace: 'nowrap' }}>
                                About Me 👨‍💻
                            </span>
                        </Trail>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-24 text-center"
                    >
                        <p className="mb-8 text-3xl md:text-4xl" style={{ lineHeight: '1.3' }}>
                            Hi, I'm Johannes Sluis (or just Joe)! I'm a Senior at UW studying Computer Science,
                            building as much as I can in my free time.
                        </p>
                        <p className="text-3xl md:text-4xl" style={{ lineHeight: '1.3' }}>
                            I've interned at cool companies like Microsoft and Blue Origin, and worked for one of
                            the world's top lean AI companies (Jenni AI), gaining invaluable experience. Now,
                            I'm a founding engineer at{' '}
                            <a
                                href="https://pracareer.net/"
                                className={`hover:text-blue-800 transition-colors duration-200 ${styles['highlight-text']}`}
                                style={{ textDecoration: 'none' }}
                            >
                                Pracareer
                            </a>,
                            {' '}a platform dedicated to helping Japanese students land their dream jobs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="py-20 px-4 md:px-8 bg-transparent" style={{
                backgroundColor: document.documentElement.classList.contains('dark-mode') ? '#121212' : 'var(--background-color)'
            }}>
                <div className="max-w-6xl mx-auto">
                    <SectionDivider />
                    <motion.div className="text-center mb-16">
                        <Trail open={open} animationConfig={{ mass: 5, tension: 80, friction: 60 }}>
                            <span className={`${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'} font-black ${styles['highlight-text']}`} style={{ lineHeight: '1.1', letterSpacing: isMobile ? '0.01em' : '0.02em' }}>
                                Experience 💹
                            </span>
                        </Trail>
                    </motion.div>
                    {isMobile ? <MobileExperience /> : <Experience />}
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-20 px-4 md:px-8 bg-transparent" style={{
                backgroundColor: document.documentElement.classList.contains('dark-mode') ? '#121212' : 'var(--background-color)'
            }}>
                <div className="max-w-6xl mx-auto">
                    <SectionDivider />
                    <motion.div className="text-center mb-16">
                        <Trail open={open} animationConfig={{ mass: 5, tension: 80, friction: 60 }}>
                            <span className={`${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'} font-black ${styles['highlight-text']}`} style={{ lineHeight: '1.1', letterSpacing: isMobile ? '0.01em' : '0.02em', whiteSpace: 'nowrap' }}>
                                Projects 💻
                            </span>
                        </Trail>
                    </motion.div>
                    <Projects />
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 pb-10 px-4 md:px-8 bg-transparent relative z-10" style={{
                backgroundColor: document.documentElement.classList.contains('dark-mode') ? '#121212' : 'var(--background-color)'
            }}>
                <div className="max-w-4xl mx-auto">
                    <SectionDivider />
                    <motion.div className="text-center mb-16">
                        <Trail open={open} animationConfig={{ mass: 5, tension: 80, friction: 60 }}>
                            <span className={`${isMobile ? 'text-5xl' : 'text-7xl md:text-8xl'} font-black ${styles['highlight-text']}`} style={{ lineHeight: '1.1', letterSpacing: isMobile ? '0.01em' : '0.02em', whiteSpace: 'nowrap' }}>
                                Contact 📨
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

            {/* Bottom Wavy Background Section */}
            <section className="h-96 relative overflow-hidden -mt-10 z-10" style={{
                backgroundColor: document.documentElement.classList.contains('dark-mode') ? '#121212' : 'var(--background-color)'
            }}>
                <WavyBackground className="max-w-4xl mx-auto">
                </WavyBackground>
            </section>
        </div>
    );
};

export default ResponsiveHome; 