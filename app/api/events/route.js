import { NextResponse } from 'next/server';
import { getPublishedEvents, getEventBySlug } from '@/lib/events';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const event = await getEventBySlug(slug);
      if (!event || !event.published) {
        return NextResponse.json({ error: 'Event not found' }, { status: 404 });
      }
      return NextResponse.json(event);
    }

    const events = await getPublishedEvents();
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export const PUT = POST;
export const DELETE = POST;
