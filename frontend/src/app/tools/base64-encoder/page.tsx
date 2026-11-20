'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Base64EncoderPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch (err) {
      setError(mode === 'decode' ? 'Invalid Base64 string' : 'Encoding error');
      setOutput('');
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
              Base64 Encoder & Decoder
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Easily convert text to Base64 format or decode it back to normal text.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            
            <div className="flex justify-center space-x-4 mb-8
            ">
              <button
                onClick={() => setMode('encode')}
                className={`px-8 py-3 rounded-full font-bold transition-all ${mode === 'encode' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Encode
              </button>
              <button
                onClick={() => setMode('decode')}
                className={`px-8 py-3 rounded-full font-bold transition-all ${mode === 'decode' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Decode
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {mode === 'encode' ? 'Normal Text' : 'Base64 String'}
                </label>
                <textarea
                  className="w-full h-64 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm"
                  placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              {/* Output Area */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {mode === 'encode' ? 'Base64 Output' : 'Decoded Text'}
                  </label>
                  <button onClick={copyOutput} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Copy Result
                  </button>
                </div>
                
                <div className={`w-full h-64 p-4 rounded-xl shadow-sm border-2 resize-none font-mono text-sm overflow-auto ${error ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600' : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100'}`}>
                  {error ? error : output}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
