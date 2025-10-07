'use client';

import { useState } from 'react';

export default function SmartAdmin() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const showMessage = (msg, type = 'info') => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 5000);
  };

  const handleAdminAction = async (action, endpoint, data = {}) => {
    setIsLoading(true);
    
    try {
      // First try the production endpoint (with GitHub integration)
      let response = await fetch(`/api/admin/production/${endpoint}`, {
        method: action,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      // If production endpoint fails, try regular endpoint
      if (!response.ok) {
        response = await fetch(`/api/admin/${endpoint}`, {
          method: action,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      }

      const result = await response.json();

      if (response.ok) {
        showMessage(`✅ ${result.message || 'Action completed successfully'}`, 'success');
        return true;
      } else {
        showMessage(`❌ ${result.error || 'Action failed'}`, 'error');
        if (result.details) {
          console.log('Details:', result.details);
        }
        return false;
      }
    } catch (error) {
      showMessage(`❌ Network error: ${error.message}`, 'error');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const testGitHubIntegration = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/test-github', {
        method: 'GET'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showMessage('✅ GitHub integration is working! Admin features are available.', 'success');
      } else {
        showMessage(`❌ GitHub integration not available: ${result.error}`, 'error');
        if (result.details) {
          showMessage(`ℹ️ ${result.details}`, 'info');
        }
      }
    } catch (error) {
      showMessage(`❌ Test failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 mb-6">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        🚀 Smart Admin Panel
      </h2>
      
      <div className="space-y-4">
        <div className="flex gap-3">
          <button
            onClick={testGitHubIntegration}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors"
          >
            {isLoading ? 'Testing...' : 'Test GitHub Integration'}
          </button>
        </div>

        <div className="text-sm text-gray-300 space-y-2">
          <p><strong>How it works:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>First tries GitHub API integration (production-ready)</li>
            <li>Falls back to local filesystem (development only)</li>
            <li>Shows clear error messages if neither works</li>
          </ul>
        </div>

        {message && (
          <div className={`p-3 rounded-lg ${
            message.includes('✅') ? 'bg-green-900/20 border border-green-500/30 text-green-400' :
            message.includes('❌') ? 'bg-red-900/20 border border-red-500/30 text-red-400' :
            'bg-blue-900/20 border border-blue-500/30 text-blue-400'
          }`}>
            <p className="font-medium">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
