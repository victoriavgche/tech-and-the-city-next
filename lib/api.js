/**
 * API Utility Helper
 * Handles API calls with proper base URL for Vercel deployment
 */

// Get base URL from environment or default to empty string for relative URLs
const getBaseUrl = () => {
  // Client-side: use NEXT_PUBLIC_BASE_URL or empty string for relative URLs
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_BASE_URL || '';
  }
  
  // Server-side: use NEXTAUTH_URL or localhost
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
};

/**
 * Make an API call with proper base URL
 * @param {string} endpoint - API endpoint (e.g., '/api/posts')
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>}
 */
export async function apiCall(endpoint, options = {}) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  
  return fetch(url, options);
}

/**
 * GET request
 */
export async function apiGet(endpoint) {
  return apiCall(endpoint, { method: 'GET' });
}

/**
 * POST request
 */
export async function apiPost(endpoint, data) {
  return apiCall(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * PUT request
 */
export async function apiPut(endpoint, data) {
  return apiCall(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request
 */
export async function apiDelete(endpoint) {
  return apiCall(endpoint, { method: 'DELETE' });
}

/**
 * Upload file (FormData)
 */
export async function apiUpload(endpoint, formData) {
  return apiCall(endpoint, {
    method: 'POST',
    body: formData,
  });
}

export default {
  call: apiCall,
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  upload: apiUpload,
  getBaseUrl,
};

