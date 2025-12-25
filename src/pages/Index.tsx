import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import GrainOverlay from '@/components/GrainOverlay';
import CustomCursor from '@/components/CustomCursor';
import OrbJourney, { OrbJourneyRef } from '@/components/OrbJourney';
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
  const orbJourneyRef = useRef<OrbJourneyRef>(null);
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
    orbJourneyRef.current?.reset();

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

    // Load Animation Sequence (hero text only - orb handled by OrbJourney)
    const loadTL = gsap.timeline({ delay: 0.5 });

    loadTL
      .to('.hero-char', { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: 'power2.out' }, '+=1.2')
      .to(scrollIndicatorRef.current, { opacity: 0.5, duration: 1 }, '-=0.3');

    // Hero Scroll Out - fade out text
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

      {/* Orb Journey - handles all orb states */}
      <OrbJourney ref={orbJourneyRef} />

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
          <ConceptCampaignsSection ref={conceptCampaignsRef} />
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
