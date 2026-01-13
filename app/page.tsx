'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  name: string;
}

interface TweetDraft {
  id: string;
  text: string;
}

export default function Composer() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tweets, setTweets] = useState<TweetDraft[]>([
    { id: '1', text: '' }
  ]);
  const [posting, setPosting] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const textareaRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

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
        router.push('/verify');
        return;
      }
    } catch (error) {
      router.push('/verify');
      return;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/verify');
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
    
    // Auto-resize
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
          router.push('/verify');
          return;
        }
        setStatus({ type: 'error', message: data.error || 'Failed to post thread' });
      }
    } catch (error) {
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

  if (!user) return null;

  return (
    <div className="app">
      {/* Header */}
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

      {/* Main Content */}
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

      {/* Posting Overlay */}
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
