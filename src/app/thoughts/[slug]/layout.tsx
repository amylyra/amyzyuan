import { Metadata } from 'next'

// Essay data for metadata
const essays: Record<string, { title: string; description: string; date: string }> = {
  'on-being-drawn-upward': {
    title: 'On Being Drawn Upward — Why I Climb',
    description: 'A reflection on what remains when ambition falls away and only attention, discipline, and limits endure. Snow teaches impermanence. Ice demands honesty. Rock invites dialogue.',
    date: '2024-03-01',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const essay = essays[slug]

  if (!essay) {
    return {
      title: 'Essay Not Found',
    }
  }

  return {
    title: essay.title,
    description: essay.description,
    openGraph: {
      title: `${essay.title} | Amy Yuan`,
      description: essay.description,
      type: 'article',
      publishedTime: essay.date,
      authors: ['Zaoshi (Amy) Yuan'],
    },
    twitter: {
      card: 'summary_large_image',
      title: essay.title,
      description: essay.description,
    },
    alternates: {
      canonical: `https://amyzyuan.com/thoughts/${slug}`,
    },
  }
}

export default function EssayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
