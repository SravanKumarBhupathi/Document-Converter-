import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { BookOpen } from 'lucide-react';
import { ContentCard } from '../components/CategoryCards';
import { GUIDES } from '../data/content';

export const GuidesHub: React.FC = () => {
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
        {GUIDES.map((guide) => (
          <ContentCard
            key={guide.id}
            title={guide.title}
            description={guide.description}
            category={guide.category}
            route={`/guides/${guide.slug}`}
            readTime={guide.readTime}
            type={guide.type}
          />
        ))}
      </div>
    </div>
  );
};
