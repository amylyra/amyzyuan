'use client'

import { useState, useEffect } from 'react'

interface NavigationProps {
  onChatClick: () => void
}

export default function Navigation({ onChatClick }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-coal/80 backdrop-blur-xl border-b border-ash/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <a 
          href="/" 
          className="text-lg tracking-tight text-cream hover:text-ember transition-colors duration-300"
          style={{ fontFamily: 'var(--font-family-display)' }}
        >
          amy yuan
        </a>
        
        <div className="flex items-center gap-8">
          <a 
            href="https://linkedin.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-fog hover:text-cream transition-colors duration-300"
          >
            LinkedIn
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-fog hover:text-cream transition-colors duration-300"
          >
            X
          </a>
          <button
            onClick={onChatClick}
            className="relative group px-4 py-2 text-sm text-coal bg-cream rounded-full hover:bg-ember hover:text-cream transition-all duration-300"
          >
            <span className="relative z-10">Chat with me</span>
          </button>
        </div>
      </div>
    </nav>
  )
}

