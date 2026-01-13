'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  name: string;
}

const TONES = [
  { id: 'professional', label: 'Professional' },
  { id: 'casual', label: 'Casual' },
  { id: 'witty', label: 'Witty' },
  { id: 'inspiring', label: 'Inspiring' },
  { id: 'controversial', label: 'Hot Take' },
  { id: 'informative', label: 'Informative' },
  { id: 'storytelling', label: 'Story' },
  { id: 'promotional', label: 'Promo' },
];

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generator state
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('casual');
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [posting, setPosting] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  useEffect(() => {
    checkAuth();
    const params = new URLSearchParams(window.location.search);
    const err = params.get('error');
    if (err) {
      setError(`Auth failed: ${err}`);
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) setUser(data.user);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    window.location.href = '/api/auth/login';
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    resetGenerator();
  };

  const resetGenerator = () => {
    setTopic('');
    setResults([]);
    setSelected(null);
    setEditText('');
    setToast(null);
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    setResults([]);
    setSelected(null);
    setEditText('');
    setToast(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone }),
      });
      const data = await res.json();
      if (res.ok && data.tweets) {
        setResults(data.tweets);
      } else {
        setToast({ type: 'error', msg: data.error || 'Generation failed' });
      }
    } catch {
      setToast({ type: 'error', msg: 'Network error' });
    } finally {
      setGenerating(false);
    }
  };

  const selectResult = (i: number) => {
    setSelected(i);
    setEditText(results[i]);
  };

  const charCount = 280 - editText.length;
  const charClass = charCount < 0 ? 'over' : charCount < 20 ? 'warn' : '';
  const canPost = editText.trim().length > 0 && editText.length <= 280;

  const handlePost = async () => {
    if (!canPost) return;
    setPosting(true);
    try {
      const res = await fetch('/api/tweet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: editText }),
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ type: 'success', msg: 'Tweet posted!' });
        setResults([]);
        setSelected(null);
        setEditText('');
        setTopic('');
      } else {
        if (res.status === 401) { setUser(null); return; }
        setToast({ type: 'error', msg: data.error || 'Post failed' });
      }
    } catch {
      setToast({ type: 'error', msg: 'Network error' });
    } finally {
      setPosting(false);
    }
  };

  if (loading) {
    return <div className="loading-screen"><div className="spinner" /></div>;
  }

  // Landing
  if (!user) {
    return (
      <div className="landing">
        {error && <div className="error-banner">{error}</div>}

        <nav className="nav">
          <div className="nav-brand">
            <div className="nav-icon">
              <svg width="16" height="16" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 19h20L12 2zm0 4l7 11H5l7-11z"/></svg>
            </div>
            <span>TweetForge</span>
          </div>
          <div className="nav-links">
            <Link href="/terms" className="nav-link">Terms</Link>
            <Link href="/privacy" className="nav-link">Privacy</Link>
          </div>
        </nav>

        <section className="hero">
          <div className="hero-glow" />
          <div className="hero-content">
            <div className="hero-pill">✨ AI-Powered</div>
            <h1>Generate tweets that <span className="gradient">go viral</span></h1>
            <p className="hero-sub">
              Enter your idea, pick a tone, and let AI craft the perfect tweet. 
              Edit, refine, and post directly to X.
            </p>
            <div className="hero-cta">
              <button className="btn-cta" onClick={handleLogin}>
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                Sign in with X
              </button>
              <p className="hero-note">Free • No API key needed</p>
            </div>
          </div>
        </section>

        <section className="how">
          <div className="how-inner">
            <h2>How it works</h2>
            <div className="how-steps">
              <div className="how-step">
                <div className="how-num">1</div>
                <h3>Enter your idea</h3>
                <p>Describe what you want to tweet about. A topic, a thought, or just a few keywords.</p>
              </div>
              <div className="how-step">
                <div className="how-num">2</div>
                <h3>Pick a tone</h3>
                <p>Choose how you want it to sound — professional, witty, casual, or a hot take.</p>
              </div>
              <div className="how-step">
                <div className="how-num">3</div>
                <h3>Post to X</h3>
                <p>Review the AI suggestions, edit if needed, and post directly to your account.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span className="footer-brand">© 2025 TweetForge</span>
          <div className="footer-links">
            <Link href="/terms" className="footer-link">Terms</Link>
            <Link href="/privacy" className="footer-link">Privacy</Link>
          </div>
        </footer>
      </div>
    );
  }

  // App
  return (
    <div className="app">
      <nav className="app-nav">
        <div className="app-nav-inner">
          <div className="app-brand">
            <div className="app-brand-icon">
              <svg width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M12 2L2 19h20L12 2zm0 4l7 11H5l7-11z"/></svg>
            </div>
            <span>TweetForge</span>
          </div>
          <div className="app-user">
            <span className="app-handle">@{user.username}</span>
            <button className="btn-out" onClick={handleLogout}>Sign out</button>
          </div>
        </div>
      </nav>

      <main className="app-main">
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
          </div>
        )}

        <div className="gen-card">
          <div className="gen-header">
            <h2>Generate a Tweet</h2>
          </div>
          <div className="gen-body">
            <div className="input-group">
              <label className="input-label">What do you want to tweet about?</label>
              <textarea
                className="input-text"
                placeholder="e.g., Launching my new SaaS product next week..."
                value={topic}
                onChange={e => setTopic(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Tone</label>
              <div className="tone-grid">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    className={`tone-btn ${tone === t.id ? 'active' : ''}`}
                    onClick={() => setTone(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="gen-actions">
              <button
                className="btn-gen"
                onClick={handleGenerate}
                disabled={!topic.trim() || generating}
              >
                {generating ? (
                  <>Generating...</>
                ) : (
                  <>✨ Generate Tweets</>
                )}
              </button>
            </div>

            {results.length > 0 && (
              <div className="results">
                <div className="results-title">Pick a tweet to edit & post</div>
                {results.map((text, i) => (
                  <div
                    key={i}
                    className={`result-item ${selected === i ? 'selected' : ''}`}
                    onClick={() => selectResult(i)}
                  >
                    <div className="result-text">{text}</div>
                    <div className="result-meta">
                      <span className="result-chars">{text.length}/280</span>
                      {selected === i && <span className="result-select">Selected</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selected !== null && (
              <div className="edit-section">
                <div className="edit-label">
                  <span>Edit before posting</span>
                  <span className={`edit-chars ${charClass}`}>{charCount}</span>
                </div>
                <textarea
                  className="edit-textarea"
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                />
                <div className="edit-actions">
                  <button className="btn btn-ghost" onClick={() => { setSelected(null); setEditText(''); }}>
                    Cancel
                  </button>
                  <button className="btn btn-post" onClick={handlePost} disabled={!canPost || posting}>
                    {posting ? 'Posting...' : 'Post to X'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <span className="app-footer-brand">TweetForge</span>
          <div className="app-footer-links">
            <Link href="/terms" className="app-footer-link">Terms</Link>
            <Link href="/privacy" className="app-footer-link">Privacy</Link>
          </div>
        </div>
      </footer>

      {posting && (
        <div className="posting-overlay">
          <div className="posting-box">
            <div className="spinner" />
            <p>Posting to X...</p>
          </div>
        </div>
      )}
    </div>
  );
}
