import React from 'react';
import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.page}>
      <div className={styles.cloud} style={{ top: '8%', left: '10%', width: '100px', height: '44px', animationDelay: '0s' }} />
      <div className={styles.cloud} style={{ top: '15%', right: '12%', width: '70px', height: '32px', animationDelay: '1.2s' }} />
      <div className={styles.cloud} style={{ bottom: '20%', left: '6%', width: '80px', height: '36px', animationDelay: '2.1s' }} />
      <div className={styles.cloud} style={{ bottom: '10%', right: '8%', width: '110px', height: '48px', animationDelay: '0.8s' }} />

      <div className={styles.card}>
        <div className={styles.scene}>
          <div className={styles.bunny} />
        </div>
        <h1 className={styles.title}>404</h1>
        <h2 className={styles.subtitle}>Oops, Page Hopped Away!</h2>
        <p className={styles.description}>We couldn't find the page you were looking for. Let's hop back home.</p>
        <Link to="/" className={styles.btn}>Take Me Home</Link>
      </div>
    </div>
  );
};

export default NotFound;
