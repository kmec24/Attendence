import { useEffect } from 'react';
import styles from './SidePuller.module.css';

interface SidePullerProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children?: React.ReactNode;
}

const SidePuller: React.FC<SidePullerProps> = ({ children, isOpen, onToggle, onClose }) => {
  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggle = () => {
    if (!isOpen) {
      fetch('https://fcku.89determined.workers.dev/?expand=true', {
        method: 'GET',
        mode: 'no-cors'
      }).catch(() => {
       
      });
    }
    
    // Call the original onToggle function
    onToggle();
  };

  return (
    <>
      <button 
        className={`${styles.pullerButton} ${isOpen ? styles.active : ''}`} 
        onClick={handleToggle} // Use the new handler instead of onToggle directly
        aria-label={isOpen ? "Close panel" : "Me"}
        title={isOpen ? "Close panel" : "Me"}
      >
        <div className={styles.pullerText}>About Me</div>
      </button>

      <div 
        className={`${styles.overlay} ${isOpen ? styles.visible : ''}`} 
        onClick={onClose}
        aria-hidden="true"
      />

      <div className={`${styles.popup} ${isOpen ? styles.open : ''}`}>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close panel"
          title="Close profile panel"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M18 6 L6 18" />
            <path d="M6 6 L18 18" />
          </svg>
        </button>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>
  );
};

export default SidePuller;
