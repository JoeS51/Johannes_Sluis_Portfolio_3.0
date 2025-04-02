import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-scroll";

export const SlideTabs = () => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex justify-center items-center p-4">
      <ul
        onMouseLeave={() => {
          setPosition((pv) => ({
            ...pv,
            opacity: 0,
          }));
        }}
        className="relative flex w-fit rounded-full border-2 border-black bg-transparent p-1"
        style={{
          maxWidth: isMobile ? '95vw' : 'auto',
          overflow: 'hidden'
        }}
      >
        <Tab setPosition={setPosition} sectionId="home" isMobile={isMobile}>Home</Tab>
        <Tab setPosition={setPosition} sectionId="about" isMobile={isMobile}>About</Tab>
        <Tab setPosition={setPosition} sectionId="experience" isMobile={isMobile}>{isMobile ? "Exp." : "Experience"}</Tab>
        <Tab setPosition={setPosition} sectionId="projects" isMobile={isMobile}>Projects</Tab>
        <Tab setPosition={setPosition} sectionId="contact" isMobile={isMobile}>Contact</Tab>
        <Cursor position={position} />
      </ul>
    </nav>
  );
};

const Tab = ({ children, setPosition, sectionId, isMobile }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
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
      className={`relative z-10 block cursor-pointer transition-colors duration-200 ${isHovered ? 'text-white mix-blend-difference' : 'text-black'
        }`}
      style={{
        padding: isMobile ? '0.5rem 0.75rem' : '0.75rem 1.25rem',
        fontSize: isMobile ? '0.75rem' : '1rem',
        textTransform: 'uppercase'
      }}
    >
      {children}
    </li>
  );
};

const Cursor = ({ position }) => {
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
      className="absolute z-0 h-7 rounded-full bg-black md:h-12"
    />
  );
};

//export default SlideTabs;