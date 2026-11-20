'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const STANDARD_PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.",
  "Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.",
  "Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?"
];

export default function LoremIpsumGeneratorPage() {
  const [type, setType] = useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [output, setOutput] = useState<string>('');

  const generateLorem = () => {
    const num = Math.max(1, Math.min(count, 50));
    let result = '';

    if (type === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < num; i++) {
        paras.push(STANDARD_PARAGRAPHS[i % STANDARD_PARAGRAPHS.length]);
      }
      result = paras.join('\n\n');
    } else if (type === 'sentences') {
      const allSentences = STANDARD_PARAGRAPHS.flatMap(p => p.split(/(?<=[.!?])\s+/));
      const chosen: string[] = [];
      for (let i = 0; i < num; i++) {
        chosen.push(allSentences[i % allSentences.length]);
      }
      result = chosen.join(' ');
    } else if (type === 'words') {
      const allWords = STANDARD_PARAGRAPHS.join(' ').replace(/[.,]/g, '').split(/\s+/);
      const chosenWords: string[] = [];
      for (let i = 0; i < num; i++) {
        chosenWords.push(allWords[i % allWords.length]);
      }
      if (chosenWords.length > 0) {
        chosenWords[0] = chosenWords[0].charAt(0).toUpperCase() + chosenWords[0].slice(1);
      }
      result = chosenWords.join(' ') + '.';
    }

    setOutput(result);
  };

  useEffect(() => {
    generateLorem();
  }, [type, count]);

  const copyToClipboard = () => {
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
              Lorem Ipsum Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Generate authentic standard Latin placeholder text for designs, mockups, and typography.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-6 mb-8 justify-center">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Generate:</label>
                <input 
                  type="number" 
                  min="1" 
                  max="50" 
                  value={count} 
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  className="w-20 p-2 text-center bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-bold text-gray-800 dark:text-white"
                />
              </div>

              <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
                {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                      type === t 
                        ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                onClick={generateLorem}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow transition-all"
              >
                Regenerate
              </button>
            </div>

            {/* Output */}
            <div className="relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Generated Text</span>
                <button 
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors"
                >
                  Copy to Clipboard
                </button>
              </div>
              <textarea
                readOnly
                className="w-full h-80 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm outline-none text-gray-800 dark:text-gray-100 resize-y text-sm font-serif leading-relaxed"
                value={output}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
