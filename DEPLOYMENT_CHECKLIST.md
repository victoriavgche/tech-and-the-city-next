# 🚀 Deployment Checklist - Vercel Ready

## ✅ Completed Tasks

### 1. **NextAuth Authentication** ✅
- [x] Installed `next-auth`
- [x] Created `/app/api/auth/[...nextauth]/route.js`
- [x] Created `/middleware.js` for route protection
- [x] Created `/app/providers.js` for SessionProvider
- [x] Updated `/app/layout.js` with Providers
- [x] Updated `/app/admin-TC25/page.jsx` to use NextAuth
- [x] Generated secure `NEXTAUTH_SECRET`

### 2. **API Base URL Configuration** ✅
- [x] Added `NEXT_PUBLIC_BASE_URL` to `.env.local`
- [x] Created `/lib/api.js` - API utility helper
- [x] Created `/lib/uploadHelper.js` - Upload utility
- [x] Updated all admin pages with base URL
- [x] Fixed all file upload handlers

### 3. **Files Updated** ✅

#### Admin Dashboard:
- [x] `app/admin-TC25/page.jsx` (7 API calls)

#### Post Management:
- [x] `app/admin/new/page.jsx` (3 API calls + upload)
- [x] `app/admin/edit/[slug]/page.jsx` (4 API calls + uploads)

#### Event Management:
- [x] `app/admin/events/new/page.jsx` (2 API calls + upload)
- [x] `app/admin/events/[id]/edit/page.jsx` (3 API calls + upload)

#### Utilities:
- [x] `lib/api.js` - API helper
- [x] `lib/uploadHelper.js` - Upload helper

---

## 🔐 Environment Variables

### **Local (.env.local)**
```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=9TtmlSVD57VR/ghDF21Lj1Ay9bMNc5mRG9+k7pgtk3s=

# Admin
ADMIN_USER=techadmin
ADMIN_PASS=TechCity2024!SecurePass

# API Base URL
NEXT_PUBLIC_BASE_URL=https://www.tech-and-the-city.org
```

### **Production (Vercel)**

Go to: **Vercel Dashboard → Project → Settings → Environment Variables**

Add these:

```
NEXTAUTH_URL=https://www.tech-and-the-city.org
NEXTAUTH_SECRET=9TtmlSVD57VR/ghDF21Lj1Ay9bMNc5mRG9+k7pgtk3s=
ADMIN_USER=techadmin
ADMIN_PASS=TechCity2024!SecurePass
NEXT_PUBLIC_BASE_URL=https://www.tech-and-the-city.org
```

**Important:** Set for all environments (Production, Preview, Development)

---

## 🧪 Testing Checklist

### **Before Deployment:**

#### Local Testing:
- [ ] Start dev server: `npm run dev`
- [ ] Test login at `/admin-TC25`
- [ ] Test create new post
- [ ] Test edit existing post
- [ ] Test image upload
- [ ] Test publish/unpublish
- [ ] Test delete post
- [ ] Test create event
- [ ] Test edit event
- [ ] Test event media upload
- [ ] Check browser console for errors
- [ ] Check all API calls use base URL

#### Code Quality:
- [ ] No linter errors: `npm run lint`
- [ ] Build succeeds: `npm run build`
- [ ] No TypeScript errors (if using TS)

---

## 📦 Deployment Steps

### **1. Prepare for Deployment**

```bash
# Check git status
git status

# Stage all changes
git add .

# Commit changes
git commit -m "Add NextAuth authentication and API base URL configuration"

# Push to GitHub
git push origin main
```

### **2. Configure Vercel**

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to **Settings** → **Environment Variables**

2. **Add Variables** (copy from `.env.local`):
   ```
   NEXTAUTH_URL
   NEXTAUTH_SECRET
   ADMIN_USER
   ADMIN_PASS
   NEXT_PUBLIC_BASE_URL
   ```

3. **Set Environment:**
   - Check: Production ✅
   - Check: Preview ✅  
   - Check: Development ✅

4. **Save** each variable

### **3. Deploy**

#### Option A: Auto-deploy (if enabled)
- Push to GitHub → Vercel auto-deploys

#### Option B: Manual deploy
- Vercel Dashboard → Deployments → Redeploy

### **4. Verify Deployment**

Wait for build to complete, then test:

```
https://www.tech-and-the-city.org/admin-TC25
```

---

## 🔍 Post-Deployment Testing

### **Production Verification:**

- [ ] Visit homepage: `https://www.tech-and-the-city.org`
- [ ] Visit articles: `https://www.tech-and-the-city.org/articles`
- [ ] Visit events: `https://www.tech-and-the-city.org/events`
- [ ] Visit admin: `https://www.tech-and-the-city.org/admin-TC25`
- [ ] Try to access `/admin` without login (should redirect)
- [ ] Login with credentials
- [ ] Test create post
- [ ] Test upload image
- [ ] Test edit post
- [ ] Test publish/unpublish
- [ ] Test create event
- [ ] Test all admin features
- [ ] Check browser console (no errors)
- [ ] Test on mobile device
- [ ] Test different browsers

