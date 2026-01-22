'use client'

import { useState } from 'react'
import LandingView from '@/components/LandingView'
import ChatView from '@/components/ChatView'

const ABOUT_CONTENT = `Physics PhD → healthcare AI → $150MM in consumer goods.

The domains change. The convergence doesn't.

---

## Training

**Ph.D. Computational Physics** — USC, Mork Fellow
**M.S. Computer Science** — USC
**Postdoctoral Fellow** — Stanford, Ignite Fellow

World's largest peta-flop atomistic simulation. 163,840 cores. 10 papers, 2 PRL covers. Wrote parallel algorithms in Fortran and C++ with openMPI on Blue Gene/P.

---

## Why I Left Academia

Teaching wasn't for me. Leading teams is different—I'll spend hours helping someone who's struggling, if they actually want to be there. Most remaining physics problems either require genius-level minds or feel disconnected from anything tangible. I wanted to build things that affect actual people.

---

## Healthcare

McKesson → Lyra Health. Production ML for drug pricing, then clinical ML for therapist matching. Lyra was employee #28. Healthcare ML is different—edge cases matter because outputs affect real decisions.

---

## PROVEN

Co-founded with Ming. YC W18. **$150M+ revenue. 2 patents. MIT AI Idol.**

Personalized skincare using ML. End-to-end system serving millions—data ingestion, human-in-the-loop labeling, real-time inference, personalization that adapts over time.

**What was hard:** Culture nearly killed us. Hired a COO, promoted him to CEO, watched the company turn unrecognizable. Ming burned out and left. The human stuff was harder than the technical stuff. Main lesson: trust your instincts earlier.

---

## Current Focus

**Durin** — market intelligence infra. Preference data exists at scale; the problem is semantic coherence and grounding.

**Pawgress** — family AI that optimizes for something other than engagement.

Both early. Figuring out which one is real.

---

## Mountains

Glaciers on four continents. Main lesson: optimize for durability, not speed.

---

## Recognition

- MIT AI Idol
- 2 U.S. Patents
- World Record Simulations (163,840 cores)
- 10 Publications (2 PRL covers)

*Press: Shark Tank, Today Show, TechCrunch, WSJ*

---

**Contact:** amy@durinlab.com`

export default function Home() {
  const [showChat, setShowChat] = useState(false)
  const [initialMessage, setInitialMessage] = useState<string | undefined>()
  const [initialResponse, setInitialResponse] = useState<string | undefined>()
  const [isAbout, setIsAbout] = useState(false)

  const handleOpenChat = (message?: string, response?: string) => {
    setInitialMessage(message)
    setInitialResponse(response)
    setIsAbout(false)
    setShowChat(true)
  }

  const handleCloseChat = () => {
    setShowChat(false)
    setInitialMessage(undefined)
    setInitialResponse(undefined)
    setIsAbout(false)
  }

  const handleOpenAbout = () => {
    setInitialMessage(undefined)
    setInitialResponse(ABOUT_CONTENT)
    setIsAbout(true)
    setShowChat(true)
  }

  return (
    <main className="relative min-h-screen">
      {/* Grid background */}
      <div className="grid-bg" />

      {/* Landing View */}
      <LandingView
        showChat={showChat}
        onOpenChat={handleOpenChat}
        onOpenAbout={handleOpenAbout}
      />

      {/* Chat View (Full Screen) */}
      <ChatView
        showChat={showChat}
        onClose={handleCloseChat}
        initialMessage={initialMessage}
        initialResponse={initialResponse}
        isAbout={isAbout}
      />
    </main>
  )
}
