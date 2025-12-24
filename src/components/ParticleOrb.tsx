import { forwardRef, useMemo } from 'react';

interface Particle {
  id: number;
  angle: number;
  size: number;
  opacity: number;
  delay: number;
}

interface ParticleOrbProps {
  className?: string;
  particleCount?: number;
}

const ParticleOrb = forwardRef<HTMLDivElement, ParticleOrbProps>(
  ({ className = '', particleCount = 60 }, ref) => {
    // Generate particles with randomized properties
    const particles = useMemo<Particle[]>(() => {
      return Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        angle: (360 / particleCount) * i + (Math.random() - 0.5) * 20,
        size: 4 + Math.random() * 16,
        opacity: 0.4 + Math.random() * 0.6,
        delay: Math.random() * 0.5,
      }));
    }, [particleCount]);

    return (
      <div ref={ref} className={`particle-orb ${className}`}>
        {/* Central Core - The nucleus that remains during dispersion */}
        <div className="particle-core" />
        
        {/* Outer glow layer */}
        <div className="particle-core-glow" />
        
        {/* Individual Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            data-index={particle.id}
            style={{
              '--particle-angle': `${particle.angle}deg`,
              '--particle-size': `${particle.size}px`,
              '--particle-opacity': particle.opacity,
              '--particle-delay': `${particle.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    );
  }
);

ParticleOrb.displayName = 'ParticleOrb';

export default ParticleOrb;
