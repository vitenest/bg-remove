import '../index.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WebMCPProvider from '../components/WebMCPProvider';
import AdBlockDetector from '../components/AdBlockDetector';
import Script from 'next/script';

export const metadata = {
  metadataBase: new URL('https://bg-remove.com'),
  title: 'bg-remove.com - AI Background Remover',
  description: 'Remove backgrounds from images and videos effortlessly with advanced AI.',
  authors: [{ name: 'bg-remove.com' }],
  creator: 'bg-remove.com',
  publisher: 'bg-remove.com',
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5C46Z2K8');
          `}
        </Script>
      </head>
      <body>
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-5C46Z2K8"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        <AdBlockDetector />
        <WebMCPProvider />
        <Navbar />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
