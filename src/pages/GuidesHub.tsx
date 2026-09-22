import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookOpen } from 'lucide-react';
import { ContentCard } from '../components/CategoryCards';

export const GuidesHub: React.FC = () => {
  const guides = [
    { title: "How to Merge PDFs", description: "Learn how to combine multiple PDF documents into a single file easily and securely.", category: "PDF Basics", route: "/guides/merge-pdfs", readTime: "3 min read", type: "guide" as const },
    { title: "How to Compress Images without Losing Quality", description: "Discover the best techniques to reduce image file sizes for the web while maintaining visual fidelity.", category: "Image Optimization", route: "/guides/compress-images", readTime: "5 min read", type: "guide" as const },
    { title: "Calculating Percentages: A Complete Guide", description: "A quick refresher on calculating percentages, increases, decreases, and differences.", category: "Math & Finance", route: "/guides/calculate-percentage", readTime: "4 min read", type: "guide" as const },
    { title: "Converting PDF to Word Documents", description: "Step-by-step instructions on extracting text and structure from PDFs into editable DOCX files.", category: "Document Workflows", route: "/guides/pdf-to-word", readTime: "4 min read", type: "guide" as const },
  ];

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Breadcrumbs />

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center gap-3">
          <BookOpen className="text-primary" size={36} />
          How-To Guides
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          Step-by-step tutorials and educational resources to help you master digital tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((guide, idx) => (
          <ContentCard key={idx} {...guide} />
        ))}
      </div>
    </div>
  );
};
