import type { Converter, ConversionResult, SupportedFormat } from '../types';

export const convertImage = async (
  file: File,
  toFormat: SupportedFormat,
  quality: number = 0.92
): Promise<ConversionResult> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Fill with white background for PNG -> JPG conversion to avoid black transparency
      if (toFormat === 'jpg' || toFormat === 'pdf') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      let mimeType = 'image/jpeg';
      if (toFormat === 'png') mimeType = 'image/png';
      if (toFormat === 'webp') mimeType = 'image/webp';

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url);
          if (blob) {
            const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
            resolve({
              blob,
              name: `${originalName}.${toFormat}`
            });
          } else {
            reject(new Error('Canvas toBlob failed'));
          }
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
};

export const imageConverter: Converter = {
  id: 'image-converter',
  name: 'Image Converter',
  description: "Convert Image files.",
  from: ['jpg', 'png', 'webp'],
  to: ['jpg', 'png', 'webp'],
  convert: async (file, toFormat, options, onProgress) => {
    if (onProgress) onProgress(10);
    // Add artificial small delay to show progress state
    await new Promise(r => setTimeout(r, 100));
    if (onProgress) onProgress(50);
    const result = await convertImage(file, toFormat, options?.quality);
    if (onProgress) onProgress(100);
    return result;
  }
};
