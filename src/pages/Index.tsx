import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import GrainOverlay from '@/components/GrainOverlay';
import CustomCursor from '@/components/CustomCursor';
import Orb from '@/components/Orb';
import HeroSection from '@/components/HeroSection';
import PositioningSection from '@/components/PositioningSection';
import ProjectsSection from '@/components/ProjectsSection';
import ConceptCampaignsSection from '@/components/ConceptCampaignsSection';
import ExperienceSection from '@/components/ExperienceSection';
import EducationSection from '@/components/EducationSection';
import PhilosophySection from '@/components/PhilosophySection';
import ContactSection from '@/components/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mainOrbRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const heroNameRef = useRef<HTMLHeadingElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const positioningRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const conceptCampaignsRef = useRef<HTMLElement>(null);
  const experienceRef = useRef<HTMLElement>(null);
  const educationRef = useRef<HTMLElement>(null);
  const philosophyRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    
    // Reset orb state on mount
    if (mainOrbRef.current) {
      mainOrbRef.current.style.opacity = '0';
      mainOrbRef.current.classList.remove('breathing');
    }

    // Initialize Lenis smooth scroll (faster)
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Scroll lenis to top as well
    lenis.scrollTo(0, { immediate: true });

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

    // Split Hero Text (preserve mobile line break)
    if (heroNameRef.current) {
      const firstPart = 'NOE';
      const secondPart = 'ELAMINE';
      
      const splitChars = (str: string) => str
        .split('')
        .map((char) => `<span class="hero-char inline-block">${char}</span>`)
        .join('');
      
      heroNameRef.current.innerHTML = 
        splitChars(firstPart) + 
        '<br class="md:hidden" />' +
        '<span class="inline-block w-4 hidden md:inline-block">&nbsp;</span>' +
        splitChars(secondPart);
    }

    // Load Animation Sequence
    const loadTL = gsap.timeline({ delay: 0.2 });

    loadTL
      .to(mainOrbRef.current, { opacity: 0.9, duration: 2, ease: 'power2.out', overwrite: 'auto' })
      .to('.hero-char', { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: 'power2.out' }, '-=1.5')
      .to(scrollIndicatorRef.current, { opacity: 0.5, duration: 1 }, '-=0.5');

    // Add breathing class after load
    const breathingTimeoutId = window.setTimeout(() => {
      mainOrbRef.current?.classList.add('breathing');
    }, 2000);

    // Hero Scroll Out - fade out both text and orb
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

    // Fade out orb as hero scrolls away (before positioning section)
    ScrollTrigger.create({
      trigger: '#hero',
      start: 'center top',
      end: 'bottom top',
      scrub: 0.5,
      fastScrollEnd: true,
      onUpdate: (self) => {
        if (!mainOrbRef.current) return;

        // If the user scrolls quickly during the intro tween, ensure scroll-driven state wins.
        gsap.killTweensOf(mainOrbRef.current);
        mainOrbRef.current.classList.remove('breathing');

        const progress = Math.min(1, Math.max(0, self.progress));
        mainOrbRef.current.style.opacity = String(0.9 - progress * 0.9);
        mainOrbRef.current.style.transform = `translate(-50%, -50%) scale(${1 - progress * 0.2})`;
      },
      onLeave: () => {
        if (!mainOrbRef.current) return;
        gsap.killTweensOf(mainOrbRef.current);
        mainOrbRef.current.classList.remove('breathing');
        mainOrbRef.current.style.opacity = '0';
        mainOrbRef.current.style.transform = 'translate(-50%, -50%) scale(0.8)';
      },
      onEnterBack: () => {
        if (!mainOrbRef.current) return;
        gsap.killTweensOf(mainOrbRef.current);
        mainOrbRef.current.style.opacity = '0.9';
        mainOrbRef.current.style.transform = 'translate(-50%, -50%) scale(1)';
        mainOrbRef.current.classList.add('breathing');
      },
    });

    // Positioning Section text reveals
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

    // Contact Reveal
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
      window.clearTimeout(breathingTimeoutId);
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

      {/* Orb */}
      <Orb ref={mainOrbRef} />

      {/* Scroll Wrapper */}
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <HeroSection 
            ref={heroRef}
            nameRef={heroNameRef}
            scrollIndicatorRef={scrollIndicatorRef}
          />
          <PositioningSection ref={positioningRef} />
          <ConceptCampaignsSection ref={conceptCampaignsRef} />
          <ProjectsSection ref={projectsRef} />
          <ExperienceSection ref={experienceRef} />
          <EducationSection ref={educationRef} />
          <PhilosophySection ref={philosophyRef} />
          <ContactSection ref={contactRef} />
        </div>
      </div>
    </>
  );
};

export default Index;
