import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearMessages } from '../app/services/reduxTollkit/Slices/MessageSlice';
import '../styles/alert.css';

export default function AlertBanner() {
  const dispatch = useDispatch();

  // Grab success and error states from Redux
  const { success, error } = useSelector((state) => state.message);
  //  Automatically clear messages when the user changes routes/pages
  useEffect(() => {
    dispatch(clearMessages());
  }, [dispatch]);
  useEffect(() => {
    // Only start a timer if there is an active message to show
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearMessages());
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [success, error, dispatch]);
  // If there are no messages to show, render nothing
  if (!success && !error) return null;

  const isError = !!error;
  const messageText = error || success;

  return (
    <div
      className={`alert-banner-container ${isError ? 'alert-error' : 'alert-success'}`}
    >
      <div className="alert-content">
        {/* Dynamic Icon based on message type */}
        {isError ? (
          <svg
            className="alert-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        ) : (
          <svg
            className="alert-icon"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        )}

        <span className="alert-text">{messageText}</span>
      </div>

      {/* Manual Close Button */}
      <button
        className="alert-close-btn"
        onClick={() => dispatch(clearMessages())}
        aria-label="Close alert"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
