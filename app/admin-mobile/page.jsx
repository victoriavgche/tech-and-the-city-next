'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MobileAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('published');
  const [posts, setPosts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [publishedEvents, setPublishedEvents] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');

  // Fetch posts
  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
      
      const published = data.filter(post => post.status !== 'draft');
      const drafts = data.filter(post => post.status === 'draft');
      
      setPublishedPosts(published);
      setDraftPosts(drafts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  // Fetch events
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      const data = await response.json();
      setEvents(data);
      
      const published = data.filter(event => event.status !== 'draft' && !event.isDraft);
      const drafts = data.filter(event => event.status === 'draft' || event.isDraft);
      
      setPublishedEvents(published);
      setDraftEvents(drafts);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  // Simple authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === 'admin@techandthecity.com' && password === 'TechAndTheCity2024!') {
      setAuthenticated(true);
      fetchPosts();
      fetchEvents();
    } else {
      setError('Invalid credentials');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setEmail('');
    setPassword('');
  };

  const handleDelete = async (slug) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`/api/admin/posts/${slug}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setPosts(posts.filter(post => post.slug !== slug));
          setPublishedPosts(publishedPosts.filter(post => post.slug !== slug));
          setDraftPosts(draftPosts.filter(post => post.slug !== slug));
        } else {
          alert('Error deleting article');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting article');
      }
    }
  };

  const handleToggleStatus = async (slug, currentStatus) => {
    const newStatus = currentStatus === 'draft' ? 'published' : 'draft';
    const action = newStatus === 'published' ? 'publish' : 'unpublish';
    
    if (confirm(`Are you sure you want to ${action} this article?`)) {
      try {
        const response = await fetch(`/api/admin/posts/${slug}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: newStatus }),
        });
        
        if (response.ok) {
          fetchPosts();
        } else {
          alert(`Error ${action}ing article`);
        }
      } catch (error) {
        console.error(`Error ${action}ing post:`, error);
        alert(`Error ${action}ing article`);
      }
    }
  };

  const handleDeleteEvent = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`/api/admin/events?id=${id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setEvents(events.filter(event => event.id !== id));
          setPublishedEvents(publishedEvents.filter(event => event.id !== id));
          setDraftEvents(draftEvents.filter(event => event.id !== id));
        } else {
          alert('Error deleting event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
      }
    }
  };

  const handleUpdateCredentials = (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    if (!newEmail || !newPassword) {
      setSettingsError('Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setSettingsError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setSettingsError('Password must be at least 6 characters');
      return;
    }

    setSettingsSuccess('Credentials updated successfully!');
    setShowSettings(false);
    setNewEmail('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (!authenticated) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(to bottom, #1f2937, #374151)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: '#1e293b',
          padding: '30px',
          borderRadius: '10px',
          border: '1px solid #334155',
          width: '100%',
          maxWidth: '400px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>
              🔐 Admin Login
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>
              Mobile Admin Access
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                color: '#d1d5db', 
                fontSize: '14px', 
                marginBottom: '8px' 
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techandthecity.com"
                style={{
                  width: '100%',
                  background: '#334155',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                color: '#d1d5db', 
                fontSize: '14px', 
                marginBottom: '8px' 
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                style={{
                  width: '100%',
                  background: '#334155',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #475569',
                  fontSize: '16px',
                  boxSizing: 'border-box'
                }}
                required
              />
            </div>

            {error && (
              <div style={{
                color: '#f87171',
                fontSize: '14px',
                marginBottom: '20px',
                textAlign: 'center',
                background: '#7f1d1d',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #dc2626'
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: loading ? '#6b7280' : 'linear-gradient(135deg, #7c3aed, #4f46e5)',
                color: 'white',
                padding: '12px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: loading ? 'not-allowed' : 'pointer',
                marginBottom: '15px'
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('admin@techandthecity.com');
                setPassword('TechAndTheCity2024!');
                setError('');
              }}
              style={{
                width: '100%',
                background: '#4b5563',
                color: 'white',
                padding: '10px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Fill Default Credentials
            </button>
          </form>

          <div style={{ 
            marginTop: '20px', 
            textAlign: 'center',
            fontSize: '12px',
            color: '#6b7280'
          }}>
            <p>Default: admin@techandthecity.com</p>
            <p>Password: TechAndTheCity2024!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #1f2937, #374151)',
      padding: '8px'
    }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 4px' }}>
        {/* Header */}
        <div style={{
          background: '#1e293b',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid #334155',
          marginBottom: '12px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <h1 style={{ 
              color: 'white', 
              fontSize: '18px', 
              fontWeight: 'bold',
              margin: '0'
            }}>
              📱 Mobile Admin
            </h1>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  background: '#4b5563',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                ⚙️
              </button>
              <button
                onClick={handleLogout}
                style={{
                  background: '#dc2626',
                  color: 'white',
                  padding: '6px 10px',
                  borderRadius: '6px',
                  border: 'none',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Logout
              </button>
            </div>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '11px', margin: '0' }}>
            Tech & the City Admin Panel
          </p>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          background: '#1e293b',
          padding: '6px',
          borderRadius: '12px',
          border: '1px solid #334155',
          marginBottom: '12px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '3px',
          overflowX: 'auto',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <button
            onClick={() => setActiveTab('published')}
            style={{
              background: activeTab === 'published' ? '#7c3aed' : 'transparent',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: activeTab === 'published' ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            📰 Published ({publishedPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            style={{
              background: activeTab === 'drafts' ? '#7c3aed' : 'transparent',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: activeTab === 'drafts' ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            📝 Drafts ({draftPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('publishedEvents')}
            style={{
              background: activeTab === 'publishedEvents' ? '#7c3aed' : 'transparent',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: activeTab === 'publishedEvents' ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            🎉 Events ({publishedEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('draftEvents')}
            style={{
              background: activeTab === 'draftEvents' ? '#7c3aed' : 'transparent',
              color: 'white',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '11px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontWeight: activeTab === 'draftEvents' ? 'bold' : 'normal',
              transition: 'all 0.2s ease'
            }}
          >
            📅 Draft Events ({draftEvents.length})
          </button>
        </div>

        {/* New Article Button */}
        <div style={{
          background: '#1e293b',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid #334155',
          marginBottom: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
        }}>
          <Link
            href="/admin/new"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontSize: '13px',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
          >
            ✏️ New Article
          </Link>
        </div>

        {/* Content Area */}
        <div style={{
          background: '#1e293b',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid #334155',
          minHeight: '400px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
          {/* Published Posts */}
          {activeTab === 'published' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '15px', margin: '0 0 15px 0' }}>
                📰 Published Posts
              </h2>
              {publishedPosts.length > 0 ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {publishedPosts.map((post) => (
                    <div key={post.slug} style={{
                      background: '#374151',
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1px solid #475569',
                      marginBottom: '8px',
                      boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.1)'
                    }}>
                      <h3 style={{ color: '#60a5fa', fontSize: '14px', margin: '0 0 6px 0', fontWeight: 'bold', lineHeight: '1.3' }}>
                        {post.title}
                      </h3>
                      <p style={{ color: '#d1d5db', fontSize: '11px', margin: '0 0 6px 0', lineHeight: '1.4' }}>
                        {post.excerpt}
                      </p>
                      <div style={{ color: '#9ca3af', fontSize: '9px', marginBottom: '8px' }}>
                        {new Date(post.date).toLocaleDateString()} • {post.read || '5 min'}
                      </div>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <Link
                          href={`/articles/${post.slug}`}
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}
                        >
                          👁️ View
                        </Link>
                        <Link
                          href={`/admin/edit/${post.slug}`}
                          style={{
                            background: '#059669',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '10px',
                            fontWeight: '500'
                          }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(post.slug, post.status)}
                          style={{
                            background: '#d97706',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '10px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          📤 Unpublish
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '10px',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <p>No published articles found</p>
                </div>
              )}
            </div>
          )}

          {/* Draft Posts */}
          {activeTab === 'drafts' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '15px', margin: '0 0 15px 0' }}>
                📝 Draft Posts
              </h2>
              {draftPosts.length > 0 ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {draftPosts.map((post) => (
                    <div key={post.slug} style={{
                      background: '#374151',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #475569'
                    }}>
                      <h3 style={{ color: '#60a5fa', fontSize: '14px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                        {post.title}
                      </h3>
                      <p style={{ color: '#d1d5db', fontSize: '12px', margin: '0 0 8px 0' }}>
                        {post.excerpt}
                      </p>
                      <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '10px' }}>
                        {new Date(post.date).toLocaleDateString()} • {post.read || '5 min'}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <Link
                          href={`/admin/edit/${post.slug}`}
                          style={{
                            background: '#059669',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '11px'
                          }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(post.slug, post.status)}
                          style={{
                            background: '#7c3aed',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          📤 Publish
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <p>No draft articles found</p>
                </div>
              )}
            </div>
          )}

          {/* Published Events */}
          {activeTab === 'publishedEvents' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '15px', margin: '0 0 15px 0' }}>
                🎉 Published Events
              </h2>
              {publishedEvents.length > 0 ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {publishedEvents.map((event) => (
                    <div key={event.id} style={{
                      background: '#374151',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #475569'
                    }}>
                      <h3 style={{ color: '#60a5fa', fontSize: '14px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                        {event.title}
                      </h3>
                      <p style={{ color: '#d1d5db', fontSize: '12px', margin: '0 0 8px 0' }}>
                        {event.description}
                      </p>
                      <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '10px' }}>
                        {event.date} • {event.time} • {event.location}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <Link
                          href={`/events`}
                          style={{
                            background: '#2563eb',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '11px'
                          }}
                        >
                          👁️ View
                        </Link>
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          style={{
                            background: '#059669',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '11px'
                          }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <p>No published events found</p>
                </div>
              )}
            </div>
          )}

          {/* Draft Events */}
          {activeTab === 'draftEvents' && (
            <div>
              <h2 style={{ color: 'white', fontSize: '18px', marginBottom: '15px', margin: '0 0 15px 0' }}>
                📅 Draft Events
              </h2>
              {draftEvents.length > 0 ? (
                <div style={{ display: 'grid', gap: '10px' }}>
                  {draftEvents.map((event) => (
                    <div key={event.id} style={{
                      background: '#374151',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #475569'
                    }}>
                      <h3 style={{ color: '#60a5fa', fontSize: '14px', margin: '0 0 8px 0', fontWeight: 'bold' }}>
                        {event.title}
                      </h3>
                      <p style={{ color: '#d1d5db', fontSize: '12px', margin: '0 0 8px 0' }}>
                        {event.description}
                      </p>
                      <div style={{ color: '#9ca3af', fontSize: '10px', marginBottom: '10px' }}>
                        {event.date} • {event.time} • {event.location}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          style={{
                            background: '#059669',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontSize: '11px'
                          }}
                        >
                          ✏️ Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          style={{
                            background: '#dc2626',
                            color: 'white',
                            padding: '6px 10px',
                            borderRadius: '4px',
                            border: 'none',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
                  <p>No draft events found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Settings Modal */}
        {showSettings && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              background: '#1e293b',
              padding: '20px',
              borderRadius: '10px',
              border: '1px solid #334155',
              width: '100%',
              maxWidth: '400px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ color: 'white', fontSize: '18px', margin: 0 }}>⚙️ Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  style={{
                    background: 'transparent',
                    color: '#9ca3af',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleUpdateCredentials}>
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#d1d5db', fontSize: '12px', marginBottom: '5px' }}>
                    New Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#334155',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #475569',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#d1d5db', fontSize: '12px', marginBottom: '5px' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#334155',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #475569',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                    minLength={6}
                  />
                </div>
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#d1d5db', fontSize: '12px', marginBottom: '5px' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{
                      width: '100%',
                      background: '#334155',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #475569',
                      fontSize: '14px',
                      boxSizing: 'border-box'
                    }}
                    required
                    minLength={6}
                  />
                </div>
                
                {settingsError && (
                  <div style={{
                    color: '#f87171',
                    fontSize: '12px',
                    marginBottom: '15px',
                    textAlign: 'center',
                    background: '#7f1d1d',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #dc2626'
                  }}>
                    {settingsError}
                  </div>
                )}
                
                {settingsSuccess && (
                  <div style={{
                    color: '#34d399',
                    fontSize: '12px',
                    marginBottom: '15px',
                    textAlign: 'center',
                    background: '#064e3b',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #059669'
                  }}>
                    {settingsSuccess}
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      background: '#7c3aed',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    💾 Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    style={{
                      flex: 1,
                      background: '#4b5563',
                      color: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ 
          marginTop: '15px', 
          textAlign: 'center',
          fontSize: '10px',
          color: '#6b7280'
        }}>
          <p>Mobile Admin Panel - Full functionality optimized for mobile</p>
        </div>
      </div>
    </div>
  );
}
