'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HtmlMinifierPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMinify = () => {
    if (!input.trim()) {
      setError('Please enter some HTML code.');
      return;
    }
    setError(null);
    try {
      const minified = input
        .replace(/<!--[\s\S]*?-->/g, '') // Remove HTML comments
        .replace(/\s+/g, ' ') // Collapse multiple whitespace into a single space
        .replace(/>\s+</g, '><') // Remove spaces between tags
        .replace(/ \/>/g, '/>') // Remove space before closing self-closing tags
        .trim();
        
      setOutput(minified);
    } catch (err) {
      setError('An error occurred while minifying the HTML.');
    }
  };

  const copyToClipboard = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const calculateSavings = () => {
    if (!input || !output) return 0;
    const saved = input.length - output.length;
    return ((saved / input.length) * 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              HTML Minifier
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Compress your HTML code by removing unnecessary whitespace and comments to improve website loading speed.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Input */}
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Raw HTML Code</label>
                  <button onClick={handleClear} className="text-xs font-bold text-red-500 hover:text-red-600">Clear</button>
                </div>
                <textarea
                  className="flex-1 min-h-[400px] w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-mono text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 resize-none shadow-inner"
                  placeholder="Paste your HTML code here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              {/* Output */}
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Minified HTML</label>
                  {output && (
                    <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                      Saved {calculateSavings()}% space
                    </span>
                  )}
                </div>
                <div className="relative flex-1 min-h-[400px]">
                  <textarea
                    className="w-full h-full p-4 bg-gray-100 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-mono text-sm text-gray-800 dark:text-gray-200 resize-none shadow-inner"
                    placeholder="Minified HTML will appear here..."
                    value={output}
                    readOnly
                  />
                  {output && (
                    <button
                      onClick={copyToClipboard}
                      className="absolute top-4 right-4 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all flex items-center space-x-1"
                    >
                      {isCopied ? (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          <span className="text-xs font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                          <span className="text-xs font-bold">Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {error && <div className="mt-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}

            <div className="mt-8 flex justify-center">
              <button
                onClick={handleMinify}
                disabled={!input}
                className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-105 disabled:hover:scale-100 flex items-center space-x-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5"></path></svg>
                <span>Minify HTML</span>
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
