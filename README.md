# Tech and the City

A modern blog platform exploring technology, innovation, and the future of cities.

## Features

- 🚀 **Modern Tech Stack**: Next.js 14, React 18, Tailwind CSS
- 📝 **Content Management**: Markdown-based blog posts with admin panel
- 🔐 **Secure Admin**: Protected admin area with authentication
- 📱 **Responsive Design**: Mobile-first, beautiful UI
- ⚡ **Performance**: Optimized for speed and SEO
- 🌐 **Internationalization**: Multi-language support ready

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tech-and-the-city-next
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel

Access the secret admin panel at `/secret-admin`:

- **Email**: `admin@techandthecity.com`
- **Password**: `TechAndTheCity2024!`
- Edit, delete, and create articles
- Image upload support
- Inline editing with cursor
- Hidden from public navigation

### Admin Features

- 📊 **Dashboard**: Overview of posts and statistics
- ✏️ **Create Posts**: Rich text editor with image upload
- 📋 **Manage Posts**: Edit, delete, and organize content
- 📈 **Analytics**: Track performance and engagement
- 🔒 **Secure**: Session-based authentication

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── posts/             # Blog post pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── content/               # Markdown content
│   └── posts/            # Blog posts
├── lib/                  # Utility functions
├── public/               # Static assets
└── middleware.js         # Route protection
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

#### Build for Production

```bash
npm run build
npm start
```

#### Environment Variables

Create a `.env.local` file:

```env
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
```

## Content Management

### Creating Posts

1. Login to admin panel
2. Go to "Create New Post"
3. Fill in title, excerpt, content
4. Upload featured image
5. Publish

### Post Format

Posts are stored as Markdown files in `content/posts/`:

```markdown
---
title: "Your Post Title"
excerpt: "Brief description"
date: "2024-01-01"
image: "/path/to/image.jpg"
---

Your content here...
```

## Customization

### Styling

- Modify `app/globals.css` for global styles
- Update Tailwind config in `tailwind.config.js`
- Customize components in `components/` directory

### Content

- Add new pages in `app/` directory
- Modify navigation in `components/Nav.jsx`
- Update footer in `components/Footer.jsx`

## Performance

- ⚡ **Image Optimization**: Automatic WebP/AVIF conversion
- 🚀 **Code Splitting**: Automatic route-based splitting
- 📦 **Bundle Analysis**: Run `npm run analyze`
- 🔄 **Caching**: Optimized caching strategies

## Security

- 🔐 **Authentication**: Secure session management
- 🛡️ **Headers**: Security headers configured
- 🚫 **CSRF Protection**: Built-in protection
- 🔒 **Environment Variables**: Sensitive data protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, email support@techandthecity.com or create an issue on GitHub.

---

Built with ❤️ using Next.js