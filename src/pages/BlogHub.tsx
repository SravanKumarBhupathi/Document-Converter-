import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { FileText } from 'lucide-react';
import { ContentCard } from '../components/CategoryCards';

export const BlogHub: React.FC = () => {
  const posts = [
    { title: "10 Best Free AI Tools for Students in 2024", description: "A curated list of free AI utilities that can help streamline your study workflow.", category: "AI Tools", route: "/blog/ai-tools/best-free-ai-tools", date: "Oct 24, 2024", readTime: "6 min read", type: "blog" as const },
    { title: "Mastering Productivity: The Pomodoro Technique", description: "How breaking your work into 25-minute intervals can dramatically improve focus.", category: "Productivity", route: "/blog/productivity/pomodoro-technique", date: "Oct 20, 2024", readTime: "4 min read", type: "blog" as const },
    { title: "Hidden Windows 11 Features You Should Use", description: "Discover powerful built-in utilities and shortcuts that most Windows users miss.", category: "Windows Tips", route: "/blog/windows-tips/hidden-features", date: "Oct 15, 2024", readTime: "7 min read", type: "blog" as const },
  ];

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
        {posts.map((post, idx) => (
          <ContentCard key={idx} {...post} />
        ))}
      </div>
    </div>
  );
};
