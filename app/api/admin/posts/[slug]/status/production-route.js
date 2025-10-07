import { NextResponse } from 'next/server';
import { githubAdmin } from '../../../../../lib/github-admin';

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { status } = body;
    
    console.log('🔄 Production admin: Status update request for slug:', slug);
    console.log('Requested status change:', { status });
    
    if (!status || !['draft', 'published'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status. Must be "draft" or "published"' }, { status: 400 });
    }

    // Always try GitHub integration in production
    if (githubAdmin.hasGitHubAccess()) {
      console.log('✅ Using GitHub API for status update');
      const result = await githubAdmin.updatePostStatus(slug, status);
      return NextResponse.json(result, { status: result.error ? 403 : 200 });
    } else {
      console.warn('❌ GitHub integration not available - need GITHUB_TOKEN');
      return NextResponse.json({ 
        error: '🔑 GitHub integration required',
        details: 'To use admin features in production, you need to set up a GitHub Personal Access Token. Please:\n1. Create a GitHub Personal Access Token with repo permissions\n2. Add it to your Vercel environment variables as GITHUB_TOKEN\n3. Redeploy the site',
        suggestion: 'This allows the admin panel to work in production by updating files directly via GitHub API.'
      }, { status: 403 });
    }
    
  } catch (error) {
    console.error('Error updating post status in production:', error);
    return NextResponse.json({ 
      error: 'Failed to update post status', 
      details: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
