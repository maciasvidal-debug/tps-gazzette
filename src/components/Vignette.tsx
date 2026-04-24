import React from 'react';

interface VignetteProps {
  className?: string;
  style?: 'classic' | 'science' | 'writing' | 'medical';
}

export const Vignette: React.FC<VignetteProps> = ({ className = "w-24 h-6 text-tps-primary", style = 'classic' }) => {
  if (style === 'science') {
    return (
      <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Microscope / Atom caricature */}
        <circle cx="50" cy="20" r="8" className="ink-stroke" />
        <ellipse cx="50" cy="20" rx="16" ry="6" className="ink-stroke" transform="rotate(45 50 20)" />
        <ellipse cx="50" cy="20" rx="16" ry="6" className="ink-stroke" transform="rotate(-45 50 20)" />
        <path d="M10 20 Q 30 5, 40 20 T 90 20" className="ink-stroke" strokeDasharray="2 4" />
      </svg>
    );
  }

  if (style === 'writing') {
    return (
      <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Quill and Ink */}
        <path d="M30 35 L50 10 C 60 0, 70 5, 65 15 C 60 25, 45 20, 30 35" className="ink-stroke" />
        <path d="M45 15 L55 25" className="ink-stroke" />
        <path d="M40 20 L50 30" className="ink-stroke" />
        <path d="M25 35 Q 30 38, 35 35" className="ink-stroke-thick" />
        <circle cx="20" cy="30" r="1.5" fill="currentColor" />
        <circle cx="75" cy="15" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (style === 'medical') {
    return (
      <svg className={className} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Caduceus / Snake & Staff hint */}
        <path d="M50 5 L50 35" className="ink-stroke-thick" />
        <path d="M40 15 C 45 5, 55 5, 60 15 C 65 25, 35 25, 40 35" className="ink-stroke" />
        <path d="M60 15 C 55 5, 45 5, 40 15 C 35 25, 65 25, 60 35" className="ink-stroke" />
        <path d="M15 20 L35 20 M25 10 L25 30" className="ink-stroke" />
        <path d="M85 20 L65 20 M75 10 L75 30" className="ink-stroke" />
      </svg>
    );
  }

  // Classic Swirl
  return (
    <svg className={className} viewBox="0 0 100 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10,10 Q30,0 50,10 T90,10"
        className="ink-stroke"
      />
      <path
        d="M20,10 Q40,20 60,10 T80,10"
        className="ink-stroke"
      />
      <path
        d="M45,8 L55,12 M48,12 L52,8"
        className="ink-stroke"
      />
    </svg>
  );
};
