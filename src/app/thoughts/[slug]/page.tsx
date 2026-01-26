'use client'

import { useRouter, useParams } from 'next/navigation'
import ChatView from '@/components/ChatView'
import { EssaySeoContent } from '@/components/SeoContent'
import { essays } from '@/components/ThoughtsContent'

export default function EssayPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const essay = essays.find(e => e.id === slug)

  const handleClose = () => {
    router.push('/')
  }

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      {essay && (
        <EssaySeoContent
          title={essay.title}
          date={essay.date}
          paragraphs={essay.paragraphs}
        />
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
