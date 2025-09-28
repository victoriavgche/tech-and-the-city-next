import { NextResponse } from 'next/server';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../../../../lib/events';
import { autoBackup } from '../../../../lib/backup-system';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      const event = getEventById(id);
      if (event) {
        return NextResponse.json(event);
      } else {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
    }
    
    const events = getAllEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const eventData = await request.json();
    
    // Validate required fields
    if (!eventData.title || !eventData.description || !eventData.date) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    const newEvent = createEvent(eventData);
    
    if (newEvent) {
      // Auto backup after event creation
      try {
        await autoBackup('Event creation');
      } catch (backupError) {
        console.error('Auto backup failed:', backupError);
      }
      
      return NextResponse.json(newEvent, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    
    const eventData = await request.json();
    const updatedEvent = updateEvent(id, eventData);
    
    if (updatedEvent) {
      // Auto backup after event update
      try {
        await autoBackup('Event update');
      } catch (backupError) {
        console.error('Auto backup failed:', backupError);
      }
      
      return NextResponse.json(updatedEvent);
    } else {
      return NextResponse.json({ error: 'Event not found or failed to update' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }
    
    const success = deleteEvent(id);
    
    if (success) {
      return NextResponse.json({ message: 'Event deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Event not found or failed to delete' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
