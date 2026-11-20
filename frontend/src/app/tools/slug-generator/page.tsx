'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SlugGeneratorPage() {
  const [input, setInput] = useState('');
  const [slug, setSlug] = useState('');

  useEffect(() => {
    if (!input) {
      setSlug('');
      return;
    }

    const generateSlug = (text: string) => {
      return text
        .toString()
        .normalize('NFD')                   // split an accented letter in the base letter and the accent
        .replace(/[\u0300-\u036f]/g, '')   // remove all previously split accents
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, '')        // remove all chars not letters, numbers and spaces
        .replace(/\s+/g, '-');             // replace spaces with hyphens
    };

    setSlug(generateSlug(input));
  }, [input]);

  const copySlug = () => {
    if (slug) navigator.clipboard.writeText(slug);
  };

  const clearInput = () => {
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              URL Slug Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Convert any text or blog title into an SEO-friendly, clean URL slug.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 space-y-8">
            
            {/* Input Area */}
            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Enter Title or Text
                </label>
                <button onClick={clearInput} className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline">
                  Clear
                </button>
              </div>
              <input
                type="text"
                className="w-full p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 text-lg transition-all"
                placeholder="e.g. My New Amazing Blog Post in 2026!"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Output Area */}
            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Generated Slug
                </label>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  readOnly
                  value={slug}
                  className="flex-1 p-4 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-inner outline-none text-indigo-600 dark:text-indigo-400 font-mono text-lg truncate"
                  placeholder="my-new-amazing-blog-post-in-2026"
                />
                
                <button
                  onClick={copySlug}
                  disabled={!slug}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-colors whitespace-nowrap"
                >
                  Copy Slug
                </button>
              </div>
            </div>

            {slug && (
              <div className="mt-8 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Preview URL:</p>
                <p className="text-indigo-800 dark:text-indigo-300 break-all font-medium">
                  https://yourwebsite.com/blog/<span className="font-bold underline">{slug}</span>
                </p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
