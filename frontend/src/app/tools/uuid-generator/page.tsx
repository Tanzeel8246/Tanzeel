'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generateUUID = () => {
    // Generate UUID v4
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const generateMultiple = () => {
    const num = Math.min(Math.max(1, count), 100);
    const newUuids = Array.from({ length: num }, () => generateUUID());
    setUuids(newUuids);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAll = () => {
    if (uuids.length > 0) {
      navigator.clipboard.writeText(uuids.join('\n'));
    }
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
              UUID v4 Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Instantly generate single or multiple cryptographically secure UUIDs (Universally Unique Identifiers).
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <div className="flex items-center space-x-4 bg-white dark:bg-gray-700 p-2 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 pl-4">Quantity:</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="w-20 p-2 bg-gray-100 dark:bg-gray-800 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-100 text-center font-bold"
                />
              </div>
              
              <button 
                onClick={generateMultiple}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
              >
                Generate UUIDs
              </button>
            </div>

            {/* Results */}
            {uuids.length > 0 && (
              <div className="bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-800">
                  <span className="font-bold text-gray-700 dark:text-gray-300">Generated UUIDs ({uuids.length})</span>
                  <button 
                    onClick={copyAll}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    Copy All
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <ul className="divide-y divide-gray-100 dark:divide-gray-600">
                    {uuids.map((uuid, idx) => (
                      <li key={idx} className="flex justify-between items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors group">
                        <span className="font-mono text-gray-800 dark:text-gray-200">{uuid}</span>
                        <button 
                          onClick={() => copyToClipboard(uuid)}
                          className="opacity-0 group-hover:opacity-100 text-xs px-3 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded transition-opacity"
                        >
                          Copy
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
