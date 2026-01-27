'use client'

import { useRouter } from 'next/navigation'
import { essays, type Essay } from '@/data/essays'

// Re-export for backward compatibility
export { essays, type Essay }

export default function ThoughtsContent() {
  const router = useRouter()

  // Navigate to essay page
  const handleEssayClick = (essay: Essay) => {
    router.push(`/thoughts/${essay.id}`)
  }

  return (
    <div className="text-[var(--color-fg)]">
      <p className="text-[0.9rem] max-md:text-[0.85rem] text-[var(--color-muted)] mb-6">
        Thoughts on AI, building, climbing and what holds up in the world.
      </p>

      <div className="space-y-4">
        {essays.map((essay) => (
          <button
            key={essay.id}
            onClick={() => handleEssayClick(essay)}
            className="block w-full text-left group"
          >
            <div className="flex items-baseline justify-between gap-4 mb-1">
              <h3 className="text-[0.95rem] max-md:text-[0.9rem] font-medium underline underline-offset-2 decoration-[var(--color-border)] group-hover:decoration-[var(--color-fg)] transition-colors">
                {essay.title}
              </h3>
              <span className="text-[0.75rem] text-[var(--color-light-muted)] flex-shrink-0">
                {essay.date}
              </span>
            </div>
            <p className="text-[0.85rem] max-md:text-[0.8rem] text-[var(--color-light-muted)]">
              {essay.preview}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
