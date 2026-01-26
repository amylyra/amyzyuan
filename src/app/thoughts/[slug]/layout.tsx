import { Metadata } from 'next'
import { getEssayBySlug } from '@/data/essays'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const essay = getEssayBySlug(slug)

  if (!essay) {
    return {
      title: 'Essay Not Found',
    }
  }

  return {
    title: essay.title,
    description: essay.preview,
    keywords: ['Amy Yuan', 'Essay', essay.title, 'AI', 'Building', 'Climbing', 'Reflections'],
    openGraph: {
      title: `${essay.title} | Amy Yuan`,
      description: essay.preview,
      type: 'article',
      publishedTime: essay.isoDate,
      authors: ['Zaoshi (Amy) Yuan'],
      images: [{ url: '/profile.jpg', width: 800, height: 800, alt: 'Amy Yuan' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: essay.title,
      description: essay.preview,
      images: ['/profile.jpg'],
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
