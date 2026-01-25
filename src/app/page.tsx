'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import LandingView from '@/components/LandingView'

export default function Home() {
  const router = useRouter()

  const handleOpenChat = useCallback((message?: string) => {
    if (message) {
      router.push(`/chat?q=${encodeURIComponent(message)}`)
    } else {
      router.push('/chat')
    }
  }, [router])

  const handleOpenAbout = useCallback(() => {
    router.push('/about')
  }, [router])

  const handleOpenProjects = useCallback(() => {
    router.push('/projects')
  }, [router])

  const handleOpenThoughts = useCallback(() => {
    router.push('/thoughts')
  }, [router])

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      <LandingView
        showChat={false}
        onOpenChat={handleOpenChat}
        onOpenAbout={handleOpenAbout}
        onOpenProjects={handleOpenProjects}
        onOpenThoughts={handleOpenThoughts}
      />
    </main>
  )
}
