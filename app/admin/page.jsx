'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalPosts: 0,
    recentPosts: [],
    isLoading: true
  });
  const router = useRouter();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats({ ...data, isLoading: false });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Article created successfully!');
        setFormData({
          title: '',
          excerpt: '',
          content: '',
          date: new Date().toISOString().split('T')[0],
          image: ''
        });
        setImageFile(null);
        setImagePreview('');
        router.push('/articles');
      } else {
        alert('Error creating article');
      }
    } catch (error) {
      alert('Error creating article');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setFormData({ ...formData, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <main className="container py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent mb-2">Admin Panel</h1>
              <p className="text-slate-600">Create and manage articles - Write anything you want!</p>
            </div>
            <div className="flex space-x-3">
              <Link 
                href="/admin/dashboard"
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-all duration-300 shadow-lg"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-lg p-8 shadow-lg border border-purple-200">
          <div className="space-y-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Article Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter article title..."
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                required
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter article excerpt..."
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-2">
                Article Image
              </label>
              <div className="space-y-3">
                {/* File Upload */}
                <div>
                  <input
                    type="file"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload an image file (JPG, PNG, GIF) or use URL below
                  </p>
                </div>
                
                {/* OR Divider */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-300"></div>
                  <span className="px-3 text-sm text-gray-500">OR</span>
                  <div className="flex-1 border-t border-gray-300"></div>
                </div>
                
                {/* URL Input */}
                <div>
                  <input
                    type="url"
                    id="imageUrl"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Paste image URL (Unsplash, etc.)
                  </p>
                </div>
              </div>
              
              {/* Image Preview */}
              {(imagePreview || formData.image) && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
                    <img 
                      src={imagePreview || formData.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Article Content (Markdown)
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                placeholder="Write your article content in Markdown..."
              />
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-500">
                  Markdown Tips: # H1, ## H2, **bold**, *italic*, [link](url), ![image](url)
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.getElementById('content');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = textarea.value.substring(start, end);
                      const newText = textarea.value.substring(0, start) + `**${selectedText}**` + textarea.value.substring(end);
                      setFormData({ ...formData, content: newText });
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.getElementById('content');
                      const start = textarea.selectionStart;
                      const end = textarea.selectionEnd;
                      const selectedText = textarea.value.substring(start, end);
                      const newText = textarea.value.substring(0, start) + `*${selectedText}*` + textarea.value.substring(end);
                      setFormData({ ...formData, content: newText });
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.getElementById('content');
                      const start = textarea.selectionStart;
                      const newText = textarea.value.substring(0, start) + `\n## ` + textarea.value.substring(start);
                      setFormData({ ...formData, content: newText });
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const textarea = document.getElementById('content');
                      const start = textarea.selectionStart;
                      const newText = textarea.value.substring(0, start) + `\n![Image description](image-url)` + textarea.value.substring(start);
                      setFormData({ ...formData, content: newText });
                    }}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                  >
                    Image
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
              >
                {isSubmitting ? 'Creating...' : 'Create Article'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/articles')}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Tips & Resources</h3>
          <div className="text-sm text-purple-800 space-y-2">
            <div>
              <p className="font-semibold mb-1">Markdown Formatting:</p>
              <p><strong>Headers:</strong> # H1, ## H2, ### H3</p>
              <p><strong>Bold:</strong> **bold text**</p>
              <p><strong>Italic:</strong> *italic text*</p>
              <p><strong>Links:</strong> [text](url)</p>
              <p><strong>Images:</strong> ![alt](image-url)</p>
              <p><strong>Lists:</strong> - item or 1. item</p>
            </div>
            <div>
              <p className="font-semibold mb-1">Free Image Sources:</p>
              <p><strong>Unsplash:</strong> https://unsplash.com/photos/...</p>
              <p><strong>Pexels:</strong> https://images.pexels.com/photos/...</p>
              <p><strong>Pixabay:</strong> https://pixabay.com/photos/...</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