---

## 🐛 Troubleshooting

### **Issue: Can't login on production**

**Solution:**
1. Check environment variables are set correctly
2. Verify `NEXTAUTH_URL` matches your domain
3. Check `NEXTAUTH_SECRET` is set
4. Clear browser cookies and try again
5. Check deployment logs for errors

### **Issue: API calls failing (404)**

**Solution:**
1. Check `NEXT_PUBLIC_BASE_URL` is set
2. Verify URL format: `https://www.tech-and-the-city.org` (no trailing slash)
3. Check browser console for actual API URLs being called
4. Verify API routes exist in deployment

### **Issue: Images not uploading**

**Solution:**
1. Check file size limits (10MB default)
2. Check `/api/upload` route exists
3. Check write permissions on server
4. Verify `public/uploads` directory exists
5. Check Vercel logs for errors

### **Issue: Session not persisting**

**Solution:**
1. Check cookies are enabled in browser
2. Verify `NEXTAUTH_SECRET` is set
3. Check domain matches `NEXTAUTH_URL`
4. Clear cookies and re-login
5. Check for CORS issues

### **Issue: Build fails on Vercel**

**Solution:**
1. Run `npm run build` locally first
2. Check for TypeScript errors
3. Check for missing dependencies
4. Review build logs in Vercel
5. Check Next.js version compatibility

---

## 📚 Important Files

### **Configuration:**
- `.env.local` - Local environment (NOT committed)
- `middleware.js` - Route protection
- `app/api/auth/[...nextauth]/route.js` - NextAuth config
- `next.config.js` - Next.js configuration

### **Utilities:**
- `lib/api.js` - API helper functions
- `lib/uploadHelper.js` - Upload utilities

### **Documentation:**
- `NEXTAUTH_SETUP.md` - NextAuth documentation
- `ADMIN_AUTH_SUMMARY.md` - Authentication summary
- `API_BASE_URL_FIX.md` - API fixes documentation
- `UPLOAD_HANDLER_EXAMPLE.md` - Upload examples
- `DEPLOYMENT_CHECKLIST.md` - This file

---

## 🔒 Security Notes

### **Production Security:**

1. **Change Credentials:**
   ```bash
   # Generate new secret
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
   
   # Update NEXTAUTH_SECRET
   # Update ADMIN_PASS
   ```

2. **HTTPS Only:**
   - Vercel provides free SSL
   - Force HTTPS redirect
   - Check `NEXTAUTH_URL` uses `https://`

3. **Protected Routes:**
   - All `/admin*` routes protected by middleware
   - Session-based authentication
   - 30-day session expiry

4. **Rate Limiting (Optional):**
   - Consider adding rate limiting
   - Prevent brute force attacks
   - Use Vercel Edge Config

5. **Monitoring:**
   - Enable Vercel Analytics
   - Monitor deployment logs
   - Set up error tracking (Sentry, etc.)

---

## 📊 Performance Optimization

### **Before Deploy:**
- [ ] Optimize images (WebP format)
- [ ] Enable caching
- [ ] Minimize bundle size
- [ ] Check Lighthouse score

### **After Deploy:**
- [ ] Test page load speed
- [ ] Check Core Web Vitals
- [ ] Enable Vercel Analytics
- [ ] Monitor performance

---

## 🎯 Next Steps

### **After Successful Deployment:**

1. **Update Documentation:**
   - Document your custom credentials
   - Add team member access
   - Update README if needed

2. **Setup Monitoring:**
   - Enable Vercel Analytics
   - Setup error tracking
   - Configure uptime monitoring

3. **Content Management:**
   - Create initial posts
   - Add events
   - Test multilingual features

4. **SEO & Marketing:**
   - Submit sitemap to Google
   - Setup Google Analytics
   - Configure social media sharing

5. **Backup & Maintenance:**
   - Setup regular backups
   - Plan content calendar
   - Schedule updates

---

## ✅ Final Checklist

Before marking as complete:

- [ ] All environment variables set in Vercel
- [ ] Deployment successful (green checkmark)
- [ ] Admin login works on production
- [ ] All CRUD operations work
- [ ] File uploads work
- [ ] No console errors
- [ ] Mobile responsive
- [ ] HTTPS working
- [ ] All pages load correctly
- [ ] Documentation updated

---

## 🎉 You're Ready!

If all checkboxes are ✅, your site is **production-ready**!

**Live URLs:**
- 🌐 **Public Site:** https://www.tech-and-the-city.org
- 🔐 **Admin Panel:** https://www.tech-and-the-city.org/admin-TC25

**Login Credentials:**
- **Username:** techadmin
- **Password:** TechCity2024!SecurePass

---

**Last Updated:** October 19, 2024  
**Version:** 1.0.0  
**Status:** ✅ Production Ready

