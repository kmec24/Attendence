import React, { useEffect, useState } from 'react';
import styles from './OverallAttendance.module.css';

interface OverallAttendanceProps {
  percentage: string;
  colorCode: string;
  lastUpdated: Date;
}

export const OverallAttendance: React.FC<OverallAttendanceProps> = ({
  percentage,
  colorCode,
  lastUpdated
}) => {
  const percentageValue = parseFloat(percentage);
  
  // Determine status and color based on percentage
  const getStatusAndStyles = (percent: number) => {
    if (percent >= 75) {
      return {
        status: 'Good',
        circleClass: styles.onTrackCircle,
        statusClass: styles.onTrackStatus
      };
    } else if (percent >= 65) {
      return {
        status: 'Warning',
        circleClass: styles.warningCircle,
        statusClass: styles.warningStatus
      };
    } else {
      return {
        status: 'Critical',
        circleClass: styles.dangerCircle,
        statusClass: styles.dangerStatus
      };
    }
  };
  
  const { status, circleClass, statusClass } = getStatusAndStyles(percentageValue);
  
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  
  // Calculate the circle properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;
  
  // Animate the percentage on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentageValue);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentageValue]);
  
  // Calculate fill opacity based on percentage (min 0.3, max 1.0)
  const fillOpacity = 0.3 + (percentageValue / 100) * 0.7;
  
  return (
    <div className={styles.attendanceContainer}>
      <h3 className={styles.attendanceTitle}>Overall Attendance</h3>
      
      <div className={styles.circleProgressContainer}>
        <div className={styles.circleWrapper}>
          <svg className={styles.circleSvg} viewBox="0 0 180 180">
            {/* Background circle */}
            <circle 
              className={styles.circleBackground}
              cx="90" 
              cy="90" 
              r={radius} 
              strokeWidth="10" 
              fill="transparent"
            />
            
            {/* Progress circle */}
            <circle 
              className={`${styles.circleProgress} ${circleClass}`}
              cx="90" 
              cy="90" 
              r={radius} 
              strokeWidth="10" 
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90, 90, 90)"
              style={{ opacity: fillOpacity }}
            />
          </svg>
          
          <div className={styles.circleContent}>
            <span className={styles.circlePercentage}>{percentage}%</span>
            <div className={styles.statusWrapper}>
              <span className={`${styles.statusLabel} ${statusClass}`}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.updateInfo}>
        <span className={styles.updateLabel}>Last Updated:</span>
        <span className={styles.updateDateTime}>
          {lastUpdated.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}
          {' • '}
          {lastUpdated.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
      </div>
    </div>
  );
};