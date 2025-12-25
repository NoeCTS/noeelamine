import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { usePageTransition } from '@/components/PageTransition';

// Import assets
import heroVideo from '@/assets/pangaia-hero-video.mp4';
import busStopImg from '@/assets/pangaia-bus-stop.png';
import wildflowerWomanImg from '@/assets/pangaia-wildflower-woman.png';
import manFieldImg from '@/assets/pangaia-man-field.jpg';
import dyeScienceImg from '@/assets/pangaia-dye-science.png';
import footprintImg from '@/assets/pangaia-footprint.png';
import boxImg from '@/assets/pangaia-box.jpg';
import adImg from '@/assets/pangaia-ad.jpg';
import twoModelsImg from '@/assets/pangaia-2-models.jpg';

gsap.registerPlugin(ScrollTrigger);

const Pangaia = () => {
  const [loaded, setLoaded] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);
  const flowerCursorRef = useRef<HTMLDivElement>(null);
  const { navigateWithTransition } = usePageTransition();

  // Particle state for animations
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => setLoaded(true), 100);

    // Generate particles
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);

    // Flower cursor movement
    const handleMouseMove = (e: MouseEvent) => {
      if (flowerCursorRef.current) {
        gsap.to(flowerCursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
      // Hero Section - Symbiosis text transformation
      const heroTL = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
          pin: true,
        },
      });

      heroTL
        .to('.symbiosis-letter', {
          letterSpacing: '0.2em',
          opacity: 0.3,
          stagger: 0.05,
          duration: 0.5,
        })
        .to('.hero-flowers', { opacity: 1, scale: 1, duration: 0.5 }, '-=0.3')
        .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.3 }, '-=0.2')
        .to('.hero-flowers .flower', { 
          y: () => gsap.utils.random(-20, 20),
          rotation: () => gsap.utils.random(-10, 10),
          stagger: 0.1,
        }, '-=0.3');

      // Gallery section - fade in
      gsap.from('.gallery-image', {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
        },
      });

      // Results - Stats animation (guarded)
      const resultStats = document.querySelectorAll('.result-stat');
      if (resultStats.length) {
        gsap.from(resultStats, {
          y: 50,
          opacity: 0,
          stagger: 0.2,
          scrollTrigger: {
            trigger: resultsRef.current,
            start: 'top 60%',
          },
        });
      }

      gsap.from('.final-quote-line', {
        y: 30,
        opacity: 0,
        stagger: 0.3,
        scrollTrigger: {
          trigger: '.final-quote',
          start: 'top 70%',
        },
      });
    });

    return () => ctx.revert();
  }, [loaded]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen overflow-x-hidden cursor-none"
      style={{
        fontFamily: "'Georgia', serif",
        backgroundColor: '#1A2F1A',
        color: '#F5F0E8',
      }}
    >
      {/* Flower Cursor */}
      <div
        ref={flowerCursorRef}
        className="fixed pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2"
        style={{ left: 0, top: 0 }}
      >
        <svg width="32" height="32" viewBox="0 0 32 32" className="animate-spin-slow">
          {/* Petals */}
          {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <ellipse
              key={i}
              cx="16"
              cy="8"
              rx="4"
              ry="7"
              fill={i % 2 === 0 ? '#FFB6C1' : '#F5F0E8'}
              opacity="0.9"
              transform={`rotate(${angle} 16 16)`}
            />
          ))}
          {/* Center */}
          <circle cx="16" cy="16" r="5" fill="#F4C430" />
          <circle cx="16" cy="16" r="3" fill="#DAA520" />
        </svg>
      </div>
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-40 flex justify-between items-center p-6 md:p-8 transition-all duration-1000 ${
          loaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm tracking-[0.3em] uppercase font-medium" style={{ color: '#8B9A7A' }}>
            PANGAIA
          </span>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#8B9A7A' }} />
        </div>
        <button
          onClick={() => navigateWithTransition('/')}
          className="text-xs tracking-[0.2em] uppercase transition-colors"
          style={{ color: '#8B9A7A' }}
        >
          ← Back to portfolio
        </button>
      </header>

      {/* Section 1: Hero - Symbiosis */}
      <section
        ref={heroRef}
        className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
        style={{ backgroundColor: '#1A2F1A' }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-1 h-1 rounded-full opacity-30"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                backgroundColor: '#8B9A7A',
                animation: `float ${3 + p.delay}s ease-in-out infinite`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div className={`text-center relative z-10 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <p className="text-xs tracking-[0.5em] uppercase mb-4" style={{ color: '#8B9A7A' }}>
            Concept Campaign
          </p>

          <h1 className="text-5xl md:text-7xl lg:text-9xl font-light tracking-tight mb-8 relative">
            {'SYMBIOSIS'.split('').map((letter, i) => (
              <span key={i} className="symbiosis-letter inline-block">
                {letter}
              </span>
            ))}
          </h1>

          {/* Hero flowers overlay */}
          <div className="hero-flowers absolute inset-0 flex items-center justify-center opacity-0 scale-90 pointer-events-none">
            {/* SVG Flowers */}
            <svg viewBox="0 0 400 200" className="w-full max-w-4xl">
              {/* Poppy */}
              <g className="flower" transform="translate(80, 100)">
                <circle cx="0" cy="0" r="25" fill="#E84B3C" opacity="0.9" />
                <circle cx="0" cy="0" r="8" fill="#5C4033" />
              </g>
              {/* Daisy */}
              <g className="flower" transform="translate(200, 80)">
                {[...Array(8)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx="0"
                    cy="-15"
                    rx="6"
                    ry="15"
                    fill="#F5F0E8"
                    transform={`rotate(${i * 45})`}
                  />
                ))}
                <circle cx="0" cy="0" r="10" fill="#F4C430" />
              </g>
              {/* Cornflower */}
              <g className="flower" transform="translate(320, 100)">
                {[...Array(12)].map((_, i) => (
                  <ellipse
                    key={i}
                    cx="0"
                    cy="-12"
                    rx="4"
                    ry="12"
                    fill="#6495ED"
                    transform={`rotate(${i * 30})`}
                  />
                ))}
                <circle cx="0" cy="0" r="6" fill="#1A2F1A" />
              </g>
            </svg>
          </div>

          <p className="hero-subtitle text-lg md:text-xl tracking-wide opacity-0 translate-y-4" style={{ color: '#8B9A7A' }}>
            PANGAIA's Circular Revolution
          </p>
        </div>

        {/* Scroll indicator */}
        <div className={`absolute bottom-12 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: '#8B9A7A' }}>Scroll</span>
            <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, #8B9A7A, transparent)' }} />
          </div>
        </div>
      </section>

      {/* Section 2: Hero Video */}
      <section ref={problemRef} className="min-h-screen py-16 px-6 md:px-12 lg:px-24 relative flex items-center" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto w-full">
          <div className="relative w-full aspect-[9/16] md:aspect-video max-w-4xl mx-auto rounded-2xl overflow-hidden">
            <video
              src={heroVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>
        </div>
      </section>

      {/* Section 3: Visual Gallery */}
      <section ref={galleryRef} className="min-h-screen py-32 px-6 md:px-12 lg:px-24" style={{ backgroundColor: '#1A2F1A' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.5em] uppercase mb-16 text-center" style={{ color: '#8B9A7A' }}>
            Campaign Imagery
          </p>

          {/* Gallery grid - optimized for full visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="gallery-image rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => setLightboxImage(wildflowerWomanImg)}>
              <img
                src={wildflowerWomanImg}
                alt="Wildflower Woman"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="gallery-image rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => setLightboxImage(manFieldImg)}>
              <img
                src={manFieldImg}
                alt="Man in Field"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="gallery-image rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => setLightboxImage(twoModelsImg)}>
              <img
                src={twoModelsImg}
                alt="Two Models"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="gallery-image rounded-2xl overflow-hidden relative group cursor-pointer md:col-span-2 lg:col-span-2" onClick={() => setLightboxImage(busStopImg)}>
              <img
                src={busStopImg}
                alt="London Bus Stop OOH"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="gallery-image rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => setLightboxImage(dyeScienceImg)}>
              <img
                src={dyeScienceImg}
                alt="Sustainable Dye"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="gallery-image rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => setLightboxImage(footprintImg)}>
              <img
                src={footprintImg}
                alt="The Footprint"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="gallery-image rounded-2xl overflow-hidden relative group cursor-pointer" onClick={() => setLightboxImage(boxImg)}>
              <img
                src={boxImg}
                alt="Packaging"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="gallery-image rounded-2xl overflow-hidden relative group cursor-pointer md:col-span-2 lg:col-span-1" onClick={() => setLightboxImage(adImg)}>
              <img
                src={adImg}
                alt="Campaign Ad"
                className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <button
            className="absolute top-6 right-6 text-white/80 hover:text-white text-4xl font-light transition-colors"
            onClick={() => setLightboxImage(null)}
          >
            ×
          </button>
          <img
            src={lightboxImage}
            alt="Full view"
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Section 4: Results & Close */}
      <section ref={resultsRef} className="min-h-screen py-32 px-6 md:px-12 lg:px-24" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Final quote */}
          <div className="final-quote mb-24">
            <p className="final-quote-line text-2xl md:text-3xl font-light leading-relaxed mb-4" style={{ color: '#1A2F1A' }}>
              From apology to action.
            </p>
            <p className="final-quote-line text-2xl md:text-3xl font-light leading-relaxed mb-4" style={{ color: '#1A2F1A' }}>
              From product to philosophy.
            </p>
            <p className="final-quote-line text-2xl md:text-3xl font-light leading-relaxed" style={{ color: '#1A2F1A' }}>
              From linear waste to circular wonder.
            </p>
          </div>

          {/* Becoming */}
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-light tracking-tight mb-16" style={{ color: '#1A2F1A' }}>
            BECOMING
          </h2>

          {/* CTA */}
          <a
            href="https://youtu.be/WOnd04WRT-U"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#1A2F1A', color: '#F5F0E8' }}
          >
            Watch Campaign Strategy Video
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t" style={{ borderColor: '#5C4033', backgroundColor: '#1A2F1A' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: '#5C4033' }}>Concept by</span>
            <span className="text-sm" style={{ color: '#F5F0E8' }}>Noe Elamine</span>
          </div>
          <p className="text-xs text-center" style={{ color: '#5C4033' }}>
            This is a speculative campaign created for portfolio purposes. Not affiliated with PANGAIA.
          </p>
          <button 
            onClick={() => navigateWithTransition('/')} 
            className="text-xs tracking-[0.2em] uppercase transition-colors" 
            style={{ color: '#5C4033' }}
          >
            Back to portfolio
          </button>
        </div>
      </footer>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Pangaia;
