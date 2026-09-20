import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Footer } from './components/Footer';
import { FileUpload } from './components/FileUpload';
import { ConverterCard } from './components/ConverterCard';
import { ConversionInterface } from './components/ConversionInterface';
import { Toast, type ToastProps } from './components/Toast';
import type { FileState, SupportedFormat } from './types';
import { buildFormatMap, getConverter } from './converters';
import { FileText, FileImage, Files, Image as ImageIcon } from 'lucide-react';

function App() {
  const [files, setFiles] = useState<FileState[]>([]);
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);

  const formatMap = useMemo(() => buildFormatMap(), []);
  const allAcceptedFormats = useMemo(() => {
    const formats = new Set<string>();
    Object.keys(formatMap).forEach(fmt => {
      formats.add(`.${fmt}`);
    });
    return Array.from(formats);
  }, [formatMap]);

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

    // Smooth scroll to converter workspace
    setTimeout(() => {
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleConvert = async (fileId: string, outputFormat: SupportedFormat) => {
    const fileState = files.find(f => f.id === fileId);
    if (!fileState) return;

    const fromExt = fileState.file.name.split('.').pop()?.toLowerCase() || '';
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

    addToast('success', `Downloaded ${fileState.convertedName}`);
  };

  return (
    <div id="top" className="flex flex-col min-h-screen bg-off-white">
      <Header />

      <main className="flex-grow">
        {files.length === 0 ? (
          <>
            <Hero />

            {/* Quick Tools Section */}
            <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Popular Tools</h2>
                <p className="text-muted max-w-2xl mx-auto">Access our most used conversion tools directly. Everything runs right in your browser for maximum speed and privacy.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <ConverterCard
                  icon={<FileText size={24} />}
                  title="DOCX to Text"
                  description="Convert Word documents to clean text format."
                  onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
                />
                <ConverterCard
                  icon={<FileImage size={24} />}
                  title="Image to PDF"
                  description="Convert JPG, PNG, or WEBP images into a PDF document."
                  onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
                />
                <ConverterCard
                  icon={<ImageIcon size={24} />}
                  title="JPG to PNG"
                  description="Transform your images with transparent backgrounds."
                  onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
                />
                <ConverterCard
                  icon={<Files size={24} />}
                  title="Word to Text"
                  description="Extract pure text from DOCX documents."
                  onClick={() => document.getElementById('upload-zone')?.scrollIntoView({ behavior: 'smooth' })}
                />
              </div>
            </section>
          </>
        ) : null}

        {/* Main Workspace Area */}
        <section
          id={files.length === 0 ? "upload-zone" : "workspace"}
          className={`py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto transition-all duration-500 ease-in-out ${files.length > 0 ? 'mt-8' : ''}`}
        >
          {files.length === 0 && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Start Converting</h2>
              <p className="text-muted">Drop your files below to get started. Files are processed locally.</p>
            </div>
          )}

          <FileUpload
            onFilesSelected={handleFilesSelected}
            acceptedFormats={allAcceptedFormats}
          />

          {files.length > 0 && (
            <div className="mt-12 bg-white rounded-xl border-2 border-border p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(17,17,17,1)]">
              <ConversionInterface
                files={files}
                onConvert={handleConvert}
                onRemove={handleRemoveFile}
                onDownload={handleDownload}
                availableFormats={formatMap}
              />
            </div>
          )}
        </section>
      </main>

      <Footer />

      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        <div className="pointer-events-auto">
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
