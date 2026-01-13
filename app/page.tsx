'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  name: string;
  description?: string;
  profile_image_url?: string;
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
  };
  created_at?: string;
  location?: string;
  url?: string;
  verified?: boolean;
}

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics?: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
    impression_count: number;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Check auth and get user data
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      
      if (!data.user) {
        router.push('/verify');
        return;
      }
      
      setUser(data.user);
      
      // Load tweets
      const tweetsRes = await fetch('/api/tweets');
      const tweetsData = await tweetsRes.json();
      if (tweetsData.tweets) {
        setTweets(tweetsData.tweets);
      }
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/verify');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="app-container">
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1>{user.name}</h1>
            <div className="header-actions">
              <button className="btn btn-danger" onClick={handleLogout}>
                Sign out
              </button>
            </div>
          </div>
        </header>

        {error && <div className="error-message">{error}</div>}

        {/* Profile Section */}
        <section className="profile-section">
          <div className="profile-banner" />
          <div className="profile-info">
            <div className="profile-avatar">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="profile-names">
              <div className="profile-name">
                {user.name}
                {user.verified && ' ✓'}
              </div>
              <div className="profile-username">@{user.username}</div>
            </div>
            
            {user.description && (
              <p className="profile-bio">{user.description}</p>
            )}
            
            <div className="profile-meta">
              {user.location && (
                <span className="profile-meta-item">
                  📍 {user.location}
                </span>
              )}
              {user.created_at && (
                <span className="profile-meta-item">
                  📅 Joined {formatDate(user.created_at)}
                </span>
              )}
            </div>
            
            {user.public_metrics && (
              <div className="profile-stats">
                <span className="profile-stat">
                  <strong>{formatNumber(user.public_metrics.following_count)}</strong>
                  <span> Following</span>
                </span>
                <span className="profile-stat">
                  <strong>{formatNumber(user.public_metrics.followers_count)}</strong>
                  <span> Followers</span>
                </span>
              </div>
            )}
          </div>
        </section>

        {/* Stats Grid */}
        {user.public_metrics && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-card-value">
                {formatNumber(user.public_metrics.tweet_count)}
              </div>
              <div className="stat-card-label">Posts</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">
                {formatNumber(user.public_metrics.followers_count)}
              </div>
              <div className="stat-card-label">Followers</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">
                {formatNumber(user.public_metrics.following_count)}
              </div>
              <div className="stat-card-label">Following</div>
            </div>
            <div className="stat-card">
              <div className="stat-card-value">
                {formatNumber(user.public_metrics.listed_count)}
              </div>
              <div className="stat-card-label">Listed</div>
            </div>
          </div>
        )}

        {/* Recent Tweets */}
        <section>
          <div className="section-header">
            <h2>Recent Posts</h2>
          </div>
          
          {tweets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <p>No recent posts to display</p>
            </div>
          ) : (
            tweets.map((tweet) => (
              <article key={tweet.id} className="tweet">
                <p className="tweet-content">{tweet.text}</p>
                {tweet.public_metrics && (
                  <div className="tweet-meta">
                    <span className="tweet-stat">
                      ❤️ {formatNumber(tweet.public_metrics.like_count)}
                    </span>
                    <span className="tweet-stat">
                      🔁 {formatNumber(tweet.public_metrics.retweet_count)}
                    </span>
                    <span className="tweet-stat">
                      💬 {formatNumber(tweet.public_metrics.reply_count)}
                    </span>
                  </div>
                )}
                <div className="tweet-date">{formatDate(tweet.created_at)}</div>
              </article>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
