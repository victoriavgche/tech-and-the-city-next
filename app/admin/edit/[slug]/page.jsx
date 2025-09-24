'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, ArrowLeft, Upload, X } from 'lucide-react';

export default function EditArticle({ params }) {
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/posts/${params.slug}`);
      const data = await response.json();
      setPost(data);
      setImagePreview(data.image || '');
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`/api/admin/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Error saving article');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving article');
    } finally {
      setSaving(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
        setPost({ ...post, image: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (url) => {
    setImagePreview(url);
    setPost({ ...post, image: url });
  };

  const removeImage = () => {
    setImagePreview('');
    setPost({ ...post, image: '' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Post not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Admin
            </Link>
            <h1 className="text-3xl font-bold text-white">Edit Article</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-5 w-5" />
            {saving ? 'Saving...' : 'Save & Go Home'}
          </button>
        </div>

        {/* Article Content */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          
          {/* Title */}
          <div className="mb-6">
            <label className="block text-cyan-400 font-semibold mb-2">Title</label>
            <input
              type="text"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-400 focus:outline-none"
              placeholder="Article title..."
            />
          </div>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block text-cyan-400 font-semibold mb-2">Excerpt</label>
            <textarea
              value={post.excerpt}
              onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-400 focus:outline-none h-24"
              placeholder="Article excerpt..."
            />
          </div>

          {/* Image Section */}
          <div className="mb-6">
            <label className="block text-cyan-400 font-semibold mb-2">Image</label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Image URL Input */}
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Image URL</label>
              <input
                type="url"
                value={post.image || ''}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-400 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-300 text-sm mb-2">Or Upload File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-cyan-400 font-semibold mb-2">Content</label>
            <textarea
              value={post.content}
              onChange={(e) => setPost({ ...post, content: e.target.value })}
              className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-cyan-400 focus:outline-none h-96"
              placeholder="Write your article content here..."
            />
            <p className="text-gray-400 text-sm mt-2">
              You can use Markdown formatting. The content will be rendered as HTML.
            </p>
          </div>

          {/* Date and Reading Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-cyan-400 font-semibold mb-2">Date</label>
              <input
                type="date"
                value={post.date}
                onChange={(e) => setPost({ ...post, date: e.target.value })}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-cyan-400 font-semibold mb-2">Reading Time</label>
              <input
                type="text"
                value={post.read || ''}
                onChange={(e) => setPost({ ...post, read: e.target.value })}
                className="w-full bg-slate-700 text-white px-4 py-2 rounded-lg border border-slate-600 focus:border-cyan-400 focus:outline-none"
                placeholder="5 min"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
