import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { generateAcceptStringForTool } from '../registry';
import { FileText, Settings2, Trash2, ArrowUp, ArrowDown, Combine, Download } from 'lucide-react';
import { mergePdfs } from '../converters/pdf';
import type { ConversionResult } from '../types';

export const MergePDF: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const acceptString = generateAcceptStringForTool('merge-pdf');

  const handleFilesSelected = (newFiles: File[]) => {
    setFiles(prev => [...prev, ...newFiles]);
    setResult(null);
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const moveFile = (idx: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === files.length - 1)) return;
    const newFiles = [...files];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newFiles[idx], newFiles[targetIdx]] = [newFiles[targetIdx], newFiles[idx]];
    setFiles(newFiles);
  };

  const handleProcess = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setError(null);
    try {
      const output = await mergePdfs(files);
      setResult(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to merge PDFs.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = () => {
    if (!result) return;
    const url = URL.createObjectURL(result.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = result.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold flex items-center gap-3">
          <Combine className="text-primary" size={32} />
          Merge PDF
        </h1>
        <p className="text-text-secondary mt-2">Combine multiple PDFs into a single document. Drag or use arrows to reorder.</p>
      </div>

      <div className="space-y-6">
        {!result && (
          <div className="card shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <FileUpload onFilesSelected={handleFilesSelected} acceptString={acceptString} />
          </div>
        )}

        {files.length > 0 && !result && (
          <div className="card space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Settings2 className="text-primary" size={20} />
              Files to Merge ({files.length})
            </h3>

            <div className="space-y-3">
              {files.map((f, idx) => (
                <div key={idx} className="flex justify-between items-center bg-bg-input p-3 rounded-lg border border-border-dark">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="text-primary flex-shrink-0" />
                    <span className="font-semibold truncate text-sm">{f.name}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => moveFile(idx, 'up')} disabled={idx === 0} className="p-1 hover:text-text-primary disabled:opacity-30">
                      <ArrowUp size={16} />
                    </button>
                    <button onClick={() => moveFile(idx, 'down')} disabled={idx === files.length - 1} className="p-1 hover:text-text-primary disabled:opacity-30">
                      <ArrowDown size={16} />
                    </button>
                    <div className="w-px h-4 bg-border-dark mx-1"></div>
                    <button onClick={() => removeFile(idx)} className="text-error hover:text-error/80 p-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-error/10 border border-error/30 text-error rounded-lg">
                {error}
              </div>
            )}

            <div className="pt-4 border-t border-border-dark flex justify-end">
              <button
                onClick={handleProcess}
                disabled={isProcessing || files.length < 2}
                className="btn-primary w-full sm:w-auto"
              >
                {isProcessing ? 'Merging...' : 'Merge PDFs'}
              </button>
            </div>
          </div>
        )}

        {result && (
          <div className="card space-y-4">
            <h3 className="text-lg font-bold text-success flex items-center gap-2">Success!</h3>
            <p className="text-text-secondary">Your PDFs have been successfully merged.</p>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-input p-4 rounded-lg border border-border-dark mt-4 gap-4 sm:gap-0">
              <div className="flex items-center gap-3">
                <FileText className="text-primary" />
                <span className="font-semibold">{result.name}</span>
              </div>
              <button onClick={downloadFile} className="btn-primary flex items-center gap-2">
                <Download size={16} /> Download
              </button>
            </div>

            <div className="pt-6 border-t border-border-dark">
               <button onClick={() => {setFiles([]); setResult(null);}} className="btn-secondary">Merge more PDFs</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
