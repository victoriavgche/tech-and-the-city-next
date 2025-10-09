import { Buffer } from 'node:buffer';

function getRepoConfig() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!token || !owner || !repo) {
    return null;
  }

  return { token, owner, repo, branch };
}

function githubHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

export function hasGithubAccess() {
  return Boolean(getRepoConfig());
}

async function requestGithub(path, options = {}) {
  const config = getRepoConfig();
  if (!config) {
    throw new Error('Missing GitHub configuration');
  }

  const url = `https://api.github.com/repos/${config.owner}/${config.repo}/${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...githubHeaders(config.token),
      ...(options.headers || {}),
    },
  });

  return { response, config };
}

export async function commitFile({ path, content, message }) {
  const config = getRepoConfig();
  if (!config) {
    return { committed: false, reason: 'missing_credentials' };
  }

  const { response: getResponse } = await requestGithub(`contents/${path}?ref=${config.branch}`, {
    method: 'GET',
  });

  let sha;
  if (getResponse.ok) {
    const data = await getResponse.json();
    if (!Array.isArray(data) && data.sha) {
      sha = data.sha;
    }
  } else if (getResponse.status !== 404) {
    const errorBody = await getResponse.text();
    throw new Error(`GitHub getContent failed: ${errorBody}`);
  }

  const body = {
    message,
    content: Buffer.from(content).toString('base64'),
    branch: config.branch,
  };

  if (sha) {
    body.sha = sha;
  }

  const { response: putResponse } = await requestGithub(`contents/${path}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  });

  if (!putResponse.ok) {
    const errorBody = await putResponse.text();
    throw new Error(`GitHub commit failed: ${errorBody}`);
  }

  return { committed: true };
}

export async function deleteFile({ path, message }) {
  const config = getRepoConfig();
  if (!config) {
    return { committed: false, reason: 'missing_credentials' };
  }

  const { response: getResponse } = await requestGithub(`contents/${path}?ref=${config.branch}`, {
    method: 'GET',
  });

  if (getResponse.status === 404) {
    return { committed: true };
  }

  if (!getResponse.ok) {
    const errorBody = await getResponse.text();
    throw new Error(`GitHub getContent failed: ${errorBody}`);
  }

  const data = await getResponse.json();
  const sha = !Array.isArray(data) && data.sha ? data.sha : undefined;

  if (!sha) {
    return { committed: true };
  }

  const { response: deleteResponse } = await requestGithub(`contents/${path}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message,
      sha,
      branch: config.branch,
    }),
  });

  if (!deleteResponse.ok) {
    const errorBody = await deleteResponse.text();
    throw new Error(`GitHub delete failed: ${errorBody}`);
  }

  return { committed: true };
}
