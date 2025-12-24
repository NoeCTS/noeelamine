import { forwardRef } from 'react';

interface Experience {
  year: string;
  title: string;
  description: string;
  location: string;
}

const experiences: Experience[] = [
  {
    year: '2025',
    title: 'Aube',
    description: 'Founded a cultural intelligence platform.',
    location: 'London',
  },
  {
    year: '2025',
    title: 'Claude Builder Club',
    description: 'AI Ethics Lead for 1,000+ member community.',
    location: 'Imperial College',
  },
  {
    year: '2024',
    title: 'Publicis One Touch',
    description: 'Introduced AI workflows to a 140-person agency.',
    location: 'Hamburg',
  },
  {
    year: '2021',
    title: 'The Journey Begins',
    description: 'Professional Rugby & Business School.',
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
                <h3 className="text-title font-semibold mb-2">{exp.title}</h3>
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
