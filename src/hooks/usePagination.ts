import { useState, useLayoutEffect } from 'react';
import type { RefObject } from 'react';

export const usePagination = (
  contentRef: RefObject<HTMLDivElement | null>,
  dependencies: unknown[],
  maxHeight: number
) => {
  const [splitIndex, setSplitIndex] = useState<number | null>(null);

  // useLayoutEffect runs synchronously after DOM mutations but before browser paint
  useLayoutEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    // Reset any previous splits
    setSplitIndex(null);

    // Wait a brief moment to ensure all React renders (like Markdown conversions) are done
    const timer = setTimeout(() => {
      if (!container) return;

      const children = Array.from(container.children) as HTMLElement[];
      if (children.length === 0) return;

      // Make all children visible to measure true height
      children.forEach(c => { c.style.display = ''; });

      const isOverflowing = () => container.scrollHeight > maxHeight;

      if (!isOverflowing()) {
        setSplitIndex(null);
        return;
      }

      // Hide children from the end one by one until it fits
      let i = children.length - 1;
      while (i > 0 && isOverflowing()) {
        children[i].style.display = 'none';
        i--;
      }

      // The split index is the first element that was hidden (i + 1)
      // Math.max guarantees we show at least one element.
      const indexToSplit = Math.max(1, i + 1);

      // Restore displays so React can manage them properly going forward
      children.forEach(c => { c.style.display = ''; });

      setSplitIndex(indexToSplit);
    }, 50); // Give fonts/styles a tiny bit of time to settle

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, maxHeight, contentRef]);

  return splitIndex;
};
