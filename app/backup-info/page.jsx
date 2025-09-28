'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, HardDrive, Info, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function BackupInfo() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/backup?action=stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch backup stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container max-w-4xl mx-auto px-4 pt-8 pb-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
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
              <h1 className="text-3xl font-bold text-white">Backup System Info</h1>
              <p className="text-gray-400">How to access your backups when the site is down</p>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold text-white">Current Backup Status</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
              <p className="text-gray-400 mt-2">Loading backup status...</p>
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <span className="text-gray-300 font-medium">Total Backups</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalBackups}</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <HardDrive className="h-5 w-5 text-blue-400" />
                  <span className="text-gray-300 font-medium">Total Size</span>
                </div>
                <div className="text-2xl font-bold text-white">{stats.totalSizeFormatted}</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <span className="text-gray-300 font-medium">Latest Backup</span>
                </div>
                <div className="text-sm text-white">
                  {stats.latestBackup ? new Date(stats.latestBackup).toLocaleString() : 'None'}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                <span className="text-red-300 font-medium">Backup System Offline</span>
              </div>
              <p className="text-red-300 text-sm">Cannot connect to backup system. Server may be down.</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Info className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">How to Access Backups</h2>
          </div>
          
          <div className="space-y-4 text-gray-300">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">🔗 Direct Access URLs</h3>
              <p className="text-sm mb-2">Even if the main site is down, you can access your backups through these direct URLs:</p>
              <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                <div className="text-blue-400">http://your-domain.com/backup-viewer</div>
                <div className="text-gray-500">or</div>
                <div className="text-blue-400">http://localhost:3008/backup-viewer</div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">📁 File System Access</h3>
              <p className="text-sm mb-2">Your backups are stored in the server's file system:</p>
              <div className="bg-gray-900/50 rounded p-3 font-mono text-sm">
                <div className="text-yellow-400">📂 /backups/</div>
                <div className="text-gray-400 ml-4">├── index.json (backup list)</div>
                <div className="text-gray-400 ml-4">├── 2024-01-15_abc123/</div>
                <div className="text-gray-400 ml-8">│   ├── backup.json</div>
                <div className="text-gray-400 ml-8">│   ├── data/</div>
                <div className="text-gray-400 ml-8">│   └── content/</div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">🔄 Auto Backup Features</h3>
              <ul className="text-sm space-y-1">
                <li>✅ Automatic backup when creating posts</li>
                <li>✅ Automatic backup when creating events</li>
                <li>✅ Automatic backup when updating events</li>
                <li>✅ Manual backup from admin panel</li>
                <li>✅ Manual backup from backup viewer</li>
              </ul>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <h3 className="text-white font-semibold mb-2">📊 What Gets Backed Up</h3>
              <ul className="text-sm space-y-1">
                <li>📄 All articles from content/posts/</li>
                <li>📅 All events from data/events.json</li>
                <li>📊 All analytics data</li>
                <li>📧 Contact form messages</li>
                <li>⚙️ Admin settings</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Emergency Access */}
        <div className="bg-gradient-to-br from-red-600/20 to-orange-600/20 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-red-600/30">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <h2 className="text-xl font-bold text-white">Emergency Access</h2>
          </div>
          
          <div className="text-gray-300 space-y-3">
            <p className="text-sm">If the backup viewer is also down, you can still access your data:</p>
            
            <div className="bg-gray-900/50 rounded p-4">
              <h4 className="text-white font-semibold mb-2">Via File Manager:</h4>
              <p className="text-sm mb-2">Access your server's file manager and navigate to:</p>
              <div className="font-mono text-sm text-blue-400">/your-project/backups/</div>
            </div>

            <div className="bg-gray-900/50 rounded p-4">
              <h4 className="text-white font-semibold mb-2">Via FTP/SFTP:</h4>
              <p className="text-sm mb-2">Connect to your server and download the backups folder:</p>
              <div className="font-mono text-sm text-blue-400">backups/ → Download entire folder</div>
            </div>

            <div className="bg-gray-900/50 rounded p-4">
              <h4 className="text-white font-semibold mb-2">Manual Recovery:</h4>
              <p className="text-sm mb-2">Copy files from backup folders back to:</p>
              <div className="font-mono text-sm text-green-400">
                backups/[backup-id]/data/ → data/<br/>
                backups/[backup-id]/content/ → content/
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
