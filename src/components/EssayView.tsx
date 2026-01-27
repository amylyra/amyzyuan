'use client'

import { useRef, useCallback, useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChat } from '@ai-sdk/react'
import { createChatSession, saveChatMessage } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Fuse, { FuseResultMatch } from 'fuse.js'
import { Essay, ContentBlock } from '@/data/essays'

// Chat suggestions relevant to essays
const chatSuggestions = [
  "What's the main argument?",
  "Can you summarize this?",
  "What do you mean by alignment?",
  "How does this relate to AI safety?",
  "Explain instrumental convergence",
]

const fuse = new Fuse(chatSuggestions, {
  threshold: 0.4,
  distance: 100,
  includeScore: true,
  includeMatches: true,
})

// Helper to render inline markdown (bold and italics)
function renderInlineMarkdown(text: string) {
  // Split by bold (**text**) and italic (*text*) patterns
  const parts: React.ReactNode[] = []
  let remaining = text
  let key = 0

  while (remaining.length > 0) {
    // Check for bold first (**)
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/)
    // Check for italic (*)
    const italicMatch = remaining.match(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/)

    if (boldMatch && (!italicMatch || boldMatch.index! <= italicMatch.index!)) {
      // Add text before bold
      if (boldMatch.index! > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, boldMatch.index)}</span>)
      }
      // Add bold text
      parts.push(<strong key={key++} className="font-semibold text-[var(--color-fg)]">{boldMatch[1]}</strong>)
      remaining = remaining.slice(boldMatch.index! + boldMatch[0].length)
    } else if (italicMatch) {
      // Add text before italic
      if (italicMatch.index! > 0) {
        parts.push(<span key={key++}>{remaining.slice(0, italicMatch.index)}</span>)
      }
      // Add italic text
      parts.push(<em key={key++} className="italic">{italicMatch[1]}</em>)
      remaining = remaining.slice(italicMatch.index! + italicMatch[0].length)
    } else {
      // No more matches, add remaining text
      parts.push(<span key={key++}>{remaining}</span>)
      break
    }
  }

  return parts.length > 0 ? parts : text
}

// Render a content block
function ContentBlockRenderer({ block, index }: { block: ContentBlock; index: number }) {
  switch (block.type) {
    case 'heading':
      return (
        <h2 className="text-[1.05rem] max-md:text-[0.95rem] font-semibold text-[var(--color-fg)] mt-1 mb-3">
          {block.text}
        </h2>
      )
    case 'subheading':
      return (
        <h3 className="text-[0.95rem] max-md:text-[0.9rem] font-semibold text-[var(--color-fg)] mt-4 mb-2">
          {block.text}
        </h3>
      )
    case 'blockquote':
      return (
        <blockquote className="border-l-2 border-[var(--color-border)] pl-4 my-4 text-[var(--color-muted)] text-[0.9rem] max-md:text-[0.85rem]">
          {renderInlineMarkdown(block.text)}
        </blockquote>
      )
    case 'divider':
      return <hr className="border-t border-[var(--color-border)] my-8 max-md:my-6" />
    case 'paragraph':
    default:
      return (
        <p className="text-[var(--color-muted)] mb-4 text-[0.9rem] max-md:text-[0.85rem]">
          {renderInlineMarkdown(block.text)}
        </p>
      )
  }
}

interface EssayViewProps {
  essay: Essay
}

