import { forwardRef, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { usePageTransition } from './PageTransition';

const GLITCH_CHARS = '█▓▒░╔╗╚╝┃━┏┓┗┛▀▄▌▐■□▪▫';
const TEXT = 'DO YOU WORK AT NOTHING?';
const SLICE_COUNT = 6;

const NothingCTASection = forwardRef<HTMLElement>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const textRef = useRef<HTMLSpanElement>(null);
  const isHovering = useRef(false);
  const glitchLoop = useRef<gsap.core.Timeline | null>(null);
  const ctx = useRef<gsap.Context | null>(null);
  const { navigateWithTransition } = usePageTransition();

  // Character scramble effect
  const scrambleText = useCallback((element: HTMLSpanElement, duration: number = 0.3) => {
    const originalText = TEXT;
    const chars = originalText.split('');
    let iteration = 0;
    const totalIterations = duration * 60;

    const interval = setInterval(() => {
      element.textContent = chars
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) return originalText[index];
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join('');

      iteration += chars.length / totalIterations;

      if (iteration >= chars.length) {
        element.textContent = originalText;
        clearInterval(interval);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  // Create random micro-glitch burst
  const microGlitch = useCallback(() => {
    if (!isHovering.current || !ctx.current) return;

    const slices = slicesRef.current.filter(Boolean) as HTMLSpanElement[];
    
    ctx.current.add(() => {
      slices.forEach((slice, i) => {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const intensity = Math.random() * 15 + 5;
        
        gsap.to(slice, {
          x: direction * intensity,
          skewX: (Math.random() - 0.5) * 10,
          duration: 0.05,
          ease: 'power4.out',
          onComplete: () => {
            gsap.to(slice, {
              x: 0,
              skewX: 0,
              duration: 0.08,
              ease: 'power2.out',
            });
          },
        });

        if (Math.random() > 0.5) {
          gsap.to(slice, {
            textShadow: `${direction * 3}px 0 #ff0040, ${-direction * 3}px 0 #00ffff`,
            duration: 0.05,
            onComplete: () => {
              gsap.to(slice, {
                textShadow: 'none',
                duration: 0.1,
              });
            },
          });
        }
      });

      if (containerRef.current && Math.random() > 0.7) {
        gsap.to(containerRef.current, {
          opacity: 0.7,
          scale: 1.01,
          duration: 0.03,
          onComplete: () => {
            gsap.to(containerRef.current, {
              opacity: 1,
              scale: 1,
              duration: 0.05,
            });
          },
        });
      }
    });

    if (isHovering.current) {
      const delay = Math.random() * 400 + 150;
      setTimeout(microGlitch, delay);
    }
  }, []);

  // Initial violent burst on hover
  const triggerEntryBurst = useCallback(() => {
    if (!ctx.current) return;

    const slices = slicesRef.current.filter(Boolean) as HTMLSpanElement[];
    
    ctx.current.add(() => {
      gsap.killTweensOf(slices);
      gsap.killTweensOf(containerRef.current);

      gsap.to(containerRef.current, {
        x: 'random(-5, 5)',
        y: 'random(-2, 2)',
        duration: 0.15,
        ease: 'power4.out',
        repeat: 2,
        yoyo: true,
        onComplete: () => {
          gsap.set(containerRef.current, { x: 0, y: 0 });
        },
      });

      slices.forEach((slice, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        
        gsap.fromTo(slice, 
          { 
            x: direction * (30 + Math.random() * 20),
            skewX: direction * 15,
            opacity: 0.6,
          },
          {
            x: 0,
            skewX: 0,
            opacity: 1,
            duration: 0.25,
            delay: i * 0.02,
            ease: 'power3.out',
          }
        );

        gsap.fromTo(slice,
          { textShadow: `${direction * 8}px 0 #ff0040, ${-direction * 8}px 0 #00ffff` },
          { textShadow: 'none', duration: 0.3, delay: 0.1 }
        );
      });

      if (textRef.current) {
        scrambleText(textRef.current, 0.4);
      }
    });
  }, [scrambleText]);

  // Exit animation
  const triggerExitBurst = useCallback(() => {
    if (!ctx.current) return;

    const slices = slicesRef.current.filter(Boolean) as HTMLSpanElement[];
    
    ctx.current.add(() => {
      slices.forEach((slice, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        
        gsap.to(slice, {
          x: direction * 10,
          duration: 0.05,
          onComplete: () => {
            gsap.to(slice, {
              x: 0,
              textShadow: 'none',
              skewX: 0,
              duration: 0.15,
              ease: 'power2.out',
            });
          },
        });
      });
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    isHovering.current = true;
    triggerEntryBurst();
    setTimeout(microGlitch, 300);
  }, [triggerEntryBurst, microGlitch]);

  const handleMouseLeave = useCallback(() => {
    isHovering.current = false;
    triggerExitBurst();
  }, [triggerExitBurst]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigateWithTransition('/nothing');
  }, [navigateWithTransition]);

  useEffect(() => {
    ctx.current = gsap.context(() => {});
    
    return () => {
      ctx.current?.revert();
      if (glitchLoop.current) {
        glitchLoop.current.kill();
      }
    };
  }, []);

  const getSliceStyle = (index: number): React.CSSProperties => {
    const sliceHeight = 100 / SLICE_COUNT;
    return {
      clipPath: `inset(${index * sliceHeight}% 0 ${100 - (index + 1) * sliceHeight}% 0)`,
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      willChange: 'transform',
    };
  };

  return (
    <section ref={ref} id="nothing-cta" className="relative py-24 md:py-32 w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <button 
          onClick={handleClick}
          className="group block w-full max-w-3xl mx-auto text-left"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            ref={containerRef}
            className="relative border border-secondary/30 hover:border-secondary/60 transition-colors duration-500 px-8 py-12 md:px-16 md:py-16 overflow-hidden"
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Scanline overlay */}
            <div 
              className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                animation: 'scanlines 8s linear infinite',
              }}
            />

            {/* Glitch slices container */}
            <div className="relative h-[2em] md:h-[2.5em] flex items-center justify-center">
              {Array.from({ length: SLICE_COUNT }).map((_, i) => (
                <span
                  key={i}
                  ref={(el) => (slicesRef.current[i] = el)}
                  className="text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-secondary group-hover:text-foreground transition-colors duration-500 whitespace-nowrap"
                  style={getSliceStyle(i)}
                  aria-hidden="true"
                >
                  {TEXT}
                </span>
              ))}
              
              <span 
                ref={textRef}
                className="text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-secondary group-hover:text-foreground transition-colors duration-500 opacity-0 pointer-events-none whitespace-nowrap"
              >
                {TEXT}
              </span>
            </div>

            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-secondary/40 group-hover:border-foreground/60 transition-colors duration-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-secondary/40 group-hover:border-foreground/60 transition-colors duration-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-secondary/40 group-hover:border-foreground/60 transition-colors duration-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-secondary/40 group-hover:border-foreground/60 transition-colors duration-500" />
          </div>
        </button>
      </div>

      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
      `}</style>
    </section>
  );
});

NothingCTASection.displayName = 'NothingCTASection';

export default NothingCTASection;
