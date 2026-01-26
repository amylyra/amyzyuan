import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Amy Yuan — PhD in Computational Physics from USC, Stanford postdoc, co-founder of PROVEN ($150M+ revenue), AI researcher, and mountaineer.',
  openGraph: {
    title: 'About Amy Yuan',
    description: 'PhD in Computational Physics, Stanford postdoc, co-founder of PROVEN ($150M+ revenue), AI researcher, and mountaineer.',
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
