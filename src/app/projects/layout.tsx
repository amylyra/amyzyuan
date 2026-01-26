import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects by Amy Yuan — Durin (market intelligence AI), Pawgress (family AI), PROVEN & Noteworthy ($150M+ revenue), and more.',
  keywords: ['Amy Yuan', 'Projects', 'Durin', 'Pawgress', 'PROVEN', 'Noteworthy', 'AI Products', 'Startups'],
  openGraph: {
    title: 'Projects | Amy Yuan',
    description: 'Durin, Pawgress, PROVEN, Noteworthy, and other AI and consumer products.',
    images: [{ url: '/profile.jpg', width: 800, height: 800, alt: 'Amy Yuan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Projects | Amy Yuan',
    description: 'Durin, Pawgress, PROVEN, Noteworthy, and other AI and consumer products.',
    images: ['/profile.jpg'],
  },
  alternates: {
    canonical: 'https://amyzyuan.com/projects',
  },
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
