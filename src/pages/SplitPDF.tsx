import React, { useState } from 'react';
import { FileUpload } from '../components/FileUpload';
import { generateAcceptStringForTool } from '../registry';
import { FileText, Settings2, Download, Trash2, SplitSquareHorizontal } from 'lucide-react';
import { splitPdfByRanges } from '../converters/pdf';
import type { ConversionResult } from '../types';

export const SplitPDF: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [numSplits, setNumSplits] = useState<number>(2);
  const [ranges, setRanges] = useState<string[]>(['1-1', '2-2']);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const acceptString = generateAcceptStringForTool('split-pdf');

  const handleFilesSelected = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setResults([]);
      setError(null);
    }
  };

  const handleNumSplitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value) || 1;
    setNumSplits(val);
    setRanges(Array(val).fill(''));
  };

  const updateRange = (index: number, val: string) => {
    const newRanges = [...ranges];
    newRanges[index] = val;
    setRanges(newRanges);
  };

  const handleProcess = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const output = await splitPdfByRanges(file, ranges);
      setResults(output);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadFile = (result: ConversionResult) => {
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
          <SplitSquareHorizontal className="text-primary" size={32} />
          Split PDF
        </h1>
        <p className="text-text-secondary mt-2">Extract pages or split a PDF into multiple documents using advanced range selection.</p>
      </div>

      {!file ? (
        <div className="card shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <FileUpload onFilesSelected={handleFilesSelected} acceptString={acceptString} />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="card flex justify-between items-center bg-bg-input">
            <div className="flex items-center gap-3">
              <FileText className="text-primary" />
              <span className="font-semibold">{file.name}</span>
            </div>
            <button onClick={() => setFile(null)} className="text-error hover:text-error/80 p-2">
              <Trash2 size={18} />
            </button>
          </div>

          {results.length === 0 ? (
            <div className="card space-y-6">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Settings2 className="text-primary" size={20} />
                Configuration
              </h3>

              <div>
                <label className="block text-sm font-semibold text-text-secondary mb-2">How many files do you want to create?</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={numSplits}
                  onChange={handleNumSplitsChange}
                  className="bg-bg-base border border-border-dark rounded-lg px-4 py-2 text-text-primary outline-none focus:border-primary w-32"
                />
              </div>

              <div className="space-y-4">
                {ranges.map((range, idx) => (
                  <div key={idx}>
                    <label className="block text-sm text-text-secondary mb-1">File {idx + 1} page range (e.g., 1-5)</label>
                    <input
                      type="text"
                      value={range}
                      onChange={(e) => updateRange(idx, e.target.value)}
                      placeholder="1-5"
                      className="bg-bg-base border border-border-dark rounded-lg px-4 py-2 text-text-primary outline-none focus:border-primary w-full max-w-sm"
                    />
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-4 bg-error/10 border border-error/30 text-error rounded-lg">
                  {error}
                </div>
              )}

              <div className="pt-4 border-t border-border-dark">
                <button
                  onClick={handleProcess}
                  disabled={isProcessing}
                  className="btn-primary w-full sm:w-auto"
                >
                  {isProcessing ? 'Processing...' : 'Split Document'}
                </button>
              </div>
            </div>
          ) : (
            <div className="card space-y-4">
              <h3 className="text-lg font-bold text-success flex items-center gap-2">Success!</h3>
              <p className="text-text-secondary">Your PDF has been split into {results.length} files.</p>

              <div className="space-y-3 pt-4">
                {results.map((res, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-bg-input p-3 rounded-lg border border-border-dark gap-3 sm:gap-0">
                    <span className="font-semibold text-sm">{res.name}</span>
                    <button onClick={() => downloadFile(res)} className="btn-secondary py-1.5 text-sm flex items-center gap-2">
                      <Download size={14} /> Download
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-border-dark">
                 <button onClick={() => {setFile(null); setResults([]);}} className="btn-secondary">Split another PDF</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
