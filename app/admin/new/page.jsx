'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewPost() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        insertMedia(result.url, file.name, file.type);
        setError('');
        setSuccess(`Media uploaded successfully: ${result.fileName}`);
      } else {
        setError(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      setError(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const insertMedia = (url, name, type) => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    let mediaMarkdown = '';
    if (type && type.startsWith('image/')) {
      mediaMarkdown = `\n\n![${name}](${url})\n\n`;
    } else if (type && type.startsWith('video/')) {
      mediaMarkdown = `\n\n<video controls style="max-width: 100%; height: auto;"><source src="${url}" type="${type}">Your browser does not support the video tag.</video>\n\n`;
    } else if (mediaType === 'image') {
      mediaMarkdown = `\n\n![${name || 'Image'}](${url})\n\n`;
    } else {
      mediaMarkdown = `\n\n<video controls style="max-width: 100%; height: auto;"><source src="${url}">Your browser does not support the video tag.</video>\n\n`;
    }
    
    // Insert at cursor position
    const newContent = content.substring(0, start) + mediaMarkdown + content.substring(end);
    setContent(newContent);
    
    // Set cursor position after the inserted content
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + mediaMarkdown.length, start + mediaMarkdown.length);
    }, 0);
  };

  const handleUrlInsert = () => {
    if (!mediaUrl.trim()) {
      setError('Please enter a valid URL');
      return;
    }
    
    insertMedia(mediaUrl, '', '');
    setShowMediaModal(false);
    setMediaUrl('');
    setError('');
    setSuccess('Media added from URL');
  };

  const handleDeleteMedia = () => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    // Find the nearest media markdown or HTML
    const text = content;
    let deleteStart = start;
    let deleteEnd = end;
    
    // Look for image markdown ![alt](url)
    const imageRegex = /!\[.*?\]\([^)]+\)/g;
    let match;
    while ((match = imageRegex.exec(text)) !== null) {
      if (match.index <= start && match.index + match[0].length >= end) {
        deleteStart = match.index;
        deleteEnd = match.index + match[0].length;
        break;
      }
    }
    
    // Look for video HTML <video>...</video>
    const videoRegex = /<video[^>]*>.*?<\/video>/gs;
    while ((match = videoRegex.exec(text)) !== null) {
      if (match.index <= start && match.index + match[0].length >= end) {
        deleteStart = match.index;
        deleteEnd = match.index + match[0].length;
        break;
      }
    }
    
    if (deleteStart !== start || deleteEnd !== end) {
      const newContent = text.substring(0, deleteStart) + text.substring(deleteEnd);
      setContent(newContent);
      setSuccess('Media deleted successfully');
    } else {
      setError('No media found at cursor position');
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
      // Get the current content
      const currentContent = content;
      
      console.log('Saving content:', currentContent);
      
      const response = await fetch('/api/admin/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          excerpt,
          content: currentContent,
          featuredImage,
        }),
      });

      if (response.ok) {
        setSuccess('Post created successfully!');
        setTimeout(() => {
          router.push('/admin-TC25');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(`Failed to create post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError(`Network error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Create New Post</h1>
            <p className="text-gray-400 mt-2">Write a new article</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Create Post'}
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
                  <div className="mt-2">
                    <img 
                      src={featuredImage} 
                      alt="Featured" 
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Editor */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-white">Article Content</h2>
                <p className="text-gray-400 text-sm">Write your article content</p>
              </div>
                          <div className="flex gap-2">
                            <input
                              type="file"
                              accept="image/*,video/*"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="media-upload"
                            />
                            <label
                              htmlFor="media-upload"
                              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
                            >
                              📷 Upload File
                            </label>
                            <button
                              onClick={() => setShowMediaModal(true)}
                              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                            >
                              🔗 Add URL
                            </button>
                            <button
                              onClick={handleDeleteMedia}
                              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                            >
                              🗑️ Delete Media
                            </button>
                            {uploading && (
                              <span className="text-blue-400 text-sm flex items-center">Uploading...</span>
                            )}
                          </div>
            </div>
          </div>
          
          <div className="p-4">
            <textarea
              value={content}
              onChange={handleContentChange}
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
      </div>

      {/* Media URL Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-4">Add Media from URL</h3>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">Media Type</label>
              <select
                value={mediaType}
                onChange={(e) => setMediaType(e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-300 text-sm mb-2">URL</label>
              <input
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowMediaModal(false);
                  setMediaUrl('');
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUrlInsert}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Media
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}