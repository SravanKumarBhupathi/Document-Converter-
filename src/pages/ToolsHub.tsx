import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CategoryCard } from '../components/CategoryCards';
import { FileText, Image as ImageIcon, Type, Code, GraduationCap } from 'lucide-react';
import { ToolsDirectory } from '../components/ToolsDirectory';
import { TOOLS_REGISTRY } from '../registry';

export const ToolsHub: React.FC = () => {
  const getCount = (category: string) => TOOLS_REGISTRY.filter(t => t.category === category).length;

  const categories = [
    {
      icon: <FileText className="text-primary" size={24} />,
      title: "PDF Tools",
      description: "Convert, merge, split, compress and organize PDF files.",
      route: "/tools/pdf-tools",
      count: getCount("PDF Tools")
    },
    {
      icon: <ImageIcon className="text-primary" size={24} />,
      title: "Image Tools",
      description: "Resize, compress, convert, crop and optimize images.",
      route: "/tools/image-tools",
      count: getCount("Image Tools")
    },
    {
      icon: <Type className="text-primary" size={24} />,
      title: "Text Tools",
      description: "Format, clean, transform and analyze text.",
      route: "/tools/text-tools",
      count: getCount("Document Tools") // Using Document Tools for now as Text isn't fully separated
    },
    {
      icon: <Code className="text-primary" size={24} />,
      title: "Developer Tools",
      description: "Useful utilities for developers and technical users.",
      route: "/tools/developer-tools",
      count: 0
    },
    {
      icon: <GraduationCap className="text-primary" size={24} />,
      title: "Student Tools",
      description: "Tools designed for students, assignments and study tasks.",
      route: "/tools/student-tools",
      count: 0
    }
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Breadcrumbs />

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center gap-3">
          All Tools
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Useful tools for PDFs, images, text, developers and students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {categories.map((cat, idx) => (
          <CategoryCard key={idx} {...cat} />
        ))}
      </div>

      <div className="border-t border-border-dark pt-16">
        <ToolsDirectory onSelectTool={(_from, _to) => {
          // Could navigate dynamically or just scroll if rendering generic converter
        }} />
      </div>
    </div>
  );
};
