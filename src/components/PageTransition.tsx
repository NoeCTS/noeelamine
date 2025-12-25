import { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const SLICE_COUNT = 8;
const GLITCH_CHARS = '█▓▒░╔╗╚╝┃━▀▄■□';

interface TransitionContextType {
  navigateWithTransition: (to: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithTransition = useCallback((to: string) => {
    if (isTransitioning || to === location.pathname) return;
    setIsTransitioning(true);
    setTargetPath(to);
  }, [isTransitioning, location.pathname]);

  // Run exit animation when transitioning starts
  useEffect(() => {
    if (!isTransitioning || !targetPath || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const slices = slicesRef.current.filter(Boolean) as HTMLDivElement[];
    const text = textRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          navigate(targetPath);
          // Entry animation after navigation
          setTimeout(() => {
            runEntryAnimation();
          }, 100);
        },
      });

      // Show overlay
      tl.set(overlay, { display: 'flex', opacity: 1 });

      // Slices sweep in from alternating directions
      slices.forEach((slice, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        tl.fromTo(
          slice,
          { 
            x: `${direction * 100}%`,
            skewX: direction * 20,
          },
          {
            x: '0%',
            skewX: 0,
            duration: 0.4,
            ease: 'power4.inOut',
          },
          i * 0.03
        );
      });

      // RGB glitch on slices
      tl.to(slices, {
        textShadow: '4px 0 #ff0040, -4px 0 #00ffff',
        duration: 0.1,
        stagger: 0.02,
      }, 0.2);

      // Text scramble and reveal
      if (text) {
        tl.fromTo(text, 
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.3 },
          0.3
        );
      }

      // Screen shake
      tl.to(overlay, {
        x: 'random(-5, 5)',
        y: 'random(-3, 3)',
        duration: 0.05,
        repeat: 4,
        yoyo: true,
      }, 0.2);

      tl.set(overlay, { x: 0, y: 0 });
    });

    return () => ctx.revert();
  }, [isTransitioning, targetPath, navigate]);

  const runEntryAnimation = useCallback(() => {
    if (!overlayRef.current) return;

    const overlay = overlayRef.current;
    const slices = slicesRef.current.filter(Boolean) as HTMLDivElement[];
    const text = textRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
          setTargetPath(null);
          gsap.set(overlay, { display: 'none' });
        },
      });

      // Hide text first
      if (text) {
        tl.to(text, { opacity: 0, scale: 1.2, duration: 0.2 }, 0);
      }

      // Slices sweep out with glitch
      tl.to(slices, {
        textShadow: '8px 0 #ff0040, -8px 0 #00ffff',
        duration: 0.1,
      }, 0);

      slices.forEach((slice, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        tl.to(
          slice,
          {
            x: `${direction * 100}%`,
            skewX: direction * 25,
            duration: 0.4,
            ease: 'power4.inOut',
          },
          0.1 + i * 0.03
        );
      });

      // Final flash
      tl.to(overlay, {
        opacity: 0,
        duration: 0.2,
      }, 0.4);
    });

    return () => ctx.revert();
  }, []);

  // Scramble text effect
  useEffect(() => {
    if (!isTransitioning || !textRef.current) return;

    const element = textRef.current;
    const targetText = targetPath === '/nothing' ? 'NOTHING' : 
                       targetPath === '/pangaia' ? 'PANGAIA' : 
                       targetPath === '/' ? 'HOME' : 'LOADING';
    
    let iteration = 0;
    const totalIterations = 20;

    const interval = setInterval(() => {
      element.textContent = targetText
        .split('')
        .map((char, index) => {
          if (index < iteration) return targetText[index];
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
        })
        .join('');

      iteration += 1;

      if (iteration >= targetText.length) {
        element.textContent = targetText;
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isTransitioning, targetPath]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      
      {/* Transition Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none hidden items-center justify-center"
        style={{ perspective: '1000px' }}
      >
        {/* Glitch slices */}
        {Array.from({ length: SLICE_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (slicesRef.current[i] = el)}
            className="absolute inset-0"
            style={{
              clipPath: `inset(${(i / SLICE_COUNT) * 100}% 0 ${100 - ((i + 1) / SLICE_COUNT) * 100}% 0)`,
              backgroundColor: '#0a0a0a',
              willChange: 'transform',
            }}
          >
            {/* Scanline texture */}
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
              }}
            />
          </div>
        ))}

        {/* Center text */}
        <div
          ref={textRef}
          className="relative z-10 text-4xl md:text-6xl font-light tracking-[0.5em] text-white opacity-0"
          style={{ 
            fontFamily: "'Courier New', monospace",
            textShadow: '2px 0 #ff0040, -2px 0 #00ffff',
          }}
        />

        {/* Noise overlay */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>
    </TransitionContext.Provider>
  );
};

export default PageTransitionProvider;
