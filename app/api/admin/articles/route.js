import { NextResponse } from 'next/server';
import { getEntry, listEntries, writeEntry, slugify } from '@/lib/content/markdown';
import { validateArticle, ValidationError } from '@/lib/validation/admin';

export async function GET() {
  try {
    const articles = await listEntries('article');
    return NextResponse.json(articles);
  } catch (error) {
    console.error('Failed to load articles', error);
    return NextResponse.json({ error: 'Failed to load articles' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const slug = slugify(payload.slug || payload.title || '');
    const parsed = validateArticle({
      ...payload,
      slug,
    });

    const { body, ...frontMatter } = parsed;

    const existing = await getEntry('article', frontMatter.slug);
    if (existing) {
      return NextResponse.json({ error: 'Article with this slug already exists' }, { status: 409 });
    }

    const normalisedSlug = await writeEntry({
      type: 'article',
      slug: frontMatter.slug,
      data: frontMatter,
      body,
      commitMessage: `Create article: ${frontMatter.title}`,
    });

    return NextResponse.json(
      {
        success: true,
        slug: normalisedSlug,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues,
        },
        { status: 400 },
      );
    }

    console.error('Failed to create article', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
