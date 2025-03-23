import { useEffect } from 'react';

// This component handles viewport height issues on mobile browsers
export function ViewportFix() {
  useEffect(() => {
    // Fix for mobile viewport height issues
    const setVH = () => {
      // Set CSS variable to the actual viewport height
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set initial value
    setVH();
    
    // Update on resize and orientation change
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  return null; // This component doesn't render anything
}
