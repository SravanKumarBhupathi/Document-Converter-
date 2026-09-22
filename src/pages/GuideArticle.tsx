import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import { Combine } from 'lucide-react';

export const GuideArticle: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
      <Breadcrumbs />

      <article className="prose prose-invert max-w-none mt-8">
        <header className="mb-12 border-b border-border-dark pb-8">
          <div className="flex items-center gap-3 text-sm text-primary font-bold tracking-wider uppercase mb-4">
            <span>PDF Basics</span>
            <span>•</span>
            <span>3 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">How to Merge PDFs</h1>
          <p className="text-xl text-text-secondary">Learn how to easily combine multiple PDF documents into a single file directly in your browser without uploading your sensitive data.</p>
        </header>

        <div className="text-text-primary space-y-6 leading-relaxed text-lg">
          <p>
            Whether you are organizing invoices, submitting an assignment, or compiling a report, merging PDF files is a common necessity. With modern browser technologies, you no longer need to upload your sensitive documents to a remote server.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Step-by-Step Guide</h2>

          <div className="space-y-8 mt-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black font-bold flex items-center justify-center">1</div>
              <div>
                <h3 className="font-bold text-xl text-white mb-2">Select your files</h3>
                <p className="text-text-secondary">Navigate to the Merge PDF tool. You can drag and drop multiple PDF files directly into the workspace or click to browse your computer.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black font-bold flex items-center justify-center">2</div>
              <div>
                <h3 className="font-bold text-xl text-white mb-2">Arrange the order</h3>
                <p className="text-text-secondary">Once uploaded, you will see a list of your files. Use the up and down arrows to rearrange the documents into the exact order you want them to appear in the final merged PDF.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-black font-bold flex items-center justify-center">3</div>
              <div>
                <h3 className="font-bold text-xl text-white mb-2">Merge and Download</h3>
                <p className="text-text-secondary">Click the "Merge PDFs" button. The tool will process the files instantly in your browser. Once complete, click Download to save your new combined file.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Tool CTA */}
        <div className="mt-16 p-8 bg-bg-input border border-primary/30 rounded-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                Ready to merge your files?
              </h3>
              <p className="text-text-secondary">Combine your PDFs securely and instantly.</p>
            </div>
            <Link to="/tools/merge-pdf" className="btn-primary whitespace-nowrap flex items-center gap-2 text-lg py-3 px-6 shadow-[0_0_20px_rgba(255,106,0,0.2)] hover:shadow-[0_0_30px_rgba(255,106,0,0.4)]">
              <Combine size={20} />
              Open Merge Tool
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
};
