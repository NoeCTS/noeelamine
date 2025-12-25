import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface OrbJourneyProps {
  className?: string;
}

export interface OrbJourneyRef {
  orbRef: React.RefObject<HTMLDivElement>;
  particlesRef: React.RefObject<HTMLDivElement>;
  reset: () => void;
}

const PARTICLE_COUNT = 60;

const OrbJourney = forwardRef<OrbJourneyRef, OrbJourneyProps>((_, ref) => {
  const orbRef = useRef<HTMLDivElement>(null);
  const companionOrbRef = useRef<HTMLDivElement>(null);
  const particlesContainerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);
  const contextRef = useRef<gsap.Context | null>(null);

  const reset = () => {
    if (orbRef.current) {
      orbRef.current.style.opacity = '0';
      orbRef.current.classList.remove('breathing');
    }
    if (companionOrbRef.current) {
      companionOrbRef.current.style.opacity = '0';
    }
    particlesRef.current.forEach(p => {
      if (p) p.style.opacity = '0';
    });
  };

  useImperativeHandle(ref, () => ({
    orbRef,
    particlesRef: particlesContainerRef,
    reset,
  }));

  useEffect(() => {
    if (!orbRef.current || !companionOrbRef.current || !particlesContainerRef.current) return;

    const ctx = gsap.context(() => {
      const orb = orbRef.current!;
      const companionOrb = companionOrbRef.current!;
      const particles = particlesRef.current;

      // Initialize particles positions (clustered at orb center)
      particles.forEach((p, i) => {
        if (!p) return;
        const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
        const radius = Math.random() * 20;
        gsap.set(p, {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius,
          scale: 0.5 + Math.random() * 0.5,
          opacity: 0,
        });
      });

      // ===== PHASE 1: Hero Orb Behavior =====
      // Load animation - fade in orb
      gsap.timeline({ delay: 0.2 })
        .to(orb, { opacity: 0.9, duration: 2, ease: 'power2.out' });

      // Breathing after load
      const breathingTimeout = setTimeout(() => {
        orb.classList.add('breathing');
      }, 2000);

      // Hero scroll out - shrink and fade main orb
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'center top',
        end: 'bottom top',
        scrub: 0.5,
        onUpdate: (self) => {
          gsap.killTweensOf(orb);
          orb.classList.remove('breathing');
          const progress = self.progress;
          orb.style.opacity = String(0.9 - progress * 0.9);
          orb.style.transform = `translate(-50%, -50%) scale(${1 - progress * 0.3})`;
        },
        onLeave: () => {
          orb.classList.remove('breathing');
          orb.style.opacity = '0';
        },
        onEnterBack: () => {
          orb.style.opacity = '0.9';
          orb.style.transform = 'translate(-50%, -50%) scale(1)';
          orb.classList.add('breathing');
        },
      });

      // ===== PHASE 2: Companion Orb (Projects) =====
      // After hero, show companion orb on left side
      ScrollTrigger.create({
        trigger: '#positioning',
        start: 'top 80%',
        end: 'top 20%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          companionOrb.style.opacity = String(progress * 0.7);
          companionOrb.style.transform = `translateY(-50%) scale(${0.3 + progress * 0.3})`;
        },
      });

      // Project cards pulse the companion orb
      const projectCards = document.querySelectorAll('.project-card');
      projectCards.forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => {
            gsap.to(companionOrb, {
              scale: 1.3,
              filter: 'blur(0.5px) brightness(1.2)',
              duration: 0.6,
              ease: 'power2.out',
            });
          },
          onLeave: () => {
            gsap.to(companionOrb, {
              scale: 1,
              filter: 'blur(0.5px) brightness(1)',
              duration: 0.4,
              ease: 'power2.inOut',
            });
          },
          onEnterBack: () => {
            gsap.to(companionOrb, {
              scale: 1.3,
              filter: 'blur(0.5px) brightness(1.2)',
              duration: 0.6,
              ease: 'power2.out',
            });
          },
          onLeaveBack: () => {
            gsap.to(companionOrb, {
              scale: 1,
              filter: 'blur(0.5px) brightness(1)',
              duration: 0.4,
              ease: 'power2.inOut',
            });
          },
        });
      });

      // ===== PHASE 3: Philosophy Explosion =====
      // Hide companion orb approaching philosophy
      ScrollTrigger.create({
        trigger: '#philosophy',
        start: 'top 100%',
        end: 'top 50%',
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          companionOrb.style.opacity = String(0.7 * (1 - progress));
        },
      });

      // Particle explosion in philosophy section
      const philosophyQuote = document.querySelector('.philo-quote');
      if (philosophyQuote) {
        // Calculate positions for particles to form around the text
        const getTargetPositions = () => {
          const rect = philosophyQuote.getBoundingClientRect();
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          
          return particles.map((_, i) => {
            // Create an arc/halo around the text
            const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
            const radiusX = rect.width / 2 + 80 + Math.random() * 60;
            const radiusY = rect.height / 2 + 60 + Math.random() * 40;
            return {
              x: centerX + Math.cos(angle) * radiusX - 8,
              y: centerY + Math.sin(angle) * radiusY - 8,
            };
          });
        };

        ScrollTrigger.create({
          trigger: '#philosophy',
          start: 'top 60%',
          end: 'center center',
          scrub: 1.5,
          onUpdate: (self) => {
            const progress = self.progress;
            const targetPositions = getTargetPositions();
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            particles.forEach((p, i) => {
              if (!p) return;
              const target = targetPositions[i];
              // Explode from center to target positions
              const explosionProgress = gsap.parseEase('power2.out')(progress);
              const x = centerX + (target.x - centerX) * explosionProgress;
              const y = centerY + (target.y - centerY) * explosionProgress;
              
              p.style.opacity = String(progress * 0.8);
              p.style.transform = `translate(${x - centerX}px, ${y - centerY}px) scale(${0.5 + progress * 0.5})`;
            });
          },
        });

        // Gentle float animation for particles when in view
        ScrollTrigger.create({
          trigger: '#philosophy',
          start: 'center center',
          end: 'bottom top',
          onEnter: () => {
            particles.forEach((p, i) => {
              if (!p) return;
              gsap.to(p, {
                y: `+=${Math.sin(i) * 15}`,
                x: `+=${Math.cos(i) * 10}`,
                duration: 3 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
              });
            });
          },
          onLeaveBack: () => {
            particles.forEach((p) => {
              if (p) gsap.killTweensOf(p);
            });
          },
        });
      }

      // ===== PHASE 4: Contact Reformation =====
      ScrollTrigger.create({
        trigger: '#contact',
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1.5,
        onUpdate: (self) => {
          const progress = self.progress;
          const centerX = window.innerWidth / 2;
          const contactSection = document.querySelector('#contact');
          const emailLink = contactSection?.querySelector('a[href^="mailto"]');
          
          if (emailLink) {
            const rect = emailLink.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;
            
            particles.forEach((p, i) => {
              if (!p) return;
              // Converge particles behind the email
              const currentTransform = p.style.transform;
              const match = currentTransform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
              if (match) {
                const currentX = parseFloat(match[1]) + centerX;
                const currentY = parseFloat(match[2]) + window.innerHeight / 2;
                
                const convergeProgress = gsap.parseEase('power2.inOut')(progress);
                const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
                const radius = 40 + Math.random() * 30;
                const finalX = targetX + Math.cos(angle) * radius * (1 - convergeProgress * 0.5);
                const finalY = targetY + Math.sin(angle) * radius * (1 - convergeProgress * 0.5);
                
                const x = currentX + (finalX - currentX) * convergeProgress;
                const y = currentY + (finalY - currentY) * convergeProgress;
                
                p.style.opacity = String(0.8 - progress * 0.3);
                p.style.transform = `translate(${x - centerX}px, ${y - window.innerHeight / 2}px) scale(${1 - progress * 0.3})`;
              }
            });
          }
        },
      });

      return () => {
        clearTimeout(breathingTimeout);
      };
    });

    contextRef.current = ctx;

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <>
      {/* Main Hero Orb */}
      <div 
        ref={orbRef}
        className="orb"
        style={{ opacity: 0 }}
      />
      
      {/* Companion Orb (follows on left side) */}
      <div 
        ref={companionOrbRef}
        className="companion-orb"
        style={{ opacity: 0 }}
      />
      
      {/* Particles Container */}
      <div 
        ref={particlesContainerRef}
        className="particles-container"
      >
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => { if (el) particlesRef.current[i] = el; }}
            className="particle"
            style={{
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
    </>
  );
});

OrbJourney.displayName = 'OrbJourney';

export default OrbJourney;
