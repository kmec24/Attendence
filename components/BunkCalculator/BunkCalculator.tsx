import React from 'react';
import styles from './BunkCalculator.module.css';

interface BunkCalculatorProps {
  firebase: {
    total: string;  // Format: "(82 /94)"
  };
  attendance?: {
    overallattperformance?: {
      totalpercentage?: string;
    };
  };
}

export const BunkCalculator: React.FC<BunkCalculatorProps> = ({ firebase, attendance }) => {
  const calculateBunkStatus = () => {
    // Extract attendance numbers from the string format "(attended /total)"
    const matches = firebase.total.match(/\((\d+)\s*\/\s*(\d+)\)/);
    if (!matches) {
      return {
        type: 'neutral',
        canSkip: false,
        message: "Unable to calculate attendance stats",
        count: 0
      };
    }

    const attendedClasses = parseInt(matches[1]);
    const totalClasses = parseInt(matches[2]);
    
    // Validate the parsed numbers
    if (isNaN(attendedClasses) || isNaN(totalClasses) || totalClasses === 0) {
      return {
        type: 'neutral',
        canSkip: false,
        message: "Invalid attendance data",
        count: 0
      };
    }
    
    const currentPercentage = (attendedClasses / totalClasses) * 100;
    const formattedPercentage = currentPercentage.toFixed(2);
    
    // Consider percentages very close to 75% as exactly 75%
    // This handles cases like 75.25% or 75.75% 
    if (currentPercentage >= 75 && currentPercentage < 76) {
      return {
        type: 'exact',
        canSkip: false,
        message: `Your attendance is exactly 75%. You can't afford to skip any classes .`,
        count: 0
      };
    }
    
    // Check if exactly at 75%
    if (Math.abs(currentPercentage - 75) < 0.01) {
      return {
        type: 'exact',
        canSkip: false,
        message: `Your attendance is exactly 75%. You can't afford to skip any classes .`,
        count: 0
      };
    }

    // Below 75% - need to attend more classes
    if (currentPercentage < 75) {
      const targetPercentage = 0.75;
      // Use Math.ceil to ensure we get enough classes (round up any decimals)
      const classesNeeded = Math.ceil((targetPercentage * totalClasses - attendedClasses) / (1 - targetPercentage));
      
      // Edge case: If the required number of classes exceeds the total classes so far
      if (classesNeeded > totalClasses) {
        // We can't know the total semester classes, but we know it's at least the current total
        // Checking if it's mathematically possible to reach 75%
        // Using Math.ceil to handle decimal percentages conservatively
        if (Math.ceil(attendedClasses * 4) < Math.ceil(totalClasses * 3)) {  // 75% = 3/4
          return {
            type: 'below',
            canSkip: false,
            message: `It's not mathematically possible for you to reach 75% with the current attendance 💀.`,
            count: 0,
            actionText: ''
          };
        } else {
          return {
            type: 'below',
            canSkip: false,
            message: `You need perfect attendance going forward to have a chance at reaching 75%.`,
            count: 0,
            actionText: ''
          };
        }
      }
      
      return {
        type: 'below',
        canSkip: false,
        message: `You need to attend ${classesNeeded} consecutive classes to reach 75% attendance.`,
        count: 0,
        actionText: ''
      };
    }

    // Above 75% - can afford to skip some classes.
    // Calculate how many classes can be skipped while maintaining 75%
    // For x classes skipped: attended / (total + x) = 0.75
    // Solving for x: x = (attended / 0.75) - total
    // Using Math.floor to be conservative with decimal results (don't overestimate skippable classes)
    const skippableClasses = Math.floor(attendedClasses / 0.75 - totalClasses);
    
    return {
      type: 'above',
      canSkip: true,
      message: `Looking good!`,
      count: skippableClasses,
      actionText: 'classes can be skipped and you can still have 75% attendance.'
    };
  };

  const bunkStatus = calculateBunkStatus();

  return (
    <div className={styles.bunkCalculator}>
      <div className={styles.bunkHeader}>
        <h3>Bunk Planner</h3>
      </div>
      
      <div className={`${styles.bunkContent} ${styles[bunkStatus.type]}`}>
        <div className={styles.bunkIcon}>
          {bunkStatus.canSkip ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={styles.excellentIcon}>
              <path d="M14.72,8.79l-4.29,4.3L8.78,11.44a1,1,0,1,0-1.41,1.41l2.35,2.36a1,1,0,0,0,.71.29,1,1,0,0,0,.7-.29l5-5a1,1,0,0,0,0-1.42A1,1,0,0,0,14.72,8.79ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" />
            </svg>
          ) : bunkStatus.type === 'below' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={styles.poorIcon}>
              <path d="M15.71,8.29a1,1,0,0,0-1.42,0L12,10.59,9.71,8.29A1,1,0,0,0,8.29,9.71L10.59,12l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L13.41,12l2.3-2.29A1,1,0,0,0,15.71,8.29Zm3.36-3.36A10,10,0,1,0,4.93,19.07,10,10,0,1,0,19.07,4.93ZM17.66,17.66A8,8,0,1,1,20,12,7.95,7.95,0,0,1,17.66,17.66Z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={styles.neutralIcon}>
              <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" />
            </svg>
          )}
        </div>
        
        <div className={styles.bunkDetails}>
          <p className={styles.bunkMessage}>{bunkStatus.message}</p>
          {bunkStatus.count > 0 && (
            <div className={styles.bunkCount}>
              <span>{bunkStatus.count}</span>
              <span className={styles.bunkUnit}>
                {bunkStatus.actionText}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className={styles.updateInfo}>
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Zm0-8.5a1,1,0,0,0-1,1v3a1,1,0,0,0,2,0v-3A1,1,0,0,0,12,11.5Zm0-4a1.25,1.25,0,1,0,1.25,1.25A1.25,1.25,0,0,0,12,7.5Z" />
        </svg>
        <span>Updates once a day at 5 PM</span>
      </div>
    </div>
  );
};
