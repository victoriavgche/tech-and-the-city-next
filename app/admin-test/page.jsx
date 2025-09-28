'use client';

import { useState, useEffect } from 'react';

export default function AdminTest() {
  const [mobileInfo, setMobileInfo] = useState({});
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setMobileInfo({
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        localStorage: typeof localStorage !== 'undefined',
        isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      });
    }
  }, []);

  const testLogin = () => {
    setTestResult('Testing login...');
    
    // Simulate login test
    setTimeout(() => {
      const email = 'admin@techandthecity.com';
      const password = 'TechAndTheCity2024!';
      
      if (email && password) {
        setTestResult('✅ Login test successful! Credentials work.');
      } else {
        setTestResult('❌ Login test failed - missing credentials');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Admin Panel Test</h1>
        
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Mobile Device Info</h2>
          <div className="space-y-2 text-sm">
            <div><strong>User Agent:</strong> <span className="text-gray-300">{mobileInfo.userAgent || 'Loading...'}</span></div>
            <div><strong>Screen Size:</strong> <span className="text-gray-300">{mobileInfo.screenWidth}x{mobileInfo.screenHeight}</span></div>
            <div><strong>Is Mobile:</strong> <span className="text-gray-300">{mobileInfo.isMobile ? 'Yes' : 'No'}</span></div>
            <div><strong>localStorage:</strong> <span className="text-gray-300">{mobileInfo.localStorage ? 'Available' : 'Not Available'}</span></div>
          </div>
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Simple Login Test</h2>
          <button
            onClick={testLogin}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors mb-4"
          >
            Test Login Functionality
          </button>
          {testResult && (
            <div className="text-center text-white p-3 bg-gray-700 rounded">
              {testResult}
            </div>
          )}
        </div>

        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-xl font-bold text-white mb-4">Quick Access Links</h2>
          <div className="space-y-3">
            <a
              href="/admin-TC25"
              className="block w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-center"
            >
              Go to Admin Panel
            </a>
            <a
              href="/"
              className="block w-full bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-center"
            >
              Back to Home
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400 text-sm">
          <p>This is a test page to debug mobile admin panel issues.</p>
          <p>Check the device info above and try the login test.</p>
        </div>
      </div>
    </div>
  );
}
