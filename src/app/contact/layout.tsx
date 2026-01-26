import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Amy Yuan. Interested in hard problems, unusual backgrounds, and people who ship.',
  openGraph: {
    title: 'Contact | Amy Yuan',
    description: 'Get in touch with Amy Yuan.',
  },
  alternates: {
    canonical: 'https://amyzyuan.com/contact',
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
