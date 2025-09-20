import { NextResponse } from 'next/server';
import { requireAuth } from '../../../../../lib/auth';
import fs from 'node:fs';
import path from 'node:path';

const postsDir = path.join(process.cwd(), 'content', 'posts');

export async function DELETE(request, { params }) {
  try {
    const session = requireAuth(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { slug } = params;
    const filePath = path.join(postsDir, `${slug}.md`);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete post error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
