import type { GazzetteState } from '../types/gazzette';
import { processDomForStaticExport } from './canvasRenderer';

export const exportInteractiveWeb = async (state: GazzetteState) => {
  try {
    // Collect HTML from the rendered pages
    const pages: HTMLElement[] = [];
    let pageIndex = 1;
    while (true) {
      const el = document.getElementById(`gazzette-document-page${pageIndex}`);
      if (!el) {
          if (pageIndex > 1) break;
          // Fallback if structure changes
          const allPages = document.querySelectorAll('.bg-tps-paper.w-\\[1024px\\]');
          if (allPages.length > 0) {
            allPages.forEach(p => pages.push(p as HTMLElement));
          }
          break;
      }
      pages.push(el);
      pageIndex++;
    }

    if (pages.length === 0) {
      throw new Error("Could not find any pages to export in the DOM.");
    }

    // We clone the nodes so we can clean them up without affecting the live UI
    const clonedPages = await Promise.all(pages.map(p => processDomForStaticExport(p)));

    // Clean up Moveable wrappers (remove borders, etc)
    clonedPages.forEach(page => {
      // Remove hover outlines and cursor rules
      const moveables = page.querySelectorAll('[class*="cursor-move"]');
      moveables.forEach(m => {
         m.classList.remove('cursor-move', 'hover:outline', 'hover:outline-2', 'hover:outline-blue-500/50');
      });
      // Remove generic UI classes not needed in static
      const editables = page.querySelectorAll('.cursor-text, .border-dashed, [title="Click to edit"]');
      editables.forEach(e => {
         e.classList.remove('cursor-text', 'border', 'border-dashed', 'border-[#ED6A5E]', 'hover:outline', 'hover:outline-1', 'hover:outline-dashed', 'hover:outline-gray-400');
         e.removeAttribute('title');
      });
    });

    const pagesHtml = clonedPages.map(p => p.outerHTML).join('\\n\\n');

    // Build the final standalone HTML document
    const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.masthead.title} - ${state.masthead.date}</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">

    <!-- Tailwind CSS (CDN for standalone file) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            colors: {
              tps: {
                primary: '${state.themeColors?.primary || '#3c2065'}',
                accent1: '${state.themeColors?.accent1 || '#5e3898'}',
                accent2: '${state.themeColors?.accent2 || '#eb5f5b'}',
                quote: '${state.themeColors?.quote || '#9c3143'}',
                paper: '#FCFAF5',
                text: '${state.themeColors?.text || '#2D2B3B'}',
              }
            },
            fontFamily: {
              sans: ['"Open Sans"', 'sans-serif'],
              serif: ['"Lora"', 'serif'],
            }
          }
        }
      }
    </script>

    <style>
      body {
        background-color: #E5E5E5;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px 0;
        gap: 40px;
        margin: 0;
      }
      /* Custom tweaks */
      .editorial-text { font-family: 'Lora', serif; }
      a { transition: color 0.2s; }
      a:hover { opacity: 0.8; }
      /* Disable pointer events on images to prevent drag highlight if not a link */
      img:not(a img) { pointer-events: none; }
    </style>
</head>
<body>
    ${pagesHtml}
</body>
</html>`;

    // Trigger download
    const blob = new Blob([htmlTemplate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `TPS_Gazzette_${state.masthead.date.replace(/ /g, '_')}_Interactive.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error("Error generating HTML:", error);
    throw new Error("Failed to export Interactive Web version. Check console for details.", { cause: error });
  }
};
