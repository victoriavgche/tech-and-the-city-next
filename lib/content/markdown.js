import fs from 'node:fs/promises';
import matter from 'gray-matter';
import { getAbsoluteContentDir, getContentFilePaths } from './config';
import { commitFile, deleteFile, hasGithubAccess } from './github';

async function ensureDir(type) {
  const dir = getAbsoluteContentDir(type);
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export function slugify(input) {
  return input
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

function toBoolean(value, fallback = false) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  return fallback;
}

function normaliseFrontMatter(type, slug, data) {
  const base = {
    title: data.title || '',
    slug: data.slug || slug,
    date: data.date || new Date().toISOString(),
    published: toBoolean(data.published, true),
    tags: Array.isArray(data.tags)
      ? data.tags
      : typeof data.tags === 'string' && data.tags.length > 0
        ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
    type,
  };

  if (type === 'event') {
    base.location = data.location || '';
    base.startsAt = data.startsAt || '';
    base.endsAt = data.endsAt || '';
  }

  if (data.excerpt) {
    base.excerpt = data.excerpt;
  }

  if (data.image) {
    base.image = data.image;
  }

  return base;
}

function mapStatusToPublished(status) {
  if (!status) return true;
  if (typeof status === 'string') {
    return !['draft', 'false', 'no', '0'].includes(status.toLowerCase());
  }
  return Boolean(status);
}

function parseFrontMatter(type, slug, data) {
  const published = Object.prototype.hasOwnProperty.call(data, 'published')
    ? toBoolean(data.published, mapStatusToPublished(data.status))
    : mapStatusToPublished(data.status);

  const tags = Array.isArray(data.tags)
    ? data.tags
    : typeof data.tags === 'string'
      ? data.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
      : [];

  const base = {
    title: data.title || slug,
    slug: data.slug || slug,
    date: data.date || new Date().toISOString(),
    published,
    tags,
    type,
  };

  if (data.excerpt) {
    base.excerpt = data.excerpt;
  }

  if (data.image) {
    base.image = data.image;
  }

  if (type === 'event') {
    base.location = data.location || '';
    base.startsAt = data.startsAt || '';
    base.endsAt = data.endsAt || '';
  }

  return base;
}

export async function listEntries(type) {
  const dir = await ensureDir(type);
  const files = await fs.readdir(dir);

  const entries = await Promise.all(
    files
      .filter((file) => file.endsWith('.md'))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const { data, content } = matter(await fs.readFile(`${dir}/${file}`, 'utf8'));
        const frontMatter = parseFrontMatter(type, slug, data);
        return {
          ...frontMatter,
          body: content,
        };
      }),
  );

  return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getEntry(type, slug) {
  const dir = await ensureDir(type);
  const file = `${dir}/${slug}.md`;
  try {
    const raw = await fs.readFile(file, 'utf8');
    const { data, content } = matter(raw);
    const frontMatter = parseFrontMatter(type, slug, data);
    return {
      ...frontMatter,
      body: content,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

export async function removeEntry(type, slug, commitMessage) {
  const { relativePath, absolutePath } = getContentFilePaths(type, slug);
  await fs.rm(absolutePath, { force: true });
  if (hasGithubAccess()) {
    await deleteFile({ path: relativePath, message: commitMessage });
  }
}

export async function writeEntry({
  type,
  slug,
  data,
  body,
  commitMessage,
  previousSlug,
}) {
  const normalisedSlug = slugify(slug || data.slug || data.title || 'untitled');
  const frontMatter = normaliseFrontMatter(type, normalisedSlug, { ...data, slug: normalisedSlug });
  const markdown = matter.stringify(body, frontMatter);

  const { relativePath, absolutePath } = getContentFilePaths(type, normalisedSlug);
  await ensureDir(type);
  await fs.writeFile(absolutePath, `${markdown.trim()}\n`, 'utf8');

  if (hasGithubAccess()) {
    await commitFile({
      path: relativePath,
      content: `${markdown.trim()}\n`,
      message: commitMessage,
    });
  }

  if (previousSlug && previousSlug !== normalisedSlug) {
    await removeEntry(type, previousSlug, commitMessage);
  }

  return normalisedSlug;
}
