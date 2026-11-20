'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HtmlEncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    if (mode === 'encode') {
      const encoded = input
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
      setOutput(encoded);
    } else {
      const decoded = input
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/&#x2F;/g, '/');
      setOutput(decoded);
    }
  }, [input, mode]);

  const copyOutput = () => {
    if (output) navigator.clipboard.writeText(output);
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
              HTML Encoder & Decoder
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Convert HTML tags to safe entities to prevent XSS, or decode entities back into HTML tags.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setMode('encode')}
                className={`px-8 py-3 rounded-full font-bold transition-all ${mode === 'encode' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Encode HTML
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-8 py-3 rounded-full font-bold transition-all ${mode === 'decode' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Decode HTML
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {mode === 'encode' ? 'HTML Code to Encode' : 'Encoded Entities to Decode'}
                </label>
                <textarea
                  className="w-full h-64 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm"
                  placeholder={mode === 'encode' ? '<script>alert("XSS")</script>' : '&lt;script&gt;alert(&quot;XSS&quot;)&lt;&#x2F;script&gt;'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              {/* Output Area */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Result
                  </label>
                  <button onClick={copyOutput} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Copy Result
                  </button>
                </div>
                
                <textarea
                  readOnly
                  value={output}
                  className="w-full h-64 p-4 rounded-xl shadow-sm border-2 resize-none font-mono text-sm bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 outline-none"
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
