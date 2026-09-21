import React, { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import clsx from 'clsx';
import { identifyFormat } from '../converters';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptString: string;
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  acceptString,
  maxSizeMB = 50,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    setError(null);
    const validFiles: File[] = [];

    for (const file of files) {
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
        continue;
      }

      const format = identifyFormat(file);
      if (!format) {
        setError(`File type for ${file.name} is not supported.`);
        continue;
      }

      validFiles.push(file);
    }

    return validFiles;
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
  }, [onFilesSelected, maxSizeMB]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={clsx(
          "relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ease-out cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5 scale-[1.01] shadow-[0_0_30px_rgba(255,106,0,0.15)]"
            : "border-border-dark bg-bg-panel hover:border-border-light hover:bg-bg-card",
          error ? "border-error bg-error/5" : ""
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden"
          multiple
          accept={acceptString}
        />

        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className={clsx(
            "p-4 rounded-full transition-all duration-300",
            isDragging ? "bg-primary text-bg-base shadow-[0_0_15px_rgba(255,106,0,0.4)]" : "bg-bg-input text-primary border border-border-dark"
          )}>
            <Upload size={32} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-text-primary mb-1">
              {isDragging ? 'Release to upload' : 'DROP FILES HERE'}
            </h3>
            <p className="text-text-secondary text-sm mt-2">
              Drag & drop your files or <span className="text-primary font-semibold">browse files</span>
            </p>
          </div>

          <div className="text-xs font-mono text-text-muted mt-6 flex gap-2 flex-wrap justify-center max-w-lg">
            <span>PDF</span><span>•</span>
            <span>DOCX</span><span>•</span>
            <span>TXT</span><span>•</span>
            <span>JPG</span><span>•</span>
            <span>PNG</span><span>•</span>
            <span>WEBP</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-error/10 border border-error/30 rounded-lg flex items-center justify-between text-error font-medium text-sm">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="p-1.5 hover:bg-error/20 rounded transition-colors">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
