'use client'

import { useRouter } from 'next/navigation'
import ChatView from '@/components/ChatView'
import { ThoughtsSeoContent } from '@/components/SeoContent'
import { BreadcrumbJsonLd } from '@/components/JsonLd'

export default function ThoughtsPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/')
  }

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      <ThoughtsSeoContent />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://amyzyuan.com' },
          { name: 'Thoughts', url: 'https://amyzyuan.com/thoughts' },
        ]}
      />
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
