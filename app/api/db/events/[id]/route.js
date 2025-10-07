import connectDB from '../../../../../lib/database.js';
import Event from '../../../../../lib/models/Event.js';

export async function GET(request, { params }) {
  try {
    await connectDB();
    
    const event = await Event.findOne({ id: params.id });
    
    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }
    
    return Response.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return Response.json({ error: 'Failed to fetch event' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await connectDB();
    
    const data = await request.json();
    
    const event = await Event.findOneAndUpdate(
      { id: params.id },
      { ...data, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }
    
    console.log('✅ Event updated successfully:', event.id);
    
    return Response.json({ 
      success: true, 
      event,
      message: 'Event updated successfully' 
    });
  } catch (error) {
    console.error('Error updating event:', error);
    return Response.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    
    const event = await Event.findOneAndDelete({ id: params.id });
    
    if (!event) {
      return Response.json({ error: 'Event not found' }, { status: 404 });
    }
    
    console.log('✅ Event deleted successfully:', params.id);
    
    return Response.json({ 
      success: true, 
      message: 'Event deleted successfully' 
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return Response.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
