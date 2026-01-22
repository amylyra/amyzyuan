'use client'

import { useState, useEffect, useRef } from 'react'

function Accordion({ title, children, visible }: { title: string; children: React.ReactNode; visible: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!visible) return null

  return (
    <div className="mt-4 max-md:mt-3 animate-fadeIn">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-[0.85rem] max-md:text-[0.8rem] hover:opacity-70 transition-opacity"
      >
        <span
          className="text-[0.7rem] text-[var(--color-muted)] transition-transform duration-200"
          style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
        >
          ▸
        </span>
        <span className="underline underline-offset-2">{title}</span>
      </button>
      {isOpen && (
        <div className="mt-3 text-[0.85rem] max-md:text-[0.8rem] text-[var(--color-muted)] leading-[1.8]">
          {children}
        </div>
      )}
    </div>
  )
}

// Typewriter text component
function TypewriterText({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const indexRef = useRef(0)

  useEffect(() => {
    if (isComplete) return

    const interval = setInterval(() => {
      if (indexRef.current < text.length) {
        const charsToAdd = Math.min(3, text.length - indexRef.current)
        setDisplayedText(text.slice(0, indexRef.current + charsToAdd))
        indexRef.current += charsToAdd
      } else {
        setIsComplete(true)
        onComplete?.()
        clearInterval(interval)
      }
    }, 8)

    return () => clearInterval(interval)
  }, [text, onComplete, isComplete])

  return <>{displayedText}</>
}

export default function ProjectsContent() {
  const [visibleParagraphs, setVisibleParagraphs] = useState(0)
  const [visibleAccordions, setVisibleAccordions] = useState(0)
  const paragraphsComplete = useRef(0)

  const paragraphs = [
    "PROVEN — Co-founder and Operator. AI personalization that learns what works for each person and improves with every interaction—not a static quiz. Started with skincare, expanded to other categories, scaled to $150M+. The same approach applies anywhere there's high variance in preference and high cost of trial-and-error. YC W18, 2 patents, MIT AI Idol.",
    "Physics research — World's largest peta-flop simulation on 163,840 cores. 10 papers, 2 PRL covers. PhD at USC, postdoc at Stanford.",
    "Earlier — Camera360 (top-10 Android, acquired), Divine Might (top-10 MMORPG globally), Cubicman (top-10 iOS, acquired).",
    "Side projects — Durin (market intelligence infra), Pawgress (family AI)."
  ]

  useEffect(() => {
    setVisibleParagraphs(1)
  }, [])

  const handleParagraphComplete = () => {
    paragraphsComplete.current += 1
    if (paragraphsComplete.current < paragraphs.length) {
      setTimeout(() => {
        setVisibleParagraphs(prev => prev + 1)
      }, 100)
    } else {
      setTimeout(() => {
        setVisibleAccordions(1)
        const accordionTimer = setInterval(() => {
          setVisibleAccordions(prev => {
            if (prev >= 7) {
              clearInterval(accordionTimer)
              return prev
            }
            return prev + 1
          })
        }, 150)
      }, 200)
    }
  }

  return (
    <div className="text-[var(--color-fg)]">
      {/* Main narrative */}
      <div className="text-[0.9rem] max-md:text-[0.85rem] leading-[1.8] space-y-4 max-md:space-y-3">
        {paragraphs.map((text, index) => (
          index < visibleParagraphs && (
            <p key={index}>
              <TypewriterText
                text={text}
                onComplete={index === visibleParagraphs - 1 ? handleParagraphComplete : undefined}
              />
            </p>
          )
        ))}
      </div>

      {/* Expandable sections */}
      <Accordion title="Durin" visible={visibleAccordions >= 1}>
        <p>Market intelligence infra. Tinkering with semantic grounding for preference data.</p>
      </Accordion>

      <Accordion title="Pawgress" visible={visibleAccordions >= 2}>
        <p>Family AI that knows when to step back. Exploring what happens when you don't optimize for engagement.</p>
      </Accordion>

      <Accordion title="PROVEN" visible={visibleAccordions >= 3}>
        <p>Co-founded with Ming. AI personalization that learns what works for each person and improves with every interaction—not a static quiz. Started with skincare, expanded to other categories, scaled to $150M+. The same approach applies anywhere there's high variance in preference and high cost of trial-and-error. YC W18, 2 patents, MIT AI Idol.</p>
        <p className="mt-3 ml-4">• <strong>Noteworthy</strong> — AI fragrance personalization, same thesis as PROVEN.</p>
      </Accordion>

      <Accordion title="Lyra Health" visible={visibleAccordions >= 4}>
        <p>Employee #28. Clinical ML for therapist matching.</p>
        <p className="mt-1">Joined at 18 people, left at 200+.</p>
      </Accordion>

      <Accordion title="McKesson" visible={visibleAccordions >= 5}>
        <p>Drug pricing and supply chain ML.</p>
        <p className="mt-1">The data here is what got me into healthcare—#2 and #3 most distributed generics were antidepressants and antipsychotics.</p>
      </Accordion>

      <Accordion title="Early Apps & Games" visible={visibleAccordions >= 6}>
        <p>Built during grad school, while doing the physics PhD.</p>
        <ul className="mt-3 space-y-1 ml-4">
          <li>• <strong>Camera360</strong> — top-10 Android app, acquired</li>
          <li>• <strong>Divine Might</strong> — top-10 MMORPG globally</li>
          <li>• <strong>Cubicman</strong> — top-10 iOS game, acquired</li>
        </ul>
      </Accordion>

      <Accordion title="Research" visible={visibleAccordions >= 7}>
        <p>PhD at USC, postdoc at Stanford. World's largest peta-flop simulation on 163,840 cores. 10 papers, 2 PRL covers.</p>

        <p className="mt-4 font-medium text-[var(--color-fg)]">Stronger and smarter materials</p>
        <p className="mt-1">Sulfur-induced embrittlement in metals, Ni-Cu-P/CNT composite coatings. Explains how tiny impurities lead to metal failures; helps design safer alloys.</p>

        <p className="mt-4 font-medium text-[var(--color-fg)]">Nanoscale structures for electronics</p>
        <p className="mt-1">Stacking faults in GaAs nanowires, twin superlattice formation, exciton transport. Practical guidelines for defect-free nanowire fabrication.</p>

        <p className="mt-4 font-medium text-[var(--color-fg)]">Clean energy with AI</p>
        <p className="mt-1">ML-driven perovskite solar cell optimization (reached 18.5% efficiency in &lt;100 trials), DeepSolar mapping (all U.S. rooftop solar panels using satellite imagery).</p>
      </Accordion>

      {/* Contact */}
      <div className="mt-6 max-md:mt-5 pt-4 border-t border-[var(--color-border)]">
        <p className="text-[0.85rem] max-md:text-[0.8rem]">
          <a href="mailto:amy@durinlab.com" className="underline underline-offset-2 hover:opacity-70 transition-opacity">amy@durinlab.com</a>
        </p>
      </div>
    </div>
  )
}
