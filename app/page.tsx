'use client';

import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tweetText, setTweetText] = useState('');
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    checkAuth();
    
    // Check for error in URL params
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    if (error) {
      setStatus({ type: 'error', message: `Authentication failed: ${error}` });
      // Clean up URL
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setTweetText('');
      setStatus(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handlePost = async () => {
    if (!tweetText.trim() || tweetText.length > 280) return;
    
    setPosting(true);
    setStatus(null);
    
    try {
      const res = await fetch('/api/tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: tweetText }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus({ type: 'success', message: 'Posted successfully! 🎉' });
        setTweetText('');
      } else {
        if (res.status === 401) {
          setUser(null);
        }
        setStatus({ type: 'error', message: data.error || 'Failed to post' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setPosting(false);
    }
  };

  const getCharCountClass = () => {
    const remaining = 280 - tweetText.length;
    if (remaining < 0) return 'danger';
    if (remaining < 20) return 'warning';
    return '';
  };

  if (loading) {
    return (
      <>
        <div className="gradient-bg" />
        <div className="noise-overlay" />
        <div className="container">
          <div className="spinner" style={{ width: 40, height: 40 }} />
        </div>
      </>
    );
  }

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

        {user ? (
          <div className="card">
            <div className="user-header">
              <div className="user-info">
                <div className="avatar">{user.name.charAt(0)}</div>
                <div className="user-details">
                  <h3>{user.name}</h3>
                  <span>@{user.username}</span>
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Sign out
              </button>
            </div>

            <div className="compose-area">
              <textarea
                className="tweet-input"
                placeholder="What's happening?"
                value={tweetText}
                onChange={(e) => setTweetText(e.target.value)}
                maxLength={300}
              />
            </div>

            <div className="compose-footer">
              <span className={`char-counter ${getCharCountClass()}`}>
                {280 - tweetText.length}
              </span>
              <button
                className="btn btn-primary"
                onClick={handlePost}
                disabled={posting || !tweetText.trim() || tweetText.length > 280}
              >
                {posting ? (
                  <>
                    <span className="spinner" />
                    Posting...
                  </>
                ) : (
                  'Post'
                )}
              </button>
            </div>

            {status && (
              <div className={`status ${status.type}`}>
                {status.message}
              </div>
            )}
          </div>
        ) : (
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
        )}
      </div>
    </>
  );
}
