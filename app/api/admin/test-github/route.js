import { NextResponse } from 'next/server';
import { githubAdmin } from '../../../../lib/github-admin';

export async function GET() {
  try {
    console.log('🧪 Testing GitHub integration...');
    
    if (githubAdmin.hasGitHubAccess()) {
      console.log('✅ GitHub integration is available');
      return NextResponse.json({ 
        success: true,
        message: 'GitHub integration is working! Admin features are available in production.',
        hasAccess: true
      });
    } else {
      console.log('❌ GitHub integration not available');
      return NextResponse.json({ 
        error: '🔑 GitHub integration not available',
        details: 'To enable admin features in production, you need to:\n1. Create a GitHub Personal Access Token with repo permissions\n2. Add it to your Vercel environment variables as GITHUB_TOKEN\n3. Redeploy the site',
        suggestion: 'Without this, admin features only work in local development.',
        hasAccess: false
      }, { status: 403 });
    }
  } catch (error) {
    console.error('Error testing GitHub integration:', error);
    return NextResponse.json({ 
      error: 'Failed to test GitHub integration',
      details: error.message
    }, { status: 500 });
  }
}
