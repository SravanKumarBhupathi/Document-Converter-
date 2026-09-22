import type { SupportedFormat, FileTypeDefinition } from './types';

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

export type ToolCategory = 'PDF Tools' | 'Document Tools' | 'Image Tools' | 'Calculators';

export interface ToolDefinition {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  route: string;
  isPopular?: boolean;
  inputs?: SupportedFormat[];
  outputs?: SupportedFormat[];
  isCalculator?: boolean;
}

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // Guided Advanced Tools
  {
    id: 'split-pdf',
    name: 'Split PDF',
    description: 'Extract pages or split a PDF into multiple documents visually.',
    category: 'PDF Tools',
    route: '/tools/split-pdf',
    isPopular: true,
    inputs: ['pdf'],
    outputs: ['pdf']
  },
  {
    id: 'merge-pdf',
    name: 'Merge PDF',
    description: 'Combine multiple PDFs into one document and arrange pages.',
    category: 'PDF Tools',
    route: '/tools/merge-pdf',
    isPopular: true,
    inputs: ['pdf'],
    outputs: ['pdf']
  },

  // Standard Conversions
  {
    id: 'pdf-to-image',
    name: 'PDF to Image',
    description: 'Extract pages from PDF to high-quality JPG or PNG images.',
    category: 'PDF Tools',
    route: '/tools/pdf-to-image',
    isPopular: true,
    inputs: ['pdf'],
    outputs: ['jpg', 'png', 'webp']
  },
  {
    id: 'image-to-pdf',
    name: 'Image to PDF',
    description: 'Convert JPG, PNG, and WEBP images into a PDF document.',
    category: 'Image Tools',
    route: '/tools/image-to-pdf',
    isPopular: true,
    inputs: ['jpg', 'png', 'webp'],
    outputs: ['pdf']
  },
  {
    id: 'docx-to-text',
    name: 'Word to Text',
    description: 'Extract pure text from DOCX documents seamlessly.',
    category: 'Document Tools',
    route: '/tools/docx-to-text',
    isPopular: true,
    inputs: ['docx'],
    outputs: ['txt', 'html']
  },
  {
    id: 'image-converter',
    name: 'Image Converter',
    description: 'Convert between JPG, PNG, and WEBP formats instantly.',
    category: 'Image Tools',
    route: '/tools/image-converter',
    inputs: ['jpg', 'png', 'webp'],
    outputs: ['jpg', 'png', 'webp']
  },

  // Calculators
  {
    id: 'calc-percentage',
    name: 'Percentage Calculator',
    description: 'Quickly calculate percentages, increases, and decreases.',
    category: 'Calculators',
    route: '/calculators/percentage',
    isPopular: true,
    isCalculator: true
  },
  {
    id: 'calc-emi',
    name: 'EMI Calculator',
    description: 'Calculate Equated Monthly Installments for loans and mortgages.',
    category: 'Calculators',
    route: '/calculators/emi',
    isPopular: true,
    isCalculator: true
  },
  {
    id: 'calc-age',
    name: 'Age Calculator',
    description: 'Find your exact age in years, months, and days.',
    category: 'Calculators',
    route: '/calculators/age',
    isPopular: true,
    isCalculator: true
  }
];

export const getToolById = (id: string) => TOOLS_REGISTRY.find(t => t.id === id);
export const getPopularTools = () => TOOLS_REGISTRY.filter(t => t.isPopular);
export const getCalculators = () => TOOLS_REGISTRY.filter(t => t.isCalculator);

export const generateAcceptStringForTool = (toolId?: string): string => {
  const tool = toolId ? getToolById(toolId) : null;
  const accepts = new Set<string>();

  if (tool && tool.inputs) {
    tool.inputs.forEach(format => {
      const typeDef = FILE_TYPES[format];
      if (typeDef) {
        typeDef.mime.forEach(m => accepts.add(m));
        typeDef.extensions.forEach(e => accepts.add(e));
      }
    });
  } else {
    // If no tool specified, accept everything we support
    Object.values(FILE_TYPES).forEach(typeDef => {
      typeDef.mime.forEach(m => accepts.add(m));
      typeDef.extensions.forEach(e => accepts.add(e));
    });
  }

  return Array.from(accepts).join(',');
};

export const identifyFormat = (file: File): SupportedFormat | null => {
  const extension = `.${file.name.split('.').pop()?.toLowerCase() || ''}`;
  const mimeType = file.type;

  for (const key of Object.keys(FILE_TYPES)) {
    const format = key as SupportedFormat;
    const def = FILE_TYPES[format];

    if (def.mime.includes(mimeType) || def.extensions.includes(extension)) {
      return format;
    }
  }

  return null;
};
