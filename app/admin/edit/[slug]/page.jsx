'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Save, ArrowLeft, Eye, Upload, FileText, Image, Calendar } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import για ReactQuill
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditPost() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [articleDate, setArticleDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // ReactQuill modules για rich text editing - NO SIZE OPTION
  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link']
    ],
  };

  const quillFormats = [
    'bold', 'italic', 'underline',
    'color', 'background', 'list', 'bullet', 'align',
    'link'
  ];

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);



  const fetchPost = async () => {
    try {
      console.log('Fetching post for slug:', slug);
      const response = await fetch(`/api/admin/posts/${slug}`);
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const postData = await response.json();
        console.log('Post data received:', postData);
        setPost(postData);
        setTitle(postData.title || '');
        setExcerpt(postData.excerpt || '');
        setImage(postData.image || postData.featuredImage || '');
        setArticleDate(postData.date || new Date().toISOString().split('T')[0]);
        
        // Convert Markdown to HTML for ReactQuill
        let htmlContent = '';
        if (postData.body || postData.content) {
          const content = postData.body || postData.content;
          console.log('Raw content:', content);
          
          // Simple Markdown to HTML conversion
          htmlContent = content
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
            .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
            .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`(.*?)`/g, '<code>$1</code>')
            .replace(/^- (.*$)/gim, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');
          
          // Wrap in paragraph tags if not already wrapped
          if (!htmlContent.startsWith('<')) {
            htmlContent = '<p>' + htmlContent + '</p>';
          }
          
          // Fix list items
          htmlContent = htmlContent.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
          htmlContent = htmlContent.replace(/<\/ul><ul>/g, '');
          
          console.log('Converted HTML content:', htmlContent);
        }
        
        setContent(htmlContent);
      } else {
        console.error('Failed to fetch post:', response.status);
        setError('Άρθρο δεν βρέθηκε');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Σφάλμα κατά τη φόρτωση του άρθρου');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/admin/posts/${slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          featuredImage: image,
          date: articleDate,
        }),
      });

      if (response.ok) {
        setSuccess('Post updated successfully!');
        // Update the post state to reflect changes
        setPost(prev => ({
          ...prev,
          title,
          excerpt,
          body: content,
          content: content,
          image
        }));
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

  const handleMediaUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      console.log('No files selected');
      return;
    }

    console.log(`Selected ${files.length} files`);

    const images = [];
    const videos = [];

    // Χωρίζουμε τα αρχεία σε φωτογραφίες και βίντεο
    Array.from(files).forEach(file => {
      console.log('File:', file.name, 'Type:', file.type);
      if (file.type.startsWith('image/')) {
        images.push(file);
      } else if (file.type.startsWith('video/')) {
        videos.push(file);
      }
    });

    if (images.length === 0 && videos.length === 0) {
      setError('Παρακαλώ επιλέξτε έγκυρα αρχεία εικόνας ή βίντεο');
      return;
    }

    setError('');
    setSuccess('');

    try {
      // Ανεβάζουμε μόνο την πρώτη εικόνα αν υπάρχει
      if (images.length > 0) {
        const file = images[0];
        const formData = new FormData();
        formData.append('file', file);
        
        console.log('Uploading image:', file.name);
        
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Upload successful:', data);
          setImage(data.url);
          setSuccess(`Εικόνα "${file.name}" ανέβηκε επιτυχώς!`);
        } else {
          const errorData = await response.json();
          console.error('Upload failed:', errorData);
          setError(`Αποτυχία ανεβάσματος: ${errorData.error}`);
        }
      }

      // Reset the input
      event.target.value = '';
      
    } catch (error) {
      console.error('Error uploading media:', error);
      setError(`Σφάλμα ανεβάσματος: ${error.message}`);
    }
  };

  // Function specifically for changing featured image
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log('No file selected');
      return;
    }

    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError('Το αρχείο είναι πολύ μεγάλο (μέγιστο 10MB)');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      setError('Μόνο αρχεία εικόνας επιτρέπονται');
      return;
    }

    setError(''); // Clear previous errors
    setSuccess(''); // Clear previous success messages

    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log('Sending upload request...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      console.log('Upload response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Upload successful:', data);
        setImage(data.url);
        setSuccess('Εικόνα ενημερώθηκε επιτυχώς!');
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        setError(`Αποτυχία ενημέρωσης εικόνας: ${errorData.error || 'Άγνωστο σφάλμα'}`);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setError(`Σφάλμα δικτύου: ${error.message}`);
    }

    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Φόρτωση άρθρου...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Άρθρο δεν βρέθηκε</div>
      </div>
    );
  }

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
            <Link
              href={`/articles/${slug}`}
              target="_blank"
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2"
            >
              <Eye className="h-5 w-5" />
              Article Preview
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-5 w-5" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Article header - Editable */}
        <header className="mb-8 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
          <h1 className="text-xl md:text-2xl font-semibold text-cyan-400 mb-2 leading-tight text-left">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-transparent text-xl md:text-2xl font-semibold text-cyan-400 text-left border-none outline-none focus:bg-slate-700 focus:rounded px-2 py-1"
              placeholder="Article title..."
            />
          </h1>
          <p className="text-gray-300 text-lg mb-0 text-left">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full bg-transparent text-gray-300 text-lg text-left border-none outline-none focus:bg-slate-700 focus:rounded px-2 py-1 resize-none"
              rows="2"
              placeholder="Article excerpt..."
            />
          </p>
          
          <div className="flex items-center gap-2 mt-4 text-left">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <input
              type="date"
              value={articleDate}
              onChange={(e) => setArticleDate(e.target.value)}
              className="px-3 py-2 bg-slate-700 text-gray-300 rounded border border-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </header>



        {/* Article image - Editable */}
        <div className="mb-8 bg-slate-800 rounded-lg p-4 shadow-lg border border-slate-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-300 text-sm">Featured Image</span>
            <div className="flex gap-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="change-image"
                key="change-image-input"
              />
              <button
                onClick={() => document.getElementById('change-image').click()}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm cursor-pointer inline-flex items-center gap-1 transition-colors"
              >
                <Upload className="h-3 w-3" />
                Upload
              </button>
              {image && (
                <button
                  onClick={() => setImage('')}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
          {image && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>


        {/* Article content - Rich Text Editor */}
        <article className="bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-cyan-400" />
            <h3 className="text-white font-medium">Article Content</h3>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="ml-auto px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors inline-flex items-center gap-1"
            >
              <Eye className="h-3 w-3" />
              {showPreview ? 'Edit' : 'Preview'}
            </button>
          </div>
          
          {showPreview ? (
            <div className="prose prose-lg max-w-none prose-invert prose-headings:text-cyan-400 prose-a:text-cyan-400 prose-strong:text-white prose-code:text-cyan-300 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-700 bg-slate-700 p-4 rounded-lg">
              <style jsx>{`
                .prose span[style*="font-size"] { 
                  color: #22d3ee !important;
                  font-weight: 500;
                }
              `}</style>
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
          ) : (
            <div className="bg-white rounded-lg">
              <style jsx>{`
                .ql-editor {
                  font-size: 18px !important;
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
              `}</style>
              {typeof window !== 'undefined' && (
                <ReactQuill
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Ξεκίνα να γράφεις το άρθρο σου εδώ..."
                  style={{ 
                    minHeight: '400px',
                    backgroundColor: 'white'
                  }}
                />
              )}
            </div>
          )}
        </article>


        {/* Messages */}
        {error && (
          <div className="fixed top-20 right-4 p-4 bg-red-900/20 border border-red-500/30 rounded-lg z-50">
            <p className="text-red-400 font-medium">{error}</p>
          </div>
        )}

        {success && (
          <div className="fixed top-20 right-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg z-50">
            <p className="text-green-400 font-medium">{success}</p>
          </div>
        )}
        </div>
      </main>
  );
}