import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ConverterCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

export const ConverterCard: React.FC<ConverterCardProps> = ({
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <div
      className="card card-hover group cursor-pointer flex flex-col items-start h-full"
      onClick={onClick}
    >
      <div className="bg-off-white p-3 rounded border-2 border-border mb-4 group-hover:bg-primary group-hover:text-black transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors flex items-center w-full justify-between">
        {title}
        <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </h3>
      <p className="text-muted text-sm flex-grow">
        {description}
      </p>
    </div>
  );
};
