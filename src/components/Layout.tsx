import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Sun, Moon } from 'lucide-react';
import { Toast, type ToastProps } from './Toast';
import { v4 as uuidv4 } from 'uuid';

export const ToastContext = React.createContext<{
  addToast: (type: ToastProps['type'], message: string) => void;
}>({ addToast: () => {} });

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [toasts, setToasts] = useState<Omit<ToastProps, 'onClose'>[]>([]);
  const location = useLocation();

  const addToast = (type: ToastProps['type'], message: string) => {
    const id = uuidv4();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Close mobile menu and scroll to top on route change
  React.useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.setProperty('--color-bg-base', '#080808');
      root.style.setProperty('--color-bg-panel', '#111111');
      root.style.setProperty('--color-bg-card', '#171717');
      root.style.setProperty('--color-bg-input', '#1A1A1A');
      root.style.setProperty('--color-text-primary', '#FFFFFF');
      root.style.setProperty('--color-text-secondary', '#A8A8A8');
      root.style.setProperty('--color-border-dark', '#262626');
      root.style.setProperty('--color-border-light', '#333333');
    } else {
      root.classList.remove('dark');
      root.style.setProperty('--color-bg-base', '#F9FAFB');
      root.style.setProperty('--color-bg-panel', '#FFFFFF');
      root.style.setProperty('--color-bg-card', '#FFFFFF');
      root.style.setProperty('--color-bg-input', '#F3F4F6');
      root.style.setProperty('--color-text-primary', '#111827');
      root.style.setProperty('--color-text-secondary', '#4B5563');
      root.style.setProperty('--color-border-dark', '#E5E7EB');
      root.style.setProperty('--color-border-light', '#D1D5DB');
    }
  }, [theme]);

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const getPageTitle = () => {
    if (location.pathname === '/') return 'CONVERT';
    if (location.pathname.startsWith('/tools')) return 'TOOLS';
    if (location.pathname.startsWith('/calculators')) return 'CALCULATORS';
    if (location.pathname.startsWith('/guides')) return 'GUIDES';
    if (location.pathname.startsWith('/blog')) return 'BLOG';
    return '';
  };

  const pageTitle = getPageTitle();

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div id="top" className="flex flex-col min-h-screen relative bg-bg-base overflow-x-hidden">

        {/* Header */}
        <header className="border-b border-border-dark bg-bg-base/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 cursor-pointer transition-transform hover:scale-105">
                <div className="bg-primary p-1.5 rounded-md shadow-[0_0_10px_rgba(255,106,0,0.4)]">
                  <Zap size={20} className="text-bg-base" fill="currentColor" />
                </div>
                <span className="font-extrabold text-xl tracking-tight text-text-primary">Radium<span className="text-primary">Convert</span></span>
              </Link>

              {/* Desktop Nav */}
              <nav className="hidden md:flex space-x-8">
                <Link to="/" className={`font-medium text-sm transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>Convert</Link>
                <Link to="/tools" className={`font-medium text-sm transition-colors ${location.pathname.startsWith('/tools') ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>Tools Directory</Link>
                <Link to="/calculators" className={`font-medium text-sm transition-colors ${location.pathname.startsWith('/calculators') ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>Calculators</Link>
                <Link to="/guides" className={`font-medium text-sm transition-colors ${location.pathname.startsWith('/guides') ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>Guides</Link>
                <Link to="/blog" className={`font-medium text-sm transition-colors ${location.pathname.startsWith('/blog') ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>Blog</Link>
              </nav>

              {/* Theme Toggle Desktop */}
              <div className="hidden md:flex items-center ml-4 border-l border-border-dark pl-4">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-input transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center md:hidden gap-2">
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-input transition-colors focus:outline-none"
                  aria-label="Toggle Dark Mode"
                >
                  {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="text-text-secondary hover:text-text-primary p-2 focus:outline-none"
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
                <Link to="/guides" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-bg-input">Guides</Link>
                <Link to="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-text-primary hover:bg-bg-input">Blog</Link>
              </div>
            </div>
          )}
        </header>

        {/* Page Title Indicator */}
        {pageTitle && (
          <div className="w-full border-b border-border-dark bg-bg-panel/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="inline-block relative">
                <span className="text-primary font-bold tracking-[0.2em] text-xs md:text-sm">
                  {pageTitle}
                </span>
                <div className="absolute -bottom-[9px] left-0 w-full h-[2px] bg-text-primary"></div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-grow flex flex-col relative w-full overflow-x-hidden">
          {/* Global decorative background element */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] max-w-full bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

          <Outlet />
        </main>

        <footer className="border-t border-border-dark bg-bg-panel mt-auto py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col items-center md:items-start gap-2">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-primary" fill="currentColor" />
                <span className="font-bold text-text-primary tracking-tight">RadiumConvert</span>
              </div>
              <p className="text-text-muted text-sm font-medium text-center md:text-left max-w-sm">
                Files are processed strictly locally in your browser. They never leave your device.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-text-secondary">
              <Link to="/tools" className="hover:text-primary transition-colors">All Tools</Link>
              <Link to="/calculators" className="hover:text-primary transition-colors">Calculators</Link>
              <Link to="/guides" className="hover:text-primary transition-colors">Guides</Link>
              <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
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
