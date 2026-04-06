import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Divider from '@mui/material/Divider';
import { Stack, TextField } from '@mui/material';
import Trail from '../Trail';
import emailjs from 'emailjs-com';
import { FidgetSpinner } from 'react-loader-spinner';
import SendIcon from '@mui/icons-material/Send';
import SubjectIcon from '@mui/icons-material/Subject';
import MessageIcon from '@mui/icons-material/Message';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import microsoftLogo from '../../Pictures/microsoft.svg';
import jenniLogo from '../../Pictures/jenni-logo.png';
import blueOriginLogo from '../../Pictures/blue.png';
import profileIllustration from '../../Pictures/pfp.png';
import profilePhoto from '../../Pictures/profilepic.jpeg';
import { WavyBackground } from '../Wave';
import styles from '../../styles.module.css';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return isMobile;
};

export const SectionDivider = () => (
  <Divider
    sx={{
      bgcolor: 'var(--divider-color)',
      height: '4px',
      width: '240px',
      margin: '0 auto 4rem',
    }}
  />
);

export const PageHeading = ({ title, subtitle }) => (
  <div className="text-center mb-12">
    <SectionDivider />
    <motion.h1
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-5xl md:text-7xl font-black"
      style={{ lineHeight: '1.05' }}
    >
      {title}
    </motion.h1>
    {subtitle ? (
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg md:text-xl mt-4"
        style={{ opacity: 0.8, maxWidth: '760px', margin: '16px auto 0' }}
      >
        {subtitle}
      </motion.p>
    ) : null}
  </div>
);

const ProfileImage = ({ isMobile, sizeOverride }) => {
  const size = sizeOverride || (isMobile ? 180 : 250);

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '4px solid #d4d4d8',
        boxShadow: '0 24px 80px rgba(15, 23, 42, 0.18)',
      }}
    >
      <img
        src={profileIllustration}
        alt="Johannes Sluis illustration"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <motion.img
        src={profilePhoto}
        alt="Johannes Sluis"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
};

export const HomeHero = () => {
  const isMobile = useIsMobile();
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const checkViewport = () => setViewportWidth(window.innerWidth);
    checkViewport();
    window.addEventListener('resize', checkViewport);
    return () => window.removeEventListener('resize', checkViewport);
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

  return (
    <section className="min-h-screen relative overflow-hidden">
      <div
        className="max-w-5xl mx-auto relative z-10 h-screen flex items-center justify-center px-4 md:px-8"
        style={{ paddingBottom: heroPaddingBottom, paddingTop: heroPaddingTop }}
      >
          {isMobile ? (
            <div
              className="flex flex-col items-center justify-center gap-3"
              style={{ transform: `translateY(${mobileHeroShift})` }}
            >
              <ProfileImage isMobile={isMobile} sizeOverride={mobileProfileSize} />
              <div className="flex flex-col items-center">
                <Trail
                  open
                  animationConfig={{ mass: 5, tension: 80, friction: 60 }}
                  itemHeight={heroTrailHeight}
                  trailStyle={heroTrailStyle}
                >
                  <span className={heroNameClass} style={{ lineHeight: '1.1', color: '#1a1a1a' }}>Johannes</span>
                  <span className={heroNameClass} style={{ lineHeight: '1.1', color: '#1a1a1a' }}>Sluis</span>
                  <span className={heroNameClass} style={{ lineHeight: '1.1', color: '#1a1a1a' }}>Portfolio</span>
                </Trail>
              </div>
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-12">
              <ProfileImage isMobile={isMobile} sizeOverride={250} />
              <div className="flex flex-col justify-center" style={{ marginTop: '-45px' }}>
                <Trail
                  open
                  animationConfig={{ mass: 5, tension: 80, friction: 60 }}
                  itemHeight={heroTrailHeight}
                  trailStyle={heroTrailStyle}
                >
                  <span className={heroNameClass} style={{ lineHeight: '1.1', color: '#1a1a1a' }}>Johannes</span>
                  <span className={heroNameClass} style={{ lineHeight: '1.1', color: '#1a1a1a' }}>Sluis</span>
                  <span className={`${heroNameClass} ${styles['highlight-text']}`} style={{ lineHeight: '1.1' }}>Portfolio</span>
                </Trail>
              </div>
            </div>
          )}
      </div>
      <WavyBackground className="absolute inset-0" />
    </section>
  );
};

