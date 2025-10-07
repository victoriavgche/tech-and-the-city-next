'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Clock, HardDrive, RotateCcw, Save, ArrowLeft, Archive, Lock, Settings, X, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function BackupViewer() {
  const [backups, setBackups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
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
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch backups and stats
  const fetchData = async () => {
    try {
      const [backupsRes, statsRes] = await Promise.all([
        fetch('/api/backup'),
        fetch('/api/backup?action=stats')
      ]);
      
      const backupsData = await backupsRes.json();
      const statsData = await statsRes.json();
      
      setBackups(backupsData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch backup data:', error);
      setMessage('Error loading backups. Make sure the server is running.');
    }
  };

  useEffect(() => {
    // Check if already authenticated
    let isAuth = false;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        isAuth = localStorage.getItem('backup_auth') === 'true';
      }
    } catch (error) {
      isAuth = false;
    }
    
    setAuthenticated(isAuth);
    
    if (isAuth) {
      fetchData();
    }
  }, []);

  // Create new backup
  const createBackup = async (description = '') => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Backup created successfully!');
        await fetchData(); // Refresh data
      } else {
        setMessage('Failed to create backup');
      }
    } catch (error) {
      setMessage('Error creating backup');
      console.error('Backup creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Restore from backup
  const restoreBackup = async (backupId) => {
    if (!confirm('Are you sure you want to restore this backup? This will overwrite current data.')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/backup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Backup restored successfully!');
        await fetchData(); // Refresh data
        // Reload page to reflect changes
        setTimeout(() => window.location.reload(), 1000);
      } else {
        setMessage('Failed to restore backup');
      }
    } catch (error) {
      setMessage('Error restoring backup');
      console.error('Backup restore error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Download backup
  const downloadBackup = async (backupId) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/backup?download=${backupId}`);
      
      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-${backupId}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage('Backup downloaded successfully!');
      } else {
        setMessage('Failed to download backup');
      }
    } catch (error) {
      setMessage('Error downloading backup');
      console.error('Backup download error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete backup
  const deleteBackup = async (backupId) => {
    if (!confirm('Are you sure you want to delete this backup?')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/backup?id=${backupId}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('Backup deleted successfully!');
        await fetchData(); // Refresh data
      } else {
        setMessage('Failed to delete backup');
      }
    } catch (error) {
      setMessage('Error deleting backup');
      console.error('Backup deletion error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Format file size
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Authentication functions
  const handleLogin = (e) => {
    e.preventDefault();
    
    setError('');
    
    // Default credentials that always work
    const defaultEmail = 'admin@techandthecity.com';
    const defaultPassword = 'TechAndTheCity2024!';
    
    // Get custom credentials from localStorage (if they exist)
    let adminEmail, adminPassword;
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        adminEmail = localStorage.getItem('backup_email') || defaultEmail;
        adminPassword = localStorage.getItem('backup_password') || defaultPassword;
      } else {
        adminEmail = defaultEmail;
        adminPassword = defaultPassword;
      }
    } catch (error) {
      adminEmail = defaultEmail;
      adminPassword = defaultPassword;
    }
    
    // Check against both default and custom credentials
    if ((email === defaultEmail && password === defaultPassword) || 
        (email === adminEmail && password === adminPassword)) {
      setAuthenticated(true);
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('backup_auth', 'true');
        }
      } catch (error) {
        // Continue anyway if localStorage fails
      }
      fetchData();
    } else {
      setError('Invalid email or password. Try: admin@techandthecity.com / TechAndTheCity2024!');
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('backup_auth');
      }
    } catch (error) {
      // Continue anyway if localStorage fails
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
        localStorage.setItem('backup_email', newEmail);
        localStorage.setItem('backup_password', newPassword);
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
        currentEmail = localStorage.getItem('backup_email') || currentEmail;
        currentPassword = localStorage.getItem('backup_password') || currentPassword;
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

  // Show login form if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800 p-6 sm:p-8 rounded-lg border border-slate-700 max-w-md w-full mx-2 sm:mx-4">
          <div className="text-center mb-6">
            <Lock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">Backup Viewer Access</h1>
            <p className="text-gray-400 text-sm sm:text-base">Enter your credentials to access backups</p>
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
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg mb-3"
            >
              Access Backup Viewer
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
            <div className="space-y-2">
              <Link
                href="/admin-TC25"
                className="block text-blue-400 hover:text-blue-300 transition-colors text-sm font-bold"
              >
                🔐 Admin Panel
              </Link>
              <Link
                href="/"
                className="block text-gray-400 hover:text-gray-300 transition-colors text-sm"
              >
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container max-w-6xl mx-auto px-4 pt-8 pb-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="flex items-center gap-2 text-white hover:text-blue-400 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Site
            </Link>
            <div className="h-6 w-px bg-gray-600"></div>
            <div className="flex items-center gap-3">
              <HardDrive className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Backup Viewer</h1>
                <p className="text-gray-400">Access your backups even when the site is down</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenSettings}
              className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors inline-flex items-center gap-2"
            >
              <Settings className="h-5 w-5" />
              Settings
            </button>
            <button
              onClick={() => createBackup('Emergency backup')}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              Create Emergency Backup
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            message.includes('success') ? 'bg-green-600/20 text-green-300 border border-green-600/30' : 'bg-red-600/20 text-red-300 border border-red-600/30'
          }`}>
            {message}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 text-blue-400" />
                <span className="text-gray-300 font-medium">Total Backups</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalBackups}</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <HardDrive className="h-6 w-6 text-green-400" />
                <span className="text-gray-300 font-medium">Total Size</span>
              </div>
              <div className="text-3xl font-bold text-white">{stats.totalSizeFormatted}</div>
            </div>
            
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="h-6 w-6 text-purple-400" />
                <span className="text-gray-300 font-medium">Latest Backup</span>
              </div>
              <div className="text-sm text-white">
                {stats.latestBackup ? formatDate(stats.latestBackup) : 'None'}
              </div>
            </div>
          </div>
        )}

        {/* Backups List */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Backup History</h2>
          
          {backups.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <HardDrive className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-2">No backups found</p>
              <p className="text-sm">Create your first backup to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {backups.map((backup) => (
                <div key={backup.id} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <span className="text-white font-semibold text-lg">{backup.description}</span>
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        {formatDate(backup.timestamp)} • {backup.fileCount} files • {formatBytes(backup.totalSize)}
                      </div>
                      <div className="text-xs text-gray-500 font-mono bg-gray-900/50 px-2 py-1 rounded">
                        ID: {backup.id}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => downloadBackup(backup.id)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        title="Download this backup as ZIP"
                      >
                        <Archive className="h-4 w-4" />
                        Download
                      </button>
                      
                      <button
                        onClick={() => restoreBackup(backup.id)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                        title="Restore this backup"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Restore
                      </button>
                      
                      <button
                        onClick={() => deleteBackup(backup.id)}
                        disabled={loading}
                        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                        title="Delete this backup"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

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
    </main>
  );
}
