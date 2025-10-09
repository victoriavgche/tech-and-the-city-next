import path from 'node:path';

const DEFAULT_DIRECTORIES = {
  article: 'content/articles',
  event: 'content/events',
};

function parseContentDirsEnv() {
  const value = process.env.CONTENT_DIRS;
  if (!value) return {};
  const entries = value.split(',').map((entry) => entry.trim()).filter(Boolean);
  if (entries.length === 0) return {};

  const mapping = {};
  if (entries[0]) mapping.article = entries[0];
  if (entries[1]) mapping.event = entries[1];
  return mapping;
}

const ENV_DIRECTORIES = parseContentDirsEnv();

export function getRelativeContentDir(type) {
  const dir = ENV_DIRECTORIES[type] || DEFAULT_DIRECTORIES[type];
  if (!dir) {
    throw new Error(`Unsupported content type: ${type}`);
  }
  return dir.replace(/\\/g, '/');
}

export function getAbsoluteContentDir(type) {
  const relative = getRelativeContentDir(type);
  return path.join(process.cwd(), relative);
}

export function getContentFilePaths(type, slug) {
  const relativeDir = getRelativeContentDir(type);
  const relativePath = `${relativeDir.replace(/\\/g, '/')}/${slug}.md`;
  const absolutePath = path.join(process.cwd(), relativePath);
  return {
    relativePath,
    absolutePath,
  };
}
