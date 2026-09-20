export type SupportedFormat =
  | 'pdf'
  | 'docx'
  | 'jpg'
  | 'png'
  | 'webp'
  | 'txt'
  | 'html';

export interface FileState {
  id: string;
  file: File;
  status: 'idle' | 'converting' | 'completed' | 'error';
  progress?: number;
  result?: Blob;
  outputFormat?: SupportedFormat;
  error?: string;
  convertedName?: string;
}

export interface ConversionOptions {
  quality?: number; // For images (0-1)
  margin?: number; // For PDF/Docx
  pageSize?: 'A4' | 'Letter';
}

export interface ConversionResult {
  blob: Blob;
  name: string;
}

export interface Converter {
  id: string;
  name: string;
  from: SupportedFormat[];
  to: SupportedFormat[];
  convert: (
    file: File,
    toFormat: SupportedFormat,
    options?: ConversionOptions,
    onProgress?: (progress: number) => void
  ) => Promise<ConversionResult>;
}
