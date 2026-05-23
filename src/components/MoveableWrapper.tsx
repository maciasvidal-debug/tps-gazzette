import React, { useRef, useState, useEffect } from 'react';
import Moveable from 'react-moveable';
import type { TransformState } from '../types/gazzette';
import { useSpatialInteraction } from '../hooks/useSpatialInteraction';

interface MoveableWrapperProps {
  id: string;
  children: React.ReactNode;
  isActive: boolean;
  initialTransform?: TransformState;
  onTransformChange: (id: string, transform: TransformState) => void;
  className?: string;
  zIndex?: number;
}

export const MoveableWrapper: React.FC<MoveableWrapperProps> = ({
  id,
  children,
  isActive,
  initialTransform,
  onTransformChange,
  className = "",
  zIndex
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [target, setTarget] = useState<HTMLElement | null>(null);

  // Initialize from saved state or default
  const [transform, setTransform] = useState<TransformState>(initialTransform || {
    translate: [0, 0],
    rotate: 0,
    scale: [1, 1],
  });

  useEffect(() => {
    if (targetRef.current) {
      setTarget(targetRef.current);
    }
  }, []);

  // Update DOM inline styles based on transform state
  useEffect(() => {
    if (targetRef.current) {
      targetRef.current.style.transform = `translate(${transform.translate[0]}px, ${transform.translate[1]}px) rotate(${transform.rotate}deg) scale(${transform.scale[0]}, ${transform.scale[1]})`;
    }
  }, [transform]);

  const saveTransformToGlobal = (elementId: string, newTransform: TransformState) => {
    onTransformChange(elementId, newTransform);
  };

  const { handleDrag, handleScale, handleRotate } = useSpatialInteraction(saveTransformToGlobal);

  return (
    <>
      <div
        ref={targetRef}
        className={`${className} ${isActive ? 'cursor-move hover:outline hover:outline-2 hover:outline-blue-500/50' : ''}`}
        style={{ zIndex: zIndex !== undefined ? zIndex : (isActive ? 50 : 'auto'), position: 'relative' }}
      >
        {children}
      </div>

      {isActive && target && (
        <Moveable
          target={target}
          draggable={true}
          resizable={false} // Use scale instead for non-destructive resizing
          scalable={true}
          rotatable={true}
          keepRatio={true}
          snappable={true}
          snapCenter={true}
          elementGuidelines={['.cursor-move']}
          verticalGuidelines={[0, 512, 1024]}
          horizontalGuidelines={[0, 724, 1448]}
          onDrag={e => {
            setTransform(prev => ({ ...prev, translate: e.beforeTranslate as [number, number] }));
          }}
          onDragEnd={() => {
            handleDrag(id, transform.translate, transform);
          }}
          onScale={e => {
            setTransform(prev => ({ ...prev, scale: e.scale as [number, number], translate: e.drag.beforeTranslate as [number, number] }));
          }}
          onScaleEnd={() => {
            handleScale(id, transform.scale, transform.translate, transform);
          }}
          onRotate={e => {
            setTransform(prev => ({ ...prev, rotate: e.beforeRotate, translate: e.drag.beforeTranslate as [number, number] }));
          }}
          onRotateEnd={() => {
            handleRotate(id, transform.rotate, transform.translate, transform);
          }}
          // Aesthetics for the editor
          origin={false}
          renderDirections={["nw", "ne", "sw", "se"]}
        />
      )}
    </>
  );
};
