import React, { useState, useEffect, useRef } from 'react'
import { useTrail, a } from '@react-spring/web'
import styles from './styles.module.css'
import Trail from './Components/Trail.js'
import ResponsiveAppBar from './Components/Navbar.js'
import pfp from './Pictures/pfp.png'
import resume from './Pictures/resume.pdf'
import pic from './Pictures/profilepic.jpeg'
import Experience from './Experience.js'
import Divider from '@mui/material/Divider'
import Signature from './Components/Signature.js'
import { WavyBackground } from './Components/Wave.js'
import { motion } from "framer-motion"
import { SlideTabs } from './Components/SlideTabs.js'
import Projects from './Components/Projects.js'
import Algoviz from './Pictures/algoviz.JPG'
import Contact from './Components/Contact.js'
import DarkMode from './Components/DarkMode.js'
import { TextField, Stack, Box, Button, FormControl, FormGroup } from '@mui/material'
import { Form } from 'react-router-dom'
import emailjs, { send } from "emailjs-com"
import { FidgetSpinner } from 'react-loader-spinner'

// For the profile picture flip animation
const ProfileImage = ({ flip }) => (
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
);

const ResponsiveHome = () => {
    const [open, setOpen] = useState(true);
    const [flip, setFlip] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [contactButton, setContactButton] = useState("Send");
    const [loading, setLoading] = useState(false);

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
                setTimeout(() => setContactButton('Send'), 3000);
            },
            (error) => {
                console.error(error);
                alert("Failed to send email.");
            }
        );
    };

    // Section Divider Component
    const SectionDivider = () => (
        <Divider
            sx={{
                bgcolor: "#e0e0e0",
                height: "4px",
                width: "300px",
                margin: "0 auto",
                marginBottom: "4rem"
            }}
        />
    );

    return (
        <div className="min-h-screen bg-white">
            {!isMobile && <Contact />}
            <SlideTabs />

            {/* Hero Section */}
            <section id="home" className="min-h-screen relative overflow-hidden">
                <WavyBackground className="max-w-4xl mx-auto">
                    <div className="flex flex-row items-center justify-center min-h-screen px-4 md:px-8 gap-12">
                        {!isMobile && <ProfileImage flip={flip} />}
                        {/* Hero Text */}
                        <div className="flex flex-col justify-center" style={{ marginTop: '-220px' }}>
                            <Trail open={open}>
                                <span className="text-7xl md:text-8xl font-black" style={{ lineHeight: '1.1' }}>Johannes</span>
                                <span className="text-7xl md:text-8xl font-black" style={{ lineHeight: '1.1' }}>Sluis</span>
                                <span className="text-7xl md:text-8xl font-black" style={{ lineHeight: '1.1' }}>Portfolio</span>
                            </Trail>
                        </div>
                    </div>
                </WavyBackground>
            </section>

            {/* About Section */}
            <section id="about" className="py-20 px-4 md:px-8 bg-transparent">
                <div className="max-w-4xl mx-auto">
                    <SectionDivider />
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center"
                    >
                        <Trail open={open}>
                            <span className="text-5xl md:text-6xl font-bold">About Me 👨‍💻</span>
                        </Trail>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="mt-8 text-lg text-center"
                    >
                        <p className="mb-4">
                            Hi, I'm Johannes Sluis (or just Joe)! I'm a Senior at UW studying Computer Science,
                            building as much as I can in my free time.
                        </p>
                        <p>
                            I've interned at cool companies like Microsoft and Blue Origin, and worked for one of
                            the world's top lean AI companies (Jenni AI), gaining invaluable experience. Now,
                            I'm a founding engineer at <a href="https://pracareer.net/" className="text-blue-600 hover:text-blue-800">Pracareer</a>,
                            a platform dedicated to helping Japanese students land their dream jobs.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Experience Section */}
            <section id="experience" className="py-20 px-4 md:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <SectionDivider />
                    <motion.div className="text-center mb-16">
                        <Trail open={open}>
                            <span className="text-5xl md:text-6xl font-bold">
                                {isMobile ? "Exp. 💹" : "Experience 💹"}
                            </span>
                        </Trail>
                    </motion.div>
                    <Experience />
                </div>
            </section>

            {/* Projects Section */}
            <section id="projects" className="py-20 px-4 md:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    <SectionDivider />
                    <motion.div className="text-center mb-16">
                        <Trail open={open}>
                            <span className="text-5xl md:text-6xl font-bold">Projects 💻</span>
                        </Trail>
                    </motion.div>
                    <Projects />
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="py-20 px-4 md:px-8 bg-transparent">
                <div className="max-w-4xl mx-auto">
                    <SectionDivider />
                    <motion.div className="text-center mb-16">
                        <Trail open={open}>
                            <span className="text-5xl md:text-6xl font-bold">Contact 📨</span>
                        </Trail>
                    </motion.div>

                    <Box className="max-w-lg mx-auto">
                        <Stack spacing={3}>
                            <TextField
                                label="Subject"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                fullWidth
                            />
                            <TextField
                                label="Message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                multiline
                                rows={5}
                                fullWidth
                            />
                            <Button
                                color="success"
                                variant="outlined"
                                onClick={sendEmail}
                                className="py-3"
                            >
                                {loading && (
                                    <FidgetSpinner
                                        visible={true}
                                        height="30"
                                        width="30"
                                        ariaLabel="fidget-spinner-loading"
                                        wrapperStyle={{}}
                                        wrapperClass="fidget-spinner-wrapper"
                                    />
                                )}
                                {contactButton}
                            </Button>
                        </Stack>
                    </Box>
                </div>
            </section>
        </div>
    );
};

export default ResponsiveHome; 