import { NextResponse } from 'next/server';
import { getEntry, listEntries, writeEntry, slugify } from '@/lib/content/markdown';
import { validateEvent, ValidationError } from '@/lib/validation/admin';

export async function GET() {
  try {
    const events = await listEntries('event');
    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to load events', error);
    return NextResponse.json({ error: 'Failed to load events' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const slug = slugify(payload.slug || payload.title || '');
    const parsed = validateEvent({
      ...payload,
      slug,
    });

    const { body, ...frontMatter } = parsed;

    const existing = await getEntry('event', frontMatter.slug);
    if (existing) {
      return NextResponse.json({ error: 'Event with this slug already exists' }, { status: 409 });
    }

    const normalisedSlug = await writeEntry({
      type: 'event',
      slug: frontMatter.slug,
      data: frontMatter,
      body,
      commitMessage: `Create event: ${frontMatter.title}`,
    });

    return NextResponse.json({ success: true, slug: normalisedSlug }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Failed to create event', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
