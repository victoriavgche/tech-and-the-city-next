'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Plus, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (slug) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        const response = await fetch(`/api/admin/posts/${slug}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setPosts(posts.filter(post => post.slug !== slug));
        } else {
          alert('Error deleting article');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting article');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
          <Link
            href="/admin/new"
            className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            New Article
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mb-8">
          <Link
            href="/"
            className="text-cyan-400 hover:text-cyan-300 transition-colors inline-flex items-center gap-2"
          >
            ← Back to Homepage
          </Link>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div key={post.slug} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              {/* Article Image */}
              {post.image && (
                <div className="mb-4">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              
              {/* Article Info */}
              <h3 className="text-xl font-bold text-cyan-400 mb-2">{post.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="text-gray-400 text-xs mb-4">
                {new Date(post.date).toLocaleDateString()} • {post.read || '5 min'}
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Link
                  href={`/articles/${post.slug}`}
                  className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  View
                </Link>
                <Link
                  href={`/admin/edit/${post.slug}`}
                  className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(post.slug)}
                  className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors inline-flex items-center justify-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No articles found</p>
            <Link
              href="/admin/new"
              className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create First Article
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
