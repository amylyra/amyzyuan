'use client'

import { useRouter } from 'next/navigation'
import ChatView from '@/components/ChatView'
import { AboutSeoContent } from '@/components/SeoContent'
import { BreadcrumbJsonLd, FAQJsonLd } from '@/components/JsonLd'

// Note: metadata export not supported in client components
// Metadata is handled in layout or via generateMetadata in a wrapper

// FAQ data for GEO optimization - helps AI search engines cite this page
const aboutFaqs = [
  {
    question: "Who is Amy Yuan?",
    answer: "Amy Yuan (Zaoshi Yuan) is a founder, AI researcher, and mountaineer. She holds a PhD in Computational Physics from USC and completed a postdoc at Stanford. She co-founded PROVEN, an AI-powered skincare personalization company that scaled to $150M+ in revenue."
  },
  {
    question: "What is Amy Yuan's educational background?",
    answer: "Amy Yuan earned her PhD in Computational Physics from the University of Southern California as a Mork Fellow, and an M.S. in Computer Science from USC. She completed a postdoctoral fellowship at Stanford University as an Ignite Fellow."
  },
  {
    question: "What is PROVEN skincare?",
    answer: "PROVEN is an AI-powered skincare personalization company co-founded by Amy Yuan. It uses machine learning to create personalized skincare formulations that adapt and improve over time based on individual feedback. PROVEN was part of Y Combinator W18 and has scaled to over $150M in total revenue."
  },
  {
    question: "What are Amy Yuan's current projects?",
    answer: "Amy Yuan is currently building Durin (market intelligence infrastructure) and Pawgress (a family AI that optimizes for something other than engagement)."
  },
  {
    question: "What research has Amy Yuan done?",
    answer: "Amy Yuan ran the world's largest peta-flop atomistic simulation at the time, using 163,840 cores on Blue Gene/P. She has published 10 papers including 2 Physical Review Letters covers and work in Nano Letters. Her research spans computational physics, materials science, and AI/ML applications."
  },
]

export default function AboutPage() {
  const router = useRouter()

  const handleClose = () => {
    router.push('/')
  }

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg" />
      <AboutSeoContent />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: 'https://amyzyuan.com' },
          { name: 'About', url: 'https://amyzyuan.com/about' },
        ]}
      />
      <FAQJsonLd faqs={aboutFaqs} />
      <ChatView
        showChat={true}
        onClose={handleClose}
        initialMessage="Tell me about yourself"
        initialResponse="about"
        isAbout={true}
      />
    </main>
  )
}
