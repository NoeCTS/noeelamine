import { forwardRef, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { usePageTransition } from './PageTransition';

const GLITCH_CHARS = '█▓▒░╔╗╚╝┃━┏┓┗┛▀▄▌▐■□▪▫';
const NOTHING_TEXT = 'NOTHING';
const PANGAIA_TEXT = 'PANGAIA';
const SLICE_COUNT = 6;
const PETAL_COUNT = 24;

const ConceptCampaignsSection = forwardRef<HTMLElement>((_, ref) => {
  const { navigateWithTransition } = usePageTransition();

  // Nothing refs
  const nothingContainerRef = useRef<HTMLDivElement>(null);
  const nothingSlicesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const nothingTextRef = useRef<HTMLSpanElement>(null);
  const nothingHovering = useRef(false);
  const nothingCtx = useRef<gsap.Context | null>(null);

  // Pangaia refs
  const pangaiaContainerRef = useRef<HTMLDivElement>(null);
  const pangaiaPetalsRef = useRef<(HTMLDivElement | null)[]>([]);
  const pangaiaLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const pangaiaHovering = useRef(false);
  const pangaiaCtx = useRef<gsap.Context | null>(null);
  const pangaiaBreatheAnim = useRef<gsap.core.Tween | null>(null);

  // ========== NOTHING EFFECTS ==========
  const nothingScramble = useCallback((element: HTMLSpanElement, duration: number = 0.3) => {
    const chars = NOTHING_TEXT.split('');
    let iteration = 0;
    const totalIterations = duration * 60;

    const interval = setInterval(() => {
      element.textContent = chars
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < iteration) return NOTHING_TEXT[index];
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join('');

      iteration += chars.length / totalIterations;

      if (iteration >= chars.length) {
        element.textContent = NOTHING_TEXT;
        clearInterval(interval);
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  const nothingMicroGlitch = useCallback(() => {
    if (!nothingHovering.current || !nothingCtx.current) return;

    const slices = nothingSlicesRef.current.filter(Boolean) as HTMLSpanElement[];

    nothingCtx.current.add(() => {
      slices.forEach((slice) => {
        const direction = Math.random() > 0.5 ? 1 : -1;
        const intensity = Math.random() * 15 + 5;

        gsap.to(slice, {
          x: direction * intensity,
          skewX: (Math.random() - 0.5) * 10,
          duration: 0.05,
          ease: 'power4.out',
          onComplete: () => {
            gsap.to(slice, { x: 0, skewX: 0, duration: 0.08, ease: 'power2.out' });
          },
        });

        if (Math.random() > 0.5) {
          gsap.to(slice, {
            textShadow: `${direction * 3}px 0 #ff0040, ${-direction * 3}px 0 #00ffff`,
            duration: 0.05,
            onComplete: () => {
              gsap.to(slice, { textShadow: 'none', duration: 0.1 });
            },
          });
        }
      });

      if (nothingContainerRef.current && Math.random() > 0.7) {
        gsap.to(nothingContainerRef.current, {
          opacity: 0.7,
          scale: 1.01,
          duration: 0.03,
          onComplete: () => {
            gsap.to(nothingContainerRef.current, { opacity: 1, scale: 1, duration: 0.05 });
          },
        });
      }
    });

    if (nothingHovering.current) {
      setTimeout(nothingMicroGlitch, Math.random() * 400 + 150);
    }
  }, []);

  const nothingEntryBurst = useCallback(() => {
    if (!nothingCtx.current) return;

    const slices = nothingSlicesRef.current.filter(Boolean) as HTMLSpanElement[];

    nothingCtx.current.add(() => {
      gsap.killTweensOf(slices);
      gsap.killTweensOf(nothingContainerRef.current);

      gsap.to(nothingContainerRef.current, {
        x: 'random(-5, 5)',
        y: 'random(-2, 2)',
        duration: 0.15,
        ease: 'power4.out',
        repeat: 2,
        yoyo: true,
        onComplete: () => {
          gsap.set(nothingContainerRef.current, { x: 0, y: 0 });
        },
      });

      slices.forEach((slice, i) => {
        const direction = i % 2 === 0 ? 1 : -1;

        gsap.fromTo(
          slice,
          { x: direction * (30 + Math.random() * 20), skewX: direction * 15, opacity: 0.6 },
          { x: 0, skewX: 0, opacity: 1, duration: 0.25, delay: i * 0.02, ease: 'power3.out' }
        );

        gsap.fromTo(
          slice,
          { textShadow: `${direction * 8}px 0 #ff0040, ${-direction * 8}px 0 #00ffff` },
          { textShadow: 'none', duration: 0.3, delay: 0.1 }
        );
      });

      if (nothingTextRef.current) {
        nothingScramble(nothingTextRef.current, 0.4);
      }
    });
  }, [nothingScramble]);

  const nothingExitBurst = useCallback(() => {
    if (!nothingCtx.current) return;

    const slices = nothingSlicesRef.current.filter(Boolean) as HTMLSpanElement[];

    nothingCtx.current.add(() => {
      slices.forEach((slice, i) => {
        const direction = i % 2 === 0 ? 1 : -1;

        gsap.to(slice, {
          x: direction * 10,
          duration: 0.05,
          onComplete: () => {
            gsap.to(slice, { x: 0, textShadow: 'none', skewX: 0, duration: 0.15, ease: 'power2.out' });
          },
        });
      });
    });
  }, []);

  // ========== PANGAIA EFFECTS ==========
  const pangaiaStartBreathing = useCallback(() => {
    if (!pangaiaCtx.current) return;

    const letters = pangaiaLettersRef.current.filter(Boolean) as HTMLSpanElement[];
    if (!letters.length) return;

    pangaiaCtx.current.add(() => {
      pangaiaBreatheAnim.current = gsap.to(letters, {
        y: (i) => Math.sin(i * 0.5) * 3,
        duration: 2,
        ease: 'sine.inOut',
        stagger: { each: 0.1, repeat: -1, yoyo: true },
      });
    });
  }, []);

  const pangaiaBloom = useCallback(() => {
    if (!pangaiaCtx.current) return;

    const petals = pangaiaPetalsRef.current.filter(Boolean) as HTMLDivElement[];
    const letters = pangaiaLettersRef.current.filter(Boolean) as HTMLSpanElement[];

    pangaiaCtx.current.add(() => {
      pangaiaBreatheAnim.current?.kill();

      gsap.to(letters, {
        scale: 1.05,
        color: '#8B9A7A',
        textShadow: '0 0 20px rgba(139, 154, 122, 0.5)',
        duration: 0.4,
        ease: 'power2.out',
        stagger: { each: 0.03, from: 'center' },
      });

      petals.forEach((petal, i) => {
        const angle = (i / petals.length) * Math.PI * 2;
        const distance = 80 + Math.random() * 60;

        gsap.fromTo(
          petal,
          { x: 0, y: 0, scale: 0, rotation: 0, opacity: 0 },
          {
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
            scale: 0.8 + Math.random() * 0.4,
            rotation: Math.random() * 360,
            opacity: 0.8,
            duration: 0.8 + Math.random() * 0.4,
            ease: 'power2.out',
          }
        );

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

      gsap.to(pangaiaContainerRef.current, {
        boxShadow: '0 0 60px rgba(139, 154, 122, 0.3), inset 0 0 30px rgba(139, 154, 122, 0.1)',
        borderColor: 'rgba(139, 154, 122, 0.6)',
        duration: 0.5,
      });
    });
  }, []);

  const pangaiaSettle = useCallback(() => {
    if (!pangaiaCtx.current) return;

    const petals = pangaiaPetalsRef.current.filter(Boolean) as HTMLDivElement[];
    const letters = pangaiaLettersRef.current.filter(Boolean) as HTMLSpanElement[];

    pangaiaCtx.current.add(() => {
      petals.forEach((petal) => gsap.killTweensOf(petal));

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

      gsap.to(letters, {
        scale: 1,
        color: 'rgba(245, 240, 232, 0.6)',
        textShadow: 'none',
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });

      gsap.to(pangaiaContainerRef.current, {
        boxShadow: 'none',
        borderColor: 'rgba(139, 154, 122, 0.3)',
        duration: 0.4,
      });

      setTimeout(() => {
        if (!pangaiaHovering.current) {
          pangaiaStartBreathing();
        }
      }, 500);
    });
  }, [pangaiaStartBreathing]);

  // ========== SETUP ==========
  useEffect(() => {
    nothingCtx.current = gsap.context(() => {});
    pangaiaCtx.current = gsap.context(() => {});
    pangaiaStartBreathing();

    return () => {
      nothingCtx.current?.revert();
      pangaiaCtx.current?.revert();
      pangaiaBreatheAnim.current?.kill();
    };
  }, [pangaiaStartBreathing]);

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
    <section ref={ref} id="concept-campaigns" className="relative py-section w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-24">
          {/* Sticky Label */}
          <div className="md:w-1/4">
            <div className="sticky top-32 text-sm font-medium tracking-wide text-secondary uppercase">
              Concept Campaigns
            </div>
          </div>

          {/* Campaign CTAs */}
          <div className="md:w-3/4 flex flex-col gap-12">
            {/* NOTHING CTA */}
            <button
              onClick={() => navigateWithTransition('/nothing')}
              className="group block w-full text-left"
              onMouseEnter={() => {
                nothingHovering.current = true;
                nothingEntryBurst();
                setTimeout(nothingMicroGlitch, 300);
              }}
              onMouseLeave={() => {
                nothingHovering.current = false;
                nothingExitBurst();
              }}
            >
              <div
                ref={nothingContainerRef}
                className="relative border border-secondary/30 hover:border-secondary/60 transition-colors duration-500 px-8 py-12 md:px-16 md:py-16 overflow-hidden"
                style={{ willChange: 'transform, opacity' }}
              >
                {/* Scanline overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                    animation: 'scanlines 8s linear infinite',
                  }}
                />

                {/* Glitch slices container */}
                <div className="relative h-[2em] md:h-[2.5em] flex items-center justify-center">
                  {Array.from({ length: SLICE_COUNT }).map((_, i) => (
                    <span
                      key={i}
                      ref={(el) => (nothingSlicesRef.current[i] = el)}
                      className="text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-secondary group-hover:text-foreground transition-colors duration-500 whitespace-nowrap"
                      style={getSliceStyle(i)}
                      aria-hidden="true"
                    >
                      {NOTHING_TEXT}
                    </span>
                  ))}

                  <span
                    ref={nothingTextRef}
                    className="text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-secondary group-hover:text-foreground transition-colors duration-500 opacity-0 pointer-events-none whitespace-nowrap"
                  >
                    {NOTHING_TEXT}
                  </span>
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-secondary/40 group-hover:border-foreground/60 transition-colors duration-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-secondary/40 group-hover:border-foreground/60 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-secondary/40 group-hover:border-foreground/60 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-secondary/40 group-hover:border-foreground/60 transition-colors duration-500" />
              </div>
            </button>

            {/* PANGAIA CTA */}
            <button
              onClick={() => navigateWithTransition('/pangaia')}
              className="group block w-full text-left"
              onMouseEnter={() => {
                pangaiaHovering.current = true;
                pangaiaBloom();
              }}
              onMouseLeave={() => {
                pangaiaHovering.current = false;
                pangaiaSettle();
              }}
            >
              <div
                ref={pangaiaContainerRef}
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
                    <div key={i} ref={(el) => (pangaiaPetalsRef.current[i] = el)} style={getPetalStyle(i)} />
                  ))}
                </div>

                {/* Main text */}
                <div className="relative flex items-center justify-center h-[2em] md:h-[2.5em]">
                  <h2
                    className="text-xl md:text-2xl lg:text-3xl font-light tracking-[0.3em] uppercase text-center"
                    style={{ color: 'rgba(245, 240, 232, 0.6)', fontFamily: "'Georgia', serif" }}
                  >
                    {PANGAIA_TEXT.split('').map((char, i) => (
                      <span
                        key={i}
                        ref={(el) => (pangaiaLettersRef.current[i] = el)}
                        className="inline-block"
                        style={{ willChange: 'transform' }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </span>
                    ))}
                  </h2>
                </div>

                {/* Corner vines */}
                <svg
                  className="absolute top-0 left-0 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500"
                  viewBox="0 0 48 48"
                >
                  <path d="M0 24 Q12 24 12 12 Q12 0 24 0" fill="none" stroke="#8B9A7A" strokeWidth="1" />
                  <circle cx="24" cy="0" r="2" fill="#8B9A7A" />
                </svg>
                <svg
                  className="absolute top-0 right-0 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500 rotate-90"
                  viewBox="0 0 48 48"
                >
                  <path d="M0 24 Q12 24 12 12 Q12 0 24 0" fill="none" stroke="#8B9A7A" strokeWidth="1" />
                  <circle cx="24" cy="0" r="2" fill="#8B9A7A" />
                </svg>
                <svg
                  className="absolute bottom-0 left-0 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500 -rotate-90"
                  viewBox="0 0 48 48"
                >
                  <path d="M0 24 Q12 24 12 12 Q12 0 24 0" fill="none" stroke="#8B9A7A" strokeWidth="1" />
                  <circle cx="24" cy="0" r="2" fill="#8B9A7A" />
                </svg>
                <svg
                  className="absolute bottom-0 right-0 w-12 h-12 opacity-30 group-hover:opacity-60 transition-opacity duration-500 rotate-180"
                  viewBox="0 0 48 48"
                >
                  <path d="M0 24 Q12 24 12 12 Q12 0 24 0" fill="none" stroke="#8B9A7A" strokeWidth="1" />
                  <circle cx="24" cy="0" r="2" fill="#8B9A7A" />
                </svg>
              </div>
            </button>

            {/* BERLIN CTA */}
            <button
              onClick={() => navigateWithTransition('/berlin')}
              className="group block w-full text-left"
            >
              <div
                className="relative border border-secondary/30 hover:border-neon-red/60 transition-colors duration-500 px-8 py-12 md:px-16 md:py-16 overflow-hidden"
                style={{ 
                  willChange: 'transform, opacity',
                  background: 'linear-gradient(135deg, rgba(20, 20, 25, 0.9), rgba(30, 15, 20, 0.8))'
                }}
              >
                {/* Bass pulse overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(255, 0, 64, 0.1), transparent 70%)',
                    animation: 'bassPulse 1s ease-in-out infinite',
                  }}
                />

                {/* Scanline overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.02) 2px, rgba(255,255,255,0.02) 4px)',
                  }}
                />

                {/* Main text */}
                <div className="relative flex items-center justify-center h-[2em] md:h-[2.5em]">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-secondary group-hover:text-neon-red transition-colors duration-500">
                    BERLIN
                  </h2>
                </div>

                {/* Subtitle */}
                <p className="text-center text-secondary/50 font-mono text-xs tracking-wider mt-2 group-hover:text-foreground/60 transition-colors duration-500">
                  A NIGHT OUT
                </p>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-secondary/40 group-hover:border-neon-red/60 transition-colors duration-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-secondary/40 group-hover:border-neon-red/60 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-secondary/40 group-hover:border-neon-red/60 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-secondary/40 group-hover:border-neon-red/60 transition-colors duration-500" />
              </div>
            </button>

            {/* AUBE CTA */}
            <button
              onClick={() => navigateWithTransition('/aube')}
              className="group block w-full text-left"
            >
              <div
                className="relative border border-amber-500/20 hover:border-amber-500/60 transition-all duration-500 px-8 py-12 md:px-16 md:py-16 overflow-hidden"
                style={{ 
                  willChange: 'transform, opacity, box-shadow',
                  background: 'linear-gradient(135deg, rgba(20, 15, 10, 0.9), rgba(30, 20, 10, 0.8))'
                }}
              >
                {/* Amber glow pulse overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.15), transparent 70%)',
                    animation: 'amberPulse 2s ease-in-out infinite',
                  }}
                />

                {/* Subtle shimmer overlay */}
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.05) 50%, transparent 100%)',
                    backgroundSize: '200% 100%',
                    animation: 'aubeShimmer 3s infinite',
                  }}
                />

                {/* Main text */}
                <div className="relative flex items-center justify-center h-[2em] md:h-[2.5em]">
                  <h2 
                    className="text-xl md:text-2xl lg:text-3xl font-bold tracking-[0.3em] uppercase transition-all duration-500"
                    style={{
                      background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.6) 0%, rgba(234, 88, 12, 0.6) 50%, rgba(245, 158, 11, 0.6) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    <span className="group-hover:drop-shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-all duration-500">
                      AUBE
                    </span>
                  </h2>
                </div>

                {/* Subtitle */}
                <p className="text-center text-amber-500/50 font-light text-xs tracking-wider mt-2 group-hover:text-amber-400/80 transition-colors duration-500">
                  CULTURAL INTELLIGENCE
                </p>

                {/* Corner accents - amber themed */}
                <div className="absolute top-0 left-0 w-4 h-4 border-l border-t border-amber-500/30 group-hover:border-amber-500/70 transition-colors duration-500" />
                <div className="absolute top-0 right-0 w-4 h-4 border-r border-t border-amber-500/30 group-hover:border-amber-500/70 transition-colors duration-500" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-l border-b border-amber-500/30 group-hover:border-amber-500/70 transition-colors duration-500" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-r border-b border-amber-500/30 group-hover:border-amber-500/70 transition-colors duration-500" />

                {/* Hover glow effect */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 60px rgba(245, 158, 11, 0.1)',
                  }}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(100%); }
        }
        @keyframes bassPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.02); }
        }
        @keyframes amberPulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.01); }
        }
        @keyframes aubeShimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>
    </section>
  );
});

ConceptCampaignsSection.displayName = 'ConceptCampaignsSection';

export default ConceptCampaignsSection;
