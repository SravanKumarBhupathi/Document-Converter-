import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { ConversionInterface } from '../components/ConversionInterface';
import { HistorySidebar } from '../components/HistorySidebar';
import { useHistory } from '../hooks/useHistory';
import { ToolsDirectory } from '../components/ToolsDirectory';
import type { FileState, SupportedFormat } from '../types';
import { generateAcceptStringForTool, getPopularTools, getCalculators } from '../registry';
import { getConverter, identifyFormat, buildFormatMap } from '../converters';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight, Calculator } from 'lucide-react';

export const Home: React.FC = () => {
  const [files, setFiles] = useState<FileState[]>([]);
  const { history, clearHistory, addToHistory } = useHistory();
  const navigate = useNavigate();

  const formatMap = useMemo(() => buildFormatMap(), []);
  const acceptString = useMemo(() => generateAcceptStringForTool(), []);

  const handleFilesSelected = (newFiles: File[]) => {
    const newFileStates: FileState[] = newFiles.map(file => ({
      id: uuidv4(),
      file,
      status: 'idle',
    }));
    setFiles(prev => [...prev, ...newFileStates]);
  };

  const handleConvert = async (fileId: string, outputFormat: SupportedFormat) => {
    const fileState = files.find(f => f.id === fileId);
    if (!fileState) return;

    const fromExt = identifyFormat(fileState.file);
    if (!fromExt) return;

    const converter = getConverter(fromExt, outputFormat);
    if (!converter) return;

    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'converting', progress: 0, outputFormat } : f));

    try {
      const result = await converter.convert(fileState.file, outputFormat, {}, (progress: number) => {
        setFiles(prev => prev.map(f => f.id === fileId ? { ...f, progress } : f));
      });

      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'completed', result: result.blob, convertedName: result.name, progress: 100 } : f));
      addToHistory(fileState.file.name, result.name, fromExt, outputFormat);
    } catch (error) {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' } : f));
    }
  };

  const handleRemoveFile = (id: string) => setFiles(prev => prev.filter(f => f.id !== id));

  const handleDownload = (fileId: string) => {
    const fileState = files.find(f => f.id === fileId);
    if (!fileState || !fileState.result || !fileState.convertedName) return;
    const url = URL.createObjectURL(fileState.result);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileState.convertedName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-8 xl:col-span-9 space-y-12">

          {/* Hero & Workspace */}
          <section className="space-y-4">
            {files.length === 0 && (
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
                  Your files. Your tools. <br />
                  <span className="text-primary">One workspace.</span>
                </h1>
                <p className="text-text-secondary text-lg max-w-2xl leading-relaxed">
                  Fast, secure, and private document processing. Everything happens directly in your browser.
                </p>
              </div>
            )}

            <div id="workspace" className="card shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-border-light relative overflow-hidden group">
              <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />
              <div className="relative z-10">
                {files.length === 0 ? (
                  <FileUpload onFilesSelected={handleFilesSelected} acceptString={acceptString} />
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center border-b border-border-dark pb-4">
                      <h2 className="text-xl font-bold">Conversion Workspace</h2>
                      <button onClick={() => setFiles([])} className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">Clear All</button>
                    </div>
                    <ConversionInterface files={files} onConvert={handleConvert} onRemove={handleRemoveFile} onDownload={handleDownload} availableFormats={formatMap} />
                    <div className="pt-4 mt-4 border-t border-border-dark">
                      <FileUpload onFilesSelected={handleFilesSelected} acceptString={acceptString} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Popular Tools Quick Access */}
          {files.length === 0 && (
            <section className="pt-4">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">Popular Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {getPopularTools().filter(t => !t.isCalculator).map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => navigate(tool.route)}
                    className="card card-hover bg-bg-input text-left p-4 group"
                  >
                    <div className="font-bold text-text-primary mb-1 group-hover:text-primary transition-colors flex justify-between items-center">
                      {tool.name}
                      <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                    <div className="text-xs text-text-secondary line-clamp-2">{tool.description}</div>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Calculators Quick Access */}
          {files.length === 0 && (
            <section className="pt-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Calculator className="text-primary" size={20} /> Popular Calculators
                </h2>
                <button onClick={() => navigate('/calculators')} className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1">
                  View All <ArrowRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {getCalculators().slice(0,4).map(calc => (
                  <button
                    key={calc.id}
                    onClick={() => navigate(calc.route)}
                    className="card card-hover bg-bg-input text-left p-4 group flex items-center justify-between"
                  >
                    <span className="font-bold text-sm text-text-primary group-hover:text-primary transition-colors">{calc.name}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

          <section id="tools" className="pt-12 border-t border-border-dark">
             {/* If we are routing, ToolsDirectory is usually on its own page, but keeping a compact version here is good for UX */}
             <ToolsDirectory onSelectTool={(_from, _to) => document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' })} />
          </section>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-24">
            <HistorySidebar history={history} onClear={clearHistory} />
          </div>
        </div>
      </div>
    </div>
  );
};
