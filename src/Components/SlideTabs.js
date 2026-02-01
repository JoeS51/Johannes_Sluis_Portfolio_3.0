import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";
import { useDarkMode } from './DarkModeContext';

export const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.nav
      className="fixed top-0 left-0 w-full z-50 flex justify-center items-center p-4"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{
        duration: 0.6,
        ease: "easeOut",
        delay: 0.25
      }}
    >
      <ul
        onMouseLeave={() => {
          setPosition((pv) => ({
            ...pv,
            opacity: 0,
          }));
        }}
        className="relative flex w-fit rounded-full p-1"
        style={{
          maxWidth: isMobile ? '95vw' : 'auto',
          overflow: 'hidden',
          border: `2px solid ${isDarkMode ? 'var(--text-color)' : 'black'}`,
          backgroundColor: 'transparent',
          transition: 'border-color 0.3s ease'
        }}
      >
        <Tab setPosition={setPosition} sectionId="home" isMobile={isMobile} isDarkMode={isDarkMode}>Home</Tab>
        <Tab setPosition={setPosition} sectionId="about" isMobile={isMobile} isDarkMode={isDarkMode}>About</Tab>
        <Tab setPosition={setPosition} sectionId="experience" isMobile={isMobile} isDarkMode={isDarkMode}>{isMobile ? "Exp." : "Experience"}</Tab>
        <Tab setPosition={setPosition} sectionId="projects" isMobile={isMobile} isDarkMode={isDarkMode}>Projects</Tab>
        <Tab setPosition={setPosition} sectionId="blogs" isMobile={isMobile} isDarkMode={isDarkMode} isBlogTab>Blogs</Tab>
        {!isMobile && (
          <Tab setPosition={setPosition} sectionId="contact" isMobile={isMobile} isDarkMode={isDarkMode}>Contact</Tab>
        )}
        <Cursor position={position} isDarkMode={isDarkMode} />
      </ul>
    </motion.nav>
  );
};

const Tab = ({ children, setPosition, sectionId, isMobile, isDarkMode, isBlogTab }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    if (isBlogTab) {
      window.location.href = '/blog';
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      if (sectionId === 'home') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      } else {
        const offset = -100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <li
      ref={ref}
      onMouseEnter={() => {
        if (!ref?.current) return;
        const { width } = ref.current.getBoundingClientRect();
        setPosition({
          left: ref.current.offsetLeft,
          width,
          opacity: 1,
        });
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={handleClick}
      className={`relative z-10 block cursor-pointer transition-colors duration-200 ${isHovered ? 'text-white mix-blend-difference' : ''}`}
      style={{
        padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.25rem',
        fontSize: isMobile ? '0.75rem' : '1rem',
        textTransform: 'uppercase',
        color: isHovered ? 'white' : (isDarkMode ? 'var(--text-color)' : 'black'),
        transition: 'color 0.3s ease'
      }}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position, isDarkMode }) => {
  return (
    <motion.li
      animate={{
        ...position,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
      className="absolute z-0 h-7 rounded-full md:h-12"
      style={{
        backgroundColor: isDarkMode ? 'var(--text-color)' : 'black',
        transition: 'background-color 0.3s ease'
      }}
    />
  );
};

//export default SlideTabs;
