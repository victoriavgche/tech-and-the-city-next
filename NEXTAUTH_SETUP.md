# NextAuth.js Setup Guide

## ✅ What's Been Set Up

Your admin panel is now protected with **NextAuth.js** authentication!

### Files Created/Modified:

1. **`/app/api/auth/[...nextauth]/route.js`** - NextAuth API configuration
2. **`/middleware.js`** - Route protection middleware
3. **`/app/providers.js`** - Session provider wrapper
4. **`/app/layout.js`** - Updated to include SessionProvider
5. **`/app/admin-TC25/page.jsx`** - Updated to use NextAuth
6. **`.env.local`** - Environment variables (DO NOT COMMIT!)

---

## 🔐 Protected Routes

The following routes now require authentication:

- `/admin/*`
- `/admin-TC25/*`
- `/admin-mobile/*`
- `/admin-test/*`
- `/admin-db/*`
- `/backup/*`
- `/backup-info/*`
- `/backup-viewer/*`

---

## 🚀 How to Use

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Access the Admin Panel

Go to: `http://localhost:3000/admin-TC25`

### 3. Login Credentials

**Default credentials** (from `.env.local`):
- **Email**: `admin@techandthecity.com`
- **Password**: `TechAndTheCity2024!`

---

## 🔧 Configuration

### Environment Variables (`.env.local`)

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000              # Change to your domain in production
NEXTAUTH_SECRET=9TtmlSVD57VR/ghDF21Lj1Ay9bMNc5mRG9+k7pgtk3s=  # Keep this secret!

# Admin Credentials
ADMIN_USER=admin@techandthecity.com             # Change to your admin email
ADMIN_PASS=TechAndTheCity2024!                  # Change to your secure password
```

### Generate a New Secret

To generate a new `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Or use OpenSSL:

```bash
openssl rand -base64 32
```

---

## 🌐 Production Deployment

### For Vercel:

1. Go to your project settings on Vercel
2. Navigate to **Environment Variables**
3. Add these variables:

```
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-generated-secret
ADMIN_USER=your-admin-email
ADMIN_PASS=your-secure-password
```

### Important Notes:

⚠️ **NEVER commit `.env.local` to Git!**  
✅ It's already in `.gitignore`  
✅ Each environment (local, staging, production) should have its own secrets

---

## 🔒 Security Features

### What's Protected:

✅ **Session-based authentication** with JWT  
✅ **Middleware protection** - Unauthenticated users are redirected  
✅ **Secure password handling** - Credentials stored in environment variables  
✅ **30-day session** - Auto-logout after inactivity  

### Additional Security (Optional):

For production, consider:

1. **Rate limiting** on login attempts
2. **Two-factor authentication** (2FA)
3. **IP whitelisting** for admin routes
4. **HTTPS only** (Vercel handles this automatically)
5. **Strong password requirements**

---

## 🛠️ Customization

### Change Login Page

Edit: `app/api/auth/[...nextauth]/route.js`

```javascript
pages: {
  signIn: "/your-custom-login-page",
}
```

### Extend Session Duration

Edit: `app/api/auth/[...nextauth]/route.js`

```javascript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days (change as needed)
}
```

### Add More Providers

NextAuth supports many providers (Google, GitHub, etc.):

```bash
npm install next-auth
```

Then add to `providers` array:

```javascript
import GoogleProvider from "next-auth/providers/google";

providers: [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  }),
  // ... existing providers
]
```

---

## 🐛 Troubleshooting

### "Invalid credentials" error

1. Check `.env.local` exists in project root
2. Restart dev server: `npm run dev`
3. Verify credentials match exactly

### Session not persisting

1. Check if cookies are enabled in browser
2. Clear browser cookies and try again
3. Check `NEXTAUTH_URL` matches your current URL

### Middleware not protecting routes

1. Check `middleware.js` exists in project root
2. Verify route patterns in `matcher` array
3. Restart dev server

### Can't access admin after deployment

1. Verify environment variables are set in Vercel/hosting
2. Check `NEXTAUTH_URL` is set to production domain
3. Check browser console for errors

---

## 📚 Resources

- [NextAuth.js Documentation](https://next-auth.js.org/)
- [NextAuth.js Examples](https://github.com/nextauthjs/next-auth-example)
- [Vercel Deployment Guide](https://vercel.com/docs/concepts/projects/environment-variables)

---

## ✅ Next Steps

1. **Change credentials** in `.env.local`
2. **Test login** at `/admin-TC25`
3. **Deploy to production** with environment variables
4. **Consider additional security** (2FA, rate limiting)

---

**Created**: October 19, 2024  
**Last Updated**: October 19, 2024  
**Version**: 1.0.0

