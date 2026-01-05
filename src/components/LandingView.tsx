'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Fuse, { FuseResultMatch } from 'fuse.js'

interface LandingViewProps {
  showChat: boolean
  onOpenChat: (message?: string) => void
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

export default function LandingView({ showChat, onOpenChat }: LandingViewProps) {
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

  // Click terminal to focus input
  const handleTerminalClick = useCallback(() => {
    inputRef.current?.focus()
  }, [])

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
          <div className="max-w-[1100px] mx-auto px-8 py-4 flex items-center justify-between max-md:px-5 max-md:py-3">
            <span
              className="text-[0.8rem] font-semibold tracking-[0.2em] text-[var(--color-fg)] uppercase transition-opacity duration-300"
              style={{ opacity: isScrolled ? 1 : 0 }}
            >
              Amy
            </span>
            <div className="flex items-center gap-8 max-md:gap-4">
              {['About', 'Projects', 'Climbing', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => onOpenChat(
                    item === 'About' ? 'Tell me about yourself' :
                    item === 'Projects' ? 'What projects are you working on?' :
                    item === 'Climbing' ? 'Tell me about your mountaineering' :
                    'How can I contact you?'
                  )}
                  className="text-[0.75rem] font-medium tracking-[0.1em] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors uppercase max-md:text-[0.68rem]"
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
      <section className="relative min-h-[100vh] flex flex-col justify-center px-8 max-md:px-5 py-24 max-md:py-20">
        <div className="w-full max-w-[860px] mx-auto">

          {/* Title Section */}
          <div className="mb-10 max-md:mb-8" style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}>
            <h1 className="text-[2.8rem] font-bold tracking-[-0.02em] leading-[1.1] mb-4 max-md:text-[2rem] max-md:mb-3">
              Amy Yuan
            </h1>
            <div className="text-[0.72rem] text-[var(--color-light-muted)] tracking-[0.2em] uppercase max-md:text-[0.65rem]">
              Founder · Researcher · Mountaineer
            </div>
          </div>

          {/* Terminal Window - Hero Element */}
          <div
            onClick={handleTerminalClick}
            className="rounded-2xl overflow-hidden shadow-2xl border border-[#2a2a2a] cursor-text"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.15s forwards', opacity: 0 }}
          >
            {/* Window Chrome */}
            <div className="bg-[#1a1a1a] px-5 py-3 flex items-center border-b border-[#2a2a2a]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27CA3F]" />
              </div>
              <span className="flex-1 text-center text-[0.75rem] text-[#555] font-mono">amy — ask me anything</span>
              <div className="w-[44px]" />
            </div>

            {/* Terminal Content */}
            <div className="bg-[#0a0a0a] p-8 pb-10 max-md:p-5">
              {/* Welcome message */}
              <div className="mb-6 font-mono text-[0.95rem] leading-[1.8] max-md:text-[0.85rem]">
                <div className="mb-0.5">
                  <span className="text-[#555]">┌</span>
                  <span className="text-[#999] ml-2">Computational physics → </span>
                  <span className="text-[#F59E0B]">$150MM+</span>
                  <span className="text-[#999]"> revenue. 2 patents. 3 companies.</span>
                </div>
                <div>
                  <span className="text-[#555]">└</span>
                  <span className="text-[#666] ml-2">I trained this one on all of it. Try me.</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#222] mb-5" />

              {/* Input line */}
              <form onSubmit={handleSubmit} className="relative mb-4">
                <div className="flex items-center gap-2 font-mono text-[1rem] max-md:text-[0.9rem]">
                  <span className="text-[#10B981] font-semibold">amy</span>
                  <span className="text-[#444]">~</span>
                  <span className="text-[#8B5CF6]">❯</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value)
                      setShowAutocomplete(true)
                      setHistoryIndex(-1)
                    }}
                    onFocus={() => setShowAutocomplete(true)}
                    onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
                    onKeyDown={handleKeyDown}
                    placeholder={rotatingPlaceholders[placeholderIndex]}
                    className="flex-1 bg-transparent border-0 text-[1rem] text-[#E5E5E5] placeholder:text-[#3a3a3a] font-mono outline-none max-md:text-[0.9rem]"
                  />
                  <span className="text-[#E5E5E5] cursor-blink">▌</span>
                </div>

                {/* Autocomplete */}
                {showAutocomplete && filteredSuggestions.length > 0 && (
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

              {/* Topic chips */}
              <div className="flex flex-wrap gap-2 mt-1">
                {topics.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => onOpenChat(item.message)}
                    className="px-3 py-1.5 bg-[#151515] border border-[#2a2a2a] rounded-full text-[0.8rem] font-mono transition-all hover:border-[#444] hover:bg-[#1a1a1a] flex items-center gap-1.5"
                  >
                    <span className={item.color}>/</span>
                    <span className="text-[#777]">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Scroll hint - integrated, subtle */}
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[0.7rem] text-[var(--color-light-muted)] transition-opacity duration-500 cursor-pointer hover:text-[var(--color-muted)]"
          style={{ opacity: isScrolled ? 0 : 0.6 }}
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
        >
          <span className="tracking-wide">scroll</span>
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      {/* ==================== SECOND FOLD ==================== */}
      <section className="px-8 max-md:px-5 pt-6 pb-12">
        <div className="w-full max-w-[860px] mx-auto">

          {/* Philosophy */}
          <div
            id="philosophy"
            ref={setRef('philosophy')}
            className={`mb-12 max-md:mb-10 transition-all duration-700 ${visibleSections.has('philosophy') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <p className="text-[1.35rem] leading-[1.6] max-md:text-[1.1rem]">
              <span className="italic">Building AI where preference is the primitive.</span>{' '}
              <span className="text-[var(--color-muted)]">
                Not engagement metrics. Not popularity signals. Systems that make human preference legible, grounded, and trustworthy at scale.
              </span>
            </p>
            <p className="text-[1.05rem] text-[var(--color-muted)] mt-5 leading-[1.7] max-md:text-[0.95rem]">
              In the past I&apos;ve scaled{' '}
              <button onClick={() => onOpenChat('Tell me about PROVEN')} className="text-[var(--color-fg)] underline underline-offset-2 decoration-[var(--color-border)] hover:decoration-[var(--color-fg)] transition-colors">PROVEN & Noteworthy</button>
              {' '}to $150MM+ in revenue with 2 patents, built clinical AI at Lyra and McKesson for high-stakes production systems, and ran a world record peta-flop scale simulation with 9 publications.
            </p>
          </div>

          {/* Three columns */}
          <div
            id="columns"
            ref={setRef('columns')}
            className={`grid grid-cols-3 gap-10 mb-12 max-md:grid-cols-1 max-md:gap-10 transition-all duration-700 delay-100 ${visibleSections.has('columns') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            {/* BUILDING */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-[var(--color-muted)] uppercase mb-5 pb-2 border-b border-[var(--color-border)]">
                Building
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              </h3>
              <div className="space-y-5">
                {[
                  { name: 'Durin', desc: 'Market intelligence. Post-training infrastructure.', query: 'Tell me about Durin', external: false },
                  { name: 'Pawgress', desc: 'Agentic family companion. Emotionally safe AI.', query: 'Tell me about Pawgress', external: false },
                  { name: 'Several other fun AI stuff', desc: 'Agents. Reasoning. Research.', query: 'Tell me about your AI research', external: false },
                ].map((item) => (
                  <div key={item.name}>
                    <button onClick={() => onOpenChat(item.query)} className="inline-flex items-center gap-1 text-[1rem] font-semibold underline underline-offset-2 decoration-[var(--color-border)] hover:decoration-[var(--color-fg)] transition-colors">
                      {item.name}
                      {item.external && (
                        <svg className="w-3.5 h-3.5 text-[var(--color-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <p className="text-[0.85rem] text-[var(--color-muted)] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SHIPPED */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-[var(--color-muted)] uppercase mb-5 pb-2 border-b border-[var(--color-border)]">
                Shipped
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              </h3>
              <div className="space-y-5">
                {[
                  { name: 'PROVEN & Noteworthy', desc: '$150MM+ revenue. 2 patents.', query: 'Tell me about PROVEN and Noteworthy', external: true },
                  { name: 'Lyra · McKesson', desc: 'Clinical matching. Drug market prediction.', query: 'Tell me about your work at Lyra and McKesson', external: true },
                  { name: 'Stanford · USC', desc: 'Computational physics.', query: 'Tell me about your research at Stanford and USC', external: false },
                  { name: 'Games & Apps', desc: '3 top-10 apps. 2 exits.', query: 'Tell me about your games and apps', external: false },
                ].map((item) => (
                  <div key={item.name}>
                    <button onClick={() => onOpenChat(item.query)} className="inline-flex items-center gap-1 text-[1rem] font-semibold underline underline-offset-2 decoration-[var(--color-border)] hover:decoration-[var(--color-fg)] transition-colors">
                      {item.name}
                      {item.external && (
                        <svg className="w-3.5 h-3.5 text-[var(--color-muted)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <p className="text-[0.85rem] text-[var(--color-muted)] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RECOGNITION */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-[var(--color-muted)] uppercase mb-5 pb-2 border-b border-[var(--color-border)]">
                Recognition
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              </h3>
              <div className="space-y-5">
                {[
                  { name: 'MIT AI Idol', desc: 'AI personalization.', clickable: false },
                  { name: 'Two Exits Before 30', desc: 'CubicMan, DivineMight, Camera360.', clickable: false },
                  { name: 'World Record Simulation', desc: 'Peta-flop scale. 9 publications.', clickable: false },
                  { name: '4 Continents', desc: 'Glaciated climbs.', query: 'Tell me about your mountaineering', clickable: true },
                ].map((item) => (
                  <div key={item.name}>
                    {item.clickable ? (
                      <button onClick={() => onOpenChat(item.query)} className="text-[1rem] font-semibold underline underline-offset-2 decoration-[var(--color-border)] hover:decoration-[var(--color-fg)] transition-colors">{item.name}</button>
                    ) : (
                      <span className="text-[1rem] font-semibold">{item.name}</span>
                    )}
                    <p className="text-[0.85rem] text-[var(--color-muted)] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* NOW */}
          <div
            id="now"
            ref={setRef('now')}
            className={`border-t border-[var(--color-border)] pt-10 mb-10 transition-all duration-700 delay-150 ${visibleSections.has('now') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-[var(--color-muted)] uppercase mb-4">
              Now
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
            </h3>
            <p className="text-[1.1rem] leading-[1.7] max-md:text-[1rem]">
              Building AI systems above the model layer, where behavior is shaped by architecture rather than weights. Focused on making foundation models operable—not just capable.
            </p>
          </div>

          {/* CLIMBING - Image #20 Style */}
          <div
            id="climbing"
            ref={setRef('climbing')}
            className={`border-t border-[var(--color-border)] pt-10 transition-all duration-700 delay-200 ${visibleSections.has('climbing') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h3 className="flex items-center gap-2.5 text-[1.15rem] italic mb-8">
              Expeditions.
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            </h3>
            <div className="grid grid-cols-2 gap-x-12 gap-y-10 max-md:grid-cols-1 max-md:gap-y-8">
              {[
                {
                  name: 'Cotopaxi',
                  location: 'Ecuador',
                  date: '2023',
                  desc: 'Glaciated stratovolcano at 5,897m. Summit via the normal route through crevasse fields and ice walls.',
                  query: 'Tell me about climbing Cotopaxi'
                },
                {
                  name: 'Mont Blanc',
                  location: 'France',
                  date: '2022',
                  desc: 'The roof of Western Europe at 4,808m. Traversed the Goûter Route through technical mixed terrain.',
                  query: 'Tell me about climbing Mont Blanc'
                },
                {
                  name: 'Rainier',
                  location: 'Washington',
                  date: '2021',
                  desc: 'Heavily glaciated peak at 4,392m. Disappointment Cleaver route through Ingraham Glacier.',
                  query: 'Tell me about climbing Rainier'
                },
                {
                  name: 'Himalayas',
                  location: 'Nepal',
                  date: 'Ongoing',
                  desc: 'High altitude mountaineering and glacier travel. Training for bigger objectives.',
                  query: 'Tell me about your Himalayan expeditions'
                },
              ].map((item) => (
                <button key={item.name} onClick={() => onOpenChat(item.query)} className="group text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[1rem] font-semibold group-hover:opacity-70 transition-opacity">{item.name},</span>
                    <span className="text-[1rem] text-[var(--color-muted)]">{item.location}</span>
                    <span className="flex-1 h-px bg-[var(--color-border)]" />
                    <span className="text-[0.85rem] text-[var(--color-muted)]">{item.date}</span>
                  </div>
                  <p className="text-[0.9rem] text-[var(--color-muted)] leading-[1.7]">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-[#0f0f0f] text-[#e5e5e5] mt-10 px-8 max-md:px-5">
        <div className="max-w-[860px] mx-auto py-14 max-md:py-10">

          {/* Three columns like Building/Past/Recognition */}
          <div className="grid grid-cols-3 gap-10 mb-12 max-md:grid-cols-1 max-md:gap-10">
            {/* Experience */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-[#666] uppercase mb-5 pb-2 border-b border-[#333]">
                Experience
                <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              </h3>
              <div className="space-y-5">
                {[
                  { name: 'PROVEN & Noteworthy', desc: '$150MM+ revenue. 2 patents.', query: 'Tell me about PROVEN and Noteworthy', external: true },
                  { name: 'Lyra · McKesson', desc: 'Clinical matching. Drug market prediction.', query: 'Tell me about your work at Lyra and McKesson', external: true },
                  { name: 'Games & Apps', desc: '3 top-10 apps. 2 exits.', query: 'Tell me about your games and apps', external: false },
                ].map((item) => (
                  <div key={item.name}>
                    <button onClick={() => onOpenChat(item.query)} className="inline-flex items-center gap-1 text-[1rem] font-semibold text-[#e5e5e5] underline underline-offset-2 decoration-[#444] hover:decoration-[#888] transition-colors">
                      {item.name}
                      {item.external && (
                        <svg className="w-3.5 h-3.5 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <p className="text-[0.85rem] text-[#666] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Research */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-[#666] uppercase mb-5 pb-2 border-b border-[#333]">
                Research
                <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
              </h3>
              <div className="space-y-5">
                {[
                  { name: 'Stanford · USC', desc: 'Computational physics.', query: 'Tell me about your research at Stanford and USC' },
                  { name: 'World Record Simulation', desc: 'Peta-flop scale. 9 publications.', query: 'Tell me about your world record simulation' },
                  { name: '2 Patents', desc: 'Preference modeling.', query: 'Tell me about your patents' },
                ].map((item) => (
                  <div key={item.name}>
                    <button onClick={() => onOpenChat(item.query)} className="text-[1rem] font-semibold text-[#e5e5e5] underline underline-offset-2 decoration-[#444] hover:decoration-[#888] transition-colors">{item.name}</button>
                    <p className="text-[0.85rem] text-[#666] mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] text-[#666] uppercase mb-5 pb-2 border-b border-[#333]">
                Connect
                <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
              </h3>
              <div className="space-y-5">
                {[
                  { name: 'LinkedIn', url: '#' },
                  { name: 'Twitter', url: '#' },
                  { name: 'GitHub', url: '#' },
                  { name: 'Email', url: '#' },
                ].map((item) => (
                  <div key={item.name}>
                    <a href={item.url} className="inline-flex items-center gap-1 text-[1rem] font-semibold text-[#e5e5e5] underline underline-offset-2 decoration-[#444] hover:decoration-[#888] transition-colors">
                      {item.name}
                      <svg className="w-3.5 h-3.5 text-[#555]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between pt-8 border-t border-[#222] text-[0.75rem] text-[#555] max-md:flex-col max-md:gap-4">
            <span>© {new Date().getFullYear()} Amy Yuan</span>
            <div className="flex items-center gap-6">
              <button onClick={() => onOpenChat('Tell me about yourself')} className="hover:text-[#999] transition-colors">About</button>
              <button onClick={() => onOpenChat('What projects are you working on?')} className="hover:text-[#999] transition-colors">Work</button>
              <button onClick={() => onOpenChat('Tell me about your mountaineering')} className="hover:text-[#999] transition-colors">Climbing</button>
              <button onClick={() => onOpenChat('How can I contact you?')} className="hover:text-[#999] transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
      </div>
    </>
  )
}
