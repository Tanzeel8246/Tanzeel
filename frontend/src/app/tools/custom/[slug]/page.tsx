import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getToolBySlug, getAllTools } from '@/lib/tools-store';
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, HelpCircle, Code, ExternalLink } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found',
    };
  }

  return {
    title: `${tool.name} - Free Online Tool`,
    description: tool.description || `Use ${tool.name} online for free. Fast, secure, and private client-side utility.`,
    alternates: { canonical: `./` },
  };
}

export async function generateStaticParams() {
  const tools = getAllTools().filter(t => t.isCustom || t.path.includes('/custom/'));
  return tools.map(t => ({ slug: t.slug }));
}

export default async function CustomToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline"
          >
            <ArrowLeft size={16} />
            <span>Back to All Tools</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
              {tool.category}
            </span>
            {tool.badge && (
              <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider border border-amber-100 dark:border-amber-800">
                {tool.badge}
              </span>
            )}
          </div>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700 mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg mb-4 text-2xl font-bold">
            {tool.icon?.length <= 4 ? tool.icon : <Sparkles size={32} />}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-3">
            {tool.name}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {tool.description}
          </p>
        </div>

        {/* Interactive Workspace Area */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-12">
          <div className="bg-gray-50 dark:bg-gray-900/50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
              <Zap size={16} className="text-indigo-500" />
              <span>Interactive Workspace</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block"></span>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {tool.embedCode ? (
              <div className="w-full min-h-[500px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white">
                <iframe
                  srcDoc={tool.embedCode}
                  title={tool.name}
                  sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals"
                  className="w-full min-h-[500px] border-0"
                />
              </div>
            ) : (
              <div className="text-center py-12 px-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                <div className="w-16 h-16 mx-auto mb-4 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <Code size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Tool Active &amp; Ready
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm mb-6">
                  This custom tool is registered and running in CodeHubb Tools. You can configure custom interactive code, form widgets, or embed scripts in the Admin Dashboard.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-semibold">
                  <CheckCircle2 size={16} />
                  <span>Verified 100% Client-Side Ready</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tool Guide & SEO Content */}
        {tool.content && (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-10 border border-gray-100 dark:border-gray-700 mb-12 prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How to Use {tool.name}
            </h2>
            <div className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {tool.content}
            </div>
          </div>
        )}

        {/* Feature Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">100% Private</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Processed in your browser without saving data to cloud servers.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
              <Zap size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Instant Execution</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Zero queue times with optimized client-side processing.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <div className="w-10 h-10 mx-auto mb-3 bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Sparkles size={20} />
            </div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Free Forever</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">No watermarks, no registration, no hidden usage limits.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
