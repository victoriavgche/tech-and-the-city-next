/**
 * Upload Helper Utility
 * Handles file uploads with proper base URL for Vercel deployment
 */

/**
 * Upload a file to the server
 * @param {File} file - The file to upload
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<{url: string, success: boolean, error?: string}>}
 */
export async function uploadFile(file, onProgress = null) {
  if (!file) {
    return { success: false, error: 'No file provided' };
  }

  try {
    const formData = new FormData();
    formData.append('file', file);

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    const response = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        url: data.url,
        filename: data.filename || file.name,
      };
    } else {
      return {
        success: false,
        error: data.error || 'Upload failed',
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Network error during upload',
    };
  }
}

/**
 * Upload multiple files
 * @param {FileList|File[]} files - Files to upload
 * @returns {Promise<Array>}
 */
export async function uploadMultipleFiles(files) {
  const filesArray = Array.from(files);
  const uploadPromises = filesArray.map(file => uploadFile(file));
  return Promise.all(uploadPromises);
}

/**
 * React hook-friendly upload handler
 * Usage example:
 * const handleImageUpload = createUploadHandler(setImageUrl, setError, setUploading);
 */
export function createUploadHandler(
  onSuccess,
  onError = null,
  setLoading = null
) {
  return async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (setLoading) setLoading(true);
    if (onError) onError('');

    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${baseUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(data.url);
      } else {
        if (onError) onError(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      if (onError) onError(`Upload error: ${error.message}`);
    } finally {
      if (setLoading) setLoading(false);
    }
  };
}

export default {
  uploadFile,
  uploadMultipleFiles,
  createUploadHandler,
};

