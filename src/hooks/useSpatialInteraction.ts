import { useCallback } from 'react';
import type { TransformState } from '../types/gazzette';

const PAGE_WIDTH = 1024;
const PAGE_HEIGHT = 1448;

export function useSpatialInteraction(
  onTransformChange?: (id: string, transform: TransformState) => void
) {
  const handleDrag = useCallback(
    (id: string, translate: [number, number], prevTransform?: TransformState) => {
      // Apply mathematical boundary checks to prevent elements from being dragged completely off screen
      const boundedTranslate: [number, number] = [
        Math.max(-PAGE_WIDTH * 0.8, Math.min(PAGE_WIDTH * 0.8, translate[0])),
        Math.max(-PAGE_HEIGHT * 0.8, Math.min(PAGE_HEIGHT * 0.8, translate[1]))
      ];

      const transform: TransformState = {
        translate: boundedTranslate,
        rotate: prevTransform?.rotate || 0,
        scale: prevTransform?.scale || [1, 1],
      };
      if (onTransformChange) onTransformChange(id, transform);
    },
    [onTransformChange]
  );

  const handleScale = useCallback(
    (id: string, scale: [number, number], translate: [number, number], prevTransform?: TransformState) => {
      // Prevent mathematically invalid or extreme scales
      const boundedScale: [number, number] = [
        Math.max(0.1, Math.min(5, scale[0])),
        Math.max(0.1, Math.min(5, scale[1]))
      ];

      const transform: TransformState = {
        translate,
        rotate: prevTransform?.rotate || 0,
        scale: boundedScale,
      };
      if (onTransformChange) onTransformChange(id, transform);
    },
    [onTransformChange]
  );

  const handleRotate = useCallback(
    (id: string, rotate: number, translate: [number, number], prevTransform?: TransformState) => {
      // Normalize rotation to 0-360 degrees
      let normalizedRotate = rotate % 360;
      if (normalizedRotate < 0) normalizedRotate += 360;

      const transform: TransformState = {
        translate,
        rotate: normalizedRotate,
        scale: prevTransform?.scale || [1, 1],
      };
      if (onTransformChange) onTransformChange(id, transform);
    },
    [onTransformChange]
  );

  return { handleDrag, handleScale, handleRotate };
}
