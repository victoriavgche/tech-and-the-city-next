import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import AnalyticsScript from '@/components/AnalyticsScript';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata = {
  title: {
    default: 'Tech and the City',
    template: '%s | Tech and the City'
  },
  description: 'Exploring technology, innovation, and the future of cities. Discover the latest trends in urban tech, smart cities, and digital transformation.',
  keywords: ['technology', 'smart cities', 'innovation', 'urban tech', 'digital transformation', 'future cities'],
  authors: [{ name: 'Tech and the City Team' }],
  creator: 'Tech and the City',
  publisher: 'Tech and the City',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Tech and the City',
    description: 'Exploring technology, innovation, and the future of cities',
    siteName: 'Tech and the City',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Tech and the City',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech and the City',
    description: 'Exploring technology, innovation, and the future of cities',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="stylesheet" href="https://cdn.quilljs.com/1.3.6/quill.snow.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <meta name="theme-color" content="#6366f1" />
      </head>
      <body className={inter.className}>
        <Nav />
        <main>{children}</main>
        <Footer />
        <AnalyticsScript />
      </body>
    </html>
  );
}


