import { NextResponse } from 'next/server';
import { getEntry, removeEntry, writeEntry, slugify } from '@/lib/content/markdown';
import { validateEvent, ValidationError } from '@/lib/validation/admin';

export async function GET(_request, { params }) {
  try {
    const event = await getEntry('event', params.slug);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error('Failed to load event', error);
    return NextResponse.json({ error: 'Failed to load event' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const existing = await getEntry('event', params.slug);
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const payload = await request.json();
    const slugCandidate = payload.slug || payload.title || existing.slug;

    const parsed = validateEvent({
      ...existing,
      ...payload,
      slug: slugify(slugCandidate),
      body: typeof payload.body === 'string' ? payload.body : existing.body,
      published:
        typeof payload.published === 'boolean' ? payload.published : existing.published,
    });

    const { body, ...frontMatter } = parsed;

    const normalisedSlug = await writeEntry({
      type: 'event',
      slug: frontMatter.slug,
      previousSlug: params.slug,
      data: frontMatter,
      body,
      commitMessage: `Update event: ${frontMatter.title}`,
    });

    return NextResponse.json({ success: true, slug: normalisedSlug });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Failed to update event', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const existing = await getEntry('event', params.slug);
    if (!existing) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    await removeEntry('event', params.slug, `Delete event: ${existing.title}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
