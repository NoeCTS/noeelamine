import { forwardRef } from 'react';
import { usePageTransition } from './PageTransition';

const RealWorkSection = forwardRef<HTMLElement>((_, ref) => {
  const { navigateWithTransition } = usePageTransition();

  return (
    <section ref={ref} id="real-work" className="relative py-section w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-24">
          {/* Sticky Label */}
          <div className="md:w-1/4">
            <div className="sticky top-32 text-sm font-medium tracking-wide text-secondary uppercase">
              Real Work
            </div>
          </div>

          {/* Content */}
          <div className="md:w-3/4 flex flex-col gap-12">
            {/* AUBE CTA */}
            <button
              onClick={() => navigateWithTransition('/aube')}
              className="group block w-full text-left"
            >
              <div
                className="relative border border-amber-500/20 hover:border-amber-500/60 transition-all duration-500 px-8 py-12 md:px-16 md:py-20 overflow-hidden"
                style={{ 
                  willChange: 'transform, opacity, box-shadow',
                  background: 'linear-gradient(135deg, rgba(20, 15, 10, 0.9), rgba(30, 20, 10, 0.8))'
                }}
              >
                {/* Sunrise gradient overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{
                    background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(245, 158, 11, 0.2), rgba(234, 88, 12, 0.1) 40%, transparent 70%)',
                  }}
                />

                {/* Warm rays emanating upward */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `
                      linear-gradient(180deg, transparent 60%, rgba(245, 158, 11, 0.03) 100%),
                      repeating-conic-gradient(from 180deg at 50% 120%, transparent 0deg, rgba(245, 158, 11, 0.02) 5deg, transparent 10deg)
                    `,
                  }}
                />

                {/* Subtle shimmer overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.05) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'aubeShimmer 3s infinite',
                  }}
                />

                {/* Main text */}
                <div className="relative flex flex-col items-center justify-center">
                  <h2 
                    className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-[0.2em] uppercase transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.8) 0%, rgba(234, 88, 12, 0.8) 50%, rgba(245, 158, 11, 0.8) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    <span className="group-hover:drop-shadow-[0_0_30px_rgba(245,158,11,0.6)] transition-all duration-500">
                      AUBE
                    </span>
                  </h2>

                  {/* Tagline */}
                  <p className="text-amber-500/60 font-light text-sm tracking-[0.3em] mt-4 group-hover:text-amber-400/90 transition-colors duration-500">
                    CULTURAL INTELLIGENCE PLATFORM
                  </p>

                  {/* Brief description */}
                  <p className="text-secondary/70 text-sm mt-6 max-w-md text-center group-hover:text-secondary/90 transition-colors duration-500">
                    AI-powered screening for cultural appropriation, tokenism, and sensitivity across 68+ markets.
                  </p>
                </div>

                {/* Corner accents - amber themed with glow */}
                <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-amber-500/30 group-hover:border-amber-500/80 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-500" />
                <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-amber-500/30 group-hover:border-amber-500/80 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-500" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-amber-500/30 group-hover:border-amber-500/80 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-500" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-amber-500/30 group-hover:border-amber-500/80 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.3)] transition-all duration-500" />

                {/* Hover glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 80px rgba(245, 158, 11, 0.1), 0 0 40px rgba(245, 158, 11, 0.1)',
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aubeShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
});

RealWorkSection.displayName = 'RealWorkSection';

export default RealWorkSection;
