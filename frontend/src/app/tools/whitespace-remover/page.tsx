'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WhitespaceRemoverPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [removeNewLines, setRemoveNewLines] = useState(false);
  const [removeExtraSpaces, setRemoveExtraSpaces] = useState(true);

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    let processedText = input;

    // Replace multiple spaces/tabs with a single space
    if (removeExtraSpaces) {
      processedText = processedText.replace(/[ \t]+/g, ' ').trim();
      // Also remove spaces at the beginning and end of each line
      processedText = processedText.replace(/^[ \t]+|[ \t]+$/gm, '');
    }

    // Remove all new lines
    if (removeNewLines) {
      processedText = processedText.replace(/\r?\n|\r/g, removeExtraSpaces ? ' ' : '');
    } else if (removeExtraSpaces) {
      // If we are keeping new lines but removing extra spaces, let's remove empty lines
      processedText = processedText.replace(/(\r?\n){2,}/g, '\n');
    }

    setOutput(processedText.trim());
  }, [input, removeNewLines, removeExtraSpaces]);

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
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[85vh]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Whitespace Remover
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Clean up your text by removing extra spaces, tabs, and empty lines instantly.
            </p>
          </div>

          <div className="p-4 bg-white dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600 flex flex-wrap gap-6 items-center">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={removeExtraSpaces} 
                onChange={(e) => setRemoveExtraSpaces(e.target.checked)}
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Remove Multiple Spaces & Empty Lines</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={removeNewLines} 
                onChange={(e) => setRemoveNewLines(e.target.checked)}
                className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Remove All Line Breaks (Convert to single line)</span>
            </label>
            
            <button onClick={clearInput} className="ml-auto px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-400 rounded-lg text-sm font-medium transition-colors">
              Clear All
            </button>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            {/* Input */}
            <div className="border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 relative">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Original Text
              </div>
              <textarea
                className="w-full h-full pt-10 p-6 bg-transparent outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed"
                placeholder="Paste messy text here with       extra      spaces 
                
and
blank lines..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck="false"
              />
            </div>

            {/* Output */}
            <div className="relative bg-gray-50 dark:bg-gray-900/50">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                <span>Cleaned Output</span>
                <button onClick={copyOutput} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  Copy
                </button>
              </div>
              <textarea
                className="w-full h-full pt-10 p-6 bg-transparent outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed"
                value={output}
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
