import { forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aubeDashboard from '@/assets/aube-dashboard.png';
import betterideFlyer1 from '@/assets/betteride-flyer-1.jpg';
import betterideFlyer2 from '@/assets/betteride-flyer-2.jpg';
import betterideFlyer3 from '@/assets/betteride-flyer-3.png';
import claudeClub from '@/assets/claude-club.jpeg';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  highlights: string[];
  letter: string;
  image?: string;
  images?: string[];
}

const projects: Project[] = [
  {
    id: 'project-aube',
    name: 'AUBE',
    role: 'Founder',
    description: 'AI-powered cultural intelligence platform that screens marketing campaigns for cultural appropriation, tokenism, and sensitivity issues across 68+ global markets.',
    highlights: [
      'Zero external funding — built with AI tools',
      'Designed AI analysis pipeline from scratch',
      'Developed B2B pricing & NGO partnerships',
    ],
    letter: 'A',
    image: aubeDashboard,
  },
  {
    id: 'project-betteride',
    name: 'BETTERIDE',
    role: 'Strategy & Marketing Freelancer',
    description: 'Owned full marketing function for Berlin-based cycling startup — from strategy to execution.',
    highlights: [
      '"Broken Bike Museum" guerrilla campaign',
      'Analysed cycling traffic patterns for targeting',
      'Designed insight-driven creative for Berlin culture',
    ],
    letter: 'B',
    images: [betterideFlyer1, betterideFlyer2, betterideFlyer3],
  },
  {
    id: 'project-claude',
    name: 'CLAUDE BUILDER CLUB',
    role: 'AI Ethics & Impact Co-Lead',
    description: "Grew Imperial's largest student organisation and the biggest Claude society worldwide to 1,000+ members.",
    highlights: [
      'Organised 100-person Anthropic hackathon on AI safety in nuclear infrastructure',
      'Curated speaker series with leading AI ethics academics (TUM Institute for Ethics in AI)',
      "Translated Anthropic's safety research into practical frameworks for student builders",
    ],
    letter: 'C',
    image: claudeClub,
  },
];

const ProjectsSection = forwardRef<HTMLElement>((_, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    const cards = scrollContainer.querySelectorAll('.project-card');
    const images = scrollContainer.querySelectorAll('.project-image');
    const scrollWidth = scrollContainer.scrollWidth;
    const viewportWidth = window.innerWidth;

    // Main horizontal scroll
    const tween = gsap.to(scrollContainer, {
      x: -(scrollWidth - viewportWidth + 200),
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: () => `+=${scrollWidth - viewportWidth + 200}`,
        scrub: 1.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    // Parallax effect on images - they move slower creating depth
    images.forEach((img, i) => {
      gsap.to(img, {
        x: -80 - (i * 20),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: () => `+=${scrollWidth - viewportWidth + 200}`,
          scrub: 2 + (i * 0.3),
          invalidateOnRefresh: true,
        },
      });
    });

    // Scale and opacity based on position
    cards.forEach((card, i) => {
      gsap.fromTo(card, 
        { opacity: 0.4, scale: 0.92 },
        {
          opacity: 1,
          scale: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: () => `top+=${i * (scrollWidth / cards.length) * 0.5} top`,
            end: () => `top+=${i * (scrollWidth / cards.length) * 0.5 + viewportWidth * 0.5} top`,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        }
      );
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === containerRef.current) {
          st.kill();
        }
      });
    };
  }, []);

  return (
    <section ref={ref} id="projects" className="relative w-full overflow-hidden">
      <div ref={containerRef} className="h-screen flex items-center">
        {/* Section Label */}
        <div className="absolute top-8 left-6 md:left-12 z-10">
          <span className="text-sm font-medium tracking-wide text-secondary uppercase">
            What I worked on
          </span>
        </div>

        {/* Horizontal Scroll Container */}
        <div 
          ref={scrollContainerRef} 
          className="flex gap-16 md:gap-32 lg:gap-48 pl-6 md:pl-12 pr-[50vw] items-start pt-20"
        >
          {projects.map((project, index) => (
            <div 
              key={project.id}
              id={project.id}
              className="project-card group flex-shrink-0 w-[85vw] md:w-[60vw] lg:w-[50vw] max-w-[800px]"
              style={{ 
                transform: `translateY(${index % 2 === 1 ? '40px' : '0'})`,
              }}
            >
              {/* Image First */}
              <div className="project-image mb-6 will-change-transform">
                {project.images ? (
                  <div className="grid grid-cols-3 gap-3">
                    {project.images.map((img, i) => (
                      <div key={i} className="relative bg-elevated rounded-xl overflow-hidden border border-foreground/5 group-hover:border-accent/20 transition-colors duration-500">
                        <img 
                          src={img} 
                          alt={`${project.name} - ${i + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative bg-elevated rounded-2xl overflow-hidden border border-foreground/5 group-hover:border-accent/20 transition-colors duration-500">
                    {project.image ? (
                      <img 
                        src={project.image} 
                        alt={project.name}
                        className="w-full h-auto"
                      />
                    ) : (
                      <div className="aspect-[16/9] flex items-center justify-center text-foreground/10 text-9xl font-bold select-none">
                        {project.letter}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <span className="text-sm font-medium tracking-wide text-accent uppercase mb-2 block">
                  {project.role}
                </span>
                <h3 className="text-3xl md:text-4xl font-semibold tracking-tighter mb-3">
                  {project.name}
                </h3>
                <p className="text-body text-secondary max-w-lg mb-4">
                  {project.description}
                </p>
                <ul className="space-y-2">
                  {project.highlights.map((highlight, i) => (
                    <li key={i} className="text-sm text-tertiary flex items-start gap-2">
                      <span className="text-accent mt-1">→</span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Progress Indicator */}
        <div className="absolute bottom-8 left-6 md:left-12 right-6 md:right-12">
          <div className="h-[1px] bg-foreground/10 w-full overflow-hidden">
            <div className="h-full bg-accent/50 w-0 scroll-progress-bar" />
          </div>
        </div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;
