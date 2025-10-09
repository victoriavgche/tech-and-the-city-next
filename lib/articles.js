import { remark } from 'remark';
import html from 'remark-html';
import { getEntry, listEntries } from './content/markdown';

async function toHtml(markdown = '') {
  const result = await remark().use(html).process(markdown);
  return String(result);
}

export async function getAllArticlesMeta() {
  const articles = await listEntries('article');
  return articles;
}

export async function getPublishedArticles() {
  const articles = await listEntries('article');
  return articles.filter((article) => article.published);
}

export async function getArticleBySlug(slug) {
  const article = await getEntry('article', slug);
  if (!article) return null;
  const articleHtml = await toHtml(article.body || '');
  return {
    ...article,
    content: articleHtml,
    html: articleHtml,
  };
}
