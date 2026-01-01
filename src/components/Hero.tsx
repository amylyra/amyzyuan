'use client'

interface HeroProps {
  onStartChat: () => void
}

export default function Hero({ onStartChat }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Name */}
        <h1 
          className="opacity-0 animate-fade-up text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-normal mb-6 tracking-tight"
          style={{ fontFamily: 'var(--font-family-display)' }}
        >
          <span className="gradient-text">Zaoshi (Amy) Yuan</span>
        </h1>
        
        {/* Tagline */}
        <p 
          className="opacity-0 animate-fade-up delay-200 text-xl sm:text-2xl text-fog mb-12 tracking-wide"
          style={{ fontFamily: 'var(--font-family-display)', fontStyle: 'italic' }}
        >
          Founder, Researcher, Mountaineer
        </p>
        
        {/* Divider */}
        <div className="opacity-0 animate-fade-up delay-300 w-24 h-px bg-gradient-to-r from-transparent via-ash to-transparent mx-auto mb-12" />
        
        {/* Bio */}
        <div className="opacity-0 animate-fade-up delay-400 max-w-2xl mx-auto space-y-6 mb-16">
          <p className="text-lg sm:text-xl text-mist leading-relaxed">
            Trained in large-scale computational physics. Co-founded and scaled an AI-powered personalization company to{' '}
            <span className="text-ember font-medium">$150M+</span> in total revenue.
          </p>
          <p className="text-lg sm:text-xl text-mist leading-relaxed">
            Still building, looking for the next hard problem in AI.
          </p>
        </div>
        
        {/* CTA */}
        <div className="opacity-0 animate-fade-up delay-500 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartChat}
            className="group relative px-8 py-4 bg-gradient-to-br from-ember to-amber text-coal font-medium rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-ember/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              Let&apos;s talk
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
          
          <a
            href="mailto:amy@example.com"
            className="px-8 py-4 text-fog hover:text-cream border border-ash hover:border-fog rounded-full transition-all duration-300"
          >
            Get in touch
          </a>
        </div>
        
        {/* Scroll indicator */}
        <div className="opacity-0 animate-fade-up delay-600 absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-fog">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-fog to-transparent" />
          </div>
        </div>
      </div>
    </section>
  )
}

