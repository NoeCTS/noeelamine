import { forwardRef, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { usePageTransition } from './PageTransition';

const TEXT = 'BECOME NATURE';
const PETAL_COUNT = 24;

const PangaiaCTASection = forwardRef<HTMLElement>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const petalsRef = useRef<(HTMLDivElement | null)[]>([]);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const isHovering = useRef(false);
  const ctx = useRef<gsap.Context | null>(null);
  const breatheAnim = useRef<gsap.core.Tween | null>(null);
  const { navigateWithTransition } = usePageTransition();

  // Organic wave effect on letters
  const startBreathing = useCallback(() => {
    if (!ctx.current) return;

    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];
    
    ctx.current.add(() => {
      breatheAnim.current = gsap.to(letters, {
        y: (i) => Math.sin(i * 0.5) * 3,
        duration: 2,
        ease: 'sine.inOut',
        stagger: {
          each: 0.1,
          repeat: -1,
          yoyo: true,
        },
      });
    });
  }, []);

  // Bloom effect on hover
  const triggerBloom = useCallback(() => {
    if (!ctx.current) return;

    const petals = petalsRef.current.filter(Boolean) as HTMLDivElement[];
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

    ctx.current.add(() => {
      // Kill breathing animation
      breatheAnim.current?.kill();

      // Letters bloom outward slightly with color shift
      gsap.to(letters, {
        scale: 1.05,
        color: '#8B9A7A',
        textShadow: '0 0 20px rgba(139, 154, 122, 0.5)',
        duration: 0.4,
        ease: 'power2.out',
        stagger: {
          each: 0.03,
          from: 'center',
        },
      });

      // Petals burst outward
      petals.forEach((petal, i) => {
        const angle = (i / petals.length) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;
        const rotationEnd = Math.random() * 360;

        gsap.fromTo(petal,
          {
            x: 0,
            y: 0,
            scale: 0,
            rotation: 0,
            opacity: 0,
          },
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            scale: 0.8 + Math.random() * 0.4,
            rotation: rotationEnd,
            opacity: 0.8,
            duration: 0.8 + Math.random() * 0.4,
            ease: 'power2.out',
          }
        );
      });

      // Continuous floating while hovering
      petals.forEach((petal, i) => {
        gsap.to(petal, {
          y: `+=${Math.sin(i) * 10}`,
          x: `+=${Math.cos(i) * 5}`,
          rotation: `+=${Math.random() * 20 - 10}`,
          duration: 2 + Math.random(),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
          delay: i * 0.1,
        });
      });

      // Container subtle glow
      gsap.to(containerRef.current, {
        boxShadow: '0 0 60px rgba(139, 154, 122, 0.3), inset 0 0 30px rgba(139, 154, 122, 0.1)',
        borderColor: 'rgba(139, 154, 122, 0.6)',
        duration: 0.5,
      });
    });
  }, []);

  // Settle effect on leave
  const triggerSettle = useCallback(() => {
    if (!ctx.current) return;

    const petals = petalsRef.current.filter(Boolean) as HTMLDivElement[];
    const letters = lettersRef.current.filter(Boolean) as HTMLSpanElement[];

    ctx.current.add(() => {
      // Kill all petal animations
      petals.forEach(petal => gsap.killTweensOf(petal));

      // Petals float down and fade
      petals.forEach((petal, i) => {
        gsap.to(petal, {
          y: '+=30',
          opacity: 0,
          scale: 0.5,
          rotation: '+=45',
          duration: 0.6,
          ease: 'power2.in',
          delay: i * 0.02,
        });
      });

      // Letters return to normal
      gsap.to(letters, {
        scale: 1,
        color: 'rgba(245, 240, 232, 0.6)',
        textShadow: 'none',
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });

      // Container reset
      gsap.to(containerRef.current, {
        boxShadow: 'none',
        borderColor: 'rgba(139, 154, 122, 0.3)',
        duration: 0.4,
      });

      // Restart breathing after a moment
      setTimeout(() => {
        if (!isHovering.current) {
          startBreathing();
        }
      }, 500);
    });
  }, [startBreathing]);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    triggerBloom();
  }, [triggerBloom]);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    triggerSettle();
  }, [triggerSettle]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTransition('/pangaia');
  }, [navigateWithTransition]);

  useEffect(() => {
    ctx.current = gsap.context(() => {});
    startBreathing();

    return () => {
      ctx.current?.revert();
      breatheAnim.current?.kill();
    };
  }, [startBreathing]);

  // Generate petal shapes
  const getPetalStyle = (index: number): React.CSSProperties => {
    const colors = ['#8B9A7A', '#6B7A5A', '#A5B495', '#4A5A3A', '#C5D4B5'];
    const shapes = [
      'ellipse(50% 30% at 50% 50%)',
      'ellipse(40% 50% at 50% 50%)',
      'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
    ];
    
    return {
      position: 'absolute',
      width: `${8 + Math.random() * 8}px`,
      height: `${12 + Math.random() * 10}px`,
      backgroundColor: colors[index % colors.length],
      clipPath: shapes[index % shapes.length],
      opacity: 0,
      pointerEvents: 'none',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    };
  };

  return (
    <section ref={ref} id="pangaia-cta" className="relative py-24 md:py-32 w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <button
          onClick={handleClick}
          className="group block w-full max-w-3xl mx-auto text-left"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={containerRef}
            className="relative border px-8 py-12 md:px-16 md:py-16 overflow-hidden transition-colors duration-500"
            style={{
              borderColor: 'rgba(139, 154, 122, 0.3)',
              backgroundColor: 'rgba(26, 47, 26, 0.3)',
              willChange: 'transform, box-shadow',
            }}
          >
            {/* Organic texture overlay */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: `radial-gradient(circle at 20% 30%, rgba(139, 154, 122, 0.3) 0%, transparent 50%),
                                  radial-gradient(circle at 80% 70%, rgba(139, 154, 122, 0.2) 0%, transparent 50%)`,
              }}
            />

            {/* Floating petals container */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-visible">
              {Array.from({ length: PETAL_COUNT }).map((_, i) => (
                <div
                  key={i}
                  ref={(el) => (petalsRef.current[i] = el)}
                  style={getPetalStyle(i)}
                />
              ))}
            </div>

            {/* Main text */}
            <div className="relative flex items-center justify-center">
              <h2
                ref={textRef}
                className="text-xl md:text-2xl lg:text-3xl font-light tracking-[0.3em] uppercase text-center"
                style={{ color: 'rgba(245, 240, 232, 0.6)', fontFamily: "'Georgia', serif" }}
              >
                {TEXT.split('').map((char, i) => (
                  <span
                    key={i}
                    ref={(el) => (lettersRef.current[i] = el)}
                    className="inline-block"
                    style={{ willChange: 'transform' }}
                  >
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                ))}
              </h2>
            </div>

            {/* Corner vines */}
            <svg className="absolute top-0 left-0 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500" viewBox="0 0 48 48">
              <path
                d="M0 24 Q12 24 12 12 Q12 0 24 0"
                fill="none"
                stroke="#8B9A7A"
                strokeWidth="1"
                className="origin-top-left"
              />
              <circle cx="24" cy="0" r="2" fill="#8B9A7A" />
            </svg>
            <svg className="absolute top-0 right-0 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500 rotate-90" viewBox="0 0 48 48">
              <path
                d="M0 24 Q12 24 12 12 Q12 0 24 0"
                fill="none"
                stroke="#8B9A7A"
                strokeWidth="1"
              />
              <circle cx="24" cy="0" r="2" fill="#8B9A7A" />
            </svg>
            <svg className="absolute bottom-0 left-0 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500 -rotate-90" viewBox="0 0 48 48">
              <path
                d="M0 24 Q12 24 12 12 Q12 0 24 0"
                fill="none"
                stroke="#8B9A7A"
                strokeWidth="1"
              />
              <circle cx="24" cy="0" r="2" fill="#8B9A7A" />
            </svg>
            <svg className="absolute bottom-0 right-0 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500 rotate-180" viewBox="0 0 48 48">
              <path
                d="M0 24 Q12 24 12 12 Q12 0 24 0"
                fill="none"
                stroke="#8B9A7A"
                strokeWidth="1"
              />
              <circle cx="24" cy="0" r="2" fill="#8B9A7A" />
            </svg>
          </div>
        </button>
      </div>
    </section>
  );
});

PangaiaCTASection.displayName = 'PangaiaCTASection';

export default PangaiaCTASection;
