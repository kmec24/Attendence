import React from 'react';
import styles from './DaywiseAttendance.module.css';
import { DayObject } from '../../types/attendance';

interface DaywiseAttendanceProps {
  days: DayObject[];
  expandedDays: 'none' | 'some' | 'all';
  onToggleExpand: () => void;
}

export const DaywiseAttendance: React.FC<DaywiseAttendanceProps> = ({
  days,
  expandedDays,
  onToggleExpand,
}) => {
  const getSessionStatus = (value: string) => {
    switch (value) {
      case '0':
        return 'absent';
      case '1':
        return 'present';
      case '2':
        return 'no-class';
      default:
        return 'unknown';
    }
  };

  const getAttendanceIcon = (status: string) => {
    switch (status) {
      case '1': // present
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="green">
            <path d="M14.72,8.79l-4.29,4.3L8.78,11.44a1,1,0,1,0-1.41,1.41l2.35,2.36a1,1,0,0,0,.71.29,1,1,0,0,0,.7-.29l5-5a1,1,0,0,0,0-1.42A1,1,0,0,0,14.72,8.79ZM12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" />
          </svg>
        );
      case '0': // absent
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red">
            <path d="M15.71,8.29a1,1,0,0,0-1.42,0L12,10.59,9.71,8.29A1,1,0,0,0,8.29,9.71L10.59,12l-2.3,2.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0L12,13.41l2.29,2.3a1,1,0,0,0,1.42,0,1,1,0,0,0,0-1.42L13.41,12l2.3-2.29A1,1,0,0,0,15.71,8.29Zm3.36-3.36A10,10,0,1,0,4.93,19.07,10,10,0,1,0,19.07,4.93ZM17.66,17.66A8,8,0,1,1,20,12,7.95,7.95,0,0,1,17.66,17.66Z" />
          </svg>
        );
      case '2': // no-class
      default:
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z" />
          </svg>
        );
    }
  };

  const getVisibleDays = (days: DayObject[]) => {
    switch (expandedDays) {
      case 'none':
        return days.slice(0, 1);
      case 'some':
        return days.slice(0, 5);
      case 'all':
        return days;
    }
  };

  const visibleDays = getVisibleDays(days);

  return (
    <div className={styles.dayWiseContainer}>
      <div className={styles.dayWiseHeader}>
        <h3>Day-wise Attendance</h3>
        <button onClick={onToggleExpand} className={styles.expandButton}>
          {expandedDays === 'none' ? 'Show More' : expandedDays === 'some' ? 'Show All' : 'Show Less'}
        </button>
      </div>
      <div className={styles.daysList}>
        {visibleDays.map((day, dayIndex) => (
          <div key={dayIndex} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <span className={styles.date}>{day.date}</span>
            </div>
            <div className={styles.sessions}>
              {Object.entries(day.sessions).map(([session, status], index) => (
                <div 
                  key={session} 
                  className={`${styles.session} ${styles[getSessionStatus(status)]}`}
                  title={`Session ${index + 1}: ${getSessionStatus(status)}`}
                >
                  {getAttendanceIcon(status)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.legendContainer}>
        <div className={styles.legendItem}>
          <div className={`${styles.session} ${styles.present}`}>
            {getAttendanceIcon('1')}
          </div>
          <span>Present</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.session} ${styles.absent}`}>
            {getAttendanceIcon('0')}
          </div>
          <span>Absent</span>
        </div>
        <div className={styles.legendItem}>
          <div className={`${styles.session} ${styles['no-class']}`}>
            {getAttendanceIcon('2')}
          </div>
          <span>Not Taken</span>
        </div>
      </div>
    </div>
  );
};