import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import JsonLd from '@/components/JsonLd'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  interactiveWidget: 'resizes-content',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://amyzyuan.com'),
  title: {
    default: 'Amy Yuan | Founder, Researcher, Mountaineer',
    template: '%s | Amy Yuan',
  },
  description: 'Founder, Researcher, Mountaineer — Trained in large-scale computational physics at Stanford and USC. Co-founded and scaled an AI-powered personalization company to $150M+ in total revenue. Building AI systems above the model layer.',
  keywords: ['Amy Yuan', 'Zaoshi Yuan', 'AI', 'Founder', 'Researcher', 'Computational Physics', 'Stanford', 'PROVEN', 'Durin', 'Mountaineering', 'Machine Learning', 'Personalization'],
  authors: [{ name: 'Zaoshi (Amy) Yuan', url: 'https://amyzyuan.com' }],
  creator: 'Zaoshi (Amy) Yuan',
  publisher: 'Zaoshi (Amy) Yuan',
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
    title: 'Amy Yuan | Founder, Researcher, Mountaineer',
    description: 'Founder, Researcher, Mountaineer — Building AI systems above the model layer. Stanford/USC Physics. $150M+ shipped.',
    url: 'https://amyzyuan.com',
    siteName: 'Amy Yuan',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/profile.jpg',
        width: 800,
        height: 800,
        alt: 'Amy Yuan',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Amy Yuan | Founder, Researcher, Mountaineer',
    description: 'Building AI systems above the model layer. Stanford/USC Physics. $150M+ shipped.',
    images: ['/profile.jpg'],
  },
  alternates: {
    canonical: 'https://amyzyuan.com',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.fontshare.com" crossOrigin="anonymous" />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FPBGHYV3V3"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FPBGHYV3V3');
          `}
        </Script>
      </head>
      <body className="noise-overlay">
        <JsonLd />
        {children}
      </body>
    </html>
  )
}

