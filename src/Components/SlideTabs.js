import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export const SlideTabs = ({ parallaxRef }) => {
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
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={0} isMobile={isMobile}>Home</Tab>
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={1} isMobile={isMobile}>About</Tab>
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={2} isMobile={isMobile}>Exp</Tab>
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={3.4} isMobile={isMobile}>Projects</Tab>
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={5} isMobile={isMobile}>Contact</Tab>
        <Cursor position={position} />
      </ul>
    </nav>
  );
};

const Tab = ({ children, setPosition, parallaxRef, offset, isMobile }) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event) => {
    event.preventDefault();
    if (parallaxRef.current) {
      parallaxRef.current.scrollTo(offset * 0.95);
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