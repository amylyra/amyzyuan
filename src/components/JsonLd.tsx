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
