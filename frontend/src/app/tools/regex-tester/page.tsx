'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function RegexTesterPage() {
  const [regexStr, setRegexStr] = useState('[A-Z]\\w+');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('Hello World, this is a Regex Tester.');
  const [matchResult, setMatchResult] = useState<React.ReactNode[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [matchCount, setMatchCount] = useState(0);

  useEffect(() => {
    setError(null);
    if (!regexStr || !testString) {
      setMatchResult([testString]);
      setMatchCount(0);
      return;
    }

    try {
      const regex = new RegExp(regexStr, flags);
      
      if (!regex.global) {
        // If not global, just find first match or nothing
        const match = regex.exec(testString);
        if (match) {
          setMatchCount(1);
          const start = match.index;
          const end = start + match[0].length;
          
          const before = testString.substring(0, start);
          const matched = testString.substring(start, end);
          const after = testString.substring(end);
          
          setMatchResult([
            before,
            <mark key="m1" className="bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-white rounded px-0.5">{matched}</mark>,
            after
          ]);
        } else {
          setMatchCount(0);
          setMatchResult([testString]);
        }
      } else {
        // Global search
        const parts: React.ReactNode[] = [];
        let lastIndex = 0;
        let match;
        let count = 0;
        
        while ((match = regex.exec(testString)) !== null) {
          count++;
          if (match.index === regex.lastIndex) {
            regex.lastIndex++; // prevent infinite loops with zero-length matches
          }
          
          parts.push(testString.substring(lastIndex, match.index));
          parts.push(
            <mark key={count} className="bg-yellow-300 dark:bg-yellow-600 text-gray-900 dark:text-white rounded px-0.5">
              {match[0]}
            </mark>
          );
          lastIndex = match.index + match[0].length;
        }
        
        parts.push(testString.substring(lastIndex));
        setMatchResult(parts);
        setMatchCount(count);
      }
    } catch (err: any) {
      setError(err.message || 'Invalid Regular Expression');
      setMatchResult([testString]);
      setMatchCount(0);
    }
  }, [regexStr, flags, testString]);

  const toggleFlag = (f: string) => {
    if (flags.includes(f)) {
      setFlags(flags.replace(f, ''));
    } else {
      setFlags(flags + f);
    }
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
              Regex Tester
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Test and debug your Regular Expressions live in the browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 space-y-8">
            
            {/* Regex Input */}
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm relative">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                Regular Expression
              </label>
              
              <div className="flex flex-col sm:flex-row rounded-lg overflow-hidden border border-gray-300 dark:border-gray-500 bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="p-4 bg-gray-100 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-mono font-bold text-xl select-none border-b sm:border-b-0 sm:border-r border-gray-300 dark:border-gray-500">
                  /
                </span>
                
                <input
                  type="text"
                  value={regexStr}
                  onChange={(e) => setRegexStr(e.target.value)}
                  className="flex-1 p-4 bg-transparent outline-none font-mono text-lg text-indigo-700 dark:text-indigo-300"
                  placeholder="pattern"
                />
                
                <span className="p-4 bg-gray-100 dark:bg-gray-900/50 text-gray-500 dark:text-gray-400 font-mono font-bold text-xl select-none border-t sm:border-t-0 sm:border-l border-gray-300 dark:border-gray-500">
                  /
                </span>
                
                <input
                  type="text"
                  value={flags}
                  onChange={(e) => setFlags(e.target.value)}
                  className="w-20 p-4 bg-gray-50 dark:bg-gray-800 outline-none font-mono text-lg text-green-600 dark:text-green-400"
                  placeholder="flags"
                />
              </div>
              
              {error && <p className="text-red-500 text-sm font-medium mt-2">{error}</p>}

              <div className="flex flex-wrap gap-4 mt-4">
                {[
                  { label: 'Global (g)', val: 'g' },
                  { label: 'Case Insensitive (i)', val: 'i' },
                  { label: 'Multiline (m)', val: 'm' }
                ].map(flag => (
                  <label key={flag.val} className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={flags.includes(flag.val)}
                      onChange={() => toggleFlag(flag.val)}
                      className="text-indigo-600 focus:ring-indigo-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{flag.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Test String */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Test String
                  </label>
                </div>
                <textarea
                  className="w-full h-80 p-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed"
                  value={testString}
                  onChange={(e) => setTestString(e.target.value)}
                  placeholder="Insert text to test your regex against..."
                  spellCheck="false"
                />
              </div>

              {/* Match Result */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Match Results
                  </label>
                  <span className="text-sm font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 px-3 py-1 rounded-full">
                    {matchCount} match{matchCount !== 1 ? 'es' : ''}
                  </span>
                </div>
                <div className="w-full h-80 p-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl shadow-inner font-mono text-sm leading-relaxed overflow-auto whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {matchResult}
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
