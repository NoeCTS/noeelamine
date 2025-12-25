import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import nothingAd1 from '@/assets/nothing-ad-1.jpg';
import nothingAd2 from '@/assets/nothing-ad-2.jpg';
import nothingHeadphone from '@/assets/nothing-headphone.png';

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
      className="min-h-screen bg-black text-white overflow-x-hidden"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)'
        }}
      />

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-6 md:p-8 transition-all duration-1000 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm tracking-[0.3em] uppercase">Nothing</span>
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
        <Link 
          to="/" 
          className="text-xs tracking-[0.2em] uppercase opacity-50 hover:opacity-100 transition-opacity"
        >
          ← Back to portfolio
        </Link>
      </header>

      {/* Hero */}
      <section className="min-h-screen flex flex-col items-center justify-center relative px-6">
        <div className={`text-center transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-xs tracking-[0.5em] uppercase text-neutral-500 mb-4">Concept Campaign</p>
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-light tracking-tight mb-8">
            Headphone <span className="opacity-30">(1)</span>
          </h1>
        </div>

        {/* Headphone image */}
        <div className={`transition-all duration-1000 delay-500 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <img 
            src={nothingHeadphone} 
            alt="Nothing Headphone (1)" 
            className="w-64 md:w-80 lg:w-96 h-auto"
          />
        </div>

        <p className={`text-lg md:text-xl text-neutral-400 tracking-wide mt-8 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          nothing <span className="mx-4">feels</span> different.
        </p>

        <div className={`absolute bottom-12 transition-all duration-1000 delay-900 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-600">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-neutral-600 to-transparent" />
          </div>
        </div>
      </section>

      {/* Campaign Brief */}
      <section className="py-32 px-6 md:px-12 lg:px-24">
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-xs tracking-[0.5em] uppercase text-neutral-600 mb-8">The Brief</p>
          <h2 className="text-2xl md:text-4xl font-light leading-relaxed text-neutral-200">
            In a world of constant noise and conformity, Nothing offers an escape. 
            <span className="text-neutral-500"> The Headphone (1) isn't just audio equipment—it's a statement.</span>
          </h2>
        </div>
      </section>

      {/* Campaign Images */}
      <section className="py-16 px-6 md:px-12 lg:px-24">
        <div className="max-w-6xl mx-auto space-y-24">
          {/* First image */}
          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">01 / London Underground</p>
            <img 
              src={nothingAd1} 
              alt="Nothing Headphone Campaign - London Underground" 
              className="w-full h-auto"
            />
            <p className="text-sm text-neutral-500 max-w-md mt-6">
              Standing apart in the crowd. The daily commute becomes a personal sanctuary.
            </p>
          </div>

          {/* Second image */}
          <div className="relative">
            <p className="text-xs tracking-[0.3em] uppercase text-neutral-500 mb-4">02 / Rush Hour</p>
            <img 
              src={nothingAd2} 
              alt="Nothing Headphone Campaign - Rush Hour" 
              className="w-full h-auto"
            />
            <p className="text-sm text-neutral-500 max-w-md mt-6">
              Find clarity in chaos. When everyone looks down, you look forward.
            </p>
          </div>
        </div>
      </section>

      {/* Strategy Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-16">
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-neutral-600 mb-4">Insight</p>
              <p className="text-neutral-400 leading-relaxed">
                Gen Z and millennials feel increasingly alienated by conformity. They crave authenticity in a world of sameness.
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-neutral-600 mb-4">Strategy</p>
              <p className="text-neutral-400 leading-relaxed">
                Position Nothing as the anti-establishment choice. Not through rebellion, but through quiet confidence.
              </p>
            </div>
            <div>
              <p className="text-xs tracking-[0.5em] uppercase text-neutral-600 mb-4">Execution</p>
              <p className="text-neutral-400 leading-relaxed">
                Outdoor campaign targeting London transport hubs. Digital activation through ambient social content.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="py-32 flex items-center justify-center">
        <div className="text-center">
          <p className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tight">
            nothing <span className="text-neutral-600">feels</span> different.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-neutral-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.3em] uppercase text-neutral-600">Concept by</span>
            <span className="text-sm">Noe Elamine</span>
          </div>
          <p className="text-xs text-neutral-700 text-center">
            This is a speculative campaign created for portfolio purposes. Not affiliated with Nothing Technology Ltd.
          </p>
          <Link 
            to="/" 
            className="text-xs tracking-[0.2em] uppercase text-neutral-600 hover:text-white transition-colors"
          >
            Back to portfolio
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default Nothing;