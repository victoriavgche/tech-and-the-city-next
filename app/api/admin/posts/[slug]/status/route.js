import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { githubAdmin } from '@/lib/github-admin.js';

const postsDir = path.join(process.cwd(), 'content', 'posts');

function ensurePostsDirectory() {
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }
}

function updateStatusOnFilesystem(slug, status) {
  ensurePostsDirectory();
  const filePath = path.join(postsDir, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return { error: 'Post not found', status: 404 };
  }

  const rawContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(rawContent);
  const updatedFrontMatter = { ...data, status };
  const updatedFile = matter.stringify(content, updatedFrontMatter);
  fs.writeFileSync(filePath, updatedFile, 'utf8');

  return {
    success: true,
    status,
    method: 'filesystem'
  };
}

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const requestedStatus = body?.status;

    if (!slug) {
      return NextResponse.json({ error: 'Post slug is required' }, { status: 400 });
    }

    if (!requestedStatus || !['published', 'draft'].includes(requestedStatus)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';

    if (isProduction && githubAdmin.hasGitHubAccess()) {
      const result = await githubAdmin.updatePostStatus(slug, requestedStatus);

      if (result?.success) {
        return NextResponse.json({
          success: true,
          status: requestedStatus,
          method: 'github'
        });
      }

      if (!result?.fallback) {
        return NextResponse.json({
          error: result?.error || 'Failed to update post status via GitHub',
          details: result?.details
        }, { status: 500 });
      }
    }

    const filesystemResult = updateStatusOnFilesystem(slug, requestedStatus);

    if (filesystemResult?.error) {
      return NextResponse.json({ error: filesystemResult.error }, { status: filesystemResult.status || 500 });
    }

    return NextResponse.json(filesystemResult);
  } catch (error) {
    console.error('Error updating post status:', error);
    return NextResponse.json({ error: 'Failed to update post status', details: error.message }, { status: 500 });
  }
}
