import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '../components/FileUpload';
import { ConversionInterface } from '../components/ConversionInterface';
import { useHistory } from '../hooks/useHistory';
import type { FileState, SupportedFormat } from '../types';
import { generateAcceptStringForTool, getPopularTools, getCalculators } from '../registry';
import { getConverter, identifyFormat, buildFormatMap } from '../converters';
import { v4 as uuidv4 } from 'uuid';
import { ArrowRight, Calculator, Search, BookOpen, Clock, FileText, Zap } from 'lucide-react';
import { GUIDES, BLOG_POSTS } from '../data/content';

export const Home: React.FC = () => {
  const [files, setFiles] = useState<FileState[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToHistory } = useHistory();
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
    setTimeout(() => {
      document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
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

  // Content Selection
  const featuredKnowledge = BLOG_POSTS.slice(0, 2);
  const everydayKnowledge = GUIDES.slice(0, 3);
  const learnToUse = [...GUIDES, ...BLOG_POSTS].filter(item => item.relatedToolRoute).slice(0, 3);
  const popularTools = getPopularTools().filter(t => !t.isCalculator).slice(0, 8);
  const popularCalculators = getCalculators().slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero & Search Section */}
      <section className="relative w-full px-4 pt-16 pb-20 border-b border-border-dark overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Useful tools. Practical knowledge. <br />
            <span className="text-primary">One simple space.</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Discover useful guides, everyday knowledge, calculators and tools for common digital tasks.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="text-text-muted group-focus-within:text-primary transition-colors" size={20} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tools, calculators and articles..."
              className="w-full bg-bg-panel border-2 border-border-dark rounded-xl pl-12 pr-4 py-4 text-lg text-text-primary outline-none focus:border-primary focus:shadow-[0_0_20px_rgba(255,106,0,0.2)] transition-all"
            />
            {/* Note: Full search dropdown logic would go here, currently handled visually via input */}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">

        {/* Workspace Component (Appears when files are dropped or selected) */}
        <section id="workspace" className="relative z-20 -mt-24 mb-16">
           <div className="card shadow-[0_8px_40px_rgba(0,0,0,0.6)] border-border-dark">
              {files.length === 0 ? (
                <div className="p-4">
                  <FileUpload onFilesSelected={handleFilesSelected} acceptString={acceptString} />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-border-dark pb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2"><Zap className="text-primary"/> Conversion Workspace</h2>
                    <button onClick={() => setFiles([])} className="text-text-muted hover:text-text-primary text-sm font-medium transition-colors">Clear All</button>
                  </div>
                  <ConversionInterface files={files} onConvert={handleConvert} onRemove={handleRemoveFile} onDownload={handleDownload} availableFormats={formatMap} />
                  <div className="pt-4 mt-4 border-t border-border-dark">
                    <FileUpload onFilesSelected={handleFilesSelected} acceptString={acceptString} />
                  </div>
                </div>
              )}
           </div>
        </section>

        {/* Featured Knowledge */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-border-dark pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
                <BookOpen className="text-primary" size={28} />
                Featured Knowledge
              </h2>
            </div>
            <button onClick={() => navigate('/blog')} className="text-primary hover:text-primary-hover font-semibold flex items-center gap-1 text-sm md:text-base hidden sm:flex">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredKnowledge.map(item => (
              <article key={item.id} className="card card-hover bg-bg-panel group flex flex-col h-full cursor-pointer" onClick={() => navigate(`/blog/${item.slug}`)}>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded">
                    {item.category}
                  </span>
                  {item.readTime && <span className="text-xs text-text-muted flex items-center gap-1"><Clock size={12}/> {item.readTime}</span>}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-text-secondary text-sm line-clamp-3 mb-6 flex-grow">{item.description}</p>
                <div className="flex justify-between items-center pt-4 border-t border-border-dark">
                   <span className="text-sm font-medium">Read Article</span>
                   <ArrowRight size={16} className="text-primary -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Learn -> Use (Tool-supported content) */}
        <section className="bg-bg-panel border border-border-dark rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="relative z-10">
            <div className="mb-8 max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Learn <ArrowRight className="inline text-primary" /> Use</h2>
              <p className="text-text-secondary text-lg">Learn how something works, then immediately use the right UtilitySpace tool to get it done.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {learnToUse.map(item => (
                <div key={item.id} className="bg-bg-input border border-border-dark rounded-xl p-5 flex flex-col h-full hover:border-border-light transition-colors">
                  <h3 className="font-bold text-lg mb-2 leading-tight">{item.title}</h3>
                  <p className="text-text-muted text-sm line-clamp-2 mb-6 flex-grow">{item.description}</p>

                  {item.relatedToolRoute && (
                    <button
                      onClick={(e) => { e.stopPropagation(); navigate(item.relatedToolRoute!); }}
                      className="btn-primary w-full flex justify-between items-center text-sm"
                    >
                      Use Tool <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Everyday Knowledge */}
        <section>
          <div className="flex justify-between items-end mb-8 border-b border-border-dark pb-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
                <FileText className="text-primary" size={28} />
                Everyday Knowledge
              </h2>
              <p className="text-text-secondary mt-2">Simple explanations for the technology and digital tasks you deal with every day.</p>
            </div>
            <button onClick={() => navigate('/guides')} className="text-primary hover:text-primary-hover font-semibold flex items-center gap-1 text-sm md:text-base hidden sm:flex">
              All Guides <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {everydayKnowledge.map(item => (
              <article key={item.id} className="card card-hover bg-bg-panel group cursor-pointer" onClick={() => navigate(`/guides/${item.slug}`)}>
                <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-text-secondary text-sm line-clamp-2 mb-4">{item.description}</p>
                <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">{item.category}</span>
              </article>
            ))}
          </div>
        </section>

        {/* Popular Tools & Calculators Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t border-border-dark pt-12">
          {/* Tools */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Popular Tools</h2>
              <button onClick={() => navigate('/tools')} className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularTools.map(tool => (
                <button
                  key={tool.id}
                  onClick={() => navigate(tool.route)}
                  className="bg-bg-input border border-border-dark rounded-xl p-4 text-left group hover:border-primary transition-colors"
                >
                  <div className="font-bold text-text-primary mb-1 group-hover:text-primary transition-colors flex justify-between items-center">
                    {tool.name}
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </div>
                  <div className="text-xs text-text-secondary line-clamp-2">{tool.description}</div>
                </button>
              ))}
            </div>
          </section>

          {/* Calculators */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="text-primary" size={24} /> Popular Calculators
              </h2>
              <button onClick={() => navigate('/calculators')} className="text-sm font-medium text-primary hover:text-primary-hover flex items-center gap-1">
                View All <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {popularCalculators.map(calc => (
                <button
                  key={calc.id}
                  onClick={() => navigate(calc.route)}
                  className="bg-bg-input border border-border-dark rounded-xl p-4 text-left group hover:border-primary transition-colors"
                >
                  <div className="font-bold text-text-primary mb-1 group-hover:text-primary transition-colors flex justify-between items-center">
                    {calc.name}
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                  </div>
                  <div className="text-xs text-text-secondary line-clamp-2">{calc.description}</div>
                </button>
              ))}
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};
