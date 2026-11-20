import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Cpu, ShieldCheck, Zap, Globe, Heart, Sparkles, Code2, Users } from 'lucide-react';
import { getPageContent } from '@/lib/pages-store';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the mission, engineering philosophy, and privacy-first architecture behind CodeHubb Tools.',
  alternates: { canonical: './' },
};

export default function AboutUsPage() {
  const pageData = getPageContent('about');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-6">
            <Sparkles size={16} />
            <span>Built For Creators &amp; Developers</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight mb-4">
            {pageData.title || 'Free, Fast & Privacy-First Digital Utilities'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {pageData.subtitle || (
              <>
                <strong>CodeHubb Tools</strong> was founded with a singular purpose: to make everyday document, media, developer, and AI utilities instant, unrestricted, and completely private.
              </>
            )}
          </p>
        </div>

        {pageData.content ? (
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700 prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            <ReactMarkdown>{pageData.content}</ReactMarkdown>
          </div>
        ) : (
          <>
            {/* Core Pillars */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <ShieldCheck size={30} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">100% Client-Side Privacy</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              We leverage browser-native WebAssembly and Canvas APIs so your confidential PDFs, passwords, and images never leave your computer.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center mb-5">
              <Zap size={30} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Zero Delays &amp; No Queues</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              No artificial waiting timers, no countdown walls, and no email gating. You get instant results the moment you click.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
              <Cpu size={30} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Specialized AI Agents</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Powered by high-speed neural models with specialized assistants for Urdu translation, Islamic sciences, software architecture, and academic tutoring.
            </p>
          </div>
        </div>

        {/* Engineering Philosophy */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700 space-y-6 text-gray-700 dark:text-gray-300">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Our Architectural Philosophy
          </h2>
          <p className="leading-relaxed">
            Most online converter platforms operate on an antiquated client-server model: when you upload a 20MB PDF to merge or split, that entire file travels across the public internet to an unknown cloud server, sits on their disk, and waits in a processing queue before being downloaded back.
          </p>
          <p className="leading-relaxed">
            We built CodeHubb Tools on a modern philosophy: <strong>your device is powerful enough</strong>. By bundling optimized WebAssembly binaries (such as <code>pdf-lib</code>, <code>pdfjs</code>, and WebGL neural filters), your documents are processed in millisecond RAM streams. You save bandwidth, achieve instantaneous speeds, and eliminate cloud data breach risks entirely.
          </p>

          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-4 items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Explore our 80+ tools or chat with our AI assistants today.
            </span>
            <div className="flex gap-3">
              <Link href="/" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md">
                Browse All Tools
              </Link>
              <Link href="/contact" className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl text-sm transition-all">
                Get In Touch
              </Link>
            </div>
          </div>
        </div>
        </>
        )}

      </div>
    </div>
  );
}
