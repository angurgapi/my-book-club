export const compressDataUrl = (
  dataUrl: string,
  outputType: 'image/webp' | 'image/jpeg' = 'image/webp',
  quality = 0.8,
  maxWidth = 1200,
  maxHeight = 1200
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new window.Image();
    image.onload = () => {
      const originalWidth = image.width;
      const originalHeight = image.height;
      const scale = Math.min(maxWidth / originalWidth, maxHeight / originalHeight, 1);
      const targetWidth = Math.round(originalWidth * scale);
      const targetHeight = Math.round(originalHeight * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas 2D context not available'));
        return;
      }
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, targetWidth, targetHeight);
      try {
        const compressed = canvas.toDataURL(outputType, quality);
        resolve(compressed);
      } catch (err) {
        reject(err);
      }
    };
    image.onerror = (e: Event | string) => reject(e);
    image.src = dataUrl;
  });
};