import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllBlogPosts } from '@/lib/blogs-store';
import { BookOpen, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tutorials & Guides - CodeHubb Tools Blog',
  description: 'In-depth tutorials, technical guides, and best practices on PDF manipulation, image enhancement with AI, vector conversions, and web utilities.',
  alternates: { canonical: './' },
};

export default function BlogListPage() {
  const blogPosts = getAllBlogPosts();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-4">
            <BookOpen size={16} />
            <span>Knowledge Base &amp; Tutorials</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            CodeHubb Tools Guides &amp; Blog
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-4 text-base sm:text-lg">
            Master online utilities, learn how browser WebAssembly protects your privacy, and get the most out of our AI assistants.
          </p>
        </div>

        {/* Featured Post (First post) */}
        {blogPosts.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-900 to-purple-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <Sparkles size={160} />
            </div>
            <div className="max-w-2xl relative z-10 space-y-4">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                Featured Guide
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight group-hover:text-indigo-200 transition-colors">
                <Link href={`/blog/${blogPosts[0].slug}`}>
                  {blogPosts[0].title}
                </Link>
              </h2>
              <p className="text-indigo-200 text-sm sm:text-base leading-relaxed line-clamp-3">
                {blogPosts[0].excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-300 pt-2">
                <span className="flex items-center gap-1">
                  <Calendar size={14} />
                  {blogPosts[0].publishedAt}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {blogPosts[0].readTime}
                </span>
                <span>By {blogPosts[0].author?.name || 'Staff'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.slice(1).map((post) => (
            <article 
              key={post.slug}
              className="bg-white dark:bg-gray-800 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {post.readTime}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                  <Link href={`/blog/${post.slug}`}>
                    {post.title}
                  </Link>
                </h3>

                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  <p className="font-semibold text-gray-900 dark:text-white">{post.author?.name || 'Staff'}</p>
                  <p>{post.publishedAt}</p>
                </div>
                <Link 
                  href={`/blog/${post.slug}`} 
                  className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all"
                >
                  <span>Read</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
