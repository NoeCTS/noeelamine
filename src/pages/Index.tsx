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

    const orb = mainOrbRef.current;
    if (!orb) return;

    // ============================================
    // THE MORPHING PATH - Animation Sequence
    // ============================================

    // PHASE 1: Load Animation - Perfect Circle Appears
    const loadTL = gsap.timeline({ delay: 0.2 });

    loadTL
      .to(orb, { 
        opacity: 0.9, 
        duration: 2, 
        ease: 'power2.out' 
      })
      .to('.hero-char', { 
        opacity: 1, 
        y: 0, 
        stagger: 0.05, 
        duration: 0.8, 
        ease: 'power2.out' 
      }, '-=1.5')
      .to(scrollIndicatorRef.current, { 
        opacity: 0.5, 
        duration: 1 
      }, '-=0.5');

    // Add breathing after load
    setTimeout(() => {
      orb.classList.add('breathing');
    }, 2000);

    // PHASE 2: Hero Scroll Out - Orb descends slightly
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

    gsap.to(orb, {
      scale: 0.9,
      top: '60%',
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom center',
        scrub: 1.5,
      },
    });

    // PHASE 3: Positioning Section - Horizontal Stretch (Rising Tension)
    gsap.to(orb, {
      scaleX: 1.4,
      scaleY: 0.7,
      top: '75%',
      opacity: 0.7,
      '--glow-intensity': 1.3,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '#positioning',
        start: 'top 80%',
        end: 'bottom center',
        scrub: 1.5,
      },
    });

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

    // PHASE 4: Projects Section - THE ARC (The Woah Moment)
    // Orb morphs into a crescent that embraces the content from the left
    const projectsTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#projects',
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      },
    });

    // Remove breathing during morph
    projectsTL.call(() => orb.classList.remove('breathing'));

    // Morph to arc shape - moves to left side, becomes crescent
    projectsTL.to(orb, {
      scaleX: 0.8,
      scaleY: 1.8,
      left: '5%',
      top: '50%',
      opacity: 0.85,
      clipPath: 'ellipse(50% 80% at 25% 50%)',
      '--glow-intensity': 2,
      ease: 'power2.inOut',
    });

    // Arc follows scroll through projects
    gsap.to(orb, {
      top: '40%',
      scrollTrigger: {
        trigger: '#projects',
        start: 'center center',
        end: 'bottom bottom',
        scrub: 1.5,
      },
    });

    // PHASE 5: Experience Section - Collapse to Beam (The Journey Line)
    const expTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#experience',
        start: 'top 70%',
        end: 'top 20%',
        scrub: 1.5,
      },
    });

    // Morph from arc to vertical beam
    expTL.to(orb, {
      scaleX: 0.08,
      scaleY: 3,
      left: '6rem',
      top: '50%',
      opacity: 1,
      clipPath: 'ellipse(100% 50% at 50% 50%)',
      borderRadius: '100px',
      '--glow-intensity': 1.5,
      ease: 'power2.inOut',
    });

    // Beam travels down as you scroll through experience
    gsap.to(orb, {
      top: '60%',
      '--glow-intensity': 2.5,
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

    // PHASE 6: Philosophy Section - The Return (Expand back to circle)
    const philoTL = gsap.timeline({
      scrollTrigger: {
        trigger: '#philosophy',
        start: 'top 80%',
        end: 'center center',
        scrub: 1.5,
      },
    });

    philoTL.to(orb, {
      scaleX: 1,
      scaleY: 1,
      scale: 1.6,
      left: '50%',
      top: '50%',
      opacity: 1,
      clipPath: 'ellipse(50% 50% at 50% 50%)',
      borderRadius: '50%',
      '--glow-intensity': 2.5,
      ease: 'power2.inOut',
    });

    // Re-add breathing in philosophy
    philoTL.call(() => orb.classList.add('breathing'));

    // PHASE 7: Contact Section - Full Glory (Maximum Scale & Glow)
    gsap.to(orb, {
      scale: 2,
      '--glow-intensity': 3,
      scrollTrigger: {
        trigger: '#contact',
        start: 'top 60%',
        end: 'center center',
        scrub: 1.5,
      },
    });

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

      {/* Single Morphing Orb */}
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
