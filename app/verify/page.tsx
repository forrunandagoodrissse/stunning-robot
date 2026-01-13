'use client';

import { useState, useEffect } from 'react';

export default function VerifyPage() {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    // Check for error in URL params
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      setStatus({ type: 'error', message: `Authentication failed: ${error}` });
      // Clean up URL
      window.history.replaceState({}, '', '/verify');
    }
  }, []);

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  return (
    <>
      <div className="gradient-bg" />
      <div className="noise-overlay" />
      <div className="container">
        <div className="logo">
          <div className="logo-icon">✦</div>
          <span className="logo-text">Chirp</span>
        </div>
        <p className="tagline">Post to X with style</p>

        <div className="card login-card">
          <h2>Welcome</h2>
          <p>Connect your X account to start posting</p>
          
          <div className="features">
            <div className="feature">
              <div className="feature-icon">🔐</div>
              <span>Secure OAuth 2.0 authentication</span>
            </div>
            <div className="feature">
              <div className="feature-icon">✍️</div>
              <span>Compose and post tweets instantly</span>
            </div>
            <div className="feature">
              <div className="feature-icon">⚡</div>
              <span>Fast and minimal interface</span>
            </div>
          </div>

          <button className="btn btn-login" onClick={handleLogin}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Continue with X
          </button>

          {status && (
            <div className={`status ${status.type}`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
