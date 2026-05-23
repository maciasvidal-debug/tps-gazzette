import React from 'react';

interface CanvasOverlayProps {
  isActive: boolean;
  children: React.ReactNode;
}

export const CanvasOverlay: React.FC<CanvasOverlayProps> = ({
  isActive,
  children
}) => {
  // In a more complex scenario, CanvasOverlay would manage multiple moveable elements
  // and handle grouping, alignment, etc. For now it acts as a transparent wrapper
  // that provides context for the free design mode.

  return (
    <div className={`canvas-overlay ${isActive ? 'free-design-active' : ''} w-full h-full relative`}>
      {isActive && (
        <div className="absolute top-0 left-0 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 z-50 pointer-events-none opacity-50">
          FREE DESIGN MODE ACTIVE
        </div>
      )}
      {children}
    </div>
  );
};
