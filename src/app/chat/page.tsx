'use client'

import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ChatView from '@/components/ChatView'

function ChatContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialMessage = searchParams.get('q') || undefined

  const handleClose = () => {
    router.push('/')
  }

  return (
    <ChatView
      showChat={true}
      onClose={handleClose}
      initialMessage={initialMessage}
    />
  )
}

export default function ChatPage() {
  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      <Suspense fallback={null}>
        <ChatContent />
      </Suspense>
    </main>
  )
}
