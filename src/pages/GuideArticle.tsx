import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Combine } from 'lucide-react';
import { getGuideBySlug } from '../data/content';

export const GuideArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return <Navigate to="/guides" replace />;

  const guide = getGuideBySlug(slug);

  if (!guide) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Guide Not Found</h1>
        <p className="text-text-secondary mb-8">Looks like this guide got converted into something else.</p>
        <Link to="/guides" className="btn-primary">Back to Guides</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
      <Breadcrumbs />

      <article className="prose prose-invert max-w-none mt-8">
        <header className="mb-12 border-b border-border-dark pb-8">
          <div className="flex items-center gap-3 text-sm text-primary font-bold tracking-wider uppercase mb-4">
            <span>{guide.category}</span>
            {guide.readTime && (
              <>
                <span>•</span>
                <span>{guide.readTime}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{guide.title}</h1>
          <p className="text-xl text-text-secondary">{guide.description}</p>
        </header>

        {/* Dynamic content rendering from CMS string */}
        <div className="text-text-primary space-y-6 leading-relaxed text-lg content-html" dangerouslySetInnerHTML={{ __html: guide.content }} />

        {/* Inline Tool CTA */}
        {guide.relatedToolRoute && (
          <div className="mt-16 p-8 bg-bg-input border border-primary/30 rounded-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-3">
                  Ready to put this guide into action?
                </h3>
                <p className="text-text-secondary">Use our tool securely and instantly directly in your browser.</p>
              </div>
              <Link to={guide.relatedToolRoute} className="btn-primary whitespace-nowrap flex items-center gap-2 text-lg py-3 px-6 shadow-[0_0_20px_rgba(255,106,0,0.2)] hover:shadow-[0_0_30px_rgba(255,106,0,0.4)]">
                <Combine size={20} />
                Open Tool
              </Link>
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
