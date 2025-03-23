import React, { useMemo } from 'react';
import styles from './SubjectwiseAttendance.module.css';
import { Subject } from '../../types/attendance';

interface SubjectwiseAttendanceProps {
  subjects: Subject[];
}

export const SubjectwiseAttendance: React.FC<SubjectwiseAttendanceProps> = ({ subjects }) => {
  // Enhanced attendance color mapping with better grade ranges
  const getAttendanceInfo = (percentage: number | string) => {
    const numPercentage = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
    
    if (isNaN(numPercentage)) return { colorClass: styles.neutral, progressClass: '' };
    
    if (numPercentage >= 85) {
      return { colorClass: styles.excellent, progressClass: styles.progressExcellent };
    } else if (numPercentage >= 75) {
      return { colorClass: styles.excellent, progressClass: styles.progressExcellent };
    } else if (numPercentage >= 65) {
      return { colorClass: styles.average, progressClass: styles.progressAverage };
    } else {
      return { colorClass: styles.poor, progressClass: styles.progressPoor };
    }
  };

  // Get the primary percentage for sorting (prioritize theory over practical)
  const getPrimaryPercentage = (subject: Subject): number => {
    if (subject.percentage !== '--') {
      return typeof subject.percentage === 'string' ? parseFloat(subject.percentage) : subject.percentage;
    }
    if (subject.practical !== '--') {
      return parseFloat(subject.practical);
    }
    return -1; // For subjects with no percentage
  };

  // Calculate merged attendance for display purposes
  const getMergedAttendance = (subject: Subject) => {
    if (subject.percentage !== '--' && subject.practical !== '--') {
      const theory = typeof subject.percentage === 'string' ? parseFloat(subject.percentage) : subject.percentage;
      const practical = parseFloat(subject.practical);
      return ((theory + practical) / 2).toFixed(1);
    }
    return subject.percentage !== '--' ? subject.percentage : subject.practical;
  };

  // Process and sort subjects by their primary percentage (lowest first)
  const processedSubjects = useMemo(() => {
    const filtered = subjects
      .filter(subject => subject.subjectname !== 'MENTORING')
      .map(subject => {
        const mergedPercentage = getMergedAttendance(subject);
        const primaryPercentage = getPrimaryPercentage(subject);
        return {
          ...subject,
          mergedPercentage,
          primaryPercentage
        };
      })
      .filter(subject => subject.primaryPercentage !== -1);

    // Sort by primary percentage (lowest first)
    return filtered.sort((a, b) => a.primaryPercentage - b.primaryPercentage);
  }, [subjects]);

  return (
    <div className={styles.subjectsContainer}>
      <div className={styles.header}>
        <h3>Subject-wise Attendance</h3>
      </div>

      <div className={styles.subjects}>
        {processedSubjects.map((subject, index) => {
          const percentage = subject.mergedPercentage;
          const numPercentage = typeof percentage === 'string' ? parseFloat(percentage) : percentage;
          const { colorClass, progressClass } = getAttendanceInfo(numPercentage);

          return (
            <div key={index} className={styles.subjectTile}>
              <div className={styles.subjectInfo}>
                <span className={styles.subjectName}>{subject.subjectname}</span>
                <div className={styles.progressContainer}>
                  <div 
                    className={`${styles.progressBar} ${progressClass}`} 
                    style={{ width: `${Math.min(100, Math.max(0, numPercentage))}%` }}
                  />
                </div>
              </div>
              <span className={`${styles.percentageBadge} ${colorClass}`}>
                {percentage}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};