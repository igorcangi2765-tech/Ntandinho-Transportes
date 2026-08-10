import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    windowWidth,
    isMobile: windowWidth < 768,
    isTabletPortrait: windowWidth >= 768 && windowWidth < 1024,
    isTabletLandscape: windowWidth >= 1024 && windowWidth < 1280,
    isLaptop: windowWidth >= 1280 && windowWidth < 1920,
    isDesktop: windowWidth >= 1920
  };
};
