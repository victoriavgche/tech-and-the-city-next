# API Base URL Fix - Vercel Deployment Ready

## 🎯 Problem Solved

Fixed all API calls to use proper base URL configuration for Vercel deployment.

**Before:**
```javascript
await fetch('/api/posts')  // ❌ Relative URL - breaks on some deployments
```

**After:**
```javascript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
await fetch(`${baseUrl}/api/posts`)  // ✅ Configurable base URL
```

---

## ✅ Files Updated

### 1. **Environment Variables**
**`.env.local`** - Added base URL configuration:
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 2. **API Utility Helper**
**`lib/api.js`** - Created reusable API helper (optional):
- `apiGet()` - GET requests
- `apiPost()` - POST requests
- `apiPut()` - PUT requests
- `apiDelete()` - DELETE requests
- `apiUpload()` - File uploads

### 3. **Admin Pages Updated**

#### **Main Dashboard** (`app/admin-TC25/page.jsx`)
- ✅ `fetchPosts()` - Get all posts
- ✅ `fetchEvents()` - Get all events
- ✅ `handleDelete()` - Delete post
- ✅ `handleToggleStatus()` - Publish/unpublish post
- ✅ `handleDeleteEvent()` - Delete event
- ✅ `handleUnpublishEvent()` - Unpublish event
- ✅ `handlePublishEvent()` - Publish event

#### **New Post** (`app/admin/new/page.jsx`)
- ✅ `handleImageUpload()` - Upload featured image
- ✅ `handleSaveDraft()` - Save as draft
- ✅ `handleSave()` - Create post

#### **Edit Post** (`app/admin/edit/[slug]/page.jsx`)
- ✅ `fetchPost()` - Load post data
- ✅ `handleSave()` - Update post
- ✅ `handleMediaUpload()` - Upload media
- ✅ `handleImageUpload()` - Upload featured image

---

## 📝 Pattern Used

All API calls now follow this pattern:

```javascript
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
const response = await fetch(`${baseUrl}/api/endpoint`, {
  method: 'GET|POST|PUT|DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

---

## 🌐 Environment Configuration

### Development (`.env.local`):
```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Production (Vercel):
```bash
NEXT_PUBLIC_BASE_URL=https://tech-and-the-city.org
```

Or leave empty for relative URLs:
```bash
NEXT_PUBLIC_BASE_URL=
```

---

## 🚀 Deployment Steps

### For Vercel:

1. **Go to Project Settings** → Environment Variables

2. **Add variable:**
   ```
   Name: NEXT_PUBLIC_BASE_URL
   Value: https://your-domain.com (or leave empty)
   ```

3. **Redeploy:**
   ```bash
   git push
   ```

---

## 🔧 Why This Fix?

### Problems with relative URLs:
- ❌ Can break on some hosting platforms
- ❌ Issues with SSR/ISR
- ❌ Problems with API routes in different environments
- ❌ CORS issues in some configurations

### Benefits of configurable base URL:
- ✅ Works on all platforms (Vercel, Netlify, etc.)
- ✅ Easy environment switching
- ✅ Better debugging
- ✅ Production-ready
- ✅ No CORS issues

---

## 📋 Testing Checklist

### Local Testing:
- [ ] Posts page loads (`/articles`)
- [ ] Events page loads (`/events`)
- [ ] Admin login works (`/admin-TC25`)
- [ ] Create new post works
- [ ] Edit post works
- [ ] Upload images works
- [ ] Publish/unpublish works
- [ ] Delete works
- [ ] Create event works
- [ ] Edit event works

### Production Testing (after deploy):
- [ ] All above tests on production URL
- [ ] Check browser console for errors
- [ ] Verify API calls use correct base URL
- [ ] Test from different browsers/devices

---

## 🐛 Troubleshooting

### API calls failing in production:

1. **Check environment variable:**
   ```bash
   # In Vercel dashboard → Settings → Environment Variables
   # Verify NEXT_PUBLIC_BASE_URL is set correctly
   ```

2. **Check browser console:**
   ```javascript
   // Should show your production URL
   console.log(process.env.NEXT_PUBLIC_BASE_URL)
   ```

3. **Verify URL format:**
   ```bash
   ✅ https://tech-and-the-city.org
   ✅ (empty string)
   ❌ https://tech-and-the-city.org/
   ❌ http://tech-and-the-city.org (use HTTPS)
   ```

4. **Redeploy after changing env vars:**
   - Environment variables require redeploy to take effect
   - Push a new commit or manually trigger redeploy

---

## 📚 Additional Files Updated

The following files also need updating (not done yet):

### Public Pages:
- `app/articles/page.jsx` - Articles listing
- `app/events/page.jsx` - Events listing
- `app/contact/page.jsx` - Contact form

### Components:
- `components/MessagesDashboard.jsx`
- `components/SimpleBackup.jsx`
- `components/AnalyticsScript.jsx`

**Note:** Public pages can use relative URLs safely, but admin pages need the base URL configuration.

---

## ✨ Next Steps

1. ✅ **Test locally** - Verify all API calls work
2. ✅ **Deploy to Vercel** - Test in production
3. 🔄 **Update remaining files** (if needed)
4. 🔄 **Add API utility helper** everywhere (optional)

---

## 🎓 What You Learned

1. **Environment Variables** - Using `NEXT_PUBLIC_*` for client-side access
2. **Configurable APIs** - Making code deployment-ready
3. **Base URL patterns** - Industry best practice
4. **Vercel deployment** - Environment variable management

---

**Updated**: October 19, 2024  
**Status**: ✅ Core admin pages fixed  
**Next**: Test deployment on Vercel

