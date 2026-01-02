'use client'

import { useState } from 'react'
import LandingView from '@/components/LandingView'
import ChatView from '@/components/ChatView'

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [initialTopic, setInitialTopic] = useState<string | undefined>()
  const [initialCommand, setInitialCommand] = useState<string | undefined>()

  const handleOpenChat = (topic?: string, command?: string) => {
    setInitialTopic(topic)
    setInitialCommand(command)
    setShowChat(true)
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
        onClose={() => setShowChat(false)}
        initialTopic={initialTopic}
        initialCommand={initialCommand}
      />
    </main>
  )
}
