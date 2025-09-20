'use client';

import { useState } from 'react';

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
    }, 1000);
  };

  return (
    <main className="container py-8">
      <header className="mb-8 bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-amber-200">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent mb-2">Subscribe</h1>
        <p className="text-slate-600 max-w-2xl">Stay updated with our latest essays, interviews, and field notes.</p>
      </header>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gradient-to-br from-white/95 to-amber-50/95 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-amber-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get Our Newsletter</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="your@email.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg font-semibold"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">{message}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Get</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Weekly essays on tech culture and innovation</li>
              <li>• Exclusive interviews with European entrepreneurs</li>
              <li>• Field notes from startup events and conferences</li>
              <li>• Early access to our events and meetups</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}

