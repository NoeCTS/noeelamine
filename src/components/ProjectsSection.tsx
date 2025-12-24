import { forwardRef } from 'react';

interface Project {
  id: string;
  name: string;
  description: string;
  letter: string;
}

const projects: Project[] = [
  {
    id: 'project-aube',
    name: 'AUBE',
    description: 'Cultural intelligence for global marketing teams.',
    letter: 'A',
  },
  {
    id: 'project-betteride',
    name: 'BETTERIDE',
    description: "Guerrilla marketing for Berlin's streets.",
    letter: 'B',
  },
  {
    id: 'project-claude',
    name: 'CLAUDE CLUB',
    description: 'Led AI ethics for 1,000+ members.',
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
                  <h3 className="text-headline font-semibold tracking-tighter mb-2">
                    {project.name}
                  </h3>
                  <p className="text-body text-secondary max-w-md">
                    {project.description}
                  </p>
                </div>
                <div className="relative aspect-[16/9] bg-elevated rounded-2xl overflow-hidden border border-foreground/5">
                  <div className="absolute inset-0 flex items-center justify-center text-foreground/10 text-9xl font-bold select-none">
                    {project.letter}
                  </div>
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
