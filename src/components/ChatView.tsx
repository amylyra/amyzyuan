'use client'

import { useRef, useEffect, useCallback, useState, useMemo } from 'react'
import { useChat } from '@ai-sdk/react'
import { createChatSession, saveChatMessage } from '@/lib/supabase'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Fuse, { FuseResultMatch } from 'fuse.js'
import AboutContent from './AboutContent'
import ProjectsContent from './ProjectsContent'

// Slash commands for quick access
const slashCommands = [
  { cmd: '/proven', description: 'Learn about PROVEN skincare', query: 'Tell me about PROVEN' },
  { cmd: '/durin', description: 'Learn about Durin AI', query: 'Tell me about Durin' },
  { cmd: '/noteworthy', description: 'Learn about Noteworthy', query: 'Tell me about Noteworthy' },
  { cmd: '/pawgress', description: 'Learn about Pawgress', query: 'What is Pawgress?' },
  { cmd: '/climbing', description: 'Mountaineering expeditions', query: 'Tell me about your mountaineering' },
  { cmd: '/research', description: 'Research and papers', query: 'What are your research interests?' },
  { cmd: '/patents', description: 'Patents and IP', query: 'What patents do you have?' },
  { cmd: '/contact', description: 'Get in touch', query: 'How can I contact you?' },
  { cmd: '/tech', description: 'Tech stack', query: "What's your tech stack?" },
]

const chatSuggestions = [
  "Tell me about PROVEN",
  "Tell me about Durin",
  "Tell me about Noteworthy",
  "What is Pawgress?",
  "Tell me about your games and apps",
  "Tell me about your exits",
  "What's your technical background?",
  "How did you scale to $150MM?",
  "What are your research interests?",
  "Tell me about your world record simulation",
  "Tell me about your mountaineering",
  "Tell me about climbing Cotopaxi",
  "Tell me about climbing Mont Blanc",
  "What patents do you have?",
  "Tell me about Stanford",
  "Tell me about MIT AI Idol",
  "How can I contact you?",
  "What's your tech stack?",
]

