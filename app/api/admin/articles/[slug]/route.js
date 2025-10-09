import { NextResponse } from 'next/server';
import { getEntry, removeEntry, writeEntry, slugify } from '@/lib/content/markdown';
import { validateArticle, ValidationError } from '@/lib/validation/admin';

export async function GET(_request, { params }) {
  try {
    const article = await getEntry('article', params.slug);
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    return NextResponse.json(article);
  } catch (error) {
    console.error('Failed to load article', error);
    return NextResponse.json({ error: 'Failed to load article' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const existing = await getEntry('article', params.slug);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const payload = await request.json();
    const slugCandidate = payload.slug || payload.title || existing.slug;

    const parsed = validateArticle({
      ...existing,
      ...payload,
      slug: slugify(slugCandidate),
      body: typeof payload.body === 'string' ? payload.body : existing.body,
      published:
        typeof payload.published === 'boolean' ? payload.published : existing.published,
    });

    const { body, ...frontMatter } = parsed;

    const normalisedSlug = await writeEntry({
      type: 'article',
      slug: frontMatter.slug,
      previousSlug: params.slug,
      data: frontMatter,
      body,
      commitMessage: `Update article: ${frontMatter.title}`,
    });

    return NextResponse.json({ success: true, slug: normalisedSlug });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    console.error('Failed to update article', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const existing = await getEntry('article', params.slug);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    await removeEntry('article', params.slug, `Delete article: ${existing.title}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete article', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
