import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import GrainOverlay from '@/components/GrainOverlay';
import CustomCursor from '@/components/CustomCursor';
import ParticleOrb from '@/components/ParticleOrb';
import HeroSection from '@/components/HeroSection';
import PositioningSection from '@/components/PositioningSection';
import ProjectsSection from '@/components/ProjectsSection';
import ExperienceSection from '@/components/ExperienceSection';
import PhilosophySection from '@/components/PhilosophySection';
import ContactSection from '@/components/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const particleOrbRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const positioningRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Custom Cursor
    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        gsap.to(cursorRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
          ease: 'power2.out',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cursor hover effect
    const links = document.querySelectorAll('a, .project-card');
    links.forEach((link) => {
      link.addEventListener('mouseenter', () => {
        cursorRef.current?.classList.add('hovering');
      });
      link.addEventListener('mouseleave', () => {
        cursorRef.current?.classList.remove('hovering');
      });
    });

    // Split Hero Text
    if (heroNameRef.current) {
      const text = heroNameRef.current.textContent?.trim() || '';
      heroNameRef.current.innerHTML = text
        .split('')
        .map((char) => {
          if (char === ' ') return '<span class="inline-block w-4">&nbsp;</span>';
          return `<span class="hero-char inline-block">${char}</span>`;
        })
        .join('');
    }

    const orbContainer = particleOrbRef.current;
    if (!orbContainer) return;

    const core = orbContainer.querySelector('.particle-core') as HTMLElement;
    const coreGlow = orbContainer.querySelector('.particle-core-glow') as HTMLElement;
    const particles = orbContainer.querySelectorAll('.particle');

    // ============================================
    // THE PARTICLE DISPERSION - Animation Sequence
    // ============================================

    // PHASE 1: Load Animation - Particles Clustered (Solid Orb Appearance)
    const loadTL = gsap.timeline({ delay: 0.2 });

    // Initial state - all particles at center, invisible
    gsap.set(particles, {
      opacity: 0,
      x: 0,
      y: 0,
    });

    gsap.set(core, { opacity: 0, scale: 0.5 });
    gsap.set(coreGlow, { opacity: 0, scale: 0.3 });

    loadTL
      // Core fades in
      .to(core, { 
        opacity: 1, 
        scale: 1,
        duration: 1.5, 
        ease: 'power2.out' 
      })
      .to(coreGlow, { 
        opacity: 0.6, 
        scale: 1,
        duration: 1.2, 
        ease: 'power2.out' 
      }, '-=1')
      // Hero text reveals
      .to('.hero-char', { 
        opacity: 1, 
        y: 0, 
        stagger: 0.05, 
        duration: 0.8, 
        ease: 'power2.out' 
      }, '-=0.8')
      .to(scrollIndicatorRef.current, { 
        opacity: 0.5, 
        duration: 1 
      }, '-=0.5');

    // Add breathing after load
    setTimeout(() => {
      orbContainer.classList.add('breathing');
    }, 2000);

    // PHASE 2: Hero Scroll - Subtle movement
    gsap.to('.hero-name', {
      y: -100,
      opacity: 0,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom center',
        scrub: 1.5,
      },
    });

    gsap.to(orbContainer, {
      y: 50,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom center',
        scrub: 1.5,
      },
    });

    // PHASE 3: Positioning Section - Particles Start Vibrating/Separating
    const positioningTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#positioning',
        start: 'top 80%',
        end: 'bottom center',
        scrub: 1.5,
      },
    });

    // Core shrinks slightly, particles begin appearing at edges
    positioningTL.to(core, {
      scale: 0.85,
      opacity: 0.9,
      ease: 'power2.inOut',
    });

    // Particles start appearing and separating slightly
    positioningTL.to(particles, {
      opacity: (i) => 0.3 + Math.random() * 0.3,
      x: (i) => Math.cos((i / 60) * Math.PI * 2) * (30 + Math.random() * 20),
      y: (i) => Math.sin((i / 60) * Math.PI * 2) * (30 + Math.random() * 20),
      stagger: {
        each: 0.01,
        from: 'random',
      },
      ease: 'power2.out',
    }, '<');

    // Text reveals in positioning
    gsap.utils.toArray('.reveal-text').forEach((el, i) => {
      gsap.to(el as Element, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '#positioning',
          start: `top ${60 - i * 10}%`,
          end: `top ${40 - i * 10}%`,
          scrub: true,
        },
      });
    });

    gsap.to('.reveal-sub', {
      opacity: 1,
      scrollTrigger: {
        trigger: '#positioning',
        start: 'top 40%',
        end: 'center center',
        scrub: true,
      },
    });

    // PHASE 4: Projects Section - THE FULL DISPERSION (The Woah Moment!)
    const projectsTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 70%',
        end: 'top 10%',
        scrub: 1.5,
        onEnter: () => orbContainer.classList.remove('breathing'),
        onLeaveBack: () => orbContainer.classList.add('breathing'),
      },
    });

    // Core fades and shrinks
    projectsTL.to(core, {
      scale: 0.2,
      opacity: 0,
      ease: 'power2.inOut',
    });

    projectsTL.to(coreGlow, {
      scale: 0.3,
      opacity: 0,
      ease: 'power2.inOut',
    }, '<');

    // FULL PARTICLE EXPLOSION!
    projectsTL.to(particles, {
      opacity: (i) => 0.5 + Math.random() * 0.5,
      x: (i) => {
        const angle = (i / 60) * Math.PI * 2;
        const distance = 150 + Math.random() * 250;
        return Math.cos(angle + (Math.random() - 0.5) * 0.5) * distance;
      },
      y: (i) => {
        const angle = (i / 60) * Math.PI * 2;
        const distance = 150 + Math.random() * 250;
        return Math.sin(angle + (Math.random() - 0.5) * 0.5) * distance;
      },
      scale: (i) => 0.8 + Math.random() * 0.8,
      stagger: {
        each: 0.02,
        from: 'center',
      },
      ease: 'power3.out',
    }, '<0.1');

    // Particles drift while in projects section
    gsap.to(particles, {
      x: (i, target) => {
        const current = gsap.getProperty(target, 'x') as number;
        return current + (Math.random() - 0.5) * 100;
      },
      y: (i, target) => {
        const current = gsap.getProperty(target, 'y') as number;
        return current + 50 + Math.random() * 50;
      },
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 10%',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    // PHASE 5: Experience Section - Particles Stream to Timeline
    const expTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#experience',
        start: 'top 70%',
        end: 'top 20%',
        scrub: 1.5,
      },
    });

    // Particles stream to the left and form vertical constellation
    expTL.to(particles, {
      x: () => -window.innerWidth * 0.35 + (Math.random() - 0.5) * 60,
      y: (i) => -200 + (i / 60) * 500,
      opacity: (i) => 0.3 + (i % 5 === 0 ? 0.5 : 0),
      scale: (i) => (i % 5 === 0 ? 1.2 : 0.6),
      stagger: {
        each: 0.01,
        from: 'start',
      },
      ease: 'power2.inOut',
    });

    // Particles flow down with experience scroll
    gsap.to(particles, {
      y: '+=300',
      scrollTrigger: {
        trigger: '#experience',
        start: 'top 20%',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    // Timeline item activation
    document.querySelectorAll('.exp-item').forEach((item) => {
      ScrollTrigger.create({
        trigger: item,
        start: 'top 60%',
        end: 'bottom 40%',
        toggleActions: 'play reverse play reverse',
        onEnter: () => {
          item.querySelector('.timeline-year')?.classList.add('active');
          item.querySelector('.timeline-content')?.classList.add('active');
        },
        onLeave: () => {
          item.querySelector('.timeline-year')?.classList.remove('active');
          item.querySelector('.timeline-content')?.classList.remove('active');
        },
        onEnterBack: () => {
          item.querySelector('.timeline-year')?.classList.add('active');
          item.querySelector('.timeline-content')?.classList.add('active');
        },
        onLeaveBack: () => {
          item.querySelector('.timeline-year')?.classList.remove('active');
          item.querySelector('.timeline-content')?.classList.remove('active');
        },
      });
    });

    // PHASE 6: Philosophy Section - The Convergence (Particles Spiral Inward)
    const philoTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      },
    });

    // Particles spiral back toward center
    philoTL.to(particles, {
      x: (i) => Math.cos((i / 60) * Math.PI * 4) * (40 + Math.random() * 30),
      y: (i) => Math.sin((i / 60) * Math.PI * 4) * (40 + Math.random() * 30),
      opacity: 0.6,
      scale: 1,
      stagger: {
        each: 0.015,
        from: 'edges',
      },
      ease: 'power2.inOut',
    });

    // Core begins reappearing
    philoTL.to(core, {
      scale: 0.8,
      opacity: 0.7,
      ease: 'power2.inOut',
    }, '<0.3');

    philoTL.to(coreGlow, {
      scale: 0.9,
      opacity: 0.4,
      ease: 'power2.inOut',
    }, '<');

    // PHASE 7: Contact Section - Full Reformation (Triumphant Return)
    const contactTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 70%',
        end: 'center center',
        scrub: 1.5,
        onEnter: () => {
          setTimeout(() => orbContainer.classList.add('breathing'), 500);
        },
        onLeaveBack: () => orbContainer.classList.remove('breathing'),
      },
    });

    // Particles collapse to center
    contactTL.to(particles, {
      x: 0,
      y: 0,
      opacity: 0,
      scale: 0.5,
      stagger: {
        each: 0.01,
        from: 'edges',
      },
      ease: 'power3.inOut',
    });

    // Core returns BIGGER and BRIGHTER
    contactTL.to(core, {
      scale: 1.4,
      opacity: 1,
      ease: 'power2.out',
    }, '<0.2');

    contactTL.to(coreGlow, {
      scale: 1.6,
      opacity: 0.8,
      ease: 'power2.out',
    }, '<');

    // Contact text reveals
    gsap.utils.toArray('.contact-reveal').forEach((el, i) => {
      gsap.to(el as Element, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: i * 0.1,
        scrollTrigger: {
          trigger: '#contact',
          start: 'top 60%',
        },
      });
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {/* Global Elements */}
      <GrainOverlay />
      <CustomCursor cursorRef={cursorRef} />

      {/* Particle Orb System */}
      <ParticleOrb ref={particleOrbRef} particleCount={60} />

      {/* Scroll Wrapper */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <HeroSection 
            ref={heroRef}
            nameRef={heroNameRef}
            scrollIndicatorRef={scrollIndicatorRef}
          />
          <PositioningSection ref={positioningRef} />
          <ProjectsSection ref={projectsRef} />
          <ExperienceSection ref={experienceRef} />
          <PhilosophySection ref={philosophyRef} />
          <ContactSection ref={contactRef} />
        </div>
      </div>
    </>
  );
};

export default Index;
