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
    "PROVEN — Co-founder and Operater. AI personalization that learns what works for each person and improves with every interaction—not a static quiz. Started with skincare, expanded to other categories, scaled to $150M+. The same approach applies anywhere there's high variance in preference and high cost of trial-and-error. YC W18, 2 patents, MIT AI Idol.",
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
            if (prev >= 5) {
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
      <Accordion title="PROVEN — The Full Story" visible={visibleAccordions >= 1}>
        <p>Started PROVEN with my co-founder Ming. The idea came from personal frustration—I've had eczema my whole life, so has my mom, so do my kids. Every season it's the same thing: stand in a skincare aisle, read a bunch of reviews, try to find patterns in what worked for people with similar skin and climate.</p>
        <p className="mt-3">That pattern-matching process is pretty obviously automatable. So we built it. YC W18. Scaled to $150M+ revenue. Got 2 patents, won MIT AI Idol, did the whole press circuit (Shark Tank, Today Show, etc).</p>
        <p className="mt-3">The technical stuff worked. We built end-to-end ML pipelines—data ingestion, human-in-the-loop labeling, model training, real-time inference, personalization. Millions of users. The system actually learned and adapted, which is harder than it sounds when you're dealing with physical products and supply chains.</p>
        <p className="mt-3"><strong>The hard parts were human:</strong></p>
        <p className="mt-3">Culture nearly killed us. We hired a COO, promoted him to CEO, and slowly watched the company turn into something unrecognizable. Everything became consensus-driven. Planning cycles stretched to 6 months. The fast iteration loops died. It's hard to notice while it's happening—feels like "professionalizing." Took 2 years to fully see it and fight our way out.</p>
        <p className="mt-3">Ming burned out and left. Co-founder relationships are weird—more intense than most marriages in some ways. Losing her was harder than the CEO situation, harder than the near-death experiences. Still processing that one.</p>
        <p className="mt-3">What I actually learned: trust your instincts earlier. I knew something was wrong for months before I acted. Kept telling myself I was being paranoid. I wasn't.</p>
      </Accordion>

      <Accordion title="Physics Research" visible={visibleAccordions >= 2}>
        <p>Ph.D. Computational Physics (USC, Mork Fellow) · M.S. Computer Science (USC) · Postdoc (Stanford, Ignite Fellow)</p>
        <p className="mt-3">Ran the world's largest peta-flop atomistic simulation at the time. 163,840 cores on Blue Gene/P. Wrote parallel algorithms in Fortran and C++ with openMPI. Published 10 papers, got 2 Physics Review Letter covers.</p>
        <p className="mt-3">The physics training was mostly about learning to think in systems and respect constraints. Also learned that chasing scale and difficulty can become a proxy for meaning—took a while to untangle that one.</p>
      </Accordion>

      <Accordion title="Earlier Projects" visible={visibleAccordions >= 3}>
        <p><strong>Camera360</strong> — Top-10 Android app. Photo editing with real-time filters before Instagram made it mainstream. Acquired.</p>
        <p className="mt-3"><strong>Divine Might</strong> — Top-10 MMORPG globally. Built the core systems and scaled to millions of concurrent players.</p>
        <p className="mt-3"><strong>Cubicman</strong> — Top-10 iOS game. Minimalist puzzle game that hit the charts. Acquired.</p>
        <p className="mt-3">These were the side projects I kept escaping into while doing physics research. Eventually admitted to myself that making things people actually use was what I wanted.</p>
      </Accordion>

      <Accordion title="Durin" visible={visibleAccordions >= 4}>
        <p>Market intelligence infra. Current approaches are broken: surveys are slow, LLMs hallucinate, embeddings are black boxes.</p>
        <p className="mt-3">The underlying thesis is that preference data already exists at scale, the problem is making it semantically coherent and grounded. Building the infrastructure layer for that.</p>
        <p className="mt-3">Early stage. Figuring out if it's real.</p>
      </Accordion>

      <Accordion title="Pawgress" visible={visibleAccordions >= 5}>
        <p>Family AI that optimizes for something other than engagement.</p>
        <p className="mt-3">Most consumer AI is designed to maximize time-on-device, which is pretty much the opposite of what's good for families. Exploring what it looks like when the AI knows when to step back.</p>
        <p className="mt-3">Early stage. Figuring out if it's real.</p>
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
