'use client';

import { useEffect, useState } from 'react';

export default function AnalyticsTest() {
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Collect device information
      const info = {
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        screen: {
          width: window.screen.width,
          height: window.screen.height,
          colorDepth: window.screen.colorDepth,
          pixelDepth: window.screen.pixelDepth
        },
        devicePixelRatio: window.devicePixelRatio || 1,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        connectionType: navigator.connection?.effectiveType || 'unknown',
        deviceMemory: navigator.deviceMemory || 'unknown',
        hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
        maxTouchPoints: navigator.maxTouchPoints || 0
      };
      
      setDeviceInfo(info);
      
      // Test analytics functionality
      testAnalytics();
    }
  }, []);

  const testAnalytics = async () => {
    const results = {
      pageview: false,
      event: false,
      click: false,
      socialShare: false
    };

    try {
      // Test pageview tracking
      const pageviewResponse = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'pageview',
          url: '/analytics-test',
          title: 'Analytics Test',
          referrer: '',
          userAgent: navigator.userAgent,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          screen: {
            width: window.screen.width,
            height: window.screen.height,
            colorDepth: window.screen.colorDepth,
            pixelDepth: window.screen.pixelDepth
          },
          devicePixelRatio: window.devicePixelRatio || 1,
          language: navigator.language,
          platform: navigator.platform
        })
      });
      results.pageview = pageviewResponse.ok;

      // Test event tracking
      const eventResponse = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event',
          eventType: 'test_event',
          eventData: { test: true, timestamp: new Date().toISOString() }
        })
      });
      results.event = eventResponse.ok;

      // Test click tracking
      const clickResponse = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'click',
          url: '/analytics-test',
          x: 100,
          y: 100,
          element: 'BUTTON',
          userAgent: navigator.userAgent
        })
      });
      results.click = clickResponse.ok;

      // Test social share tracking
      const socialResponse = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'event',
          eventType: 'social_share',
          eventData: {
            platform: 'test',
            url: '/analytics-test',
            title: 'Analytics Test',
            timestamp: new Date().toISOString()
          }
        })
      });
      results.socialShare = socialResponse.ok;

    } catch (error) {
      console.error('Analytics test error:', error);
    }

    setTestResults(results);
  };

  const detectDeviceType = (userAgent) => {
    const ua = userAgent.toLowerCase();
    
    // Enhanced mobile detection
    const mobileKeywords = [
      'mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone',
      'webos', 'opera mini', 'iemobile', 'mobile safari', 'fennec',
      'mobile firefox', 'mobile chrome', 'mobile edge'
    ];
    
    // Enhanced tablet detection
    const tabletKeywords = [
      'ipad', 'tablet', 'kindle', 'silk', 'playbook', 'nexus 7', 'nexus 10',
      'galaxy tab', 'surface', 'windows rt', 'xoom', 'sch-i800'
    ];
    
    // Check for tablet first (tablets often have mobile in user agent)
    for (const keyword of tabletKeywords) {
      if (ua.includes(keyword)) {
        return 'tablet';
      }
    }
    
    // Check for mobile
    for (const keyword of mobileKeywords) {
      if (ua.includes(keyword)) {
        return 'mobile';
      }
    }
    
    // Special case: Android without mobile keyword (usually tablet)
    if (ua.includes('android') && !ua.includes('mobile')) {
      return 'tablet';
    }
    
    // Default to desktop
    return 'desktop';
  };

  const getResponsiveBreakpoint = () => {
    const width = window.innerWidth;
    if (width < 640) return 'Mobile (sm)';
    if (width < 768) return 'Small Mobile (md)';
    if (width < 1024) return 'Tablet (lg)';
    if (width < 1280) return 'Desktop (xl)';
    return 'Large Desktop (2xl)';
  };

  if (!deviceInfo) {
    return <div className="p-4 text-white">Loading device information...</div>;
  }

  const deviceType = detectDeviceType(deviceInfo.userAgent);
  const responsiveBreakpoint = getResponsiveBreakpoint();

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Analytics System Test</h1>
      
      {/* Device Information */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Device Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-medium text-blue-400 mb-2">Device Type</h3>
            <p className="text-white mb-2">
              <span className="font-semibold">Detected:</span> {deviceType}
            </p>
            <p className="text-white mb-2">
              <span className="font-semibold">Responsive Breakpoint:</span> {responsiveBreakpoint}
            </p>
            <p className="text-white">
              <span className="font-semibold">Touch Points:</span> {deviceInfo.maxTouchPoints}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-blue-400 mb-2">Screen Info</h3>
            <p className="text-white mb-1">
              <span className="font-semibold">Viewport:</span> {deviceInfo.viewport.width} × {deviceInfo.viewport.height}
            </p>
            <p className="text-white mb-1">
              <span className="font-semibold">Screen:</span> {deviceInfo.screen.width} × {deviceInfo.screen.height}
            </p>
            <p className="text-white mb-1">
              <span className="font-semibold">Pixel Ratio:</span> {deviceInfo.devicePixelRatio}
            </p>
            <p className="text-white">
              <span className="font-semibold">Color Depth:</span> {deviceInfo.screen.colorDepth} bits
            </p>
          </div>
        </div>
      </div>

      {/* Test Results */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Analytics Functionality Test</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
              testResults.pageview ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white font-bold">
                {testResults.pageview ? '✓' : '✗'}
              </span>
            </div>
            <p className="text-white font-medium">Page View</p>
            <p className="text-gray-400 text-sm">Tracking</p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
              testResults.event ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white font-bold">
                {testResults.event ? '✓' : '✗'}
              </span>
            </div>
            <p className="text-white font-medium">Event</p>
            <p className="text-gray-400 text-sm">Tracking</p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
              testResults.click ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white font-bold">
                {testResults.click ? '✓' : '✗'}
              </span>
            </div>
            <p className="text-white font-medium">Click</p>
            <p className="text-gray-400 text-sm">Tracking</p>
          </div>
          
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center ${
              testResults.socialShare ? 'bg-green-500' : 'bg-red-500'
            }`}>
              <span className="text-white font-bold">
                {testResults.socialShare ? '✓' : '✗'}
              </span>
            </div>
            <p className="text-white font-medium">Social Share</p>
            <p className="text-gray-400 text-sm">Tracking</p>
          </div>
        </div>
      </div>

      {/* Browser Information */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">Browser & Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-white mb-1">
              <span className="font-semibold">Language:</span> {deviceInfo.language}
            </p>
            <p className="text-white mb-1">
              <span className="font-semibold">Platform:</span> {deviceInfo.platform}
            </p>
            <p className="text-white mb-1">
              <span className="font-semibold">Online:</span> {deviceInfo.onLine ? 'Yes' : 'No'}
            </p>
            <p className="text-white">
              <span className="font-semibold">Cookies:</span> {deviceInfo.cookieEnabled ? 'Enabled' : 'Disabled'}
            </p>
          </div>
          <div>
            <p className="text-white mb-1">
              <span className="font-semibold">Connection:</span> {deviceInfo.connectionType}
            </p>
            <p className="text-white mb-1">
              <span className="font-semibold">Memory:</span> {deviceInfo.deviceMemory} GB
            </p>
            <p className="text-white mb-1">
              <span className="font-semibold">CPU Cores:</span> {deviceInfo.hardwareConcurrency}
            </p>
          </div>
        </div>
      </div>

      {/* User Agent */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-xl font-semibold text-white mb-4">User Agent</h2>
        <p className="text-gray-300 text-sm break-all">{deviceInfo.userAgent}</p>
      </div>
    </div>
  );
}
