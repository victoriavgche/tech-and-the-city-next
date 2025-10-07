'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, MousePointer, Calendar, TrendingUp } from 'lucide-react';

export default function SimpleAnalytics() {
  const [stats, setStats] = useState(null);
  const [popularPages, setPopularPages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Fetch basic stats
      const statsResponse = await fetch('/api/analytics?type=basic');
      const statsData = await statsResponse.json();
      setStats(statsData);
      
      // Fetch popular pages
      const popularResponse = await fetch('/api/analytics?type=popular');
      const popularData = await popularResponse.json();
      setPopularPages(popularData);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center">
        <div className="text-white text-xl">No analytics data available</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
          <p className="text-gray-300">Simple website analytics and visitor statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Page Views</p>
                <p className="text-2xl font-bold text-white">{stats.totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Today's Views</p>
                <p className="text-2xl font-bold text-white">{stats.todayViews}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
              </div>
              <MousePointer className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unique Pages</p>
                <p className="text-2xl font-bold text-white">{stats.uniquePages}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Popular Pages */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Most Popular Pages</h2>
          {popularPages.length > 0 ? (
            <div className="space-y-3">
              {popularPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-slate-700 rounded">
                  <div className="flex items-center">
                    <span className="text-gray-400 text-sm w-8">#{index + 1}</span>
                    <span className="text-white ml-3">{page.url}</span>
                  </div>
                  <span className="text-blue-400 font-semibold">{page.count} views</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No page views recorded yet</p>
          )}
        </div>

        {/* Metadata */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Analytics Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-400 text-sm">First Recorded</p>
              <p className="text-white">{stats.firstDay || 'No data yet'}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Last Updated</p>
              <p className="text-white">
                {stats.lastUpdated ? new Date(stats.lastUpdated).toLocaleString() : 'Never'}
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchAnalytics}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
}

