'use client';

import { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import '../../components/analytics.js';

export default function Events() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);

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

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEventClick = (eventTitle, action) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackClick('event_link', `/events`, {
        event: eventTitle,
        action: action,
        position: 'events_page'
      });
      window.analytics.trackEventInterest(eventTitle, action);
    }
  };

  const handleLearnMore = (event) => {
    setSelectedEvent(event);
    setShowEventModal(true);
    handleEventClick(event.title, 'learn_more');
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackEventModal(event.title, 'open');
    }
  };

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming Events' },
    { id: 'past', label: 'Past Events' },
    { id: 'art', label: 'Art' },
    { id: 'tech', label: 'Tech' },
    { id: 'science', label: 'Science' }
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : selectedFilter === 'upcoming'
    ? events.filter(event => event.status === 'upcoming')
    : selectedFilter === 'past'
    ? events.filter(event => event.status === 'past')
    : events.filter(event => event.type === selectedFilter);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading events...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Events</h1>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    if (typeof window !== 'undefined' && window.analytics) {
                      window.analytics.trackEventFilter(filter.id, events.length);
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
              event.status === 'past' 
                ? 'border-gray-600/50 hover:border-gray-500/50' 
                : 'border-white/20 hover:border-white/30'
            }`}>
              <div className="flex flex-col gap-6">
                        <div className="w-full">
                          <div 
                            className={`aspect-[16/9] bg-gray-900 rounded-lg flex items-center justify-center text-white relative overflow-hidden`}
                          >
                            {/* Media Display */}
                            {event.media && event.media.type !== 'none' && event.media.url ? (
                              <div className="w-full h-full relative">
                                {event.media.type === 'image' ? (
                                  <img
                                    src={event.media.url}
                                    alt={event.title}
                                    className="w-full h-full object-cover brightness-100 contrast-100"
                                  />
                                ) : (
                                  <video
                                    src={event.media.url}
                                    className="w-full h-full object-cover brightness-100 contrast-100"
                                    poster={event.media.thumbnail || ''}
                                    muted
                                  />
                                )}
                              </div>
                            ) : (
                              <div className="text-center z-10">
                                <div className="text-5xl mb-2">{event.image}</div>
                                <p className="text-sm font-semibold uppercase tracking-wide">{event.type}</p>
                              </div>
                            )}
                          </div>
                        </div>
                
                <div className="w-full">
                  <div className="flex flex-col">
                    <h2 
                      className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => handleLearnMore(event)}
                    >
                      {event.title}
                    </h2>
                    
                    <div className="space-y-3 mb-6">
                      <div 
                        className="flex items-center gap-2 text-gray-200 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleLearnMore(event)}
                      >
                        <Calendar className="h-4 w-4" />
                        <span className="text-base font-medium">{event.date}</span>
                      </div>
                      <div 
                        className="flex items-center gap-2 text-gray-200 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleLearnMore(event)}
                      >
                        <Clock className="h-4 w-4" />
                        <span className="text-base font-medium">{convertTo12Hour(event.time)}</span>
                      </div>
                      <div 
                        className="flex items-center gap-2 text-gray-200 cursor-pointer hover:text-white transition-colors"
                        onClick={() => handleLearnMore(event)}
                      >
                        <MapPin className="h-4 w-4" />
                        <span className="text-base font-medium">{event.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      {event.status === 'upcoming' ? (
                        <>
                          <button 
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                            onClick={() => handleEventClick(event.title, 'register')}
                          >
                            Register Now
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Event Details Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {selectedEvent.title}
                  </h2>
                  <button
                    onClick={() => {
                      setShowEventModal(false);
                      if (typeof window !== 'undefined' && window.analytics && selectedEvent) {
                        window.analytics.trackEventModal(selectedEvent.title, 'close');
                      }
                    }}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Event Image/Media */}
                <div className="mb-6">
                  <div className={`aspect-[16/9] bg-gray-900 rounded-lg flex items-center justify-center text-white relative overflow-hidden`}>
                    {selectedEvent.media && selectedEvent.media.type !== 'none' && selectedEvent.media.url ? (
                      <div className="w-full h-full relative">
                        {selectedEvent.media.type === 'image' ? (
                          <img
                            src={selectedEvent.media.url}
                            alt={selectedEvent.title}
                            className="w-full h-full object-contain brightness-100 contrast-100"
                          />
                        ) : (
                          <video
                            src={selectedEvent.media.url}
                            className="w-full h-full object-contain brightness-100 contrast-100"
                            poster={selectedEvent.media.thumbnail || ''}
                            muted
                          />
                        )}
                      </div>
                    ) : (
                      <div className="text-center z-10">
                        <div className="text-8xl mb-4">{selectedEvent.image}</div>
                        <p className="text-lg font-semibold uppercase tracking-wide">{selectedEvent.type}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-gray-200">
                      <Calendar className="h-5 w-5 text-blue-400" />
                      <span className="text-xl font-medium">{selectedEvent.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-200">
                      <Clock className="h-5 w-5 text-blue-400" />
                      <span className="text-xl font-medium">{convertTo12Hour(selectedEvent.time)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-200">
                      <MapPin className="h-5 w-5 text-blue-400" />
                      <span className="text-xl font-medium">{selectedEvent.location}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-400">
                      <span className="text-base">Event Type:</span>
                      <span className="text-base font-medium capitalize text-gray-300">{selectedEvent.type}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-3">About This Event</h3>
                  <div 
                    className="prose prose-invert max-w-none text-gray-100 leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{ __html: selectedEvent.description }}
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-6 border-t border-gray-700">
                  {selectedEvent.status === 'upcoming' ? (
                    <>
                      <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                        Register Now
                      </button>
                      <button 
                        onClick={() => {
                          setShowEventModal(false);
                          if (typeof window !== 'undefined' && window.analytics && selectedEvent) {
                            window.analytics.trackEventModal(selectedEvent.title, 'close');
                          }
                        }}
                        className="border border-gray-600 text-gray-300 px-8 py-3 rounded-lg hover:border-gray-500 hover:text-white transition-colors duration-300 font-medium"
                      >
                        Close
                      </button>
                    </>
                  ) : (
                    <button 
                      onClick={() => {
                        setShowEventModal(false);
                        if (typeof window !== 'undefined' && window.analytics && selectedEvent) {
                          window.analytics.trackEventModal(selectedEvent.title, 'close');
                        }
                      }}
                      className="bg-gray-600 text-gray-300 px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </main>
  );
}