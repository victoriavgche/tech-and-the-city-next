'use client';

import { useState } from 'react';
import '../../components/analytics.js';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Simulate subscription
    setTimeout(() => {
      setMessage('Thank you for subscribing! You\'ll receive our latest updates.');
      setEmail('');
      setIsSubmitting(false);
      
      // Track newsletter subscription
      if (typeof window !== 'undefined' && window.analytics) {
        window.analytics.trackNewsletterSubscription('subscribe_page');
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="container py-8">
        <header className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Subscribe</h1>
            <p className="text-gray-300 text-lg max-w-2xl">Stay updated with our latest essays, interviews, and field notes.</p>
          </div>
        </header>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6">Get Our Newsletter</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg font-semibold"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
              <p className="text-green-400 font-medium">{message}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">What You'll Get</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Weekly essays on tech culture and innovation</li>
              <li>• Exclusive interviews with European entrepreneurs</li>
              <li>• Field notes from startup events and conferences</li>
              <li>• Early access to our events and meetups</li>
            </ul>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

