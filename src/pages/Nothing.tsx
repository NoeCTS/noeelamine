import { useEffect, useRef, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import nothingAd1 from '@/assets/nothing-ad-1.jpg';
import nothingAd2 from '@/assets/nothing-ad-2.jpg';

const HeadphoneViewer = lazy(() => import('@/components/HeadphoneViewer'));

const Nothing = () => {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    // Trigger entrance animation
    setTimeout(() => setLoaded(true), 100);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-[#f5f5f5] text-neutral-900 overflow-x-hidden"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {/* Dot pattern overlay */}
      <div className="fixed inset-0 pointer-events-none z-10 opacity-40"
        style={{
          backgroundImage: 'radial-gradient(circle, #999 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 flex justify-center items-center p-4 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 flex items-center gap-8 shadow-sm">
          <button className="text-neutral-600 hover:text-neutral-900 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
            </svg>
          </button>
          <span className="text-sm tracking-[0.2em] uppercase font-medium" style={{ fontFamily: "'Courier New', monospace" }}>
            NOTHING (R)
          </span>
          <Link 
            to="/" 
            className="text-xs tracking-[0.1em] uppercase text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Portfolio
          </Link>
        </div>
      </header>

      {/* Hero with 3D Headphone */}
      <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center pt-24">
        <div className={`text-center mb-4 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-xs tracking-[0.5em] uppercase text-neutral-400 mb-4">Concept Campaign</p>
          <h1 className="text-4xl md:text-6xl font-light tracking-tight" style={{ textDecoration: 'line-through', textDecorationThickness: '2px' }}>
            headphone(1)
          </h1>
        </div>
        
        {/* 3D Viewer */}
        <div className={`w-full transition-all duration-1000 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <Suspense fallback={
            <div className="h-[60vh] flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
            </div>
          }>
            <HeadphoneViewer />
          </Suspense>
        </div>

        {/* Product specs */}
        <div className={`flex flex-wrap justify-center gap-8 text-xs tracking-wide text-neutral-500 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span>80H PLAYBACK</span>
          <span>•</span>
          <span>SOUND BY KEF</span>
          <span>•</span>
          <span>ADAPTIVE ANC</span>
        </div>

        <p className={`text-center text-xs text-neutral-400 tracking-widest uppercase mt-8 transition-all duration-1000 delay-900 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          Drag to rotate
        </p>
      </section>

      {/* Campaign Brief */}
      <section className="py-32 px-6 md:px-12 lg:px-24 relative z-20 bg-[#f5f5f5]">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs tracking-[0.5em] uppercase text-neutral-400 mb-8">The Brief</p>
          <h2 className="text-2xl md:text-4xl font-light leading-relaxed text-neutral-800">
            In a world of constant noise and conformity, Nothing offers an escape. 
            <span className="text-neutral-400"> The Headphone (1) isn't just audio equipment—it's a statement.</span>
          </h2>
        </div>
      </section>

      {/* Campaign Images */}
      <section className="py-16 px-6 md:px-12 lg:px-24 relative z-20 bg-[#f5f5f5]">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* First image */}
          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-4">01 / London Underground</p>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={nothingAd1} 
                alt="Nothing Headphone Campaign - London Underground" 
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-neutral-500 max-w-md mt-6">
              Standing apart in the crowd. The daily commute becomes a personal sanctuary.
            </p>
          </div>

          {/* Second image */}
          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-400 mb-4">02 / Rush Hour</p>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={nothingAd2} 
                alt="Nothing Headphone Campaign - Rush Hour" 
                className="w-full h-auto"
              />
            </div>
            <p className="text-sm text-neutral-500 max-w-md mt-6">
              Find clarity in chaos. When everyone looks down, you look forward.
            </p>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 border-t border-neutral-200 relative z-20 bg-[#f5f5f5]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-neutral-400 mb-4">Insight</p>
              <p className="text-neutral-600 leading-relaxed">
                Gen Z and millennials feel increasingly alienated by conformity. They crave authenticity in a world of sameness.
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-neutral-400 mb-4">Strategy</p>
              <p className="text-neutral-600 leading-relaxed">
                Position Nothing as the anti-establishment choice. Not through rebellion, but through quiet confidence.
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-neutral-400 mb-4">Execution</p>
              <p className="text-neutral-600 leading-relaxed">
                Outdoor campaign targeting London transport hubs. Digital activation through ambient social content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="py-32 flex items-center justify-center relative z-20 bg-neutral-900">
        <div className="text-center">
          <p className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tight text-white">
            nothing <span className="text-neutral-500">feels</span> different.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-neutral-900 relative z-20">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-500">Concept by</span>
            <span className="text-sm text-white">Noe Elamine</span>
          </div>
          <p className="text-xs text-neutral-600 text-center">
            This is a speculative campaign created for portfolio purposes. Not affiliated with Nothing Technology Ltd.
          </p>
          <Link 
            to="/" 
            className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-white transition-colors"
          >
            Back to portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Nothing;