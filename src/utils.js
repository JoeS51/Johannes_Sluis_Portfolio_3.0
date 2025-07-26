import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Enhanced responsive breakpoint utilities
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1200,
  large: 1440
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState('desktop');
  
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.mobile) {
        setScreenSize('mobile');
      } else if (width < BREAKPOINTS.tablet) {
        setScreenSize('tablet');
      } else if (width < BREAKPOINTS.desktop) {
        setScreenSize('desktop');
      } else {
        setScreenSize('large');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  return {
    screenSize,
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop' || screenSize === 'large',
    isLarge: screenSize === 'large'
  };
};

export const getResponsiveValue = (values, screenSize) => {
  const breakpointOrder = ['mobile', 'tablet', 'desktop', 'large'];
  const currentIndex = breakpointOrder.indexOf(screenSize);
  
  // Return the appropriate value or fall back to the largest available
  for (let i = currentIndex; i >= 0; i--) {
    if (values[breakpointOrder[i]] !== undefined) {
      return values[breakpointOrder[i]];
    }
  }
  
  // Fallback to the largest available value
  for (let i = breakpointOrder.length - 1; i >= 0; i--) {
    if (values[breakpointOrder[i]] !== undefined) {
      return values[breakpointOrder[i]];
    }
  }
  
  return values.mobile || values.default;
};
