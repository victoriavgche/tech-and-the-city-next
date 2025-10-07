import connectDB from '../../../../lib/database.js';
import Event from '../../../../lib/models/Event.js';

export async function GET() {
  try {
    await connectDB();
    
    const events = await Event.find().sort({ date: 1 });
    
    return Response.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return Response.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    // Generate ID if not provided
    if (!data.id) {
      data.id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Check if ID already exists
    const existingEvent = await Event.findOne({ id: data.id });
    if (existingEvent) {
      return Response.json({ error: 'Event with this ID already exists' }, { status: 400 });
    }
    
    const event = new Event(data);
    await event.save();
    
    console.log('✅ Event created successfully:', event.id);
    
    return Response.json({ 
      success: true, 
      event,
      message: 'Event created successfully' 
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return Response.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
