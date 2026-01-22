'use client'

import { useRouter } from 'next/navigation'
import ChatView from '@/components/ChatView'

const ABOUT_CONTENT = `about` // Marker for AboutContent component

export default function AboutPage() {
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
        initialResponse={ABOUT_CONTENT}
        isAbout={true}
      />
    </main>
  )
}
