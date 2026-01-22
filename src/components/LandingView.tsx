'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Fuse, { FuseResultMatch } from 'fuse.js'

interface LandingViewProps {
  showChat: boolean
  onOpenChat: (message?: string) => void
  onOpenAbout: () => void
}

// Slash commands for quick access
const slashCommands = [
  { cmd: '/proven', description: 'Learn about PROVEN skincare company', query: 'Tell me about PROVEN' },
  { cmd: '/durin', description: 'Learn about Durin AI infrastructure', query: 'Tell me about Durin' },
  { cmd: '/noteworthy', description: 'Learn about Noteworthy fragrance', query: 'Tell me about Noteworthy' },
  { cmd: '/pawgress', description: 'Learn about Pawgress app', query: 'What is Pawgress?' },
  { cmd: '/climbing', description: 'Mountaineering expeditions', query: 'Tell me about your mountaineering' },
  { cmd: '/research', description: 'Research interests and papers', query: 'What are your research interests?' },
  { cmd: '/patents', description: 'Patents and IP', query: 'What patents do you have?' },
  { cmd: '/stanford', description: 'Stanford background', query: 'Tell me about Stanford' },
  { cmd: '/contact', description: 'Get in touch', query: 'How can I contact you?' },
  { cmd: '/background', description: 'Full background story', query: 'What is your background?' },
  { cmd: '/projects', description: 'Current projects', query: 'What projects are you working on?' },
  { cmd: '/tech', description: 'Tech stack and skills', query: "What's your tech stack?" },
]

const autocompleteSuggestions = [
  "What is your background?",
  "What projects are you working on?",
  "Tell me about PROVEN",
  "Tell me about Noteworthy",
  "Tell me about Durin",
  "What is Pawgress?",
  "Tell me about your games and apps",
  "Tell me about your exits",
  "How did you scale to $150MM?",
  "What are your research interests?",
  "Tell me about your world record simulation",
  "Tell me about your mountaineering",
  "Tell me about climbing Cotopaxi",
  "Tell me about climbing Mont Blanc",
  "What's your tech stack?",
  "How can I contact you?",
  "What patents do you have?",
  "Tell me about Stanford",
  "Tell me about MIT AI Idol",
]

// Initialize Fuse for fuzzy search
const fuse = new Fuse(autocompleteSuggestions, {
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  includeMatches: true,
})

const slashFuse = new Fuse(slashCommands, {
  keys: ['cmd', 'description'],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
})

const rotatingPlaceholders = [
  "Ask me anything...",
  "Type / for commands...",
  "Ask about PROVEN...",
  "Try /climbing...",
  "Ask about my research...",
]

