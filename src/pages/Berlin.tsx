import { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Play, Pause, Instagram, Mail, Video } from 'lucide-react';
import BerlinScene, { BerlinSceneHandle } from '@/components/BerlinScene';
import { usePageTransition } from '@/components/PageTransition';
import berlinVideo from '@/assets/berlin-night-video.mp4';

gsap.registerPlugin(ScrollTrigger);

const Berlin = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<BerlinSceneHandle>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const horizontalTextRef = useRef<HTMLDivElement>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const { navigateWithTransition } = usePageTransition();

  // Calculate BPM for CSS animations
  const bpm = useMemo(() => 60 + scrollProgress * 80, [scrollProgress]);
  const pulseDuration = useMemo(() => 60 / bpm, [bpm]);

  useEffect(() => {
    document.documentElement.style.setProperty('--bass-duration', `${pulseDuration}s`);
    document.documentElement.style.setProperty('--pulse-duration', `${pulseDuration}s`);
    document.documentElement.style.setProperty('--wave-duration', `${pulseDuration}s`);
  }, [pulseDuration]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Master scroll progress
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          setScrollProgress(progress);
          sceneRef.current?.setProgress(progress);
        }
      });

      // Hero text animation (scale up and fade out)
      if (heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          scale: 1.2,
          opacity: 0,
          scrollTrigger: {
            trigger: heroTextRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          }
        });
      }

      // Horizontal text scroll
      if (horizontalTextRef.current) {
        gsap.to(horizontalTextRef.current, {
          xPercent: -50,
          ease: 'none',
          scrollTrigger: {
            trigger: '.night-section',
            start: 'top center',
            end: 'bottom center',
            scrub: 1,
          }
        });
      }

      // Video section animation
      if (videoSectionRef.current) {
        gsap.fromTo(
          videoSectionRef.current.querySelector('.video-container'),
          { scale: 0.8, rotateX: 5, opacity: 0 },
          {
            scale: 1,
            rotateX: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: videoSectionRef.current,
              start: 'top 80%',
              end: 'top 20%',
              scrub: true,
            }
          }
        );
      }

      // Details rows animation
      if (detailsRef.current) {
        const rows = detailsRef.current.querySelectorAll('.metadata-row');
        rows.forEach((row, i) => {
          gsap.fromTo(
            row,
            { opacity: 0, x: -30 },
            {
              opacity: 1,
              x: 0,
              scrollTrigger: {
                trigger: row,
                start: 'top 85%',
                end: 'top 60%',
                scrub: true,
                onEnter: () => row.classList.add('visible'),
              }
            }
          );
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // Waveform bars for visualization
  const waveformBars = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      height: 20 + Math.random() * 60,
      delay: i * 0.08,
    })), []
  );

  return (
    <div ref={containerRef} className="relative bg-berlin-black">
      {/* Fixed Three.js background */}
      <BerlinScene
        ref={sceneRef}
        className="fixed inset-0 z-0"
      />

      {/* Overlays */}
      <div className="grain-heavy" />
      <div className="scanlines" />
      
      {/* Bass pulse effect (intensifies with scroll) */}
      <div 
        className={`bass-pulse ${scrollProgress > 0.4 ? 'active' : ''}`}
        style={{ opacity: scrollProgress > 0.4 ? 1 : 0 }}
      />

      {/* Content */}
      <div className="relative z-10">
        
        {/* Back button */}
        <Link
          to="/"
          onClick={(e) => {
            e.preventDefault();
            navigateWithTransition('/');
          }}
          className="fixed top-8 left-8 z-50 flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-mono text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </Link>

        {/* SECTION 1: Hero */}
        <section className="relative h-screen flex flex-col items-center justify-center">
          <h1 
            ref={heroTextRef}
            className="berlin-hero-text font-bebas text-center"
          >
            BERLIN
          </h1>
          <p className="text-foreground/60 font-mono text-sm tracking-widest mt-4">
            A NIGHT OUT
          </p>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-foreground/40 font-mono text-xs tracking-wider">SCROLL TO DESCEND</span>
            <div className="w-px h-12 bg-foreground/20 overflow-hidden">
              <div className="w-full h-1/2 bg-foreground/60 animate-scroll-down" />
            </div>
          </div>
        </section>

        {/* SECTION 2: Transition - The Sun Sets */}
        <section className="relative min-h-[100vh] flex items-center justify-center py-section">
          <div className="max-w-2xl mx-auto px-8 text-center space-y-8">
            <span className="block text-neon-red font-mono text-2xl md:text-4xl tracking-widest">18:00</span>
            <div className="space-y-4 font-mono text-foreground/80 text-lg md:text-xl leading-relaxed">
              <p className="glitch-text" data-text="The city shifts.">The city shifts.</p>
              <p className="glitch-text" data-text="The concrete exhales.">The concrete exhales.</p>
              <p className="glitch-text" data-text="Something stirs beneath the surface.">Something stirs beneath the surface.</p>
            </div>
          </div>
        </section>

        {/* SECTION 3: The Night Begins - Horizontal scroll */}
        <section className="night-section relative min-h-[150vh] overflow-hidden">
          <div className="sticky top-0 h-screen flex items-center">
            <div 
              ref={horizontalTextRef}
              className="horizontal-scroll-text font-bebas whitespace-nowrap pl-[100vw]"
            >
              THE BASS CALLS. THE CONCRETE ANSWERS. YOU FOLLOW.
            </div>
          </div>
        </section>

        {/* SECTION 4: The Video - CLIMAX */}
        <section 
          ref={videoSectionRef}
          className="relative min-h-[200vh] flex items-center justify-center py-section"
          style={{ perspective: '1000px' }}
        >
          <div className="video-container relative w-full max-w-5xl mx-auto px-8">
            {/* Video with pulsing border */}
            <div className="video-pulse-border video-scanlines relative aspect-video bg-berlin-deep rounded-sm overflow-hidden">
              {/* Actual video */}
              <video
                ref={videoRef}
                src={berlinVideo}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted
                playsInline
                onClick={() => {
                  if (videoRef.current) {
                    if (isPlaying) {
                      videoRef.current.pause();
                    } else {
                      videoRef.current.play();
                    }
                    setIsPlaying(!isPlaying);
                  }
                }}
              />
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-neon-red/5 via-transparent to-neon-blue/5 pointer-events-none" />
              
              {/* Play/Pause button */}
              <div className={`absolute inset-0 flex flex-col items-center justify-center gap-6 transition-opacity duration-300 ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                <button 
                  onClick={() => {
                    if (videoRef.current) {
                      if (isPlaying) {
                        videoRef.current.pause();
                      } else {
                        videoRef.current.play();
                      }
                      setIsPlaying(!isPlaying);
                    }
                  }}
                  className="group relative w-24 h-24 rounded-full border-2 border-foreground/30 flex items-center justify-center hover:border-neon-red hover:bg-neon-red/10 transition-all duration-300 bg-background/20 backdrop-blur-sm"
                >
                  {isPlaying ? (
                    <Pause className="w-10 h-10 text-foreground/60 group-hover:text-neon-red transition-colors" />
                  ) : (
                    <Play className="w-10 h-10 text-foreground/60 group-hover:text-neon-red transition-colors ml-1" />
                  )}
                  <div className="absolute inset-0 rounded-full border border-foreground/10 scale-150 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
                </button>
              </div>
              
              {/* Waveform visualization */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 waveform pointer-events-none">
                {waveformBars.map((bar, i) => (
                  <div
                    key={i}
                    className={`waveform-bar ${isPlaying || scrollProgress > 0.45 ? 'animate' : ''}`}
                    style={{ 
                      height: `${bar.height}%`,
                      animationDelay: `${bar.delay}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 5: Project Details */}
        <section ref={detailsRef} className="relative min-h-screen py-section">
          <div className="max-w-4xl mx-auto px-8 space-y-12">
            {/* Metadata grid */}
            <div className="space-y-6 font-mono">
              {[
                { label: 'PROJECT', value: 'A NIGHT IN BERLIN' },
                { label: 'ROLE', value: 'DIRECTOR / EDITOR' },
                { label: 'DURATION', value: '3:24' },
                { label: 'LOCATION', value: 'KREUZBERG, FRIEDRICHSHAIN, MITTE' },
                { label: 'YEAR', value: '2024' },
              ].map((item, i) => (
                <div 
                  key={i} 
                  className="metadata-row flex items-baseline gap-4 py-4 text-sm md:text-base"
                >
                  <span className="text-foreground/40 w-32 flex-shrink-0">{item.label}</span>
                  <div className="flex-1 h-px bg-foreground/10" />
                  <span className="text-foreground">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="text-2xl md:text-4xl font-bebas text-center py-16 text-foreground/80 leading-relaxed">
              "THE BASS FINDS YOU<br />BEFORE THE DOOR DOES."
            </blockquote>

            <p className="text-foreground/60 font-mono text-center text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              Berlin doesn't give you nightlife—it absorbs you into it. 
              From the first pulse of the bass in Berghain's queue to the 
              bleary-eyed sunrise at Holzmarkt, this is an unfiltered descent 
              into the city's beating underground heart.
            </p>
          </div>
        </section>

        {/* SECTION 6: Emergence - Dawn */}
        <section className="relative min-h-screen flex items-center justify-center py-section">
          <div className="max-w-2xl mx-auto px-8 text-center space-y-8">
            <span className="block text-neon-blue font-mono text-2xl md:text-4xl tracking-widest">06:00</span>
            <div className="space-y-4 font-mono text-foreground/80 text-lg md:text-xl leading-relaxed">
              <p>You surface.</p>
              <p>The city remembers nothing.</p>
              <p className="text-foreground">But you do.</p>
            </div>
          </div>
        </section>

        {/* SECTION 7: Footer */}
        <footer className="relative py-16 border-t border-foreground/10">
          <div className="max-w-4xl mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <Link
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateWithTransition('/');
                }}
                className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors font-mono text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>BACK TO PORTFOLIO</span>
              </Link>

              <p className="font-mono text-xs text-foreground/40">
                MADE WITH BASS AND CONCRETE.
              </p>

              <div className="flex items-center gap-6">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/40 hover:text-neon-red transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="https://vimeo.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground/40 hover:text-neon-red transition-colors"
                >
                  <Video className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:hello@example.com"
                  className="text-foreground/40 hover:text-neon-red transition-colors"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Berlin;
