import React, { useState } from 'react';
import { FileText, ArrowRight, Download, X, RefreshCw, AlertCircle } from 'lucide-react';
import type { SupportedFormat, FileState } from '../types';
import clsx from 'clsx';

interface ConversionInterfaceProps {
  files: FileState[];
  onConvert: (fileId: string, outputFormat: SupportedFormat, options?: any) => void;
  onRemove: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  availableFormats: Record<string, SupportedFormat[]>;
}

export const ConversionInterface: React.FC<ConversionInterfaceProps> = ({
  files,
  onConvert,
  onRemove,
  onDownload,
  availableFormats
}) => {
  const [selectedFormats, setSelectedFormats] = useState<Record<string, SupportedFormat>>({});

  const handleFormatChange = (fileId: string, format: SupportedFormat) => {
    setSelectedFormats(prev => ({ ...prev, [fileId]: format }));
  };

  const getFormatOptions = (fileExt: string): SupportedFormat[] => {
    const ext = fileExt.toLowerCase().replace('.', '');
    return availableFormats[ext] || [];
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) return null;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Files to convert ({files.length})</h2>
      </div>

      <div className="space-y-4">
        {files.map(fileState => {
          const fileExt = fileState.file.name.split('.').pop()?.toLowerCase() || '';
          const options = getFormatOptions(fileExt);
          const currentFormat = selectedFormats[fileState.id] || options[0];

          return (
            <div
              key={fileState.id}
              className={clsx(
                "card flex flex-col md:flex-row md:items-center justify-between gap-4 p-4",
                fileState.status === 'completed' && "border-success bg-success/5",
                fileState.status === 'error' && "border-error bg-error/5"
              )}
            >
              {/* File Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="bg-white p-2 rounded border-2 border-border flex-shrink-0">
                  <FileText size={24} className="text-black" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-black truncate" title={fileState.file.name}>
                    {fileState.file.name}
                  </p>
                  <p className="text-sm text-muted font-medium">
                    {formatSize(fileState.file.size)} • {fileExt.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Conversion Controls / Status */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto flex-shrink-0">
                {fileState.status === 'idle' && (
                  <>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-muted font-semibold text-sm hidden sm:inline">to</span>
                      <ArrowRight size={16} className="text-muted hidden sm:block" />
                      <select
                        className="bg-white border-2 border-border text-black text-sm rounded focus:ring-primary focus:border-primary block w-full p-2.5 font-bold outline-none cursor-pointer hover:border-black transition-colors"
                        value={currentFormat || ''}
                        onChange={(e) => handleFormatChange(fileState.id, e.target.value as SupportedFormat)}
                        disabled={options.length === 0}
                      >
                        {options.length === 0 && <option value="">No formats</option>}
                        {options.map(opt => (
                          <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      className="btn-primary w-full sm:w-auto py-2.5"
                      onClick={() => onConvert(fileState.id, currentFormat)}
                      disabled={!currentFormat || options.length === 0}
                    >
                      Convert
                    </button>
                  </>
                )}

                {fileState.status === 'converting' && (
                  <div className="flex items-center gap-2 text-primary font-bold bg-white px-4 py-2 border-2 border-primary rounded w-full sm:w-auto justify-center">
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Converting...</span>
                    {fileState.progress !== undefined && <span>{Math.round(fileState.progress)}%</span>}
                  </div>
                )}

                {fileState.status === 'completed' && (
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <span className="text-success font-bold text-sm flex items-center gap-1 hidden sm:flex">
                      <CheckCircle2 size={16} /> Ready
                    </span>
                    <button
                      className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto py-2.5 shadow-[2px_2px_0px_0px_rgba(17,17,17,1)] hover:shadow-none hover:translate-y-[2px] hover:translate-x-[2px]"
                      onClick={() => onDownload(fileState.id)}
                    >
                      <Download size={18} />
                      Download
                    </button>
                  </div>
                )}

                {fileState.status === 'error' && (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-error font-bold text-sm flex items-center gap-1" title={fileState.error}>
                      <AlertCircle size={16} /> Error
                    </span>
                    <button
                      className="btn-secondary text-sm py-1.5 px-3"
                      onClick={() => onConvert(fileState.id, currentFormat)}
                    >
                      Retry
                    </button>
                  </div>
                )}

                {/* Remove Button */}
                <button
                  onClick={() => onRemove(fileState.id)}
                  className="p-2 text-muted hover:text-error hover:bg-error/10 rounded border-2 border-transparent hover:border-error transition-all"
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Simple check icon for completed state since CheckCircle2 wasn't imported from lucide-react above
const CheckCircle2 = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);
