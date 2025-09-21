import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: {
    default: 'Tech & the City',
    template: '%s | Tech & the City'
  },
  description: 'Culture × Tech across Europe, with Athens energy. Essays, on‑feet interviews, and field notes from the European startup scene.',
  keywords: ['tech', 'culture', 'startups', 'europe', 'athens', 'ai', 'innovation'],
  authors: [{ name: 'The Pharmacist' }],
  creator: 'Tech & the City',
  publisher: 'Tech & the City',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://techandthecity.com',
    siteName: 'Tech & the City',
    title: 'Tech & the City',
    description: 'Culture × Tech across Europe, with Athens energy.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tech & the City',
    description: 'Culture × Tech across Europe, with Athens energy.',
    creator: '@techandthecity',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'GA_MEASUREMENT_ID', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `,
          }}
        />
      </head>
      <body className="bg-gradient-to-b from-gray-800 to-gray-600 text-white antialiased">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}