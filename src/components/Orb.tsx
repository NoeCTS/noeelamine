import { forwardRef } from 'react';

interface OrbProps {
  className?: string;
}

const Orb = forwardRef<HTMLDivElement, OrbProps>(({ className = '' }, ref) => {
  return (
    <div 
      ref={ref}
      className={`orb ${className}`}
    >
      {/* Inner core for additional glow effects */}
      <div className="orb-core" />
      {/* Outer glow layer */}
      <div className="orb-glow" />
    </div>
  );
});

Orb.displayName = 'Orb';

export default Orb;
