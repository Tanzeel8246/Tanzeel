'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CssMinifierPage() {
  const [input, setInput] = useState('body {\n  margin: 0;\n  padding: 0;\n}\n\n.container {\n  width: 100%;\n  max-width: 1200px;\n}');
  const [output, setOutput] = useState('');
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    if (!input.trim()) {
      setOutput('');
      setSavings(0);
      return;
    }

    // A simple CSS minifier logic
    let minified = input;
    
    // Remove comments
    minified = minified.replace(/\/\*[\s\S]*?\*\//g, '');
    
    // Remove newlines and tabs
    minified = minified.replace(/[\r\n\t]+/g, ' ');
    
    // Remove multiple spaces
    minified = minified.replace(/ {2,}/g, ' ');
    
    // Remove spaces around special characters
    minified = minified.replace(/ ([{}:;,>]) /g, '$1');
    minified = minified.replace(/([[{}:;,>]) /g, '$1');
    minified = minified.replace(/ ([{}:;,>]])/g, '$1');

    // Remove last semicolon before closing brace
    minified = minified.replace(/;}/g, '}');

    minified = minified.trim();
    
    setOutput(minified);

    const originalSize = new Blob([input]).size;
    const minifiedSize = new Blob([minified]).size;
    if (originalSize > 0) {
      setSavings(Math.round(((originalSize - minifiedSize) / originalSize) * 100));
    }
  }, [input]);

  const copyOutput = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  const clearInput = () => {
    setInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CSS Minifier
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Compress your CSS code to reduce file size and improve website load times.
              </p>
            </div>
            <div className="flex space-x-3 items-center">
              {savings > 0 && (
                <span className="mr-4 px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-bold text-sm rounded-full">
                  Saved {savings}%
                </span>
              )}
              <button onClick={clearInput} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">
                Clear
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            {/* Input */}
            <div className="border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 relative">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Original CSS Input
              </div>
              <textarea
                className="w-full h-full pt-10 p-6 bg-transparent outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed whitespace-pre"
                placeholder="Paste your uncompressed CSS here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck="false"
              />
            </div>

            {/* Output */}
            <div className="relative bg-gray-50 dark:bg-gray-900/50">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                <span>Minified Output</span>
                <button onClick={copyOutput} disabled={!output} className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline disabled:opacity-50">
                  Copy CSS
                </button>
              </div>
              <textarea
                readOnly
                className="w-full h-full pt-10 p-6 bg-transparent outline-none text-indigo-700 dark:text-indigo-300 resize-none font-mono text-sm leading-relaxed break-all"
                value={output}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
