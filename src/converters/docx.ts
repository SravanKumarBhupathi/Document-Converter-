import * as mammoth from 'mammoth';
import type { Converter, ConversionResult } from '../types';

export const docxToText = async (file: File): Promise<ConversionResult> => {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.extractRawText({ arrayBuffer });
  const text = result.value;

  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const originalName = file.name.substring(0, file.name.lastIndexOf('.'));

  return {
    blob,
    name: `${originalName}.txt`
  };
};

export const docxToHtml = async (file: File): Promise<ConversionResult> => {
  const arrayBuffer = await file.arrayBuffer();

  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${file.name}</title>
<style>body { font-family: sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }</style>
</head>
<body>
${result.value}
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const originalName = file.name.substring(0, file.name.lastIndexOf('.'));

  return {
    blob,
    name: `${originalName}.html`
  };
};

export const docxConverter: Converter = {
  id: 'docx-converter',
  name: 'DOCX Converter',
  description: "Convert DOCX files.",
  from: ['docx'],
  to: ['txt', 'html'],
  convert: async (file, toFormat, _options, onProgress) => {
    if (onProgress) onProgress(30);

    let result;
    if (toFormat === 'txt') {
      result = await docxToText(file);
    } else if (toFormat === 'html') {
      result = await docxToHtml(file);
    } else {
      throw new Error(`Unsupported output format ${toFormat} for DOCX`);
    }

    if (onProgress) onProgress(100);
    return result;
  }
};