export const AboutContent = () => {
  const chips = [
    { label: 'Microsoft software engineer', logo: microsoftLogo, alt: 'Microsoft logo', current: true },
    { label: 'Jenni AI intern', logo: jenniLogo, alt: 'Jenni AI logo', size: 28 },
    { label: 'Blue Origin intern', logo: blueOriginLogo, alt: 'Blue Origin logo' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      <PageHeading
        title="About"
        subtitle="A quick view of what I work on and the environments where I’ve done that work."
      />
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {chips.map((chip) => (
          <span
            key={chip.label}
            className="text-sm md:text-base font-semibold"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              borderRadius: '999px',
              border: chip.current ? '1px solid #60A5FA' : '1px solid var(--text-color)',
              backgroundColor: chip.current ? 'rgba(96, 165, 250, 0.14)' : 'transparent',
            }}
          >
            <img
              src={chip.logo}
              alt={chip.alt}
              style={{
                width: chip.size || 18,
                height: chip.size || 18,
                objectFit: 'contain',
                borderRadius: '4px',
              }}
            />
            {chip.label}
            {chip.current ? (
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
                  textTransform: 'uppercase',
                }}
              >
                Current
              </span>
            ) : null}
          </span>
        ))}
      </div>
      <div className="max-w-3xl mx-auto text-lg md:text-xl" style={{ lineHeight: '1.8', opacity: 0.9 }}>
        <p>
          I’m a Seattle-based engineer focused on building polished software that is practical for real users and teams.
        </p>
        <p className="mt-6">
          My background spans large-scale product engineering, startup execution, and research-driven interface work. That mix shows up in how I ship: clear UX, strong implementation details, and an interest in systems people actually want to use.
        </p>
      </div>
    </div>
  );
};

export const ContactFormContent = () => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState('idle');

  const sendEmail = (event) => {
    event.preventDefault();
    setLoading(true);
    setFormStatus('idle');

    emailjs
      .send(
        'service_5jo8tjd',
        'template_cpwd3s8',
        { subject, message },
        'N-gkjHJLoKESLpaki'
      )
      .then(() => {
        setSubject('');
        setMessage('');
        setLoading(false);
        setFormStatus('success');
        setTimeout(() => setFormStatus('idle'), 3000);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
        setFormStatus('error');
        setTimeout(() => setFormStatus('idle'), 3000);
      });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      <PageHeading
        title="Contact"
        subtitle="If you want to talk about work, projects, or collaboration, send a note here."
      />
      <div className="max-w-xl mx-auto">
        <Stack spacing={3}>
          <TextField
            label="Subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            fullWidth
            InputProps={{ startAdornment: <SubjectIcon sx={{ mr: 1, color: 'text.secondary' }} /> }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'var(--card-bg)',
              },
              '& .MuiInputLabel-root': { color: 'var(--text-color)' },
              '& .MuiOutlinedInput-input': { color: 'var(--text-color)' },
            }}
          />
          <TextField
            label="Message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            multiline
            rows={6}
            fullWidth
            InputProps={{ startAdornment: <MessageIcon sx={{ mr: 1, color: 'text.secondary', alignSelf: 'flex-start', mt: 1 }} /> }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'var(--card-bg)',
              },
              '& .MuiInputLabel-root': { color: 'var(--text-color)' },
              '& .MuiOutlinedInput-input': { color: 'var(--text-color)' },
            }}
          />
          <div className="flex justify-center">
            <Button
              variant="contained"
              onClick={sendEmail}
              disabled={loading || !subject || !message}
              endIcon={
                loading ? (
                  <FidgetSpinner
                    visible
                    height="20"
                    width="20"
                    ariaLabel="fidget-spinner-loading"
                  />
                ) : formStatus === 'success' ? (
                  <CheckCircleIcon />
                ) : formStatus === 'error' ? (
                  <ErrorIcon />
                ) : (
                  <SendIcon />
                )
              }
              sx={{
                borderRadius: '12px',
                py: 1.5,
                px: 4,
                fontSize: '1rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                background: 'linear-gradient(45deg, var(--primary-color) 30%, var(--secondary-color) 90%)',
              }}
            >
              {loading ? 'Sending...' : formStatus === 'success' ? 'Message Sent!' : formStatus === 'error' ? 'Try Again' : 'Send Message'}
            </Button>
          </div>
          {formStatus === 'success' ? (
            <div className="text-center text-green-600 font-medium">
              <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Your message has been sent successfully.
            </div>
          ) : null}
          {formStatus === 'error' ? (
            <div className="text-center text-red-600 font-medium">
              <ErrorIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              There was an error sending your message. Please try again.
            </div>
          ) : null}
        </Stack>
      </div>
    </div>
  );
};
