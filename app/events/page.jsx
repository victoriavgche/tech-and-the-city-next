'use client';

import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ExternalLink } from 'lucide-react';

export default function Events() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const events = [
    {
      id: 1,
      title: "Athens Tech Meetup",
      description: "Join us for an evening of networking, presentations, and discussions about the latest trends in European tech. Featuring talks on AI, blockchain, and the future of smart cities.",
      date: "March 15, 2024",
      time: "7:00 PM",
      location: "Athens, Greece",
      type: "meetup",
      attendees: 150,
      status: "upcoming",
      image: "🚀",
      color: "from-blue-600 to-purple-600",
      link: "#"
    },
    {
      id: 2,
      title: "Culture × Tech Panel",
      description: "A deep dive into how technology is reshaping cultural expression and creative industries. Panel discussion with leading innovators in digital arts and cultural tech.",
      date: "April 20, 2024",
      time: "6:30 PM",
      location: "Online Event",
      type: "panel",
      attendees: 300,
      status: "upcoming",
      image: "💡",
      color: "from-purple-600 to-blue-600",
      link: "#"
    },
    {
      id: 3,
      title: "Smart Cities Summit 2024",
      description: "Annual conference bringing together urban planners, tech leaders, and policy makers to discuss the future of connected cities and sustainable urban development.",
      date: "May 10-12, 2024",
      time: "9:00 AM",
      location: "Athens Convention Centre",
      type: "conference",
      attendees: 500,
      status: "upcoming",
      image: "🏙️",
      color: "from-green-600 to-teal-600",
      link: "#"
    },
    {
      id: 4,
      title: "Startup Pitch Night",
      description: "Local startups present their innovative solutions to a panel of investors and industry experts. Perfect opportunity for networking and discovering the next big thing.",
      date: "June 5, 2024",
      time: "8:00 PM",
      location: "Impact Hub Athens",
      type: "pitch",
      attendees: 200,
      status: "upcoming",
      image: "🎯",
      color: "from-orange-600 to-red-600",
      link: "#"
    }
  ];

  const filters = [
    { id: 'all', label: 'All Events', count: events.length },
    { id: 'meetup', label: 'Meetups', count: events.filter(e => e.type === 'meetup').length },
    { id: 'conference', label: 'Conferences', count: events.filter(e => e.type === 'conference').length },
    { id: 'panel', label: 'Panels', count: events.filter(e => e.type === 'panel').length },
    { id: 'pitch', label: 'Pitch Events', count: events.filter(e => e.type === 'pitch').length }
  ];

  const filteredEvents = selectedFilter === 'all' 
    ? events 
    : events.filter(event => event.type === selectedFilter);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-800 to-gray-600">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Events</h1>
            <p className="text-gray-300 text-lg max-w-3xl">
              Join our community of innovators, entrepreneurs, and tech enthusiasts. Discover upcoming events, 
              network with like-minded professionals, and stay ahead of the latest trends in technology and innovation.
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
            <div key={event.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 hover:border-white/30 transition-all duration-300">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="lg:w-1/3">
                  <div className={`aspect-[4/3] bg-gradient-to-br ${event.color} rounded-lg flex items-center justify-center text-white relative overflow-hidden`}>
                    <div className="text-center z-10">
                      <div className="text-5xl mb-2">{event.image}</div>
                      <p className="text-sm font-semibold uppercase tracking-wide">{event.type}</p>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
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
                      <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                        Register Now
                      </button>
                      <button className="border border-gray-600 text-gray-300 px-6 py-2 rounded-lg hover:border-gray-500 hover:text-white transition-colors duration-300 font-medium flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12">
          <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Never miss an event! Subscribe to our newsletter and be the first to know about upcoming tech events, 
              exclusive meetups, and special announcements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white bg-gray-800/50"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}