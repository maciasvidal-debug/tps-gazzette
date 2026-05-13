import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { logger } from '../utils/logger';
import type { GazzetteState } from '../types/gazzette';

export const exportPdf = async (state: GazzetteState, mode: 'digital' | 'print' = 'digital') => {
  logger.info("Starting new exact PDF export...");

  try {
    // Collect all pages by finding the root document container children.
    // The preview wraps pages with IDs like gazzette-document-page1, gazzette-document-page2, etc.
    const pages: HTMLElement[] = [];
    let pageIndex = 1;

    while (true) {
      // Find pages dynamically, or by knowing we have at least 1 and 2, and maybe 3 depending on pagination
      const el = document.getElementById(`gazzette-document-page${pageIndex}`);
      if (!el) {
        if (pageIndex > 1) { // It's fine if we don't find page 3 if it doesn't exist.
            break;
        } else if (pageIndex === 1) {
            // Wait, what if the main preview uses a different structure?
            // In our GazzettePreview, pages are wrapped in a flex container but they don't explicitly have ID page1.
            // Let's grab them by finding all elements with class 'w-[1024px]' which represents our standard paper size.
            const allPages = document.querySelectorAll('.bg-tps-paper.w-\\[1024px\\]');
            if (allPages.length > 0) {
              allPages.forEach(p => pages.push(p as HTMLElement));
            }
            break;
        }
      } else {
         pages.push(el);
      }
      pageIndex++;
    }

    if (pages.length === 0) {
      // Fallback selector
      const fallbackPages = Array.from(document.querySelectorAll('[id^="gazzette-document-page"]')) as HTMLElement[];
      pages.push(...fallbackPages);
    }

    if (pages.length === 0) {
        throw new Error("Could not find any pages to export in the DOM.");
    }

    // A4 dimensions in px (standard 72 dpi is 595x842, let's keep aspect ratio)
    // The on-screen rendering is 1024x1448
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'px',
      format: [1024, 1448]
    });

    for (let i = 0; i < pages.length; i++) {
      const pageEl = pages[i];
      
      // html2canvas configuration for best quality
      const canvas = await html2canvas(pageEl, {
        scale: 2, // 2x resolution for better print quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FCFAF5', // tps-paper
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage([1024, 1448], 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 1024, 1448);
    }

    const filename = `TPS_Gazzette_${state.masthead.date.replace(/ /g, '_')}${mode === 'print' ? '_Print' : ''}.pdf`;
    pdf.save(filename);

    logger.info("PDF export complete.");
  } catch (error) {
    logger.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Check console for details.", { cause: error });
  }
};
