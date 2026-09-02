import { forwardRef } from 'react';
import { usePageTransition } from './PageTransition';
import aubeDashboard from '@/assets/aube-dashboard.png';
import betterideFlyer1 from '@/assets/betteride-flyer-1.jpg';
import betterideFlyer2 from '@/assets/betteride-flyer-2.jpg';
import betterideFlyer3 from '@/assets/betteride-flyer-3.png';
import claudeClub from '@/assets/claude-club.jpeg';

interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  highlights: string[];
  challenge?: string;
  approach?: string;
  outcome?: string;
  ctaPath?: string;
  ctaLabel?: string;
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
    challenge: 'Brands miss cultural risk before launch.',
    approach: 'Built a screening workflow blending AI analysis with applied strategy.',
    outcome: 'Shipped platform MVP and early partnerships across impact-focused teams.',
    ctaPath: '/aube',
    ctaLabel: 'Open case study',
    letter: 'A',
    image: aubeDashboard,
  },
  {
    id: 'project-betteride',
    name: 'BETTERIDE',
    role: 'Strategy & Marketing Freelancer',
    description: 'Built and executed a zero-budget GTM for a Berlin bike-repair marketplace facing a two-sided cold start.',
    highlights: [
      'Designed 5-tactic guerrilla activation system for Charlottenburg',
      'Created trust-first B2B model for skeptical local repair shops',
      'Executed full launch solo, from market analysis to field deployment',
    ],
    challenge: 'Acquire cyclists and repair shops at the same time with almost no budget.',
    approach: 'Concentrated geography, physical activation, and risk-free B2B onboarding.',
    outcome: 'Created local visibility density and a credible path for partner conversion.',
    ctaPath: '/betteride',
    ctaLabel: 'Read full GTM case',
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
    challenge: 'Scale a meaningful AI community without diluting quality.',
    approach: 'Programmed high-signal events and practical ethics frameworks.',
    outcome: 'Grew to 1,000+ members with flagship partnerships and recurring events.',
    letter: 'C',
    image: claudeClub,
  },
];

const ProjectsSection = forwardRef<HTMLElement>((_, ref) => {
  const { navigateWithTransition } = usePageTransition();

  return (
    <section ref={ref} id="projects" className="relative py-section w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-24">
          {/* Sticky Label */}
          <div className="md:w-1/4">
            <div className="sticky top-32 text-sm font-medium tracking-wide text-secondary uppercase">
              What I worked on
            </div>
          </div>

          {/* Project List */}
          <div className="md:w-3/4 flex flex-col gap-[30vh]">
            {projects.map((project) => (
              <div 
                key={project.id}
                id={project.id}
                className="project-card group relative"
              >
                <div className="mb-8">
                  <span className="text-sm font-medium tracking-wide text-accent uppercase mb-2 block">
                    {project.role}
                  </span>
                  <h3 className="text-headline font-semibold tracking-tighter mb-3">
                    {project.name}
                  </h3>
                  <p className="text-body text-secondary max-w-lg mb-6">
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
                  {project.challenge && project.approach && project.outcome && (
                    <div className="mt-6 grid md:grid-cols-3 gap-3">
                      <div className="border border-foreground/10 p-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-secondary mb-1">Challenge</p>
                        <p className="text-xs text-tertiary leading-relaxed">{project.challenge}</p>
                      </div>
                      <div className="border border-foreground/10 p-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-secondary mb-1">Approach</p>
                        <p className="text-xs text-tertiary leading-relaxed">{project.approach}</p>
                      </div>
                      <div className="border border-foreground/10 p-3">
                        <p className="text-[10px] uppercase tracking-[0.16em] text-secondary mb-1">Outcome</p>
                        <p className="text-xs text-tertiary leading-relaxed">{project.outcome}</p>
                      </div>
                    </div>
                  )}
                  {project.ctaPath && project.ctaLabel && (
                    <button
                      onClick={() => navigateWithTransition(project.ctaPath)}
                      className="mt-5 text-xs uppercase tracking-[0.18em] border border-accent/40 text-accent px-4 py-2 hover:bg-accent hover:text-background transition-all"
                    >
                      {project.ctaLabel}
                    </button>
                  )}
                </div>
                
                {/* Multiple images grid */}
                {project.images ? (
                  <div className="grid grid-cols-3 gap-4">
                    {project.images.map((img, i) => (
                      <div key={i} className="relative bg-elevated rounded-xl overflow-hidden border border-foreground/5 group-hover:border-accent/20 transition-colors">
                        <img 
                          src={img} 
                          alt={`${project.name} - ${i + 1}`}
                          className="w-full h-auto"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="relative bg-elevated rounded-2xl overflow-hidden border border-foreground/5 group-hover:border-accent/20 transition-colors">
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
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

ProjectsSection.displayName = 'ProjectsSection';

export default ProjectsSection;
