# Deployment Guide

This guide covers deploying Tech and the City to various platforms.

## Vercel (Recommended)

### Automatic Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - Deploy!

3. **Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-secure-password
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   NEXT_PUBLIC_SITE_NAME=Tech and the City
   ```

### Custom Domain

1. Go to Vercel dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` environment variable

## Netlify

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `out` folder
   - Or connect your GitHub repository

3. **Environment Variables**
   In Netlify dashboard → Site settings → Environment variables:
   ```
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-secure-password
   NEXT_PUBLIC_SITE_URL=https://your-domain.netlify.app
   ```

## Railway

1. **Connect Repository**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository
   - Deploy automatically

2. **Environment Variables**
   ```
   ADMIN_USERNAME=your-admin-username
   ADMIN_PASSWORD=your-secure-password
   NEXT_PUBLIC_SITE_URL=https://your-app.railway.app
   ```

## DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Create new app from GitHub
   - Select your repository

2. **Configure**
   - Build command: `npm run build`
   - Run command: `npm start`
   - Environment variables as above

## Self-Hosted (VPS)

### Using PM2

1. **Setup Server**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Install PM2
   npm install -g pm2
   ```

2. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd tech-and-the-city-next

   # Install dependencies
   npm install

   # Build application
   npm run build

   # Start with PM2
   pm2 start npm --name "tech-city" -- start
   pm2 save
   pm2 startup
   ```

3. **Setup Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

### Using Docker

1. **Create Dockerfile**
   ```dockerfile
   FROM node:18-alpine

   WORKDIR /app

   COPY package*.json ./
   RUN npm ci --only=production

   COPY . .
   RUN npm run build

   EXPOSE 3000

   CMD ["npm", "start"]
   ```

2. **Build and Run**
   ```bash
   docker build -t tech-city .
   docker run -p 3000:3000 --env-file .env tech-city
   ```

## Environment Variables

### Required Variables

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Tech and the City
```

### Optional Variables

```env
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_GTM_ID=your-google-tag-manager-id
GOOGLE_SITE_VERIFICATION=your-verification-code
```

## SSL Certificate

### Let's Encrypt (Free)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Performance Optimization

### CDN Setup

1. **Cloudflare**
   - Add your domain to Cloudflare
   - Enable caching and optimization
   - Configure page rules for static assets

2. **AWS CloudFront**
   - Create CloudFront distribution
   - Point to your hosting provider
   - Configure caching behaviors

### Image Optimization

- Use WebP/AVIF formats
- Implement lazy loading
- Optimize image sizes
- Use responsive images

## Monitoring

### Uptime Monitoring

- [UptimeRobot](https://uptimerobot.com)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

### Analytics

- Google Analytics
- Vercel Analytics
- Plausible Analytics

## Backup Strategy

### Content Backup

```bash
# Backup posts
tar -czf posts-backup-$(date +%Y%m%d).tar.gz content/posts/

# Backup to cloud storage
aws s3 cp posts-backup-*.tar.gz s3://your-backup-bucket/
```

### Database Backup (if using)

```bash
# MongoDB
mongodump --uri="mongodb://localhost:27017/techcity" --out=backup/

# PostgreSQL
pg_dump techcity > backup-$(date +%Y%m%d).sql
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version (18+)
   - Clear `.next` folder
   - Reinstall dependencies

2. **Environment Variables**
   - Verify all required variables are set
   - Check variable names (case-sensitive)
   - Restart application after changes

3. **Performance Issues**
   - Enable compression
   - Optimize images
   - Use CDN
   - Monitor bundle size

### Support

- Check [Next.js documentation](https://nextjs.org/docs)
- Review platform-specific guides
- Create GitHub issue for bugs

---

Happy deploying! 🚀


