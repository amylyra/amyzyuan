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
        // Add multiple characters at once for faster typing
        const charsToAdd = Math.min(3, text.length - indexRef.current)
        setDisplayedText(text.slice(0, indexRef.current + charsToAdd))
        indexRef.current += charsToAdd
      } else {
        setIsComplete(true)
        onComplete?.()
        clearInterval(interval)
      }
    }, 8) // Fast typing speed

    return () => clearInterval(interval)
  }, [text, onComplete, isComplete])

  return <>{displayedText}</>
}

export default function AboutContent() {
  const [visibleParagraphs, setVisibleParagraphs] = useState(0)
  const [visibleAccordions, setVisibleAccordions] = useState(0)
  const paragraphsComplete = useRef(0)

  const paragraphs = [
    "I spent years doing computational physics—PhD at USC, postdoc at Stanford, ran simulations on 163,840 cores. I was good at it, but I kept escaping into side projects, building apps that hit top-10 charts while I was supposed to be doing research. Eventually I admitted to myself that I wanted to make things people actually use.",
    "Went into healthcare AI, then co-founded PROVEN with Ming. The way people shop is broken: guess, buy, return, repeat. I built an AI system that learns individual preferences and adapts over time—a system that closes the feedback loop. Started with skincare, expanded to other categories, scaled to $150M+.",
    "The underlying thesis is bigger: real personalization that compounds value for the customer instead of extracting it.",
    "Now I'm building again, trying to find the next thing that's real. I climb mountains between projects. Standing on a glacier that took a hundred thousand years to form helps me remember what I'm optimizing for."
  ]

  // Start first paragraph immediately
  useEffect(() => {
    setVisibleParagraphs(1)
  }, [])

  const handleParagraphComplete = () => {
    paragraphsComplete.current += 1
    if (paragraphsComplete.current < paragraphs.length) {
      // Small delay before next paragraph
      setTimeout(() => {
        setVisibleParagraphs(prev => prev + 1)
      }, 100)
    } else {
      // All paragraphs done, start showing accordions
      setTimeout(() => {
        setVisibleAccordions(1)
        // Reveal accordions one by one
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
      <Accordion title="Training & Research" visible={visibleAccordions >= 1}>
        <p>Ph.D. Computational Physics (USC, Mork Fellow) · M.S. Computer Science (USC) · Postdoc (Stanford, Ignite Fellow)</p>
        <p className="mt-3">Ran the world's largest peta-flop atomistic simulation at the time. 163,840 cores on Blue Gene/P. Wrote parallel algorithms in Fortran and C++ with openMPI. Published 10 papers, got 2 Physics Review Letter covers.</p>
        <p className="mt-3">The physics training was mostly about learning to think in systems and respect constraints. Also learned that chasing scale and difficulty can become a proxy for meaning—took a while to untangle that one.</p>
      </Accordion>

      <Accordion title="Why I Left Academia" visible={visibleAccordions >= 2}>
        <p>Interviewed for professorships after my postdoc. Realized pretty quickly it wasn't going to work.</p>
        <p className="mt-3">Part of it was teaching. I don't have patience for people who aren't interested in the subject. Leading teams is different though—when people actually want to be there, I'll spend hours helping someone who's struggling. But I can't push people toward something they don't want.</p>
        <p className="mt-3">The bigger issue: most of the great physics was figured out in the early 1900s. The remaining problems either require genius-level minds (not me) or feel disconnected from anything tangible. I wanted to build things that affect actual people.</p>
      </Accordion>

      <Accordion title="Healthcare" visible={visibleAccordions >= 3}>
        <p>McKesson → Lyra Health (#28). Production ML for drug pricing and supply chain, then clinical ML for therapist matching.</p>
        <p className="mt-3">At McKesson, the interesting part wasn't the models—it was seeing the data. #2 and #3 most distributed generic drugs nationwide: antidepressants and antipsychotics. 1 in 7 Americans dealing with mental health issues.</p>
        <p className="mt-3">That got me thinking about mental health specifically, which led to Lyra. Healthcare ML is different from consumer ML—you actually have to care about edge cases and failure modes because the outputs affect real medical decisions. Good training.</p>
        <p className="mt-3">Watched Lyra scale from 18 to 200+ people. That's when I started wanting to build something myself.</p>
      </Accordion>

      <Accordion title="PROVEN — The Full Story" visible={visibleAccordions >= 4}>
        <p>Started PROVEN with my co-founder Ming. The idea came from personal frustration—I've had eczema my whole life, so has my mom, so do my kids. Every season it's the same thing: stand in a skincare aisle, read a bunch of reviews, try to find patterns in what worked for people with similar skin and climate.</p>
        <p className="mt-3">That pattern-matching process is pretty obviously automatable. So we built it. YC W18. Scaled to $150M+ revenue. Got 2 patents, won MIT AI Idol, did the whole press circuit (Shark Tank, Today Show, etc).</p>
        <p className="mt-3">The technical stuff worked. We built end-to-end ML pipelines—data ingestion, human-in-the-loop labeling, model training, real-time inference, personalization. Millions of users. The system actually learned and adapted, which is harder than it sounds when you're dealing with physical products and supply chains.</p>
        <p className="mt-3"><strong>The hard parts were human:</strong></p>
        <p className="mt-3">Culture nearly killed us. We hired a COO, promoted him to CEO, and slowly watched the company turn into something unrecognizable. Everything became consensus-driven. Planning cycles stretched to 6 months. The fast iteration loops died. It's hard to notice while it's happening—feels like "professionalizing." Took 2 years to fully see it and fight our way out.</p>
        <p className="mt-3">Ming burned out and left. Co-founder relationships are weird—more intense than most marriages in some ways. Losing her was harder than the CEO situation, harder than the near-death experiences. Still processing that one.</p>
        <p className="mt-3">What I actually learned: trust your instincts earlier. I knew something was wrong for months before I acted. Kept telling myself I was being paranoid. I wasn't.</p>
      </Accordion>

      <Accordion title="Current Focus" visible={visibleAccordions >= 5}>
        <p><strong>Durin</strong> — market intelligence infra. Current approaches are broken: surveys are slow, LLMs hallucinate, embeddings are black boxes. The underlying thesis is that preference data already exists at scale, the problem is making it semantically coherent and grounded. Building the infrastructure layer for that.</p>
        <p className="mt-3"><strong>Pawgress</strong> — family AI that optimizes for something other than engagement. Most consumer AI is designed to maximize time-on-device, which is pretty much the opposite of what's good for families. Exploring what it looks like when the AI knows when to step back.</p>
        <p className="mt-3">Both early stage. Figuring out which one is real.</p>
      </Accordion>

      <Accordion title="Mountains" visible={visibleAccordions >= 6}>
        <p>I climb. Glaciers on four continents so far.</p>
        <p className="mt-3">Mountaineering is good for perspective. You're dealing with systems that formed over hundreds of thousands of years. Also good for learning to take calculated risks repeatedly—every step matters when you're on exposed terrain.</p>
        <p className="mt-3">The main lesson transfers pretty directly: optimize for durability, not speed.</p>
      </Accordion>

      <Accordion title="Recognition" visible={visibleAccordions >= 7}>
        <ul className="space-y-1">
          <li>MIT AI Idol — AI personalization</li>
          <li>Glossy Best Use of Technology</li>
          <li>2 U.S. Patents — AI personalization systems</li>
          <li>World Record Simulations — 163,840-core peta-flop computing</li>
          <li>10 Publications — 2 PRL covers, Nano Letters</li>
        </ul>
        <p className="mt-3 italic">Press: Shark Tank, Today Show, TechCrunch, WSJ</p>
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
