import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import type { Converter, ConversionResult, SupportedFormat } from '../types';
import { convertImage } from './image';

// Tell pdfjs where to find the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const imageToPdf = async (file: File): Promise<ConversionResult> => {
  const pdfDoc = await PDFDocument.create();

  let imageBytes: ArrayBuffer;
  let isJpg = file.type === 'image/jpeg';
  let isPng = file.type === 'image/png';

  if (!isJpg && !isPng) {
    const converted = await convertImage(file, 'jpg');
    imageBytes = await converted.blob.arrayBuffer();
    isJpg = true;
  } else {
    imageBytes = await file.arrayBuffer();
  }

  let image;
  if (isJpg) {
    image = await pdfDoc.embedJpg(imageBytes);
  } else {
    image = await pdfDoc.embedPng(imageBytes);
  }

  const page = pdfDoc.addPage([image.width, image.height]);
  page.drawImage(image, {
    x: 0,
    y: 0,
    width: image.width,
    height: image.height,
  });

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });
  const originalName = file.name.substring(0, file.name.lastIndexOf('.'));

  return {
    blob,
    name: `${originalName}.pdf`
  };
};

export const pdfToImage = async (
  file: File,
  toFormat: SupportedFormat,
  onProgress?: (p: number) => void
): Promise<ConversionResult> => {
  const arrayBuffer = await file.arrayBuffer();

  if (onProgress) onProgress(20);

  const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
  const pdf = await loadingTask.promise;

  if (onProgress) onProgress(40);

  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('Could not get canvas context');

  canvas.width = viewport.width;
  canvas.height = viewport.height;

  const renderContext: any = {
    canvasContext: ctx,
    viewport: viewport,
  };

  if (onProgress) onProgress(60);

  await page.render(renderContext).promise;

  if (onProgress) onProgress(80);

  return new Promise((resolve, reject) => {
    let mimeType = 'image/jpeg';
    if (toFormat === 'png') mimeType = 'image/png';
    if (toFormat === 'webp') mimeType = 'image/webp';

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const originalName = file.name.substring(0, file.name.lastIndexOf('.'));
          if (onProgress) onProgress(100);
          resolve({
            blob,
            name: `${originalName}.${toFormat}`
          });
        } else {
          reject(new Error('Canvas toBlob failed'));
        }
      },
      mimeType,
      0.92
    );
  });
};

export const splitPdfByRanges = async (file: File, ranges: string[]): Promise<ConversionResult[]> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const totalPages = pdfDoc.getPageCount();

  const results: ConversionResult[] = [];
  const originalName = file.name.substring(0, file.name.lastIndexOf('.'));

  for (let i = 0; i < ranges.length; i++) {
    const range = ranges[i].trim();
    if (!range) continue;

    let start = 1;
    let end = 1;

    if (range.includes('-')) {
      const parts = range.split('-');
      start = parseInt(parts[0]);
      end = parseInt(parts[1]);
    } else {
      start = parseInt(range);
      end = start;
    }

    if (isNaN(start) || isNaN(end) || start < 1 || end > totalPages || start > end) {
      throw new Error(`Invalid range: ${range}. Document has ${totalPages} pages.`);
    }

    const newDoc = await PDFDocument.create();
    const pageIndices = Array.from({ length: end - start + 1 }, (_, k) => start - 1 + k);

    const copiedPages = await newDoc.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach(p => newDoc.addPage(p));

    const pdfBytes = await newDoc.save();
    const blob = new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });

    results.push({
      blob,
      name: `${originalName}-split-${i + 1}.pdf`
    });
  }

  return results;
};

export const mergePdfs = async (files: File[]): Promise<ConversionResult> => {
  const mergedPdf = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  const pdfBytes = await mergedPdf.save();
  const blob = new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' });

  return {
    blob,
    name: `merged-${Date.now()}.pdf`
  };
};

export const pdfConverter: Converter = {
  id: 'pdf-converter',
  name: 'PDF Converter',
  description: 'Convert PDF files.',
  from: ['pdf', 'jpg', 'png', 'webp'],
  to: ['pdf', 'jpg', 'png', 'webp'],
  convert: async (file, toFormat, _options, onProgress) => {
    const fromExt = file.name.split('.').pop()?.toLowerCase();

    if (fromExt === 'pdf' && toFormat !== 'pdf') {
      return await pdfToImage(file, toFormat, onProgress);
    } else if (fromExt !== 'pdf' && toFormat === 'pdf') {
      if (onProgress) onProgress(30);
      const res = await imageToPdf(file);
      if (onProgress) onProgress(100);
      return res;
    }

    throw new Error('Unsupported conversion path in PDF Converter');
  }
};
