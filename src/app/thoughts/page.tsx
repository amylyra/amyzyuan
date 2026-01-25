'use client'

import { useRouter } from 'next/navigation'
import ChatView from '@/components/ChatView'

export default function ThoughtsPage() {
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
        initialMessage="What are your thoughts?"
        initialResponse="thoughts"
        isThoughts={true}
      />
    </main>
  )
}
