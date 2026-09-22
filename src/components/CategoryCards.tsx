import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, FileText } from 'lucide-react';

export interface CategoryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  route: string;
  count?: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ icon, title, description, route, count }) => (
  <Link to={route} className="card card-hover group flex flex-col h-full bg-bg-input/30 hover:bg-bg-input">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-bg-base p-2.5 rounded-lg border border-border-dark group-hover:border-primary/50 transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg text-text-primary group-hover:text-primary transition-colors">{title}</h3>
        {count !== undefined && <span className="text-xs font-mono text-text-muted">{count} tools</span>}
      </div>
    </div>
    <p className="text-sm text-text-secondary mb-6 flex-grow">{description}</p>
    <div className="flex items-center text-sm font-semibold text-text-primary group-hover:text-primary transition-colors mt-auto">
      View Tools <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);

export interface ContentCardProps {
  title: string;
  description: string;
  category: string;
  route: string;
  readTime?: string;
  date?: string;
  type: 'guide' | 'blog';
}

export const ContentCard: React.FC<ContentCardProps> = ({ title, description, category, route, readTime, date, type }) => (
  <Link to={route} className="card card-hover group flex flex-col h-full bg-bg-input/30">
    <div className="flex items-center justify-between mb-4">
      <span className="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
        {category}
      </span>
      {type === 'guide' ? (
        <BookOpen size={16} className="text-text-muted" />
      ) : (
        <FileText size={16} className="text-text-muted" />
      )}
    </div>
    <h3 className="font-bold text-lg text-text-primary mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
    <p className="text-sm text-text-secondary mb-6 flex-grow line-clamp-3">{description}</p>

    <div className="flex items-center justify-between mt-auto pt-4 border-t border-border-dark">
      <div className="flex items-center gap-4 text-xs text-text-muted font-mono">
        {readTime && <span className="flex items-center gap-1"><Clock size={12} /> {readTime}</span>}
        {date && <span>{date}</span>}
      </div>
      <ArrowRight size={16} className="text-text-muted opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
    </div>
  </Link>
);
