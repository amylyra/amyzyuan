'use client'

import { useState, useRef } from 'react'

export default function ContactContent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    // Simulate sending - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSending(false)
    setSent(true)
  }

  if (sent) {
    return (
      <div className="text-[var(--color-fg)]">
        <p className="text-[0.95rem] leading-[1.8] mb-4">
          Message sent. I'll be in touch.
        </p>
      </div>
    )
  }

  return (
    <div className="text-[var(--color-fg)]">
      <p className="text-[0.95rem] leading-[1.8] mb-6 max-md:text-[0.9rem]">
        Wanna build together? Or just chat?<br />
        Leave a message here or email <a href="mailto:amy@durinlab.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">amy@durinlab.com</a>
      </p>

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[0.9rem] outline-none focus:border-[var(--color-muted)] transition-colors"
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[0.9rem] outline-none focus:border-[var(--color-muted)] transition-colors"
          />
        </div>
        <div>
          <textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[0.9rem] outline-none focus:border-[var(--color-muted)] transition-colors resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className="px-6 py-2.5 bg-[var(--color-fg)] text-[var(--color-bg)] text-[0.85rem] font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
