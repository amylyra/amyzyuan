export default function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Zaoshi (Amy) Yuan',
    alternateName: 'Amy Yuan',
    url: 'https://amyzyuan.com',
    image: 'https://amyzyuan.com/profile.jpg',
    jobTitle: 'Founder & AI Researcher',
    description: 'Founder, Researcher, Mountaineer — Building AI systems above the model layer. Stanford/USC Physics. $150M+ shipped.',
    alumniOf: [
      {
        '@type': 'CollegeOrUniversity',
        name: 'Stanford University',
      },
      {
        '@type': 'CollegeOrUniversity',
        name: 'University of Southern California',
      },
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Machine Learning',
      'Computational Physics',
      'AI Personalization',
      'Mountaineering',
    ],
    sameAs: [
      'https://www.linkedin.com/in/amy-zaoshi-yuan-b482707/',
      'https://github.com/amylyra',
      'https://scholar.google.com/citations?user=2hzkufcAAAAJ&hl=en',
    ],
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Amy Yuan',
    url: 'https://amyzyuan.com',
    author: {
      '@type': 'Person',
      name: 'Zaoshi (Amy) Yuan',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  )
}

// BreadcrumbList schema for navigation hierarchy
interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  )
}

// Article schema for essays/blog posts
interface ArticleJsonLdProps {
  title: string
  description: string
  datePublished: string
  dateModified?: string
  url: string
  wordCount?: number
}

export function ArticleJsonLd({ 
  title, 
  description, 
  datePublished, 
  dateModified,
  url,
  wordCount 
}: ArticleJsonLdProps) {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    author: {
      '@type': 'Person',
      name: 'Zaoshi (Amy) Yuan',
      url: 'https://amyzyuan.com',
    },
    publisher: {
      '@type': 'Person',
      name: 'Zaoshi (Amy) Yuan',
      url: 'https://amyzyuan.com',
    },
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: 'https://amyzyuan.com/profile.jpg',
    ...(wordCount && { wordCount }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
    />
  )
}

// FAQ schema for GEO optimization
interface FAQItem {
  question: string
  answer: string
}

export function FAQJsonLd({ faqs }: { faqs: FAQItem[] }) {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  )
}
