import html2canvas from 'html2canvas';

/**
 * canvasRenderer implements the "Baking" part of the Hybrid Rendering Engine.
 * It takes a DOM element (that may contain complex CSS transforms, filters, etc. not supported by email clients)
 * and bakes it into a static Base64 image.
 */
export async function bakeElementToImage(element: HTMLElement, scale: number = 2): Promise<string> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: null, // preserve transparency
    logging: false
  });

  return canvas.toDataURL('image/png');
}

/**
 * Analyzes the DOM for elements that require baking before export.
 * For example, elements with 'data-transform' or 'data-filter' or that are inside MoveableWrapper
 * could be flagged and baked.
 *
 * Returns a clone of the DOM with these elements replaced by their baked <img> equivalents.
 */
export async function processDomForStaticExport(sourceContainer: HTMLElement): Promise<HTMLElement> {
  const clone = sourceContainer.cloneNode(true) as HTMLElement;

  // Find elements that have been transformed via inline styles
  const moveableElements = clone.querySelectorAll<HTMLElement>('[style*="transform"]');

  for (const el of moveableElements) {
    if (!el.id) continue;
    // We match the element in the original DOM to bake it since html2canvas needs elements attached to the document body to render correctly
    // or we can bake the clone if it is temporarily attached. But bakeElementToImage takes the original to get actual computed styles easily.
    // For simplicity, we just bake the element from the original container if we can find it by index or ID.
    // In our app, MoveableWrappers have specific IDs or we can find them.
    // Actually, `html2canvas` can render elements from the live DOM better.

    // We will attempt to find the original node by matching the outerHTML or an ID.
    // Since we check !el.id above, this is safe.
    const originalEl = sourceContainer.querySelector(`[id="${el.id}"]`) as HTMLElement;
    if (originalEl) {
      try {
        const base64 = await bakeElementToImage(originalEl);
        const img = document.createElement('img');
        img.src = base64;

        // Preserve positioning styles safely for email
        // Standard email clients do not support 'transform' or absolute positioning well
        // We will extract translate values and apply them as margins
        const transformStr = el.style.transform;
        let translateX = 0;
        let translateY = 0;
        if (transformStr) {
          const match = transformStr.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
          if (match) {
            translateX = parseFloat(match[1]);
            translateY = parseFloat(match[2]);
          }
        }

        // Apply margins for relative positioning
        img.style.display = 'block';
        img.style.marginLeft = `${translateX}px`;
        img.style.marginTop = `${translateY}px`;

        // Preserve specific zIndex or other safe inline styles
        img.style.zIndex = el.style.zIndex;
        img.id = el.id;

        el.parentNode?.replaceChild(img, el);
      } catch (e) {
        console.error("Failed to bake element to image:", e);
      }
    }
  }

  return clone;
}
