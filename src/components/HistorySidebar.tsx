import React from 'react';
import { Clock, Trash2, ArrowRight } from 'lucide-react';
import type { ConversionHistoryItem } from '../types';

interface HistorySidebarProps {
  history: ConversionHistoryItem[];
  onClear: () => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ history, onClear }) => {
  if (history.length === 0) {
    return (
      <div className="bg-bg-panel border border-border-dark rounded-xl p-6 h-full min-h-[300px] flex flex-col">
        <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
          <Clock size={20} className="text-primary" />
          Recent Activity
        </h3>
        <div className="flex-1 flex flex-col items-center justify-center text-text-muted">
          <Clock size={32} className="mb-3 opacity-50" />
          <p className="text-sm text-center">No recent conversions</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-panel border border-border-dark rounded-xl p-6 h-full flex flex-col max-h-[800px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Clock size={20} className="text-primary" />
          Recent Activity
        </h3>
        <button
          onClick={onClear}
          className="text-text-muted hover:text-error transition-colors p-1"
          title="Clear history"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {history.map((item) => (
          <div key={item.id} className="border-b border-border-dark pb-3 last:border-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="uppercase text-[10px] font-bold bg-bg-input px-1.5 py-0.5 rounded text-text-secondary border border-border-dark">
                {item.fromFormat}
              </span>
              <ArrowRight size={12} className="text-text-muted" />
              <span className="uppercase text-[10px] font-bold bg-primary/10 text-primary px-1.5 py-0.5 rounded border border-primary/20">
                {item.toFormat}
              </span>
            </div>
            <p className="text-sm font-medium text-text-primary truncate" title={item.originalName}>
              {item.originalName}
            </p>
            <p className="text-xs text-text-muted mt-1 font-mono">
              {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
