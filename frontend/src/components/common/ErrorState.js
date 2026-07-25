import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRedo } from 'react-icons/fa';

/**
 * Friendly replacement for bare "Error: {message}" text. Detects auth
 * (401) errors specifically, since those mean the session expired rather
 * than something actually breaking, and offers the right fix for each.
 */
const ErrorState = ({ message, onRetry }) => {
  const navigate = useNavigate();
  const [imageFailed, setImageFailed] = useState(false);
  const text = typeof message === 'string' ? message : (message?.message || '');
  const isAuthError = /401|unauthorized|token/i.test(text);

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 text-white w-full">
      {!imageFailed && (
        <img
          src={isAuthError ? '/images/tom-and-jerry-1.png' : '/images/tom-and-jerry-2.png'}
          alt=""
          className="w-40 h-auto mb-4 select-none"
          onError={() => setImageFailed(true)}
        />
      )}
      <h2 className="text-2xl font-bold mb-2">
        {isAuthError ? "Tom chased your session away!" : 'Uh-oh, Jerry knocked something over'}
      </h2>
      <p className="text-gray-400 max-w-md mb-6">
        {isAuthError
          ? "Looks like you've been logged out. Log back in and we'll pick up right where you left off."
          : (text || 'Something unexpected happened while loading this page.')}
      </p>
      {isAuthError ? (
        <button
          onClick={() => navigate('/loginform')}
          className="bg-[#697565] hover:bg-[#3C3D37] text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Log In Again
        </button>
      ) : onRetry ? (
        <button
          onClick={onRetry}
          className="bg-[#697565] hover:bg-[#3C3D37] text-white px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
        >
          <FaRedo /> Try Again
        </button>
      ) : null}
    </div>
  );
};

export default ErrorState;
