'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { essays, type Essay } from '@/data/essays'

// Re-export for backward compatibility
export { essays, type Essay }

// Typewriter text component
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
    }, 12)

    return () => clearInterval(interval)
  }, [text, onComplete, isComplete])

  return <>{displayedText}</>
}

interface ThoughtsContentProps {
  initialEssaySlug?: string
}

export default function ThoughtsContent({ initialEssaySlug }: ThoughtsContentProps) {
  const router = useRouter()
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(() => {
    if (initialEssaySlug) {
      return essays.find(e => e.id === initialEssaySlug) || null
    }
    return null
  })
  const [visibleParagraphs, setVisibleParagraphs] = useState(0)
  const [headerVisible, setHeaderVisible] = useState(false)
  const paragraphsComplete = useRef(0)

  useEffect(() => {
    if (selectedEssay) {
      // Reset state for new essay
      paragraphsComplete.current = 0
      setVisibleParagraphs(0)
      setHeaderVisible(false)

      // Show header first
      setTimeout(() => {
        setHeaderVisible(true)
        // Then start paragraphs
        setTimeout(() => {
          setVisibleParagraphs(1)
        }, 300)
      }, 100)
    }
  }, [selectedEssay])

  const handleParagraphComplete = () => {
    if (!selectedEssay) return
    paragraphsComplete.current += 1
    if (paragraphsComplete.current < selectedEssay.paragraphs.length) {
      setTimeout(() => {
        setVisibleParagraphs(prev => prev + 1)
      }, 80)
    }
  }

  // Navigate to essay page (updates URL)
  const handleEssayClick = (essay: Essay) => {
    router.push(`/thoughts/${essay.id}`)
  }

  // Navigate back to thoughts list (updates URL)
  const handleBackClick = () => {
    router.push('/thoughts')
  }

  // Show essay list
  if (!selectedEssay) {
    return (
      <div className="text-[var(--color-fg)]">
        <p className="text-[0.9rem] max-md:text-[0.85rem] text-[var(--color-muted)] mb-6">
          Thoughts on AI, building, climbing and what holds up in the world.
        </p>

        <div className="space-y-4">
          {essays.map((essay) => (
            <button
              key={essay.id}
              onClick={() => handleEssayClick(essay)}
              className="block w-full text-left group"
            >
              <div className="flex items-baseline justify-between gap-4 mb-1">
                <h3 className="text-[0.95rem] max-md:text-[0.9rem] font-medium underline underline-offset-2 decoration-[var(--color-border)] group-hover:decoration-[var(--color-fg)] transition-colors">
                  {essay.title}
                </h3>
                <span className="text-[0.75rem] text-[var(--color-light-muted)] flex-shrink-0">
                  {essay.date}
                </span>
              </div>
              <p className="text-[0.85rem] max-md:text-[0.8rem] text-[var(--color-light-muted)]">
                {essay.preview}
              </p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // Show selected essay
  return (
    <div className="text-[var(--color-fg)]">
      {/* Back link */}
      <button
        onClick={handleBackClick}
        className="text-[0.8rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors mb-6 flex items-center gap-1.5"
      >
        <span>←</span>
        <span>Back to essays</span>
      </button>

      {/* Essay header */}
      <div
        className={`mb-8 max-md:mb-6 transition-opacity duration-500 ${headerVisible ? 'opacity-100' : 'opacity-0'}`}
      >
        <h2 className="text-[1.1rem] max-md:text-[1rem] font-semibold mb-1">{selectedEssay.title}</h2>
        <span className="text-[0.75rem] text-[var(--color-light-muted)] tracking-wide">{selectedEssay.date}</span>
      </div>

      {/* Essay body */}
      <div className="text-[0.9rem] max-md:text-[0.85rem] leading-[1.9] space-y-5 max-md:space-y-4">
        {selectedEssay.paragraphs.map((text, index) => (
          index < visibleParagraphs && (
            <p key={index} className="text-[var(--color-muted)]">
              <TypewriterText
                text={text}
                onComplete={index === visibleParagraphs - 1 ? handleParagraphComplete : undefined}
              />
            </p>
          )
        ))}
      </div>

      {/* Footer divider - shows after all paragraphs */}
      {visibleParagraphs >= selectedEssay.paragraphs.length && (
        <div className="mt-10 max-md:mt-8 pt-6 border-t border-[var(--color-border)] animate-fadeIn">
          <button
            onClick={handleBackClick}
            className="text-[0.8rem] text-[var(--color-muted)] hover:text-[var(--color-fg)] transition-colors"
          >
            ← Back to essays
          </button>
        </div>
      )}
    </div>
  )
}
