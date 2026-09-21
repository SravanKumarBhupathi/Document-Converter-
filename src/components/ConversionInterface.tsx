import React, { useState } from 'react';
import { FileText, ArrowRight, Download, X, RefreshCw, AlertCircle, FileType, Image as ImageIcon, Code } from 'lucide-react';
import type { SupportedFormat, FileState } from '../types';
import { FILE_TYPES, identifyFormat } from '../converters';
import clsx from 'clsx';

interface ConversionInterfaceProps {
  files: FileState[];
  onConvert: (fileId: string, outputFormat: SupportedFormat) => void;
  onRemove: (fileId: string) => void;
  onDownload: (fileId: string) => void;
  availableFormats: Record<string, SupportedFormat[]>;
}

const getFileIcon = (format: SupportedFormat | null) => {
  if (!format) return <FileText size={24} className="text-text-secondary" />;

  const iconType = FILE_TYPES[format].icon;
  switch (iconType) {
    case 'image': return <ImageIcon size={24} className="text-primary" />;
    case 'code': return <Code size={24} className="text-primary" />;
    case 'file-type': return <FileType size={24} className="text-primary" />;
    case 'file-text':
    default: return <FileText size={24} className="text-primary" />;
  }
};

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

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (files.length === 0) return null;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-primary">Selected Files</h2>
        <span className="text-sm font-mono text-text-muted">{files.length} file(s)</span>
      </div>

      <div className="space-y-3">
        {files.map(fileState => {
          const inputFormat = identifyFormat(fileState.file);
          const options = inputFormat ? (availableFormats[inputFormat] || []) : [];
          const currentFormat = selectedFormats[fileState.id] || options[0];

          return (
            <div
              key={fileState.id}
              className={clsx(
                "card flex flex-col md:flex-row md:items-center justify-between gap-4 p-4",
                fileState.status === 'completed' && "border-success/30 bg-success/5",
                fileState.status === 'error' && "border-error/30 bg-error/5"
              )}
            >
              {/* File Info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="bg-bg-input p-2 rounded-lg border border-border-dark flex-shrink-0">
                  {getFileIcon(inputFormat)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-text-primary truncate" title={fileState.file.name}>
                    {fileState.file.name}
                  </p>
                  <p className="text-xs text-text-secondary font-mono mt-1">
                    {formatSize(fileState.file.size)}
                    {inputFormat && <span className="ml-2 uppercase bg-bg-input px-1.5 py-0.5 rounded text-[10px] border border-border-dark">{inputFormat}</span>}
                  </p>
                </div>
              </div>

              {/* Conversion Controls / Status */}
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto flex-shrink-0">
                {fileState.status === 'idle' && (
                  <>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-text-muted text-sm hidden sm:inline">to</span>
                      <ArrowRight size={16} className="text-text-muted hidden sm:block" />
                      <select
                        className="input-select uppercase"
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
                      className="btn-primary w-full sm:w-auto"
                      onClick={() => onConvert(fileState.id, currentFormat)}
                      disabled={!currentFormat || options.length === 0}
                    >
                      Convert
                    </button>
                  </>
                )}

                {fileState.status === 'converting' && (
                  <div className="flex items-center gap-2 text-primary text-sm font-semibold bg-primary/10 px-4 py-2 rounded-lg w-full sm:w-auto justify-center border border-primary/20">
                    <RefreshCw size={16} className="animate-spin" />
                    <span>Processing...</span>
                  </div>
                )}

                {fileState.status === 'completed' && (
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <span className="text-success font-semibold text-sm flex items-center gap-1 hidden sm:flex">
                      Ready
                    </span>
                    <button
                      className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto bg-success hover:bg-success/90 border-success hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                      onClick={() => onDownload(fileState.id)}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                )}

                {fileState.status === 'error' && (
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="text-error font-medium text-xs flex items-center gap-1" title={fileState.error}>
                      <AlertCircle size={14} /> Failed
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
                  className="p-1.5 text-text-muted hover:text-error hover:bg-error/10 rounded-md transition-colors"
                  title="Remove file"
                  aria-label="Remove file"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
