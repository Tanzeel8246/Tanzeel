'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function RandomNumberGeneratorPage() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [results, setResults] = useState<number[]>([]);

  const generateNumbers = () => {
    if (min >= max) {
      alert('Minimum value must be less than maximum value.');
      return;
    }
    
    if (!allowDuplicates && count > (max - min + 1)) {
      alert(`Cannot generate ${count} unique numbers between ${min} and ${max}.`);
      return;
    }

    const newResults: number[] = [];
    let attempts = 0;

    while (newResults.length < count && attempts < 10000) {
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      if (allowDuplicates || !newResults.includes(rand)) {
        newResults.push(rand);
      }
      attempts++;
    }

    setResults(newResults);
  };

  const copyResults = () => {
    if (results.length > 0) {
      navigator.clipboard.writeText(results.join(', '));
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
              Random Number Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Generate random numbers quickly for raffles, testing, or decision making.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            {/* Controls */}
            <div className="w-full max-w-2xl bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Min Value</label>
                  <input 
                    type="number" 
                    value={min} 
                    onChange={(e) => setMin(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max Value</label>
                  <input 
                    type="number" 
                    value={max} 
                    onChange={(e) => setMax(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-center"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                  <input 
                    type="number" min="1" max="1000"
                    value={count} 
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-center mb-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={allowDuplicates} 
                    onChange={(e) => setAllowDuplicates(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-800 dark:border-gray-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Allow duplicate numbers</span>
                </label>
              </div>

              <button
                onClick={generateNumbers}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-md transition-transform hover:scale-[1.02]"
              >
                Generate Numbers
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <div className="w-full max-w-2xl relative animate-fade-in">
                <div className="absolute -top-3 right-4 z-10">
                  <button 
                    onClick={copyResults}
                    className="px-4 py-1 bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 text-xs font-bold rounded-full shadow-lg hover:scale-105 transition-transform"
                  >
                    Copy Results
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-700 p-8 rounded-2xl border-4 border-indigo-100 dark:border-indigo-900/50 shadow-inner flex flex-wrap gap-4 justify-center max-h-96 overflow-y-auto">
                  {results.map((num, idx) => (
                    <span 
                      key={idx}
                      className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono shadow-sm"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
