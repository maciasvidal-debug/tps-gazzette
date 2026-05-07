export const extractColorsFromImage = (imageUrl: string): Promise<number[][]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous'; // Allow cross-origin image requests

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get 2d context');

        // Resize down for performance
        const MAX_DIMENSION = 100;
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > MAX_DIMENSION) {
                height *= MAX_DIMENSION / width;
                width = MAX_DIMENSION;
            }
        } else {
            if (height > MAX_DIMENSION) {
                width *= MAX_DIMENSION / height;
                height = MAX_DIMENSION;
            }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const imageData = ctx.getImageData(0, 0, width, height).data;
        const colorCounts: Record<string, number> = {};

        // Simple color quantization (ignoring alpha)
        const QUANTIZE_FACTOR = 32; // group colors

        for (let i = 0; i < imageData.length; i += 16) { // Sample every 4th pixel to speed up
            const r = Math.round(imageData[i] / QUANTIZE_FACTOR) * QUANTIZE_FACTOR;
            const g = Math.round(imageData[i+1] / QUANTIZE_FACTOR) * QUANTIZE_FACTOR;
            const b = Math.round(imageData[i+2] / QUANTIZE_FACTOR) * QUANTIZE_FACTOR;
            const a = imageData[i+3];

            if (a < 128) continue; // skip transparent pixels

            const key = `${r},${g},${b}`;
            colorCounts[key] = (colorCounts[key] || 0) + 1;
        }

        // Sort by count
        const sortedColors = Object.entries(colorCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([key]) => key.split(',').map(Number));

        // Filter out grays/whites/blacks for more vibrant themes if possible, fallback to most common
        let vibrantColors = sortedColors.filter(c => {
             const max = Math.max(c[0], c[1], c[2]);
             const min = Math.min(c[0], c[1], c[2]);
             // Needs some saturation and not be too dark or too light
             return (max - min) > 20 && max > 50 && max < 240;
        });

        if (vibrantColors.length < 5) {
             vibrantColors = [...vibrantColors, ...sortedColors].slice(0, 5);
        }

        resolve(vibrantColors.slice(0, 5));

      } catch (err) {
        console.error("Error extracting colors:", err);
        reject(err);
      }
    };

    img.onerror = (err) => {
      console.error("Failed to load image for color extraction", err);
      reject(new Error("Failed to load image"));
    };

    img.src = imageUrl;
  });
};

export const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
};
