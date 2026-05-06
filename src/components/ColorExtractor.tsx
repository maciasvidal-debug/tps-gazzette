import React, { useState } from 'react';
import { extractColorsFromImage, rgbToHex } from '../utils/colors';
import type { GazzetteState } from '../types/gazzette';

interface Props {
  imageUrl: string;
  updateState: (updater: (draft: GazzetteState) => void | GazzetteState) => void;
}

export const ColorExtractor: React.FC<Props> = ({ imageUrl, updateState }) => {
  const [isExtracting, setIsExtracting] = useState(false);

  const handleExtract = async () => {
    if (!imageUrl) return;
    setIsExtracting(true);
    try {
      const palette = await extractColorsFromImage(imageUrl);
      if (palette && palette.length >= 3) {
        updateState((draft) => {
          draft.themeColors = {
            primary: rgbToHex(palette[0][0], palette[0][1], palette[0][2]),
            accent1: rgbToHex(palette[1][0], palette[1][1], palette[1][2]),
            accent2: rgbToHex(palette[2][0], palette[2][1], palette[2][2]),
            quote: palette.length >= 4 ? rgbToHex(palette[3][0], palette[3][1], palette[3][2]) : draft.themeColors?.quote || '#8b2c39',
            text: '#1f2937' // Keep text color readable
          };
        });
      }
    } catch (e) {
      console.error("Failed to extract colors:", e);
    } finally {
      setIsExtracting(false);
    }
  };

  return (
    <button
      onClick={handleExtract}
      disabled={isExtracting || !imageUrl}
      className="w-full mt-2 bg-[#343541] hover:bg-[#4B4C56] text-[#E5E7EB] py-2 px-3 rounded text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed border border-[#4B4C56]"
      title="Extract colors from image to theme the Gazzette"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
      {isExtracting ? 'Extracting...' : 'Smart Theme from Image'}
    </button>
  );
};
