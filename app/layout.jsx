import { Inter, Poppins } from 'next/font/google';
import "./globals.css";
import { ThemeProvider } from '@/components/theme-provider';
// import { Toaster } from '@/components/ui/toaster';
import { LoadingProvider } from "@/contexts/LoadingContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { QueryProvider } from '@/components/query-provider';
import { Analytics } from '@/components/analytics';
import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";

// Font configurations with better performance
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: {
    default: 'XATUN - Premium Streetwear Collection',
    template: '%s | XATUN'
  },
  description: 'Discover the latest in streetwear fashion. Premium quality clothing, shoes, and accessories for the modern urban lifestyle.',
  keywords: ['streetwear', 'fashion', 'clothing', 'shoes', 'accessories', 'urban style'],
  authors: [{ name: 'XATUN Team' }],
  creator: 'XATUN',
  publisher: 'XATUN',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://xatun.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'XATUN - Premium Streetwear Collection',
    description: 'Discover the latest in streetwear fashion. Premium quality clothing, shoes, and accessories for the modern urban lifestyle.',
    url: 'https://xatun.in',
    siteName: 'XATUN',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'XATUN Streetwear Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'XATUN - Premium Streetwear Collection',
    description: 'Discover the latest in streetwear fashion. Premium quality clothing, shoes, and accessories for the modern urban lifestyle.',
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
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Preload critical fonts */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="XATUN Streetwear - Premium Urban Fashion" />
        <meta property="og:description" content="Discover the latest in streetwear fashion. Premium quality, unique designs, and urban style for the modern individual." />
        <meta property="og:image" content="/og-image.jpg" />
        <meta property="og:url" content="https://xatun.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="XATUN Streetwear - Premium Urban Fashion" />
        <meta name="twitter:description" content="Discover the latest in streetwear fashion. Premium quality, unique designs, and urban style for the modern individual." />
        <meta name="twitter:image" content="/og-image.jpg" />
        
        {/* Additional Meta Tags */}
        <meta name="keywords" content="streetwear, urban fashion, premium clothing, street style, fashion, urban wear, street fashion, urban clothing" />
        <meta name="author" content="XATUN Streetwear" />
        <meta name="application-name" content="XATUN Streetwear" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "XATUN Streetwear",
              "description": "Premium streetwear fashion brand",
              "url": "https://xatun.com",
              "logo": "https://xatun.com/logo.png",
              "sameAs": [
                "https://instagram.com/xatun",
                "https://facebook.com/xatun",
                "https://twitter.com/xatun"
              ]
            })
          }}
        />
        
        {/* Theme Flash Prevention Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('xatun-theme') || 'dark';
                  var root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  root.classList.add(theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased min-h-screen bg-background text-foreground`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <LoadingProvider>
              <LoadingSpinner />
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster />
              <Analytics />
            </LoadingProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
