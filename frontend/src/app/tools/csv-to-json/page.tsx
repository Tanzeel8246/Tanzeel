'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CsvToJsonPage() {
  const [csvInput, setCsvInput] = useState('name,age,city\nAli,28,Lahore\nSara,24,Karachi\nJohn,32,New York');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!csvInput.trim()) {
      setJsonOutput('');
      return;
    }

    try {
      const lines = csvInput.trim().split(/\r?\n/);
      if (lines.length < 1) {
        throw new Error('CSV must have at least one line (headers).');
      }

      // Simple CSV parser that handles basic quotes
      const parseLine = (line: string) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
          const char = line[i];
          if (char === '"') {
            if (inQuotes && line[i + 1] === '"') {
              cur += '"';
              i++;
            } else {
              inQuotes = !inQuotes;
            }
          } else if (char === ',' && !inQuotes) {
            result.push(cur.trim());
            cur = '';
          } else {
            cur += char;
          }
        }
        result.push(cur.trim());
        return result;
      };

      const headers = parseLine(lines[0]);
      const jsonArr = [];

      for (let i = 1; i < lines.length; i++) {
        const row = parseLine(lines[i]);
        if (row.length === 1 && row[0] === '') continue; // skip empty lines

        const obj: any = {};
        for (let j = 0; j < headers.length; j++) {
          let val: any = row[j] !== undefined ? row[j] : '';
          // Attempt to convert to numbers if purely numeric
          if (!isNaN(Number(val)) && val !== '') {
            val = Number(val);
          }
          obj[headers[j] || `Column${j+1}`] = val;
        }
        jsonArr.push(obj);
      }

      setJsonOutput(JSON.stringify(jsonArr, null, 2));
    } catch (err: any) {
      setError(err.message || 'Invalid CSV format');
    }
  }, [csvInput]);

  const copyOutput = () => {
    if (jsonOutput) navigator.clipboard.writeText(jsonOutput);
  };

  const clearInput = () => {
    setCsvInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                CSV to JSON Converter
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Instantly convert comma-separated values (CSV) to beautifully formatted JSON arrays.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={clearInput} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 transition-colors">
                Clear
              </button>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            {/* Input */}
            <div className="border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 relative flex flex-col">
              <div className="p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                <span>CSV Input (Row 1 as Headers)</span>
              </div>
              <textarea
                className="w-full h-full p-4 bg-transparent outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed"
                placeholder="id,name,email&#10;1,John,john@example.com"
                value={csvInput}
                onChange={(e) => setCsvInput(e.target.value)}
                spellCheck="false"
              />
            </div>

            {/* Output */}
            <div className="relative bg-gray-50 dark:bg-gray-900/50 flex flex-col">
              <div className="p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                <span>JSON Output</span>
                {error ? (
                  <span className="text-red-500">Error</span>
                ) : (
                  <button onClick={copyOutput} className="text-indigo-600 dark:text-indigo-400 hover:underline">
                    Copy JSON
                  </button>
                )}
              </div>
              <div className="w-full h-full p-4 overflow-auto font-mono text-sm leading-relaxed">
                {error ? (
                  <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 break-words">
                    {error}
                  </div>
                ) : (
                  <pre className="text-green-700 dark:text-green-400 m-0">
                    {jsonOutput}
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
