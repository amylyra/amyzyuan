'use client'

import { useState, useMemo, useEffect } from 'react'

interface LandingViewProps {
  showChat: boolean
  onOpenChat: (topic?: string, command?: string) => void
}

const autocompleteSuggestions = [
  "What is your background?",
  "What projects are you working on?",
  "Tell me about PROVEN",
  "Tell me about Durin",
  "Tell me about Noteworthy",
  "What's your technical stack?",
  "How did you scale to $150M?",
  "What are your research interests?",
  "Tell me about your mountaineering",
  "How can I contact you?",
]

const rotatingPlaceholders = [
  "Tell me about Amy's background",
  "Tell me about PROVEN and how it scaled",
  "How can I get in touch or collaborate?",
  "What has Amy built?",
  "What does Amy think of this idea?",
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
      onOpenChat()
    }
  }

  const handleTopic = (topic: string) => {
    onOpenChat(topic)
  }

  const topics = [
    {
      topic: 'about',
      label: 'About Me',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      )
    },
    {
      topic: 'projects',
      label: 'My Projects',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          <path d="M3 7l3-4h12l3 4" />
        </svg>
      )
    },
    {
      topic: 'research',
      label: 'My Research',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          <path d="M18 13l-1.5-7.5L2 2l7.5 1.5L18 13z"/>
        </svg>
      )
    },
    {
      topic: 'climbing',
      label: 'Mountaineering',
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 20l5-7 3 4 4-6 4 9H4z" />
          <circle cx="17" cy="6" r="2" />
        </svg>
      )
    },
  ]

  return (
    <div
      className={`relative z-10 min-h-screen flex flex-col transition-all duration-500 ease-out ${
        showChat ? 'opacity-0 -translate-y-6 pointer-events-none absolute w-full' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Centered Content - Full Screen */}
      <div className="min-h-screen flex flex-col items-center justify-center px-8 max-md:px-5 py-16 max-md:py-10">
        <div className="w-full max-w-[800px]">

            {/* Greeting & Metrics */}
            <div className="mb-14 max-md:mb-8">
              <h1 className="text-[3rem] font-semibold text-[var(--color-fg)] mb-3 tracking-[-0.03em] max-md:text-[2rem]">
                Hi, I&apos;m Zaoshi (<span className="text-[#C73E3A]">Amy</span>) Yuan
              </h1>
              <p className="text-[1.15rem] text-[var(--color-muted)] mb-5 max-md:text-[1rem] max-md:mb-4">
                Founder, Researcher, Mountaineer — Building AI systems that work at scale.
              </p>

              {/* Metrics */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[1rem] text-[var(--color-muted)] max-md:text-[0.9rem] max-md:gap-x-4">
                <span><strong className="text-[#C73E3A] font-semibold">$150M+</strong> revenue</span>
                <span className="text-[var(--color-border)]">·</span>
                <span><strong className="text-[var(--color-fg)] font-semibold">3</strong> companies</span>
                <span className="text-[var(--color-border)]">·</span>
                <span><strong className="text-[var(--color-fg)] font-semibold">10</strong> publications</span>
                <span className="text-[var(--color-border)]">·</span>
                <span><strong className="text-[var(--color-fg)] font-semibold">2</strong> patents</span>
              </div>
            </div>

            {/* Topic Cards */}
            <div className="grid grid-cols-4 gap-3 mb-10 max-md:grid-cols-4 max-md:gap-2 max-md:mb-6">
              {topics.map((item) => (
                <button
                  key={item.topic}
                  onClick={() => handleTopic(item.topic)}
                  className="flex flex-col items-center gap-3 p-5 text-center bg-transparent border border-[var(--color-border)] rounded-2xl transition-all duration-150 hover:bg-[var(--color-card-bg)] hover:border-[var(--color-muted)] hover:shadow-md group max-md:p-3 max-md:gap-2 max-md:rounded-xl"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--color-fg)]/5 flex items-center justify-center text-[var(--color-muted)] group-hover:bg-[var(--color-fg)]/10 group-hover:text-[var(--color-fg)] transition-all max-md:w-8 max-md:h-8">
                    {item.icon}
                  </div>
                  <span className="text-[0.85rem] font-medium text-[var(--color-fg)] max-md:text-[0.7rem]">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Input - Primary Focus */}
            <form onSubmit={handleSubmit} className="relative mb-5 max-md:mb-4">
              <div className="flex items-center gap-3 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-full px-5 py-3.5 transition-all duration-150 focus-within:border-[var(--color-muted)] focus-within:shadow-lg max-md:px-4 max-md:py-3">
                {/* Plus icon */}
                <button type="button" className="w-8 h-8 flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors flex-shrink-0">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                </button>
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
                  className="flex-1 border-0 bg-transparent text-[1rem] outline-none text-[var(--color-fg)] placeholder:text-[var(--color-light-muted)] min-w-0 max-md:text-[0.95rem]"
                />
                {/* Send button */}
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-[var(--color-fg)] border-0 rounded-full text-white flex items-center justify-center transition-all duration-100 flex-shrink-0 disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-80 active:scale-95 max-md:w-9 max-md:h-9"
                  aria-label="Send message"
                >
                  <svg className="w-5 h-5 max-md:w-4 max-md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </button>
              </div>

              {/* Autocomplete dropdown */}
              {showAutocomplete && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl shadow-xl overflow-hidden z-10">
                  {filteredSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setInput(suggestion)
                        setShowAutocomplete(false)
                      }}
                      className="w-full text-left px-5 py-3 text-[1rem] text-[var(--color-fg)] hover:bg-[var(--color-surface)] transition-colors duration-100 flex items-center gap-3"
                    >
                      <svg className="w-4 h-4 text-[var(--color-muted)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8"/>
                        <path d="M21 21l-4.35-4.35"/>
                      </svg>
                      <span className="truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Quick prompts - Left aligned */}
            <div className="flex flex-wrap gap-2.5 max-md:gap-2">
              {[
                { cmd: 'chat', label: 'Chat' },
                { cmd: 'contact_info', label: 'Get in touch' },
                { cmd: 'technical', label: 'Tech Stack' },
                { cmd: 'brainstorm', label: 'Brainstorm' },
                { cmd: 'noteworthy', label: 'Noteworthy' },
                { cmd: 'research', label: 'Research' },
              ].map(({ cmd, label }) => (
                <button
                  key={cmd}
                  onClick={() => onOpenChat(undefined, cmd)}
                  className="px-4 py-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-full text-[0.8rem] font-medium text-[var(--color-muted)] transition-all duration-150 hover:border-[var(--color-muted)] hover:text-[var(--color-fg)] hover:shadow-sm active:scale-[0.98] max-md:text-[0.75rem] max-md:px-3 max-md:py-1.5"
                >
                  {label}
                </button>
              ))}
            </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="flex-none border-t border-[var(--color-border)] mt-auto">
        <div className="max-w-[900px] mx-auto px-8 py-10 max-md:px-5 max-md:py-8">
          <div className="grid grid-cols-4 gap-8 max-md:grid-cols-2 max-md:gap-6">
            {/* Brand */}
            <div className="col-span-2 max-md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[#C73E3A] rounded-full" />
                <span className="text-[0.95rem] font-semibold text-[var(--color-fg)]">Amy Yuan</span>
              </div>
              <p className="text-[0.85rem] text-[var(--color-muted)] leading-relaxed max-w-[280px]">
                Building AI systems that work at scale. Stanford computational physics. Currently exploring the frontier of AI infrastructure.
              </p>
            </div>

            {/* Connect */}
            <div>
              <h4 className="text-[0.8rem] font-medium text-[var(--color-fg)] uppercase tracking-wider mb-3">Connect</h4>
              <div className="flex flex-col gap-2">
                <a href="https://linkedin.com/in/amyzyuan" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">LinkedIn</a>
                <a href="https://github.com/amylyra" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">GitHub</a>
                <a href="https://twitter.com/amyzyuan" target="_blank" rel="noopener noreferrer" className="text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">Twitter</a>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-[0.8rem] font-medium text-[var(--color-fg)] uppercase tracking-wider mb-3">Contact</h4>
              <div className="flex flex-col gap-2">
                <a href="mailto:amy@example.com" className="text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors">amy@example.com</a>
                <span className="text-[0.85rem] text-[var(--color-muted)]">San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-[0.8rem] text-[var(--color-light-muted)] max-md:flex-col max-md:gap-2">
            <span>© {new Date().getFullYear()} Zaoshi (Amy) Yuan</span>
            <span>Built with Next.js</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
