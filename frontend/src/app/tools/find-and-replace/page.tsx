'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function FindAndReplacePage() {
  const [text, setText] = useState('');
  const [findStr, setFindStr] = useState('');
  const [replaceStr, setReplaceStr] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [useRegex, setUseRegex] = useState(false);

  const handleReplace = () => {
    if (!text || !findStr) return;

    try {
      let flags = 'g';
      if (!caseSensitive) flags += 'i';
      
      const searchPattern = useRegex ? new RegExp(findStr, flags) : new RegExp(findStr.replace(/[.*+?^$\\{}()|[\\]\\\\]/g, '\\\\$&'), flags);
      const result = text.replace(searchPattern, replaceStr);
      setText(result);
    } catch (e) {
      alert('Invalid Regex pattern!');
    }
  };

  const copyToClipboard = () => {
    if (text) navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setText('');
    setFindStr('');
    setReplaceStr('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Find & Replace
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Search for specific words or patterns in your text and replace them instantly.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-8">
            
            {/* Editor Area */}
            <div className="flex-1 relative order-2 md:order-1">
              <div className="flex justify-between items-end mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Your Text
                </label>
                <div className="space-x-3">
                  <button onClick={clearAll} className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline">
                    Clear
                  </button>
                  <button onClick={copyToClipboard} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Copy Text
                  </button>
                </div>
              </div>
              <textarea
                className="w-full h-96 p-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-none text-lg leading-relaxed"
                placeholder="Paste your original text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {/* Controls */}
            <div className="w-full md:w-72 flex-shrink-0 space-y-6 order-1 md:order-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Find
                </label>
                <input
                  type="text"
                  value={findStr}
                  onChange={(e) => setFindStr(e.target.value)}
                  placeholder="Word to find..."
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-100 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Replace With
                </label>
                <input
                  type="text"
                  value={replaceStr}
                  onChange={(e) => setReplaceStr(e.target.value)}
                  placeholder="Replacement word..."
                  className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-100 shadow-sm"
                />
              </div>

              <div className="space-y-3 bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={caseSensitive} 
                    onChange={(e) => setCaseSensitive(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Match Case (Case Sensitive)</span>
                </label>

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={useRegex} 
                    onChange={(e) => setUseRegex(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 bg-white border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Use Regular Expression</span>
                </label>
              </div>

              <button
                onClick={handleReplace}
                disabled={!text || !findStr}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-md transition-colors"
              >
                Replace All
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
