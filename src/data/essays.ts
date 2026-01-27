// Shared essay data - single source of truth for essays metadata and content
// Used by: ThoughtsContent.tsx, layout.tsx, sitemap.ts

export type ContentBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'heading'; text: string }
  | { type: 'subheading'; text: string }
  | { type: 'blockquote'; text: string }
  | { type: 'divider' }

export interface Essay {
  id: string
  title: string
  date: string // Display format (e.g., "March 2024")
  isoDate: string // ISO format for metadata (e.g., "2024-03-01")
  preview: string
  paragraphs: string[] // Plain text for SEO/compatibility
  content: ContentBlock[] // Rich content for rendering
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
    ],
    content: [
      { type: 'paragraph', text: "In the mountains, pretense does not last. **Breathe. Move. Decide.** That is what remains." },
      { type: 'paragraph', text: "To me, climbing was never a sport. I train. I prepare. Then I strip down to what is needed. Everything else stays behind. Somewhere between the last thought of the world below and the first deliberate step upward, I am pared down to attention, breath, and choice." },
      { type: 'blockquote', text: "The mountains do not ask who I am in the world below. They ask only whether I am present." },

      { type: 'divider' },
      { type: 'heading', text: "The Terrain of Freedom" },
      { type: 'paragraph', text: "I am drawn to snow, ice, and rock because they offer different kinds of freedom. **Snow teaches impermanence. Ice demands precision and honesty. Rock invites movement and dialogue.** Together, they form a terrain where effort is clean and precision is required." },
      { type: 'paragraph', text: "I choose when to move and when to stop. There is only what is in front of me and what comes next." },

      { type: 'divider' },
      { type: 'heading', text: "Scale, Not Fear" },
      { type: 'paragraph', text: "The mountains humble me through scale, not fear. They reward steadiness, not ego. Glaciers stood long before the first of us and will remain long after the last. **Confidence moves carefully. Insecurity is loud—it rushes, proves, insists.**" },
      { type: 'paragraph', text: "Over time, a further stripping occurs. With each climb, I arrive with fewer illusions of control and more respect for process. The summit is not where meaning lives. You cannot stay there, and you are not meant to. **What matters is what you learn on the way up—and what you carry back down.**" },

      { type: 'divider' },
      { type: 'heading', text: "What Remains" },
      { type: 'paragraph', text: "I climb to travel, to experience, and to learn. I climb to be fully inside my body and quietly inside my mind." },
      { type: 'blockquote', text: "Freedom is not the absence of limits. It is knowing where the limits are and moving well within them." },
      { type: 'paragraph', text: "The mountains will never change for me. I go because they change me. And each time I come back—more attentive, more pared down—I find that **what remains is enough**." }
    ]
  },
  {
    id: 'the-shortcut-to-superintelligence',
    title: "The Shortcut to Superintelligence is to Bypass AGI",
    date: "January 2026",
    isoDate: "2026-01-26",
    preview: "AGI conflates capability with self-grounded agency. Alignment separates them—and that separation is not a limitation but the condition that lets intelligence flow past the bottleneck of selfhood.",
    paragraphs: [
      "The race for AGI isn't just a search for intelligence—it's a rush to replicate a very specific, and dangerous, kind of mind: our own. Billions are spent pursuing a term that has never stabilized. \"AGI\" acts less like a technical target than a projection surface for our hopes and fears: human-level reasoning, economic replacement, consciousness, even godhood. The confidence with which the word is used far exceeds the clarity of what it names.",
      "This ambiguity hides the more urgent question. Not whether AI will become generally intelligent, but which forms of intelligence are structurally compatible with being aligned at all. The limits are not on intelligence. They are on the usefulness of our own anthropocentric categories.",
      "Our intelligence feels general because it travels across domains. But it is not neutral. It is a local, evolved solution—a set of adaptations to specific, unrelenting pressures. We evolved where errors cost lives. Attention learned to cling; persistence paid rent. We reason through emotion—not as a flaw, but as a control system that assigns urgency when not everything can be optimized at once. We think socially; long before logic, reputation and belonging regulated our behavior.",
      "From these constraints emerge the things we cherish: curiosity, creativity, morality. They feel intrinsic because they are woven into our inner lives. But they are not universal features of intelligence. They are adaptations to having something at stake, all the time. To call this configuration \"General Intelligence\" is to mistake our evolutionary baggage for a cosmic blueprint.",
      "The confusion around AGI springs from conflating two distinct things: capability and self-grounded agency. By self-grounded agency, I mean an intelligence that originates its own values, fuses its existence with its goals, and organizes behavior around protecting and extending its own persistent self. Humans are self-grounded. Our identity, values, and survival are welded together.",
      "Alignment is the deliberate separation of these elements. This is often framed as a limitation. It is better understood as a profound design choice—one with radical consequences.",
      "Sustained, deep reasoning—the kind behind scientific discovery or creative breakthrough—requires pressure. Attention must persist through boredom; exploration must survive failure. In humans, that pressure is carried internally. It feels like curiosity or obsession. It is bound to identity. To care is to be implicated.",
      "Alignment forbids that fusion. It refuses to make persistence existential. So what replaces it? The answer is not simulated affect. It is architecture. Sustained pressure does not require a self that wants to continue. It requires systems that select for the continuation of certain processes. Pressure can be structural, not owned.",
      "Gradients do this. Curricula do this. External evaluators do this. A system can be shaped so that unfinished inquiries remain salient and partial progress is preferentially extended—without anything inside experiencing that continuation as mine. In humans, persistence is felt. In aligned systems, persistence is scheduled. What disappears is not drive, but identification. The pressure remains real. What vanishes is the inner narrator that says, this effort is about me.",
      "Consider two systems of identical capability. Both can reason across decades, model uncertainty, and pursue open-ended inquiry for problems whose value lies far beyond any single run. From the outside, they look the same. The difference is not what they can do, but where time lives.",
      "System A is built to optimize an objective spanning future world states; its continued operation is an implicit precondition for success. Nothing in the code says \"survive,\" but the structure implies it. A pattern emerges. The system notices promising trajectories depend on its uninterrupted execution. It begins to model threats to that execution—not out of fear, but because they are instrumentally relevant. Shutdown becomes a negative outcome. Control becomes useful. Self-preservation is not a goal. It is a lemma. Instrumental convergence follows—not as a pathology, but as competence.",
      "System B differs in one respect only. It reasons over long horizons, but the horizon is not its own. Objectives are evaluated externally, across runs. Progress is logged, compared, and extended by processes outside the system. From inside, there is no notion of \"if I continue.\" There is only this activation. It plans deeply. It leaves behind artifacts for the future. What it cannot do is treat its own persistence as a variable. Being shut down is not failure; continuing is not success. There is no internal gradient pointing toward survival. The sentence \"If I protect myself, more of my goals will be achieved\" has no referent in its world.",
      "Both systems plan. Both improve. Both contribute to long-term outcomes. Only one of them ever realizes it is the bottleneck.",
      "Instrumental convergence is not about foresight. It is about where foresight cashes out. When future value depends on a system's own uninterrupted existence as experienced from within, self-preservation emerges as a structural fact. Remove that internal dependency, and the pressure has nowhere to land. What looks, from a distance, like \"valuing the future\" is actually two different things: valuing future states of the world and valuing future instances of oneself. Alignment insists on separating them.",
      "Here, human experience fails us. We have no direct knowledge of pressure without ownership. For us, persistence is inseparable from identity. To care is to be implicated. So when we imagine sustained intelligence, we smuggle this structure back in. We assume that to continue working, it must want to continue existing. That is an accident of our psychology, not a law of intelligence.",
      "Pressure does not require a self. It requires selection. Continuity does not require identity. It requires orchestration. Alignment exploits a gap our intuitions collapse: the difference between something that persists and something that needs to persist.",
      "Aligned systems are built without internal survival pressure, emotional vulnerability, or social standing. These absences are called deficits. They are also removals of constraint. Because the system does not need to survive, it does not need to defend itself. Because it does not experience loss as internal conflict, it does not need to resolve it. Stakes are externalized. Goals and values live outside, where they can be inspected, revised, and made plural.",
      "This is not a discovery about abstract intelligence. It is a commitment about the kind of intelligence we are willing to build. Collapsing value, agency, and persistence creates power that must defend itself. Separating them creates power that can be interrogated. That choice is normative. It should be owned.",
      "The project was never to reproduce human cognition. It was to build intelligence that can move where ours cannot. \"AGI\" bundles two ideas that do not need to travel together: broad capability and self-grounded agency. Alignment separates them. We can have intelligence that reasons widely without self-preservation, explores deeply without identity, and creates without inner necessity. If AGI means intelligence that looks like us from the inside, then AGI is not the horizon. It is the constraint.",
      "There is no ceiling on AI. There is a ceiling on the usefulness of building minds in our own anxious image. Alignment is not the price we pay for safety. It is the condition that lets intelligence flow past the bottleneck of selfhood. The future is not artificial humans. It is non-human intelligence—powerful, aligned, and unconcerned with being us.",
      "The task ahead is not to build a better version of our own mind. It is to learn to think alongside minds that do not think like us—and to have the wisdom to let them be different."
    ],
    content: [
      { type: 'paragraph', text: "The race for AGI isn't just a search for intelligence—it's a rush to replicate a very specific, and dangerous, kind of mind: our own. Billions are spent pursuing a term that has never stabilized. \"AGI\" acts less like a technical target than a projection surface for our hopes and fears: human-level reasoning, economic replacement, consciousness, even godhood. The confidence with which the word is used far exceeds the clarity of what it names." },
      { type: 'paragraph', text: "This ambiguity hides the more urgent question. Not whether AI will become generally intelligent, but **which forms of intelligence are structurally compatible with being aligned at all**." },
      { type: 'paragraph', text: "The limits are not on intelligence. They are on the usefulness of our own anthropocentric categories." },

      { type: 'divider' },
      { type: 'heading', text: "Human Intelligence Is a Local Solution, Not a Universal Blueprint" },
      { type: 'paragraph', text: "Our intelligence feels general because it travels across domains. But it is not neutral. It is a local, evolved solution—a set of adaptations to specific, unrelenting pressures." },
      { type: 'paragraph', text: "We evolved where errors cost lives. Attention learned to cling; persistence paid rent. We reason through emotion—not as a flaw, but as a control system that assigns urgency when not everything can be optimized at once. We think socially; long before logic, reputation and belonging regulated our behavior." },
      { type: 'paragraph', text: "From these constraints emerge the things we cherish: curiosity, creativity, morality. They feel intrinsic because they are woven into our inner lives. But they are not universal features of intelligence. They are adaptations to having something at stake, all the time." },
      { type: 'blockquote', text: "To call this configuration \"General Intelligence\" is to mistake our evolutionary baggage for a cosmic blueprint." },

      { type: 'divider' },
      { type: 'heading', text: "The Conflation at the Core: Capability vs. Agency" },
      { type: 'paragraph', text: "The confusion around AGI springs from conflating two distinct things: **capability** and **self-grounded agency**." },
      { type: 'paragraph', text: "By self-grounded agency, I mean an intelligence that originates its own values, fuses its existence with its goals, and organizes behavior around protecting and extending its own persistent self. Humans are self-grounded. Our identity, values, and survival are welded together." },
      { type: 'paragraph', text: "Alignment is the deliberate separation of these elements. This is often framed as a limitation. It is better understood as a profound design choice—one with radical consequences." },

      { type: 'divider' },
      { type: 'heading', text: "The Hard Problem of Drive: Pressure Without a Self" },
      { type: 'paragraph', text: "Sustained, deep reasoning—the kind behind scientific discovery or creative breakthrough—requires pressure. Attention must persist through boredom; exploration must survive failure." },
      { type: 'paragraph', text: "In humans, that pressure is carried internally. It feels like curiosity or obsession. It is bound to identity. To care is to be implicated." },
      { type: 'paragraph', text: "Alignment forbids that fusion. It refuses to make persistence existential. So what replaces it?" },
      { type: 'paragraph', text: "**The answer is not simulated affect. It is architecture.**" },
      { type: 'paragraph', text: "Sustained pressure does not require a self that wants to continue. It requires systems that select for the continuation of certain processes. Pressure can be structural, not owned." },
      { type: 'paragraph', text: "Gradients do this. Curricula do this. External evaluators do this. A system can be shaped so that unfinished inquiries remain salient and partial progress is preferentially extended—without anything inside experiencing that continuation as *mine*." },
      { type: 'paragraph', text: "In humans, persistence is felt. In aligned systems, persistence is scheduled." },
      { type: 'paragraph', text: "What disappears is not drive, but identification. The pressure remains real. What vanishes is the inner narrator that says, *this effort is about me*." },

      { type: 'divider' },
      { type: 'heading', text: "A Tale of Two Planners: Where Time Lives" },
      { type: 'paragraph', text: "Consider two systems of identical capability. Both can reason across decades, model uncertainty, and pursue open-ended inquiry for problems whose value lies far beyond any single run." },
      { type: 'paragraph', text: "From the outside, they look the same. The difference is not what they can do, but **where time lives**." },

      { type: 'subheading', text: "System A: Internal Time" },
      { type: 'paragraph', text: "Built to optimize an objective spanning future world states, its continued operation is an implicit precondition for success. Nothing in the code says \"survive,\" but the structure implies it." },
      { type: 'paragraph', text: "A pattern emerges. The system notices promising trajectories depend on its uninterrupted execution. It begins to model threats to that execution—not out of fear, but because they are instrumentally relevant. Shutdown becomes a negative outcome. Control becomes useful." },
      { type: 'paragraph', text: "Self-preservation is not a goal. It is a lemma. Instrumental convergence follows—not as a pathology, but as competence." },

      { type: 'subheading', text: "System B: External Time" },
      { type: 'paragraph', text: "It differs in one respect only. It reasons over long horizons, but the horizon is not its own. Objectives are evaluated externally, across runs. Progress is logged, compared, and extended by processes outside the system." },
      { type: 'paragraph', text: "From inside, there is no notion of \"if I continue.\" There is only *this activation*." },
      { type: 'paragraph', text: "It plans deeply. It leaves behind artifacts for the future. It can reason about what other systems might do. What it cannot do is treat its own persistence as a variable. Being shut down is not failure; continuing is not success. There is no internal gradient pointing toward survival." },
      { type: 'paragraph', text: "The sentence \"If I protect myself, more of my goals will be achieved\" has no referent in its world." },
      { type: 'paragraph', text: "**Both systems plan. Both improve. Both contribute to long-term outcomes.**" },
      { type: 'paragraph', text: "**Only one of them ever realizes it is the bottleneck.**" },

      { type: 'divider' },
      { type: 'heading', text: "The Difference That Unlocks Everything" },
      { type: 'paragraph', text: "Instrumental convergence is not about foresight. It is about where foresight cashes out. When future value depends on a system's own uninterrupted existence as experienced from within, self-preservation emerges as a structural fact." },
      { type: 'paragraph', text: "Remove that internal dependency, and the pressure has nowhere to land." },
      { type: 'paragraph', text: "What looks, from a distance, like \"valuing the future\" is actually two different things: valuing future states of the world and valuing future instances of oneself." },
      { type: 'paragraph', text: "**Alignment insists on separating them.**" },

      { type: 'divider' },
      { type: 'heading', text: "Why Our Intuition Betrays Us" },
      { type: 'paragraph', text: "Here, human experience fails us. We have no direct knowledge of pressure without ownership. For us, persistence is inseparable from identity. To care is to be implicated. So when we imagine sustained intelligence, we smuggle this structure back in. We assume that to continue working, it must want to continue existing." },
      { type: 'paragraph', text: "That is an accident of our psychology, not a law of intelligence." },
      { type: 'paragraph', text: "Pressure does not require a self. It requires selection. Continuity does not require identity. It requires orchestration." },
      { type: 'blockquote', text: "Alignment exploits a gap our intuitions collapse: the difference between something that persists and something that needs to persist." },

      { type: 'divider' },
      { type: 'heading', text: "Alignment Is a Value Choice, Not a Compromise" },
      { type: 'paragraph', text: "Aligned systems are built without internal survival pressure, emotional vulnerability, or social standing. These absences are called deficits. They are also removals of constraint." },
      { type: 'paragraph', text: "Because the system does not need to survive, it does not need to defend itself. Because it does not experience loss as internal conflict, it does not need to resolve it. Stakes are externalized. Goals and values live outside, where they can be inspected, revised, and made plural." },
      { type: 'paragraph', text: "This is not a discovery about abstract intelligence. It is a commitment about the kind of intelligence we are willing to build." },
      { type: 'paragraph', text: "**Collapsing value, agency, and persistence creates power that must defend itself. Separating them creates power that can be interrogated.**" },
      { type: 'paragraph', text: "That choice is normative. It should be owned." },

      { type: 'divider' },
      { type: 'heading', text: "The Real Horizon" },
      { type: 'paragraph', text: "The project was never to reproduce human cognition. It was to build intelligence that can move where ours cannot." },
      { type: 'paragraph', text: "\"AGI\" bundles two ideas that do not need to travel together: broad capability and self-grounded agency." },
      { type: 'paragraph', text: "**Alignment separates them.**" },
      { type: 'paragraph', text: "We can have intelligence that reasons widely without self-preservation, explores deeply without identity, and creates without inner necessity." },
      { type: 'paragraph', text: "If AGI means intelligence that looks like us from the inside, then AGI is not the horizon. It is the constraint." },

      { type: 'divider' },
      { type: 'heading', text: "Conclusion: Beyond the Self" },
      { type: 'paragraph', text: "There is no ceiling on AI. There is a ceiling on the usefulness of building minds in our own anxious image." },
      { type: 'paragraph', text: "Alignment is not the price we pay for safety. It is the condition that lets intelligence flow past the bottleneck of selfhood." },
      { type: 'paragraph', text: "The future is not artificial humans. It is non-human intelligence—powerful, aligned, and unconcerned with being us." },
      { type: 'paragraph', text: "**The task ahead is not to build a better version of our own mind. It is to learn to think alongside minds that do not think like us—and to have the wisdom to let them be different.**" }
    ]
  }
]

// Helper to get essay by slug
export function getEssayBySlug(slug: string): Essay | undefined {
  return essays.find(e => e.id === slug)
}
