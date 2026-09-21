import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { FileUpload } from './components/FileUpload';
import { ConversionInterface } from './components/ConversionInterface';
import { Toast, type ToastProps } from './components/Toast';
import { ToolsDirectory } from './components/ToolsDirectory';
import { HistorySidebar } from './components/HistorySidebar';
import { useHistory } from './hooks/useHistory';
import type { FileState, SupportedFormat } from './types';
import { buildFormatMap, getConverter, generateAcceptString, identifyFormat } from './converters';
import { Menu, X, Zap } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { history, addToHistory, clearHistory } = useHistory();

  const formatMap = useMemo(() => buildFormatMap(), []);
  const acceptString = useMemo(() => generateAcceptString(), []);

  const addToast = useCallback((type: ToastProps['type'], message: string) => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const handleFilesSelected = (newFiles: File[]) => {
    const newFileStates: FileState[] = newFiles.map(file => ({
      id: uuidv4(),
      file,
      status: 'idle',
    }));

    setFiles(prev => [...prev, ...newFileStates]);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleConvert = async (fileId: string, outputFormat: SupportedFormat) => {
    const fileState = files.find(f => f.id === fileId);
    if (!fileState) return;

    const fromExt = identifyFormat(fileState.file);
    if (!fromExt) {
      addToast('error', `Cannot identify format for ${fileState.file.name}`);
      return;
    }

    const converter = getConverter(fromExt, outputFormat);

    if (!converter) {
      addToast('error', `No converter found for ${fromExt.toUpperCase()} to ${outputFormat.toUpperCase()}`);
      return;
    }

    setFiles(prev => prev.map(f =>
      f.id === fileId ? { ...f, status: 'converting', progress: 0, outputFormat } : f
    ));

    try {
      const result = await converter.convert(
        fileState.file,
        outputFormat,
        {},
        (progress) => {
          setFiles(prev => prev.map(f =>
            f.id === fileId ? { ...f, progress } : f
          ));
        }
      );

      setFiles(prev => prev.map(f =>
        f.id === fileId ? {
          ...f,
          status: 'completed',
          result: result.blob,
          convertedName: result.name,
          progress: 100
        } : f
      ));

      addToHistory(fileState.file.name, result.name, fromExt, outputFormat);
      addToast('success', `Successfully converted ${fileState.file.name}`);
    } catch (error) {
      console.error(error);
      setFiles(prev => prev.map(f =>
        f.id === fileId ? {
          ...f,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        } : f
      ));
      addToast('error', `Failed to convert ${fileState.file.name}`);
    }
  };

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

  const handleSelectTool = () => {
    document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // In a full implementation, we might pre-select the output format here if only 1 file is selected
  };

  return (
    <div id="top" className="flex flex-col min-h-screen relative bg-bg-base">

      {/* Header */}
      <header className="border-b border-border-dark bg-bg-base/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
              <div className="bg-primary p-1.5 rounded-md shadow-[0_0_10px_rgba(255,106,0,0.4)]">
                <Zap size={20} className="text-bg-base" fill="currentColor" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white">Radium<span className="text-primary">Convert</span></span>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <a href="#workspace" className="text-text-secondary hover:text-white transition-colors font-medium text-sm">Workspace</a>
              <a href="#tools" className="text-text-secondary hover:text-white transition-colors font-medium text-sm">All Tools</a>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-text-secondary hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border-dark bg-bg-panel absolute w-full shadow-2xl">
            <div className="px-4 py-4 space-y-2">
              <a href="#workspace" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-bg-input">Workspace</a>
              <a href="#tools" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-bg-input">All Tools</a>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12 relative">

        {/* Background Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main Converter Column */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">

            <section className="space-y-4">
              {files.length === 0 && (
                <div className="mb-8">
                  <h1 className="text-3xl md:text-4xl font-extrabold mb-3">
                    Convert files. <span className="text-primary">Your way.</span>
                  </h1>
                  <p className="text-text-secondary text-lg max-w-xl leading-relaxed">
                    A completely private, strictly client-side workspace for converting PDFs, Documents, and Images locally in your browser.
                  </p>
                </div>
              )}

              <div id="workspace" className="card shadow-[0_4px_30px_rgba(0,0,0,0.5)] border-border-light relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid opacity-50 pointer-events-none" />

                <div className="relative z-10">
                  {files.length === 0 ? (
                    <FileUpload
                      onFilesSelected={handleFilesSelected}
                      acceptString={acceptString}
                    />
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center border-b border-border-dark pb-4">
                        <h2 className="text-xl font-bold">Conversion Workspace</h2>
                        <button
                          onClick={() => setFiles([])}
                          className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors"
                        >
                          Clear All
                        </button>
                      </div>

                      <ConversionInterface
                        files={files}
                        onConvert={handleConvert}
                        onRemove={handleRemoveFile}
                        onDownload={handleDownload}
                        availableFormats={formatMap}
                      />

                      <div className="pt-4 mt-4 border-t border-border-dark">
                        <FileUpload
                          onFilesSelected={handleFilesSelected}
                          acceptString={acceptString}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section id="tools" className="pt-12">
              <ToolsDirectory onSelectTool={handleSelectTool} />
            </section>

          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="sticky top-24">
              <HistorySidebar history={history} onClear={clearHistory} />
            </div>
          </div>

        </div>
      </main>

      <footer className="border-t border-border-dark bg-bg-panel mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
             <Zap size={16} className="text-primary" fill="currentColor" />
             <span className="font-bold text-white tracking-tight">RadiumConvert</span>
          </div>
          <p className="text-text-muted text-sm font-medium">
            Files are processed strictly locally in your browser.
          </p>
        </div>
      </footer>

      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
        <div className="pointer-events-auto w-full max-w-sm flex flex-col items-end">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              id={toast.id!}
              type={toast.type}
              message={toast.message}
              onClose={removeToast}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
