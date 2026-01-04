'use client'

import { useState, useMemo, useEffect } from 'react'

interface LandingViewProps {
  showChat: boolean
  onOpenChat: (message?: string) => void
}

const autocompleteSuggestions = [
  "What is your background?",
  "What projects are you working on?",
  "Tell me about PROVEN",
  "Tell me about Noteworthy",
  "How did you scale to $150M?",
  "What are your research interests?",
  "Tell me about your mountaineering",
  "How can I contact you?",
]

const rotatingPlaceholders = [
  "What would you like to know?",
  "Ask about PROVEN...",
  "Ask about my research...",
  "Bounce an idea off me...",
]

export default function LandingView({ showChat, onOpenChat }: LandingViewProps) {
  const [input, setInput] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const filteredSuggestions = useMemo(() => {
    if (!input.trim() || input.length < 2) return []
    const lower = input.toLowerCase()
    return autocompleteSuggestions
      .filter(s => s.toLowerCase().includes(lower))
      .slice(0, 4)
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      onOpenChat(input.trim())
      setInput('')
    }
  }

  const topics = [
    { message: 'Tell me about PROVEN', label: 'proven', color: 'text-[#F59E0B]' },
    { message: 'Tell me about Noteworthy', label: 'noteworthy', color: 'text-[#8B5CF6]' },
    { message: 'What are your research interests?', label: 'research', color: 'text-[#06B6D4]' },
    { message: 'Tell me about your mountaineering', label: 'climbing', color: 'text-[#10B981]' },
  ]

  return (
    <div
      className={`relative z-10 min-h-screen flex flex-col transition-all duration-500 ease-out ${
        showChat ? 'opacity-0 -translate-y-6 pointer-events-none absolute w-full' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Top Navigation */}
      <nav className="flex-none border-b border-[var(--color-border)]">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between max-md:px-4 max-md:py-3">
          <span className="text-[0.85rem] font-bold tracking-[0.2em] text-[var(--color-fg)] uppercase">
            Amy Yuan
          </span>
          <div className="flex items-center gap-10 max-md:gap-4">
            <button onClick={() => onOpenChat('Tell me about yourself')} className="text-[0.85rem] font-medium tracking-[0.05em] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors uppercase max-md:text-[0.75rem]">
              About
            </button>
            <button onClick={() => onOpenChat('What projects are you working on?')} className="text-[0.85rem] font-medium tracking-[0.05em] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors uppercase max-md:text-[0.75rem]">
              Projects
            </button>
            <button onClick={() => onOpenChat('Tell me about your mountaineering')} className="text-[0.85rem] font-medium tracking-[0.05em] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors uppercase max-md:text-[0.75rem]">
              Climbing
            </button>
            <button onClick={() => onOpenChat('How can I contact you?')} className="text-[0.85rem] font-medium tracking-[0.05em] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors uppercase max-md:text-[0.75rem]">
              Contact
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-8 max-md:px-4 py-8 max-md:py-6">
        <div className="w-full max-w-[900px] mx-auto">

          {/* Name */}
          <h1 className="text-[4.5rem] font-bold tracking-[-0.03em] leading-none mb-3 max-md:text-[2.5rem]">
            Amy Yuan
          </h1>

          {/* Role Descriptors */}
          <div className="flex items-center gap-3 mb-5 max-md:mb-4">
            <span className="text-[0.8rem] font-medium tracking-[0.15em] text-[var(--color-muted)] uppercase">Founder</span>
            <span className="text-[var(--color-border)]">·</span>
            <span className="text-[0.8rem] font-medium tracking-[0.15em] text-[var(--color-muted)] uppercase">Researcher</span>
            <span className="text-[var(--color-border)]">·</span>
            <span className="text-[0.8rem] font-medium tracking-[0.15em] text-[var(--color-muted)] uppercase">Mountaineer</span>
          </div>

          {/* Credentials - compact single section */}
          <div className="text-[0.82rem] text-[var(--color-muted)] mb-6 max-md:mb-5 font-mono leading-relaxed">
            <span>Ph.D Computational Physics</span>
            <span className="mx-2 text-[var(--color-border)]">·</span>
            <span>2 Patents</span>
            <span className="mx-2 text-[var(--color-border)]">·</span>
            <span>10 Papers</span>
            <span className="mx-2 text-[var(--color-border)]">·</span>
            <span>Glaciers on 4 continents</span>
          </div>

          {/* Terminal Window - Claude Code Style */}
          <div className="rounded-xl overflow-hidden shadow-xl mb-4 max-md:mb-3 border border-[#333]">
            {/* Window Chrome */}
            <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center gap-2 border-b border-[#333]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27CA3F]" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-[0.75rem] text-[#666] font-mono">amy — ask me anything</span>
              </div>
              <div className="w-[46px]" />
            </div>

            {/* Terminal Content */}
            <div className="bg-[#0d0d0d] p-5 max-md:p-4">
              {/* Welcome message */}
              <div className="mb-4 font-mono text-[0.9rem] leading-relaxed max-md:text-[0.8rem]">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-[#06B6D4]">╭─</span>
                  <span className="text-[#888]">I built AI that scaled personalization to</span>
                  <span className="text-[#F59E0B] font-semibold">$150M+</span>
                </div>
                <div className="flex items-start gap-2 mb-3">
                  <span className="text-[#06B6D4]">╰─</span>
                  <span className="text-[#888]">This one knows everything I know. Ask away.</span>
                </div>
              </div>

              {/* Input line */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center gap-2 font-mono">
                  <span className="text-[#10B981] font-semibold">amy</span>
                  <span className="text-[#666]">~</span>
                  <span className="text-[#8B5CF6]">❯</span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      setShowAutocomplete(true)
                    }}
                    onFocus={() => setShowAutocomplete(true)}
                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
                    placeholder={rotatingPlaceholders[placeholderIndex]}
                    className="flex-1 bg-transparent border-0 text-[0.9rem] text-[#E0E0E0] placeholder:text-[#444] font-mono outline-none max-md:text-[0.85rem]"
                  />
                </div>

                {/* Autocomplete dropdown */}
                {showAutocomplete && filteredSuggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden z-10">
                    {filteredSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setInput(suggestion)
                          setShowAutocomplete(false)
                        }}
                        className="w-full text-left px-4 py-2 text-[0.85rem] text-[#AAA] font-mono hover:bg-[#252525] transition-colors flex items-center gap-2"
                      >
                        <span className="text-[#666]">→</span>
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </form>

              {/* Topic chips */}
              <div className="flex flex-wrap gap-2 mt-5 pt-4 border-t border-[#222]">
                {topics.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onOpenChat(item.message)}
                    className={`px-3 py-1.5 bg-[#1a1a1a] border border-[#333] rounded-md text-[0.8rem] font-mono transition-all hover:border-[#444] hover:bg-[#222] flex items-center gap-1.5`}
                  >
                    <span className={item.color}>/</span>
                    <span className="text-[#888]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Helper text */}
          <div className="text-[0.75rem] text-[var(--color-muted)] font-mono">
            <kbd className="px-1.5 py-0.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded text-[0.7rem]">↵</kbd>
            <span className="mx-1.5">send</span>
            <span className="text-[var(--color-border)] mx-2">·</span>
            <kbd className="px-1.5 py-0.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded text-[0.7rem]">tab</kbd>
            <span className="mx-1.5">autocomplete</span>
          </div>

        </div>
      </div>

      {/* Bottom Navigation Icons */}
      <footer className="flex-none py-6 border-t border-[var(--color-border)] max-md:py-4">
        <div className="flex items-center justify-center gap-12 max-md:gap-6">
          <button onClick={() => onOpenChat('Tell me about yourself')} className="flex flex-col items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <span className="text-[0.65rem] font-medium tracking-[0.1em] uppercase">About</span>
          </button>
          <button onClick={() => onOpenChat('What projects are you working on?')} className="flex flex-col items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="text-[0.65rem] font-medium tracking-[0.1em] uppercase">Work</span>
          </button>
          <button onClick={() => onOpenChat('What are your research interests?')} className="flex flex-col items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 6v12M6 12h12" strokeLinecap="round" />
              <rect x="3" y="3" width="18" height="18" rx="2" />
            </svg>
            <span className="text-[0.65rem] font-medium tracking-[0.1em] uppercase">Research</span>
          </button>
          <button onClick={() => onOpenChat('Tell me about your mountaineering')} className="flex flex-col items-center gap-1.5 text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polygon points="12,2 22,22 2,22" />
            </svg>
            <span className="text-[0.65rem] font-medium tracking-[0.1em] uppercase">Climbing</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
