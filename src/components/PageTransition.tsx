import { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const SLICE_COUNT = 8;
const GLITCH_CHARS = '█▓▒░╔╗╚╝┃━▀▄■□';
const PETAL_COUNT = 60;

interface TransitionContextType {
  navigateWithTransition: (to: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
  isTransitioning: false,
});

export const usePageTransition = () => useContext(TransitionContext);

// Petal SVG shapes
const petalShapes = [
  // Rose petal
  'M0,0 C5,-10 15,-10 20,0 C15,10 5,10 0,0',
  // Daisy petal
  'M0,0 C3,-8 7,-15 10,-20 C13,-15 17,-8 20,0 C17,8 13,15 10,20 C7,15 3,8 0,0',
  // Leaf
  'M10,0 Q20,10 10,30 Q0,10 10,0',
  // Round petal
  'M10,0 C20,5 20,25 10,30 C0,25 0,5 10,0',
];

const petalColors = [
  '#E84B3C', // Poppy red
  '#F4C430', // Yellow
  '#6495ED', // Cornflower blue
  '#FFB6C1', // Pink
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F5F0E8', // Cream
  '#FFD700', // Gold
];

export const PageTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [transitionType, setTransitionType] = useState<'glitch' | 'organic'>('glitch');
  const overlayRef = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const organicOverlayRef = useRef<HTMLDivElement>(null);
  const petalsRef = useRef<(SVGSVGElement | null)[]>([]);
  const organicTextRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithTransition = useCallback((to: string) => {
    if (isTransitioning || to === location.pathname) return;

    // Disable scroll during transition
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const type = to === '/pangaia' || location.pathname === '/pangaia' ? 'organic' : 'glitch';
    setTransitionType(type);
    setTargetPath(to);
    setIsTransitioning(true);
    setPhase('exiting');
  }, [isTransitioning, location.pathname]);

  // GLITCH TRANSITION (for Nothing)
  useEffect(() => {
    if (phase !== 'exiting' || !isTransitioning || !targetPath || transitionType !== 'glitch' || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const slices = slicesRef.current.filter(Boolean) as HTMLDivElement[];
    const text = textRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setPhase('entering');

          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;

          navigate(targetPath);
          // Run entry after route swap; keeping this minimal prevents re-triggering on re-render.
          setTimeout(() => runGlitchEntry(), 50);
        },
      });

      tl.set(overlay, { display: 'flex', opacity: 1 });

      slices.forEach((slice, i) => {
        const direction = i % 2 === 0 ? -1 : 1;
        tl.fromTo(slice,
          { x: `${direction * 100}%`, skewX: direction * 20 },
          { x: '0%', skewX: 0, duration: 0.4, ease: 'power4.inOut' },
          i * 0.03
        );
      });

      tl.to(slices, { textShadow: '4px 0 #ff0040, -4px 0 #00ffff', duration: 0.1, stagger: 0.02 }, 0.2);

      if (text) {
        tl.fromTo(text, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.3 }, 0.3);
      }

      tl.to(overlay, { x: 'random(-5, 5)', y: 'random(-3, 3)', duration: 0.05, repeat: 4, yoyo: true }, 0.2);
      tl.set(overlay, { x: 0, y: 0 });
    });

    return () => ctx.revert();
  }, [phase, isTransitioning, targetPath, transitionType, navigate]);

  const runGlitchEntry = useCallback(() => {
    if (!overlayRef.current) return;

    const overlay = overlayRef.current;
    const slices = slicesRef.current.filter(Boolean) as HTMLDivElement[];
    const text = textRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setPhase('idle');
          setIsTransitioning(false);
          setTargetPath(null);
          gsap.set(overlay, { display: 'none' });
          // Re-enable scroll
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        },
      });

      if (text) tl.to(text, { opacity: 0, scale: 1.2, duration: 0.2 }, 0);

      tl.to(slices, { textShadow: '8px 0 #ff0040, -8px 0 #00ffff', duration: 0.1 }, 0);

      slices.forEach((slice, i) => {
        const direction = i % 2 === 0 ? 1 : -1;
        tl.to(slice, { x: `${direction * 100}%`, skewX: direction * 25, duration: 0.4, ease: 'power4.inOut' }, 0.1 + i * 0.03);
      });

      tl.to(overlay, { opacity: 0, duration: 0.2 }, 0.4);
    });

    return () => ctx.revert();
  }, []);

  // ORGANIC PETAL STORM TRANSITION (for PANGAIA)
  useEffect(() => {
    if (phase !== 'exiting' || !isTransitioning || !targetPath || transitionType !== 'organic' || !organicOverlayRef.current) return;

    const overlay = organicOverlayRef.current;
    const petals = petalsRef.current.filter(Boolean) as SVGSVGElement[];
    const text = organicTextRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setPhase('entering');

          window.scrollTo(0, 0);
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;

          navigate(targetPath);
          setTimeout(() => runOrganicEntry(), 50);
        },
      });

      tl.set(overlay, { display: 'flex', opacity: 1 });

      // Petals swirl in from outside the screen
      petals.forEach((petal, i) => {
        const angle = (i / petals.length) * Math.PI * 2;
        const startDistance = 800 + Math.random() * 400;
        const startX = Math.cos(angle) * startDistance;
        const startY = Math.sin(angle) * startDistance;
        const rotation = Math.random() * 720 - 360;
        const duration = 0.8 + Math.random() * 0.4;
        const delay = Math.random() * 0.3;

        tl.fromTo(petal,
          { 
            x: startX, 
            y: startY, 
            rotation: rotation,
            scale: 0.5 + Math.random() * 0.5,
            opacity: 0,
          },
          { 
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            rotation: rotation + (Math.random() - 0.5) * 180,
            scale: 1 + Math.random() * 0.5,
            opacity: 1,
            duration: duration,
            ease: 'power2.out',
          },
          delay
        );
      });

      // After petals gather, they continue floating gently
      tl.to(petals, {
        y: '+=20',
        rotation: '+=30',
        duration: 0.5,
        ease: 'sine.inOut',
        stagger: 0.02,
      }, 0.6);

      // Text fades in
      if (text) {
        tl.fromTo(text,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'power2.out' },
          0.4
        );
      }
    });

    return () => ctx.revert();
  }, [phase, isTransitioning, targetPath, transitionType, navigate]);

  const runOrganicEntry = useCallback(() => {
    if (!organicOverlayRef.current) return;

    const overlay = organicOverlayRef.current;
    const petals = petalsRef.current.filter(Boolean) as SVGSVGElement[];
    const text = organicTextRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setPhase('idle');
          setIsTransitioning(false);
          setTargetPath(null);
          gsap.set(overlay, { display: 'none' });
          // Reset petals for next transition
          petals.forEach((petal) => {
            gsap.set(petal, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 0 });
          });
          // Re-enable scroll
          document.body.style.overflow = '';
          document.documentElement.style.overflow = '';
        },
      });

      // Text fades out
      if (text) {
        tl.to(text, { opacity: 0, scale: 1.1, y: -20, duration: 0.3 }, 0);
      }

      // Petals scatter outward like wind blowing them away
      petals.forEach((petal, i) => {
        const angle = (i / petals.length) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 600 + Math.random() * 400;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance - 200; // Drift upward
        
        tl.to(petal, {
          x: endX,
          y: endY,
          rotation: '+=360',
          scale: 0.3,
          opacity: 0,
          duration: 0.6 + Math.random() * 0.3,
          ease: 'power2.in',
        }, 0.1 + i * 0.01);
      });

      // Fade overlay
      tl.to(overlay, { opacity: 0, duration: 0.3 }, 0.5);
    });

    return () => ctx.revert();
  }, []);

  // Scramble text effect for glitch
  useEffect(() => {
    if (!isTransitioning || !textRef.current || transitionType !== 'glitch') return;

    const element = textRef.current;
    const targetText = targetPath === '/nothing' ? 'NOTHING' : 
                       targetPath === '/' ? 'HOME' : 'LOADING';
    
    let iteration = 0;
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
  }, [isTransitioning, targetPath, transitionType]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition, isTransitioning }}>
      {children}
      
      {/* GLITCH Transition Overlay (Nothing) */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none hidden items-center justify-center"
        style={{ perspective: '1000px' }}
      >
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
            <div 
              className="absolute inset-0 opacity-20"
              style={{
                background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
              }}
            />
          </div>
        ))}

        <div
          ref={textRef}
          className="relative z-10 text-4xl md:text-6xl font-light tracking-[0.5em] text-white opacity-0"
          style={{ 
            fontFamily: "'Courier New', monospace",
            textShadow: '2px 0 #ff0040, -2px 0 #00ffff',
          }}
        />

        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ORGANIC Petal Storm Overlay (PANGAIA) */}
      <div
        ref={organicOverlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none hidden items-center justify-center overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #1A2F1A 0%, #2A4A2A 50%, #1A2F1A 100%)',
        }}
      >
        {/* Floating petals */}
        {Array.from({ length: PETAL_COUNT }).map((_, i) => {
          const shapeIndex = i % petalShapes.length;
          const colorIndex = i % petalColors.length;
          const size = 20 + Math.random() * 30;
          
          return (
            <svg
              key={i}
              ref={(el) => (petalsRef.current[i] = el)}
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                width: size,
                height: size * 1.5,
                opacity: 0,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}
              viewBox="0 0 20 30"
            >
              <path
                d={petalShapes[shapeIndex]}
                fill={petalColors[colorIndex]}
                opacity={0.85}
              />
            </svg>
          );
        })}

        {/* Center text */}
        <div
          ref={organicTextRef}
          className="relative z-10 text-4xl md:text-6xl font-light tracking-[0.3em] opacity-0"
          style={{ 
            fontFamily: "'Georgia', serif",
            color: '#F5F0E8',
            textShadow: '0 2px 20px rgba(139, 154, 122, 0.5)',
          }}
        >
          {targetPath === '/pangaia' ? 'SYMBIOSIS' : targetPath === '/' ? 'HOME' : ''}
        </div>

        {/* Soft gradient overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(26, 47, 26, 0.3) 100%)',
          }}
        />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </TransitionContext.Provider>
  );
};

export default PageTransitionProvider;
