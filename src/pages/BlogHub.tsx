import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FileText } from 'lucide-react';
import { ContentCard } from '../components/CategoryCards';
import { BLOG_POSTS } from '../data/content';

export const BlogHub: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <Breadcrumbs />

      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 flex items-center gap-3">
          <FileText className="text-primary" size={36} />
          Blog
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl">
          News, tips, and insights on productivity, technology, and getting things done.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <ContentCard
            key={post.id}
            title={post.title}
            description={post.description}
            category={post.category}
            route={`/blog/${post.category.toLowerCase().replace(/\s+/g, '-')}/${post.slug}`}
            date={post.date}
            readTime={post.readTime}
            type={post.type}
          />
        ))}
      </div>
    </div>
  );
};
