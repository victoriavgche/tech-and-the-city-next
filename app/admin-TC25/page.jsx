'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Eye, Lock, Settings, Save, X, Share2, BarChart3 } from 'lucide-react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export default function SecretAdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    // Check if already authenticated
    let isAuth = false;
    try {
      isAuth = localStorage.getItem('admin_auth') === 'true';
    } catch (error) {
      // If localStorage fails, start fresh
      isAuth = false;
    }
    
    setAuthenticated(isAuth);
    
    if (isAuth) {
      fetchPosts();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Default credentials that always work
    const defaultEmail = 'admin@techandthecity.com';
    const defaultPassword = 'TechAndTheCity2024!';
    
    // Get custom credentials from localStorage (if they exist)
    let adminEmail, adminPassword;
    try {
      adminEmail = localStorage.getItem('admin_email') || defaultEmail;
      adminPassword = localStorage.getItem('admin_password') || defaultPassword;
    } catch (error) {
      // If localStorage fails, use defaults
      adminEmail = defaultEmail;
      adminPassword = defaultPassword;
    }
    
    // Check against both default and custom credentials
    if ((email === defaultEmail && password === defaultPassword) || 
        (email === adminEmail && password === adminPassword)) {
      setAuthenticated(true);
      try {
        localStorage.setItem('admin_auth', 'true');
      } catch (error) {
        // If localStorage fails, continue anyway
        // localStorage not available, continuing without persistence
      }
      fetchPosts();
    } else {
      setError('Invalid email or password');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    try {
      localStorage.removeItem('admin_auth');
    } catch (error) {
      // If localStorage fails, continue anyway
      // localStorage not available during logout
    }
    setEmail('');
    setPassword('');
  };

  const handleUpdateCredentials = (e) => {
    e.preventDefault();
    setSettingsError('');
    setSettingsSuccess('');

    // Validation
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

    // Save new credentials to localStorage
    try {
      localStorage.setItem('admin_email', newEmail);
      localStorage.setItem('admin_password', newPassword);
    } catch (error) {
      setSettingsError('Could not save credentials (localStorage not available)');
      return;
    }
    
    setSettingsSuccess('Credentials updated successfully!');
    setShowSettings(false);
    setNewEmail('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleOpenSettings = () => {
    // Load current credentials
    const currentEmail = localStorage.getItem('admin_email') || 'admin@techandthecity.com';
    const currentPassword = localStorage.getItem('admin_password') || 'TechAndTheCity2024!';
    
    setNewEmail(currentEmail);
    setNewPassword(currentPassword);
    setConfirmPassword(currentPassword);
    setShowSettings(true);
    setSettingsError('');
    setSettingsSuccess('');
  };

  const handleLinkedInShare = (post) => {
    const articleUrl = `${window.location.origin}/articles/${post.slug}`;
    const shareText = `Check out this article from Tech & the City: "${post.title}"`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt)}`;
    
    window.open(linkedinUrl, '_blank', 'width=600,height=400');
  };

  const handleDelete = async (slug) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`/api/admin/posts/${slug}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setPosts(posts.filter(post => post.slug !== slug));
        } else {
          alert('Error deleting article');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting article');
      }
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400">Enter your credentials to continue</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techandthecity.com"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm mb-4 text-center">{error}</div>
            )}
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
            >
              Access Admin
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 mt-2">Secret Admin Panel</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleOpenSettings}
              className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
            {activeTab === 'posts' && (
              <Link
                href="/admin/new"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Article
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'posts'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Edit className="h-4 w-4" />
            Posts Management
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </button>
        </div>

        {/* Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2"
          >
            ← Back to Homepage
          </Link>
        </div>

        {/* Tab Content */}
        {activeTab === 'posts' && (
          <>
            {/* Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.slug} className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col h-full">
              {/* Article Image */}
              {post.image && (
                <div className="mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Article Info */}
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-cyan-400 mb-2">{post.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="text-gray-400 text-xs mb-4">
                  {new Date(post.date).toLocaleDateString()} • {post.read || '5 min'}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2 flex-wrap mt-auto">
                <Link
                  href={`/articles/${post.slug}`}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1 min-w-0"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
                <Link
                  href={`/admin/edit/${post.slug}`}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-1 min-w-0"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleLinkedInShare(post)}
                  className="flex-1 bg-blue-700 text-white px-3 py-2 rounded text-sm hover:bg-blue-800 transition-colors inline-flex items-center justify-center gap-1 min-w-0"
                >
                  <Share2 className="h-4 w-4" />
                  LinkedIn
                </button>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-1 min-w-0"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

            {posts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No articles found</p>
                <Link
                  href="/admin/new"
                  className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create First Article
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Update Credentials</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={handleUpdateCredentials}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">New Email</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                    required
                    minLength={6}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none"
                    required
                    minLength={6}
                  />
                </div>
                
                {settingsError && (
                  <div className="text-red-400 text-sm mb-4 text-center">{settingsError}</div>
                )}
                
                {settingsSuccess && (
                  <div className="text-green-400 text-sm mb-4 text-center">{settingsSuccess}</div>
                )}
                
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettings(false)}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
