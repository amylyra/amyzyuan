'use client'

import { useRouter } from 'next/navigation'
import ChatView from '@/components/ChatView'
import { AboutSeoContent } from '@/components/SeoContent'

// Note: metadata export not supported in client components
// Metadata is handled in layout or via generateMetadata in a wrapper

export default function AboutPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/')
  }

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      <AboutSeoContent />
      <ChatView
        showChat={true}
        onClose={handleClose}
        initialMessage="Tell me about yourself"
        initialResponse="about"
        isAbout={true}
      />
    </main>
  )
}
