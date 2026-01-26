'use client'

import { useRouter } from 'next/navigation'
import ChatView from '@/components/ChatView'
import { ProjectsSeoContent } from '@/components/SeoContent'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

// FAQ data for GEO optimization
const projectsFaqs = [
  {
    question: "What projects has Amy Yuan built?",
    answer: "Amy Yuan has built PROVEN (AI skincare personalization, $150M+ revenue), Noteworthy (AI fragrance personalization), Durin (market intelligence infrastructure), Pawgress (family AI), and early apps including Camera360, Divine Might, and Cubicman which reached top-10 charts."
  },
  {
    question: "What is Durin?",
    answer: "Durin is a market intelligence infrastructure project by Amy Yuan, focused on semantic grounding for preference data."
  },
  {
    question: "What is Pawgress?",
    answer: "Pawgress is a family AI project by Amy Yuan that explores what happens when you design AI that optimizes for something other than engagement—an AI that knows when to step back."
  },
]

export default function ProjectsPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/')
  }

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      <ProjectsSeoContent />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://amyzyuan.com' },
          { name: 'Projects', url: 'https://amyzyuan.com/projects' },
        ]}
      />
      <FAQJsonLd faqs={projectsFaqs} />
      <ChatView
        showChat={true}
        onClose={handleClose}
        initialMessage="What are your projects?"
        initialResponse="projects"
        isProjects={true}
      />
    </main>
  )
}
