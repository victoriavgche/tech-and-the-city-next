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
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 py-1.5 text-xs border-gray-200 bg-white/80"
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
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                onClick={() => {
                  if (suggestion.type === 'article') {
                    window.location.href = '/articles/ai-a-ball-to-remember';
                  }
                }}
              >
                <div className="text-sm font-medium text-gray-900">{suggestion.title}</div>
                <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
              </button>
            ))}
          </div>
        )}

        {/* Mobile Popular Tags */}
        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-2">Popular:</div>
          <div className="flex flex-wrap gap-1">
            {popularTags.slice(0, 4).map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
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
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 py-2.5 text-sm border-gray-300 bg-white/95 backdrop-blur-sm"
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
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              onClick={() => {
                if (suggestion.type === 'article') {
                  window.location.href = '/articles/ai-a-ball-to-remember';
                }
              }}
            >
              <div className="text-sm font-medium text-gray-900">{suggestion.title}</div>
              <div className="text-xs text-gray-500 capitalize">{suggestion.type}</div>
            </button>
          ))}
        </div>
      )}

      {/* Desktop Popular Tags */}
      <div className="mt-3">
        <div className="text-xs text-gray-500 mb-2">Popular:</div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map(tag => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}