'use client';

import { useState } from 'react';
import { Download, FileText, FileSpreadsheet, Database, FileImage } from 'lucide-react';

export default function AnalyticsExport({ period }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');

  const handleExport = async (format, type = 'detailed') => {
    setIsExporting(true);
    
    try {
      const url = `/api/analytics/export?format=${format}&type=${type}&period=${period}`;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const exportOptions = [
    {
      id: 'json',
      label: 'JSON (Complete Data)',
      icon: Database,
      description: 'Full analytics data in JSON format',
      color: 'from-blue-600 to-blue-800'
    },
    {
      id: 'csv',
      label: 'CSV (Spreadsheet)',
      icon: FileText,
      description: 'Data in CSV format for Excel/Google Sheets',
      color: 'from-green-600 to-green-800'
    },
    {
      id: 'excel',
      label: 'Excel Format',
      icon: FileSpreadsheet,
      description: 'Structured data for Excel import',
      color: 'from-orange-600 to-orange-800'
    },
    {
      id: 'pdf',
      label: 'PDF Report',
      icon: FileImage,
      description: 'Professional analytics report as PDF',
      color: 'from-red-600 to-red-800'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <Download className="h-6 w-6 text-blue-400" />
        <h3 className="text-xl font-bold text-white">Export Analytics Data</h3>
      </div>
      
      <p className="text-gray-300 mb-6">
        Download your analytics data for the selected period: <span className="text-blue-400 font-medium">{period}</span>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {exportOptions.map((option) => (
          <div
            key={option.id}
            className={`bg-gradient-to-br ${option.color}/20 backdrop-blur-sm rounded-lg p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200 cursor-pointer ${
              exportFormat === option.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setExportFormat(option.id)}
          >
            <div className="flex items-center gap-3 mb-2">
              <option.icon className="h-5 w-5 text-blue-400" />
              <span className="text-white font-medium text-sm">{option.label}</span>
            </div>
            <p className="text-gray-400 text-xs">{option.description}</p>
          </div>
        ))}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={() => handleExport(exportFormat, 'detailed')}
          disabled={isExporting}
          className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Export Detailed Data
            </>
          )}
        </button>
        
        <button
          onClick={() => handleExport(exportFormat, 'overview')}
          disabled={isExporting}
          className="bg-gray-600 text-white px-4 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Database className="h-4 w-4" />
          Summary Only
        </button>
      </div>
      
      <div className="mt-4 text-xs text-gray-400">
        <p>📊 <strong>Detailed Export:</strong> All page views, events, clicks, and sessions</p>
        <p>📈 <strong>Summary Export:</strong> Aggregated statistics and metrics only</p>
        <p>📄 <strong>PDF Report:</strong> Professional report that opens in browser for printing to PDF</p>
      </div>
    </div>
  );
}
