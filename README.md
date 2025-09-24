# Tech & the City

A modern blog platform showcasing culture and technology across Europe, with Athens energy. Built with Next.js 14, featuring responsive design, clean UI, and a secure admin panel.

## Features

- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- 🎨 **Modern UI**: Dark theme with gradient backgrounds and smooth animations
- 🔐 **Secure Admin Panel**: Hidden admin system with customizable credentials
- ✏️ **Rich Content Management**: Create, edit, and delete articles with image support
- 🚀 **Performance**: Static generation with Next.js 14
- 🎯 **Events Section**: Dynamic events page with filtering and interactive features

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Content**: Markdown with front matter
- **Deployment**: Vercel-ready

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd tech-and-the-city-next
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Panel

Access the secret admin panel at `/admin-TC25`:

- **Default Email**: `admin@techandthecity.com`
- **Default Password**: `TechAndTheCity2024!`
- **Features**: Edit, delete, and create articles with image upload support
- **Security**: Hidden from public navigation, customizable credentials
- **Settings**: Change email and password through the Settings panel

### Admin Features

- 📊 **Dashboard**: Overview of all posts with thumbnails
- ✏️ **Create Posts**: Rich text editor with image upload (URL or file)
- 🔧 **Edit Posts**: Inline editing with cursor support
- 🗑️ **Delete Posts**: One-click article deletion
- ⚙️ **Settings**: Customize admin credentials
- 👁️ **Preview**: View articles before publishing

## Project Structure

```
├── app/
│   ├── admin-TC25/          # Secret admin panel
│   ├── articles/            # Article pages
│   ├── api/                 # API routes
│   └── globals.css          # Global styles
├── components/
│   ├── Nav.jsx              # Navigation component
│   ├── Footer.jsx           # Footer component
│   ├── Logo.jsx             # Logo component
│   ├── HomePageClient.jsx   # Homepage client component
│   ├── ShareDropdown.jsx    # Social sharing component
│   └── ClientWrapper.jsx    # Client wrapper component
├── content/
│   └── posts/               # Markdown articles
├── lib/
│   └── posts.js             # Post utilities
└── public/                  # Static assets
```

## Deployment

The project is ready for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

## Contributing

This is a private project. For any issues or suggestions, please contact the development team.

## License

All rights reserved. © 2024 Tech & the City