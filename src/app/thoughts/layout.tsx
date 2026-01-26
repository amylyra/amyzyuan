import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Thoughts',
  description: 'Essays and reflections by Amy Yuan on AI, building, climbing, and what holds up in the world.',
  openGraph: {
    title: 'Thoughts | Amy Yuan',
    description: 'Essays on AI, building, climbing, and what holds up in the world.',
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
