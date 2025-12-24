import { forwardRef } from 'react';

const ContactSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="contact" className="relative h-screen w-full flex flex-col items-center justify-center z-20">
      <div className="text-center mb-24">
        <h2 className="text-headline font-semibold tracking-tighter mb-8 contact-reveal translate-y-12 opacity-0">
          Let's talk.
        </h2>
        <a 
          href="mailto:ne25@imperial.ac.uk" 
          className="animated-link text-title text-secondary hover:text-foreground transition-colors block mb-12 contact-reveal translate-y-12 opacity-0"
        >
          ne25@imperial.ac.uk
        </a>
        
        <div className="flex gap-12 justify-center text-sm font-medium tracking-wide text-tertiary uppercase contact-reveal translate-y-12 opacity-0">
          <a href="#" className="animated-link hover:text-foreground transition-colors">LinkedIn</a>
          <a href="#" className="animated-link hover:text-foreground transition-colors">GitHub</a>
          <a href="#" className="animated-link hover:text-foreground transition-colors">Read.cv</a>
        </div>
      </div>
      
      <footer className="absolute bottom-12 w-full text-center text-xs text-tertiary uppercase tracking-widest contact-reveal opacity-0">
        © 2025 Noe Elamine — London, UK
      </footer>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
