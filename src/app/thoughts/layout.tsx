import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thoughts',
  description: 'Essays and reflections by Amy Yuan on AI, building, climbing, and what holds up in the world.',
  keywords: ['Amy Yuan', 'Essays', 'Thoughts', 'AI', 'AI Alignment', 'AGI', 'Superintelligence', 'Building', 'Climbing', 'Mountaineering', 'Reflections'],
  openGraph: {
    title: 'Thoughts | Amy Yuan',
    description: 'Essays on AI, building, climbing, and what holds up in the world.',
    images: [{ url: '/profile.jpg', width: 800, height: 800, alt: 'Amy Yuan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thoughts | Amy Yuan',
    description: 'Essays on AI, building, climbing, and what holds up in the world.',
    images: ['/profile.jpg'],
  },
  alternates: {
    canonical: 'https://amyzyuan.com/thoughts',
  },
}

export default function ThoughtsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
