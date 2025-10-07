'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Clock, HardDrive, RotateCcw, Save } from 'lucide-react';

export default function SimpleBackup() {
  const [backups, setBackups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      setMessage('Failed to fetch backup data');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create new backup
  const createBackup = async () => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/backup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Backup created successfully!');
        await fetchData(); // Refresh data
      } else {
        setMessage('❌ Failed to create backup');
      }
    } catch (error) {
      setMessage('❌ Error creating backup');
      console.error('Backup creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Restore from backup
  const restoreBackup = async (filename) => {
    if (!confirm('⚠️ Are you sure you want to restore this backup?\n\nThis will overwrite ALL current data (articles, events, analytics, contact messages).')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/backup', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename })
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Backup restored successfully! Refreshing page...');
        // Reload page to reflect changes
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setMessage('❌ Failed to restore backup');
      }
    } catch (error) {
      setMessage('❌ Error restoring backup');
      console.error('Backup restore error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Download backup
  const downloadBackup = async (filename) => {
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/backup?download=${filename}`);
      
      if (response.ok) {
        // Create download link
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setMessage('✅ Backup downloaded successfully!');
      } else {
        setMessage('❌ Failed to download backup');
      }
    } catch (error) {
      setMessage('❌ Error downloading backup');
      console.error('Backup download error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete backup
  const deleteBackup = async (filename) => {
    if (!confirm('Are you sure you want to delete this backup?')) {
      return;
    }
    
    setLoading(true);
    setMessage('');
    
    try {
      const response = await fetch(`/api/backup?filename=${filename}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        setMessage('✅ Backup deleted successfully!');
        await fetchData(); // Refresh data
      } else {
        setMessage('❌ Failed to delete backup');
      }
    } catch (error) {
      setMessage('❌ Error deleting backup');
      console.error('Backup deletion error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <HardDrive className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Simple Backup System</h2>
        </div>
        
        <button
          onClick={createBackup}
          disabled={loading}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <Save className="h-4 w-4" />
          )}
          Create Backup
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('✅') ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-sm">Total Backups</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalBackups}</div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-4 w-4 text-green-400" />
              <span className="text-gray-300 text-sm">Total Size</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalSizeFormatted}</div>
          </div>
          
          <div className="bg-gray-700/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-purple-400" />
              <span className="text-gray-300 text-sm">Latest Backup</span>
            </div>
            <div className="text-sm text-white">
              {stats.latestBackup ? formatDate(stats.latestBackup) : 'None'}
            </div>
          </div>
        </div>
      )}

      {/* Backups List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white mb-4">Backup History</h3>
        
        {backups.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No backups found</p>
            <p className="text-sm">Create your first backup to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {backups.map((backup) => (
              <div key={backup.filename} className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="text-white font-medium mb-1 break-all">
                      {backup.filename}
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      Created: {formatDate(backup.created)} • Size: {backup.sizeFormatted}
                    </div>
                    {backup.timestamp && (
                      <div className="text-xs text-gray-500">
                        Data from: {formatDate(backup.timestamp)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => downloadBackup(backup.filename)}
                      disabled={loading}
                      className="flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                      title="Download this backup"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </button>
                    
                    <button
                      onClick={() => restoreBackup(backup.filename)}
                      disabled={loading}
                      className="flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                      title="Restore this backup (will overwrite current data)"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </button>
                    
                    <button
                      onClick={() => deleteBackup(backup.filename)}
                      disabled={loading}
                      className="flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
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

      {/* Info */}
      <div className="mt-6 p-4 bg-blue-600/10 rounded-lg border border-blue-500/20">
        <h4 className="text-blue-400 font-semibold mb-2">ℹ️ What gets backed up:</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• All articles and posts (content/)</li>
          <li>• All events (data/events.json)</li>
          <li>• Analytics data (data/analytics.json)</li>
          <li>• Contact form messages (contact-submissions.json)</li>
          <li>• All other data files</li>
        </ul>
      </div>
    </div>
  );
}
