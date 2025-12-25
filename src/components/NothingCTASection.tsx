import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';

const NothingCTASection = forwardRef<HTMLElement>((_, ref) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section ref={ref} id="nothing-cta" className="relative py-24 md:py-32 w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <Link 
          to="/nothing"
          className="group block w-full max-w-3xl mx-auto"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div 
            className="relative border border-secondary/30 hover:border-secondary/60 transition-all duration-500 px-8 py-12 md:px-16 md:py-16 flex items-center justify-center overflow-hidden"
          >
            {/* Glitch layers */}
            {isHovered && (
              <>
                <h2 
                  className="absolute text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-center"
                  style={{
                    color: '#ff0000',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    clipPath: 'inset(0 0 50% 0)',
                    animation: 'glitch-1 0.2s infinite linear alternate-reverse',
                  }}
                >
                  DO YOU WORK AT NOTHING?
                </h2>
                <h2 
                  className="absolute text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-center"
                  style={{
                    color: '#00ffff',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    clipPath: 'inset(50% 0 0 0)',
                    animation: 'glitch-2 0.3s infinite linear alternate-reverse',
                  }}
                >
                  DO YOU WORK AT NOTHING?
                </h2>
              </>
            )}
            
            <h2 
              className={`text-xl md:text-2xl lg:text-3xl font-medium tracking-[0.3em] uppercase text-secondary group-hover:text-foreground transition-colors duration-500 text-center ${isHovered ? 'glitch-text' : ''}`}
            >
              DO YOU WORK AT NOTHING?
            </h2>
          </div>
        </Link>
      </div>

      <style>{`
        @keyframes glitch-1 {
          0% { transform: translateX(-50%) translate(2px, 0); }
          25% { transform: translateX(-50%) translate(-2px, 1px); }
          50% { transform: translateX(-50%) translate(1px, -1px); }
          75% { transform: translateX(-50%) translate(-1px, 2px); }
          100% { transform: translateX(-50%) translate(0, -2px); }
        }
        @keyframes glitch-2 {
          0% { transform: translateX(-50%) translate(-2px, 0); }
          25% { transform: translateX(-50%) translate(1px, -1px); }
          50% { transform: translateX(-50%) translate(-1px, 2px); }
          75% { transform: translateX(-50%) translate(2px, 1px); }
          100% { transform: translateX(-50%) translate(0, 2px); }
        }
        .glitch-text {
          animation: glitch-main 0.1s infinite;
        }
        @keyframes glitch-main {
          0%, 100% { text-shadow: none; }
          25% { text-shadow: -2px 0 #ff0000, 2px 0 #00ffff; }
          50% { text-shadow: 2px 0 #ff0000, -2px 0 #00ffff; }
          75% { text-shadow: -1px 0 #ff0000, 1px 0 #00ffff; }
        }
      `}</style>
    </section>
  );
});

NothingCTASection.displayName = 'NothingCTASection';

export default NothingCTASection;
