'use client'

import { useState } from 'react'
import Hero from '@/components/Hero'
import Chat from '@/components/Chat'
import Navigation from '@/components/Navigation'

export default function Home() {
  const [showChat, setShowChat] = useState(false)

  return (
    <main className="relative min-h-screen">
      <Navigation onChatClick={() => setShowChat(true)} />
      
      {!showChat ? (
        <Hero onStartChat={() => setShowChat(true)} />
      ) : (
        <Chat onClose={() => setShowChat(false)} />
      )}
      
      {/* Ambient gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div 
          className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, var(--color-ember) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
        <div 
          className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full opacity-[0.02]"
          style={{
            background: 'radial-gradient(circle, var(--color-amber) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>
    </main>
  )
}

