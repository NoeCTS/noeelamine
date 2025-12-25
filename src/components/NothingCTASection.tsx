import { forwardRef } from 'react';
import { Link } from 'react-router-dom';

const NothingCTASection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="nothing-cta" className="relative py-24 md:py-32 w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <Link 
          to="/nothing"
          className="group block w-full max-w-3xl mx-auto"
        >
          <div 
            className="relative border border-secondary/30 hover:border-secondary/60 transition-all duration-500 px-8 py-12 md:px-16 md:py-16 flex items-center justify-center"
          >
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-secondary group-hover:text-foreground transition-colors duration-500 text-center">
              DO YOU WORK AT NOTHING?
            </h2>
          </div>
        </Link>
      </div>
    </section>
  );
});

NothingCTASection.displayName = 'NothingCTASection';

export default NothingCTASection;
