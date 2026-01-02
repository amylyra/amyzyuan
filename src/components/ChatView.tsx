'use client'

import { useRef, useEffect, useState, useCallback } from 'react'

interface ChatViewProps {
  showChat: boolean
  onClose: () => void
  initialTopic?: string
  initialCommand?: string
}

interface Message {
  id: string
  role: 'user' | 'amy'
  content: string
}

export default function ChatView({ showChat, onClose, initialTopic, initialCommand }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasInitialized = useRef(false)

  // Smooth scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, isTyping])

  const addMessage = useCallback((role: 'user' | 'amy', content: string) => {
    setMessages((prev) => [...prev, { id: `${Date.now()}-${Math.random()}`, role, content }])
  }, [])

  const showTypingIndicator = useCallback(() => setIsTyping(true), [])
  const hideTypingIndicator = useCallback(() => setIsTyping(false), [])

  const topicContent: Record<string, { question: string; answer: string }> = {
    about: {
      question: "Tell me about yourself",
      answer: `
        <div class="rich-card">
          <div class="rich-card-image"></div>
          <div class="rich-card-content">
            <h3>Zaoshi (Amy) Yuan</h3>
            <p>Trained in large-scale computational physics at Stanford. Co-founded and scaled an AI-powered personalization company to $150M+ in total revenue.</p>
            <p class="text-secondary">Still building, looking for the next hard problem in AI.</p>
            <div class="rich-card-links">
              <a href="https://linkedin.com/in/amyzyuan" target="_blank">LinkedIn</a>
              <a href="mailto:amy@example.com">Email</a>
            </div>
          </div>
        </div>
      `,
    },
    projects: {
      question: "What projects are you working on?",
      answer: `
        <div class="project-list">
          <div class="project-item">
            <div class="project-header">
              <h4>Proven</h4>
              <span class="project-status active">Scaled to $150M+</span>
            </div>
            <p>AI-powered personalization engine for skincare and cosmetics. Built ML models for user behavior prediction and product recommendations.</p>
            <div class="project-tags">
              <span>AI/ML</span>
              <span>SaaS</span>
              <span>Personalization</span>
            </div>
          </div>
          <div class="project-item">
            <div class="project-header">
              <h4>Durin</h4>
              <span class="project-status">In Progress</span>
            </div>
            <p>AI infrastructure for the next generation of intelligent systems. Focusing on scalability and developer experience.</p>
            <div class="project-tags">
              <span>Infrastructure</span>
              <span>Developer Tools</span>
            </div>
          </div>
          <div class="project-item">
            <div class="project-header">
              <h4>Noteworthy</h4>
              <span class="project-status">In Progress</span>
            </div>
            <p>Personalized fragrance discovery platform using AI to match scent profiles with individual preferences.</p>
            <div class="project-tags">
              <span>Consumer</span>
              <span>AI Matching</span>
            </div>
          </div>
        </div>
      `,
    },
    climbing: {
      question: "Tell me about your climbing",
      answer: `
        <div class="adventure-section">
          <h4>Mountaineering & Alpine Climbing</h4>
          <p>Experienced mountaineer with ascents in the Himalayas, Andes, and Rockies. Specializes in technical alpine routes and high-altitude expeditions.</p>
          <div class="project-tags">
            <span>Mountaineering</span>
            <span>Alpine</span>
            <span>Expeditions</span>
          </div>
          <blockquote>"The mountains teach patience, resilience, and the value of preparation. Every summit is a lesson in systems thinking."</blockquote>
        </div>
      `,
    },
  }

  const cmdContent: Record<string, { question: string; answer: string }> = {
    proven: {
      question: "Tell me about Proven",
      answer: `<p><strong>Proven</strong> is an AI-powered skincare personalization company I co-founded. We built machine learning models that analyze skin profiles, lifestyle factors, and environmental data to create personalized formulations.</p><p class="text-secondary">We scaled to $150M+ in revenue by combining cutting-edge AI with deep expertise in cosmetic chemistry.</p>`,
    },
    durin: {
      question: "Tell me about Durin",
      answer: `<p><strong>Durin</strong> is my current focus—building AI infrastructure that makes it easier for developers to create intelligent systems. Think of it as the foundation layer for the next generation of AI applications.</p>`,
    },
    noteworthy: {
      question: "Tell me about Noteworthy",
      answer: `<p><strong>Noteworthy</strong> applies similar personalization principles to fragrance discovery. We use AI to understand individual scent preferences and match people with perfumes they'll love.</p>`,
    },
    technical: {
      question: "What's your technical background?",
      answer: `<p>I have a PhD in Computational Physics from Stanford, where I worked on large-scale simulations and high-performance computing. My technical work spans:</p><ul><li>Machine learning for personalization at scale</li><li>Distributed systems and infrastructure</li><li>Algorithm design for recommendation engines</li><li>Computer vision and natural language processing</li></ul>`,
    },
    contact_info: {
      question: "How can I contact you?",
      answer: `<p>You can reach me at <a href="mailto:amy@example.com">amy@example.com</a> or connect on <a href="https://linkedin.com/in/amyzyuan" target="_blank">LinkedIn</a>.</p>`,
    },
  }

  const handleTopic = useCallback((topic: string) => {
    const content = topicContent[topic]
    if (!content) return

    addMessage('user', content.question)
    
    // Immediate typing indicator for responsiveness
    requestAnimationFrame(() => {
      showTypingIndicator()
      setTimeout(() => {
        hideTypingIndicator()
        addMessage('amy', content.answer)
      }, 400 + Math.random() * 200)
    })
  }, [addMessage, showTypingIndicator, hideTypingIndicator])

  const handleCommand = useCallback((cmd: string) => {
    const content = cmdContent[cmd]
    if (!content) return

    addMessage('user', content.question)
    
    requestAnimationFrame(() => {
      showTypingIndicator()
      setTimeout(() => {
        hideTypingIndicator()
        addMessage('amy', content.answer)
      }, 400 + Math.random() * 200)
    })
  }, [addMessage, showTypingIndicator, hideTypingIndicator])

  useEffect(() => {
    if (showChat) {
      // Focus input immediately for better responsiveness
      requestAnimationFrame(() => {
        inputRef.current?.focus()
      })
      
      if (initialTopic && !hasInitialized.current) {
        hasInitialized.current = true
        // Small delay for smooth transition
        setTimeout(() => handleTopic(initialTopic), 150)
      } else if (initialCommand && !hasInitialized.current) {
        hasInitialized.current = true
        setTimeout(() => handleCommand(initialCommand), 150)
      }
    } else {
      hasInitialized.current = false
      setMessages([])
      setInput('')
    }
  }, [showChat, initialTopic, initialCommand, handleTopic, handleCommand])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return
    
    // Clear input immediately for responsiveness
    setInput('')
    addMessage('user', trimmedInput)

    requestAnimationFrame(() => {
      showTypingIndicator()
      setTimeout(() => {
        hideTypingIndicator()
        addMessage('amy', "Thanks for reaching out! Feel free to explore the suggestions below or ask me something specific about my work.")
      }, 600 + Math.random() * 300)
    })
  }

  const suggestions = [
    { cmd: 'proven', label: 'PROVEN' },
    { cmd: 'durin', label: 'Durin' },
    { cmd: 'noteworthy', label: 'Noteworthy' },
    { cmd: 'technical', label: 'Technical' },
    { cmd: 'contact_info', label: 'Contact' },
  ]

  return (
    <div
      className={`fixed inset-0 bg-[var(--color-bg)] z-20 flex flex-col transition-all duration-400 ease-out ${
        showChat ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}
    >
      {/* Header - minimal */}
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
                      <div 
                        className="chat-content text-[0.9rem] leading-[1.7] text-[var(--color-fg)] max-md:text-[0.85rem]"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
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

      {/* Input area - clean and responsive */}
      <footer className="flex-none bg-[var(--color-bg)] border-t border-[var(--color-border)]">
        <div className="max-w-[640px] mx-auto px-5 py-4 max-md:px-4 max-md:py-3">
          {/* Suggestions */}
          <div className="flex flex-wrap gap-1.5 mb-3 max-md:mb-2.5">
            {suggestions.map(({ cmd, label }) => (
              <button
                key={cmd}
                onClick={() => handleCommand(cmd)}
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
                disabled={!input.trim()}
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
