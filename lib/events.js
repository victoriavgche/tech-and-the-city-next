import { remark } from 'remark';
import html from 'remark-html';
import { getEntry, listEntries } from './content/markdown';

function toHtml(markdown = '') {
  return remark().use(html).process(markdown).then((result) => String(result));
}

function computeStatus(event) {
  const reference = event.startsAt || event.date;
  if (!reference) return 'upcoming';
  const now = new Date();
  const date = new Date(reference);
  if (Number.isNaN(date.getTime())) {
    return 'upcoming';
  }
  return date.getTime() < now.getTime() ? 'past' : 'upcoming';
}

function extractTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(11, 16);
}

function enrichEvent(rawEvent) {
  const status = computeStatus(rawEvent);
  const time = extractTime(rawEvent.startsAt || rawEvent.date);
  const primaryTag = Array.isArray(rawEvent.tags) && rawEvent.tags.length > 0 ? rawEvent.tags[0] : '';
  let derivedDate = typeof rawEvent.date === 'string' ? rawEvent.date : '';
  if (!derivedDate && rawEvent.startsAt) {
    const startsDate = new Date(rawEvent.startsAt);
    if (!Number.isNaN(startsDate.getTime())) {
      derivedDate = startsDate.toISOString().slice(0, 10);
    }
  }
  return {
    ...rawEvent,
    status,
    time,
    image: rawEvent.image || '🎉',
    type: rawEvent.type && rawEvent.type !== 'event' ? rawEvent.type : primaryTag || 'event',
    date: derivedDate,
  };
}

export async function getAllEvents() {
  const events = await listEntries('event');
  return Promise.all(
    events.map(async (event) => ({
      ...(await toEventWithHtml(event)),
    })),
  );
}

export async function getPublishedEvents() {
  const events = await getAllEvents();
  return events.filter((event) => event.published);
}

export async function getEventBySlug(slug) {
  const event = await getEntry('event', slug);
  if (!event) return null;
  return toEventWithHtml(event);
}

async function toEventWithHtml(event) {
  const description = await toHtml(event.body || '');
  return {
    ...enrichEvent(event),
    description,
  };
}
