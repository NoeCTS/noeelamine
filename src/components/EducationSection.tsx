import { forwardRef } from 'react';

interface Education {
  period: string;
  school: string;
  degree: string;
  location: string;
  modules: string[];
}

const education: Education[] = [
  {
    period: '2025 - 2026',
    school: 'Imperial Business School',
    degree: 'MSc in Strategic Marketing',
    location: 'London, UK',
    modules: ['AI Strategies in Marketing', 'Consumer Behaviour', 'Marketing Analytics', 'Market Research'],
  },
  {
    period: '2021 - 2025',
    school: 'ESCP Business School',
    degree: 'BSc in Management',
    location: 'London — Paris — Berlin',
    modules: ['Advanced Statistics', 'CSR & Business Ethics', 'Finance', 'Strategy & Decision-Making'],
  },
];

const EducationSection = forwardRef<HTMLElement>((_, ref) => {
  return (
    <section ref={ref} id="education" className="relative py-section w-full">
      <div className="container mx-auto px-6 max-w-[1400px]">
        <div className="flex flex-col md:flex-row gap-24">
          {/* Sticky Label */}
          <div className="md:w-1/4">
            <div className="sticky top-32 text-sm font-medium tracking-wide text-secondary uppercase">
              Education
            </div>
          </div>

          {/* Education List */}
          <div className="md:w-3/4 flex flex-col gap-16">
            {education.map((edu, index) => (
              <div key={index} className="group">
                <span className="text-sm font-medium tracking-wide text-tertiary uppercase block mb-2">
                  {edu.period}
                </span>
                <h3 className="text-title font-semibold mb-1">{edu.school}</h3>
                <p className="text-body text-accent mb-2">{edu.degree}</p>
                <p className="text-sm text-tertiary mb-4">{edu.location}</p>
                <div className="flex flex-wrap gap-2">
                  {edu.modules.map((module, i) => (
                    <span 
                      key={i}
                      className="text-xs px-3 py-1 rounded-full bg-foreground/5 text-secondary border border-foreground/10"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

EducationSection.displayName = 'EducationSection';

export default EducationSection;
