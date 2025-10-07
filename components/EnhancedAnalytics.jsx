'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Eye, 
  MousePointer, 
  Calendar, 
  TrendingUp, 
  Clock, 
  MapPin,
  Target,
  Globe,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  Share2,
  Zap,
  Clock3,
  Download
} from 'lucide-react';
import AnalyticsExtract from './AnalyticsExtract';

export default function EnhancedAnalytics() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [stats, setStats] = useState(null);
  const [popularPages, setPopularPages] = useState([]);
  const [trafficSources, setTrafficSources] = useState([]);
  const [engagement, setEngagement] = useState(null);
  const [ctrData, setCtrData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [socialData, setSocialData] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [hourlyData, setHourlyData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [selectedPeriod]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      
      // Fetch all analytics data in parallel with period parameter
      const [statsRes, popularRes, sourcesRes, engagementRes, ctrRes, devicesRes, socialRes, realtimeRes, hourlyRes] = await Promise.all([
        fetch(`/api/analytics?type=basic&period=${selectedPeriod}`),
        fetch(`/api/analytics?type=popular&period=${selectedPeriod}`),
        fetch(`/api/analytics?type=sources&period=${selectedPeriod}`),
        fetch(`/api/analytics?type=engagement&period=${selectedPeriod}`),
        fetch(`/api/analytics?type=ctr&period=${selectedPeriod}`),
        fetch(`/api/analytics?type=devices&period=${selectedPeriod}`),
        fetch(`/api/analytics?type=social&period=${selectedPeriod}`),
        fetch(`/api/analytics?type=realtime`),
        fetch(`/api/analytics?type=hourly&period=${selectedPeriod}`)
      ]);
      
      const [statsData, popularData, sourcesData, engagementData, ctrData, devicesData, socialData, realtimeData, hourlyData] = await Promise.all([
        statsRes.json(),
        popularRes.json(),
        sourcesRes.json(),
        engagementRes.json(),
        ctrRes.json(),
        devicesRes.json(),
        socialRes.json(),
        realtimeRes.json(),
        hourlyRes.json()
      ]);
      
      setStats(statsData);
      setPopularPages(popularData);
      setTrafficSources(sourcesData);
      setEngagement(engagementData);
      setCtrData(ctrData);
      setDeviceData(devicesData);
      setSocialData(socialData);
      setRealtimeData(realtimeData);
      setHourlyData(hourlyData);
      
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    }
    return `${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading enhanced analytics...</div>
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
          <h1 className="text-3xl font-bold text-white mb-2">Enhanced Analytics Dashboard</h1>
          <p className="text-gray-300">Comprehensive website analytics and visitor insights</p>
          
          {/* Period Selector */}
          <div className="mt-4">
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Period:</span>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Time</option>
                <option value="30d">Last 30 Days</option>
                <option value="60d">Last 60 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-slate-800 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'realtime', label: 'Real-Time', icon: Zap },
            { id: 'hourly', label: 'Peak Hours', icon: Clock3 },
            { id: 'social', label: 'Social Sharing', icon: Share2 },
            { id: 'sources', label: 'Traffic Sources', icon: Globe },
            { id: 'content', label: 'Popular Content', icon: Target },
            { id: 'extract', label: 'Extract Data', icon: Download }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 rounded-md transition-colors text-sm sm:text-base ${
                activeTab === id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Total Visits</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.totalViews}</p>
                  </div>
                  <Eye className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Unique Visitors</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.uniquePages}</p>
                  </div>
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Today's Views</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">{stats.todayViews}</p>
                  </div>
                  <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs sm:text-sm">Avg. Time on Page</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {engagement ? formatTime(engagement.averageTime) : '0s'}
                    </p>
                  </div>
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-slate-800 rounded-lg p-4 sm:p-6 border border-slate-700">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Traffic Sources (Top 5)</h3>
                {trafficSources.slice(0, 5).map((source, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <span className="text-gray-300">{source.source}</span>
                    <span className="text-blue-400 font-semibold">{source.count}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* Traffic Sources Tab */}
        {activeTab === 'sources' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Traffic Sources</h2>
              {trafficSources.length > 0 ? (
                <div className="space-y-4">
                  {trafficSources.map((source, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">#{index + 1}</span>
                        </div>
                        <span className="text-white font-medium">{source.source}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-blue-400 font-bold text-lg">{source.count}</span>
                        <p className="text-gray-400 text-sm">visits</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No traffic source data available</p>
              )}
            </div>
          </div>
        )}

        {/* Popular Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6">Most Popular Pages</h2>
              {popularPages.length > 0 ? (
                <div className="space-y-3">
                  {popularPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">#{index + 1}</span>
                        </div>
                        <div>
                          <span className="text-white font-medium">{page.url}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-green-400 font-bold text-lg">{page.count}</span>
                        <p className="text-gray-400 text-sm">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No page view data available</p>
              )}
            </div>
          </div>
        )}




        {/* Real-Time Tab */}
        {activeTab === 'realtime' && realtimeData && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                Real-Time Analytics
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Last 24 Hours */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Last 24 Hours</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Page Views:</span>
                      <span className="text-blue-400 font-bold">{realtimeData.last24Hours.pageViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Social Shares:</span>
                      <span className="text-purple-400 font-bold">{realtimeData.last24Hours.socialShares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Unique Pages:</span>
                      <span className="text-orange-400 font-bold">{realtimeData.last24Hours.uniquePages}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Pages (24h)</h4>
                    <div className="space-y-1">
                      {realtimeData.last24Hours.topPages.map((page, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-400 truncate">{page.url}</span>
                          <span className="text-white">{page.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Last Hour */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Last Hour</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Page Views:</span>
                      <span className="text-blue-400 font-bold">{realtimeData.lastHour.pageViews}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Social Shares:</span>
                      <span className="text-purple-400 font-bold">{realtimeData.lastHour.socialShares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Unique Pages:</span>
                      <span className="text-orange-400 font-bold">{realtimeData.lastHour.uniquePages}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-300 mb-2">Top Pages (1h)</h4>
                    <div className="space-y-1">
                      {realtimeData.lastHour.topPages.map((page, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-400 truncate">{page.url}</span>
                          <span className="text-white">{page.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Last updated: {new Date(realtimeData.currentTime).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Peak Hours Tab */}
        {activeTab === 'hourly' && hourlyData && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Clock3 className="h-5 w-5 mr-2 text-orange-400" />
                Peak Hours Analysis
              </h2>
              
              
              {/* Peak Hours Lists */}
              <div className="mb-6">
                {/* Top 3 Busiest Hours - Detailed */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">🏆 Top 3 Busiest Hours</h3>
                  <div className="space-y-3">
                    {hourlyData.peakHours.totalActivity.map((hour, index) => (
                      <div key={index} className="bg-slate-600 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-green-500' :
                              index === 1 ? 'bg-yellow-500' :
                              'bg-orange-500'
                            }`}></div>
                            <span className="text-white font-medium">{hour.hourLabel}</span>
                          </div>
                        </div>
                        
                        {/* Breakdown */}
                        <div className="flex justify-between items-center text-sm">
                          <div className="flex-1 text-center">
                            <div className="text-blue-400 font-bold text-lg">{hour.pageViews}</div>
                            <div className="text-gray-400 text-xs">Page Views</div>
                          </div>
                          <div className="w-px h-8 bg-slate-500 mx-2"></div>
                          <div className="flex-1 text-center">
                            <div className="text-purple-400 font-bold text-lg">{hour.socialShares || 0}</div>
                            <div className="text-gray-400 text-xs">Social Shares</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        )}

        {/* Social Sharing Tab */}
        {activeTab === 'social' && socialData && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                <Share2 className="h-5 w-5 mr-2 text-green-400" />
                Social Media Sharing Analytics
              </h2>
              
              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <h3 className="text-sm text-gray-300 mb-2">Total Shares</h3>
                  <div className="text-2xl font-bold text-green-400">{socialData.totalShares}</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <h3 className="text-sm text-gray-300 mb-2">Unique Users</h3>
                  <div className="text-2xl font-bold text-blue-400">{socialData.totalUniqueUsers}</div>
                </div>
                <div className="bg-slate-700 rounded-lg p-4 text-center">
                  <h3 className="text-sm text-gray-300 mb-2">Platforms Used</h3>
                  <div className="text-2xl font-bold text-purple-400">{socialData.platformStats.length}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Platform Stats */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Platforms & Stats</h3>
                  <div className="space-y-4">
                    {socialData.platformStats.map((platform, index) => (
                      <div key={index} className="bg-slate-600 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-blue-500' :
                              index === 1 ? 'bg-green-500' :
                              index === 2 ? 'bg-purple-500' :
                              'bg-gray-500'
                            }`}></div>
                            <span className="text-white font-medium capitalize">{platform.platform}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-green-400 font-bold text-lg">{platform.count}</div>
                            <div className="text-gray-400 text-xs">Total Shares</div>
                          </div>
                          <div className="text-center">
                            <div className="text-blue-400 font-bold text-lg">{platform.uniqueUsers}</div>
                            <div className="text-gray-400 text-xs">Unique Users</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shared Content */}
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Shared Content</h3>
                  <div className="space-y-4">
                    {socialData.urlStats.slice(0, 5).map((content, index) => {
                      // Determine if it's an article or event
                      const isArticle = content.url.includes('/articles/');
                      const isEvent = content.url.includes('/events/');
                      const contentType = isArticle ? '📰 Article' : '🎉 Event';
                      
                      return (
                        <div key={index} className="bg-slate-600 rounded-lg p-3">
                          <div className="mb-2">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                                {contentType}
                              </span>
                              <div className="text-white font-medium text-sm" title={content.title}>
                                {content.title}
                              </div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-center">
                              <div className="text-green-400 font-bold text-lg">{content.totalShares}</div>
                              <div className="text-gray-400 text-xs">Total Shares</div>
                            </div>
                            <div className="text-center">
                              <div className="text-blue-400 font-bold text-lg">{content.uniqueUsers}</div>
                              <div className="text-gray-400 text-xs">Unique Users</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Extract Data Tab */}
        {activeTab === 'extract' && (
          <AnalyticsExtract />
        )}

      </div>
    </div>
  );
}
