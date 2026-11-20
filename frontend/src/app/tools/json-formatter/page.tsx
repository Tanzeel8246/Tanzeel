'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setError(err.message || 'Invalid JSON format');
      setOutput('');
    }
  }, [input]);

  const copyOutput = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  const clearInput = () => {
    setInput('');
    setOutput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/80">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                JSON Formatter & Validator
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Beautify and validate your JSON data instantly.
              </p>
            </div>
            <div className="flex space-x-3">
              <button onClick={clearInput} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">
                Clear
              </button>
              <button onClick={copyOutput} disabled={!output} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium text-white shadow-sm transition-colors">
                Copy Formatted
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            {/* Input */}
            <div className="border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 relative">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Raw JSON Input
              </div>
              <textarea
                className="w-full h-full pt-10 p-4 bg-transparent outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed"
                placeholder='{"example": "Paste your messy JSON here"}'
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck="false"
              />
            </div>

            {/* Output */}
            <div className="relative bg-gray-50 dark:bg-gray-900/50">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                <span>Formatted Output</span>
                {error && <span className="text-red-500">Invalid JSON</span>}
              </div>
              <div className="w-full h-full pt-10 p-4 overflow-auto font-mono text-sm leading-relaxed">
                {error ? (
                  <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 break-words">
                    {error}
                  </div>
                ) : (
                  <pre className="text-green-700 dark:text-green-400 m-0">
                    {output}
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
