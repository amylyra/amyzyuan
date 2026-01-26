import { MetadataRoute } from 'next'
import { essays } from '@/data/essays'

// Static page last modified dates
const PAGE_DATES = {
  home: '2025-01-20',
  about: '2025-01-20',
  projects: '2025-01-20',
  thoughts: '2025-01-20',
  contact: '2025-01-15',
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://amyzyuan.com'

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(PAGE_DATES.home),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(PAGE_DATES.about),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(PAGE_DATES.projects),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/thoughts`,
      lastModified: new Date(PAGE_DATES.thoughts),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(PAGE_DATES.contact),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Generate essay pages from shared data
  const essayPages: MetadataRoute.Sitemap = essays.map(essay => ({
    url: `${baseUrl}/thoughts/${essay.id}`,
    lastModified: new Date(essay.isoDate),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticPages, ...essayPages]
}