const fuse = new Fuse(chatSuggestions, {
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

interface ChatViewProps {
  showChat: boolean
  onClose: () => void
  initialMessage?: string
  initialResponse?: string
  isAbout?: boolean
  isProjects?: boolean
}

export default function ChatView({ showChat, onClose, initialMessage, initialResponse, isAbout, isProjects }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionIdRef = useRef<string | null>(null)
  const lastInitialMessage = useRef<string | undefined>(undefined)
  const lastSavedMessageCount = useRef(0)

  const [showAutocomplete, setShowAutocomplete] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  const { messages, input, setInput, handleSubmit, isLoading, setMessages, append, error, reload } = useChat({
    api: '/api/chat',
  })

  // Determine if input is a slash command
  const isSlashCommand = input.startsWith('/')

  // Fuzzy search for autocomplete
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
      return results.slice(0, 6).map(result => ({
        type: 'slash' as const,
        text: result.item.cmd,
        description: result.item.description,
        query: result.item.query,
        matches: result.matches,
      }))
    }

    // Don't show suggestions when input is empty
    if (!trimmed) {
      return []
    }

    // Fuzzy search regular suggestions
    const results = fuse.search(trimmed)
    return results.slice(0, 5).map(result => ({
      type: 'suggestion' as const,
      text: result.item,
      description: undefined,
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

  // Keyboard handler for terminal-like behavior
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Tab completion
    if (e.key === 'Tab') {
      e.preventDefault()
      if (filteredSuggestions.length > 0) {
        const idx = selectedSuggestion >= 0 ? selectedSuggestion : 0
        const suggestion = filteredSuggestions[idx]
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

    // Ctrl+C/L/U to clear
    if (e.ctrlKey && (e.key === 'c' || e.key === 'l' || e.key === 'u')) {
      e.preventDefault()
      setInput('')
      setShowAutocomplete(false)
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
      // Enter with selection sends that suggestion
      if (e.key === 'Enter' && selectedSuggestion >= 0) {
        e.preventDefault()
        const suggestion = filteredSuggestions[selectedSuggestion]
        const query = suggestion.query
        setShowAutocomplete(false)
        setSelectedSuggestion(-1)
        setInput('')
        setCommandHistory(prev => [...prev.filter(cmd => cmd !== query), query])
        append({ role: 'user', content: query })
        return
      }
    }

    // Command history navigation
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
  }, [filteredSuggestions, selectedSuggestion, showAutocomplete, commandHistory, historyIndex, setInput, append])

  // Custom submit handler to track history
  const handleFormSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed && !isLoading) {
      setCommandHistory(prev => [...prev.filter(cmd => cmd !== trimmed), trimmed])
      setHistoryIndex(-1)
      setShowAutocomplete(false)
      handleSubmit(e)
    }
  }, [input, isLoading, handleSubmit])

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isLoading])

  // Save new messages to Supabase
  useEffect(() => {
    if (!sessionIdRef.current || messages.length === 0) return

    // Only save messages we haven't saved yet
    const newMessages = messages.slice(lastSavedMessageCount.current)
    newMessages.forEach((msg) => {
      const role = msg.role === 'user' ? 'user' : 'amy'
      saveChatMessage(sessionIdRef.current!, role, msg.content)
    })
    lastSavedMessageCount.current = messages.length
  }, [messages])

  // Handle initial message and chat open/close
  useEffect(() => {
    if (showChat) {
      // Focus input
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })

      // Handle initial response only (no user message) - like About page
      if (initialResponse && !initialMessage && initialResponse !== lastInitialMessage.current) {
        lastInitialMessage.current = initialResponse

        // Clear previous messages and start fresh conversation
        setMessages([])
        lastSavedMessageCount.current = 0

        // Create a new chat session
        createChatSession().then((id) => {
          sessionIdRef.current = id
        })

        // Set only the assistant message
        setTimeout(() => {
          setMessages([
            { id: `assistant-${Date.now()}`, role: 'assistant' as const, content: initialResponse },
          ])
        }, 50)
      }
      // Handle initial message with optional response
      else if (initialMessage && initialMessage !== lastInitialMessage.current) {
        lastInitialMessage.current = initialMessage

        // Clear previous messages and start fresh conversation
        setMessages([])
        lastSavedMessageCount.current = 0

        // Create a new chat session for each new topic
        createChatSession().then((id) => {
          sessionIdRef.current = id
        })

        // If we have a pre-written response, set messages directly
        if (initialResponse) {
          setTimeout(() => {
            setMessages([
              { id: `user-${Date.now()}`, role: 'user' as const, content: initialMessage },
              { id: `assistant-${Date.now()}`, role: 'assistant' as const, content: initialResponse },
            ])
          }, 50)
        } else {
          // Small delay to ensure state is cleared before appending
          setTimeout(() => {
            append({ role: 'user', content: initialMessage })
          }, 50)
        }
      } else if (!initialMessage && !initialResponse && !sessionIdRef.current) {
        // No initial message, just opening chat - create session if needed
        createChatSession().then((id) => {
          sessionIdRef.current = id
        })
      }
    } else {
      // Reset when chat closes
      lastInitialMessage.current = undefined
    }
  }, [showChat, initialMessage, initialResponse, append, setMessages])

  const suggestions = [
    { message: 'Tell me about PROVEN', label: 'PROVEN' },
    { message: 'Tell me about Durin', label: 'Durin' },
    { message: 'Tell me about Noteworthy', label: 'Noteworthy' },
    { message: "What's your technical background?", label: 'Technical' },
    { message: 'How can I contact you?', label: 'Contact' },
  ]

  const handleSuggestionClick = useCallback((message: string) => {
    append({ role: 'user', content: message })
  }, [append])

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-[100dvh] bg-[var(--color-bg)] z-50 flex flex-col transition-all duration-300 ease-out ${
        showChat ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
      style={{ height: '100dvh', maxHeight: '-webkit-fill-available' }}
    >
      {/* Terminal-style Header */}
      <header className="flex-none border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center px-4 py-3 max-md:px-3 max-md:py-2.5">
          <button
            onClick={onClose}
            className="flex items-center gap-2 mr-4"
            aria-label="Back"
          >
            <div className="w-3 h-3 rounded-full bg-[#FF5F56] hover:opacity-80 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:opacity-80 transition-opacity" />
            <div className="w-3 h-3 rounded-full bg-[#27CA3F] hover:opacity-80 transition-opacity" />
          </button>
          <span className="flex-1 text-center text-[0.8rem] text-[var(--color-muted)] font-mono">amy — chat</span>
          <div className="w-[52px]" />
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-[640px] mx-auto px-5 py-6 max-md:px-4 max-md:py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-start min-h-[40vh] pt-8 font-mono">
              <div className="mb-1">
                <span className="text-[var(--color-light-muted)]">┌</span>
                <span className="text-[var(--color-muted)] ml-2">Welcome to amy.chat</span>
              </div>
              <div className="mb-4">
                <span className="text-[var(--color-light-muted)]">└</span>
                <span className="text-[var(--color-light-muted)] ml-2">Ask me about my work, projects, or anything else.</span>
              </div>
              <p className="text-[0.85rem] text-[var(--color-light-muted)]">
                Type a message below or use <span className="text-[#8B5CF6]">/</span> commands
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  style={{ animation: 'fadeIn 0.2s ease-out' }}
                >
                  {message.role === 'user' ? (
                    <div className="max-w-[80%] bg-[var(--color-fg)] text-[var(--color-bg)] rounded-2xl rounded-br-sm px-4 py-2.5 max-md:px-3.5 max-md:py-2">
                      <p className="text-[0.9rem] leading-relaxed max-md:text-[0.85rem]">{message.content}</p>
                    </div>
                  ) : (
                    <div className="flex gap-3 max-w-[90%]">
                      {/* Amy's avatar */}
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--color-border)] flex-shrink-0 mt-0.5">
                        <img
                          src="/profile.jpg"
                          alt="Amy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="prose prose-sm max-w-none text-[var(--color-fg)] prose-p:leading-[1.7] prose-p:my-2 prose-headings:text-[var(--color-fg)] prose-headings:font-semibold prose-strong:text-[var(--color-fg)] prose-a:text-[var(--color-fg)] prose-a:underline prose-a:underline-offset-2 prose-ul:my-2 prose-li:my-0.5 prose-code:text-[0.85em] prose-code:bg-[var(--color-surface)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none max-md:text-[0.85rem]">
                        {isAbout && message.id?.startsWith('assistant-') ? (
                          <AboutContent />
                        ) : isProjects && message.id?.startsWith('assistant-') ? (
                          <ProjectsContent />
                        ) : (
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                  <div className="flex gap-3 items-start">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[var(--color-border)] flex-shrink-0">
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
                <div className="flex justify-start" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                  <div className="flex items-center gap-2.5 px-4 py-3 bg-[#FEF2F2] border border-[#FECACA] rounded-xl">
                    <span className="flex items-center justify-center w-5 h-5 bg-[#EF4444] rounded-full flex-shrink-0">
                      <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
                      </svg>
                    </span>
                    <div className="flex-1">
                      <p className="text-[0.85rem] text-[#991B1B] font-medium">Something went wrong</p>
                      <p className="text-[0.8rem] text-[#B91C1C]">{error.message || 'Failed to get a response. Please try again.'}</p>
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
        </div>
      </div>

      {/* Input area */}
      <footer className="flex-none bg-[var(--color-surface)] border-t border-[var(--color-border)]">
        <div className="max-w-[640px] mx-auto px-5 py-4 max-md:px-4 max-md:py-3">
          {/* Suggestions - Terminal style chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-3 max-md:mb-2.5 max-md:gap-1.5">
            {suggestions.map(({ message, label }) => (
              <button
                key={label}
                onClick={() => handleSuggestionClick(message)}
                className="px-3 py-1.5 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-full text-[0.8rem] font-mono text-[var(--color-muted)] transition-colors duration-100 hover:border-[var(--color-muted)] hover:text-[var(--color-fg)] active:scale-[0.98] max-md:text-[0.75rem] max-md:px-2.5 max-md:py-1 whitespace-nowrap flex-shrink-0 flex items-center gap-1.5"
              >
                <span className="text-[#8B5CF6]">/</span>
                <span>{label.toLowerCase()}</span>
              </button>
            ))}
          </div>

          {/* Terminal-style Input */}
          <form onSubmit={handleFormSubmit} className="relative">
            <div className="flex items-center gap-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl px-4 py-2.5 transition-all duration-150 focus-within:border-[var(--color-muted)] focus-within:shadow-sm max-md:px-3 max-md:py-2 max-md:rounded-lg font-mono">
              <span className="text-[#10B981] font-semibold text-[0.85rem]">amy</span>
              <span className="text-[var(--color-light-muted)] text-[0.85rem]">~</span>
              <span className="text-[#8B5CF6] text-[0.85rem]">❯</span>
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  setShowAutocomplete(true)
                  setHistoryIndex(-1)
                }}
                onFocus={() => setShowAutocomplete(true)}
                onBlur={() => setTimeout(() => setShowAutocomplete(false), 150)}
                onKeyDown={handleKeyDown}
                placeholder="Type / for commands..."
                className="flex-1 border-0 bg-transparent text-[0.9rem] py-0.5 outline-none text-[var(--color-fg)] placeholder:text-[var(--color-light-muted)] min-w-0 max-md:text-[0.85rem] font-mono"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-7 h-7 bg-[var(--color-fg)] border-0 rounded-lg text-white flex items-center justify-center transition-all duration-100 flex-shrink-0 disabled:opacity-15 disabled:cursor-not-allowed hover:opacity-80 active:scale-90 max-md:w-6 max-md:h-6 max-md:rounded-md"
                aria-label="Send"
              >
                <svg className="w-3.5 h-3.5 max-md:w-3 max-md:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7"/>
                </svg>
              </button>
            </div>

            {/* Autocomplete dropdown */}
            {showAutocomplete && filteredSuggestions.length > 0 && (
              <div className="absolute left-0 right-0 bottom-full mb-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-lg overflow-hidden z-10 shadow-lg max-h-[280px] overflow-y-auto">
                <div className="px-3 py-1.5 text-[0.6rem] text-[var(--color-light-muted)] border-b border-[var(--color-border)] flex items-center justify-between sticky top-0 bg-[var(--color-card-bg)]">
                  <span>{isSlashCommand ? 'Commands' : 'Suggestions'} · Tab · ↑↓ · Enter</span>
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
                      setCommandHistory(prev => [...prev.filter(cmd => cmd !== suggestion.query), suggestion.query])
                    }}
                    className={`w-full text-left px-3 py-2 text-[0.85rem] transition-colors ${
                      selectedSuggestion === i
                        ? 'bg-[var(--color-surface)]'
                        : 'hover:bg-[var(--color-surface)]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={selectedSuggestion === i ? 'text-[#8B5CF6]' : 'text-[var(--color-light-muted)]'}>
                        {suggestion.type === 'slash' ? '/' : '❯'}
                      </span>
                      <span className={selectedSuggestion === i ? 'text-[var(--color-fg)]' : 'text-[var(--color-muted)]'}>
                        {suggestion.type === 'slash'
                          ? <span className="text-[#10B981] font-medium">{suggestion.text}</span>
                          : highlightMatch(suggestion.text, suggestion.matches)
                        }
                      </span>
                    </div>
                    {suggestion.description && (
                      <div className="ml-5 mt-0.5 text-[0.75rem] text-[var(--color-light-muted)]">
                        {suggestion.description}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </form>
          <p className="text-[0.7rem] text-[var(--color-light-muted)] text-center mt-2.5">Amy can make mistakes. Consider checking important information.</p>
        </div>
      </footer>
    </div>
  )
}
