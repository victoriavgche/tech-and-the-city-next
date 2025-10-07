'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DatabaseAdmin() {
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch posts
      const postsResponse = await fetch('/api/db/posts');
      const postsData = await postsResponse.json();
      setPosts(postsData);
      
      // Fetch events
      const eventsResponse = await fetch('/api/db/events');
      const eventsData = await eventsResponse.json();
      setEvents(eventsData);
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePostStatus = async (slug, currentStatus) => {
    try {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      const action = newStatus === 'published' ? 'publish' : 'unpublish';
      
      const response = await fetch(`/api/db/posts/${slug}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Status update successful:', result);
        
        // Refresh data
        await fetchData();
        
        alert(`Article ${action}ed successfully!`);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating article status');
    }
  };

  const handleDeletePost = async (slug) => {
    if (!confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      const response = await fetch(`/api/db/posts/${slug}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Post deleted successfully');
        
        // Refresh data
        await fetchData();
        
        alert('Article deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting article');
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }

    try {
      const response = await fetch(`/api/db/events/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Event deleted successfully');
        
        // Refresh data
        await fetchData();
        
        alert('Event deleted successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event');
    }
  };

  const publishedPosts = posts.filter(post => post.status !== 'draft');
  const draftPosts = posts.filter(post => post.status === 'draft');
  const publishedEvents = events.filter(event => event.status !== 'draft');
  const draftEvents = events.filter(event => event.status === 'draft');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-300">Loading admin panel...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4"
          >
            <svg className="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Site
          </Link>
          
          <h1 className="text-4xl font-bold text-white mb-2">
            🗄️ Database Admin Panel
          </h1>
          <p className="text-gray-400">
            Manage posts and events with MongoDB database
          </p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'posts'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Posts ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === 'events'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Events ({events.length})
          </button>
        </div>

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="space-y-8">
            {/* Published Posts */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Published Articles ({publishedPosts.length})
              </h2>
              <div className="grid gap-4">
                {publishedPosts.map((post) => (
                  <div key={post.slug} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 mb-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Slug: {post.slug}</span>
                          <span>Date: {post.date}</span>
                          <span>Status: {post.status}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleTogglePostStatus(post.slug, post.status)}
                          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                        >
                          Unpublish
                        </button>
                        <Link
                          href={`/admin/edit/${post.slug}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.slug)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Draft Posts */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Draft Articles ({draftPosts.length})
              </h2>
              <div className="grid gap-4">
                {draftPosts.map((post) => (
                  <div key={post.slug} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-400 mb-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Slug: {post.slug}</span>
                          <span>Date: {post.date}</span>
                          <span>Status: {post.status}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleTogglePostStatus(post.slug, post.status)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Publish
                        </button>
                        <Link
                          href={`/admin/edit/${post.slug}`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post.slug)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            {/* Published Events */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Published Events ({publishedEvents.length})
              </h2>
              <div className="grid gap-4">
                {publishedEvents.map((event) => (
                  <div key={event.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-400 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>ID: {event.id}</span>
                          <span>Date: {event.date}</span>
                          <span>Time: {event.time}</span>
                          <span>Type: {event.type}</span>
                          <span>Status: {event.status}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Draft Events */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">
                Draft Events ({draftEvents.length})
              </h2>
              <div className="grid gap-4">
                {draftEvents.map((event) => (
                  <div key={event.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">
                          {event.title}
                        </h3>
                        <p className="text-gray-400 mb-2">
                          {event.description}
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>ID: {event.id}</span>
                          <span>Date: {event.date}</span>
                          <span>Time: {event.time}</span>
                          <span>Type: {event.type}</span>
                          <span>Status: {event.status}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Link
                          href={`/admin/events/${event.id}/edit`}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
