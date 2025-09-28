'use client';

import { useState, useEffect } from 'react';

// Mobile detection utility
const isMobile = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};
import Link from 'next/link';
import { Edit, Trash2, Plus, Eye, EyeOff, Lock, Settings, Save, X, Share2, BarChart3, Mail, Calendar, HardDrive } from 'lucide-react';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';
import MessagesDashboard from '@/components/MessagesDashboard';
import BackupDashboard from '@/components/BackupDashboard';

export default function SecretAdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [draftPosts, setDraftPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [draftEvents, setDraftEvents] = useState([]);
  const [eventsFilter, setEventsFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  // Helper function to convert 24-hour to 12-hour format for display
  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    try {
      const [hours, minutes] = time24.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return time24;
    }
  };
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [settingsError, setSettingsError] = useState('');
  const [settingsSuccess, setSettingsSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('published');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    // Detect mobile device
    setIsMobileDevice(isMobile());
    
    // Check if already authenticated
    let isAuth = false;
    try {
      // Check if we're in a browser environment and localStorage is available
      if (typeof window !== 'undefined' && window.localStorage) {
        isAuth = localStorage.getItem('admin_auth') === 'true';
      }
    } catch (error) {
      // If localStorage fails, start fresh
      isAuth = false;
    }
    
    setAuthenticated(isAuth);
    
    // Check URL parameters for tab and filter (only in browser)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tab = urlParams.get('tab');
      const filter = urlParams.get('filter');
    
      if (tab === 'events' && filter === 'draft') {
        setActiveTab('draftEvents');
      } else if (tab === 'events') {
        setActiveTab('publishedEvents');
      }
    }
    
    if (isAuth) {
      fetchPosts();
      fetchEvents();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
      
      // Separate published and draft posts
      const published = data.filter(post => post.status !== 'draft');
      const drafts = data.filter(post => post.status === 'draft');
      
      setPublishedPosts(published);
      setDraftPosts(drafts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/admin/events');
      const data = await response.json();
      setEvents(data);
      
      // Separate upcoming, past, and draft events
      const upcoming = data.filter(event => event.status === 'upcoming');
      const past = data.filter(event => event.status === 'past');
      const drafts = data.filter(event => event.status === 'draft' || event.isDraft);
      
      setUpcomingEvents(upcoming);
      setPastEvents(past);
      setDraftEvents(drafts);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Clear any previous errors
    setError('');
    
    // Default credentials that always work
    const defaultEmail = 'admin@techandthecity.com';
    const defaultPassword = 'TechAndTheCity2024!';
    
    // Get custom credentials from localStorage (if they exist)
    let adminEmail, adminPassword;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        adminEmail = localStorage.getItem('admin_email') || defaultEmail;
        adminPassword = localStorage.getItem('admin_password') || defaultPassword;
      } else {
        adminEmail = defaultEmail;
        adminPassword = defaultPassword;
      }
    } catch (error) {
      // If localStorage fails, use defaults
      adminEmail = defaultEmail;
      adminPassword = defaultPassword;
    }
    
    // Debug logging for mobile
    console.log('Login attempt:', { email, hasPassword: !!password });
    console.log('Expected credentials:', { defaultEmail, adminEmail });
    
    // Check against both default and custom credentials
    if ((email === defaultEmail && password === defaultPassword) || 
        (email === adminEmail && password === adminPassword)) {
      console.log('Login successful');
      setAuthenticated(true);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('admin_auth', 'true');
          console.log('Authentication saved to localStorage');
        }
      } catch (error) {
        console.log('localStorage error:', error);
        // If localStorage fails, continue anyway
        // localStorage not available, continuing without persistence
      }
      fetchPosts();
    } else {
      console.log('Login failed - invalid credentials');
      setError('Invalid email or password. Try: admin@techandthecity.com / TechAndTheCity2024!');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('admin_auth');
      }
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
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('admin_email', newEmail);
        localStorage.setItem('admin_password', newPassword);
      } else {
        setSettingsError('Could not save credentials (localStorage not available)');
        return;
      }
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
    let currentEmail = 'admin@techandthecity.com';
    let currentPassword = 'TechAndTheCity2024!';
    
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        currentEmail = localStorage.getItem('admin_email') || currentEmail;
        currentPassword = localStorage.getItem('admin_password') || currentPassword;
      }
    } catch (error) {
      // Use defaults if localStorage fails
    }
    
    setNewEmail(currentEmail);
    setNewPassword(currentPassword);
    setConfirmPassword(currentPassword);
    setShowSettings(true);
    setSettingsError('');
    setSettingsSuccess('');
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLinkedInShare = (post) => {
    if (typeof window === 'undefined') return;
    
    const articleUrl = `${window.location.origin}/articles/${post.slug}`;
    const shareText = `Check out this article from Tech & the City: "${post.title}"`;
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(post.title)}&summary=${encodeURIComponent(post.excerpt)}`;
    
    // Use different window options for mobile vs desktop
    const isMobile = window.innerWidth <= 768;
    const windowOptions = isMobile ? '_blank' : '_blank,width=600,height=400';
    
    window.open(linkedinUrl, windowOptions);
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
          // Refresh posts
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
          setUpcomingEvents(upcomingEvents.filter(event => event.id !== id));
          setPastEvents(pastEvents.filter(event => event.id !== id));
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

  const handleUnpublishEvent = async (id) => {
    if (confirm('Are you sure you want to unpublish this event?')) {
      try {
        const response = await fetch(`/api/admin/events?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isDraft: true
          }),
        });
        
        if (response.ok) {
          // Move event from published to draft locally
          const eventToMove = events.find(event => event.id === id);
          if (eventToMove) {
            // Remove from all current lists
            setEvents(events.filter(event => event.id !== id));
            setUpcomingEvents(upcomingEvents.filter(event => event.id !== id));
            setPastEvents(pastEvents.filter(event => event.id !== id));
            
            // Add to draft events
            const updatedEvent = { ...eventToMove, isDraft: true, status: 'draft' };
            setDraftEvents([...draftEvents, updatedEvent]);
          }
          // Switch to draft events tab
          setActiveTab('draftEvents');
        } else {
          alert('Error unpublishing event');
        }
      } catch (error) {
        console.error('Error unpublishing event:', error);
        alert('Error unpublishing event');
      }
    }
  };

  const handlePublishEvent = async (id) => {
    if (confirm('Are you sure you want to publish this event?')) {
      try {
        const response = await fetch(`/api/admin/events?id=${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            isDraft: false
          }),
        });
        
        if (response.ok) {
          // Move event from draft to published locally
          const eventToMove = draftEvents.find(event => event.id === id);
          if (eventToMove) {
            // Remove from draft events
            setDraftEvents(draftEvents.filter(event => event.id !== id));
            
            // Add to published events
            const updatedEvent = { ...eventToMove, isDraft: false };
            // Determine status based on date
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDate = new Date(eventToMove.date);
            eventDate.setHours(0, 0, 0, 0);
            updatedEvent.status = eventDate < today ? 'past' : 'upcoming';
            
            setEvents([...events, updatedEvent]);
            
            // Add to appropriate published list
            if (updatedEvent.status === 'upcoming') {
              setUpcomingEvents([...upcomingEvents, updatedEvent]);
            } else {
              setPastEvents([...pastEvents, updatedEvent]);
            }
          }
          // Switch to published events tab
          setActiveTab('publishedEvents');
        } else {
          alert('Error publishing event');
        }
      } catch (error) {
        console.error('Error publishing event:', error);
        alert('Error publishing event');
      }
    }
  };

  const handleShareLinkedIn = (event) => {
    if (typeof window === 'undefined') return;
    
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin + '/events')}&title=${encodeURIComponent(event.title)}&summary=${encodeURIComponent(event.description)}`;
    
    // Use different window options for mobile vs desktop
    const isMobile = window.innerWidth <= 768;
    const windowOptions = isMobile ? '_blank' : '_blank,width=600,height=400';
    
    window.open(linkedInUrl, windowOptions);
  };

  const getFilteredEvents = () => {
    switch (eventsFilter) {
      case 'upcoming':
        return upcomingEvents;
      case 'past':
        return pastEvents;
      case 'art':
        return events.filter(event => event.type === 'art');
      case 'tech':
        return events.filter(event => event.type === 'tech');
      case 'science':
        return events.filter(event => event.type === 'science');
      default:
        return events;
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-4 sm:p-6 md:p-8 rounded-lg border border-slate-700 max-w-md w-full mx-2 sm:mx-4">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Admin Access</h1>
            <p className="text-gray-400 text-sm sm:text-base">Enter your credentials to continue</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@techandthecity.com"
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none text-base"
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
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none text-base"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm mb-4 text-center bg-red-900/20 p-3 rounded border border-red-500/30">{error}</div>
            )}
            
            {/* Debug Info for Mobile */}
            <div className="text-xs text-gray-500 mb-4 p-2 bg-gray-900/50 rounded border border-gray-600/30">
              <div><strong>Debug Info:</strong></div>
              <div>Device: {isMobileDevice ? 'Mobile' : 'Desktop'}</div>
              <div>Screen: {typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : 'Unknown'}</div>
              <div>localStorage: {typeof window !== 'undefined' && window.localStorage ? 'Available' : 'Not Available'}</div>
              {isMobileDevice && (
                <div className="text-yellow-400 mt-1">
                  📱 Mobile detected - using mobile-optimized interface
                </div>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg mb-3"
            >
              Access Admin
            </button>
            
            {/* Quick Login Button for Testing */}
            <button
              type="button"
              onClick={() => {
                setEmail('admin@techandthecity.com');
                setPassword('TechAndTheCity2024!');
                setError('');
              }}
              className="w-full bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all duration-300 text-sm"
            >
              Fill Default Credentials
            </button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <div className="text-xs text-gray-500">
              Default: admin@techandthecity.com<br/>
              Password: TechAndTheCity2024!
            </div>
            <Link
              href="/admin-TC25"
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              ← Back to Admin Panel
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="container max-w-6xl mx-auto px-4 pt-8 pb-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Admin Panel</h1>
            <p className="text-gray-400 mt-2">Secret Admin Panel</p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <button
              onClick={handleOpenSettings}
              className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
            {(activeTab === 'published' || activeTab === 'drafts') && (
              <Link
                href="/admin/new"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Article
              </Link>
            )}
            {(activeTab === 'publishedEvents' || activeTab === 'draftEvents') && (
              <Link
                href="/admin/events/new"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                New Event
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
        <div className="flex flex-wrap gap-1 mb-8 bg-slate-800/50 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('published')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'published'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Published Posts</span>
            <span className="sm:hidden">Published</span> ({publishedPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'drafts'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Drafts</span>
            <span className="sm:hidden">Drafts</span> ({draftPosts.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'messages'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
            <span className="sm:hidden">Msg</span>
          </button>
          <button
            onClick={() => setActiveTab('publishedEvents')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'publishedEvents'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Published Events</span>
            <span className="sm:hidden">Events</span> ({events.filter(e => e.status !== 'draft' && !e.isDraft).length})
          </button>
          <button
            onClick={() => setActiveTab('draftEvents')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'draftEvents'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Draft Events</span>
            <span className="sm:hidden">Drafts</span> ({draftEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
            <span className="sm:hidden">Stats</span>
          </button>
          
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === 'backup'
                ? 'bg-slate-700 text-white'
                : 'text-gray-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <HardDrive className="h-4 w-4" />
            <span className="hidden sm:inline">Backup</span>
            <span className="sm:hidden">Backup</span>
          </button>
        </div>


        {/* Tab Content */}
        {activeTab === 'published' && (
          <>
            {/* Published Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {publishedPosts && publishedPosts.length > 0 ? publishedPosts.map((post) => (
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
                  onClick={() => handleToggleStatus(post.slug, post.status)}
                  className="flex-1 bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors inline-flex items-center justify-center gap-1 min-w-0"
                >
                  <Edit className="h-4 w-4" />
                  Unpublish
                </button>
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
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No published articles found</p>
            </div>
          )}
        </div>

            {publishedPosts && publishedPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No published articles found</p>
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

        {activeTab === 'drafts' && (
          <>
            {/* Draft Articles List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {draftPosts && draftPosts.length > 0 ? draftPosts.map((post) => (
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
                  href={`/admin/edit/${post.slug}`}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-1 min-w-0"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleToggleStatus(post.slug, post.status)}
                  className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors inline-flex items-center justify-center gap-1 min-w-0"
                >
                  <Edit className="h-4 w-4" />
                  Publish
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
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">No draft articles found</p>
            </div>
          )}
        </div>

            {draftPosts && draftPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No draft articles found</p>
                <Link
                  href="/admin/new"
                  className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create First Draft
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'messages' && (
          <MessagesDashboard />
        )}

        {activeTab === 'publishedEvents' && (
          <>
            {/* Events Filter Tabs */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setEventsFilter('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      eventsFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    All Events ({events.length})
                  </button>
                  <button
                    onClick={() => setEventsFilter('upcoming')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      eventsFilter === 'upcoming'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    Upcoming Events ({upcomingEvents.length})
                  </button>
                  <button
                    onClick={() => setEventsFilter('past')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      eventsFilter === 'past'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    Past Events ({pastEvents.length})
                  </button>
                  <button
                    onClick={() => setEventsFilter('art')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      eventsFilter === 'art'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    Art ({events.filter(e => e.type === 'art').length})
                  </button>
                  <button
                    onClick={() => setEventsFilter('tech')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      eventsFilter === 'tech'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    Tech ({events.filter(e => e.type === 'tech').length})
                  </button>
                  <button
                    onClick={() => setEventsFilter('science')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      eventsFilter === 'science'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                    }`}
                  >
                    Science ({events.filter(e => e.type === 'science').length})
                  </button>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredEvents() && getFilteredEvents().length > 0 ? getFilteredEvents().map((event) => (
                <div key={event.id} className="bg-slate-800 rounded-lg p-6 border border-slate-700 flex flex-col h-full">
                  {/* Event Visual */}
                  <div className={`aspect-[16/9] bg-gradient-to-br ${event.color} rounded-lg flex items-center justify-center text-white relative overflow-hidden mb-4`}>
                    {/* Media Display */}
                    {event.media && event.media.type !== 'none' && event.media.url ? (
                      <div className="w-full h-full relative">
                        {event.media.type === 'image' ? (
                          <img
                            src={event.media.url}
                            alt={event.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={event.media.url}
                            className="w-full h-full object-cover"
                            poster={event.media.thumbnail || ''}
                            muted
                          />
                        )}
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div className="text-center z-10">
                            <div className="text-5xl mb-2">{event.image}</div>
                            <p className="text-sm font-semibold uppercase tracking-wide">{event.type}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center z-10">
                        <div className="text-5xl mb-2">{event.image}</div>
                        <p className="text-sm font-semibold uppercase tracking-wide">{event.type}</p>
                      </div>
                    )}
                    <div className={`absolute top-2 right-2 backdrop-blur-sm rounded-full px-2 py-1 ${
                      event.status === 'past' 
                        ? 'bg-gray-600/50' 
                        : 'bg-black/20'
                    }`}>
                      <span className="text-xs font-medium">{event.status} (auto)</span>
                    </div>
                  </div>
                  
                  {/* Event Info */}
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-cyan-400 mb-2">{event.title}</h3>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>
                    <div className="text-gray-400 text-xs mb-4">
                      {event.date} • {convertTo12Hour(event.time)} • {event.location}
                    </div>
                    <div className="text-gray-400 text-xs mb-4">
                      {event.attendees} expected attendees
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 flex-wrap mt-auto">
                    <Link
                      href={`/events`}
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => handleUnpublishEvent(event.id)}
                      className="bg-orange-600 text-white px-3 py-2 rounded text-sm hover:bg-orange-700 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <EyeOff className="h-4 w-4" />
                      Unpublish
                    </button>
                    <button
                      onClick={() => handleShareLinkedIn(event)}
                      className="bg-blue-700 text-white px-3 py-2 rounded text-sm hover:bg-blue-800 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <Share2 className="h-4 w-4" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No events found</p>
                </div>
              )}
            </div>

            {getFilteredEvents() && getFilteredEvents().length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">No events found for this filter</p>
                <Link
                  href="/admin/events/new"
                  className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create New Event
                </Link>
              </div>
            )}
          </>
        )}

        {activeTab === 'draftEvents' && (
          <>
            {/* Draft Events List */}
            <div className="space-y-6">
              {draftEvents.length === 0 ? (
                <div className="text-center py-12">
                  <Calendar className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No Draft Events</h3>
                  <p className="text-gray-400 mb-6">Create your first draft event to get started.</p>
                  <Link
                    href="/admin/events/new"
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Create First Draft Event
                  </Link>
                </div>
              ) : (
                draftEvents.map((event) => (
                  <div key={event.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:border-white/30 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Event Image */}
                      <div className="lg:w-1/3">
                        <div className={`aspect-[16/9] bg-gradient-to-br ${event.color} rounded-lg flex items-center justify-center text-white relative overflow-hidden mb-4`}>
                          {/* Media Display */}
                          {event.media && event.media.type !== 'none' && event.media.url ? (
                            <div className="w-full h-full relative">
                              {event.media.type === 'image' ? (
                                <img
                                  src={event.media.url}
                                  alt={event.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <video
                                  src={event.media.url}
                                  className="w-full h-full object-cover"
                                  poster={event.media.thumbnail || ''}
                                  muted
                                />
                              )}
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                <div className="text-center z-10">
                                  <div className="text-5xl mb-2">{event.image}</div>
                                  <p className="text-sm font-semibold uppercase tracking-wide">{event.type}</p>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center z-10">
                              <div className="text-5xl mb-2">{event.image}</div>
                              <p className="text-sm font-semibold uppercase tracking-wide">{event.type}</p>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 backdrop-blur-sm rounded-full px-2 py-1 bg-orange-600/50">
                            <span className="text-xs font-medium">Draft</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Event Info */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-cyan-400 mb-2">{event.title}</h3>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{event.description}</p>
                        <div className="text-gray-400 text-xs mb-4">
                          {event.date} • {convertTo12Hour(event.time)} • {event.location}
                        </div>
                        <div className="text-gray-400 text-xs mb-4">
                          {event.attendees} expected attendees
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex gap-2 flex-wrap mt-auto lg:mt-0">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handlePublishEvent(event.id)}
                          className="bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 transition-colors inline-flex items-center justify-center gap-1"
                        >
                          <Edit className="h-4 w-4" />
                          Publish
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-1"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}

        {activeTab === 'backup' && (
          <BackupDashboard />
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 p-6 sm:p-8 rounded-lg border border-slate-700 max-w-md w-full mx-2 sm:mx-4">
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
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none text-base"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none pr-12"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
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
