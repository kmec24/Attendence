import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import styles from './Layout.module.css';
import SidePuller from '../SidePuller/SidePuller';

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onToggleTheme: () => void;
  onBack?: () => void;
  title?: string;
}

export const Layout = ({ children, darkMode, onToggleTheme, onBack, title = 'KMEC' }: LayoutProps) => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const [sidePullerOpen, setSidePullerOpen] = useState(false);

  const toggleSidePuller = () => {
    setSidePullerOpen(!sidePullerOpen);
  };

  return (
    <div className={`${styles.container} ${styles.animated}`}>
      <Head>
        <title>{title}</title>
        <meta name="description" content="KMEC Student Portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
        {isHomePage ? (
          <div className={styles.logoSmall}>
            <span>KMEC</span>
          </div>
        ) : (
          <button onClick={onBack} className={styles.backButton}>
            <svg className={styles.backIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>
        )}
        
        <div className={styles.themeToggle} onClick={onToggleTheme}>
          {darkMode ? (
            <svg className={styles.themeIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg className={styles.themeIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </div>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div>Designed by<span>Vardan  NGIT (2024-28)</span></div>
        <div></div>
      </footer>

      {/* Improved SidePuller with better UI */}
      <SidePuller 
        isOpen={sidePullerOpen}
        onToggle={toggleSidePuller}
        onClose={() => setSidePullerOpen(false)}
      >
        <div className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <img 
              src="/profile.jpg" 
              alt="Profile"
              className={styles.profileImage}
            />
            <div className={styles.profileInfo}>
              <h2>Vardan</h2>
              <p className={styles.title}>Freshman</p>
              <p className={styles.subtitle}>CSE (AI & ML) | NGIT (2024-28)</p>
            </div>
            <button 
              className={styles.closeButton}
              onClick={() => setSidePullerOpen(false)}
              aria-label="Close panel"
              title="Close profile panel"
            >
              
            </button>
          </div>
        </div>
        
        <div className={styles.resumeSection}>
          <div className={styles.section}>
            <h3>About Me</h3>
            <p className={styles.bio}>
              First-year student passionate about technology and excited to begin my journey in Computer Science. Looking forward to learning programming and exploring the world of AI & ML at NGIT.
            </p>
          </div>

          

          <div className={styles.section}>
            <h3>My Projects</h3>
            <div className={styles.projectsList}>
              <a href="https://github.com/localhost969/QuickBite" className={styles.projectItem}>
                <img src="https://i.ibb.co/ns7rjynG/418247343-9f87ecf1-3019-4a14-82fc-30e3705c9863.png"  alt="QuickBite" className={styles.projectImage} />
                <div className={styles.projectInfo}>
                  <h4>QuickBite</h4>
                  <p>A canteen management system built with Next.js and Firebase</p>
                </div>
              </a>
              <a href="https://github.com/localhost969/Codeshare" className={styles.projectItem}>
                <img src="https://i.ibb.co/mFNJkBD0/408876189-29a41355-87d3-4611-9787-d94941b1250c.png" alt="Codeshare" className={styles.projectImage} />
                <div className={styles.projectInfo}>
                  <h4>Codeshare</h4>
                  <p>Real-time code sharing and collaboration platform built with html-css-js and Firebase</p>
                </div>
              </a>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Technical Expertise</h3>
            <div className={styles.skillsGrid}>
              <div className={styles.skillCategory}>
                <h4>Programming Languages</h4>
                <ul>
                  <li>C</li>
                  <li>Python</li>
                </ul>
              </div>
              <div className={styles.skillCategory}>
                <h4>Web Development</h4>
                <h5>Frontend</h5>
                <ul>
                  <li>React.js</li>
                  <li>Next.js</li>
                  <li>Vue.js</li>
                </ul>
                <h5>Backend</h5>
                <ul>
                  <li>Express.js</li>
                  <li>Flask</li>
                </ul>
                <h5>Databases</h5>
                <ul>
                  <li>MongoDB</li>
                  <li>Firebase</li>
                  <li>SQL</li>
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Areas of Interest</h3>
            <div className={styles.interestsList}>
              <div className={styles.interest}>Web Development</div>
            <div className={styles.interest}>Artificial Intelligence</div>
              <div className={styles.interest}>Cybersecurity</div>
              <div className={styles.interest}>Mobile Apps</div>
              <div className={styles.interest}>Chess</div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Contact Information</h3>
            <div className={styles.contactGrid}>
              <a href="https://instagram.com/vardn.19" className={styles.contactItem}>
                instagram.com/vardn.19
              </a>
              <a href="https://github.com/localhost969" className={styles.contactItem}>
                github.com/localhost969
              </a>
            </div>
          </div>
        </div>
      </SidePuller>
    </div>
  );
};
