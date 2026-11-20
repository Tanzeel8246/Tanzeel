'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ReverseTextPage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'letters' | 'words' | 'upside-down'>('letters');

  const upsideDownMap: { [key: string]: string } = {
    a: '\u0250', b: 'q', c: '\u0254', d: 'p', e: '\u01DD', f: '\u025F', g: '\u0183', h: '\u0265', i: '\u0131', j: '\u027E',
    k: '\u029E', l: 'l', m: '\u026F', n: 'u', o: 'o', p: 'd', q: 'b', r: '\u0279', s: 's', t: '\u0287', u: 'n', v: '\u028C',
    w: '\u028D', x: 'x', y: '\u028E', z: 'z',
    A: '\u2200', B: '\u10412', C: '\u0186', D: '\u15E1', E: '\u018E', F: '\u2132', G: '\u2141', H: 'H', I: 'I', J: '\u017F',
    K: '\u22CA', L: '\u2142', M: 'W', N: 'N', O: 'O', P: '\u0500', Q: '\u038C', R: '\u1D1A', S: 'S', T: '\u22A5', U: '\u2229',
    V: '\u039B', W: 'M', X: 'X', Y: '\u2144', Z: 'Z',
    '0': '0', '1': '\u0196', '2': '\u1105', '3': '\u0190', '4': '\u3123', '5': '\u03DB', '6': '9', '7': '\u3125', '8': '8', '9': '6',
    ',': '\u2018', '.': '\u02D9', '?': '\u00BF', '!': '\u00A1', '"': '\u201E', "'": ',', '`': ',', '(': ')', ')': '(', '[': ']',
    ']': '[', '{': '}', '}': '{', '<': '>', '>': '<', '&': '\u214B', '_': '\u203E',
  };

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }

    let result = '';

    if (mode === 'letters') {
      result = input.split('').reverse().join('');
    } else if (mode === 'words') {
      result = input.split(' ').reverse().join(' ');
    } else if (mode === 'upside-down') {
      const reversed = input.split('').reverse().join('');
      result = reversed.split('').map(char => upsideDownMap[char] || char).join('');
    }

    setOutput(result);
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
              Reverse Text Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Reverse letters, words, or completely flip your text upside down instantly.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
              <button
                onClick={() => setMode('letters')}
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${mode === 'letters' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Reverse Letters
              </button>
              <button
                onClick={() => setMode('words')}
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${mode === 'words' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Reverse Words
              </button>
              <button
                onClick={() => setMode('upside-down')}
                className={`px-6 py-2.5 rounded-full font-bold transition-all ${mode === 'upside-down' ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
              >
                Upside Down (Flip)
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Input Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Original Text
                </label>
                <textarea
                  className="w-full h-64 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-none text-lg"
                  placeholder="Type here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>

              {/* Output Area */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reversed Result
                  </label>
                  <button onClick={copyOutput} className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">
                    Copy Result
                  </button>
                </div>
                
                <textarea
                  readOnly
                  className="w-full h-64 p-4 rounded-xl shadow-sm border-2 resize-none text-lg overflow-auto break-words bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 outline-none"
                  value={output}
                />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
