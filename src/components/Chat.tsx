'use client'

import { useChat } from 'ai/react'
import { useRef, useEffect } from 'react'

interface ChatProps {
  onClose: () => void
}

export default function Chat({ onClose }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSuggestedPrompt = (prompt: string) => {
    handleInputChange({ target: { value: prompt } } as React.ChangeEvent<HTMLInputElement>)
    inputRef.current?.focus()
  }

  return (
    <section className="fixed inset-0 z-40 flex flex-col bg-coal">
      {/* Header */}
      <header className="flex-none border-b border-ash/50 bg-coal/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ember to-amber flex items-center justify-center text-coal font-medium text-sm">
              AY
            </div>
            <div>
              <h2 className="text-cream font-medium">Chat with Amy</h2>
              <p className="text-xs text-fog">AI-powered conversation</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 text-fog hover:text-cream hover:bg-ash rounded-lg transition-all duration-300"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </header>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-ember/20 to-amber/10 flex items-center justify-center">
                <svg className="w-10 h-10 text-ember" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 
                className="text-2xl text-cream mb-3"
                style={{ fontFamily: 'var(--font-family-display)' }}
              >
                Hello! I&apos;m Amy&apos;s AI assistant
              </h3>
              <p className="text-fog max-w-md mx-auto">
                Ask me about Amy&apos;s work in AI, her entrepreneurial journey, computational physics background, or anything else you&apos;d like to know.
              </p>
              
              {/* Suggested prompts */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  "What's Amy working on now?",
                  "Tell me about her AI company",
                  "What's her physics background?",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="px-4 py-2 text-sm text-fog hover:text-cream bg-ash/30 hover:bg-ash/50 border border-ash hover:border-fog rounded-full transition-all duration-300"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-6 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-up`}
            >
              <div
                className={`max-w-[80%] chat-message ${
                  message.role === 'user' ? 'chat-message-user' : 'chat-message-assistant'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-ember to-amber" />
                    <span className="text-xs text-fog">Amy&apos;s AI</span>
                  </div>
                )}
                <p className={`text-sm sm:text-base leading-relaxed ${
                  message.role === 'user' ? 'text-cream' : 'text-mist'
                }`}>
                  {message.content}
                </p>
              </div>
            </div>
          ))}
          
          {isLoading && messages[messages.length - 1]?.role === 'user' && (
            <div className="mb-6 flex justify-start animate-fade-up">
              <div className="chat-message chat-message-assistant">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-ember to-amber animate-pulse" />
                  <span className="text-xs text-fog">Amy&apos;s AI</span>
                </div>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-fog rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-fog rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-fog rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              Something went wrong. Please try again.
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      {/* Input */}
      <footer className="flex-none border-t border-ash/50 bg-coal/80 backdrop-blur-xl">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-6 py-4">
          <div className="relative glow-border rounded-2xl">
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything about Amy..."
              className="w-full bg-smoke border border-ash rounded-2xl px-6 py-4 pr-14 text-cream placeholder-fog focus:outline-none focus:border-ember/50 transition-colors duration-300"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-br from-ember to-amber text-coal rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all duration-300"
              aria-label="Send message"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          <p className="mt-3 text-center text-xs text-fog">
            Powered by AI · Responses are generated and may not always be accurate
          </p>
        </form>
      </footer>
    </section>
  )
}
