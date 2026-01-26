// Hidden content for search engine indexing
// This content is visually hidden but readable by crawlers

export function AboutSeoContent() {
  return (
    <div className="sr-only">
      <h1>About Amy Yuan - Founder, Researcher, Mountaineer</h1>
      <article>
        <p>I spent years doing computational physics—PhD at USC, postdoc at Stanford, ran simulations on 163,840 cores. I was good at it, but I kept escaping into side projects, building apps that hit top-10 charts while I was supposed to be doing research. Eventually I admitted to myself that I wanted to make things people actually use.</p>
        <p>Went into healthcare AI, then co-founded PROVEN with Ming. The way people shop is broken: guess, buy, return, repeat. I built an AI system that learns individual preferences and adapts over time—a system that closes the feedback loop. Started with skincare, expanded to other categories, scaled to $150M+.</p>
        <p>The underlying thesis is bigger: real personalization that compounds value for the customer instead of extracting it.</p>
        <p>Now I'm building again, trying to find the next thing that's real. I climb mountains between projects. Standing on a glacier that took a hundred thousand years to form helps me remember what I'm optimizing for.</p>

        <h2>Training and Research</h2>
        <p>Ph.D. Computational Physics (USC, Mork Fellow). M.S. Computer Science (USC). Postdoc (Stanford, Ignite Fellow). Ran the world's largest peta-flop atomistic simulation at the time. 163,840 cores on Blue Gene/P. Wrote parallel algorithms in Fortran and C++ with openMPI. Published 10 papers, got 2 Physics Review Letter covers.</p>

        <h2>Healthcare Experience</h2>
        <p>McKesson — Production ML for drug pricing and supply chain. Lyra Health — Employee #28, clinical ML for therapist matching. Watched Lyra scale from 18 to 200+ people.</p>

        <h2>PROVEN</h2>
        <p>Co-founded PROVEN with Ming. AI-powered skincare personalization. YC W18. Scaled to $150M+ revenue. Got 2 patents, won MIT AI Idol. Built end-to-end ML pipelines—data ingestion, human-in-the-loop labeling, model training, real-time inference, personalization.</p>

        <h2>Current Focus</h2>
        <p>Durin — market intelligence infrastructure. Pawgress — family AI that optimizes for something other than engagement.</p>

        <h2>Mountaineering</h2>
        <p>Glaciers on four continents. Mountaineering is good for perspective and learning to take calculated risks repeatedly.</p>

        <h2>Recognition</h2>
        <ul>
          <li>MIT AI Idol — AI personalization</li>
          <li>Glossy Best Use of Technology</li>
          <li>2 U.S. Patents — AI personalization systems</li>
          <li>World Record Simulations — 163,840-core peta-flop computing</li>
          <li>10 Publications — 2 PRL covers, Nano Letters</li>
        </ul>
      </article>
    </div>
  )
}

export function ProjectsSeoContent() {
  return (
    <div className="sr-only">
      <h1>Projects by Amy Yuan</h1>
      <article>
        <h2>PROVEN</h2>
        <p>Co-founder and Operator. AI personalization that learns what works for each person and improves with every interaction—not a static quiz. Started with skincare, expanded to other categories, scaled to $150M+. YC W18, 2 patents, MIT AI Idol.</p>

        <h2>Noteworthy</h2>
        <p>AI fragrance personalization, same thesis as PROVEN.</p>

        <h2>Durin</h2>
        <p>Market intelligence infrastructure. Semantic grounding for preference data.</p>

        <h2>Pawgress</h2>
        <p>Family AI that knows when to step back. Exploring what happens when you don't optimize for engagement.</p>

        <h2>Lyra Health</h2>
        <p>Employee #28. Clinical ML for therapist matching. Joined at 18 people, left at 200+.</p>

        <h2>McKesson</h2>
        <p>Drug pricing and supply chain ML.</p>

        <h2>Early Apps and Games</h2>
        <ul>
          <li>Camera360 — top-10 Android app, acquired</li>
          <li>Divine Might — top-10 MMORPG globally</li>
          <li>Cubicman — top-10 iOS game, acquired</li>
        </ul>

        <h2>Research</h2>
        <p>PhD at USC, postdoc at Stanford. World's largest peta-flop simulation on 163,840 cores. 10 papers, 2 PRL covers.</p>
        <h3>Research Areas</h3>
        <ul>
          <li>Stronger and smarter materials — Sulfur-induced embrittlement in metals, Ni-Cu-P/CNT composite coatings</li>
          <li>Nanoscale structures for electronics — Stacking faults in GaAs nanowires, twin superlattice formation, exciton transport</li>
          <li>Clean energy with AI — ML-driven perovskite solar cell optimization, DeepSolar mapping</li>
        </ul>
      </article>
    </div>
  )
}

export function EssaySeoContent({ title, date, paragraphs }: { title: string; date: string; paragraphs: string[] }) {
  return (
    <div className="sr-only">
      <article>
        <h1>{title}</h1>
        <time dateTime={date}>{date}</time>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <footer>
          <p>By Amy Yuan (Zaoshi Yuan)</p>
        </footer>
      </article>
    </div>
  )
}
