'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';

export default function MarkdownPreviewerPage() {
  const [markdown, setMarkdown] = useState(`# Hello World!

This is a **Markdown** previewer.

## What you can do here:
1. Write Markdown on the left
2. See the HTML output on the right
3. It updates *instantly*

### Code snippet example:
\`\`\`javascript
function sayHello() {
  console.log("Hello, Tools Platform!");
}
\`\`\`

> Blockquotes also look amazing!

[Visit CodeHubb](https://example.com)
`);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col h-[80vh]">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Live Markdown Previewer
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Type Markdown on the left and see the HTML rendering on the right in real-time.
            </p>
          </div>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
            {/* Editor */}
            <div className="border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 relative">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Markdown Editor
              </div>
              <textarea
                className="w-full h-full pt-10 p-6 bg-transparent outline-none text-gray-800 dark:text-gray-100 resize-none font-mono text-sm leading-relaxed"
                value={markdown}
                onChange={(e) => setMarkdown(e.target.value)}
                spellCheck="false"
              />
            </div>

            {/* Preview Area */}
            <div className="relative bg-white dark:bg-gray-900/50">
              <div className="absolute top-0 left-0 w-full p-2 bg-gray-100 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Live Preview
              </div>
              <div className="w-full h-full pt-10 p-6 overflow-auto">
                <article className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown>{markdown}</ReactMarkdown>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
