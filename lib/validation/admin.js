const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export class ValidationError extends Error {
  constructor(issues) {
    super('Validation failed');
    this.issues = issues;
  }
}

export function parseTags(input) {
  if (Array.isArray(input)) {
    return input.map((tag) => tag.trim()).filter(Boolean);
  }
  if (typeof input === 'string') {
    return input.split(',').map((tag) => tag.trim()).filter(Boolean);
  }
  return [];
}

function toBoolean(value, defaultValue = false) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    const lowered = value.toLowerCase().trim();
    if (['true', '1', 'yes'].includes(lowered)) return true;
    if (['false', '0', 'no'].includes(lowered)) return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return defaultValue;
}

function validateBase(payload) {
  const issues = [];

  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  if (!title) {
    issues.push({ field: 'title', message: 'Title is required' });
  }

  const slug = typeof payload.slug === 'string' ? payload.slug.trim() : '';
  if (!slug) {
    issues.push({ field: 'slug', message: 'Slug is required' });
  } else if (!slugRegex.test(slug)) {
    issues.push({ field: 'slug', message: 'Slug must use lowercase letters, numbers and hyphens' });
  }

  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  if (!body) {
    issues.push({ field: 'body', message: 'Content body is required' });
  }

  if (issues.length > 0) {
    throw new ValidationError(issues);
  }

  return {
    title,
    slug,
    body,
    excerpt: typeof payload.excerpt === 'string' ? payload.excerpt.trim() : '',
    date: typeof payload.date === 'string' ? payload.date : '',
    image: typeof payload.image === 'string' ? payload.image.trim() : '',
    published: toBoolean(payload.published, true),
    tags: parseTags(payload.tags),
  };
}

export function validateArticle(payload) {
  const base = validateBase(payload);
  return {
    ...base,
    type: 'article',
  };
}

export function validateEvent(payload) {
  const base = validateBase(payload);
  return {
    ...base,
    type: 'event',
    location: typeof payload.location === 'string' ? payload.location.trim() : '',
    startsAt: typeof payload.startsAt === 'string' ? payload.startsAt : '',
    endsAt: typeof payload.endsAt === 'string' ? payload.endsAt : '',
  };
}
