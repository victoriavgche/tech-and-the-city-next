'use client';

import { useState, useEffect } from 'react';
import { Download, Upload, Trash2, Clock, HardDrive, RotateCcw, Save, Archive } from 'lucide-react';

export default function BackupDashboard() {
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
    }
  };

  useEffect(() => {
    fetchData();
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

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HardDrive className="h-6 w-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Backup System</h2>
        </div>
        
        <button
          onClick={() => createBackup('Manual backup')}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          Create Backup
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.includes('success') ? 'bg-green-600/20 text-green-300' : 'bg-red-600/20 text-red-300'
        }`}>
          {message}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="text-gray-300 text-sm">Total Backups</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalBackups}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="h-4 w-4 text-green-400" />
              <span className="text-gray-300 text-sm">Total Size</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.totalSizeFormatted}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
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
              <div key={backup.id} className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-white font-medium">{backup.description}</span>
                    </div>
                    <div className="text-sm text-gray-400 mb-2">
                      {formatDate(backup.timestamp)} • {backup.fileCount} files • {formatBytes(backup.totalSize)}
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      ID: {backup.id}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => downloadBackup(backup.id)}
                      disabled={loading}
                      className="flex items-center gap-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                      title="Download this backup as JSON"
                    >
                      <Archive className="h-3 w-3" />
                      Download
                    </button>
                    
                    <button
                      onClick={() => restoreBackup(backup.id)}
                      disabled={loading}
                      className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                      title="Restore this backup"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Restore
                    </button>
                    
                    <button
                      onClick={() => deleteBackup(backup.id)}
                      disabled={loading}
                      className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
                      title="Delete this backup"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
