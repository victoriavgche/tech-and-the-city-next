'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Save, ArrowLeft, Eye, AlertCircle, Bold, Italic, List, ListOrdered, Quote, Code, Link as LinkIcon, Heading1, Heading2, Heading3, Type, Image, Video, Upload, X, Underline, Strikethrough, Palette, Highlighter, AlignLeft, AlignCenter, AlignRight, AlignJustify, Minus, Plus } from 'lucide-react';
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
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image');
  const [mediaAlt, setMediaAlt] = useState('');
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [textColor, setTextColor] = useState('#ffffff');
  const [highlightColor, setHighlightColor] = useState('#ffff00');

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
      console.log('Saving post:', params.slug);
      console.log('Content length:', content.length);
      
      const response = await fetch(`/api/admin/posts/${params.slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const responseData = await response.json();
      console.log('Response:', responseData);

      if (response.ok) {
        setSuccess(`Post updated successfully! (${responseData.size} characters)`);
        setTimeout(() => {
          router.push('/admin-TC25');
        }, 2000);
      } else {
        console.error('Save failed:', responseData);
        setError(`Failed to update post: ${responseData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      setError(`Network error: ${error.message}`);
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
    underline: () => insertText('<u>', '</u>', 'underlined text'),
    strikethrough: () => insertText('~~', '~~', 'strikethrough text'),
    heading1: () => insertText('\n# ', '\n', 'Heading 1'),
    heading2: () => insertText('\n## ', '\n', 'Heading 2'),
    heading3: () => insertText('\n### ', '\n', 'Heading 3'),
    quote: () => insertText('\n> ', '\n', 'Quote text'),
    code: () => insertText('`', '`', 'code'),
    codeBlock: () => insertText('\n```\n', '\n```\n', 'code block'),
    link: () => {
      setShowLinkModal(true);
    },
    superLink: () => {
      setShowLinkModal(true);
    },
    list: () => insertText('\n- ', '\n', 'List item'),
    orderedList: () => insertText('\n1. ', '\n', 'Numbered item'),
    horizontalRule: () => insertText('\n---\n', '', ''),
    textColor: (color) => insertText(`<span style="color: ${color}">`, '</span>', 'colored text'),
    highlight: (color) => insertText(`<mark style="background-color: ${color}">`, '</mark>', 'highlighted text'),
    alignLeft: () => insertText('\n<div style="text-align: left;">\n', '\n</div>\n', 'left-aligned text'),
    alignCenter: () => insertText('\n<div style="text-align: center;">\n', '\n</div>\n', 'center-aligned text'),
    alignRight: () => insertText('\n<div style="text-align: right;">\n', '\n</div>\n', 'right-aligned text'),
    alignJustify: () => insertText('\n<div style="text-align: justify;">\n', '\n</div>\n', 'justified text'),
    image: () => {
      setMediaType('image');
      setShowMediaModal(true);
    },
    video: () => {
      setMediaType('video');
      setShowMediaModal(true);
    }
  };

  const handleTextareaChange = (e) => {
    setContent(e.target.value);
    setCursorPosition(e.target.selectionStart);
  };

  const handleMediaInsert = () => {
    if (!mediaUrl.trim()) {
      setError('Please enter a media URL');
      return;
    }

    let mediaMarkdown = '';
    if (mediaType === 'image') {
      mediaMarkdown = `![${mediaAlt || 'Image'}](${mediaUrl})`;
    } else if (mediaType === 'video') {
      mediaMarkdown = `<video controls>\n  <source src="${mediaUrl}" type="video/mp4">\n  Your browser does not support the video tag.\n</video>`;
    }

    const textarea = document.getElementById('markdown-editor');
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + '\n' + mediaMarkdown + '\n' + content.substring(start);
    setContent(newContent);

    // Close modal and reset
    setShowMediaModal(false);
    setMediaUrl('');
    setMediaAlt('');
    setError('');

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + mediaMarkdown.length + 2, start + mediaMarkdown.length + 2);
    }, 0);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setMediaUrl(result.url);
        setMediaAlt(file.name);
        setError('');
      } else {
        setError(`Upload failed: ${result.error}`);
      }
    } catch (error) {
      setError(`Upload error: ${error.message}`);
    }
  };

  const handleLinkInsert = () => {
    if (!linkUrl.trim() || !linkText.trim()) {
      setError('Please enter both link text and URL');
      return;
    }

    const linkMarkdown = `[${linkText}](${linkUrl})`;
    const textarea = document.getElementById('markdown-editor');
    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + linkMarkdown + content.substring(start);
    setContent(newContent);

    // Close modal and reset
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
    setError('');

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + linkMarkdown.length, start + linkMarkdown.length);
    }, 0);
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
              <button
                onClick={formatText.underline}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Underline (Ctrl+U)"
              >
                <Underline className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.strikethrough}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Strikethrough"
              >
                <Strikethrough className="h-4 w-4" />
              </button>
              
              <div className="w-px h-8 bg-slate-600 mx-1"></div>
              
              {/* Text Colors */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => formatText.textColor(textColor)}
                  className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                  title="Text Color"
                >
                  <Palette className="h-4 w-4" />
                </button>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
                  title="Choose text color"
                />
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => formatText.highlight(highlightColor)}
                  className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                  title="Highlight"
                >
                  <Highlighter className="h-4 w-4" />
                </button>
                <input
                  type="color"
                  value={highlightColor}
                  onChange={(e) => setHighlightColor(e.target.value)}
                  className="w-8 h-8 rounded border border-slate-600 cursor-pointer"
                  title="Choose highlight color"
                />
              </div>
              
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
              
              {/* Alignment */}
              <button
                onClick={formatText.alignLeft}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Align Left"
              >
                <AlignLeft className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.alignCenter}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Align Center"
              >
                <AlignCenter className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.alignRight}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Align Right"
              >
                <AlignRight className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.alignJustify}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Justify"
              >
                <AlignJustify className="h-4 w-4" />
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
                title="Inline Code"
              >
                <Code className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.codeBlock}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Code Block"
              >
                <Type className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.horizontalRule}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Horizontal Rule"
              >
                <Minus className="h-4 w-4" />
              </button>
              
              <div className="w-px h-8 bg-slate-600 mx-1"></div>
              
              {/* Links */}
              <button
                onClick={formatText.link}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Insert Link"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.superLink}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Super Link"
              >
                <Plus className="h-4 w-4" />
              </button>
              
              <div className="w-px h-8 bg-slate-600 mx-1"></div>
              
              {/* Media */}
              <button
                onClick={formatText.image}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Insert Image"
              >
                <Image className="h-4 w-4" />
              </button>
              <button
                onClick={formatText.video}
                className="p-2 bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors"
                title="Insert Video"
              >
                <Video className="h-4 w-4" />
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

        {/* Media Insert Modal */}
        {showMediaModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Insert {mediaType === 'image' ? 'Image' : 'Video'}
                </h2>
                <button
                  onClick={() => setShowMediaModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Media Type Toggle */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setMediaType('image')}
                    className={`flex-1 p-3 rounded-lg transition-colors ${
                      mediaType === 'image'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    <Image className="h-5 w-5 mx-auto mb-1" />
                    Image
                  </button>
                  <button
                    onClick={() => setMediaType('video')}
                    className={`flex-1 p-3 rounded-lg transition-colors ${
                      mediaType === 'video'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    <Video className="h-5 w-5 mx-auto mb-1" />
                    Video
                  </button>
                </div>

                {/* URL Input */}
                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    {mediaType === 'image' ? 'Image' : 'Video'} URL
                  </label>
                  <input
                    type="url"
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder={`Enter ${mediaType} URL...`}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Alt Text for Images */}
                {mediaType === 'image' && (
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Alt Text (optional)
                    </label>
                    <input
                      type="text"
                      value={mediaAlt}
                      onChange={(e) => setMediaAlt(e.target.value)}
                      placeholder="Describe the image..."
                      className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                    />
                  </div>
                )}

                {/* File Upload Option */}
                <div className="border-t border-slate-600 pt-4">
                  <label className="block text-gray-300 text-sm mb-2">
                    Or upload a file:
                  </label>
                  <input
                    type="file"
                    accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileUpload}
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="text-gray-400 text-xs mt-2">
                    Note: File uploads will be saved to /uploads/ directory
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleMediaInsert}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Insert {mediaType === 'image' ? 'Image' : 'Video'}
                  </button>
                  <button
                    onClick={() => setShowMediaModal(false)}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Link Insert Modal */}
        {showLinkModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Insert Link</h2>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">Link Text</label>
                  <input
                    type="text"
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    placeholder="Enter link text..."
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">URL</label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full bg-slate-700 text-white px-4 py-3 rounded-lg border border-slate-600 focus:border-blue-400 focus:outline-none"
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={handleLinkInsert}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg inline-flex items-center justify-center gap-2"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Insert Link
                  </button>
                  <button
                    onClick={() => setShowLinkModal(false)}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
