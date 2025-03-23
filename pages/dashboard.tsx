import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Dashboard.module.css';
import { Layout } from '../components/Layout/Layout';
import { DaywiseAttendance } from '../components/DaywiseAttendance/DaywiseAttendance';
import { SubjectwiseAttendance } from '../components/SubjectwiseAttendance/SubjectwiseAttendance';
// Remove BunkCalculator import
import { OverallAttendance } from '../components/OverallAttendance/OverallAttendance';
import type { AttendanceData } from '../types/attendance';
import { GreetingBox } from '../components/GreetingBox/GreetingBox';

function formatDateTime(dateString: string) {
  const date = new Date(dateString.replace(' IST', ''));
  
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return `${time} • ${formattedDate}`;
}

function formatLastUpdated(dateString: string) {
  const date = new Date(dateString.replace(' IST', ''));
  
  const time = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
  
  const formattedDate = date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return {
    label: 'Last Updated',
    time,
    date: formattedDate
  };
}

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [studentData, setStudentData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDays, setExpandedDays] = useState<'none' | 'some' | 'all'>('none');
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();
  const { phoneNumber } = router.query;
  
  // Add ref to prevent duplicate API calls
  const apiCallTracker = useRef<{[key: string]: boolean}>({});
  // Add container ref for text fitting
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize current time and update it every minute
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Initialize theme based on localStorage (default to light)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        const isDark = savedTheme === 'dark';
        setDarkMode(isDark);
        document.body.className = isDark ? 'dark-mode' : 'light-mode';
      } else {
        // Default to light mode for new users
        setDarkMode(false);
        localStorage.setItem('theme', 'light');
        document.body.className = 'light-mode';
      }
    }
  }, []);

  // Fetch student data from API
  useEffect(() => {
    // Only proceed if phoneNumber exists and is a string
    if (!phoneNumber || typeof phoneNumber !== 'string') return;
    
    // Check if we've already started this API call in this component instance
    const phoneKey = phoneNumber.toString();
    if (apiCallTracker.current[phoneKey]) return;

    // Mark that we're making this API call
    apiCallTracker.current[phoneKey] = true;
    
    const fetchData = async () => {
      try {
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        
        // Define the request key before making the fetch request
        const requestKey = `api_request_${phoneKey}`;
        
        const response = await fetch(`https://kmec24.89determined.workers.dev/?mobile_number=${phoneKey}&_t=${timestamp}`);
        
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        
        // Only process and set data if we actually have valid data
        if (data && typeof data === 'object') {
          // Cache is still maintained but always overwritten with fresh data
          sessionStorage.setItem(requestKey, JSON.stringify(data));
          
          setStudentData(data);
          setLoading(false);
        } else {
          throw new Error('Invalid data received');
        }
      } catch (err) {
        setError('Incorrect number, try again with your parents number.');
        setLoading(false);
      }
    };

    fetchData();
  }, [phoneNumber]);

  // Toggle dark/light mode with persistence
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.className = newMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Toggle expansion state
  const toggleExpand = () => {
    switch (expandedDays) {
      case 'none':
        setExpandedDays('some');
        break;
      case 'some':
        setExpandedDays('all');
        break;
      case 'all':
        setExpandedDays('none');
        break;
    }
  };

  // Go back to home page
  const goBack = () => {
    router.push('/');
  };

  // Render loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading attendance data...</p>
        <p className={styles.loadingHint}>This process can take up to 5 seconds</p>
      </div>
    );
  }

  // Render error state
  if (error || !studentData) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorMessage}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <p>{error || 'No data found for this number.'}</p>
        </div>
        <button onClick={goBack} className={styles.backButton}>
          Go Back
        </button>
      </div>
    );
  }

  return (
    <Layout 
      darkMode={darkMode}
      onToggleTheme={toggleDarkMode}
      onBack={goBack}
      title="Student Dashboard | NGIT"
    >
      <GreetingBox studentName={studentData.name} />

      <div className={styles.studentInfoCard}>
        <OverallAttendance 
          percentage={studentData.attendance.overallattperformance.totalpercentage}
          colorCode={studentData.attendance.overallattperformance.colorcode}
          lastUpdated={currentTime}
        />

        {/* Remove BunkCalculator component */}

        <div className={styles.attendanceSummary}>
          <DaywiseAttendance 
            days={studentData.attendance.attandance.dayobjects}
            expandedDays={expandedDays}
            onToggleExpand={toggleExpand}
          />
        </div>

        <SubjectwiseAttendance 
          subjects={studentData.attendance.overallattperformance.overall}
        />
      </div>
    </Layout>
  );
}

function getAttendanceColorClass(percentage: number, colorCode: string | null) {
  if (!colorCode) return 'neutral';
  
  switch (colorCode.toLowerCase()) {
    case '#137512':
      return 'excellent';
    case '#fdb004':
      return 'average';
    case '#832533':
      return 'poor';
    default:
      return 'neutral';
  }
}