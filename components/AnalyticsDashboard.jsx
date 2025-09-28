'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Eye, 
  ArrowUpRight, 
  Clock, 
  Users, 
  Download,
  Globe,
  MousePointer,
  Share2,
  Calendar,
  UserPlus,
  Mail,
  MessageSquare,
  Heart
} from 'lucide-react';
import AnalyticsExport from './AnalyticsExport';

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [period, setPeriod] = useState('7d');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (isRealTime) {
        fetchAnalytics();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [period, isRealTime]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?type=all&period=${period}`);
      const data = await response.json();
      setAnalytics(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Analytics Dashboard</h1>
              <p className="text-gray-300 text-lg">Track your website performance and visitor engagement</p>
              {lastUpdated && (
                <p className="text-gray-400 text-sm mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                  {isRealTime && <span className="ml-2 text-green-400">• Real-time</span>}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsRealTime(!isRealTime)}
                className={`px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 ${
                  isRealTime 
                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${isRealTime ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                {isRealTime ? 'Real-time ON' : 'Real-time OFF'}
              </button>
              <button
                onClick={fetchAnalytics}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-wrap gap-2">
              {[
                { id: '1d', label: 'Last 24 Hours' },
                { id: '7d', label: 'Last 7 Days' },
                { id: '30d', label: 'Last 30 Days' },
                { id: '90d', label: 'Last 90 Days' },
                { id: 'all', label: 'All Time' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePeriodChange(p.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    period === p.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'sources', label: 'Traffic Sources', icon: TrendingUp },
                { id: 'popular_articles', label: 'Popular Articles', icon: Eye },
                { id: 'click_through_rates', label: 'Click-Through Rates', icon: ArrowUpRight },
                { id: 'engagement', label: 'Engagement', icon: Clock },
                { id: 'community', label: 'Community', icon: Users },
                { id: 'export', label: 'Export Data', icon: Download }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          {activeTab === 'overview' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Analytics Overview</h2>
              {analytics?.overview ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-lg p-6 border border-blue-500/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {analytics.overview.totalVisits}
                      </div>
                      <div className="text-blue-200 text-sm">Total Visits</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-lg p-6 border border-green-500/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {analytics.overview.uniqueVisitors}
                      </div>
                      <div className="text-green-200 text-sm">Unique Visitors</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-400 mb-2">
                        {analytics.overview.totalClicks}
                      </div>
                      <div className="text-purple-200 text-sm">Total Clicks</div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-400 mb-2">
                        {analytics.overview.totalEvents}
                      </div>
                      <div className="text-yellow-200 text-sm">Total Events</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className="text-xl font-semibold text-white mb-2">No Data Yet</h3>
                  <p className="text-gray-400 mb-6">
                    Analytics data will appear here once visitors start using your website.
                  </p>
                  <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-blue-300 text-sm">
                      <strong>Real-time tracking is active!</strong><br/>
                      All visitor interactions are being recorded.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'sources' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Traffic Sources</h2>
              {analytics?.sources && Object.keys(analytics.sources).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(analytics.sources).map(([source, count]) => (
                    <div key={source} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                      <span className="text-white font-medium">{source}</span>
                      <span className="text-blue-400 font-bold">{count} visits</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🌐</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Traffic Sources Yet</h3>
                  <p className="text-gray-400">Traffic source data will appear here once visitors arrive from external sites.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'popular_articles' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Most Popular Articles</h2>
              {analytics?.popular_articles && analytics.popular_articles.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {analytics.popular_articles.map(([article, views], index) => (
                      <div key={article} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg hover:bg-gray-700/50 transition-all duration-200 cursor-pointer border border-gray-700/50 hover:border-blue-500/50">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl font-bold text-blue-400 w-8">#{index + 1}</div>
                          <div>
                            <div className="text-white font-medium">{article}</div>
                            <div className="text-gray-400 text-sm">{views} views</div>
                          </div>
                        </div>
                        <div className="text-blue-400 font-bold">{views}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm rounded-lg p-4 border border-blue-500/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {analytics.popular_articles.reduce((sum, [, views]) => sum + views, 0)}
                        </div>
                        <div className="text-sm text-blue-200">Total Article Views</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-lg p-4 border border-green-500/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {analytics.popular_articles.length}
                        </div>
                        <div className="text-sm text-green-200">Articles Tracked</div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-lg p-4 border border-purple-500/30">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {analytics.popular_articles.length > 0 ? 
                            Math.round(analytics.popular_articles.reduce((sum, [, views]) => sum + views, 0) / analytics.popular_articles.length) : 0}
                        </div>
                        <div className="text-sm text-purple-200">Avg Views/Article</div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📰</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Article Views Yet</h3>
                  <p className="text-gray-400">Article popularity data will appear here once visitors start reading your content.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'click_through_rates' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Click-Through Rates (CTR)</h2>
              {analytics?.click_through_rates ? (
                <>
                  <div className="space-y-4">
                    {analytics.click_through_rates.map(({ elementType, clicks, ctr }) => (
                      <div key={elementType} className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg">
                        <span className="text-white font-medium">{elementType}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-blue-400">{clicks} clicks</span>
                          <span className="text-green-400">{ctr.toFixed(2)}% CTR</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">🖱️</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Click Data Yet</h3>
                  <p className="text-gray-400">Click-through rate data will appear here once visitors start interacting with your content.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'engagement' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Engagement Metrics</h2>
              {analytics?.engagement ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Average Time on Page</h3>
                    <p className="text-3xl font-bold text-blue-400">
                      {Math.round(analytics.engagement.averageTimeOnPage / 1000)}s
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Bounce Rate</h3>
                    <p className="text-3xl font-bold text-red-400">
                      {Math.round(analytics.engagement.bounceRate || 0)}%
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Pages per Session</h3>
                    <p className="text-3xl font-bold text-green-400">
                      {Math.round(analytics.engagement.averagePagesPerSession || 0)}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Newsletter Subscriptions</h3>
                    <p className="text-3xl font-bold text-purple-400">
                      {analytics.engagement.newsletterSubscriptions || 0}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Contact Forms</h3>
                    <p className="text-3xl font-bold text-yellow-400">
                      {analytics.engagement.contactFormSubmissions || 0}
                    </p>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">Event Interactions</h3>
                    <p className="text-3xl font-bold text-indigo-400">
                      {analytics.engagement.eventInteractions || 0}
                    </p>
                  </div>

                  {Object.keys(analytics.engagement.shares).length > 0 && (
                    <div className="bg-gray-800/50 rounded-lg p-6 md:col-span-2 lg:col-span-3">
                      <h3 className="text-lg font-semibold text-white mb-4">Social Shares</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(analytics.engagement.shares).map(([platform, count]) => (
                          <div key={platform} className="text-center">
                            <div className="text-2xl font-bold text-green-400">{count}</div>
                            <div className="text-sm text-gray-300">{platform}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">⏱️</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Engagement Data Yet</h3>
                  <p className="text-gray-400">Engagement metrics will appear here once visitors start spending time on your pages.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'community' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Community Building</h2>
              {analytics?.engagement ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 backdrop-blur-sm rounded-lg p-6 border border-purple-500/30">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-400 mb-2">
                        {analytics.engagement.newsletterSubscriptions || 0}
                      </div>
                      <div className="text-purple-200 text-sm">Newsletter Subscribers</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 backdrop-blur-sm rounded-lg p-6 border border-yellow-500/30">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-yellow-400 mb-2">
                        {analytics.engagement.contactFormSubmissions || 0}
                      </div>
                      <div className="text-yellow-200 text-sm">Contact Form Submissions</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 backdrop-blur-sm rounded-lg p-6 border border-indigo-500/30">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-indigo-400 mb-2">
                        {analytics.engagement.eventInteractions || 0}
                      </div>
                      <div className="text-indigo-200 text-sm">Event Interactions</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 backdrop-blur-sm rounded-lg p-6 border border-green-500/30 md:col-span-2 lg:col-span-3">
                    <h3 className="text-lg font-semibold text-white mb-4 text-center">Social Media Engagement</h3>
                    {Object.keys(analytics.engagement.shares).length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(analytics.engagement.shares).map(([platform, count]) => (
                          <div key={platform} className="text-center">
                            <div className="text-3xl font-bold text-green-400">{count}</div>
                            <div className="text-sm text-green-200">{platform} Shares</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="text-4xl mb-2">📱</div>
                        <p className="text-gray-400">No social shares yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">👥</div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Community Data Yet</h3>
                  <p className="text-gray-400">Community metrics will appear here once visitors start engaging with your content.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'export' && (
            <AnalyticsExport period={period} />
          )}
        </div>
      </div>
    </div>
  );
}