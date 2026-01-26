'use client'

import { useRouter } from 'next/navigation'
import ChatView from '@/components/ChatView'
import { ProjectsSeoContent } from '@/components/SeoContent'

export default function ProjectsPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/')
  }

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      <ProjectsSeoContent />
      <ChatView
        showChat={true}
        onClose={handleClose}
        initialMessage="What are your projects?"
        initialResponse="projects"
        isProjects={true}
      />
    </main>
  )
}
