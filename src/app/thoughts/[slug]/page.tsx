'use client'

import { useRouter } from 'next/navigation'
import ChatView from '@/components/ChatView'

export default function EssayPage({ params }: { params: { slug: string } }) {
  const router = useRouter()

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
        essaySlug={params.slug}
      />
    </main>
  )
}
