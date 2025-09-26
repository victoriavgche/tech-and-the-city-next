'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import '../../components/analytics.js';

export default function Events() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const handleEventClick = (eventTitle, action) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.trackClick('event_link', `/events`, {
        event: eventTitle,
        action: action,
        position: 'events_page'
      });
    }
  };

  const events = [
    {
      id: 1,
      title: "AI Night at Ciné Paris",
      description: "Endeavor's elite meet-up featuring Greek tech minds from around the world gathered under history's shadow to debate about AI and the ownership of creation.",
      date: "September 10, 2024",
      time: "7:00 PM",
      location: "Ciné Paris, Athens",
      type: "tech",
      attendees: 120,
      status: "past",
      image: "🎬",
      color: "from-blue-600 to-purple-600",
      link: "#"
    },
    {
      id: 2,
      title: "Digital Art & Innovation Summit",
      description: "A deep dive into how technology is reshaping cultural expression and creative industries. Panel discussion with leading innovators in digital arts and cultural tech.",
      date: "October 15, 2024",
      time: "6:30 PM",
      location: "Benaki Museum, Athens",
      type: "art",
      attendees: 200,
      status: "upcoming",
      image: "🎨",
      color: "from-purple-600 to-pink-600",
      link: "#"
    },
    {
      id: 3,
      title: "Smart Cities & Sustainability Conference",
      description: "Annual conference bringing together urban planners, tech leaders, and policy makers to discuss the future of connected cities and sustainable urban development.",
      date: "November 20-22, 2024",
      time: "9:00 AM",
      location: "Athens Convention Centre",
      type: "tech",
      attendees: 500,
      status: "upcoming",
      image: "🏙️",
      color: "from-green-600 to-teal-600",
      link: "#"
    },
    {
      id: 4,
      title: "Science Innovation & Startup Pitch",
      description: "Local startups present their innovative solutions to a panel of investors and industry experts. Perfect opportunity for networking and discovering the next big thing.",
      date: "December 5, 2024",
      time: "8:00 PM",
      location: "Impact Hub Athens",
      type: "science",
      attendees: 150,
      status: "upcoming",
      image: "🔬",
      color: "from-orange-600 to-red-600",
      link: "#"
    },
    {
      id: 5,
      title: "Blockchain & Crypto Meetup",
      description: "Exploring the latest developments in blockchain technology and cryptocurrency markets with industry experts and early adopters.",
      date: "August 25, 2024",
      time: "7:30 PM",
      location: "The Hub Athens",
      type: "tech",
      attendees: 80,
      status: "past",
      image: "⛓️",
      color: "from-yellow-600 to-orange-600",
      link: "#"
    },
    {
      id: 6,
      title: "Art & Technology Fusion Workshop",
      description: "Hands-on workshop exploring the intersection of traditional art forms with cutting-edge technology, including VR, AR, and digital installations.",
      date: "July 18, 2024",
      time: "2:00 PM",
      location: "Onassis Cultural Centre",
      type: "art",
      attendees: 60,
      status: "past",
      image: "🎭",
      color: "from-indigo-600 to-purple-600",
      link: "#"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Events', count: events.length },
    { id: 'upcoming', label: 'Upcoming', count: events.filter(e => e.status === 'upcoming').length },
    { id: 'past', label: 'Past Events', count: events.filter(e => e.status === 'past').length },
    { id: 'art', label: 'Art', count: events.filter(e => e.type === 'art').length },
    { id: 'tech', label: 'Tech', count: events.filter(e => e.type === 'tech').length },
    { id: 'science', label: 'Science', count: events.filter(e => e.type === 'science').length }
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : selectedFilter === 'upcoming'
    ? events.filter(event => event.status === 'upcoming')
    : selectedFilter === 'past'
    ? events.filter(event => event.status === 'past')
    : events.filter(event => event.type === selectedFilter);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Events</h1>
            <p className="text-gray-300 text-lg">
              Discover upcoming events, network with like-minded people, and stay ahead of the latest trends in technology and innovation.
            </p>
          </div>
        </header>

        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedFilter === filter.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {filteredEvents.map((event) => (
            <div key={event.id} className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border transition-all duration-300 ${
              event.status === 'past' 
                ? 'border-gray-600/50 hover:border-gray-500/50 opacity-75' 
                : 'border-white/20 hover:border-white/30'
            }`}>
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className={`aspect-[4/3] bg-gradient-to-br ${event.color} rounded-lg flex items-center justify-center text-white relative overflow-hidden ${
                    event.status === 'past' ? 'opacity-80' : ''
                  }`}>
                    <div className="text-center z-10">
                      <div className="text-5xl mb-2">{event.image}</div>
                      <p className="text-sm font-semibold uppercase tracking-wide">{event.type}</p>
                    </div>
                    <div className={`absolute top-2 right-2 backdrop-blur-sm rounded-full px-2 py-1 ${
                      event.status === 'past' 
                        ? 'bg-gray-600/50' 
                        : 'bg-black/20'
                    }`}>
                      <span className="text-xs font-medium">{event.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="lg:w-2/3">
                  <div className="flex flex-col h-full">
                    <h2 className="text-2xl font-bold text-white mb-3">{event.title}</h2>
                    <p className="text-gray-300 mb-4 flex-grow">{event.description}</p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm">{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Users className="h-4 w-4" />
                        <span className="text-sm">{event.attendees} expected attendees</span>
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
                          <button 
                            className="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg hover:border-gray-500 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2"
                            onClick={() => handleEventClick(event.title, 'learn_more')}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Learn More
                          </button>
                        </>
                      ) : (
                        <button 
                          className="bg-gray-600 text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-300 font-medium flex items-center gap-2"
                          onClick={() => handleEventClick(event.title, 'view_recap')}
                        >
                          <ExternalLink className="h-4 w-4" />
                          View Recap
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </main>
  );
}