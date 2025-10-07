import { NextResponse } from 'next/server';
import { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent } from '../../../../lib/events';

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

    // Check if we're in a read-only environment (production)
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.warn('⚠️  Production environment detected - filesystem is read-only');
      return NextResponse.json({ 
        error: '🚫 Admin features are disabled in production',
        details: 'The admin panel only works in local development. In production, the filesystem is read-only. To manage content, please:\n1. Run the site locally (npm run dev)\n2. Make your changes in the admin panel\n3. Commit and push your changes to GitHub\n4. Vercel will automatically deploy the updates',
        suggestion: 'Consider using a headless CMS (like Contentful, Sanity, or Strapi) for production content management.'
      }, { status: 403 });
    }
    
    const newEvent = createEvent(eventData);
    
    if (newEvent) {
      console.log('✅ Event created successfully');
      return NextResponse.json(newEvent, { status: 201 });
    } else {
      return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json({ error: 'Failed to create event', details: error.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Check if we're in a read-only environment (production)
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.warn('⚠️  Production environment detected - filesystem is read-only');
      return NextResponse.json({ 
        error: '🚫 Admin features are disabled in production',
        details: 'The admin panel only works in local development. In production, the filesystem is read-only. To manage content, please:\n1. Run the site locally (npm run dev)\n2. Make your changes in the admin panel\n3. Commit and push your changes to GitHub\n4. Vercel will automatically deploy the updates',
        suggestion: 'Consider using a headless CMS (like Contentful, Sanity, or Strapi) for production content management.'
      }, { status: 403 });
    }
    
    const eventData = await request.json();
    const updatedEvent = updateEvent(id, eventData);
    
    if (updatedEvent) {
      console.log('✅ Event updated successfully');
      return NextResponse.json(updatedEvent);
    } else {
      return NextResponse.json({ error: 'Event not found or failed to update' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json({ error: 'Failed to update event', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 });
    }

    // Check if we're in a read-only environment (production)
    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isProduction) {
      console.warn('⚠️  Production environment detected - filesystem is read-only');
      return NextResponse.json({ 
        error: '🚫 Admin features are disabled in production',
        details: 'The admin panel only works in local development. In production, the filesystem is read-only. To manage content, please:\n1. Run the site locally (npm run dev)\n2. Make your changes in the admin panel\n3. Commit and push your changes to GitHub\n4. Vercel will automatically deploy the updates',
        suggestion: 'Consider using a headless CMS (like Contentful, Sanity, or Strapi) for production content management.'
      }, { status: 403 });
    }
    
    const success = deleteEvent(id);
    
    if (success) {
      console.log('✅ Event deleted successfully');
      return NextResponse.json({ message: 'Event deleted successfully' });
    } else {
      return NextResponse.json({ error: 'Event not found or failed to delete' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json({ error: 'Failed to delete event', details: error.message }, { status: 500 });
  }
}