export default function EssayView({ essay }: EssayViewProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionIdRef = useRef<string | null>(null)
  const lastSavedMessageCount = useRef(0)

  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [isChatExpanded, setIsChatExpanded] = useState(false)

  const { messages, input, setInput, handleSubmit, isLoading, append, error, reload } = useChat({
    api: '/api/chat',
    body: {
      essayContext: `The user is reading an essay titled "${essay.title}". The essay is about: ${essay.preview}`,
    },
  })

  // Initialize chat session
  useEffect(() => {
    createChatSession().then((id) => {
      sessionIdRef.current = id
    })
  }, [])

  // Save messages to Supabase
  useEffect(() => {
    if (!sessionIdRef.current || messages.length === 0) return
    const newMessages = messages.slice(lastSavedMessageCount.current)
    newMessages.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'amy'
      saveChatMessage(sessionIdRef.current!, role, msg.content)
    })
    lastSavedMessageCount.current = messages.length
  }, [messages])

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (messagesEndRef.current && isChatExpanded) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isLoading, isChatExpanded])

  // Fuzzy search for autocomplete
  const filteredSuggestions = useMemo(() => {
    const trimmed = input.trim()
    if (!trimmed) return []
    const results = fuse.search(trimmed)
    return results.slice(0, 5).map(result => ({
      text: result.item,
      query: result.item,
      matches: result.matches,
    }))
  }, [input])

  // Reset selection when suggestions change
  useEffect(() => {
    setSelectedSuggestion(-1)
  }, [filteredSuggestions.length])

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
        ? <span key={i} className="text-[#8B5CF6] font-medium">{part.text}</span>
        : <span key={i}>{part.text}</span>
    )
  }, [])

  // Keyboard handler
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && filteredSuggestions.length > 0) {
      e.preventDefault()
      const idx = selectedSuggestion >= 0 ? selectedSuggestion : 0
      setInput(filteredSuggestions[idx].text)
      setShowAutocomplete(false)
      setSelectedSuggestion(-1)
      return
    }

    if (e.key === 'Escape') {
      setShowAutocomplete(false)
      setSelectedSuggestion(-1)
      return
    }

    if (showAutocomplete && filteredSuggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedSuggestion(prev => prev < filteredSuggestions.length - 1 ? prev + 1 : 0)
        return
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedSuggestion(prev => prev > 0 ? prev - 1 : filteredSuggestions.length - 1)
        return
      }
      if (e.key === 'Enter' && selectedSuggestion >= 0) {
        e.preventDefault()
        const suggestion = filteredSuggestions[selectedSuggestion]
        setShowAutocomplete(false)
        setSelectedSuggestion(-1)
        setInput('')
        append({ role: 'user', content: suggestion.query })
        return
      }
    }
  }, [filteredSuggestions, selectedSuggestion, showAutocomplete, setInput, append])

  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed && !isLoading) {
      setShowAutocomplete(false)
      setIsChatExpanded(true)
      handleSubmit(e)
    }
  }, [input, isLoading, handleSubmit])

  const handleBackClick = () => {
    router.push('/thoughts')
  }

  return (
    <article className="max-w-[640px] mx-auto px-5 py-8 max-md:px-4 max-md:py-5">
      {/* Back link */}
      <button
        onClick={handleBackClick}
        className="text-[0.75rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-6 flex items-center gap-1.5"
      >
        <span>←</span>
        <span>Back to essays</span>
      </button>

      {/* Essay header */}
      <header className="mb-6 max-md:mb-5">
        <h1 className="text-[1.25rem] max-md:text-[1.1rem] font-semibold text-[var(--color-fg)] leading-[1.3] mb-2">
          {essay.title}
        </h1>
        <div className="text-[0.75rem] text-[var(--color-light-muted)] tracking-wide">
          {essay.date} · Amy Yuan
        </div>
      </header>

      {/* Divider */}
      <hr className="border-t border-[var(--color-border)] mb-6 max-md:mb-5" />

      {/* Essay body - rich content */}
      <div className="leading-[1.75]">
        {essay.content.map((block, index) => (
          <ContentBlockRenderer key={index} block={block} index={index} />
        ))}
      </div>

      {/* Footer divider */}
      <div className="border-t border-[var(--color-border)] mt-10 max-md:mt-8 pt-5">
        <button
          onClick={handleBackClick}
          className="text-[0.75rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
        >
          ← Back to essays
        </button>
      </div>

      {/* Chat section */}
      <div className="mt-10 max-md:mt-8 border-t border-[var(--color-border)] pt-8 max-md:pt-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[0.95rem]">💬</span>
          <h2 className="text-[0.85rem] font-medium text-[var(--color-fg)]">Ask about this essay</h2>
        </div>

        {/* Chat messages - shown when expanded */}
        {isChatExpanded && messages.length > 0 && (
          <div className="mb-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fadeIn 0.2s ease-out' }}
              >
                {message.role === 'user' ? (
                  <div className="max-w-[80%] bg-[var(--color-fg)] text-[var(--color-bg)] rounded-2xl rounded-br-sm px-3.5 py-2">
                    <p className="text-[0.85rem] leading-relaxed">{message.content}</p>
                  </div>
                ) : (
                  <div className="flex gap-2.5 max-w-[90%]">
                    <div className="w-7 h-7 rounded-full overflow-hidden border border-[var(--color-border)] flex-shrink-0 mt-0.5">
                      <img src="/profile.jpg" alt="Amy" className="w-full h-full object-cover" />
                    </div>
                    <div className="prose prose-sm max-w-none text-[var(--color-fg)] text-[0.85rem] prose-p:leading-[1.6] prose-p:my-1.5 prose-headings:text-[var(--color-fg)] prose-headings:font-semibold prose-strong:text-[var(--color-fg)] prose-a:text-[var(--color-fg)] prose-a:underline prose-a:underline-offset-2 prose-ul:my-1.5 prose-li:my-0.5 prose-code:text-[0.85em] prose-code:bg-[var(--color-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                <div className="flex gap-2.5 items-start">
                  <div className="w-7 h-7 rounded-full overflow-hidden border border-[var(--color-border)] flex-shrink-0">
                    <img src="/profile.jpg" alt="Amy" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex items-center gap-1 py-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-light-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-light-muted)] rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '0.6s' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-light-muted)] rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }} />
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2.5 px-4 py-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl">
                  <span className="flex items-center justify-center w-5 h-5 bg-[#EF4444] rounded-full flex-shrink-0">
                    <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div className="flex-1">
                    <p className="text-[0.85rem] text-[#991B1B] font-medium">Something went wrong</p>
                    <p className="text-[0.8rem] text-[#B91C1C]">{error.message || 'Failed to get a response.'}</p>
                  </div>
                  <button
                    onClick={() => reload()}
                    className="px-3 py-1.5 bg-[#EF4444] text-white text-[0.8rem] font-medium rounded-lg hover:bg-[#DC2626] transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        {/* Chat input */}
        <form onSubmit={handleFormSubmit} className="relative">
          <div className="flex items-center gap-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg px-3.5 py-2 transition-all duration-150 focus-within:border-[var(--color-muted)] max-md:px-3 max-md:py-1.5 font-mono">
            <span className="text-[#10B981] font-semibold text-[0.8rem]">amy</span>
            <span className="text-[var(--color-light-muted)] text-[0.8rem]">~</span>
            <span className="text-[#8B5CF6] text-[0.8rem]">❯</span>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setShowAutocomplete(true)
              }}
              onFocus={() => setShowAutocomplete(true)}
              onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about this essay..."
              className="flex-1 border-0 bg-transparent text-[0.85rem] py-0.5 outline-none text-[var(--color-fg)] placeholder:text-[var(--color-light-muted)] min-w-0 max-md:text-[0.8rem] font-mono"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-6 h-6 bg-[var(--color-fg)] border-0 rounded-md text-white flex items-center justify-center transition-all duration-100 flex-shrink-0 disabled:opacity-15 disabled:cursor-not-allowed hover:opacity-80 active:scale-90"
              aria-label="Send"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7"/>
              </svg>
            </button>
          </div>

          {/* Autocomplete dropdown */}
          {showAutocomplete && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 bottom-full mb-1.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg overflow-hidden z-10 shadow-md max-h-[240px] overflow-y-auto">
              <div className="px-2.5 py-1 text-[0.6rem] text-[var(--color-light-muted)] border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 bg-[var(--color-card-bg)]">
                <span>Tab · ↑↓ · Enter</span>
                <span>{filteredSuggestions.length}</span>
              </div>
              {filteredSuggestions.map((suggestion, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    append({ role: 'user', content: suggestion.query })
                    setInput('')
                    setShowAutocomplete(false)
                    setIsChatExpanded(true)
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-[0.8rem] transition-colors ${
                    selectedSuggestion === i ? 'bg-[var(--color-surface)]' : 'hover:bg-[var(--color-surface)]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className={selectedSuggestion === i ? 'text-[#8B5CF6]' : 'text-[var(--color-light-muted)]'}>❯</span>
                    <span className={selectedSuggestion === i ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)]'}>
                      {highlightMatch(suggestion.text, suggestion.matches)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </form>
        <p className="text-[0.65rem] text-[var(--color-light-muted)] text-center mt-2">Amy can make mistakes.</p>
      </div>
    </article>
  )
}
