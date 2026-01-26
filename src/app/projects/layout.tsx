import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Projects by Amy Yuan — Durin (market intelligence AI), Pawgress (family AI), PROVEN & Noteworthy ($150M+ revenue), and more.',
  openGraph: {
    title: 'Projects | Amy Yuan',
    description: 'Durin, Pawgress, PROVEN, Noteworthy, and other AI and consumer products.',
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
