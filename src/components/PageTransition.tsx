import { useEffect, useRef, useState, createContext, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';

const SLICE_COUNT = 8;
const GLITCH_CHARS = '█▓▒░╔╗╚╝┃━▀▄■□';
const VINE_COUNT = 12;

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
  const [transitionType, setTransitionType] = useState<'glitch' | 'organic'>('glitch');
  const overlayRef = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLDivElement>(null);
  const organicOverlayRef = useRef<HTMLDivElement>(null);
  const vinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const organicTextRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithTransition = useCallback((to: string) => {
    if (isTransitioning || to === location.pathname) return;
    
    // Determine transition type based on destination
    const type = to === '/pangaia' || location.pathname === '/pangaia' ? 'organic' : 'glitch';
    setTransitionType(type);
    setIsTransitioning(true);
    setTargetPath(to);
  }, [isTransitioning, location.pathname]);

  // GLITCH TRANSITION (for Nothing)
  useEffect(() => {
    if (!isTransitioning || !targetPath || transitionType !== 'glitch' || !overlayRef.current) return;

    const overlay = overlayRef.current;
    const slices = slicesRef.current.filter(Boolean) as HTMLDivElement[];
    const text = textRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          navigate(targetPath);
          setTimeout(() => runGlitchEntry(), 100);
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
  }, [isTransitioning, targetPath, transitionType, navigate]);

  const runGlitchEntry = useCallback(() => {
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

  // ORGANIC TRANSITION (for PANGAIA)
  useEffect(() => {
    if (!isTransitioning || !targetPath || transitionType !== 'organic' || !organicOverlayRef.current) return;

    const overlay = organicOverlayRef.current;
    const vines = vinesRef.current.filter(Boolean) as HTMLDivElement[];
    const text = organicTextRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          navigate(targetPath);
          setTimeout(() => runOrganicEntry(), 100);
        },
      });

      tl.set(overlay, { display: 'flex', opacity: 1 });

      // Vines grow from edges
      vines.forEach((vine, i) => {
        const isLeft = i < VINE_COUNT / 2;
        const startX = isLeft ? '-100%' : '100%';
        
        tl.fromTo(vine,
          { scaleX: 0, transformOrigin: isLeft ? 'left center' : 'right center' },
          { 
            scaleX: 1, 
            duration: 0.6 + Math.random() * 0.3, 
            ease: 'power2.out',
          },
          i * 0.04
        );
      });

      // Center bloom
      tl.to(overlay, {
        background: 'radial-gradient(circle at center, #1A2F1A 0%, #1A2F1A 100%)',
        duration: 0.3,
      }, 0.3);

      // Text blooms in
      if (text) {
        tl.fromTo(text,
          { opacity: 0, scale: 0.5, filter: 'blur(10px)' },
          { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
          0.4
        );
      }
    });

    return () => ctx.revert();
  }, [isTransitioning, targetPath, transitionType, navigate]);

  const runOrganicEntry = useCallback(() => {
    if (!organicOverlayRef.current) return;

    const overlay = organicOverlayRef.current;
    const vines = vinesRef.current.filter(Boolean) as HTMLDivElement[];
    const text = organicTextRef.current;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsTransitioning(false);
          setTargetPath(null);
          gsap.set(overlay, { display: 'none' });
        },
      });

      // Text fades
      if (text) {
        tl.to(text, { opacity: 0, scale: 1.1, duration: 0.3 }, 0);
      }

      // Vines retreat with a wave
      vines.forEach((vine, i) => {
        const isLeft = i < VINE_COUNT / 2;
        tl.to(vine, {
          scaleX: 0,
          transformOrigin: isLeft ? 'left center' : 'right center',
          duration: 0.5,
          ease: 'power2.in',
        }, 0.1 + (VINE_COUNT - i) * 0.02);
      });

      // Circular reveal wipe
      tl.to(overlay, {
        clipPath: 'circle(0% at 50% 50%)',
        duration: 0.6,
        ease: 'power3.in',
      }, 0.2);

      tl.to(overlay, { opacity: 0, duration: 0.1 });
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

  // Generate vine positions
  const getVineStyle = (index: number): React.CSSProperties => {
    const isLeft = index < VINE_COUNT / 2;
    const localIndex = isLeft ? index : index - VINE_COUNT / 2;
    const yPercent = (localIndex / (VINE_COUNT / 2)) * 100;
    
    return {
      position: 'absolute',
      left: isLeft ? 0 : 'auto',
      right: isLeft ? 'auto' : 0,
      top: `${yPercent}%`,
      width: '60%',
      height: `${100 / (VINE_COUNT / 2) + 2}%`,
      backgroundColor: '#1A2F1A',
      clipPath: isLeft 
        ? 'polygon(0 0, 100% 20%, 95% 50%, 100% 80%, 0 100%)'
        : 'polygon(100% 0, 0 20%, 5% 50%, 0 80%, 100% 100%)',
      transformOrigin: isLeft ? 'left center' : 'right center',
      transform: 'scaleX(0)',
    };
  };

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

      {/* ORGANIC Transition Overlay (PANGAIA) */}
      <div
        ref={organicOverlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none hidden items-center justify-center overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #1A2F1A 0%, #2A4F2A 50%, #1A2F1A 100%)',
          clipPath: 'circle(150% at 50% 50%)',
        }}
      >
        {/* Growing vines */}
        {Array.from({ length: VINE_COUNT }).map((_, i) => (
          <div
            key={i}
            ref={(el) => (vinesRef.current[i] = el)}
            style={getVineStyle(i)}
          />
        ))}

        {/* Center text */}
        <div
          ref={organicTextRef}
          className="relative z-10 text-4xl md:text-6xl font-light tracking-[0.3em] opacity-0"
          style={{ 
            fontFamily: "'Georgia', serif",
            color: '#8B9A7A',
            textShadow: '0 0 30px rgba(139, 154, 122, 0.5)',
          }}
        >
          {targetPath === '/pangaia' ? 'PANGAIA' : targetPath === '/' ? 'HOME' : ''}
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: '#8B9A7A',
                opacity: 0.3,
                animation: `float ${2 + Math.random() * 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        {/* Grain texture */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
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
