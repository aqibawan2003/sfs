import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRedo } from 'react-icons/fa';
import styles from './ErrorState.module.css';

// Themed copy per HTTP status code this app actually sends (see backend
// controllers). Falls back to a generic "something wobbled" for anything
// else (500, unexpected errors, or a status we don't recognize).
const STATUS_CONTENT = {
  400: {
    title: "That doesn't look quite right",
    description: 'Something about this request confused us. Please check the details and try again.',
  },
  401: {
    title: 'Your session hopped away!',
    description: "Looks like you've been logged out. Log back in and we'll pick up right where you left off.",
  },
  402: {
    title: 'Payment got cold paws',
    description: "Your payment couldn't go through. Please check your card details and try again.",
  },
  403: {
    title: 'No hopping past this fence',
    description: "You don't have permission to do that.",
  },
  404: {
    title: 'This burrow is empty',
    description: "We couldn't find what you were looking for.",
  },
  409: {
    title: 'Already done, silly!',
    description: 'Looks like this was already done. Refreshing might help.',
  },
  429: {
    title: 'Whoa, slow down!',
    description: "You've made too many requests too quickly. Take a breath and try again in a moment.",
  },
  500: {
    title: 'Oops, something wobbled',
    description: 'Something unexpected happened on our end. Please try again shortly.',
  },
};

const DEFAULT_CONTENT = {
  title: 'Lost in the clouds',
  description: "We couldn't reach the server. Check your connection and try again.",
};

// Axios's own default error message ("Request failed with status code 401")
// isn't useful to show verbatim - prefer the themed description for it.
const isGenericAxiosMessage = (text) => /^request failed with status code \d+$/i.test(text.trim());

/**
 * Friendly replacement for bare "Error: {message}" text. Picks themed
 * copy based on the real HTTP status code (pass it via `status`, or via
 * `message.status` if message is the raw error/rejection object), and
 * falls back to the backend's own message as the description when it's
 * more specific than the generic default.
 */
const ErrorState = ({ message, status, onRetry }) => {
  const navigate = useNavigate();
  const text = typeof message === 'string' ? message : (message?.message || '');
  const resolvedStatus = status || (message && typeof message === 'object' ? message.status : undefined);

  const content = STATUS_CONTENT[resolvedStatus] || DEFAULT_CONTENT;
  const description = (text && !isGenericAxiosMessage(text)) ? text : content.description;
  const isAuthError = resolvedStatus === 401;

  return (
    <div className="flex items-center justify-center py-16 px-6 w-full">
      <div className={styles.card}>
        <div className={styles.scene}>
          <div className={`${styles.cloud} ${styles.cloud1}`} />
          <div className={`${styles.cloud} ${styles.cloud2}`} />
          <div className={styles.bunny} />
        </div>
        <h2 className={styles.title}>{content.title}</h2>
        <p className={styles.description}>{description}</p>
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
