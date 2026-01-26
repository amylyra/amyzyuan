// Shared essay data - single source of truth for essays metadata and content
// Used by: ThoughtsContent.tsx, layout.tsx, sitemap.ts

export interface Essay {
  id: string
  title: string
  date: string // Display format (e.g., "March 2024")
  isoDate: string // ISO format for metadata (e.g., "2024-03-01")
  preview: string
  paragraphs: string[]
}

export const essays: Essay[] = [
  {
    id: 'on-being-drawn-upward',
    title: "On Being Drawn Upward — Why I Climb",
    date: "March 2024",
    isoDate: "2024-03-01",
    preview: "A reflection on what remains when ambition falls away and only attention, discipline, and limits endure.",
    paragraphs: [
      "In the mountains, pretense does not last. Breathe. Move. Decide. That is what remains.",
      "To me, climbing was never a sport. I train. I prepare. Then I strip down to what is needed. Everything else stays behind. Somewhere between the last thought of the world below and the first deliberate step upward, I am pared down to attention, breath, and choice.",
      "The mountains do not ask who I am in the world below. They ask only whether I am present.",
      "I am drawn to snow, ice, and rock because they offer different kinds of freedom. Snow teaches impermanence. Ice demands precision and honesty. Rock invites movement and dialogue. Together, they form a terrain where effort is clean and precision is required.",
      "I choose when to move and when to stop. There is only what is in front of me and what comes next.",
      "The mountains humble me through scale, not fear. They reward steadiness, not ego. Glaciers stood long before the first of us and will remain long after the last. Confidence moves carefully. Insecurity is loud—it rushes, proves, insists.",
      "Over time, a further stripping occurs. With each climb, I arrive with fewer illusions of control and more respect for process. The summit is not where meaning lives. You cannot stay there, and you are not meant to. What matters is what you learn on the way up—and what you carry back down.",
      "I climb to travel, to experience, and to learn. I climb to be fully inside my body and quietly inside my mind.",
      "Freedom is not the absence of limits. It is knowing where the limits are and moving well within them.",
      "The mountains will never change for me. I go because they change me. And each time I come back—more attentive, more pared down—I find that what remains is enough."
    ]
  }
]

// Helper to get essay by slug
export function getEssayBySlug(slug: string): Essay | undefined {
  return essays.find(e => e.id === slug)
}
