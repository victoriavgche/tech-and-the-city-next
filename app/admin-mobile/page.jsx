'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MobileAdmin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Simple authentication
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple delay to simulate processing
    await new Promise(resolve => setTimeout(resolve, 500));

    if (email === 'admin@techandthecity.com' && password === 'TechAndTheCity2024!') {
      setAuthenticated(true);
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
      padding: '20px'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #334155',
          marginBottom: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            <h1 style={{ 
              color: 'white', 
              fontSize: '24px', 
              fontWeight: 'bold',
              margin: '0'
            }}>
              📱 Mobile Admin
            </h1>
            <p style={{ color: '#9ca3af', fontSize: '14px', margin: '5px 0 0 0' }}>
              Tech & the City Admin Panel
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc2626',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #334155',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            color: 'white', 
            fontSize: '18px', 
            marginBottom: '15px',
            margin: '0 0 15px 0'
          }}>
            🚀 Quick Actions
          </h2>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            <Link
              href="/admin/new"
              style={{
                display: 'block',
                background: '#7c3aed',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ✏️ New Article
            </Link>
            
            <Link
              href="/admin/events/new"
              style={{
                display: 'block',
                background: '#059669',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              📅 New Event
            </Link>
            
            <Link
              href="/admin-TC25"
              style={{
                display: 'block',
                background: '#dc2626',
                color: 'white',
                padding: '15px',
                borderRadius: '8px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🖥️ Full Admin Panel
            </Link>
          </div>
        </div>

        {/* Site Links */}
        <div style={{
          background: '#1e293b',
          padding: '20px',
          borderRadius: '10px',
          border: '1px solid #334155'
        }}>
          <h2 style={{ 
            color: 'white', 
            fontSize: '18px', 
            marginBottom: '15px',
            margin: '0 0 15px 0'
          }}>
            🔗 Site Navigation
          </h2>
          
          <div style={{ display: 'grid', gap: '10px' }}>
            <Link
              href="/"
              style={{
                display: 'block',
                background: '#374151',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '14px'
              }}
            >
              🏠 Home
            </Link>
            
            <Link
              href="/articles"
              style={{
                display: 'block',
                background: '#374151',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '14px'
              }}
            >
              📰 Articles
            </Link>
            
            <Link
              href="/events"
              style={{
                display: 'block',
                background: '#374151',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '14px'
              }}
            >
              🎉 Events
            </Link>
            
            <Link
              href="/about"
              style={{
                display: 'block',
                background: '#374151',
                color: 'white',
                padding: '12px',
                borderRadius: '6px',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '14px'
              }}
            >
              ℹ️ About
            </Link>
          </div>
        </div>

        <div style={{ 
          marginTop: '20px', 
          textAlign: 'center',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          <p>Mobile Admin Panel - Optimized for mobile devices</p>
        </div>
      </div>
    </div>
  );
}
