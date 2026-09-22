import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Zap } from 'lucide-react';
import { Toast, type ToastProps } from './Toast';
import { v4 as uuidv4 } from 'uuid';

export const ToastContext = React.createContext<{
  addToast: (type: ToastProps['type'], message: string) => void;
}>({ addToast: () => {} });

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);
  const location = useLocation();

  const addToast = (type: ToastProps['type'], message: string) => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div id="top" className="flex flex-col min-h-screen relative bg-bg-base">

        {/* Header */}
        <header className="border-b border-border-dark bg-bg-base/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                <div className="bg-primary p-1.5 rounded-md shadow-[0_0_10px_rgba(255,106,0,0.4)]">
                  <Zap size={20} className="text-bg-base" fill="currentColor" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-white">Radium<span className="text-primary">Convert</span></span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className={`font-medium text-sm transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-text-secondary hover:text-white'}`}>Convert</Link>
                <Link to="/tools" className={`font-medium text-sm transition-colors ${location.pathname.startsWith('/tools') ? 'text-primary' : 'text-text-secondary hover:text-white'}`}>Tools Directory</Link>
                <Link to="/calculators" className={`font-medium text-sm transition-colors ${location.pathname.startsWith('/calculators') ? 'text-primary' : 'text-text-secondary hover:text-white'}`}>Calculators</Link>
              </nav>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-text-secondary hover:text-white p-2 focus:outline-none"
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
                <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-bg-input">Convert</Link>
                <Link to="/tools" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-bg-input">Tools Directory</Link>
                <Link to="/calculators" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-bg-input">Calculators</Link>
              </div>
            </div>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col relative w-full">
          {/* Global decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

          <Outlet />
        </main>

        <footer className="border-t border-border-dark bg-bg-panel mt-auto py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-primary" fill="currentColor" />
                <span className="font-bold text-white tracking-tight">RadiumConvert</span>
              </div>
              <p className="text-text-muted text-sm font-medium text-center md:text-left max-w-sm">
                Files are processed strictly locally in your browser. They never leave your device.
              </p>
            </div>

            <div className="flex gap-8 text-sm font-medium text-text-secondary">
              <Link to="/tools" className="hover:text-primary transition-colors">All Tools</Link>
              <Link to="/calculators" className="hover:text-primary transition-colors">Calculators</Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">GitHub</a>
            </div>
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
    </ToastContext.Provider>
  );
};
