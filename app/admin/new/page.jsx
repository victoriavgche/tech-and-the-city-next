'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, Upload, FileText, Image, Calendar } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import για ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), { 
  ssr: false,
  loading: () => <div className="p-4 text-gray-500 italic">Loading editor...</div>
});

export default function NewPost() {
  const router = useRouter();
  
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [articleDate, setArticleDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [uploading, setUploading] = useState(false);

  // ReactQuill modules για rich text editing
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link']
    ],
  };

  const quillFormats = [
    'bold', 'italic', 'underline',
    'list', 'bullet', 'link'
  ];

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setImage(result.url);
        setError('');
        setSuccess('Image uploaded successfully!');
        e.target.value = ''; // Reset file input
      } else {
        setError(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      setError(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/admin/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title || 'Draft',
          excerpt: excerpt || 'Draft article',
          content: content || 'This is a draft...',
          image,
          date: articleDate,
          status: 'draft'
        }),
      });

      if (response.ok) {
        setSuccess('Draft saved successfully!');
        setTimeout(() => {
          router.push('/admin-TC25');
        }, 2000);
      } else {
        const errorData = await response.json();
        setError(`Failed to save draft: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      setError(`Network error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Please fill in title');
      return;
    }
    
    // Check if content has actual text (not just HTML tags)
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    if (!textContent) {
      setError('Please fill in content');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      console.log('Creating post with data:', {
        title,
        excerpt,
        contentLength: content.length,
        image,
        date: articleDate
      });

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/admin/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          image,
          date: articleDate,
        }),
      });

      console.log('Create response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('Create successful:', result);
        setSuccess('Post created successfully!');
        setTimeout(() => {
          router.push('/admin-TC25');
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error('Create failed:', errorData);
        setError(`Failed to create post: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error during create:', error);
      setError(`Network error: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back button and Action buttons */}
        <div className="flex justify-between items-center mb-8">
          <Link 
            href="/admin-TC25" 
            className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            ← Back to Admin
          </Link>
          <div className="flex gap-3">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={`px-6 py-3 rounded-lg transition-all duration-300 shadow-lg inline-flex items-center gap-2 ${
                showPreview 
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' 
                  : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700'
              } text-white`}
            >
              <Eye className="h-5 w-5" />
              {showPreview ? 'Edit Mode' : 'Preview Mode'}
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-6 py-3 rounded-lg hover:from-orange-700 hover:to-red-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Creating...' : 'Create Post'}
            </button>
          </div>
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
        <div className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700 mb-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Post Details
          </h2>
          
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
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
              <label className="block text-gray-300 text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none resize-none"
                rows="3"
                placeholder="Enter post excerpt..."
              />
            </div>

            {/* Article Date */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Article Date
              </label>
              <input
                type="date"
                value={articleDate}
                onChange={(e) => setArticleDate(e.target.value)}
                className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
              />
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Featured Image
              </label>
              
              {image ? (
                <div className="space-y-4">
                  <div className="relative inline-block">
                    <img 
                      src={image} 
                      alt="Featured" 
                      className="w-32 h-32 object-cover rounded-lg border border-slate-600"
                    />
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer inline-flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload
                    </label>
                    <button
                      onClick={() => setImage('')}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors inline-flex items-center gap-2"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg border-2 border-dashed border-slate-600 hover:border-blue-400 transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <Upload className="h-5 w-5" />
                    {uploading ? 'Uploading...' : 'Upload Featured Image'}
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Article Content */}
        <article className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Article Content
            </h2>
            <div className="flex items-center gap-2">
              <div className="text-xs text-gray-400">
                {showPreview ? 'Preview Mode' : 'Edit Mode'}
              </div>
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2 ${
                  showPreview 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-slate-700 hover:bg-slate-600'
                } text-white`}
              >
                <Eye className="h-4 w-4" />
                {showPreview ? 'Edit' : 'Preview'}
              </button>
            </div>
          </div>

          {showPreview ? (
            <div className="bg-slate-700 p-6 rounded-lg min-h-[400px]">
              <div className="mb-4 p-3 bg-slate-600 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Article Preview</h3>
                <div className="text-sm text-gray-300">
                  <strong>Title:</strong> {title || 'Untitled'}
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Excerpt:</strong> {excerpt || 'No excerpt provided'}
                </div>
                <div className="text-sm text-gray-300">
                  <strong>Date:</strong> {articleDate}
                </div>
                {image && (
                  <div className="text-sm text-gray-300">
                    <strong>Image:</strong> <span className="text-blue-400">{image}</span>
                    <div className="mt-2">
                      <img 
                        src={image} 
                        alt="Featured" 
                        className="w-32 h-20 object-cover rounded border border-slate-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="prose prose-lg max-w-none prose-invert prose-headings:text-cyan-400 prose-a:text-cyan-400 prose-strong:text-white prose-code:text-cyan-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700">
                <style jsx>{`
                  .prose span[style*="font-size"] { 
                    color: #22d3ee !important;
                    font-weight: 500;
                  }
                  .prose h1, .prose h2, .prose h3, .prose h4, .prose h5, .prose h6 {
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                  }
                  .prose p {
                    margin-bottom: 1em;
                    line-height: 1.7;
                  }
                  .prose ul, .prose ol {
                    margin-bottom: 1em;
                  }
                  .prose li {
                    margin-bottom: 0.5em;
                  }
                  .prose a {
                    text-decoration: underline;
                  }
                  .prose a:hover {
                    color: #67e8f9;
                  }
                `}</style>
                
                {/* Article Title Preview */}
                {title && (
                  <h1 className="text-3xl font-bold text-cyan-400 mb-4 border-b border-slate-600 pb-2">
                    {title}
                  </h1>
                )}
                
                {/* Article Excerpt Preview */}
                {excerpt && (
                  <div className="text-lg text-gray-300 mb-6 italic border-l-4 border-cyan-400 pl-4">
                    {excerpt}
                  </div>
                )}
                
                {/* Article Content Preview */}
                {content ? (
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                ) : (
                  <div className="text-gray-400 italic">No content to preview. Start writing to see your preview here.</div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg">
              <style jsx>{`
                .ql-editor {
                  font-size: 18px !important;
                  line-height: 1.6 !important;
                }
                .ql-editor .ql-align-center {
                  text-align: center !important;
                }
                .ql-editor .ql-align-right {
                  text-align: right !important;
                }
                .ql-editor .ql-align-justify {
                  text-align: justify !important;
                }
                .ql-toolbar {
                  border-top-left-radius: 8px;
                  border-top-right-radius: 8px;
                }
                .ql-container {
                  border-bottom-left-radius: 8px;
                  border-bottom-right-radius: 8px;
                }
              `}</style>
              <div>
                <div className="text-xs text-gray-500 mb-2">
                  Editor loaded. Content length: {content.length}
                </div>
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={(value) => {
                    console.log('Content changed, length:', value.length);
                    setContent(value);
                  }}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Start writing your article here..."
                  style={{ 
                    minHeight: '400px',
                    backgroundColor: 'white'
                  }}
                />
              </div>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}