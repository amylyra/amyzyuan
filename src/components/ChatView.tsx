'use client'

import { useRef, useEffect, useCallback } from 'react'
import { useChat } from '@ai-sdk/react'
import { createChatSession, saveChatMessage } from '@/lib/supabase'

interface ChatViewProps {
  showChat: boolean
  onClose: () => void
  initialMessage?: string
}

export default function ChatView({ showChat, onClose, initialMessage }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const sessionIdRef = useRef<string | null>(null)
  const hasInitialized = useRef(false)
  const lastSavedMessageCount = useRef(0)

  const { messages, input, setInput, handleSubmit, isLoading, setMessages, append } = useChat({
    api: '/api/chat',
  })

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
      // Create a new chat session only if we don't have one
      if (!sessionIdRef.current) {
        createChatSession().then((id) => {
          sessionIdRef.current = id
        })
      }

      // Focus input
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })

      // Send initial message if provided - auto submit
      if (initialMessage && !hasInitialized.current) {
        hasInitialized.current = true
        // Use append to directly send the message
        append({ role: 'user', content: initialMessage })
      }
    } else {
      // Only reset initialization flag, keep session for persistence
      hasInitialized.current = false
    }
  }, [showChat, initialMessage, append])

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
      className={`fixed inset-0 bg-[var(--color-bg)] z-20 flex flex-col transition-all duration-400 ease-out ${
        showChat ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-5 py-4 border-b border-[var(--color-border)] max-md:px-4 max-md:py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)] transition-colors duration-150 active:scale-95"
            aria-label="Back"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="text-[0.9rem] font-medium text-[var(--color-fg)] hover:opacity-70 transition-opacity duration-150"
          >
            Amy
          </button>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)] transition-colors duration-150 active:scale-95"
          aria-label="Close"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <div className="max-w-[640px] mx-auto px-5 py-6 max-md:px-4 max-md:py-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <h2 className="text-lg font-medium text-[var(--color-fg)] mb-2">Hi, I&apos;m Amy</h2>
              <p className="text-[0.9rem] text-[var(--color-muted)] max-w-xs">
                Ask me about my work, projects, or anything else.
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
                    <div className="max-w-[90%]">
                      <div className="text-[0.9rem] leading-[1.7] text-[var(--color-fg)] max-md:text-[0.85rem] whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start" style={{ animation: 'fadeIn 0.15s ease-out' }}>
                  <div className="flex items-center gap-1 py-2">
                    <span className="w-1.5 h-1.5 bg-[var(--color-light-muted)] rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '0.6s' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-light-muted)] rounded-full animate-bounce" style={{ animationDelay: '100ms', animationDuration: '0.6s' }} />
                    <span className="w-1.5 h-1.5 bg-[var(--color-light-muted)] rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '0.6s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area */}
      <footer className="flex-none bg-[var(--color-bg)] border-t border-[var(--color-border)]">
        <div className="max-w-[640px] mx-auto px-5 py-4 max-md:px-4 max-md:py-3">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-1.5 mb-3 max-md:mb-2.5">
            {suggestions.map(({ message, label }) => (
              <button
                key={label}
                onClick={() => handleSuggestionClick(message)}
                className="px-3 py-1.5 border border-[var(--color-border)] rounded-full text-[0.8rem] text-[var(--color-muted)] transition-colors duration-100 hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)] active:scale-[0.98] max-md:text-[0.75rem] max-md:px-2.5 max-md:py-1"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 bg-[var(--color-card-bg)] border border-[var(--color-border)] rounded-xl px-4 py-2 transition-all duration-150 focus-within:border-[var(--color-muted)] focus-within:shadow-sm max-md:px-3 max-md:py-1.5 max-md:rounded-lg">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="flex-1 border-0 bg-transparent text-[0.9rem] py-1.5 outline-none text-[var(--color-fg)] placeholder:text-[var(--color-light-muted)] min-w-0 max-md:text-[0.85rem] max-md:py-1"
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
          </form>
          <p className="text-[0.7rem] text-[var(--color-light-muted)] text-center mt-2.5">Amy can make mistakes. Consider checking important information.</p>
        </div>
      </footer>
    </div>
  )
}
