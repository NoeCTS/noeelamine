import { forwardRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ContactSection = forwardRef<HTMLElement>((_, ref) => {
  const [easterEggTriggered, setEasterEggTriggered] = useState(false);
  const navigate = useNavigate();

  const handleEasterEgg = () => {
    setEasterEggTriggered(true);
    // Glitch animation before navigating
    document.body.style.animation = 'glitch 0.3s ease-in-out';
    setTimeout(() => {
      navigate('/nothing');
    }, 400);
  };

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
          <a href="https://linkedin.com/in/noeelamine" target="_blank" rel="noopener noreferrer" className="animated-link hover:text-foreground transition-colors">LinkedIn</a>
          <a href="https://aube-ai.com" target="_blank" rel="noopener noreferrer" className="animated-link hover:text-foreground transition-colors">Aube</a>
          <a href="https://betteride.eu" target="_blank" rel="noopener noreferrer" className="animated-link hover:text-foreground transition-colors">Betteride</a>
        </div>
      </div>
      
      {/* Easter egg trigger */}
      <div className="absolute bottom-24 contact-reveal opacity-0">
        <button
          onClick={handleEasterEgg}
          className={`text-xs tracking-widest uppercase transition-all duration-500 group ${
            easterEggTriggered 
              ? 'text-foreground scale-110' 
              : 'text-tertiary/30 hover:text-tertiary hover:tracking-[0.3em]'
          }`}
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→ </span>
          Do you work at Nothing?
          <span className="opacity-0 group-hover:opacity-100 transition-opacity"> ←</span>
        </button>
      </div>
      
      <footer className="absolute bottom-12 w-full text-center text-xs text-tertiary uppercase tracking-widest contact-reveal opacity-0">
        © 2025 Noe Elamine — London, UK
      </footer>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;
