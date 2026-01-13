import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import GrainOverlay from '@/components/GrainOverlay';
import CustomCursor from '@/components/CustomCursor';
import { usePageTransition } from '@/components/PageTransition';
import heinzAdImage from '@/assets/heinz-ad.png';
import aubeDashboard from '@/assets/aube-dashboard.png';
import { ArrowDown, ExternalLink, ArrowLeft, Upload, Globe, Cpu, Clock, Users, Sparkles, Shield, Eye, Heart, AlertTriangle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Aube = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const problemRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<HTMLDivElement>(null);
  const solutionRef = useRef<HTMLDivElement>(null);
  const vibeCodeRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const ngoRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef<HTMLDivElement>(null);
  const { navigateWithTransition } = usePageTransition();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    // Lenis smooth scroll - extra smooth for editorial feel
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      lerp: 0.08,
    });

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Custom cursor
    const cursor = cursorRef.current;
    let cursorX = 0, cursorY = 0;
    let currentX = 0, currentY = 0;

    const moveCursor = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
    };

    const animateCursor = () => {
      currentX += (cursorX - currentX) * 0.15;
      currentY += (cursorY - currentY) * 0.15;
      if (cursor) {
        cursor.style.transform = `translate(${currentX - 6}px, ${currentY - 6}px)`;
      }
      requestAnimationFrame(animateCursor);
    };

    window.addEventListener('mousemove', moveCursor);
    animateCursor();

    // Link hover effects
    const links = document.querySelectorAll('a, button, .aube-card');
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => cursor?.classList.add('hovering'));
      link.addEventListener('mouseleave', () => cursor?.classList.remove('hovering'));
    });

    // Hero animations
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
      .fromTo('.aube-hero-title', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .fromTo('.aube-hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
      .fromTo('.aube-hero-tagline', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo('.aube-scroll-indicator', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');

    // Problem section - Heinz ad reveal with smoother scrub
    const problemTl = gsap.timeline({
      scrollTrigger: {
        trigger: problemRef.current,
        start: 'top top',
        end: '+=250%',
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
      }
    });

    problemTl
      .fromTo('.heinz-question', { opacity: 1 }, { opacity: 0, duration: 0.4, ease: 'power2.inOut' })
      .fromTo('.heinz-reveal-1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' })
      .to('.heinz-reveal-1', { opacity: 0, duration: 0.3, ease: 'power2.inOut' }, '+=0.6')
      .fromTo('.heinz-annotations', { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' })
      .fromTo('.heinz-annotation-box', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4, stagger: 0.2, ease: 'back.out(1.7)' }, '-=0.3')
      .fromTo('.heinz-reveal-2', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '+=0.4')
      .fromTo('.heinz-reveal-3', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '+=0.5');

    // Origin section - staggered text reveals with smoother transitions
    gsap.utils.toArray('.origin-text').forEach((el: any, i: number) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 50, filter: 'blur(4px)' }, 
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)',
          duration: 1.2, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 0.8,
          }
        }
      );
    });

    // Solution section - flow diagram with fluid animations
    const solutionTl = gsap.timeline({
      scrollTrigger: {
        trigger: solutionRef.current,
        start: 'top 70%',
        end: 'center 40%',
        scrub: 1,
      }
    });

    solutionTl
      .fromTo('.solution-title', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
      .fromTo('.flow-step', { opacity: 0, y: 30, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.2, ease: 'power3.out' }, '-=0.4')
      .fromTo('.flow-connector', { scaleX: 0, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.5, stagger: 0.15, ease: 'power2.inOut' }, '-=1')
      .fromTo('.dimension-card', { opacity: 0, y: 50, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'power3.out' }, '-=0.5')
      .fromTo('.solution-comparison', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

    // Vibe code section with smooth scrub
    gsap.utils.toArray('.vibe-text').forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0, y: 40, filter: 'blur(3px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            end: 'top 50%',
            scrub: 0.6,
          }
        }
      );
    });

    // Showcase section with fluid scroll-linked animation
    gsap.fromTo('.showcase-mockup',
      { opacity: 0, y: 80, scale: 0.92, rotateX: 5 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1.2,
        }
      }
    );

    // NGO section with staggered scrub
    const ngoTl = gsap.timeline({
      scrollTrigger: {
        trigger: ngoRef.current,
        start: 'top 75%',
        end: 'center 50%',
        scrub: 0.8,
      }
    });
    
    ngoTl.fromTo('.ngo-card',
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, stagger: 0.15, ease: 'power3.out' }
    );

    // Closing section with smooth reveal
    gsap.fromTo('.closing-text',
      { opacity: 0, y: 50, filter: 'blur(4px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        ease: 'power3.out',
        scrollTrigger: {
          trigger: closingRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 0.8,
        }
      }
    );

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  const dimensions = [
    { icon: Sparkles, title: 'Tokenism Detection', desc: 'Surface-level representation without substance', color: 'from-amber-500/20 to-amber-600/5' },
    { icon: Shield, title: 'Cultural Appropriation', desc: 'Borrowed elements stripped of context', color: 'from-red-500/20 to-red-600/5' },
    { icon: Eye, title: 'Visual Authenticity', desc: 'Does this feel real or staged?', color: 'from-blue-500/20 to-blue-600/5' },
    { icon: Heart, title: 'Meaningful Inclusion', desc: 'Representation with depth and agency', color: 'from-green-500/20 to-green-600/5' },
    { icon: AlertTriangle, title: 'Stereotype Detection', desc: 'Harmful tropes hiding in plain sight', color: 'from-purple-500/20 to-purple-600/5' },
  ];

  const ngoCards = [
    { title: 'Shape the Product', desc: 'Direct influence on roadmap and features' },
    { title: 'Priority Support', desc: 'Dedicated onboarding and assistance' },
    { title: 'Early Access', desc: 'First to try new markets and capabilities' },
    { title: 'Mission Alignment', desc: 'Collaborate on cultural sensitivity' },
  ];

  return (
    <div ref={containerRef} className="bg-[#0a0a0a] min-h-screen text-white overflow-x-hidden">
      <GrainOverlay />
      <CustomCursor cursorRef={cursorRef} />

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex flex-col items-center justify-center relative px-6">
        <div className="text-center max-w-4xl">
          <h1 className="aube-hero-title text-hero font-bold tracking-tight mb-6 bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            Aube
          </h1>
          <p className="aube-hero-subtitle text-headline text-white/90 font-light mb-8">
            Cultural intelligence for global brands
          </p>
          <p className="aube-hero-tagline text-body text-white/60 max-w-2xl mx-auto leading-relaxed">
            I built an AI that catches what diversity consultants miss.
          </p>
        </div>

        <div className="aube-scroll-indicator absolute bottom-12 flex flex-col items-center gap-3">
          <span className="text-xs text-white/40 tracking-widest uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-amber-500/60 to-transparent relative overflow-hidden">
            <div className="w-full h-4 bg-amber-500 animate-scroll-down" />
          </div>
        </div>
      </section>

      {/* Problem Section - Heinz Ad Reveal */}
      <section ref={problemRef} className="h-screen flex items-center justify-center relative px-6 overflow-hidden">
        <div className="max-w-4xl w-full flex flex-col items-center justify-center">
          {/* Question overlay */}
          <div className="heinz-question absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <p className="text-2xl md:text-4xl font-light text-center px-8">
              Do you see anything wrong with this ad?
            </p>
          </div>

          {/* The Heinz ad image - centered container */}
          <div className="relative w-full max-w-3xl mx-auto">
            <img 
              src={heinzAdImage} 
              alt="Heinz advertisement" 
              className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-2xl mx-auto"
            />
            
            {/* Annotations overlay */}
            <div className="heinz-annotations absolute inset-0 opacity-0">
              {/* Annotation boxes */}
              <div className="heinz-annotation-box absolute top-[20%] left-[5%] w-[25%] h-[60%] border-2 border-amber-500 rounded-lg bg-amber-500/10 flex items-end p-2">
                <span className="text-xs bg-amber-500 text-black px-2 py-1 rounded font-medium">His parents — present</span>
              </div>
              <div className="heinz-annotation-box absolute top-[20%] right-[5%] w-[20%] h-[60%] border-2 border-red-500 rounded-lg bg-red-500/10 flex items-end p-2">
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded font-medium">Her family — absent</span>
              </div>
            </div>
          </div>

          {/* Reveal text 1 - positioned below image */}
          <div className="heinz-reveal-1 w-full text-center mt-8 opacity-0">
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Most people don't. Neither did Heinz's agency. Neither did their market research.
            </p>
          </div>

          {/* Reveal text 2 */}
          <div className="heinz-reveal-2 w-full mt-8 text-center opacity-0">
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              <span className="text-amber-500 font-medium">Black bride. White groom. His parents present. Her family?</span> Absent.
              <br /><br />
              This ad ran on the London Underground. It took public backlash — not research — to flag the problem.
            </p>
          </div>

          {/* Reveal text 3 - Other examples */}
          <div className="heinz-reveal-3 w-full mt-6 text-center opacity-0">
            <p className="text-base text-white/50 max-w-2xl mx-auto">
              This happens constantly. <span className="text-white/70">Pepsi and Kendall Jenner.</span> <span className="text-white/70">Dolce & Gabbana in China.</span> <span className="text-white/70">H&M's "coolest monkey" hoodie.</span>
              <br /><br />
              Brands spend millions on market research, yet keep getting cancelled for cultural blind spots.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story Section */}
      <section ref={originRef} className="py-section px-6">
        <div className="max-w-3xl mx-auto space-y-24">
          <p className="origin-text text-2xl md:text-3xl font-light leading-relaxed">
            It started with my thesis.
          </p>
          
          <p className="origin-text text-xl md:text-2xl text-white/70 leading-relaxed">
            I researched how brands use diversity in marketing. What I found was uncomfortable: <span className="text-amber-500">most DEI efforts exist to drive sales, not change.</span>
          </p>
          
          <p className="origin-text text-xl md:text-2xl text-white/70 leading-relaxed">
            The industry's definition of "diverse"? Check if there's a Black person in the image. <span className="text-white/90">If yes, diverse. That's it.</span>
          </p>
          
          <p className="origin-text text-xl md:text-2xl text-white/70 leading-relaxed">
            DEI officers make decisions based on what <em className="text-white/90">they think</em> diversity means — not what communities actually experience.
          </p>
          
          <p className="origin-text text-3xl md:text-4xl font-medium text-amber-500">
            I wanted to change that.
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section ref={solutionRef} className="py-section px-6 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="solution-title text-headline font-bold text-center mb-16">
            What <span className="text-amber-500">Aube</span> Does
          </h2>

          {/* Flow Diagram */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0 mb-20">
            {[
              { icon: Upload, label: 'Upload Asset' },
              { icon: Globe, label: 'Select Markets', sublabel: '75+ available' },
              { icon: Cpu, label: 'AI Analysis', sublabel: '5 Frameworks' },
              { icon: Clock, label: 'Results', sublabel: '~2 minutes' },
            ].map((step, i) => (
              <div key={i} className="flex items-center">
                <div className="flow-step aube-card p-6 rounded-xl flex flex-col items-center gap-3 min-w-[140px]">
                  <step.icon className="w-8 h-8 text-amber-500" />
                  <span className="text-sm font-medium text-white">{step.label}</span>
                  {step.sublabel && <span className="text-xs text-white/50">{step.sublabel}</span>}
                </div>
                {i < 3 && (
                  <div className="flow-connector hidden md:block w-12 h-px bg-gradient-to-r from-amber-500 to-amber-500/30 origin-left" />
                )}
              </div>
            ))}
          </div>

          {/* 5 Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {dimensions.map((dim, i) => (
              <div key={i} className={`dimension-card aube-card p-6 rounded-xl bg-gradient-to-br ${dim.color}`}>
                <dim.icon className="w-6 h-6 text-amber-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{dim.title}</h3>
                <p className="text-sm text-white/60">{dim.desc}</p>
              </div>
            ))}
          </div>

          {/* Comparison */}
          <div className="solution-comparison text-center p-8 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <p className="text-lg text-white/70">
              Traditional cultural consultancies: <span className="text-white/40 line-through">weeks + thousands</span>
            </p>
            <p className="text-2xl font-semibold text-amber-500 mt-2">
              Aube: 2 minutes per market
            </p>
          </div>
        </div>
      </section>

      {/* Vibe Code Section */}
      <section ref={vibeCodeRef} className="py-section px-6">
        <div className="max-w-3xl mx-auto space-y-16">
          <p className="vibe-text text-2xl md:text-3xl font-light">
            I'm not a software engineer. I studied Strategic Marketing.
          </p>
          
          <p className="vibe-text text-xl text-white/70 leading-relaxed">
            But I knew what needed to exist. So I built it — <span className="text-amber-500">prompt by prompt, iteration by iteration.</span>
          </p>
          
          <div className="vibe-text aube-pull-quote">
            <p className="text-2xl md:text-3xl font-light leading-relaxed">
              The technical term is "vibe-coding." The reality is hundreds of hours refining AI prompts, building cultural sensitivity databases for 75+ markets, and integrating peer-reviewed frameworks into something that actually works.
            </p>
          </div>
          
          <p className="vibe-text text-xl text-white/70">
            The hardest part wasn't the code. <span className="text-white/90">It was encoding cultural nuance into logic.</span>
          </p>

          {/* Code visualization */}
          <div className="vibe-text relative rounded-xl overflow-hidden border border-amber-500/20 bg-[#0d0d0d]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
            {/* Terminal header */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-white/40 font-mono">aube_analysis.py</span>
            </div>
            {/* Code content */}
            <div className="p-6 font-mono text-sm leading-relaxed">
              <div className="text-purple-400">
                <span className="text-pink-400">def</span> <span className="text-amber-400">analyze_cultural_context</span><span className="text-white/80">(</span><span className="text-orange-300">asset</span><span className="text-white/80">):</span>
              </div>
              <div className="pl-6 mt-2">
                <span className="text-white/60">markets</span> <span className="text-pink-400">=</span> <span className="text-white/80">[</span><span className="text-green-400">"US"</span><span className="text-white/50">,</span> <span className="text-green-400">"UK"</span><span className="text-white/50">,</span> <span className="text-green-400">"DE"</span><span className="text-white/50">,</span> <span className="text-white/40">...</span><span className="text-white/80">]</span>
              </div>
              <div className="pl-6 mt-1">
                <span className="text-white/60">frameworks</span> <span className="text-pink-400">=</span> <span className="text-white/80">[</span><span className="text-cyan-400">tokenism</span><span className="text-white/50">,</span> <span className="text-cyan-400">appropriation</span><span className="text-white/50">,</span> <span className="text-white/40">...</span><span className="text-white/80">]</span>
              </div>
              <div className="pl-6 mt-1">
                <span className="text-white/60">confidence</span> <span className="text-pink-400">=</span> <span className="text-amber-400">0.85</span>
              </div>
              <div className="pl-6 mt-3">
                <span className="text-pink-400">return</span> <span className="text-amber-400">cultural_insights</span><span className="text-white/80">(</span><span className="text-orange-300">asset</span><span className="text-white/50">,</span> <span className="text-white/60">markets</span><span className="text-white/80">)</span>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section ref={showcaseRef} className="py-section px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-headline font-bold text-center mb-12">
            See It In Action
          </h2>
          
          <div className="showcase-mockup relative rounded-2xl overflow-hidden shadow-2xl shadow-amber-500/10 border border-white/10">
            <img 
              src={aubeDashboard} 
              alt="Aube Dashboard" 
              className="w-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-40" />
          </div>
          
          <div className="text-center mt-10">
            <a 
              href="https://aube-ai.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-amber-500/30"
            >
              Try Aube <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* NGO Section */}
      <section ref={ngoRef} className="py-section px-6 bg-gradient-to-b from-transparent via-amber-950/5 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-headline font-bold mb-6">
            Cultural sensitivity shouldn't be a luxury only big brands can afford.
          </h2>
          
          <p className="text-xl text-white/60 mb-12 max-w-2xl mx-auto">
            <span className="text-amber-500">Aube is free for nonprofits and NGOs.</span> Because this tool handles sensitive cultural analysis. It needs to be tested, refined, and validated by organisations whose mission is cultural sensitivity — not just their marketing budget.
          </p>

          <p className="text-lg text-white/80 mb-12">We're looking for <span className="text-amber-500 font-semibold">NGO Founding Partners.</span></p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {ngoCards.map((card, i) => (
              <div key={i} className="ngo-card aube-card p-6 rounded-xl text-left">
                <Users className="w-6 h-6 text-amber-500 mb-3" />
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-sm text-white/60">{card.desc}</p>
              </div>
            ))}
          </div>

          <a 
            href="https://aube-ai.com/ngo-apply" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-amber-500 text-amber-500 rounded-full hover:bg-amber-500 hover:text-black transition-all duration-300"
          >
            Apply for Founding Partner Access <ArrowDown className="w-4 h-4 rotate-[-90deg]" />
          </a>
        </div>
      </section>

      {/* Closing Section */}
      <section ref={closingRef} className="py-section px-6 min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-3xl">
          <h2 className="closing-text text-headline font-bold mb-12 leading-tight">
            Your next campaign is launching.<br />
            <span className="text-amber-500">Is it ready for every market?</span>
          </h2>

          <div className="closing-text flex flex-col sm:flex-row items-center justify-center gap-6">
            <a 
              href="https://aube-ai.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Try Aube <ExternalLink className="w-5 h-5" />
            </a>
            
            <button 
              onClick={() => navigateWithTransition('/')}
              className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors animated-link"
            >
              <ArrowLeft className="w-4 h-4" /> Back to portfolio
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aube;
