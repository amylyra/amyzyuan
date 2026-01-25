import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
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
  title: 'Zaoshi (Amy) Yuan',
  description: 'Founder, Researcher, Mountaineer — Trained in large-scale computational physics. Co-founded and scaled an AI-powered personalization company to $150M+ in total revenue.',
  keywords: ['Amy Yuan', 'Zaoshi Yuan', 'AI', 'Founder', 'Researcher', 'Computational Physics'],
  authors: [{ name: 'Zaoshi (Amy) Yuan' }],
  openGraph: {
    title: 'Zaoshi (Amy) Yuan',
    description: 'Founder, Researcher, Mountaineer',
    type: 'website',
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
        {children}
      </body>
    </html>
  )
}

