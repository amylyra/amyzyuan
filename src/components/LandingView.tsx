'use client'

import { useState, useMemo } from 'react'

interface LandingViewProps {
  showChat: boolean
  onOpenChat: (topic?: string, command?: string) => void
}

// Autocomplete suggestions based on common queries
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

export default function LandingView({ showChat, onOpenChat }: LandingViewProps) {
  const [input, setInput] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)

  // Filter autocomplete suggestions based on input
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

  const handleCommand = (cmd: string) => {
    onOpenChat(undefined, cmd)
  }

  const topics = [
    { 
      topic: 'about', 
      label: 'About Me', 
      description: 'My journey and philosophy',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      )
    },
    { 
      topic: 'projects', 
      label: 'Projects', 
      description: 'PROVEN, Durin, Noteworthy',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 7h18v12a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
          <path d="M3 7l3-4h12l3 4" />
        </svg>
      )
    },
    { 
      topic: 'research', 
      label: 'Research', 
      description: '10 publications, 2 patents',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 19l7-7 3 3-7 7-3-3z"/>
          <path d="M18 13l-1.5-7.5L2 2l7.5 1.5L18 13z"/>
        </svg>
      )
    },
    { 
      topic: 'climbing', 
      label: 'Mountaineering', 
      description: 'Adventures in the peaks',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M4 20l5-7 3 4 4-6 4 9H4z" />
          <circle cx="17" cy="6" r="2" />
        </svg>
      )
    },
  ]

  const quickPrompts = [
    { cmd: 'proven', label: 'PROVEN' },
    { cmd: 'durin', label: 'Durin' },
    { cmd: 'noteworthy', label: 'Noteworthy' },
    { cmd: 'technical', label: 'Technical' },
  ]

  return (
    <div 
      className={`relative z-10 min-h-screen flex flex-col transition-all duration-500 ease-out ${
        showChat ? 'opacity-0 -translate-y-6 pointer-events-none absolute w-full' : 'opacity-100 translate-y-0'
      }`}
    >
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-5 max-md:px-5">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#C73E3A] rounded-full" />
          <span className="text-[0.95rem] font-semibold text-[var(--color-fg)]">Amy Yuan</span>
        </div>
        <a
          href="#contact"
          className="flex items-center gap-1.5 text-[0.8rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          Contact
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </header>

      {/* Centered Content - Generous whitespace */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 max-md:px-5 py-16 max-md:py-10">
        <div className="w-full max-w-[580px]">
          {/* Title & Subtitle - Left aligned */}
          <div className="mb-8 max-md:mb-6">
            <h1 className="text-[clamp(2rem,5vw,2.75rem)] font-semibold text-[var(--color-fg)] mb-3 tracking-[-0.02em]">
              Hi, I&apos;m Amy
            </h1>
            <p className="text-[1rem] text-[var(--color-muted)] leading-relaxed max-md:text-[0.95rem]">
              Founder, Researcher, Builder — Trained in computational physics at Stanford. 
              Building AI systems that work at scale.
            </p>
          </div>

          {/* Metrics Row - Left aligned */}
          <div className="flex flex-wrap items-center gap-6 mb-10 max-md:gap-4 max-md:mb-8">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[1.25rem] font-semibold text-[#C73E3A] max-md:text-[1.1rem]">$150M+</span>
              <span className="text-[0.85rem] text-[var(--color-muted)]">revenue</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[1.25rem] font-semibold text-[var(--color-fg)] max-md:text-[1.1rem]">2</span>
              <span className="text-[0.85rem] text-[var(--color-muted)]">patents</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[1.25rem] font-semibold text-[var(--color-fg)] max-md:text-[1.1rem]">3</span>
              <span className="text-[0.85rem] text-[var(--color-muted)]">companies</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[1.25rem] font-semibold text-[var(--color-fg)] max-md:text-[1.1rem]">10</span>
              <span className="text-[0.85rem] text-[var(--color-muted)]">publications</span>
            </div>
          </div>

          {/* Chat Input Card - Emphasized with shadow and generous spacing */}
          <div className="bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-2xl p-6 mb-10 shadow-lg max-md:p-5 max-md:rounded-xl max-md:mb-8">
            {/* Self Introduction */}
            <p className="text-[1rem] leading-[1.75] text-[var(--color-fg)] mb-6 max-md:text-[0.95rem] max-md:mb-5">
              I built personalization algorithms at <strong>PROVEN</strong> that scaled to $150M+, 
              and I&apos;m now working on <strong>Durin</strong> for AI infrastructure and <strong>Noteworthy</strong> for 
              fragrance personalization. What would you like to know?
            </p>

            {/* Input */}
            <form onSubmit={handleSubmit} className="mb-5 max-md:mb-4 relative">
              <div className="flex items-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3 transition-all duration-150 focus-within:border-[var(--color-muted)] focus-within:bg-[var(--color-card-bg)] focus-within:shadow-sm max-md:px-3.5 max-md:py-2.5 max-md:rounded-lg">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value)
                    setShowAutocomplete(true)
                  }}
                  onFocus={() => setShowAutocomplete(true)}
                  onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
                  placeholder="Ask me anything..."
                  className="flex-1 border-0 bg-transparent text-[1rem] py-0.5 outline-none text-[var(--color-fg)] placeholder:text-[var(--color-light-muted)] min-w-0 max-md:text-[0.95rem]"
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="w-9 h-9 bg-[var(--color-fg)] border-0 rounded-lg text-white flex items-center justify-center transition-all duration-100 flex-shrink-0 disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-80 active:scale-95 max-md:w-8 max-md:h-8"
                  aria-label="Send message"
                >
                  <svg className="w-4 h-4 max-md:w-3.5 max-md:h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 19V5M5 12l7-7 7 7"/>
                  </svg>
                </button>
              </div>
              
              {/* Autocomplete dropdown */}
              {showAutocomplete && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg shadow-lg overflow-hidden z-10">
                  {filteredSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setInput(suggestion)
                        setShowAutocomplete(false)
                      }}
                      className="w-full text-left px-4 py-3 text-[0.95rem] text-[var(--color-fg)] hover:bg-[var(--color-surface)] transition-colors duration-100 flex items-center gap-2.5"
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

            {/* Quick Prompts - Left aligned */}
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map(({ cmd, label }) => (
                <button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  className="px-4 py-2 border border-[var(--color-border)] rounded-full text-[0.85rem] text-[var(--color-muted)] bg-transparent transition-all duration-100 hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)] active:scale-[0.98] max-md:px-3 max-md:py-1.5 max-md:text-[0.8rem]"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Cards - Compact on mobile */}
          <div className="mt-6 max-md:mt-4">
            <h2 className="text-[0.75rem] font-medium text-[var(--color-light-muted)] uppercase tracking-[0.1em] mb-4 max-md:mb-2 max-md:text-[0.7rem]">
              Learn more
            </h2>
            <div className="grid grid-cols-4 gap-3 max-md:grid-cols-4 max-md:gap-1.5">
              {topics.map((item) => (
                <button
                  key={item.topic}
                  onClick={() => handleTopic(item.topic)}
                  className="flex flex-col items-center justify-center gap-2 p-4 text-center bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl transition-all duration-150 hover:bg-[var(--color-surface)] hover:border-[var(--color-light-muted)] group max-md:p-2 max-md:gap-1 max-md:rounded-lg"
                >
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-surface)] flex items-center justify-center text-[var(--color-muted)] group-hover:text-[var(--color-fg)] transition-colors max-md:w-6 max-md:h-6 max-md:rounded-md [&>svg]:max-md:w-3 [&>svg]:max-md:h-3">
                    {item.icon}
                  </div>
                  <h3 className="text-[0.85rem] font-medium text-[var(--color-fg)] max-md:text-[0.65rem] max-md:leading-tight">
                    {item.label}
                  </h3>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="flex-none border-t border-[var(--color-border)] bg-[var(--color-card-bg)]/50">
        <div className="max-w-[800px] mx-auto px-6 py-10 max-md:px-5 max-md:py-8">
          {/* Footer Grid */}
          <div className="grid grid-cols-3 gap-8 mb-10 max-md:grid-cols-1 max-md:gap-6 max-md:mb-8">
            {/* Brand Column */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-[#C73E3A] rounded-full" />
                <span className="text-[0.9rem] font-semibold text-[var(--color-fg)]">Amy Yuan</span>
              </div>
              <p className="text-[0.85rem] text-[var(--color-muted)] leading-relaxed">
                Building AI systems that work at scale. Stanford computational physics. $150M+ revenue.
              </p>
            </div>
            
            {/* Connect Column */}
            <div>
              <h4 className="text-[0.8rem] font-medium text-[var(--color-fg)] uppercase tracking-wider mb-3">Connect</h4>
              <div className="flex flex-col gap-2">
                <a 
                  href="https://linkedin.com/in/amyzyuan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  LinkedIn
                </a>
                <a 
                  href="https://github.com/amylyra" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  GitHub
                </a>
                <a 
                  href="https://twitter.com/amyzyuan" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  Twitter
                </a>
              </div>
            </div>
            
            {/* Contact Column */}
            <div>
              <h4 className="text-[0.8rem] font-medium text-[var(--color-fg)] uppercase tracking-wider mb-3">Contact</h4>
              <div className="flex flex-col gap-2">
                <a 
                  href="mailto:amy@example.com"
                  className="text-[0.85rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
                >
                  amy@example.com
                </a>
                <span className="text-[0.85rem] text-[var(--color-muted)]">
                  San Francisco, CA
                </span>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
          <div className="pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[0.8rem] text-[var(--color-light-muted)]">
              © {new Date().getFullYear()} Zaoshi (Amy) Yuan. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-[0.8rem] text-[var(--color-light-muted)]">
              <span>Built with Next.js</span>
              <span>•</span>
              <span>Deployed on Vercel</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
