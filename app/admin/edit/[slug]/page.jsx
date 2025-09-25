'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, AlertCircle, Bold, Italic, List, ListOrdered, Quote, Code, Link as LinkIcon, Heading1, Heading2, Heading3, Type } from 'lucide-react';
import Link from 'next/link';

export default function EditPost() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

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

  // Formatting functions
  const insertText = (before, after = '', placeholder = '') => {
    const textarea = document.getElementById('markdown-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newContent = content.substring(0, start) + before + textToInsert + after + content.substring(end);
    setContent(newContent);
    
    // Set cursor position
    const newCursorPos = start + before.length + textToInsert.length + after.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatText = {
    bold: () => insertText('**', '**', 'bold text'),
    italic: () => insertText('*', '*', 'italic text'),
    heading1: () => insertText('\n# ', '\n', 'Heading 1'),
    heading2: () => insertText('\n## ', '\n', 'Heading 2'),
    heading3: () => insertText('\n### ', '\n', 'Heading 3'),
    quote: () => insertText('\n> ', '\n', 'Quote text'),
    code: () => insertText('`', '`', 'code'),
    link: () => insertText('[', '](url)', 'link text'),
    list: () => insertText('\n- ', '\n', 'List item'),
    orderedList: () => insertText('\n1. ', '\n', 'Numbered item')
  };

  const handleTextareaChange = (e) => {
    setContent(e.target.value);
    setCursorPosition(e.target.selectionStart);
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
            <h2 className="text-lg font-semibold text-white">Rich Text Editor</h2>
            <p className="text-gray-400 text-sm">Edit your article with formatting options</p>
          </div>
          
          {/* Formatting Toolbar */}
          <div className="p-3 border-b border-slate-700 bg-slate-750">
            <div className="flex flex-wrap gap-2">
              {/* Text Formatting */}
              <button
                onClick={formatText.bold}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Bold (Ctrl+B)"
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.italic}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Italic (Ctrl+I)"
              >
                <Italic className="h-4 w-4" />
              </button>
              
              <div className="w-px h-8 bg-slate-600 mx-1"></div>
              
              {/* Headings */}
              <button
                onClick={formatText.heading1}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Heading 1"
              >
                <Heading1 className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.heading2}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Heading 2"
              >
                <Heading2 className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.heading3}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Heading 3"
              >
                <Heading3 className="h-4 w-4" />
              </button>
              
              <div className="w-px h-8 bg-slate-600 mx-1"></div>
              
              {/* Lists */}
              <button
                onClick={formatText.list}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Bullet List"
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.orderedList}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Numbered List"
              >
                <ListOrdered className="h-4 w-4" />
              </button>
              
              <div className="w-px h-8 bg-slate-600 mx-1"></div>
              
              {/* Special Formatting */}
              <button
                onClick={formatText.quote}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Quote"
              >
                <Quote className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.code}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Code"
              >
                <Code className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.link}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="p-4">
            <textarea
              id="markdown-editor"
              value={content}
              onChange={handleTextareaChange}
              className="w-full h-96 bg-slate-700 text-white p-4 rounded-lg border border-slate-600 focus:border-purple-400 focus:outline-none font-mono text-sm resize-none"
              placeholder="Start writing your article... Use the toolbar above for formatting or type markdown directly."
            />
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
          <h3 className="text-white font-semibold mb-2">Formatting Options:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-gray-400 text-sm">
            <div>
              <h4 className="text-white font-medium mb-2">Toolbar Buttons:</h4>
              <ul className="space-y-1">
                <li>• <strong>Bold</strong> - Makes text <strong>bold</strong></li>
                <li>• <em>Italic</em> - Makes text <em>italic</em></li>
                <li>• <strong>H1, H2, H3</strong> - Creates headings</li>
                <li>• <strong>Lists</strong> - Bullet and numbered lists</li>
                <li>• <strong>Quote</strong> - Block quotes</li>
                <li>• <strong>Code</strong> - Inline code</li>
                <li>• <strong>Link</strong> - Create links</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Manual Markdown:</h4>
              <ul className="space-y-1">
                <li>• <code className="bg-slate-700 px-1 rounded">**text**</code> for bold</li>
                <li>• <code className="bg-slate-700 px-1 rounded">*text*</code> for italic</li>
                <li>• <code className="bg-slate-700 px-1 rounded"># Heading</code> for headings</li>
                <li>• <code className="bg-slate-700 px-1 rounded">- item</code> for lists</li>
                <li>• <code className="bg-slate-700 px-1 rounded">> quote</code> for quotes</li>
                <li>• <code className="bg-slate-700 px-1 rounded">`code`</code> for code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
