import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRedo } from 'react-icons/fa';
import styles from './ErrorState.module.css';

/**
 * Friendly replacement for bare "Error: {message}" text. Detects auth
 * (401) errors specifically, since those mean the session expired rather
 * than something actually breaking, and offers the right fix for each.
 */
const ErrorState = ({ message, onRetry }) => {
  const navigate = useNavigate();
  const text = typeof message === 'string' ? message : (message?.message || '');
  const isAuthError = /401|unauthorized|token/i.test(text);

  return (
    <div className="flex items-center justify-center py-16 px-6 w-full">
      <div className={styles.card}>
        <div className={styles.scene}>
          <div className={`${styles.cloud} ${styles.cloud1}`} />
          <div className={`${styles.cloud} ${styles.cloud2}`} />
          <div className={styles.bunny} />
        </div>
        <h2 className={styles.title}>
          {isAuthError ? 'Your session hopped away!' : 'Oops, something wobbled'}
        </h2>
        <p className={styles.description}>
          {isAuthError
            ? "Looks like you've been logged out. Log back in and we'll pick up right where you left off."
            : (text || 'Something unexpected happened while loading this page.')}
        </p>
        {isAuthError ? (
          <button onClick={() => navigate('/loginform')} className={styles.btn}>
            Log In Again
          </button>
        ) : onRetry ? (
          <button onClick={onRetry} className={styles.btn}>
            <FaRedo /> Try Again
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default ErrorState;
