import { forwardRef } from 'react';

const PositioningSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section 
      ref={ref}
      id="positioning" 
      className="relative min-h-[150vh] w-full flex items-center justify-center"
    >
      <div className="container mx-auto px-6 text-center z-20">
        <h2 className="font-sans text-headline font-semibold tracking-tighter leading-[1.1]">
          <div className="reveal-text opacity-20 translate-y-8">I Build Growth Through</div>
          <div className="reveal-text opacity-0 translate-y-8 text-accent mt-2">Strategy, Culture, and Creative Execution</div>
        </h2>
        <p className="font-sans text-body text-secondary mt-12 max-w-xl mx-auto opacity-0 reveal-sub">
          From AI products to street-level activations, I focus on ideas that are sharp in strategy and concrete in market execution.
        </p>
      </div>
    </section>
  );
});

PositioningSection.displayName = 'PositioningSection';

export default PositioningSection;
