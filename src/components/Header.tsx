import React from 'react';
import { Menu, X, FileOutput } from 'lucide-react';
import { useState } from 'react';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="border-b-2 border-border bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded border-2 border-border">
              <FileOutput size={24} className="text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight">DocConvert</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#top" className="text-black font-semibold hover:text-primary transition-colors">Converter</a>
            <a href="#tools" className="text-black font-semibold hover:text-primary transition-colors">Tools</a>
            <a href="#how-it-works" className="text-black font-semibold hover:text-primary transition-colors">How it works</a>
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex">
            <a href="#about" className="btn-secondary text-sm">About</a>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded border-2 border-border hover:bg-off-white hover:text-primary focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t-2 border-border bg-white absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#top" className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-primary-soft hover:text-primary transition-colors">Converter</a>
            <a href="#tools" className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-primary-soft hover:text-primary transition-colors">Tools</a>
            <a href="#how-it-works" className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-primary-soft hover:text-primary transition-colors">How it works</a>
            <a href="#about" className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-primary-soft hover:text-primary transition-colors">About</a>
          </div>
        </div>
      )}
    </header>
  );
};
