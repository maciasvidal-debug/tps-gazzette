import React from 'react';

interface VignetteProps {
  className?: string;
}

export const Vignette: React.FC<VignetteProps> = ({ className }) => (
  <svg 
    viewBox="0 0 100 20" 
    className={`w-24 h-5 text-tps-primary ${className}`}
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Emulating classic ink engravings with cross-hatching */}
    <path d="M 0 10 Q 25 0, 50 10 T 100 10" className="ink-stroke" />
    <path d="M 0 12 Q 25 2, 50 12 T 100 12" className="ink-stroke opacity-70" />
    <path d="M 0 8 Q 25 -2, 50 8 T 100 8" className="ink-stroke opacity-70" />
    
    <path d="M 45 5 L 55 15" className="ink-stroke" />
    <path d="M 47 4 L 57 14" className="ink-stroke opacity-50" />
    <path d="M 43 6 L 53 16" className="ink-stroke opacity-50" />
    
    <path d="M 55 5 L 45 15" className="ink-stroke" />
    <path d="M 57 6 L 47 16" className="ink-stroke opacity-50" />
    <path d="M 53 4 L 43 14" className="ink-stroke opacity-50" />
  </svg>
);