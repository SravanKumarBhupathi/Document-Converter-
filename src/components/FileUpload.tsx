import React, { useState, useRef, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import clsx from 'clsx';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  acceptedFormats = [],
  maxSizeMB = 50,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): File[] => {
    setError(null);
    const validFiles: File[] = [];

    for (const file of files) {
      // Size validation
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File ${file.name} is too large. Max size is ${maxSizeMB}MB.`);
        continue;
      }

      // Format validation (simple check for now)
      if (acceptedFormats.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedFormats.includes(fileExtension) && !acceptedFormats.includes(file.type)) {
          setError(`File type ${fileExtension} is not supported yet.`);
          continue;
        }
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
  }, [onFilesSelected, acceptedFormats, maxSizeMB]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        onFilesSelected(validFiles);
      }
    }
    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        className={clsx(
          "relative border-4 border-dashed rounded-xl p-12 text-center transition-all duration-200 ease-out cursor-pointer",
          isDragging
            ? "border-primary bg-primary-soft scale-[1.02]"
            : "border-border bg-off-white hover:bg-white hover:border-black",
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
          accept={acceptedFormats.join(',')}
        />

        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className={clsx(
            "p-4 rounded-full border-2 transition-colors duration-200",
            isDragging ? "bg-primary text-black border-black" : "bg-white text-black border-border"
          )}>
            <Upload size={32} />
          </div>

          <div>
            <h3 className="text-xl font-bold text-black mb-1">
              {isDragging ? 'Drop it like it\'s hot!' : 'Upload your files'}
            </h3>
            <p className="text-muted font-medium">
              Drag & drop here or click to <span className="text-primary underline decoration-2 underline-offset-4">choose files</span>
            </p>
          </div>

          <div className="text-xs font-semibold text-muted bg-white px-3 py-1 rounded border-2 border-border mt-4">
            Max size: {maxSizeMB}MB
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-error/10 border-2 border-error rounded flex items-center justify-between text-error font-semibold text-sm">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="p-1 hover:bg-error/20 rounded">
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
