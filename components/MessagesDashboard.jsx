'use client';

import { useState, useEffect } from 'react';
import { Mail, User, Calendar, MessageSquare, Trash2, Eye, CheckSquare, Square } from 'lucide-react';

export default function MessagesDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [isSelecting, setIsSelecting] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/contact-submissions');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.reverse()); // Show newest first
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);
  };

  const handleDeleteMessage = async (messageIndex) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        const response = await fetch(`/api/contact-submissions/${messageIndex}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          // Remove message from state and refresh the list
          const updatedMessages = messages.filter((_, index) => index !== messageIndex);
          setMessages(updatedMessages);
          setShowModal(false);
          setSelectedMessage(null);
        } else {
          alert('Error deleting message');
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error deleting message');
      }
    }
  };

  const handleSelectMessage = (index) => {
    const newSelected = new Set(selectedMessages);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedMessages(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedMessages.size === messages.length) {
      setSelectedMessages(new Set());
    } else {
      setSelectedMessages(new Set(messages.map((_, index) => index)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedMessages.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedMessages.size} message(s)?`)) {
      try {
        // Sort indices in descending order to delete from end to beginning
        const sortedIndices = Array.from(selectedMessages).sort((a, b) => b - a);
        
        for (const index of sortedIndices) {
          const response = await fetch(`/api/contact-submissions/${index}`, {
            method: 'DELETE',
          });
          
          if (!response.ok) {
            alert(`Error deleting message at index ${index}`);
            return;
          }
        }
        
        // Refresh messages and clear selection
        await fetchMessages();
        setSelectedMessages(new Set());
        setIsSelecting(false);
      } catch (error) {
        console.error('Error deleting messages:', error);
        alert('Error deleting messages');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Mail className="h-6 w-6" />
            Contact Messages
          </h2>
          <p className="text-gray-400 mt-1">
            {messages.length} message{messages.length !== 1 ? 's' : ''} received
            {selectedMessages.size > 0 && (
              <span className="ml-2 text-cyan-400">
                • {selectedMessages.size} selected
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          {!isSelecting ? (
            <>
              <button
                onClick={() => setIsSelecting(true)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <CheckSquare className="h-4 w-4" />
                Select Messages
              </button>
              <button
                onClick={fetchMessages}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare className="h-4 w-4" />
                Refresh
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSelectAll}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                {selectedMessages.size === messages.length ? (
                  <Square className="h-4 w-4" />
                ) : (
                  <CheckSquare className="h-4 w-4" />
                )}
                {selectedMessages.size === messages.length ? 'Deselect All' : 'Select All'}
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={selectedMessages.size === 0}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete Selected ({selectedMessages.size})
              </button>
              <button
                onClick={() => {
                  setIsSelecting(false);
                  setSelectedMessages(new Set());
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No messages received yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Messages from the contact form will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`bg-slate-800 rounded-lg p-6 border transition-colors ${
              isSelecting 
                ? selectedMessages.has(index) 
                  ? 'border-cyan-400 bg-slate-800/80' 
                  : 'border-slate-700 hover:border-slate-600'
                : 'border-slate-700 hover:border-slate-600'
            }`}>
              <div className="flex justify-between items-start">
                {/* Left side - Message Info */}
                <div className="flex-1 pr-4">
                  {/* Selection Checkbox */}
                  {isSelecting && (
                    <div className="mb-3">
                      <button
                        onClick={() => handleSelectMessage(index)}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                      >
                        {selectedMessages.has(index) ? (
                          <CheckSquare className="h-5 w-5 text-cyan-400" />
                        ) : (
                          <Square className="h-5 w-5" />
                        )}
                        <span className="text-sm">Select this message</span>
                      </button>
                    </div>
                  )}
                  {/* Message Header */}
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-cyan-400" />
                      <span className="text-white font-medium">{message.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Mail className="h-3 w-3" />
                      {message.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Calendar className="h-3 w-3" />
                      {formatDate(message.timestamp)}
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-3">
                    <h3 className="text-cyan-400 font-semibold text-lg">
                      {message.subject}
                    </h3>
                  </div>

                  {/* Message Preview */}
                  <div className="mb-4">
                    <p className="text-gray-300 text-sm line-clamp-2">
                      {message.message}
                    </p>
                  </div>
                </div>

                {/* Right side - Actions */}
                {!isSelecting && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => handleViewMessage(message)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors inline-flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(index)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm transition-colors inline-flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Message Modal */}
      {showModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-lg border border-slate-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-4 text-gray-400 text-sm">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {selectedMessage.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {selectedMessage.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedMessage.timestamp)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Message Content */}
              <div className="bg-slate-700 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-3">Message:</h4>
                <div className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => handleDeleteMessage(messages.indexOf(selectedMessage))}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
