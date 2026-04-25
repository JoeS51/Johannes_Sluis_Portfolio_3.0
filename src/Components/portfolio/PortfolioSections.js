import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Divider from '@mui/material/Divider';
import { Stack } from '@mui/material';
import Trail from '../Trail';
import microsoftLogo from '../../Pictures/microsoft.svg';
import jenniLogo from '../../Pictures/jenni-logo.png';
import blueOriginLogo from '../../Pictures/blue.png';
import profileIllustration from '../../Pictures/pfp.png';
import profilePhoto from '../../Pictures/profilepic.jpeg';
import { WavyBackground } from '../Wave';

export const useViewportWidth = () => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return viewportWidth;
};

export const useIsMobile = () => useViewportWidth() <= 768;

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
  const viewportWidth = useViewportWidth();
  const isMobile = viewportWidth <= 768;

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
                  <span className={heroNameClass} style={{ lineHeight: '1.1' }}>Portfolio</span>
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
          I’m a Seattle-based engineer currently focused on database internals, especially Postgres, and distributed systems.
        </p>
        <p className="mt-6">
          I also help lead the Microsoft Systems Reading Group, where we read through Postgres internals and systems research papers.
        </p>
      </div>
    </div>
  );
};

export const ContactFormContent = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8">
      <PageHeading
        title="Contact"
        subtitle="Best ways to reach me."
      />
      <div className="max-w-2xl mx-auto">
        <Stack spacing={2.5}>
          <a
            href="mailto:joesluis51@gmail.com"
            style={{
              display: 'block',
              padding: '18px 22px',
              borderRadius: '14px',
              border: '1px solid var(--divider-color)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-color)',
              textDecoration: 'none',
            }}
          >
            Email
            <div style={{ opacity: 0.75, marginTop: '6px' }}>joesluis51@gmail.com</div>
          </a>
          <a
            href="https://github.com/JoeS51"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              padding: '18px 22px',
              borderRadius: '14px',
              border: '1px solid var(--divider-color)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-color)',
              textDecoration: 'none',
            }}
          >
            GitHub
            <div style={{ opacity: 0.75, marginTop: '6px' }}>github.com/JoeS51</div>
          </a>
          <a
            href="https://www.linkedin.com/in/joesluis/"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'block',
              padding: '18px 22px',
              borderRadius: '14px',
              border: '1px solid var(--divider-color)',
              backgroundColor: 'var(--card-bg)',
              color: 'var(--text-color)',
              textDecoration: 'none',
            }}
          >
            LinkedIn
            <div style={{ opacity: 0.75, marginTop: '6px' }}>linkedin.com/in/joesluis</div>
          </a>
        </Stack>
      </div>
    </div>
  );
};
