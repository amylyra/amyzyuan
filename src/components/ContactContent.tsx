'use client'

import { useState, useEffect, useRef } from 'react'

function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        const charsToAdd = Math.min(2, text.length - indexRef.current)
        setDisplayedText(text.slice(0, indexRef.current + charsToAdd))
        indexRef.current += charsToAdd
      } else {
        setIsComplete(true)
        onComplete?.()
        clearInterval(interval)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [text, onComplete, isComplete])

  return <>{displayedText}</>
}

export default function ContactContent() {
  const [visibleLines, setVisibleLines] = useState(0)
  const linesComplete = useRef(0)

  useEffect(() => {
    setVisibleLines(1)
  }, [])

  const handleLineComplete = () => {
    linesComplete.current += 1
    if (linesComplete.current < 2) {
      setTimeout(() => {
        setVisibleLines(prev => prev + 1)
      }, 200)
    }
  }

  return (
    <div className="text-[var(--color-fg)]">
      {visibleLines >= 1 && (
        <p className="text-[0.95rem] leading-[1.8] mb-4 max-md:text-[0.9rem]">
          <TypewriterText
            text="Wanna build together? Or just chat?"
            onComplete={handleLineComplete}
          />
        </p>
      )}

      {visibleLines >= 2 && (
        <p className="text-[0.95rem] leading-[1.8] mb-6 max-md:text-[0.9rem] text-[var(--color-muted)]">
          <TypewriterText
            text="I'm interested in hard problems, unusual backgrounds, and people who ship. Email me at amy@durinlab.com"
            onComplete={handleLineComplete}
          />
        </p>
      )}

      {linesComplete.current >= 2 && (
        <div className="space-y-4 animate-fadeIn">
          <a
            href="mailto:amy@durinlab.com"
            className="inline-flex items-center gap-2 px-5 py-3 bg-[var(--color-fg)] text-[var(--color-bg)] text-[0.9rem] font-medium rounded-xl hover:opacity-90 transition-opacity"
          >
            <span>amy@durinlab.com</span>
            <span>→</span>
          </a>
          <div className="flex gap-5 text-[0.85rem]">
            <a href="https://www.linkedin.com/in/amy-zaoshi-yuan-b482707/" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors underline underline-offset-2">LinkedIn</a>
            <a href="https://github.com/amylyra" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors underline underline-offset-2">GitHub</a>
            <a href="https://scholar.google.com/citations?user=2hzkufcAAAAJ&hl=en" target="_blank" rel="noopener noreferrer" className="text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors underline underline-offset-2">Scholar</a>
          </div>
        </div>
      )}
    </div>
  )
}
