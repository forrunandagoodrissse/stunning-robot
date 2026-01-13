'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already logged in
    checkAuth();
    
    // Check for error in URL
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setError(`Authentication failed: ${errorParam}`);
      window.history.replaceState({}, '', '/verify');
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        router.push('/');
        return;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  if (checking) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <svg className="login-logo" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        
        <h1>X Profile Dashboard</h1>
        <p>Sign in to view your profile analytics and recent activity</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <button className="btn btn-primary login-btn" onClick={handleLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Sign in with X
        </button>
        
        <div className="login-features">
          <div className="login-feature">
            <span className="login-feature-icon">✓</span>
            <span>View your profile information</span>
          </div>
          <div className="login-feature">
            <span className="login-feature-icon">✓</span>
            <span>See your follower analytics</span>
          </div>
          <div className="login-feature">
            <span className="login-feature-icon">✓</span>
            <span>Browse your recent posts</span>
          </div>
          <div className="login-feature">
            <span className="login-feature-icon">✓</span>
            <span>Read-only access (we can't post)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
