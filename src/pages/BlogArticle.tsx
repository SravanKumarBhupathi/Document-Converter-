import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight } from 'lucide-react';

export const BlogArticle: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
      <Breadcrumbs />

      <article className="prose prose-invert max-w-none mt-8">
        <header className="mb-12 border-b border-border-dark pb-8">
          <div className="flex items-center gap-3 text-sm text-primary font-bold tracking-wider uppercase mb-4">
            <span>AI Tools</span>
            <span>•</span>
            <span>Oct 24, 2024</span>
            <span>•</span>
            <span>6 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">10 Best Free AI Tools for Students in 2024</h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-border-light flex items-center justify-center font-bold text-text-muted">RC</div>
            <div>
              <p className="font-semibold text-white text-sm">RadiumConvert Team</p>
              <p className="text-xs text-text-muted">Editorial</p>
            </div>
          </div>
        </header>

        <div className="text-text-primary space-y-6 leading-relaxed text-lg">
          <p>
            Artificial intelligence is rapidly transforming how students approach research, writing, and studying. From generating summaries of dense academic papers to helping organize schedules, AI tools have become indispensable.
          </p>
          <p>
            However, with so many premium subscriptions out there, it can be hard to find high-quality tools that won't break a student budget. Here is our curated list of the best completely free AI utilities available right now.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">1. Document and Research Assistants</h2>
          <p>
            One of the most time-consuming aspects of university life is parsing through hundreds of pages of PDFs. While AI can help summarize these, you often need to extract, merge, or compress these documents first before feeding them into LLMs.
          </p>

          <div className="p-6 my-8 border-l-4 border-primary bg-bg-input rounded-r-lg">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <GraduationCap className="text-primary" size={20} />
              Pro Student Tip
            </h4>
            <p className="text-text-secondary text-base m-0">
              Before running heavy PDFs through AI summarizers, use our client-side <Link to="/tools/split-pdf" className="text-primary hover:underline">PDF Split tool</Link> to extract only the specific chapters you need to read. It saves time and ensures you don't hit strict AI token limits.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">2. AI Note-Taking Apps</h2>
          <p>
            Tools like Notion AI and Obsidian offer incredible ways to connect your thoughts. Many of them offer robust free tiers tailored specifically for students with active .edu email addresses.
          </p>

          <h2 className="text-2xl font-bold text-white mt-10 mb-4">Conclusion</h2>
          <p>
            Incorporating these tools into your daily workflow can save you dozens of hours a semester. Just remember that AI is an assistant, not a replacement for actual learning and critical thinking.
          </p>
        </div>

        {/* Related Content CTA */}
        <div className="mt-16 pt-8 border-t border-border-dark flex justify-between items-center">
          <Link to="/blog" className="text-text-muted hover:text-white font-medium flex items-center gap-2 transition-colors">
            ← Back to Blog
          </Link>
          <Link to="/tools/student-tools" className="text-primary hover:text-primary-hover font-semibold flex items-center gap-2 transition-colors">
            Explore Student Tools <ArrowRight size={18} />
          </Link>
        </div>
      </article>
    </div>
  );
};
