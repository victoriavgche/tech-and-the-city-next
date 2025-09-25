'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState('');
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
        setContent(data.content);
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
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        setSuccess('Post updated successfully!');
        setTimeout(() => {
          router.push('/admin-TC25');
        }, 1500);
      } else {
        setError('Failed to update post');
      }
    } catch (error) {
      setError('Failed to update post');
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
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Post</h1>
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
              {saving ? 'Saving...' : 'Save Changes'}
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
          <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
            <p className="text-green-400 font-medium">{success}</p>
          </div>
        )}

        {/* Editor */}
        <div className="bg-slate-800 rounded-lg border border-slate-700">
          <div className="p-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Markdown Editor</h2>
            <p className="text-gray-400 text-sm">Edit the markdown content of your post</p>
          </div>
          
          <div className="p-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-96 bg-slate-700 text-white p-4 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none font-mono text-sm resize-none"
              placeholder="Enter your markdown content here..."
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-white font-semibold mb-2">Markdown Tips:</h3>
          <ul className="text-gray-400 text-sm space-y-1">
            <li>• Use <code className="bg-slate-700 px-1 rounded"># Title</code> for headings</li>
            <li>• Use <code className="bg-slate-700 px-1 rounded">**bold**</code> for bold text</li>
            <li>• Use <code className="bg-slate-700 px-1 rounded">*italic*</code> for italic text</li>
            <li>• Use <code className="bg-slate-700 px-1 rounded">[link](url)</code> for links</li>
            <li>• Use <code className="bg-slate-700 px-1 rounded">![alt](image-url)</code> for images</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
