import React from 'react';
import { FileOutput, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-2 border-border bg-off-white mt-auto">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1 rounded border-2 border-border">
                <FileOutput size={20} className="text-black" />
              </div>
              <span className="font-bold text-lg tracking-tight">DocConvert</span>
            </div>
            <p className="text-muted mb-4 max-w-sm">
              Simple, fast, and secure document conversion tools for everyday use.
              Files are processed locally when possible and never permanently stored.
            </p>
            <div className="flex space-x-4">
              <a href="#top" className="text-black hover:text-primary transition-colors">
                <span className="sr-only">GitHub</span>
                <span>GitHub</span>
              </a>
              <a href="#top" className="text-black hover:text-primary transition-colors">
                <span className="sr-only">Twitter</span>
                <span>Twitter</span>
              </a>
              <a href="#top" className="text-black hover:text-primary transition-colors">
                <span className="sr-only">Contact</span>
                <Mail size={24} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Tools</h3>
            <ul className="space-y-3">
              <li><a href="#top" className="text-muted hover:text-primary transition-colors">DOCX to Text</a></li>
              <li><a href="#top" className="text-muted hover:text-primary transition-colors">Image to PDF</a></li>
              <li><a href="#top" className="text-muted hover:text-primary transition-colors">Text to PDF</a></li>
              <li><a href="#top" className="text-muted hover:text-primary transition-colors">JPG to PNG</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-black uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#top" className="text-muted hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#top" className="text-muted hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#top" className="text-muted hover:text-primary transition-colors">About</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-base text-muted">
            &copy; {new Date().getFullYear()} DocConvert. All rights reserved.
          </p>
          <p className="text-sm text-muted mt-4 md:mt-0 font-medium">
            Files are processed only for conversion and are not permanently stored.
          </p>
        </div>
      </div>
    </footer>
  );
};
