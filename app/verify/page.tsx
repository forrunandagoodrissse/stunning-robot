'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    checkAuth();
    
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
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M3 17h18v2H3v-2zm0-7h18v2H3v-2zm0-7h18v2H3V3z"/>
          </svg>
        </div>
        
        <h1>Thread Composer</h1>
        <p className="subtitle">Create and post X threads with ease</p>
        
        {error && <div className="login-error">{error}</div>}
        
        <button className="btn btn-primary login-btn" onClick={handleLogin}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
          Sign in with X
        </button>
        
        <div className="login-features">
          <div className="login-feature">
            <span className="feature-icon">✓</span>
            <span>Compose multi-tweet threads</span>
          </div>
          <div className="login-feature">
            <span className="feature-icon">✓</span>
            <span>Preview before posting</span>
          </div>
          <div className="login-feature">
            <span className="feature-icon">✓</span>
            <span>Post entire threads at once</span>
          </div>
          <div className="login-feature">
            <span className="feature-icon">✓</span>
            <span>Character count for each tweet</span>
          </div>
        </div>
      </div>
    </div>
  );
}
