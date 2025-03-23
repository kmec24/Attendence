import React from 'react';
import Image from 'next/image';
import styles from './Header.module.css';

interface HeaderProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  onBack: () => void;
}

export const Header: React.FC<HeaderProps> = ({ darkMode, onToggleTheme, onBack }) => {
  return (
    <header className={styles.header}>
      <button className={styles.backButton} onClick={onBack}>
        ← Back
      </button>
      <div className={styles.themeToggle} onClick={onToggleTheme}>
        {darkMode ? (
          <Image src="/window.svg" alt="Light mode" width={24} height={24} />
        ) : (
          <Image src="/globe.svg" alt="Dark mode" width={24} height={24} />
        )}
      </div>
    </header>
  );
};