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
    // UNIFIED ORB - Position & Glow Animation
    // ============================================

    // Initial state
    gsap.set(core, { opacity: 0, scale: 0.5 });
    gsap.set(coreGlow, { opacity: 0, scale: 0.3 });
    gsap.set(particles, { opacity: 0 });

    // LOAD ANIMATION
    const loadTL = gsap.timeline({ delay: 0.2 });
    loadTL
      .to(core, { opacity: 1, scale: 1, duration: 1.5, ease: 'power2.out' })
      .to(coreGlow, { opacity: 0.6, scale: 1, duration: 1.2, ease: 'power2.out' }, '-=1')
      .to('.hero-char', { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: 'power2.out' }, '-=0.8')
      .to(scrollIndicatorRef.current, { opacity: 0.5, duration: 1 }, '-=0.5');

    setTimeout(() => orbContainer.classList.add('breathing'), 2000);

    // HERO - Fade out text, orb stays center
    gsap.to('.hero-name', {
      y: -100,
      opacity: 0,
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom center', scrub: 1.5 },
    });

    // POSITIONING - Move orb to top-right, slight dim
    gsap.to(orbContainer, {
      top: '25%',
      left: '75%',
      scale: 0.8,
      scrollTrigger: { trigger: '#positioning', start: 'top 80%', end: 'center center', scrub: 1.5 },
    });

    gsap.to(coreGlow, {
      opacity: 0.4,
      scrollTrigger: { trigger: '#positioning', start: 'top 80%', end: 'center center', scrub: 1.5 },
    });

    // Text reveals in positioning
    gsap.utils.toArray('.reveal-text').forEach((el, i) => {
      gsap.to(el as Element, {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: { trigger: '#positioning', start: `top ${60 - i * 10}%`, end: `top ${40 - i * 10}%`, scrub: true },
      });
    });

    gsap.to('.reveal-sub', {
      opacity: 1,
      scrollTrigger: { trigger: '#positioning', start: 'top 40%', end: 'center center', scrub: true },
    });

    // PROJECTS - THE WOAH MOMENT! Orb goes center-right, MAXIMUM GLOW
    gsap.to(orbContainer, {
      top: '50%',
      left: '80%',
      scale: 1.3,
      scrollTrigger: { trigger: '#projects', start: 'top 70%', end: 'top 20%', scrub: 1.5 },
    });

    gsap.to(core, {
      boxShadow: '0 0 120px 60px hsl(var(--primary))',
      scrollTrigger: { trigger: '#projects', start: 'top 70%', end: 'top 20%', scrub: 1.5 },
    });

    gsap.to(coreGlow, {
      opacity: 1,
      scale: 2,
      scrollTrigger: { trigger: '#projects', start: 'top 70%', end: 'top 20%', scrub: 1.5 },
    });

    // EXPERIENCE - Move orb to left side, smaller
    gsap.to(orbContainer, {
      top: '50%',
      left: '15%',
      scale: 0.6,
      scrollTrigger: { trigger: '#experience', start: 'top 70%', end: 'top 20%', scrub: 1.5 },
    });

    gsap.to(core, {
      boxShadow: '0 0 60px 30px hsl(var(--primary))',
      scrollTrigger: { trigger: '#experience', start: 'top 70%', end: 'top 20%', scrub: 1.5 },
    });

    gsap.to(coreGlow, {
      opacity: 0.5,
      scale: 1,
      scrollTrigger: { trigger: '#experience', start: 'top 70%', end: 'top 20%', scrub: 1.5 },
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

    // PHILOSOPHY - Move to center-left, medium glow
    gsap.to(orbContainer, {
      top: '50%',
      left: '30%',
      scale: 0.9,
      scrollTrigger: { trigger: '#philosophy', start: 'top 80%', end: 'center center', scrub: 1.5 },
    });

    gsap.to(coreGlow, {
      opacity: 0.7,
      scale: 1.3,
      scrollTrigger: { trigger: '#philosophy', start: 'top 80%', end: 'center center', scrub: 1.5 },
    });

    // CONTACT - Return to center, BIGGEST and BRIGHTEST
    gsap.to(orbContainer, {
      top: '50%',
      left: '50%',
      scale: 1.5,
      scrollTrigger: { trigger: '#contact', start: 'top 70%', end: 'center center', scrub: 1.5 },
    });

    gsap.to(core, {
      boxShadow: '0 0 150px 80px hsl(var(--primary))',
      scrollTrigger: { trigger: '#contact', start: 'top 70%', end: 'center center', scrub: 1.5 },
    });

    gsap.to(coreGlow, {
      opacity: 1,
      scale: 2.5,
      scrollTrigger: { trigger: '#contact', start: 'top 70%', end: 'center center', scrub: 1.5 },
    });

    // Contact text reveals
    gsap.utils.toArray('.contact-reveal').forEach((el, i) => {
      gsap.to(el as Element, {
        y: 0,
        opacity: 1,
        duration: 1,
        delay: i * 0.1,
        scrollTrigger: { trigger: '#contact', start: 'top 60%' },
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
