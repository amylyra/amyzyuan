'use client'

import { useParams } from 'next/navigation'
import EssayView from '@/components/EssayView'
import { EssaySeoContent } from '@/components/SeoContent'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import { essays } from '@/data/essays'

export default function EssayPage() {
  const params = useParams()
  const slug = params.slug as string

  const essay = essays.find(e => e.id === slug)

  if (!essay) {
    return (
      <main className="relative min-h-screen bg-[var(--color-bg)]">
        <div className="grid-bg" />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-[var(--color-muted)]">Essay not found</p>
        </div>
      </main>
    )
  }

  const wordCount = essay.paragraphs.join(' ').split(/\s+/).length

  return (
    <main className="relative min-h-screen bg-[var(--color-bg)]">
      <div className="grid-bg" />
      <EssaySeoContent
        title={essay.title}
        date={essay.date}
        paragraphs={essay.paragraphs}
      />
      <ArticleJsonLd
        title={essay.title}
        description={essay.preview}
        datePublished={essay.isoDate}
        url={`https://amyzyuan.com/thoughts/${slug}`}
        wordCount={wordCount}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://amyzyuan.com' },
          { name: 'Thoughts', url: 'https://amyzyuan.com/thoughts' },
          { name: essay.title, url: `https://amyzyuan.com/thoughts/${slug}` },
        ]}
      />
      <EssayView essay={essay} />
    </main>
  )
}
