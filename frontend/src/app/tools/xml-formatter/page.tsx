'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function XmlFormatterPage() {
  const [input, setInput] = useState('<?xml version="1.0"?><catalog><book id="bk101"><author>Gambardella, Matthew</author><title>XML Developer\'s Guide</title><price>44.95</price></book></catalog>');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!input.trim()) {
      setOutput('');
      return;
    }

    try {
      const formatXml = (xml: string) => {
        let formatted = '';
        let pad = 0;
        // removing extra spaces between tags
        const xmlString = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
        const lines = xmlString.split('\r\n');
        
        lines.forEach((node) => {
          let indent = 0;
          if (node.match(/.+<\/\w[^>]*>$/)) {
            indent = 0;
          } else if (node.match(/^<\/\w/)) {
            if (pad !== 0) {
              pad -= 1;
            }
          } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
            indent = 1;
          } else {
            indent = 0;
          }
          
          let padding = '';
          for (let i = 0; i < pad; i++) {
            padding += '  '; // 2 spaces
          }
          
          formatted += padding + node + '\n';
          pad += indent;
        });

        return formatted.trim();
      };

      // Check for basic XML validity
      if (input.indexOf('<') === -1 || input.indexOf('>') === -1) {
        throw new Error('Doesn\'t look like valid XML. Missing tags.');
      }

      setOutput(formatXml(input));
    } catch (err: any) {
      setError(err.message || 'Invalid XML format');
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
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                XML Formatter
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Beautify and format your messy XML code into readable structure.
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
                Raw XML Input
              </div>
              <textarea
                className="w-full h-full pt-10 p-4 bg-transparent outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed whitespace-pre"
                placeholder="<example>Paste your messy XML here</example>"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                spellCheck="false"
              />
            </div>

            {/* Output */}
            <div className="relative bg-gray-50 dark:bg-gray-900/50">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between">
                <span>Formatted Output</span>
                {error && <span className="text-red-500">Error</span>}
              </div>
              <div className="w-full h-full pt-10 p-4 overflow-auto font-mono text-sm leading-relaxed">
                {error ? (
                  <div className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800 break-words">
                    {error}
                  </div>
                ) : (
                  <pre className="text-blue-700 dark:text-blue-400 m-0">
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
