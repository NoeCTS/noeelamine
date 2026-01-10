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

    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
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

    // Problem section - Heinz ad reveal
    const problemTl = gsap.timeline({
      scrollTrigger: {
        trigger: problemRef.current,
        start: 'top top',
        end: '+=200%',
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      }
    });

    problemTl
      .fromTo('.heinz-question', { opacity: 1 }, { opacity: 0, duration: 0.3 })
      .fromTo('.heinz-reveal-1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.3 })
      .to('.heinz-reveal-1', { opacity: 0, duration: 0.2 }, '+=0.5')
      .fromTo('.heinz-annotations', { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5 })
      .fromTo('.heinz-annotation-box', { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3, stagger: 0.15 }, '-=0.2')
      .fromTo('.heinz-reveal-2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, '+=0.3')
      .fromTo('.heinz-reveal-3', { opacity: 0 }, { opacity: 1, duration: 0.4 }, '+=0.5');

    // Origin section - staggered text reveals
    gsap.utils.toArray('.origin-text').forEach((el: any, i: number) => {
      gsap.fromTo(el, 
        { opacity: 0, y: 40 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    // Solution section - flow diagram
    const solutionTl = gsap.timeline({
      scrollTrigger: {
        trigger: solutionRef.current,
        start: 'top 60%',
        toggleActions: 'play none none reverse',
      }
    });

    solutionTl
      .fromTo('.solution-title', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.6 })
      .fromTo('.flow-step', { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 0.4, stagger: 0.15 }, '-=0.3')
      .fromTo('.flow-connector', { scaleX: 0 }, { scaleX: 1, duration: 0.3, stagger: 0.1 }, '-=0.8')
      .fromTo('.dimension-card', { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.1 }, '-=0.3')
      .fromTo('.solution-comparison', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 }, '-=0.2');

    // Vibe code section
    gsap.utils.toArray('.vibe-text').forEach((el: any) => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    // Showcase section
    gsap.fromTo('.showcase-mockup',
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: showcaseRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    // NGO section
    gsap.fromTo('.ngo-card',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        scrollTrigger: {
          trigger: ngoRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        }
      }
    );

    // Closing section
    gsap.fromTo('.closing-text',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: closingRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
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
      <section ref={problemRef} className="min-h-screen flex items-center justify-center relative px-6">
        <div className="max-w-5xl w-full">
          {/* Question overlay */}
          <div className="heinz-question absolute inset-0 flex items-center justify-center z-20">
            <p className="text-2xl md:text-4xl font-light text-center px-8">
              Do you see anything wrong with this ad?
            </p>
          </div>

          {/* The Heinz ad image */}
          <div className="relative">
            <img 
              src={heinzAdImage} 
              alt="Heinz advertisement" 
              className="w-full rounded-lg shadow-2xl"
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

          {/* Reveal text 1 */}
          <div className="heinz-reveal-1 absolute bottom-32 left-0 right-0 text-center px-8 opacity-0">
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Most people don't. Neither did Heinz's agency. Neither did their market research.
            </p>
          </div>

          {/* Reveal text 2 */}
          <div className="heinz-reveal-2 mt-12 text-center opacity-0">
            <p className="text-lg text-white/80 max-w-3xl mx-auto leading-relaxed">
              <span className="text-amber-500 font-medium">Black bride. White groom. His parents present. Her family?</span> Absent.
              <br /><br />
              This ad ran on the London Underground. It took public backlash — not research — to flag the problem.
            </p>
          </div>

          {/* Reveal text 3 - Other examples */}
          <div className="heinz-reveal-3 mt-8 text-center opacity-0">
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

          {/* Abstract code visualization */}
          <div className="vibe-text relative h-32 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 blur-2xl" />
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <pre className="text-xs text-amber-500/60 font-mono blur-[2px]">
{`analyze_cultural_context(
  markets: ["US", "UK", "DE", ...],
  frameworks: [tokenism, appropriation, ...],
  confidence_threshold: 0.85
)`}
              </pre>
            </div>
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
              href="https://aube.cx" 
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
            href="mailto:founding@aube.cx" 
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
              href="https://aube.cx" 
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
