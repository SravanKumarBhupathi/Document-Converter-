import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="flex text-sm text-text-muted mb-6 overflow-x-auto pb-2 custom-scrollbar">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-primary transition-colors flex items-center">
            <Home size={14} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;

          // Format text (e.g. 'pdf-tools' -> 'PDF Tools')
          let formattedValue = value.replace(/-/g, ' ');
          if (value.toLowerCase().includes('pdf')) formattedValue = formattedValue.replace(/pdf/i, 'PDF');
          if (value.toLowerCase().includes('emi')) formattedValue = formattedValue.replace(/emi/i, 'EMI');
          formattedValue = formattedValue.replace(/\b\w/g, l => l.toUpperCase());

          return (
            <li key={to} className="flex items-center space-x-2">
              <ChevronRight size={14} />
              {last ? (
                <span className="text-text-primary font-medium truncate max-w-[200px]" title={formattedValue}>{formattedValue}</span>
              ) : (
                <Link to={to} className="hover:text-primary transition-colors truncate max-w-[150px]" title={formattedValue}>
                  {formattedValue}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
