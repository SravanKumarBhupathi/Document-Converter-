import React, { useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Calculator, ArrowRight, Search } from 'lucide-react';
import { getCalculators } from '../registry';
import { Link } from 'react-router-dom';

export const CalculatorsHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const calculators = getCalculators();

  const filteredCalcs = calculators.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Breadcrumbs />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center gap-3">
            <Calculator className="text-primary" size={36} />
            Calculators
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl">
            Simple, accurate calculators for everyday life, study, and finance.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-text-muted" />
          </div>
          <input
            type="text"
            className="w-full bg-bg-input border border-border-dark text-text-primary rounded-lg focus:ring-primary focus:border-primary block pl-10 p-3 outline-none transition-colors"
            placeholder="Search calculators..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCalcs.map(calc => (
          <Link key={calc.id} to={calc.route} className="card card-hover group flex flex-col h-full bg-bg-input/30">
            <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors mb-2">{calc.name}</h3>
            <p className="text-sm text-text-secondary flex-grow">{calc.description}</p>
            <div className="mt-6 flex items-center justify-between text-sm font-semibold text-text-muted group-hover:text-primary transition-colors">
              Open Calculator <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
        {filteredCalcs.length === 0 && (
          <div className="col-span-full py-12 text-center text-text-muted border border-border-dark border-dashed rounded-xl">
            No calculators found matching "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
