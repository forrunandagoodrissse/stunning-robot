'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  name: string;
}

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tweetText, setTweetText] = useState('');
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        // Not logged in, redirect to verify
        router.push('/verify');
        return;
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/verify');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/verify');
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
          router.push('/verify');
          return;
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

  if (!user) {
    return null; // Will redirect
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
      </div>
    </>
  );
}
