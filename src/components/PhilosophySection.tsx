import { forwardRef } from 'react';

const PhilosophySection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="philosophy" className="relative h-screen w-full flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-4xl text-center z-20">
        <p className="philo-quote font-sans text-headline font-medium tracking-tighter leading-tight opacity-90">
          Fluent in markets, cultures, and the <span className="text-accent">ethics between them</span>.
        </p>
      </div>
    </section>
  );
});

PhilosophySection.displayName = 'PhilosophySection';

export default PhilosophySection;