export default function LandingView({ showChat, onOpenChat, onOpenAbout }: LandingViewProps) {
  const [input, setInput] = useState('')
  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [placeholderIndex, setPlaceholderIndex] = useState(0)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set(['philosophy', 'columns', 'now', 'climbing']))
  const [isScrolled, setIsScrolled] = useState(false)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})
  const inputRef = useRef<HTMLInputElement>(null)

  // Check if mobile
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % rotatingPlaceholders.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // Track scroll position for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      setIsScrolled(scrollTop > 80)
    }
    // Check initial scroll position
    handleScroll()
    // Listen on both window and document for better compatibility
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]))
          }
        })
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )

    // Small delay to ensure refs are set
    setTimeout(() => {
      Object.values(sectionRefs.current).forEach((ref) => {
        if (ref) observer.observe(ref)
      })
    }, 100)

    return () => observer.disconnect()
  }, [])

  // Determine if input is a slash command
  const isSlashCommand = input.startsWith('/')

  const filteredSuggestions = useMemo(() => {
    const trimmed = input.trim()

    // Show all slash commands when just "/" is typed
    if (trimmed === '/') {
      return slashCommands.map(cmd => ({
        type: 'slash' as const,
        text: cmd.cmd,
        description: cmd.description,
        query: cmd.query,
        matches: undefined,
      }))
    }

    // Search slash commands if starts with /
    if (trimmed.startsWith('/')) {
      const results = slashFuse.search(trimmed)
      return results.slice(0, 8).map(result => ({
        type: 'slash' as const,
        text: result.item.cmd,
        description: result.item.description,
        query: result.item.query,
        matches: result.matches,
      }))
    }

    // Show default suggestions when input is empty but focused
    if (!trimmed) {
      return autocompleteSuggestions.slice(0, 5).map(text => ({
        type: 'suggestion' as const,
        text,
        description: undefined,
        query: text,
        matches: undefined,
      }))
    }

    // Fuzzy search regular suggestions
    const results = fuse.search(trimmed)
    return results.slice(0, 6).map(result => ({
      type: 'suggestion' as const,
      text: result.item,
      description: undefined,
      query: result.item,
      matches: result.matches,
    }))
  }, [input])

  // Helper to highlight matched characters
  const highlightMatch = useCallback((text: string, matches: readonly FuseResultMatch[] | undefined) => {
    if (!matches || matches.length === 0) return text

    const indices = matches[0]?.indices || []
    if (indices.length === 0) return text

    const parts: { text: string; highlight: boolean }[] = []
    let lastIndex = 0

    indices.forEach(([start, end]) => {
      if (start > lastIndex) {
        parts.push({ text: text.slice(lastIndex, start), highlight: false })
      }
      parts.push({ text: text.slice(start, end + 1), highlight: true })
      lastIndex = end + 1
    })

    if (lastIndex < text.length) {
      parts.push({ text: text.slice(lastIndex), highlight: false })
    }

    return parts.map((part, i) =>
      part.highlight
        ? <span key={i} className="text-[#F59E0B]">{part.text}</span>
        : <span key={i}>{part.text}</span>
    )
  }, [])

  // Reset suggestion selection when filtered list changes
  useEffect(() => {
    setSelectedSuggestion(-1)
  }, [filteredSuggestions.length])

  const handleSubmit = useCallback((e?: React.FormEvent) => {
    e?.preventDefault()
    const trimmed = input.trim()
    if (trimmed) {
      // Add to command history
      setCommandHistory(prev => [...prev.filter(cmd => cmd !== trimmed), trimmed])
      setHistoryIndex(-1)
      onOpenChat(trimmed)
      setInput('')
      setShowAutocomplete(false)
    }
  }, [input, onOpenChat])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab completion - fills in the command/suggestion text
    if (e.key === 'Tab') {
      e.preventDefault()
      if (filteredSuggestions.length > 0) {
        const idx = selectedSuggestion >= 0 ? selectedSuggestion : 0
        const suggestion = filteredSuggestions[idx]
        // For slash commands, fill in the command; for suggestions, fill the text
        setInput(suggestion.type === 'slash' ? suggestion.text : suggestion.text)
        setShowAutocomplete(false)
        setSelectedSuggestion(-1)
      }
      return
    }

    // Escape to close autocomplete
    if (e.key === 'Escape') {
      setShowAutocomplete(false)
      setSelectedSuggestion(-1)
      return
    }

    // Ctrl+C to clear
    if (e.ctrlKey && e.key === 'c') {
      e.preventDefault()
      setInput('')
      setShowAutocomplete(false)
      return
    }

    // Ctrl+L to clear (common terminal shortcut)
    if (e.ctrlKey && e.key === 'l') {
      e.preventDefault()
      setInput('')
      return
    }

    // Ctrl+U to clear line (bash shortcut)
    if (e.ctrlKey && e.key === 'u') {
      e.preventDefault()
      setInput('')
      return
    }

    // Navigate autocomplete with arrow keys
    if (showAutocomplete && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestion(prev =>
          prev < filteredSuggestions.length - 1 ? prev + 1 : 0
        )
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestion(prev =>
          prev > 0 ? prev - 1 : filteredSuggestions.length - 1
        )
        return
      }
      // Enter with selection submits that suggestion
      if (e.key === 'Enter' && selectedSuggestion >= 0) {
        e.preventDefault()
        const suggestion = filteredSuggestions[selectedSuggestion]
        const query = suggestion.query
        setShowAutocomplete(false)
        setSelectedSuggestion(-1)
        onOpenChat(query)
        setInput('')
        setCommandHistory(prev => [...prev.filter(cmd => cmd !== query), query])
        return
      }
    }

    // Command history navigation (when no autocomplete visible)
    if (!showAutocomplete || filteredSuggestions.length === 0) {
      if (e.key === 'ArrowUp' && commandHistory.length > 0) {
        e.preventDefault()
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
        return
      }
      if (e.key === 'ArrowDown' && historyIndex >= 0) {
        e.preventDefault()
        const newIndex = historyIndex > 0 ? historyIndex - 1 : -1
        setHistoryIndex(newIndex)
        setInput(newIndex >= 0 ? commandHistory[commandHistory.length - 1 - newIndex] : '')
        return
      }
    }
  }, [filteredSuggestions, selectedSuggestion, showAutocomplete, commandHistory, historyIndex, onOpenChat])

  // Click terminal to open full chat
  const handleTerminalClick = useCallback(() => {
    onOpenChat()
  }, [onOpenChat])

  const topics = [
    { message: 'Tell me about PROVEN', label: 'proven', color: 'text-[#F59E0B]' },
    { message: 'Tell me about Noteworthy', label: 'noteworthy', color: 'text-[#8B5CF6]' },
    { message: 'What are your research interests?', label: 'research', color: 'text-[#06B6D4]' },
    { message: 'Tell me about your mountaineering', label: 'climbing', color: 'text-[#10B981]' },
  ]

  const setRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  return (
    <>
      {/* Top Navigation - outside main container for proper fixed behavior */}
      {!showChat && (
        <nav
          className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
          style={{
            backgroundColor: isScrolled ? 'rgba(252, 252, 251, 0.95)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(12px)' : 'none',
            borderBottom: isScrolled ? '1px solid var(--color-border)' : '1px solid transparent'
          }}
        >
          <div className="max-w-[1100px] mx-auto px-8 py-4 flex items-center justify-between max-md:px-4 max-md:py-3">
            <span
              className="text-[0.8rem] font-semibold tracking-[0.2em] text-[var(--color-fg)] uppercase transition-opacity duration-300"
              style={{ opacity: isScrolled ? 1 : 0 }}
            >
              Amy
            </span>
            <div className="flex items-center gap-8 max-md:gap-3">
              {['About', 'Projects', 'Thoughts', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item === 'About') {
                      onOpenAbout()
                    } else {
                      onOpenChat(
                        item === 'Projects' ? 'What projects are you working on?' :
                        item === 'Thoughts' ? 'What are you thinking about lately?' :
                        'How can I contact you?'
                      )
                    }
                  }}
                  className="text-[0.75rem] font-medium tracking-[0.1em] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors uppercase max-md:text-[0.65rem] max-md:tracking-[0.05em]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}

      <div
        className={`relative z-10 transition-all duration-500 ease-out ${
          showChat ? 'opacity-0 -translate-y-6 pointer-events-none absolute w-full' : 'opacity-100 translate-y-0'
        }`}
      >

      {/* ==================== FIRST FOLD ==================== */}
      <section className="relative px-6 max-md:px-3 pt-16 pb-10 max-md:pt-14 max-md:pb-8">
        <div className="w-full max-w-[800px] mx-auto">

          {/* Title Section with Profile - Premium */}
          <div className="flex items-center gap-6 mb-12 max-md:mb-8 max-md:gap-4" style={{ animation: 'fadeInUp 0.4s ease-out forwards' }}>
            {/* Profile Image */}
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--color-border)] flex-shrink-0 max-md:w-14 max-md:h-14 shadow-sm">
              <img
                src="/profile.jpg"
                alt="Amy Yuan"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-[2.25rem] font-bold tracking-[-0.03em] leading-[1.1] mb-1.5 max-md:text-[1.6rem] max-md:mb-1">
                Amy Yuan
              </h1>
              <div className="text-[0.7rem] text-[var(--color-light-muted)] tracking-[0.2em] uppercase max-md:text-[0.6rem]">
                Founder · ex-Physicist · Mountaineer
              </div>
            </div>
          </div>

          {/* Terminal Window - iOS style */}
          <div
            onClick={handleTerminalClick}
            className="rounded-2xl overflow-hidden shadow-lg border border-[#2a2a2a] cursor-text mb-12 max-md:mb-8"
            style={{ animation: 'fadeInUp 0.4s ease-out 0.1s forwards', opacity: 0 }}
          >
            {/* Window Chrome */}
            <div className="bg-[#1a1a1a] px-4 py-2.5 flex items-center border-b border-[#2a2a2a] max-md:px-3 max-md:py-2">
              <div className="flex items-center gap-2 max-md:gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] max-md:w-2.5 max-md:h-2.5" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] max-md:w-2.5 max-md:h-2.5" />
                <div className="w-3 h-3 rounded-full bg-[#27CA3F] max-md:w-2.5 max-md:h-2.5" />
              </div>
              <span className="flex-1 text-center text-[0.7rem] text-[#555] font-mono max-md:text-[0.6rem]">amy — ask me anything</span>
              <div className="w-[44px] max-md:w-[32px]" />
            </div>

            {/* Terminal Content */}
            <div className="bg-[#0a0a0a] p-5 pb-4 max-md:p-4 max-md:pb-3 flex flex-col min-h-[160px] max-md:min-h-[140px]">
              {/* Welcome message - cleaner */}
              <div className="flex-1 font-mono text-[0.85rem] leading-[1.7] max-md:text-[0.75rem] mb-4 max-md:mb-3">
                <p className="text-[#888]">
                  Physics PhD → healthcare AI → <span className="text-[#F59E0B]">$150MM</span> in consumer goods.
                </p>
                <p className="text-[#555] mt-1">Ask me anything.</p>
              </div>

              {/* Input line */}
              <form onSubmit={handleSubmit} className="relative">
                <div className="flex items-center gap-2 font-mono text-[0.85rem] max-md:text-[0.8rem]">
                  <span className="text-[#10B981] font-semibold">amy</span>
                  <span className="text-[#444]">~</span>
                  <span className="text-[#8B5CF6]">❯</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onFocus={() => {
                      // Open full chat on any focus
                      inputRef.current?.blur()
                      onOpenChat()
                    }}
                    readOnly
                    placeholder={rotatingPlaceholders[placeholderIndex]}
                    className="flex-1 bg-transparent border-0 text-[0.9rem] text-[#E5E5E5] placeholder:text-[#444] font-mono outline-none max-md:text-[0.85rem]"
                  />
                  <span className="text-[#E5E5E5] cursor-blink">▌</span>
                </div>

                {/* Autocomplete - Desktop only, never on mobile */}
                {!isMobile && showAutocomplete && filteredSuggestions.length > 0 && !showChat && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-[#1a1a1a] border border-[#333] rounded-lg overflow-hidden z-10 shadow-xl max-h-[300px] overflow-y-auto">
                    <div className="px-3 py-1.5 text-[0.6rem] text-[#444] border-b border-[#2a2a2a] flex items-center justify-between sticky top-0 bg-[#1a1a1a]">
                      <span>{isSlashCommand ? 'Commands' : 'Suggestions'} · Tab complete · Enter send</span>
                      <span className="text-[#555]">{filteredSuggestions.length}</span>
                    </div>
                    {filteredSuggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          onOpenChat(suggestion.query)
                          setInput('')
                          setShowAutocomplete(false)
                          setCommandHistory(prev => [...prev.filter(cmd => cmd !== suggestion.query), suggestion.query])
                        }}
                        className={`w-full text-left px-3 py-2 text-[0.85rem] font-mono transition-colors ${
                          selectedSuggestion === i
                            ? 'bg-[#252525]'
                            : 'hover:bg-[#1f1f1f]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={selectedSuggestion === i ? 'text-[#8B5CF6]' : 'text-[#444]'}>
                            {suggestion.type === 'slash' ? '/' : '❯'}
                          </span>
                          <span className={selectedSuggestion === i ? 'text-[#ccc]' : 'text-[#888]'}>
                            {suggestion.type === 'slash'
                              ? <span className="text-[#10B981]">{suggestion.text}</span>
                              : highlightMatch(suggestion.text, suggestion.matches)
                            }
                          </span>
                        </div>
                        {suggestion.description && (
                          <div className="ml-5 mt-0.5 text-[0.75rem] text-[#555]">
                            {suggestion.description}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Philosophy - Brief intro */}
          <p
            className="text-[1.05rem] text-[var(--color-muted)] leading-[1.8] max-md:text-[0.9rem] max-md:leading-[1.7] max-w-[600px]"
            style={{ animation: 'fadeInUp 0.4s ease-out 0.2s forwards', opacity: 0 }}
          >
            <span className="text-[var(--color-fg)] italic">The work I care about happens where they meet.</span>{' '}
            Real products. Systems that compound.
          </p>

        </div>

      </section>

      {/* ==================== SECOND FOLD ==================== */}
      <section className="px-6 max-md:px-5 pt-2 pb-10 max-md:pt-4 max-md:pb-8">
        <div className="w-full max-w-[800px] mx-auto">

          {/* Three columns */}
          <div
            id="columns"
            ref={setRef('columns')}
            className={`grid grid-cols-3 gap-10 mb-10 max-md:grid-cols-1 max-md:gap-6 transition-all duration-700 ${visibleSections.has('columns') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* BUILDING */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-4 pb-2 border-b border-[var(--color-border)]">
                Building
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Durin', desc: 'Truthfulness in market intelligence.', query: 'Tell me about Durin' },
                  { name: 'Pawgress', desc: 'Family AI that knows when to step back.', query: 'Tell me about Pawgress' },
                  { name: 'AI Research', desc: 'Agents. Reasoning. Tooling.', query: 'Tell me about your AI research' },
                ].map((item) => (
                  <div key={item.name}>
                    <button onClick={() => onOpenChat(item.query)} className="text-[0.9rem] font-semibold underline underline-offset-2 decoration-[var(--color-border)] hover:decoration-[var(--color-fg)] transition-colors">
                      {item.name}
                    </button>
                    <p className="text-[0.8rem] text-[var(--color-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SHIPPED */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-4 pb-2 border-b border-[var(--color-border)]">
                Shipped
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'PROVEN & Noteworthy', desc: '$150MM+ revenue. 2 patents.', query: 'Tell me about PROVEN and Noteworthy', external: true },
                  { name: 'Lyra · McKesson', desc: 'Clinical AI. Drug prediction.', query: 'Tell me about your work at Lyra and McKesson', external: true },
                  { name: 'Top-10 Apps', desc: 'CubicMan. Camera360. Divine Might. 2 exits.', query: 'Tell me about your games and apps', external: false },
                ].map((item) => (
                  <div key={item.name}>
                    <button onClick={() => onOpenChat(item.query)} className="inline-flex items-center gap-1 text-[0.9rem] font-semibold underline underline-offset-2 decoration-[var(--color-border)] hover:decoration-[var(--color-fg)] transition-colors">
                      {item.name}
                    </button>
                    <p className="text-[0.8rem] text-[var(--color-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-4 pb-2 border-b border-[var(--color-border)]">
                Highlights
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              </h3>
              <div className="space-y-4">
                {[
                  { name: 'Stanford / USC', desc: '10 papers. 2 PRL covers.' },
                  { name: 'MIT AI Idol', desc: 'AI personalization.' },
                  { name: 'World Record Simulations', desc: 'Peta-flop computing.' },
                ].map((item) => (
                  <div key={item.name}>
                    <span className="text-[0.9rem] font-semibold">{item.name}</span>
                    <p className="text-[0.8rem] text-[var(--color-muted)] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NOW */}
          <div
            id="now"
            ref={setRef('now')}
            className={`border-t border-[var(--color-border)] pt-8 mb-8 max-md:pt-6 max-md:mb-6 transition-all duration-700 delay-150 ${visibleSections.has('now') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-3">
              Now
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
            </h3>
            <p className="text-[1rem] leading-[1.8] max-md:text-[0.9rem]">
              Building AI systems above the model layer, where behavior is shaped by architecture rather than weights.
            </p>
          </div>

          {/* CLIMBING */}
          <div
            id="climbing"
            ref={setRef('climbing')}
            className={`border-t border-[var(--color-border)] pt-8 max-md:pt-6 transition-all duration-700 delay-200 ${visibleSections.has('climbing') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.15em] text-[var(--color-muted)] uppercase mb-4">
              Expeditions
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            </h3>
            <div className="grid grid-cols-2 gap-x-10 gap-y-5 max-md:grid-cols-1 max-md:gap-y-4">
              {[
                { name: 'Cotopaxi', location: 'Ecuador', date: '2023', desc: 'Glaciated stratovolcano at 5,897m. Summit via the normal route through crevasse fields and ice walls.', query: 'Tell me about climbing Cotopaxi' },
                { name: 'Mont Blanc', location: 'France', date: '2022', desc: 'The roof of Western Europe at 4,808m. Traversed the Goûter Route through technical mixed terrain.', query: 'Tell me about climbing Mont Blanc' },
                { name: 'Rainier', location: 'Washington', date: '2021', desc: 'Heavily glaciated peak at 4,392m. Disappointment Cleaver route through Ingraham Glacier.', query: 'Tell me about climbing Rainier' },
                { name: 'Himalayas', location: 'Nepal', date: 'Ongoing', desc: 'High altitude mountaineering and glacier travel. Training for bigger objectives.', query: 'Tell me about your Himalayan expeditions' },
              ].map((item) => (
                <button key={item.name} onClick={() => onOpenChat(item.query)} className="group text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[0.9rem] font-semibold group-hover:opacity-70 transition-opacity max-md:text-[0.85rem]">{item.name}</span>
                    <span className="text-[0.8rem] text-[var(--color-muted)] max-md:text-[0.75rem]">· {item.location}</span>
                    <span className="text-[0.75rem] text-[var(--color-light-muted)] ml-auto max-md:text-[0.7rem]">{item.date}</span>
                  </div>
                  <p className="text-[0.8rem] text-[var(--color-muted)] leading-[1.6] max-md:text-[0.75rem]">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#0f0f0f] text-[#e5e5e5] mt-6 px-6 max-md:px-5 max-md:mt-4">
        <div className="max-w-[800px] mx-auto py-10 max-md:py-8">

          {/* Two columns: Research & Connect */}
          <div className="grid grid-cols-2 gap-10 mb-8 max-md:grid-cols-1 max-md:gap-6">
            {/* Research */}
            <div>
              <h3 className="text-[0.65rem] font-semibold tracking-[0.15em] text-[#555] uppercase mb-3 pb-1.5 border-b border-[#333]">
                Research
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'Stanford · USC', query: 'Tell me about your research at Stanford and USC' },
                  { name: '9 Publications', query: 'Tell me about your publications' },
                  { name: '2 Patents', query: 'Tell me about your patents' },
                ].map((item) => (
                  <button key={item.name} onClick={() => onOpenChat(item.query)} className="block text-[0.85rem] text-[#888] hover:text-[#ccc] transition-colors">
                    {item.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-[0.65rem] font-semibold tracking-[0.15em] text-[#555] uppercase mb-3 pb-1.5 border-b border-[#333]">
                Connect
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {[
                  { name: 'LinkedIn', url: '#' },
                  { name: 'Twitter', url: '#' },
                  { name: 'GitHub', url: '#' },
                  { name: 'Email', url: '#' },
                ].map((item) => (
                  <a key={item.name} href={item.url} className="text-[0.85rem] text-[#888] hover:text-[#ccc] transition-colors">
                    {item.name}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between pt-6 border-t border-[#222] text-[0.7rem] text-[#444] max-md:flex-col max-md:gap-3">
            <span>© {new Date().getFullYear()} Amy Yuan</span>
            <div className="flex items-center gap-5">
              <button onClick={() => onOpenChat('Tell me about yourself')} className="hover:text-[#888] transition-colors">About</button>
              <button onClick={() => onOpenChat('What projects are you working on?')} className="hover:text-[#888] transition-colors">Work</button>
              <button onClick={() => onOpenChat('Tell me about your mountaineering')} className="hover:text-[#888] transition-colors">Climbing</button>
              <button onClick={() => onOpenChat('How can I contact you?')} className="hover:text-[#888] transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
      </div>

    </>
  )
}
