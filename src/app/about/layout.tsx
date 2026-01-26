import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Amy Yuan — PhD in Computational Physics from USC, Stanford postdoc, co-founder of PROVEN ($150M+ revenue), AI researcher, and mountaineer.',
  keywords: ['Amy Yuan', 'About', 'Biography', 'PhD Physics', 'Stanford', 'USC', 'PROVEN', 'AI Researcher', 'Mountaineer'],
  openGraph: {
    title: 'About Amy Yuan',
    description: 'PhD in Computational Physics, Stanford postdoc, co-founder of PROVEN ($150M+ revenue), AI researcher, and mountaineer.',
    images: [{ url: '/profile.jpg', width: 800, height: 800, alt: 'Amy Yuan' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Amy Yuan',
    description: 'PhD in Computational Physics, Stanford postdoc, co-founder of PROVEN ($150M+ revenue), AI researcher, and mountaineer.',
    images: ['/profile.jpg'],
  },
  alternates: {
    canonical: 'https://amyzyuan.com/about',
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
