// GitHub Admin Integration for Production
// This allows admin functionality in production by using GitHub API

export class GitHubAdmin {
  constructor() {
    this.isProduction = process.env.VERCEL || process.env.NODE_ENV === 'production';
    this.githubToken = process.env.GITHUB_TOKEN;
    this.repoOwner = 'victoriavgche';
    this.repoName = 'tech-and-the-city-next';
  }

  // Check if we have GitHub integration available
  hasGitHubAccess() {
    const hasAccess = this.githubToken && this.isProduction;
    console.log('🔍 GitHub Access Check:', {
      hasToken: !!this.githubToken,
      isProduction: this.isProduction,
      overall: hasAccess
    });
    return hasAccess;
  }

  // Update post via GitHub API
  async updatePost(slug, postData) {
    if (!this.hasGitHubAccess()) {
      console.log('No GitHub access, using fallback');
      return this.fallbackResponse();
    }

    try {
      console.log('Updating post via GitHub API:', slug);
      console.log('Status being sent:', postData.status || 'published');
      
      // Create front matter with preserved status
      const frontMatter = `---
title: "${postData.title.replace(/"/g, '\\"')}"
excerpt: "${postData.excerpt ? postData.excerpt.replace(/"/g, '\\"') : ''}"
date: "${postData.date || new Date().toISOString()}"
tags:
  - AI
  - Technology
  - Athens
read: "5 min"
${postData.image ? `image: "${postData.image}"` : ''}
status: "${postData.status || 'published'}"
---

${postData.content}`;

      // Get current file SHA first
      const sha = await this.getFileSHA(`content/posts/${slug}.md`);
      console.log('Got file SHA:', sha);

      // Update file via GitHub API
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/posts/${slug}.md`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update post: ${postData.title}`,
          content: Buffer.from(frontMatter).toString('base64'),
          sha: sha
        })
      });

      console.log('GitHub API response status:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('GitHub update successful:', result);
        return { success: true, message: 'Post updated successfully via GitHub', data: result };
      } else {
        const errorData = await response.json();
        console.error('GitHub API error:', errorData);
        throw new Error(`GitHub API failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('GitHub update failed:', error);
      return { 
        error: 'GitHub update failed', 
        details: error.message,
        fallback: true 
      };
    }
  }

  // Create new post via GitHub API
  async createPost(postData) {
    if (!this.hasGitHubAccess()) {
      return this.fallbackResponse();
    }

    try {
      const slug = postData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();

      const frontMatter = `---
title: "${postData.title.replace(/"/g, '\\"')}"
excerpt: "${postData.excerpt ? postData.excerpt.replace(/"/g, '\\"') : ''}"
date: "${postData.date || new Date().toISOString()}"
tags:
  - AI
  - Technology
  - Athens
read: "5 min"
${postData.image ? `image: "${postData.image}"` : ''}
status: "${postData.status || 'published'}"
---

${postData.content}`;

      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/posts/${slug}.md`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Create new post: ${postData.title}`,
          content: Buffer.from(frontMatter).toString('base64')
        })
      });

      if (response.ok) {
        return { success: true, slug, message: 'Post created successfully via GitHub' };
      } else {
        throw new Error('GitHub API failed');
      }
    } catch (error) {
      console.error('GitHub create failed:', error);
      return this.fallbackResponse();
    }
  }

  // Update post status via GitHub API
  async updatePostStatus(slug, status) {
    if (!this.hasGitHubAccess()) {
      console.log('No GitHub access for status update, using fallback');
      return this.fallbackResponse();
    }

    try {
      console.log('Updating post status via GitHub API:', slug, 'to', status);
      
      // First get current file content
      const fileResponse = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/posts/${slug}.md`, {
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
        }
      });

      if (!fileResponse.ok) {
        throw new Error('Failed to fetch current file');
      }

      const fileData = await fileResponse.json();
      const currentContent = Buffer.from(fileData.content, 'base64').toString('utf8');
      console.log('Got current file content, length:', currentContent.length);

      // Update status in content
      const updatedContent = currentContent.replace(
        /status:\s*["'][^"']*["']/,
        `status: "${status}"`
      );

      console.log('Updated content length:', updatedContent.length);

      // Update file via GitHub API
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/posts/${slug}.md`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Update post status to: ${status}`,
          content: Buffer.from(updatedContent).toString('base64'),
          sha: fileData.sha
        })
      });

      console.log('GitHub status update response:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('GitHub status update successful:', result);
        return { success: true, status, message: 'Post status updated successfully via GitHub', data: result };
      } else {
        const errorData = await response.json();
        console.error('GitHub status update error:', errorData);
        throw new Error(`GitHub API failed: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('GitHub status update failed:', error);
      return { 
        error: 'GitHub status update failed', 
        details: error.message,
        fallback: true 
      };
    }
  }

  // Delete post via GitHub API
  async deletePost(slug) {
    if (!this.hasGitHubAccess()) {
      return this.fallbackResponse();
    }

    try {
      const sha = await this.getFileSHA(`content/posts/${slug}.md`);
      
      const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/content/posts/${slug}.md`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${this.githubToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Delete post: ${slug}`,
          sha: sha
        })
      });

      if (response.ok) {
        return { success: true, message: 'Post deleted successfully via GitHub' };
      } else {
        throw new Error('GitHub API failed');
      }
    } catch (error) {
      console.error('GitHub delete failed:', error);
      return this.fallbackResponse();
    }
  }

  // Helper: Get file SHA for updates
  async getFileSHA(filePath) {
    const response = await fetch(`https://api.github.com/repos/${this.repoOwner}/${this.repoName}/contents/${filePath}`, {
      headers: {
        'Authorization': `Bearer ${this.githubToken}`,
      }
    });

    if (response.ok) {
      const fileData = await response.json();
      return fileData.sha;
    }
    throw new Error('Failed to get file SHA');
  }

  // Fallback response for when GitHub integration is not available
  fallbackResponse() {
    return {
      error: '🚫 GitHub Integration Not Configured',
      details: 'To enable admin features in production, you need to set up GitHub API access:\n\n1. Create a GitHub Personal Access Token:\n   - Go to: https://github.com/settings/tokens\n   - Click "Generate new token (classic)"\n   - Give it "repo" permissions\n   - Copy the token\n\n2. Add to Vercel:\n   - Go to your Vercel project settings\n   - Add Environment Variable: GITHUB_TOKEN\n   - Paste your token\n   - Redeploy\n\n3. Once configured, changes will be committed to GitHub automatically\n\nFor now, you can:\n- Run locally: npm run dev\n- Make changes locally and commit manually\n\nSee ADMIN_SETUP.md for detailed instructions.',
      suggestion: 'Alternatively, you can use a headless CMS like Contentful or Sanity for easier content management.',
      setupGuide: '/ADMIN_SETUP.md'
    };
  }
}

// Export singleton instance
export const githubAdmin = new GitHubAdmin();
