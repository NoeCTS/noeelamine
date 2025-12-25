import { forwardRef } from 'react';
import aubeDashboard from '@/assets/aube-dashboard.png';
import betterideFlyer from '@/assets/betteride-flyer.png';

interface Project {
  id: string;
  name: string;
  role: string;
  description: string;
  highlights: string[];
  letter: string;
  image?: string;
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
    image: betterideFlyer,
  },
  {
    id: 'project-claude',
    name: 'CLAUDE BUILDER CLUB',
    role: 'AI Ethics & Impact Co-Lead',
    description: "Grew Imperial's largest student organisation and the biggest Claude society worldwide to 1,000+ members.",
    highlights: [
      'Organised 100-person AI safety hackathon',
      'Focus on nuclear emergency detection',
      'Led ethics discussions and flagship events',
    ],
    letter: 'C',
  },
];

const ProjectsSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="projects" className="relative py-section w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-24">
          {/* Sticky Label */}
          <div className="md:w-1/4">
            <div className="sticky top-32 text-sm font-medium tracking-wide text-secondary uppercase">
              What I build
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
                </div>
                <div className="relative aspect-[16/9] bg-elevated rounded-2xl overflow-hidden border border-foreground/5 group-hover:border-accent/20 transition-colors">
                  {project.image ? (
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-foreground/10 text-9xl font-bold select-none">
                      {project.letter}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
                </div>
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
