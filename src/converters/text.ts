import type { Converter, ConversionResult } from '../types';
import jsPDF from 'jspdf';

export const textToPdf = async (file: File): Promise<ConversionResult> => {
  const text = await file.text();
  const doc = new jsPDF();

  // Split text to fit page width
  const splitText = doc.splitTextToSize(text, 180);

  let y = 10;
  for (let i = 0; i < splitText.length; i++) {
    if (y > 280) {
      doc.addPage();
      y = 10;
    }
    doc.text(splitText[i], 10, y);
    y += 7; // line height
  }

  const blob = doc.output('blob');
  const originalName = file.name.substring(0, file.name.lastIndexOf('.'));

  return {
    blob,
    name: `${originalName}.pdf`
  };
};

export const textConverter: Converter = {
  id: 'text-converter',
  name: 'Text Converter',
  description: "Convert Text files.",
  from: ['txt'],
  to: ['pdf'],
  convert: async (file, toFormat, _options, onProgress) => {
    if (onProgress) onProgress(30);

    let result;
    if (toFormat === 'pdf') {
      result = await textToPdf(file);
    } else {
      throw new Error(`Unsupported output format ${toFormat} for TXT`);
    }

    if (onProgress) onProgress(100);
    return result;
  }
};
