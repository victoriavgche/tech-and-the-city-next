'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, X, Eye, Calendar, MapPin, Clock } from 'lucide-react';
import Link from 'next/link';

export default function NewEvent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
    city: '',
    type: 'tech',
    attendees: '',
    status: 'upcoming',
    image: '🎬',
    color: 'from-blue-600 to-purple-600',
    link: '#',
    media: {
      type: 'none',
      url: '',
      thumbnail: '',
      uploadMethod: 'url' // 'url' or 'upload'
    },
    isDraft: false
  });

  // Helper function to format date for display
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0]; // YYYY-MM-DD format
    } catch {
      return '';
    }
  };

  // Helper function to format time for display
  const formatTimeForDisplay = (timeString) => {
    if (!timeString) return '';
    try {
      // Handle various time formats
      if (timeString.includes(':')) {
        const [hours, minutes] = timeString.split(':');
        const hour24 = parseInt(hours);
        if (timeString.toLowerCase().includes('pm') && hour24 < 12) {
          return `${hour24 + 12}:${minutes.replace(/\D/g, '')}`;
        } else if (timeString.toLowerCase().includes('am') && hour24 === 12) {
          return `00:${minutes.replace(/\D/g, '')}`;
        } else {
          return `${hours}:${minutes.replace(/\D/g, '')}`;
        }
      }
      return timeString;
    } catch {
      return timeString;
    }
  };

  // Helper function to format date for storage
  const formatDateForStorage = (dateInput) => {
    if (!dateInput) return '';
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch {
      return dateInput;
    }
  };

  // Helper function to format time for storage
  const formatTimeForStorage = (timeInput) => {
    if (!timeInput) return '';
    try {
      // Keep 24-hour format without AM/PM
      const [hours, minutes] = timeInput.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return timeInput;
    }
  };

  // Helper function to convert 24-hour to 12-hour format for display
  const convertTo12Hour = (time24) => {
    if (!time24) return '';
    try {
      const [hours, minutes] = time24.split(':');
      const hour24 = parseInt(hours);
      const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
      const ampm = hour24 >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${ampm}`;
    } catch {
      return time24;
    }
  };

  const eventTypes = [
    { value: 'tech', label: 'Tech Events' },
    { value: 'art', label: 'Cultural Events' },
    { value: 'science', label: 'Science Events' }
  ];

  const eventColors = [
    { value: 'from-blue-600 to-purple-600', label: 'Blue to Purple' },
    { value: 'from-purple-600 to-pink-600', label: 'Purple to Pink' },
    { value: 'from-green-600 to-teal-600', label: 'Green to Teal' },
    { value: 'from-orange-600 to-red-600', label: 'Orange to Red' },
    { value: 'from-yellow-600 to-orange-600', label: 'Yellow to Orange' },
    { value: 'from-indigo-600 to-purple-600', label: 'Indigo to Purple' }
  ];

  const eventEmojis = [
    '🎬', '🎨', '🏙️', '🔬', '⛓️', '🎭', '💻', '🚀', '🎪', '🎯'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          location: `${formData.venue}${formData.city ? `, ${formData.city}` : ''}`,
          date: formatDateForStorage(formData.date),
          time: formatTimeForStorage(formData.time),
          attendees: 0, // Default value since field is removed
          isDraft: saveAsDraft
        }),
      });

      if (response.ok) {
        if (saveAsDraft) {
          router.push('/admin-TC25?tab=events&filter=draft');
        } else {
          router.push('/admin-TC25?tab=events');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to create event');
      }
    } catch (error) {
      console.error('Error creating event:', error);
      setError('Failed to create event');
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

  const handleFileUpload = async (file) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'video/ogg'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Allowed: JPEG, PNG, GIF, WebP, MP4, WebM, OGG');
      return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File too large. Maximum size: 10MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        // Auto-detect media type based on file
        const isVideo = file.type.startsWith('video/');
        setFormData(prev => ({
          ...prev,
          media: {
            type: isVideo ? 'video' : 'image',
            url: result.url,
            fileName: result.fileName,
            uploadMethod: 'upload'
          }
        }));
        setUploadProgress(100);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setError('Upload failed');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 py-8">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin-TC25?tab=events"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors text-base font-medium mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Events
          </Link>
          <h1 className="text-4xl font-bold text-white">Create New Event</h1>
        </div>

        {/* Form */}
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
                placeholder="Enter event title"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                Description *
              </label>
              <div className="border border-gray-600 rounded-lg overflow-hidden bg-gray-800/50">
                <div className="border-b border-gray-600 p-2 bg-gray-700/50">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => document.execCommand('bold')}
                      className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded text-white"
                      title="Bold"
                    >
                      <strong>B</strong>
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand('italic')}
                      className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded text-white"
                      title="Italic"
                    >
                      <em>I</em>
                    </button>
                    <button
                      type="button"
                      onClick={() => document.execCommand('underline')}
                      className="px-3 py-1 text-sm bg-gray-600 hover:bg-gray-500 rounded text-white"
                      title="Underline"
                    >
                      <u>U</u>
                    </button>
                  </div>
                </div>
                <div
                  id="description"
                  contentEditable
                  dangerouslySetInnerHTML={{ __html: formData.description }}
                  onInput={(e) => setFormData({
                    ...formData,
                    description: e.target.innerHTML
                  })}
                  className="w-full px-4 py-3 min-h-[120px] text-white focus:outline-none"
                  style={{ 
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                  data-placeholder="Enter event description..."
                />
              </div>
              <style jsx>{`
                [contenteditable]:empty:before {
                  content: attr(data-placeholder);
                  color: #9ca3af;
                  pointer-events: none;
                }
              `}</style>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
                  style={{ colorScheme: 'dark' }}
                  lang="en-US"
                />
              </div>
            </div>

            {/* Venue and City */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-300 mb-2">
                  Venue *
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
                  placeholder="e.g., Odeon of Herodes Atticus"
                />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-300 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
                  placeholder="e.g., Athens"
                />
              </div>
            </div>


            {/* Event Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-2">
                Event Type
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
              >
                {eventTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>


            {/* Link */}
            <div>
              <label htmlFor="link" className="block text-sm font-medium text-gray-300 mb-2">
                Event Link
              </label>
              <input
                type="url"
                id="link"
                name="link"
                value={formData.link}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
                placeholder="https://example.com/event"
              />
            </div>

            {/* Simple Media Upload */}
            <div>
              <label htmlFor="fileUpload" className="block text-sm font-medium text-gray-300 mb-2">
                Event Media (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors">
                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*,video/*"
                  onChange={(e) => handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <label htmlFor="fileUpload" className="cursor-pointer">
                  <div className="text-gray-400 mb-2">
                    {uploading ? (
                      <div className="space-y-2">
                        <div className="text-blue-400">Uploading...</div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl mb-2">📁</div>
                        <div className="text-sm">
                          Click to upload or drag and drop
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Images: JPEG, PNG, GIF, WebP • Videos: MP4, WebM, OGG (max 10MB)
                        </div>
                      </div>
                    )}
                  </div>
                </label>
              </div>
              {formData.media.fileName && (
                <div className="mt-2 text-sm text-green-400">
                  ✓ Uploaded: {formData.media.fileName}
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <p className="text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSaveAsDraft(false)}
                className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg font-semibold inline-flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {isSubmitting ? (saveAsDraft ? 'Saving...' : 'Creating...') : 'Publish Event'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                onClick={() => setSaveAsDraft(true)}
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg font-semibold inline-flex items-center justify-center gap-2"
              >
                <Save className="h-5 w-5" />
                {isSubmitting ? (saveAsDraft ? 'Saving...' : 'Creating...') : 'Save as Draft'}
              </button>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-all duration-300 shadow-lg font-semibold inline-flex items-center justify-center gap-2"
              >
                <Eye className="h-5 w-5" />
                {showPreview ? 'Hide Preview' : 'Preview'}
              </button>
              <Link
                href="/admin-TC25?tab=events"
                className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 shadow-lg font-semibold inline-flex items-center justify-center gap-2"
              >
                <X className="h-5 w-5" />
                Cancel
              </Link>
            </div>
          </form>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Event Preview</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Event Preview Card */}
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Event Visual */}
                  <div className="lg:w-1/3">
                    <div className={`aspect-[16/9] bg-gradient-to-br ${formData.color || 'from-blue-600 to-purple-600'} rounded-lg flex items-center justify-center text-white relative overflow-hidden`}>
                      {formData.media && formData.media.type !== 'none' && formData.media.url ? (
                        <div className="w-full h-full relative">
                          {formData.media.type === 'image' ? (
                            <img
                              src={formData.media.url}
                              alt={formData.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={formData.media.url}
                              className="w-full h-full object-cover"
                              poster={formData.media.thumbnail || ''}
                              muted
                            />
                          )}
                          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <div className="text-center z-10">
                              <div className="text-5xl mb-2">{formData.image || '🎬'}</div>
                              <p className="text-sm font-semibold uppercase tracking-wide">{formData.type}</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center z-10">
                          <div className="text-5xl mb-2">{formData.image || '🎬'}</div>
                          <p className="text-sm font-semibold uppercase tracking-wide">{formData.type}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Event Info */}
                  <div className="lg:w-2/3">
                    <div className="flex flex-col h-full">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-3">
                        {formData.title || 'Event Title'}
                      </h2>
                      <div 
                        className="text-gray-300 mb-4 flex-grow"
                        dangerouslySetInnerHTML={{ __html: formData.description || 'Event description will appear here...' }}
                      />
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-gray-400">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm">{formatDateForStorage(formData.date) || 'Date not set'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span className="text-sm">{formData.time ? convertTo12Hour(formData.time) : 'Time not set'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">
                            {formData.venue && formData.city 
                              ? `${formData.venue}, ${formData.city}`
                              : formData.venue || 'Location not set'
                            }
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <div 
                          className="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg font-medium flex items-center gap-2 cursor-pointer hover:bg-gray-700 transition-colors"
                          onClick={() => setShowEventDetails(!showEventDetails)}
                        >
                          Learn More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      
                      {showEventDetails && (
                        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
                          <h4 className="text-lg font-semibold text-white mb-3">Event Details</h4>
                          <div className="space-y-3 text-gray-300">
                            <div>
                              <span className="font-medium text-gray-200">Description:</span>
                              <div 
                                className="mt-1 prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: formData.description }}
                              />
                            </div>
                            <div>
                              <span className="font-medium text-gray-200">Date & Time:</span>
                              <p className="mt-1">{formData.date} at {formData.time ? convertTo12Hour(formData.time) : 'Time not set'}</p>
                            </div>
                            <div>
                              <span className="font-medium text-gray-200">Location:</span>
                              <p className="mt-1">{formData.venue}, {formData.city}</p>
                            </div>
                            {formData.media && formData.media.type !== 'none' && (
                              <div>
                                <span className="font-medium text-gray-200">Media:</span>
                                <p className="mt-1 capitalize">{formData.media.type}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
