# Upload Handler - Examples & Best Practices

## 🎯 Standard Upload Pattern

Use this pattern in all admin components for file uploads:

### **Basic Upload Handler:**

```javascript
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  setError('');

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
      setImageUrl(data.url);
      setSuccess('Image uploaded successfully!');
    } else {
      setError(`Upload failed: ${data.error}`);
    }
  } catch (error) {
    setError(`Upload error: ${error.message}`);
  } finally {
    setUploading(false);
  }
};
```

---

## 🔧 Using Upload Helper Utility

For cleaner code, use the upload helper:

### **Import:**
```javascript
import { uploadFile, createUploadHandler } from '@/lib/uploadHelper';
```

### **Option 1: Direct Upload Function**

```javascript
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  setUploading(true);
  const result = await uploadFile(file);

  if (result.success) {
    setImageUrl(result.url);
    setSuccess('Upload successful!');
  } else {
    setError(result.error);
  }
  
  setUploading(false);
};
```

### **Option 2: Pre-configured Handler**

```javascript
// Create handler once
const handleImageUpload = createUploadHandler(
  setImageUrl,    // onSuccess callback
  setError,       // onError callback
  setUploading    // setLoading callback
);

// Use directly in JSX
<input type="file" onChange={handleImageUpload} />
```

---

## 📸 Multiple File Upload

```javascript
import { uploadMultipleFiles } from '@/lib/uploadHelper';

const handleMultipleUpload = async (e) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  setUploading(true);
  
  const results = await uploadMultipleFiles(files);
  
  const successfulUploads = results.filter(r => r.success);
  const failedUploads = results.filter(r => !r.success);

  if (successfulUploads.length > 0) {
    const urls = successfulUploads.map(r => r.url);
    setImageUrls(urls);
    setSuccess(`${successfulUploads.length} files uploaded!`);
  }

  if (failedUploads.length > 0) {
    setError(`${failedUploads.length} files failed to upload`);
  }

  setUploading(false);
};
```

---

## 🎨 Complete Component Example

```javascript
'use client';

import { useState } from 'react';
import { Upload } from 'lucide-react';

export default function ImageUploader({ onImageUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setError('');

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
        setImageUrl(data.url);
        if (onImageUploaded) onImageUploaded(data.url);
      } else {
        setError(`Upload failed: ${data.error}`);
      }
    } catch (error) {
      setError(`Upload error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Button */}
      <div>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        <label
          htmlFor="image-upload"
          className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors ${
            uploading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Upload className="h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Image'}
        </label>
      </div>

      {/* Preview */}
      {imageUrl && (
        <div className="relative">
          <img
            src={imageUrl}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            onClick={() => setImageUrl('')}
            className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Remove
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
```

---

## ✅ Files Updated

All admin pages now use proper base URL for uploads:

- ✅ `app/admin/new/page.jsx` - Create post
- ✅ `app/admin/edit/[slug]/page.jsx` - Edit post  
- ✅ `app/admin/events/new/page.jsx` - Create event
- ✅ `app/admin/events/[id]/edit/page.jsx` - Edit event

---

## 🔐 Security Best Practices

### **Client-side Validation:**
```javascript
// File type
if (!file.type.match(/^image\/(jpeg|jpg|png|gif|webp)$/)) {
  return setError('Invalid file type');
}

// File size (10MB)
if (file.size > 10 * 1024 * 1024) {
  return setError('File too large');
}

// File name
const validName = /^[a-zA-Z0-9-_.]+$/.test(file.name);
if (!validName) {
  return setError('Invalid file name');
}
```

### **Server-side Validation** (in `/api/upload`):
Should already validate:
- File type
- File size
- Malware scanning (optional)
- Unique filenames

---

## 📱 Drag & Drop Upload (Advanced)

```javascript
const handleDrop = async (e) => {
  e.preventDefault();
  const file = e.dataTransfer.files[0];
  
  if (!file) return;
  
  // Use same upload logic as handleImageUpload
  await uploadFile(file);
};

return (
  <div
    onDrop={handleDrop}
    onDragOver={(e) => e.preventDefault()}
    className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
  >
    <p>Drag & drop image here, or click to select</p>
    <input type="file" onChange={handleImageUpload} />
  </div>
);
```

---

## 🎯 Quick Reference

### **Minimal Upload:**
```javascript
const handleUpload = async (e) => {
  const file = e.target.files[0];
  const form = new FormData();
  form.append('file', file);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
  const res = await fetch(`${baseUrl}/api/upload`, { 
    method: 'POST', 
    body: form 
  });
  const data = await res.json();
  setImageUrl(data.url);
};
```

### **With Error Handling:**
```javascript
const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const formData = new FormData();
    formData.append('file', file);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    const res = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    
    const data = await res.json();
    
    if (res.ok) {
      setImageUrl(data.url);
    } else {
      setError(data.error);
    }
  } catch (err) {
    setError(err.message);
  }
};
```

---

**Updated**: October 19, 2024  
**Status**: ✅ All upload handlers fixed  
**Pattern**: Base URL configuration for Vercel deployment

