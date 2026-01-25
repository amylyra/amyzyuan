'use client'

import { useRouter, useParams } from 'next/navigation'
import ChatView from '@/components/ChatView'

export default function EssayPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const handleClose = () => {
    router.push('/')
  }

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
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
