'use client'

import { useState } from 'react'
import LandingView from '@/components/LandingView'
import ChatView from '@/components/ChatView'

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | undefined>()

  const handleOpenChat = (message?: string) => {
    setInitialMessage(message)
    setShowChat(true)
  }

  const handleCloseChat = () => {
    setShowChat(false)
    setInitialMessage(undefined)
  }

  return (
    <main className="relative min-h-screen">
      {/* Grid background */}
      <div className="grid-bg" />

      {/* Landing View */}
      <LandingView
        showChat={showChat}
        onOpenChat={handleOpenChat}
      />

      {/* Chat View (Full Screen) */}
      <ChatView
        showChat={showChat}
        onClose={handleCloseChat}
        initialMessage={initialMessage}
      />
    </main>
  )
}
