import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Placeholder images - replace with actual uploads
const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600" fill="%231A2F1A"%3E%3Crect width="100%25" height="100%25"/%3E%3Ctext x="50%25" y="50%25" fill="%238B9A7A" font-family="sans-serif" font-size="24" text-anchor="middle" dy=".3em"%3EImage Placeholder%3C/text%3E%3C/svg%3E';

const Pangaia = () => {
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const problemRef = useRef<HTMLElement>(null);
  const solutionRef = useRef<HTMLElement>(null);
  const phasesRef = useRef<HTMLElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const frameworkRef = useRef<HTMLElement>(null);
  const resultsRef = useRef<HTMLElement>(null);

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

      // Problem Section - Waste mountain
      const problemTL = gsap.timeline({
        scrollTrigger: {
          trigger: problemRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
      });

      problemTL
        .from('.waste-mountain', { scaleY: 0, transformOrigin: 'bottom', duration: 1 })
        .to('.truck-counter', { textContent: 1, snap: { textContent: 1 }, duration: 1 }, '-=0.5');

      // Solution Section - T-shirt reveal
      const solutionTL = gsap.timeline({
        scrollTrigger: {
          trigger: solutionRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1.5,
        },
      });

      solutionTL
        .from('.tshirt-outline', { strokeDashoffset: 1000, duration: 1 })
        .from('.tshirt-fill-1', { clipPath: 'inset(100% 0 0 0)', duration: 0.5 })
        .from('.tshirt-fill-2', { clipPath: 'inset(100% 0 0 0)', duration: 0.5 })
        .from('.tshirt-fill-3', { clipPath: 'inset(100% 0 0 0)', duration: 0.5 })
        .from('.comparison-cards', { y: 100, opacity: 0, stagger: 0.2, duration: 0.5 });

      // Campaign Phases - Horizontal scroll
      gsap.to('.phases-track', {
        x: () => -(document.querySelector('.phases-track')?.scrollWidth || 0) + window.innerWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: phasesRef.current,
          start: 'top top',
          end: () => `+=${document.querySelector('.phases-track')?.scrollWidth || 3000}`,
          scrub: 1,
          pin: true,
        },
      });

      // Gallery - Scattered to assembled
      gsap.from('.gallery-image', {
        scale: 0.3,
        rotation: () => gsap.utils.random(-30, 30),
        x: () => gsap.utils.random(-200, 200),
        y: () => gsap.utils.random(-200, 200),
        opacity: 0,
        stagger: 0.1,
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
          end: 'center center',
          scrub: 1,
        },
      });

      // Framework - Circular diagram
      const frameworkTL = gsap.timeline({
        scrollTrigger: {
          trigger: frameworkRef.current,
          start: 'top center',
          end: 'center center',
          scrub: 1,
        },
      });

      frameworkTL
        .from('.framework-center', { scale: 0, duration: 0.5 })
        .from('.framework-line', { strokeDashoffset: 200, stagger: 0.1, duration: 0.3 })
        .from('.framework-node', { scale: 0, opacity: 0, stagger: 0.1, duration: 0.3 });

      // Results - Stats animation
      gsap.from('.result-stat', {
        y: 50,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
          trigger: resultsRef.current,
          start: 'top 60%',
        },
      });

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
      className="min-h-screen overflow-x-hidden"
      style={{
        fontFamily: "'Georgia', serif",
        backgroundColor: '#1A2F1A',
        color: '#F5F0E8',
      }}
    >
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
        <Link
          to="/"
          className="text-xs tracking-[0.2em] uppercase transition-colors"
          style={{ color: '#8B9A7A' }}
        >
          ← Back to portfolio
        </Link>
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

      {/* Section 2: The Problem */}
      <section ref={problemRef} className="min-h-screen py-32 px-6 md:px-12 lg:px-24 relative" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.5em] uppercase mb-8" style={{ color: '#5C4033' }}>
            The Problem
          </p>
          <h2 className="text-3xl md:text-5xl font-light leading-relaxed mb-16" style={{ color: '#F5F0E8' }}>
            Every second, a truck fills with textile waste
          </h2>

          {/* Waste mountain visualization */}
          <div className="relative h-[50vh] flex items-end justify-center">
            <div
              className="waste-mountain w-full max-w-2xl"
              style={{
                height: '100%',
                background: 'linear-gradient(to top, #5C4033 0%, #3a2820 50%, transparent 100%)',
                clipPath: 'polygon(20% 100%, 0% 100%, 30% 30%, 50% 0%, 70% 30%, 100% 100%, 80% 100%)',
              }}
            />
            <div className="absolute bottom-8 text-center">
              <span className="truck-counter text-6xl md:text-8xl font-bold" style={{ color: '#E84B3C' }}>
                1
              </span>
              <p className="text-lg mt-2" style={{ color: '#8B9A7A' }}>EVERY SECOND</p>
            </div>
          </div>

          <p className="text-center mt-16 text-xl" style={{ color: '#8B9A7A' }}>
            97% of materials: "middle of the pack"
          </p>
        </div>
      </section>

      {/* Section 3: The Solution - The Becoming Tee */}
      <section ref={solutionRef} className="min-h-[150vh] py-32 px-6 md:px-12 lg:px-24" style={{ backgroundColor: '#1A2F1A' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.5em] uppercase mb-8" style={{ color: '#8B9A7A' }}>
            The Solution
          </p>
          <h2 className="text-3xl md:text-5xl font-light leading-relaxed mb-16">
            The Becoming Tee
          </h2>

          {/* T-shirt visualization */}
          <div className="relative flex flex-col lg:flex-row items-center gap-16">
            {/* T-shirt SVG */}
            <div className="flex-1 flex justify-center">
              <svg viewBox="0 0 300 350" className="w-full max-w-md">
                {/* T-shirt outline */}
                <path
                  className="tshirt-outline"
                  d="M50 80 L100 50 L150 70 L200 50 L250 80 L220 120 L200 110 L200 300 L100 300 L100 110 L80 120 Z"
                  fill="none"
                  stroke="#8B9A7A"
                  strokeWidth="2"
                  strokeDasharray="1000"
                  strokeDashoffset="0"
                />
                {/* Fill layers */}
                <path
                  className="tshirt-fill-1"
                  d="M100 300 L100 220 L200 220 L200 300 Z"
                  fill="#8B9A7A"
                  opacity="0.8"
                />
                <path
                  className="tshirt-fill-2"
                  d="M100 220 L100 150 L200 150 L200 220 Z"
                  fill="#F4C430"
                  opacity="0.6"
                />
                <path
                  className="tshirt-fill-3"
                  d="M50 80 L100 50 L150 70 L200 50 L250 80 L220 120 L200 110 L200 150 L100 150 L100 110 L80 120 Z"
                  fill="#F5F0E8"
                  opacity="0.4"
                />
              </svg>
            </div>

            {/* Material breakdown */}
            <div className="flex-1 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#8B9A7A' }} />
                <span>50% regenerative cotton</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F4C430' }} />
                <span>30% recycled cotton</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#F5F0E8' }} />
                <span>20% Lyocell</span>
              </div>
            </div>
          </div>

          {/* Comparison cards */}
          <div className="grid md:grid-cols-2 gap-8 mt-24 max-w-3xl mx-auto">
            <div className="comparison-cards p-8 rounded-xl border" style={{ borderColor: '#5C4033', backgroundColor: 'rgba(92, 64, 51, 0.1)' }}>
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#8B9A7A' }}>Standard Tee</p>
              <p className="text-4xl font-light mb-2">£45</p>
              <p className="text-sm" style={{ color: '#8B9A7A' }}>2yr life</p>
              <p className="text-lg mt-4" style={{ color: '#E84B3C' }}>£22.50/year</p>
            </div>
            <div
              className="comparison-cards p-8 rounded-xl border-2 relative overflow-hidden"
              style={{ borderColor: '#8B9A7A', backgroundColor: 'rgba(139, 154, 122, 0.1)' }}
            >
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: 'radial-gradient(circle at center, #8B9A7A 0%, transparent 70%)',
                  animation: 'pulse 2s ease-in-out infinite',
                }}
              />
              <p className="text-xs tracking-[0.3em] uppercase mb-4 relative z-10" style={{ color: '#8B9A7A' }}>Becoming Tee</p>
              <p className="text-4xl font-light mb-2 relative z-10">£65</p>
              <p className="text-sm relative z-10" style={{ color: '#8B9A7A' }}>6yr life</p>
              <p className="text-lg mt-4 relative z-10" style={{ color: '#8B9A7A' }}>£10.83/year</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Campaign Phases - Horizontal Scroll */}
      <section ref={phasesRef} className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="phases-track flex h-screen">
          {/* Phase 1 */}
          <div className="phase-card flex-shrink-0 w-[80vw] md:w-[60vw] h-full flex items-center justify-center p-12">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#E84B3C' }}>Phase 1</p>
              <h3 className="text-3xl md:text-4xl font-light mb-6">The Honest Reckoning</h3>
              <blockquote className="text-xl italic mb-8" style={{ color: '#8B9A7A' }}>
                "We're sorry. But 'better' is no longer good enough."
              </blockquote>
              <div className="flex gap-8">
                <div>
                  <p className="text-3xl font-light" style={{ color: '#F4C430' }}>20M+</p>
                  <p className="text-sm" style={{ color: '#8B9A7A' }}>impressions</p>
                </div>
                <div>
                  <p className="text-3xl font-light" style={{ color: '#F4C430' }}>50+</p>
                  <p className="text-sm" style={{ color: '#8B9A7A' }}>press articles</p>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="phase-card flex-shrink-0 w-[80vw] md:w-[60vw] h-full flex items-center justify-center p-12">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#6495ED' }}>Phase 2</p>
              <h3 className="text-3xl md:text-4xl font-light mb-6">Waste vs. Wonder</h3>
              <p className="text-lg mb-8" style={{ color: '#8B9A7A' }}>
                Shoreditch installation: A split-screen reality of fashion's future.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(92, 64, 51, 0.3)' }}>
                  <p className="text-sm">Waste Mountain</p>
                </div>
                <div className="p-6 rounded-lg" style={{ backgroundColor: 'rgba(139, 154, 122, 0.3)' }}>
                  <p className="text-sm">Regenerative Field</p>
                </div>
              </div>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="phase-card flex-shrink-0 w-[80vw] md:w-[60vw] h-full flex items-center justify-center p-12">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#F4C430' }}>Phase 3</p>
              <h3 className="text-3xl md:text-4xl font-light mb-6">The Circular Makers</h3>
              <p className="text-lg mb-8" style={{ color: '#8B9A7A' }}>
                3-minute hero film documenting the journey from soil to style and back.
              </p>
              <div className="aspect-video rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(139, 154, 122, 0.2)' }}>
                <div className="w-16 h-16 rounded-full border-2 flex items-center justify-center" style={{ borderColor: '#8B9A7A' }}>
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-12 border-transparent ml-1" style={{ borderLeftColor: '#8B9A7A' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="phase-card flex-shrink-0 w-[80vw] md:w-[60vw] h-full flex items-center justify-center p-12">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#8B9A7A' }}>Phase 4</p>
              <h3 className="text-3xl md:text-4xl font-light mb-6">Seed Tag Experience</h3>
              <p className="text-lg mb-8" style={{ color: '#8B9A7A' }}>
                Every garment comes with a plantable tag. 8 weeks → wildflowers bloom.
              </p>
              {/* Seed tag animation placeholder */}
              <div className="flex items-end gap-2 h-24">
                <div className="w-2 h-4 rounded-t" style={{ backgroundColor: '#8B9A7A' }} />
                <div className="w-2 h-8 rounded-t" style={{ backgroundColor: '#8B9A7A' }} />
                <div className="w-2 h-12 rounded-t" style={{ backgroundColor: '#8B9A7A' }} />
                <div className="w-2 h-16 rounded-t" style={{ backgroundColor: '#8B9A7A' }} />
                <div className="w-4 h-20 flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: '#E84B3C' }} />
                  <div className="w-1 h-16" style={{ backgroundColor: '#8B9A7A' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Phase 5 */}
          <div className="phase-card flex-shrink-0 w-[80vw] md:w-[60vw] h-full flex items-center justify-center p-12">
            <div className="max-w-xl">
              <p className="text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#F5F0E8' }}>Phase 5</p>
              <h3 className="text-3xl md:text-4xl font-light mb-6">PANGAIA Archive</h3>
              <p className="text-lg mb-8" style={{ color: '#8B9A7A' }}>
                Resale platform with graded garments. Customer LTV 2x.
              </p>
              <div className="flex gap-4">
                {['A', 'B', 'C'].map((grade, i) => (
                  <div
                    key={grade}
                    className="w-16 h-20 rounded-lg flex items-center justify-center text-2xl font-light"
                    style={{
                      backgroundColor: `rgba(139, 154, 122, ${0.8 - i * 0.2})`,
                      color: '#1A2F1A',
                    }}
                  >
                    {grade}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Visual Gallery */}
      <section ref={galleryRef} className="min-h-screen py-32 px-6 md:px-12 lg:px-24" style={{ backgroundColor: '#1A2F1A' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-xs tracking-[0.5em] uppercase mb-16 text-center" style={{ color: '#8B9A7A' }}>
            Campaign Imagery
          </p>

          {/* Masonry gallery grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {[
              { span: 'col-span-2 md:col-span-1', aspect: 'aspect-[4/5]', label: 'Wildflower Field' },
              { span: 'col-span-1', aspect: 'aspect-square', label: 'Ceramic Pot' },
              { span: 'col-span-1', aspect: 'aspect-[3/4]', label: 'PANGAIA Tee' },
              { span: 'col-span-2', aspect: 'aspect-video', label: 'London Bus Stop OOH' },
              { span: 'col-span-1', aspect: 'aspect-square', label: 'Dye Research' },
              { span: 'col-span-1', aspect: 'aspect-square', label: 'Wool Sourcing' },
            ].map((item, i) => (
              <div
                key={i}
                className={`gallery-image ${item.span} ${item.aspect} rounded-2xl overflow-hidden relative group cursor-pointer`}
                style={{ backgroundColor: 'rgba(139, 154, 122, 0.2)' }}
              >
                <img
                  src={placeholderImage}
                  alt={item.label}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-sm font-medium">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Academic Framework */}
      <section ref={frameworkRef} className="min-h-screen py-32 px-6 md:px-12 lg:px-24" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs tracking-[0.5em] uppercase mb-16 text-center" style={{ color: '#8B9A7A' }}>
            Strategic Framework
          </p>

          {/* Circular diagram */}
          <div className="relative aspect-square max-w-lg mx-auto">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Center */}
              <circle className="framework-center" cx="200" cy="200" r="50" fill="#8B9A7A" opacity="0.3" />
              <text x="200" y="195" textAnchor="middle" fill="#F5F0E8" fontSize="12" fontWeight="500">
                CIRCULAR
              </text>
              <text x="200" y="210" textAnchor="middle" fill="#F5F0E8" fontSize="12" fontWeight="500">
                STRATEGY
              </text>

              {/* Connecting lines */}
              {[0, 90, 180, 270].map((angle, i) => {
                const x2 = 200 + 120 * Math.cos((angle * Math.PI) / 180);
                const y2 = 200 + 120 * Math.sin((angle * Math.PI) / 180);
                return (
                  <line
                    key={i}
                    className="framework-line"
                    x1="200"
                    y1="200"
                    x2={x2}
                    y2={y2}
                    stroke="#8B9A7A"
                    strokeWidth="1"
                    strokeDasharray="200"
                    strokeDashoffset="0"
                  />
                );
              })}

              {/* Nodes */}
              {[
                { angle: 0, label: 'Blue Ocean', sub: 'Eliminate obsolescence' },
                { angle: 90, label: 'R-Ladder', sub: 'Refuse → Recover' },
                { angle: 180, label: 'Behavioral', sub: 'Incentives + Nudges' },
                { angle: 270, label: 'Life Cycle', sub: 'Regenerative impact' },
              ].map((node, i) => {
                const x = 200 + 140 * Math.cos((node.angle * Math.PI) / 180);
                const y = 200 + 140 * Math.sin((node.angle * Math.PI) / 180);
                return (
                  <g key={i} className="framework-node" transform={`translate(${x}, ${y})`}>
                    <circle r="35" fill="#1A2F1A" stroke="#8B9A7A" strokeWidth="1" />
                    <text y="-5" textAnchor="middle" fill="#F5F0E8" fontSize="10" fontWeight="500">
                      {node.label}
                    </text>
                    <text y="10" textAnchor="middle" fill="#8B9A7A" fontSize="8">
                      {node.sub}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* Section 7: Results & Close */}
      <section ref={resultsRef} className="min-h-screen py-32 px-6 md:px-12 lg:px-24" style={{ backgroundColor: '#F5F0E8' }}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-12 mb-24">
            <div className="result-stat">
              <p className="text-5xl md:text-6xl font-light mb-2" style={{ color: '#1A2F1A' }}>£65</p>
              <p className="text-sm tracking-[0.2em] uppercase" style={{ color: '#5C4033' }}>Becoming Tee</p>
            </div>
            <div className="result-stat">
              <p className="text-5xl md:text-6xl font-light mb-2" style={{ color: '#1A2F1A' }}>6yr</p>
              <p className="text-sm tracking-[0.2em] uppercase" style={{ color: '#5C4033' }}>Lifespan</p>
            </div>
            <div className="result-stat">
              <p className="text-5xl md:text-6xl font-light mb-2" style={{ color: '#1A2F1A' }}>2x</p>
              <p className="text-sm tracking-[0.2em] uppercase" style={{ color: '#5C4033' }}>Customer LTV</p>
            </div>
          </div>

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
          <button
            className="px-8 py-4 rounded-full text-sm tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#1A2F1A', color: '#F5F0E8' }}
          >
            View Full Strategy Deck
          </button>
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
          <Link to="/" className="text-xs tracking-[0.2em] uppercase transition-colors" style={{ color: '#5C4033' }}>
            Back to portfolio
          </Link>
        </div>
      </footer>

      {/* Float animation */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Pangaia;
