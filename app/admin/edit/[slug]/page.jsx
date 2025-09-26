'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye } from 'lucide-react';
import Link from 'next/link';

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${params.slug}`);
      if (response.ok) {
        const data = await response.json();
        setTitle(data.title || '');
        setExcerpt(data.excerpt || '');
        setContent(data.content || '');
        setFeaturedImage(data.featuredImage || '');
      } else {
        setError('Post not found');
      }
    } catch (error) {
      setError('Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please fill in title and content');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          title, 
          excerpt, 
          content, 
          featuredImage 
        }),
      });

      if (response.ok) {
        setSuccess('Post updated successfully!');
        setTimeout(() => {
          router.push('/admin-TC25');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(`Failed to update post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError(`Network error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading post...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">✍️ Edit Article</h1>
            <p className="text-gray-400 mt-2">Editing: {params.slug}</p>
          </div>
          <div className="flex gap-4">
            <Link
              href={`/articles/${params.slug}`}
              target="_blank"
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <Eye className="h-5 w-5" />
              Preview
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </div>

        {/* Back to Admin */}
        <div className="mb-6">
          <Link
            href="/admin-TC25"
            className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Admin Dashboard
          </Link>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 font-medium">{success}</p>
          </div>
        )}

        {/* Post Details */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Post Details</h2>
            
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Excerpt</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none resize-none"
                  rows="3"
                  placeholder="Enter post excerpt..."
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-gray-300 text-sm mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                  placeholder="Enter image URL..."
                />
                {featuredImage && (
                  <div className="mt-2 relative">
                    <img 
                      src={featuredImage} 
                      alt="Featured" 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setFeaturedImage("")}
                      className="absolute top-0 right-0 bg-red-500 text-white px-1 py-1 rounded-full text-xs"
                    >
                      ❌
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 mb-6">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Article Content</h2>
            <p className="text-gray-400 text-sm">Write your article content</p>
          </div>
          
          <div className="p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none resize-none"
              style={{ 
                minHeight: '400px',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif'
              }}
              placeholder="Write your article content here..."
            />
          </div>
        </div>

        {/* Live Preview */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">👀 Live Preview</h2>
          </div>
          <div className="p-6">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-xl font-bold text-white mb-2">{title || 'Article Title'}</h3>
              <p className="text-gray-300 mb-4">{excerpt || 'Article excerpt...'}</p>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: content || '<p>Article content will appear here...</p>' }} 
              />
              {featuredImage && (
                <img 
                  src={featuredImage} 
                  alt="Featured" 
                  className="mt-4 max-h-60 rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}