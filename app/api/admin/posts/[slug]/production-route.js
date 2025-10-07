import { NextResponse } from 'next/server';
import { githubAdmin } from '../../../../lib/github-admin';

export async function PUT(request, { params }) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { title, excerpt, content, featuredImage, date } = body;
    
    console.log(`🔄 Production admin: Attempting to update post: ${slug}`);
    
    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ 
        error: 'Title and content are required',
        received: { title: !!title, content: !!content }
      }, { status: 400 });
    }

    // Always try GitHub integration in production
    if (githubAdmin.hasGitHubAccess()) {
      console.log('✅ Using GitHub API for post update');
      const result = await githubAdmin.updatePost(slug, { title, excerpt, content, featuredImage, date });
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
    console.error('Error updating post in production:', error);
    return NextResponse.json({ 
      error: 'Failed to update post', 
      details: error.message,
      type: error.name
    }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { slug } = params;
    console.log('🔄 Production admin: Delete request for slug:', slug);

    // Always try GitHub integration in production
    if (githubAdmin.hasGitHubAccess()) {
      console.log('✅ Using GitHub API for post deletion');
      const result = await githubAdmin.deletePost(slug);
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
    console.error('Error deleting post in production:', error);
    return NextResponse.json({ 
      error: 'Failed to delete post', 
      details: error.message 
    }, { status: 500 });
  }
}
