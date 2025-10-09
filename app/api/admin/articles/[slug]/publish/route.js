import { NextResponse } from 'next/server';
import { getEntry, writeEntry } from '@/lib/content/markdown';

export async function PATCH(request, { params }) {
  try {
    const existing = await getEntry('article', params.slug);
    if (!existing) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    const payload = await request.json().catch(() => ({}));
    const shouldPublish =
      typeof payload.published === 'boolean' ? payload.published : !existing.published;

    const { body, ...frontMatter } = {
      ...existing,
      published: shouldPublish,
    };

    await writeEntry({
      type: 'article',
      slug: frontMatter.slug,
      previousSlug: params.slug,
      data: frontMatter,
      body,
      commitMessage: `${shouldPublish ? 'Publish' : 'Unpublish'} article: ${frontMatter.title}`,
    });

    return NextResponse.json({ success: true, published: shouldPublish });
  } catch (error) {
    console.error('Failed to toggle article status', error);
    return NextResponse.json({ error: 'Failed to update article status' }, { status: 500 });
  }
}
