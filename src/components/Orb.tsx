import { forwardRef } from 'react';

interface OrbProps {
  variant?: 'default' | 'purple' | 'blue';
  className?: string;
}

const Orb = forwardRef<HTMLDivElement, OrbProps>(({ variant = 'default', className = '' }, ref) => {
  const variantClass = variant === 'purple' ? 'purple' : variant === 'blue' ? 'blue' : '';
  
  return (
    <div 
      ref={ref}
      className={`orb ${variantClass} ${className}`}
    />
  );
});

Orb.displayName = 'Orb';

export default Orb;
