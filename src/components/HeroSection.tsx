import { forwardRef } from 'react';

interface HeroSectionProps {
  nameRef: React.RefObject<HTMLHeadingElement>;
  scrollIndicatorRef: React.RefObject<HTMLDivElement>;
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(({ nameRef, scrollIndicatorRef }, ref) => {
  return (
    <section 
      ref={ref}
      id="hero" 
      className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="z-20 text-center relative mix-blend-difference">
        <h1 
          ref={nameRef}
          className="hero-name font-sans text-hero font-semibold tracking-tighter leading-[0.9] text-foreground"
        >
          NOE ELAMINE
        </h1>
      </div>
      
      {/* Scroll Indicator */}
      <div 
        ref={scrollIndicatorRef}
        className="scroll-indicator absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0"
      >
        <div className="w-[1px] h-16 bg-secondary/50 overflow-hidden">
          <div className="w-full h-full bg-foreground animate-scroll-down" />
        </div>
      </div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

export default HeroSection;
