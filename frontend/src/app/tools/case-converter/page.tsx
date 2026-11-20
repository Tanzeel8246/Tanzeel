'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CaseConverterPage() {
  const [text, setText] = useState('');

  const handleConvert = (type: string) => {
    if (!text) return;

    let result = '';
    switch (type) {
      case 'uppercase':
        result = text.toUpperCase();
        break;
      case 'lowercase':
        result = text.toLowerCase();
        break;
      case 'title':
        result = text.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        break;
      case 'sentence':
        result = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
        break;
      case 'camel':
        result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
        break;
      case 'snake':
        result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
          ?.map(x => x.toLowerCase())
          .join('_') || text;
        break;
      default:
        result = text;
    }
    setText(result);
  };

  const copyToClipboard = () => {
    if (text) navigator.clipboard.writeText(text);
  };

  const clearText = () => setText('');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Case Converter
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Instantly convert your text into UPPERCASE, lowercase, Title Case, camelCase, and more.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
              {[
                { label: 'UPPERCASE', type: 'uppercase' },
                { label: 'lowercase', type: 'lowercase' },
                { label: 'Title Case', type: 'title' },
                { label: 'Sentence case.', type: 'sentence' },
                { label: 'camelCase', type: 'camel' },
                { label: 'snake_case', type: 'snake' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => handleConvert(btn.type)}
                  className="px-5 py-2.5 bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 rounded-xl font-medium transition-colors text-sm shadow-sm"
                >
                  {btn.label}
                </button>
              ))}
            </div>

            {/* Editor Area */}
            <div className="relative">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Text
                </label>
                <div className="space-x-3">
                  <button onClick={clearText} className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline">
                    Clear
                  </button>
                  <button onClick={copyToClipboard} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Copy Text
                  </button>
                </div>
              </div>
              <textarea
                className="w-full h-80 p-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-y text-lg leading-relaxed"
                placeholder="Type or paste your text here to convert its case..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
