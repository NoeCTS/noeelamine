import { forwardRef } from 'react';

interface Experience {
  year: string;
  title: string;
  role?: string;
  description: string;
  location: string;
}

const experiences: Experience[] = [
  {
    year: '2025',
    title: 'Aube',
    role: 'Founder',
    description: 'Built an AI-powered cultural intelligence platform screening campaigns across 68+ markets.',
    location: 'London, UK',
  },
  {
    year: '2025',
    title: 'Betteride',
    role: 'Strategy & Marketing Freelancer',
    description: 'Owned full marketing function from strategy to execution for Berlin cycling startup.',
    location: 'Berlin, Germany',
  },
  {
    year: '2025',
    title: 'Claude Builder Club',
    role: 'AI Ethics & Impact Co-Lead',
    description: "Built Imperial's largest student org and biggest Claude society worldwide (1,000+ members).",
    location: 'Imperial College London',
  },
  {
    year: '2024',
    title: 'Publicis One Touch',
    role: 'Student Employee',
    description: "Worked on strategy and developed AI evaluation frameworks.",
    location: 'Hamburg, Germany',
  },
  {
    year: '2021-2024',
    title: 'The Journey Begins',
    description: 'German 1st Bundesliga Rugby, U16 National Team, and ESCP Business School across 3 cities.',
    location: 'London — Paris — Berlin',
  },
];

const ExperienceSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="experience" className="relative py-section w-full min-h-screen">
      <div className="container mx-auto px-6 max-w-[1200px] relative">
        {/* Timeline Track */}
        <div className="absolute left-8 md:left-24 top-0 bottom-0 w-[1px] bg-foreground/5" />

        <div className="flex flex-col gap-32 pl-24 md:pl-48">
          {experiences.map((exp, index) => (
            <div key={index} className="exp-item relative">
              <span className="timeline-year text-sm font-medium tracking-wide text-tertiary uppercase block mb-2">
                {exp.year}
              </span>
              <div className="timeline-content">
                <h3 className="text-title font-semibold mb-1">{exp.title}</h3>
                {exp.role && (
                  <p className="text-sm text-accent mb-2">{exp.role}</p>
                )}
                <p className="text-body text-secondary">{exp.description}</p>
                <p className="text-sm text-tertiary mt-2">{exp.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

ExperienceSection.displayName = 'ExperienceSection';

export default ExperienceSection;
