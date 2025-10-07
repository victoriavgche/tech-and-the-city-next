'use client';

import { useState } from 'react';
import { Download, FileText, Calendar, Database, FileImage } from 'lucide-react';

export default function AnalyticsExtract() {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [extracting, setExtracting] = useState(false);

  const handleExtract = async (format) => {
    try {
      setExtracting(true);
      
      let response;
      let filename;
      let blob;
      
      if (format === 'json') {
        response = await fetch(`/api/analytics/extract?format=json&period=${selectedPeriod}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        filename = `analytics-data-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
        blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      } else if (format === 'csv') {
        response = await fetch(`/api/analytics/extract?format=csv&period=${selectedPeriod}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        filename = `analytics-data-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
        blob = await response.blob();
      } else if (format === 'pdf') {
        response = await fetch(`/api/analytics/extract?format=pdf&period=${selectedPeriod}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        filename = `analytics-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`;
        blob = await response.blob();
      }
      
      if (!blob || blob.size === 0) {
        throw new Error('Empty file generated');
      }
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      alert(`${format.toUpperCase()} extraction completed successfully!`);
      
    } catch (error) {
      console.error('Extract error:', error);
      alert(`Error extracting ${format.toUpperCase()} data: ${error.message}`);
    } finally {
      setExtracting(false);
    }
  };

  const formatPeriod = (period) => {
    switch (period) {
      case 'all': return 'All Time';
      case '30d': return 'Last 30 Days';
      case '60d': return 'Last 60 Days';
      case '90d': return 'Last 90 Days';
      default: return period;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-bold text-white mb-2 flex items-center">
          <Database className="h-5 w-5 mr-2 text-blue-400" />
          Analytics Data Extraction
        </h2>
        <p className="text-gray-300">Extract your analytics data in simple formats</p>
      </div>

      {/* Extract Controls */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Extract Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Period Selector */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="60d">Last 60 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
          </div>

          {/* Extract Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleExtract('json')}
                disabled={extracting}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {extracting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>JSON</span>
              </button>
              
              <button
                onClick={() => handleExtract('csv')}
                disabled={extracting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {extracting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Download className="h-4 w-4" />
                )}
                <span>CSV</span>
              </button>
              
              <button
                onClick={() => handleExtract('pdf')}
                disabled={extracting}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                {extracting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FileImage className="h-4 w-4" />
                )}
                <span>PDF</span>
              </button>
            </div>
            
            {extracting && (
              <p className="text-center text-gray-400 text-sm">Extracting data...</p>
            )}
          </div>
        </div>
      </div>

      {/* Data Information */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Extracted Data Includes:</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h4 className="text-green-400 font-semibold flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              JSON Format
            </h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>• Raw analytics data</p>
              <p>• All metrics and statistics</p>
              <p>• Structured format for analysis</p>
              <p>• Developer-friendly</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-blue-400 font-semibold flex items-center">
              <Download className="h-4 w-4 mr-2" />
              CSV Format
            </h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>• Spreadsheet-compatible</p>
              <p>• Easy to import into Excel</p>
              <p>• Human-readable format</p>
              <p>• Business reporting ready</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-red-400 font-semibold flex items-center">
              <FileImage className="h-4 w-4 mr-2" />
              PDF Format
            </h4>
            <div className="space-y-2 text-gray-300 text-sm">
              <p>• Professional reports</p>
              <p>• Print-ready format</p>
              <p>• Executive summaries</p>
              <p>• Presentation ready</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-slate-700 rounded-lg">
          <h4 className="text-white font-semibold mb-2">Data Contents:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-300">
            <div>• Page Views & Visits</div>
            <div>• Traffic Sources</div>
            <div>• Popular Pages</div>
            <div>• Social Sharing Data</div>
            <div>• Device Analytics</div>
            <div>• Time-based Metrics</div>
            <div>• Real-time Statistics</div>
            <div>• Engagement Data</div>
          </div>
        </div>
      </div>

      {/* Current Selection */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Current Selection:</h3>
        <div className="flex items-center space-x-2 text-gray-300">
          <Calendar className="h-4 w-4" />
          <span>Period: <span className="text-white font-semibold">{formatPeriod(selectedPeriod)}</span></span>
        </div>
      </div>
    </div>
  );
}
