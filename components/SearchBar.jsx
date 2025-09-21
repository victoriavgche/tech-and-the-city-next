'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, onTagClick, isMobile = false }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Mock tags - in real app, these would come from your data
  const popularTags = ['AI', 'Tech', 'Art', 'Events', 'Street', 'Startups', 'Culture', 'Athens'];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  const handleTagClick = (tag) => {
    onTagClick(tag);
    setIsOpen(false);
  };

  // Mock suggestions based on query
  useEffect(() => {
    if (query.length > 1) {
      const mockSuggestions = [
        { title: 'AI στο Ηρώδειο: A Ball to Remember', type: 'article' },
        { title: 'Biotech & AI: Το μέλλον της υγείας', type: 'article' },
        { title: 'Bridgerton of AI: Η νέα εποχή', type: 'article' },
      ].filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions(mockSuggestions);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  if (isMobile) {
    return (
      <div className="relative w-full">
        <form onSubmit={handleSearch} className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 border border-white/20 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white py-2 text-sm bg-white/10 backdrop-blur-sm"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Mobile Suggestions */}
        {isOpen && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 z-50 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-white/10 border-b border-white/10 last:border-b-0"
                onClick={() => {
                  if (suggestion.type === 'article') {
                    window.location.href = '/articles/ai-a-ball-to-remember';
                  }
                }}
              >
                <div className="text-sm font-medium text-white">{suggestion.title}</div>
                <div className="text-xs text-gray-300 capitalize">{suggestion.type}</div>
              </button>
            ))}
          </div>
        )}

      </div>
    );
  }

  return (
    <div className="relative w-full">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 border border-white/20 rounded-full focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-white py-2.5 text-sm bg-white/10 backdrop-blur-sm"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Desktop Suggestions */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 hover:bg-white/10 border-b border-white/10 last:border-b-0"
              onClick={() => {
                if (suggestion.type === 'article') {
                  window.location.href = '/articles/ai-a-ball-to-remember';
                }
              }}
            >
              <div className="text-sm font-medium text-white">{suggestion.title}</div>
              <div className="text-xs text-gray-300 capitalize">{suggestion.type}</div>
            </button>
          ))}
        </div>
      )}

    </div>
  );
}