import { forwardRef } from 'react';

const PhilosophySection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="philosophy" className="relative h-screen w-full flex items-center justify-center">
      <div className="container mx-auto px-6 max-w-4xl text-center z-20">
        <p className="philo-quote font-sans text-headline font-medium tracking-tighter leading-tight opacity-90">
          "I build tools that don't just optimize—they <span className="text-accent">understand</span>."
        </p>
      </div>
    </section>
  );
});

PhilosophySection.displayName = 'PhilosophySection';

export default PhilosophySection;
