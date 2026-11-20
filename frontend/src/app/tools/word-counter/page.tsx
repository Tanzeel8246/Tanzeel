'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [stats, setStats] = useState({
    words: 0,
    characters: 0,
    charactersNoSpaces: 0,
    paragraphs: 0,
    sentences: 0,
    readingTime: 0, // in minutes
  });

  useEffect(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n+/).filter((p) => p.trim() !== '').length;
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim() !== '').length;
    
    // Average reading speed is roughly 200 words per minute
    const readingTime = Math.ceil(words / 200);

    setStats({
      words,
      characters,
      charactersNoSpaces,
      paragraphs,
      sentences,
      readingTime,
    });
  }, [text]);

  const clearText = () => setText('');

  const copyText = () => {
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Word & Character Counter
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Instantly count words, characters, sentences, and paragraphs in your text.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Words</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.words}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Characters</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.characters}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">No Spaces</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.charactersNoSpaces}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Sentences</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.sentences}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Paragraphs</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.paragraphs}</p>
              </div>
              <div className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Read Time (min)</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{stats.readingTime}</p>
              </div>
            </div>

            {/* Input Area */}
            <div className="relative">
              <textarea
                className="w-full h-64 p-6 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-y transition-all text-lg"
                placeholder="Type or paste your text here to begin counting..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={copyText}
                className="px-6 py-2.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-medium rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-800/50 transition-colors"
              >
                Copy Text
              </button>
              <button
                onClick={clearText}
                className="px-6 py-2.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 font-medium rounded-lg hover:bg-red-200 dark:hover:bg-red-800/50 transition-colors ml-auto"
              >
                Clear
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
