import { useState, useEffect } from 'react';
import type { RefObject } from 'react';

// Measure how many paragraphs fit into a given container height.
export const usePagination = (
  contentRef: RefObject<HTMLDivElement | null>,
  paragraphs: string[],
  maxHeight: number
) => {
  const [splitIndex, setSplitIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    // Simple height check: if the content is taller than max height, find where to split.
    const container = contentRef.current;

    // Reset index to measure full height
    setSplitIndex(null);

    // Give DOM a frame to render the full text
    requestAnimationFrame(() => {
      if (!container) return;

      const totalHeight = container.scrollHeight;

      if (totalHeight > maxHeight) {
        // Find which child paragraph pushes it over the edge
        let accumulatedHeight = 0;
        const children = Array.from(container.children);

        for (let i = 0; i < children.length; i++) {
          const child = children[i] as HTMLElement;
          const childHeight = child.offsetHeight + parseFloat(window.getComputedStyle(child).marginBottom);

          if (accumulatedHeight + childHeight > maxHeight) {
            // Split here. Ensure at least one paragraph stays if it's huge.
            setSplitIndex(Math.max(1, i));
            return;
          }
          accumulatedHeight += childHeight;
        }
      }
    });
  }, [paragraphs, maxHeight, contentRef]);

  return splitIndex;
};
