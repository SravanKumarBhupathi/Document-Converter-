import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, Layers } from 'lucide-react';
import { converters } from '../converters';
import type { SupportedFormat } from '../types';

interface ToolsDirectoryProps {
  onSelectTool: (from: SupportedFormat, to: SupportedFormat) => void;
}

export const ToolsDirectory: React.FC<ToolsDirectoryProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const tools = useMemo(() => {
    const list: { from: SupportedFormat, to: SupportedFormat, name: string, category: string }[] = [];

    converters.forEach(converter => {
      converter.from.forEach(fromFmt => {
        converter.to.forEach(toFmt => {
          if (fromFmt === toFmt) return; // Skip same-format identity converters

          let category = 'Other';
          if (fromFmt === 'pdf' || toFmt === 'pdf') category = 'PDF Tools';
          else if (['jpg', 'png', 'webp'].includes(fromFmt)) category = 'Image Tools';
          else if (['docx', 'txt', 'html'].includes(fromFmt)) category = 'Document Tools';

          list.push({
            from: fromFmt,
            to: toFmt,
            name: `${fromFmt.toUpperCase()} to ${toFmt.toUpperCase()}`,
            category
          });
        });
      });
    });

    return list;
  }, []);

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return tools;
    const q = searchQuery.toLowerCase();
    return tools.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.from.toLowerCase().includes(q) ||
      t.to.toLowerCase().includes(q)
    );
  }, [tools, searchQuery]);

  // Group by category
  const groupedTools = useMemo(() => {
    const groups: Record<string, typeof tools> = {};
    filteredTools.forEach(t => {
      if (!groups[t.category]) groups[t.category] = [];
      groups[t.category].push(t);
    });
    return groups;
  }, [filteredTools]);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Layers className="text-primary" />
          All Tools
        </h2>

        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-text-muted" />
          </div>
          <input
            type="text"
            className="w-full bg-bg-input border border-border-dark text-text-primary text-sm rounded-lg focus:ring-primary focus:border-primary block pl-10 p-2.5 outline-none transition-colors"
            placeholder="Search conversions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {Object.keys(groupedTools).length === 0 ? (
        <div className="text-center py-12 text-text-muted border border-border-dark rounded-xl border-dashed">
          No tools found matching "{searchQuery}"
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(groupedTools).sort(([a], [b]) => a.localeCompare(b)).map(([category, items]) => (
            <div key={category}>
              <h3 className="text-sm font-mono text-text-secondary uppercase tracking-wider mb-4 border-b border-border-dark pb-2">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((tool, idx) => (
                  <button
                    key={`${tool.from}-${tool.to}-${idx}`}
                    onClick={() => onSelectTool(tool.from, tool.to)}
                    className="card card-hover flex items-center justify-between text-left group w-full px-4 py-3 bg-bg-input/50"
                  >
                    <span className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {tool.name}
                    </span>
                    <ArrowRight size={16} className="text-text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
