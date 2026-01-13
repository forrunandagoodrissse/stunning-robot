'use client';

import { useState, useEffect, useRef } from 'react';

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
    
    // Check for error in URL
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
      if (data.user) {
        setUser(data.user);
      }
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
    setTimeout(() => {
      textareaRefs.current[newId]?.focus();
    }, 50);
  };

  const removeTweet = (id: string) => {
    if (tweets.length > 1) {
      setTweets(tweets.filter(t => t.id !== id));
    }
  };

  const handleTextareaChange = (id: string, e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    updateTweet(id, textarea.value);
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  };

  const getCharCount = (text: string) => 280 - text.length;
  
  const getCharCountClass = (text: string) => {
    const remaining = getCharCount(text);
    if (remaining < 0) return 'danger';
    if (remaining < 20) return 'warning';
    return '';
  };

  const canPost = () => {
    return tweets.every(t => t.text.trim().length > 0 && t.text.length <= 280);
  };

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
        setStatus({ 
          type: 'success', 
          message: `Thread posted successfully! ${tweets.length} tweet${tweets.length > 1 ? 's' : ''} published.` 
        });
        setTweets([{ id: '1', text: '' }]);
      } else {
        if (res.status === 401) {
          setUser(null);
          return;
        }
        setStatus({ type: 'error', message: data.error || 'Failed to post thread' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error. Please try again.' });
    } finally {
      setPosting(false);
    }
  };

  const clearAll = () => {
    setTweets([{ id: '1', text: '' }]);
    setStatus(null);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  // Not logged in - show login page
  if (!user) {
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

  // Logged in - show composer
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M3 17h18v2H3v-2zm0-7h18v2H3v-2zm0-7h18v2H3V3z"/>
              </svg>
            </div>
            <span className="header-title">Thread Composer</span>
          </div>
          <div className="header-user">
            <span className="header-username">@{user.username}</span>
            <button className="btn btn-secondary btn-small" onClick={handleLogout}>
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="main">
        {status && (
          <div className={`status status-${status.type}`}>
            <span>{status.type === 'success' ? '✓' : '✕'}</span>
            {status.message}
          </div>
        )}

        <div className="composer">
          <div className="composer-header">
            <h2>New Thread</h2>
            <span className="tweet-count">{tweets.length} tweet{tweets.length > 1 ? 's' : ''}</span>
          </div>

          <div className="tweets-list">
            {tweets.map((tweet, index) => (
              <div key={tweet.id} className="tweet-item">
                <div className="tweet-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="tweet-content">
                  <div className="tweet-header">
                    <span className="tweet-name">{user.name}</span>
                    <span className="tweet-username">@{user.username}</span>
                    <span className="tweet-number">#{index + 1}</span>
                  </div>
                  <textarea
                    ref={(el) => { textareaRefs.current[tweet.id] = el; }}
                    className="tweet-textarea"
                    placeholder={index === 0 ? "Start your thread..." : "Continue the thread..."}
                    value={tweet.text}
                    onChange={(e) => handleTextareaChange(tweet.id, e)}
                    rows={1}
                  />
                  <div className="tweet-footer">
                    <span className={`char-count ${getCharCountClass(tweet.text)}`}>
                      {getCharCount(tweet.text)}
                    </span>
                    <div className="tweet-actions">
                      {tweets.length > 1 && (
                        <button 
                          className="btn btn-icon btn-danger"
                          onClick={() => removeTweet(tweet.id)}
                          title="Remove tweet"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="add-tweet-section">
            <button className="add-tweet-btn" onClick={addTweet}>
              <span>+</span> Add another tweet
            </button>
          </div>

          <div className="composer-footer">
            <div className="post-info">
              {canPost() 
                ? `Ready to post ${tweets.length} tweet${tweets.length > 1 ? 's' : ''}`
                : 'Complete all tweets to post'
              }
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={clearAll}
                disabled={posting}
              >
                Clear
              </button>
              <button 
                className="btn btn-primary" 
                onClick={handlePost}
                disabled={!canPost() || posting}
              >
                {posting ? 'Posting...' : 'Post Thread'}
              </button>
            </div>
          </div>
        </div>
      </main>

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
