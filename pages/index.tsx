import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { Layout } from '../components/Layout/Layout';

export default function Home() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'submitting'>('idle');
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize with theme from localStorage (always default to light)
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
      
      // Trigger entrance animation
      setTimeout(() => {
        setIsAnimating(true);
      }, 300);
    }
  }, []);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSearches = localStorage.getItem('recentSearches');
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches));
      }
    }
  }, []);

  // Focus input on page load
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Navigation logic - separated to avoid repetition
  const navigateToDashboard = (number: string) => {
    // Prevent duplicate submissions
    if (status === 'submitting') return;
    
    setStatus('submitting');
    
    // Save to recent searches
    const updatedSearches = [number, ...recentSearches.filter(num => num !== number)].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    
    // Add exit animation before navigation
    setIsAnimating(false);
    setTimeout(() => {
      router.push({
        pathname: '/dashboard',
        query: { phoneNumber: number }
      });
    }, 400);
  };

  // Handle phone number input with auto-submission
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 10) {
      setPhoneNumber(value);
      
      // Update status based on input length
      if (value.length === 10) {
        setStatus('ready');
        // Auto-submit after a short delay to allow user to see the completed number
        setTimeout(() => navigateToDashboard(value), 300);
      } else {
        setStatus('idle');
      }
    }
  };

  // Toggle dark/light mode with localStorage persistence
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.className = newMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Format phone number for display - without hyphens
  const formatPhoneNumber = (value: string) => {
    return value; // Return the number without formatting
  };

  return (
    <Layout
      darkMode={darkMode}
      onToggleTheme={toggleDarkMode}
      title="KMEC Student Tracker"
    >
      <div className={styles.contentCard}>
        <h1 className={styles.title}>
           <span className={styles.titleHighlight}>Student Tracker</span>
        </h1>
        
        <p className={styles.description}>
          Track you attendance records & Exam results instantly.
        </p>

        <div className={styles.formContainer}>
          <div className={styles.phoneInputContainer}>
            <span className={styles.countryCode}>+91</span>
            <input
              type="tel"
              value={formatPhoneNumber(phoneNumber)}
              onChange={handlePhoneNumberChange}
              placeholder="Enter 10-digit number"
              className={styles.phoneInput}
              ref={inputRef}
              aria-label="Parent's phone number"
              maxLength={12}
              disabled={status === 'submitting'}
            />
            <div className={styles.inputBorder}></div>
          </div>
          
          {recentSearches.length > 0 && (
            <div className={styles.recentSearches}>
              <h4>Recent Searches</h4>
              <div className={styles.recentList}>
                {recentSearches.map((number, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setPhoneNumber(number);
                      navigateToDashboard(number);
                    }}
                    className={styles.recentItem}
                    disabled={status === 'submitting'}
                  >
                    <span className={styles.recentItemNumber}>{formatPhoneNumber(number)}</span>
                    <svg className={styles.recentItemIcon} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div 
            className={`${styles.submitButton} ${phoneNumber.length === 10 ? styles.active : ''} ${status === 'submitting' ? styles.submitting : ''}`}
          >
            <span>
              {status === 'submitting' ? 'Loading...' : 'Get Attendance'}
            </span>
            {status !== 'submitting' && (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            )}
            {status === 'submitting' && (
              <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
            )}
          </div>
        </div>
      </div>

      <div className={styles.usefulLinks}>
        <h3 className={styles.linksTitle}>Useful Links</h3>
        <div className={styles.linksGrid}>
        <a href="https://unstop.com/hackathons?oppstatus=open&region=online&quickApply=true" 
             className={styles.linkItem} 
             target="_blank" 
             rel="noopener noreferrer">
            <div className={styles.linkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </div>
            <div className={styles.linkText}>
              <span className={styles.linkTitle}>Hackathons</span>
              <span className={styles.linkDesc}>Upcoming coding challenges</span>
            </div>
          </a>

          <a href="https://t.me/OUCSENOTES_Bot" className={styles.linkItem} target="_blank" rel="noopener noreferrer">
            <div className={styles.linkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            </div>
            <div className={styles.linkText}>
              <span className={styles.linkTitle}>Study Resources</span>
              <span className={styles.linkDesc}>Access learning materials</span>
            </div>
          </a>
          
          <a href="https://raw.githubusercontent.com/ngit24/Attendance/main/almanac.jpg" className={styles.linkItem} target="_blank" rel="noopener noreferrer">
            <div className={styles.linkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className={styles.linkText}>
              <span className={styles.linkTitle}>Academic Calendar</span>
              <span className={styles.linkDesc}>Important dates & events</span>
            </div>
          </a>
          
          <a href="https://kmec24.vercel.app/test.html" className={styles.linkItem} target="_blank" rel="noopener noreferrer">
            <div className={styles.linkIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div className={styles.linkText}>
              <span className={styles.linkTitle}>CIE Marks</span>
              <span className={styles.linkDesc}>View your internal marks</span>
            </div>
          </a>
          
          
          
    
        </div>
      </div>
    </Layout>
  );
}