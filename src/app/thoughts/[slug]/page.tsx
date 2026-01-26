'use client'

import { useRouter, useParams } from 'next/navigation'
import ChatView from '@/components/ChatView'
import { EssaySeoContent } from '@/components/SeoContent'
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd'
import { essays } from '@/components/ThoughtsContent'

export default function EssayPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const essay = essays.find(e => e.id === slug)

  const handleClose = () => {
    router.push('/')
  }

  // Calculate word count for article schema
  const wordCount = essay?.paragraphs.join(' ').split(/\s+/).length

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      {essay && (
        <>
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
        </>
      )}
      <ChatView
        showChat={true}
        onClose={handleClose}
        initialMessage="Read essay"
        initialResponse="thoughts"
        isThoughts={true}
        essaySlug={slug}
      />
    </main>
  )
}
