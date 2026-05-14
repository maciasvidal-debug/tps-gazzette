import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { logger } from '../utils/logger';
import type { GazzetteState } from '../types/gazzette';

export type ExportMode = 'standard' | 'print' | 'pdf20';

export const exportPdf = async (state: GazzetteState, mode: ExportMode = 'standard') => {
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
      
      // Determine quality settings based on mode
      let renderScale = 2;
      let format = 'image/jpeg';
      let compressionQuality = 0.95;

      if (mode === 'standard') {
        renderScale = 1.5; // Good enough for digital, keeps file size low
        compressionQuality = 0.85;
      } else if (mode === 'print') {
        renderScale = 4; // High resolution for print
        compressionQuality = 1.0;
      } else if (mode === 'pdf20') {
        renderScale = 5; // Max resolution, simulating high-end standard
        format = 'image/png'; // Lossless compression
        compressionQuality = 1.0;
      }

      // html2canvas configuration for best quality
      const canvas = await html2canvas(pageEl, {
        scale: renderScale,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#FCFAF5', // tps-paper
      });

      const imgData = canvas.toDataURL(format, compressionQuality);

      if (i > 0) {
        pdf.addPage([1024, 1448], 'portrait');
      }

      const jsPdfFormat = format === 'image/png' ? 'PNG' : 'JPEG';
      pdf.addImage(imgData, jsPdfFormat, 0, 0, 1024, 1448);
    }

    let suffix = '';
    if (mode === 'print') suffix = '_Print';
    if (mode === 'pdf20') suffix = '_MaxQ';
    const filename = `TPS_Gazzette_${state.masthead.date.replace(/ /g, '_')}${suffix}.pdf`;

    // Add some basic metadata to simulate professional output
    pdf.setProperties({
        title: `Gazzette ${state.masthead.date}`,
        subject: 'Gazzette Export',
        author: 'The Product Shift',
        keywords: mode === 'pdf20' ? 'PDF 2.0, Archival, High Quality' : 'Gazzette',
        creator: 'Gazzette Editor'
    });

    pdf.save(filename);

    logger.info("PDF export complete.");
  } catch (error) {
    logger.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF. Check console for details.", { cause: error });
  }
};
