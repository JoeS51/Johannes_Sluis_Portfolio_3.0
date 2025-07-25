import React from 'react';
import { useResponsive, getResponsiveValue } from '../utils';

const ResponsiveImage = ({ 
  src, 
  alt, 
  className = '', 
  sizes = {
    mobile: '250px',
    tablet: '300px', 
    desktop: '350px',
    large: '400px'
  },
  style = {} 
}) => {
  const { screenSize } = useResponsive();
  
  const responsiveSize = getResponsiveValue(sizes, screenSize);
  
  return (
    <img
      src={src}
      alt={alt}
      className={`responsive-image ${className}`}
      style={{
        width: responsiveSize,
        height: responsiveSize,
        objectFit: 'cover',
        transition: 'all 0.3s ease',
        ...style
      }}
      loading="lazy"
      // For production, you would generate multiple sizes of the image
      // srcSet={`
      //   ${src} 1x,
      //   ${src.replace('.', '@2x.')} 2x,
      //   ${src.replace('.', '@3x.')} 3x
      // `}
    />
  );
};

export default ResponsiveImage;