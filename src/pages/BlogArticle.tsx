import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Link, useParams, Navigate } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { getBlogPostBySlug } from '../data/content';

export const BlogArticle: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) return <Navigate to="/blog" replace />;

  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-text-secondary mb-8">Looks like this page got converted into something else.</p>
        <Link to="/blog" className="btn-primary">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
      <Breadcrumbs />

      <article className="prose prose-invert max-w-none mt-8">
        <header className="mb-12 border-b border-border-dark pb-8">
          <div className="flex items-center gap-3 text-sm text-primary font-bold tracking-wider uppercase mb-4">
            <span>{post.category}</span>
            <span>•</span>
            <span>{post.date}</span>
            {post.readTime && (
              <>
                <span>•</span>
                <span>{post.readTime}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">{post.title}</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-border-light flex items-center justify-center font-bold text-text-muted">RC</div>
            <div>
              <p className="font-semibold text-white text-sm">RadiumConvert Team</p>
              <p className="text-xs text-text-muted">Editorial</p>
            </div>
          </div>
        </header>

        {/* Dynamic content rendering from CMS string */}
        <div className="text-text-primary space-y-6 leading-relaxed text-lg content-html" dangerouslySetInnerHTML={{ __html: post.content }} />

        {/* Example of related tool CTA logic if specified */}
        {post.relatedToolRoute && (
          <div className="p-6 my-8 border-l-4 border-primary bg-bg-input rounded-r-lg mt-12">
             <h4 className="text-white font-bold mb-2 flex items-center gap-2">
               <GraduationCap className="text-primary" size={20} />
               Related Tool
             </h4>
             <p className="text-text-secondary text-base m-0">
               Try out our <Link to={post.relatedToolRoute} className="text-primary hover:underline font-semibold">interactive tool</Link> mentioned in this article.
             </p>
          </div>
        )}

        {/* Related Content CTA */}
        <div className="mt-16 pt-8 border-t border-border-dark flex justify-between items-center">
          <Link to="/blog" className="text-text-muted hover:text-white font-medium flex items-center gap-2 transition-colors">
            ← Back to Blog
          </Link>
          <Link to="/tools" className="text-primary hover:text-primary-hover font-semibold flex items-center gap-2 transition-colors">
            Explore Tools <ArrowRight size={18} />
          </Link>
        </div>
      </article>
    </div>
  );
};
