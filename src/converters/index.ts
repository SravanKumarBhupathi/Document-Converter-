import type { Converter, SupportedFormat } from '../types';
import { imageConverter } from './image';
import { pdfConverter } from './pdf';
import { docxConverter } from './docx';
import { textConverter } from './text';

// Register all converters
export const converters: Converter[] = [
  imageConverter,
  pdfConverter,
  docxConverter,
  textConverter
];

export const getAvailableFormats = (inputExt: string): SupportedFormat[] => {
  const ext = inputExt.toLowerCase().replace('.', '') as SupportedFormat;
  const availableTo = new Set<SupportedFormat>();

  converters.forEach(converter => {
    if (converter.from.includes(ext)) {
      converter.to.forEach(t => availableTo.add(t));
    }
  });

  return Array.from(availableTo);
};

export const getConverter = (fromFormat: string, toFormat: string): Converter | undefined => {
  const from = fromFormat.toLowerCase().replace('.', '') as SupportedFormat;
  const to = toFormat.toLowerCase().replace('.', '') as SupportedFormat;

  return converters.find(c => c.from.includes(from) && c.to.includes(to));
};

export const buildFormatMap = (): Record<string, SupportedFormat[]> => {
  const map: Record<string, SupportedFormat[]> = {};
  const allFormats: SupportedFormat[] = ['pdf', 'docx', 'jpg', 'png', 'webp', 'txt', 'html'];

  allFormats.forEach(fmt => {
    const outputs = getAvailableFormats(fmt);
    if (outputs.length > 0) {
      map[fmt] = outputs;
    }
  });

  return map;
};
