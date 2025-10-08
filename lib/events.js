import fs from 'fs';
import path from 'path';

const EVENTS_FILE = path.join(process.cwd(), 'data', 'events.json');
const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Utility function to determine event status based on date
function getEventStatusFromDate(dateString) {
  try {
    // Parse the date string - handle formats like "September 10, 2024", "October 15, 2024"
    const eventDate = new Date(dateString);
    const today = new Date();
    
    // Reset time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    return eventDate < today ? 'past' : 'upcoming';
  } catch (error) {
    console.error('Error parsing event date:', dateString, error);
    // Default to upcoming if date parsing fails
    return 'upcoming';
  }
}

// Default events data
const defaultEvents = [
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
    link: "#",
    media: {
      type: "image", // "image", "video", or "none"
      url: "",
      thumbnail: "",
      uploadMethod: "url" // "url" or "upload"
    }
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
    link: "#",
    media: {
      type: "none",
      url: "",
      thumbnail: "",
      uploadMethod: "url"
    }
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
    link: "#",
    media: {
      type: "none",
      url: "",
      thumbnail: "",
      uploadMethod: "url"
    }
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
    link: "#",
    media: {
      type: "none",
      url: "",
      thumbnail: "",
      uploadMethod: "url"
    }
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
    link: "#",
    media: {
      type: "none",
      url: "",
      thumbnail: "",
      uploadMethod: "url"
    }
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
    link: "#",
    media: {
      type: "none",
      url: "",
      thumbnail: "",
      uploadMethod: "url"
    }
  }
];

// Load events data from file
export function loadEventsData() {
  try {
    if (fs.existsSync(EVENTS_FILE)) {
      const data = fs.readFileSync(EVENTS_FILE, 'utf8');
      const events = JSON.parse(data);
      
      // Automatically set status based on date ONLY if NOT a draft
      return events.map(event => ({
        ...event,
        // Preserve draft status, otherwise auto-calculate from date
        status: event.isDraft || event.status === 'draft' ? 'draft' : getEventStatusFromDate(event.date)
      }));
    }
  } catch (error) {
    console.error('Error loading events data:', error);
  }
  
  // Return default data with automatic status if file doesn't exist or error occurs
  return defaultEvents.map(event => ({
    ...event,
    status: event.isDraft || event.status === 'draft' ? 'draft' : getEventStatusFromDate(event.date)
  }));
}

// Save events data to file
export function saveEventsData(events) {
  try {
    fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving events data:', error);
    return false;
  }
}

// Get all events
export function getAllEvents() {
  return loadEventsData();
}

// Get event by ID
export function getEventById(id) {
  const events = loadEventsData();
  return events.find(event => event.id === parseInt(id));
}

// Create new event
export function createEvent(eventData) {
  const events = loadEventsData();
  const newId = Math.max(...events.map(e => e.id), 0) + 1;
  const newEvent = {
    id: newId,
    ...eventData,
    status: eventData.isDraft ? 'draft' : getEventStatusFromDate(eventData.date), // Set status based on draft flag
    isDraft: eventData.isDraft || false,
    media: eventData.media || {
      type: "none",
      url: "",
      thumbnail: "",
      uploadMethod: "url"
    }
  };
  
  events.push(newEvent);
  
  if (saveEventsData(events)) {
    return newEvent;
  }
  return null;
}

// Update event
export function updateEvent(id, eventData) {
  const events = loadEventsData();
  const eventIndex = events.findIndex(event => event.id === parseInt(id));
  
  if (eventIndex === -1) {
    return null;
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📝 UPDATE EVENT');
  console.log('Event ID:', id);
  console.log('Received isDraft:', eventData.isDraft);
  console.log('Current event status:', events[eventIndex].status);
  console.log('Current event isDraft:', events[eventIndex].isDraft);
  
  // Handle status based on draft flag or date
  const updatedEventData = { ...eventData };
  
  // If isDraft is explicitly set, use it
  if (eventData.isDraft !== undefined) {
    updatedEventData.status = eventData.isDraft ? 'draft' : getEventStatusFromDate(eventData.date || events[eventIndex].date);
    updatedEventData.isDraft = eventData.isDraft;
    console.log('Setting status based on isDraft flag:', updatedEventData.status);
  } 
  // If we're just updating other fields, preserve existing draft status
  else if (events[eventIndex].isDraft || events[eventIndex].status === 'draft') {
    updatedEventData.status = 'draft';
    updatedEventData.isDraft = true;
    console.log('Preserving existing draft status');
  }
  // Otherwise calculate from date
  else if (eventData.date) {
    updatedEventData.status = getEventStatusFromDate(eventData.date);
    updatedEventData.isDraft = false;
    console.log('Setting status based on date:', updatedEventData.status);
  }
  
  events[eventIndex] = {
    ...events[eventIndex],
    ...updatedEventData
  };
  
  console.log('Final event status:', events[eventIndex].status);
  console.log('Final event isDraft:', events[eventIndex].isDraft);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (saveEventsData(events)) {
    return events[eventIndex];
  }
  return null;
}

// Delete event
export function deleteEvent(id) {
  const events = loadEventsData();
  const filteredEvents = events.filter(event => event.id !== parseInt(id));
  
  if (saveEventsData(filteredEvents)) {
    return true;
  }
  return false;
}
