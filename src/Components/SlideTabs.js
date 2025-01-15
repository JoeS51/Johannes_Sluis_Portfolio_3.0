import React, { useRef, useState } from "react";
import { motion } from "framer-motion";

export const SlideTabs = ({ parallaxRef }) => {
  const [position, setPosition] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

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
      >
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={0}>Home</Tab>
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={1}>About Me</Tab>
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={2}>Experience</Tab>
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={3.4}>Projects</Tab>
        <Tab setPosition={setPosition} parallaxRef={parallaxRef} offset={5}>Contact</Tab>
        <Cursor position={position} />
      </ul>
    </nav>
  );
};

const Tab = ({ children, setPosition, parallaxRef, offset }) => {
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
      className={`relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase transition-colors duration-200 md:px-5 md:py-3 md:text-base ${isHovered ? 'text-white mix-blend-difference' : 'text-black'
        }`}
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