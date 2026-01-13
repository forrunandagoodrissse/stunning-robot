'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  name: string;
}

interface TweetDraft {
  id: string;
  text: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tweets, setTweets] = useState<TweetDraft[]>([{ id: '1', text: '' }]);
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

  useEffect(() => {
    checkAuth();
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    if (errorParam) {
      setError(`Authentication failed: ${errorParam}`);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    setTweets([{ id: '1', text: '' }]);
    setStatus(null);
  };

  const updateTweet = (id: string, text: string) => {
    setTweets(tweets.map(t => t.id === id ? { ...t, text } : t));
  };

  const addTweet = () => {
    const newId = Date.now().toString();
    setTweets([...tweets, { id: newId, text: '' }]);
    setTimeout(() => textareaRefs.current[newId]?.focus(), 50);
  };

  const removeTweet = (id: string) => {
    if (tweets.length > 1) setTweets(tweets.filter(t => t.id !== id));
  };

  const handleTextareaChange = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    updateTweet(id, textarea.value);
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const getCharCount = (text: string) => 280 - text.length;
  const getCharClass = (text: string) => {
    const r = getCharCount(text);
    if (r < 0) return 'over';
    if (r < 20) return 'warn';
    return '';
  };

  const canPost = () => tweets.every(t => t.text.trim().length > 0 && t.text.length <= 280);

  const handlePost = async () => {
    if (!canPost()) return;
    setPosting(true);
    setStatus(null);
    try {
      const res = await fetch('/api/thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tweets: tweets.map(t => t.text) }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus({ type: 'success', message: `Thread posted! ${tweets.length} tweet${tweets.length > 1 ? 's' : ''} published.` });
        setTweets([{ id: '1', text: '' }]);
      } else {
        if (res.status === 401) { setUser(null); return; }
        setStatus({ type: 'error', message: data.error || 'Failed to post thread' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  // Landing page (not logged in)
  if (!user) {
    return (
      <div className="landing">
        {error && <div className="landing-error">{error}</div>}
        
        <nav className="landing-nav">
          <div className="nav-logo">
            <div className="nav-logo-icon">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
            </div>
            <span>Thread Composer</span>
          </div>
          <div className="nav-links">
            <Link href="/terms" className="nav-link">Terms</Link>
            <Link href="/privacy" className="nav-link">Privacy</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-grid" />
          <div className="hero-content">
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              Now with thread scheduling
            </div>
            <h1>Write threads that <em>resonate</em></h1>
            <p className="hero-subtitle">
              The simplest way to compose, preview, and publish multi-tweet threads to X. 
              No distractions, just your words.
            </p>
            <div className="hero-cta">
              <button className="btn-hero" onClick={handleLogin}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Sign in with X
              </button>
              <p className="hero-note">Free to use · No credit card required</p>
            </div>
          </div>
        </section>

        <section className="features">
          <div className="feature">
            <div className="feature-icon">✍️</div>
            <h3>Compose Freely</h3>
            <p>Write your thoughts naturally. Add as many tweets as you need to tell your story.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">👁️</div>
            <h3>Preview First</h3>
            <p>See exactly how your thread will look before publishing. No surprises.</p>
          </div>
          <div className="feature">
            <div className="feature-icon">🚀</div>
            <h3>One-Click Post</h3>
            <p>Publish your entire thread instantly. Each tweet connects automatically.</p>
          </div>
        </section>

        <footer className="landing-footer">
          <div className="footer-left">
            <span className="footer-logo">Thread Composer</span>
            <div className="footer-links">
              <Link href="/terms" className="footer-link">Terms of Service</Link>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            </div>
          </div>
          <div className="footer-right">© 2025 Thread Composer</div>
        </footer>
      </div>
    );
  }

  // App (logged in)
  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header-inner">
          <div className="app-logo">
            <div className="app-logo-icon">
              <svg width="14" height="14" fill="white" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
            </div>
            <span>Thread Composer</span>
          </div>
          <div className="app-user">
            <span className="app-username">@{user.username}</span>
            <button className="btn-logout" onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {status && (
          <div className={`toast toast-${status.type}`}>
            {status.type === 'success' ? '✓' : '✕'} {status.message}
          </div>
        )}

        <div className="composer">
          <div className="composer-top">
            <span className="composer-title">New Thread</span>
            <span className="composer-count">{tweets.length} tweet{tweets.length > 1 ? 's' : ''}</span>
          </div>

          <div className="tweets">
            {tweets.map((tweet, i) => (
              <div key={tweet.id} className="tweet">
                <div className="tweet-avatar">{user.name.charAt(0)}</div>
                <div className="tweet-body">
                  <div className="tweet-meta">
                    <span className="tweet-name">{user.name}</span>
                    <span className="tweet-handle">@{user.username}</span>
                    <span className="tweet-num">{i + 1}/{tweets.length}</span>
                  </div>
                  <textarea
                    ref={el => { textareaRefs.current[tweet.id] = el; }}
                    className="tweet-input"
                    placeholder={i === 0 ? "Start your thread..." : "Continue..."}
                    value={tweet.text}
                    onChange={e => handleTextareaChange(tweet.id, e)}
                    rows={1}
                  />
                  <div className="tweet-bottom">
                    <span className={`tweet-chars ${getCharClass(tweet.text)}`}>
                      {getCharCount(tweet.text)}
                    </span>
                    {tweets.length > 1 && (
                      <button className="tweet-remove" onClick={() => removeTweet(tweet.id)}>×</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="composer-add">
            <button className="btn-add" onClick={addTweet}>+ Add tweet</button>
          </div>

          <div className="composer-bottom">
            <span className="composer-status">
              {canPost() ? `Ready to post ${tweets.length} tweet${tweets.length > 1 ? 's' : ''}` : 'Complete all tweets to post'}
            </span>
            <div className="composer-actions">
              <button className="btn btn-secondary" onClick={() => { setTweets([{ id: '1', text: '' }]); setStatus(null); }} disabled={posting}>
                Clear
              </button>
              <button className="btn btn-primary" onClick={handlePost} disabled={!canPost() || posting}>
                {posting ? 'Posting...' : 'Post Thread'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <span className="app-footer-brand">Thread Composer</span>
          <div className="app-footer-links">
            <Link href="/terms" className="app-footer-link">Terms</Link>
            <Link href="/privacy" className="app-footer-link">Privacy</Link>
          </div>
        </div>
      </footer>

      {posting && (
        <div className="posting-overlay">
          <div className="posting-modal">
            <div className="spinner" />
            <p>Posting your thread...</p>
          </div>
        </div>
      )}
    </div>
  );
}
