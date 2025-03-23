import { useEffect, useRef, useState } from 'react';
import styles from './GreetingBox.module.css';

interface GreetingBoxProps {
  studentName: string;
}

export const GreetingBox = ({ studentName }: GreetingBoxProps) => {
  const [greeting, setGreeting] = useState('');
  const nameRef = useRef<HTMLDivElement>(null);
  const nameTextRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting('Good Morning,');
    } else if (hour < 17) {
      setGreeting('Good Afternoon,');
    } else {
      setGreeting('Good Evening,');
    }
  }, []);

  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;
    let rafId: number;

    const debounceAdjustTextSize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(adjustTextSize, 100);
    };

    const getTextWidth = (text: string, font: string) => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        context.font = font;
        const metrics = context.measureText(text);
        return metrics.width;
      }
      return 0;
    };

    const adjustTextSize = () => {
      const container = nameRef.current;
      const text = nameTextRef.current;

      if (!container || !text) return;

      // Reset styles
      text.style.fontSize = '';

      // Get container's effective width
      const styles = window.getComputedStyle(container);
      const paddingLeft = parseFloat(styles.paddingLeft) || 0;
      const paddingRight = parseFloat(styles.paddingRight) || 0;
      const borderLeft = parseFloat(styles.borderLeftWidth) || 0;
      const borderRight = parseFloat(styles.borderRightWidth) || 0;
      const containerWidth = container.offsetWidth - paddingLeft - paddingRight - borderLeft - borderRight;

      const isMobile = window.innerWidth <= 768;
      const baseFontSize = isMobile ? 1.5 : 1.8; // rem

      if (containerWidth <= 0) return;

      // Get the computed font style for accurate measurement
      const computedStyle = window.getComputedStyle(text);
      const fontFamily = computedStyle.fontFamily;
      const fontWeight = computedStyle.fontWeight;

      // Measure text width using canvas at base font size
      const font = `${fontWeight} ${baseFontSize}rem ${fontFamily}`;
      const textWidth = getTextWidth(studentName, font);

      // Calculate scaling factor
      if (textWidth > containerWidth) {
        const scale = containerWidth / textWidth;
        const newFontSize = baseFontSize * scale * 0.85; // 15% buffer
        const finalFontSize = Math.max(newFontSize, 0.4); // Minimum 0.4rem
        text.style.fontSize = `${finalFontSize}rem`;
      } else {
        text.style.fontSize = `${baseFontSize}rem`;
      }
    };

    const scheduleAdjustTextSize = () => {
      rafId = requestAnimationFrame(() => {
        adjustTextSize();
      });
    };

    scheduleAdjustTextSize();

    window.addEventListener('resize', debounceAdjustTextSize);

    return () => {
      window.removeEventListener('resize', debounceAdjustTextSize);
      clearTimeout(resizeTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [studentName]);

  return (
    <div className={styles.greetingBox}>
      <div className={styles.greetingBoxInner}>
        <h2 className={styles.greetingText}>{greeting}</h2>
        <div ref={nameRef} className={styles.greetingTimeContainer}>
          <span ref={nameTextRef} className={styles.greetingTime}>{studentName}</span>
        </div>
      </div>
    </div>
  );
};