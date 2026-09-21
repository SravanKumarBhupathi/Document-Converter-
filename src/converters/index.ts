import type { Converter, SupportedFormat, FileTypeDefinition } from '../types';
import { imageConverter } from './image';
import { pdfConverter } from './pdf';
import { docxConverter } from './docx';
import { textConverter } from './text';

export const FILE_TYPES: Record<SupportedFormat, FileTypeDefinition> = {
  pdf: {
    format: 'pdf',
    mime: ['application/pdf'],
    extensions: ['.pdf'],
    icon: 'file-text'
  },
  docx: {
    format: 'docx',
    mime: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
    extensions: ['.docx', '.doc'],
    icon: 'file-text'
  },
  jpg: {
    format: 'jpg',
    mime: ['image/jpeg', 'image/jpg'],
    extensions: ['.jpg', '.jpeg'],
    icon: 'image'
  },
  png: {
    format: 'png',
    mime: ['image/png'],
    extensions: ['.png'],
    icon: 'image'
  },
  webp: {
    format: 'webp',
    mime: ['image/webp'],
    extensions: ['.webp'],
    icon: 'image'
  },
  txt: {
    format: 'txt',
    mime: ['text/plain'],
    extensions: ['.txt'],
    icon: 'file-type'
  },
  html: {
    format: 'html',
    mime: ['text/html'],
    extensions: ['.html', '.htm'],
    icon: 'code'
  }
};

// Register all converters
export const converters: Converter[] = [
  imageConverter,
  pdfConverter,
  docxConverter,
  textConverter
];

export const getAvailableFormats = (inputExt: string): SupportedFormat[] => {
  const ext = inputExt.toLowerCase().replace('.', '');
  // Normalize extensions to SupportedFormat keys if possible
  const formatKey = Object.keys(FILE_TYPES).find(key =>
    FILE_TYPES[key as SupportedFormat].extensions.includes(`.${ext}`)
  ) as SupportedFormat | undefined;

  const searchFormat = formatKey || ext as SupportedFormat;

  const availableTo = new Set<SupportedFormat>();

  converters.forEach(converter => {
    if (converter.from.includes(searchFormat)) {
      converter.to.forEach(t => availableTo.add(t));
    }
  });

  return Array.from(availableTo);
};

export const getConverter = (fromFormat: string, toFormat: string): Converter | undefined => {
  const fromExt = fromFormat.toLowerCase().replace('.', '');
  const toExt = toFormat.toLowerCase().replace('.', '');

  const fromKey = Object.keys(FILE_TYPES).find(key =>
    FILE_TYPES[key as SupportedFormat].extensions.includes(`.${fromExt}`)
  ) as SupportedFormat || fromExt;

  const toKey = Object.keys(FILE_TYPES).find(key =>
    FILE_TYPES[key as SupportedFormat].extensions.includes(`.${toExt}`)
  ) as SupportedFormat || toExt;

  return converters.find(c => c.from.includes(fromKey) && c.to.includes(toKey));
};

export const buildFormatMap = (): Record<string, SupportedFormat[]> => {
  const map: Record<string, SupportedFormat[]> = {};
  const allFormats = Object.keys(FILE_TYPES) as SupportedFormat[];

  allFormats.forEach(fmt => {
    const outputs = getAvailableFormats(fmt);
    if (outputs.length > 0) {
      map[fmt] = outputs;
    }
  });

  return map;
};

export const generateAcceptString = (): string => {
  const accepts: string[] = [];

  const allSupportedInputs = new Set<SupportedFormat>();
  converters.forEach(c => c.from.forEach(f => allSupportedInputs.add(f)));

  allSupportedInputs.forEach(format => {
    const typeDef = FILE_TYPES[format];
    if (typeDef) {
      accepts.push(...typeDef.mime);
      accepts.push(...typeDef.extensions);
    }
  });

  return Array.from(new Set(accepts)).join(',');
};

export const identifyFormat = (file: File): SupportedFormat | null => {
  const extension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
  const mimeType = file.type;

  // Strict matching checking MIME and Ext
  for (const key of Object.keys(FILE_TYPES)) {
    const format = key as SupportedFormat;
    const def = FILE_TYPES[format];

    // Some browsers might omit mime types for certain files or give generic octet-stream
    if (def.mime.includes(mimeType) || def.extensions.includes(extension)) {
      return format;
    }
  }

  return null;
};
