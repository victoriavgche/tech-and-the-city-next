'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditArticlePage({ params }) {
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    date: '',
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load article data
    const loadArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${params.slug}`);
        if (response.ok) {
          const article = await response.json();
          setFormData({
            title: article.title || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            date: article.date || '',
            image: article.image || ''
          });
          if (article.image) {
            setImagePreview(article.image);
          }
        }
      } catch (error) {
        console.error('Error loading article:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [params.slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/articles/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Article updated successfully!');
        router.push(`/articles/${params.slug}`);
      } else {
        alert('Error updating article');
      }
    } catch (error) {
      alert('Error updating article');
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

  if (isLoading) {
    return (
      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 mb-4">Loading...</div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container py-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 bg-gradient-to-br from-white/95 to-purple-50/95 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-purple-200">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-800 to-indigo-800 bg-clip-text text-transparent mb-2">Edit Article</h1>
          <p className="text-slate-600">Edit and update your article content</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                required
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
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                required
              ></textarea>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
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
                    Upload a new image file (JPG, PNG, GIF) or use URL below
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
                rows="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900"
                placeholder="Write your article content in Markdown..."
              />
              <p className="text-sm text-gray-500 mt-2">
                Markdown Tips: # H1, ## H2, **bold**, *italic*, [link](url), ![image](url)
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg"
              >
                {isSubmitting ? 'Updating...' : 'Update Article'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push(`/articles/${params.slug}`)}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                View Article
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/admin')}
                className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Back to Admin
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

