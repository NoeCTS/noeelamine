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
import ExperienceSection from '@/components/ExperienceSection';
import PhilosophySection from '@/components/PhilosophySection';
import ContactSection from '@/components/ContactSection';

gsap.registerPlugin(ScrollTrigger);

const Index = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const mainOrbRef = useRef<HTMLDivElement>(null);
  const purpleOrbRef = useRef<HTMLDivElement>(null);
  const blueOrbRef = useRef<HTMLDivElement>(null);
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

    // Load Animation Sequence
    const loadTL = gsap.timeline({ delay: 0.2 });

    loadTL
      .to(mainOrbRef.current, { opacity: 0.9, duration: 2, ease: 'power2.out' })
      .to('.hero-char', { opacity: 1, y: 0, stagger: 0.05, duration: 0.8, ease: 'power2.out' }, '-=1.5')
      .to(scrollIndicatorRef.current, { opacity: 0.5, duration: 1 }, '-=0.5');

    // Add breathing class after load
    setTimeout(() => {
      mainOrbRef.current?.classList.add('breathing');
    }, 2000);

    // Hero Scroll Out
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

    // Positioning Section
    gsap.to(mainOrbRef.current, {
      top: '80%',
      scale: 1.2,
      ease: 'power1.inOut',
      scrollTrigger: {
        trigger: '#positioning',
        start: 'top 70%',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

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

    // Projects Section - Orb Split
    const splitTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 80%',
        end: 'bottom 20%',
        scrub: 1,
      },
    });

    splitTL.to(mainOrbRef.current, {
      top: '30vh',
      left: '50%',
      scale: 0.8,
      opacity: 0.6,
    });

    splitTL.to([purpleOrbRef.current, blueOrbRef.current], {
      opacity: 0.8,
      scale: 0.8,
      duration: 0.5,
    }, '<');

    splitTL.to(mainOrbRef.current, {
      top: '20vh',
      left: '70%',
      opacity: 1,
      scale: 0.5,
    }, 'drift');

    splitTL.to(purpleOrbRef.current, {
      top: '45vh',
      left: '20%',
      opacity: 1,
      scale: 0.5,
    }, 'drift');

    splitTL.to(blueOrbRef.current, {
      top: '70vh',
      left: '80%',
      opacity: 1,
      scale: 0.5,
    }, 'drift');

    // Experience Section
    const expTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#experience',
        start: 'top center',
        end: 'bottom bottom',
        scrub: 1,
      },
    });

    expTL.to([purpleOrbRef.current, blueOrbRef.current], { opacity: 0, scale: 0, duration: 0.5 }, 0);
    expTL.to(
      mainOrbRef.current,
      {
        left: '24px',
        top: '30vh',
        scale: 0.15,
        opacity: 1,
        boxShadow: '0 0 20px 5px rgba(255, 159, 10, 0.8)',
        duration: 1,
      },
      0
    );

    expTL.to(mainOrbRef.current, {
      top: '80vh',
      ease: 'none',
      duration: 3,
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

    // Philosophy & Contact
    const endTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    endTL.to(mainOrbRef.current, {
      left: '50%',
      top: '50%',
      scale: 1.5,
      opacity: 1,
      boxShadow: '0 0 100px 40px rgba(255, 159, 10, 0.2)',
      duration: 1,
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

      {/* Orbs */}
      <Orb ref={mainOrbRef} className="breathing" />
      <Orb ref={purpleOrbRef} variant="purple" className="opacity-0 scale-0" />
      <Orb ref={blueOrbRef} variant="blue" className="opacity-0 scale-0" />

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
