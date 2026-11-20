'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TextToSpeechPage() {
  const [text, setText] = useState('Hello! Welcome to the Text to Speech tool. You can type anything here and I will read it for you.');
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [filterLang, setFilterLang] = useState('all');

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0 && !selectedVoice) {
        // Try to select an English voice by default
        const defaultVoice = availableVoices.find(v => v.lang.includes('en')) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

  const handlePlay = () => {
    if (!text) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
  };

  // Ensure speech stops if component unmounts
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Text to Speech
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Convert your written text into lifelike speech instantly.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {/* Input Area */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text to Read
              </label>
              <textarea
                className="w-full h-48 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-y text-lg leading-relaxed"
                placeholder="Type something here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
              {/* Voice Selection */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Filter Language
                  </label>
                  <select 
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filterLang}
                    onChange={(e) => {
                      setFilterLang(e.target.value);
                      // Try to auto-select a voice in this language
                      if (e.target.value !== 'all') {
                        const firstMatch = voices.find(v => v.lang.startsWith(e.target.value));
                        if (firstMatch) setSelectedVoice(firstMatch.name);
                      }
                    }}
                  >
                    <option value="all">All Languages</option>
                    <option value="ur">Urdu (اردو)</option>
                    <option value="ar">Arabic (العربية)</option>
                    <option value="hi">Hindi (हिन्दी)</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Voice
                  </label>
                  <select 
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
                    value={selectedVoice}
                    onChange={(e) => setSelectedVoice(e.target.value)}
                  >
                    {voices
                      .filter(v => filterLang === 'all' || v.lang.startsWith(filterLang))
                      .map((v, i) => (
                      <option key={i} value={v.name}>{v.name} ({v.lang})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Speed / Rate */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Speed
                  </label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{rate}x</span>
                </div>
                <input 
                  type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600"
                />
              </div>

              {/* Pitch */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pitch
                  </label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{pitch}</span>
                </div>
                <input 
                  type="range" min="0" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600"
                />
              </div>
            </div>

            {/* Play/Stop Buttons */}
            <div className="flex gap-4 justify-center">
              <button 
                onClick={handlePlay}
                disabled={isPlaying || !text}
                className="px-12 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <span>{isPlaying ? 'Playing...' : 'Play Audio'}</span>
                {!isPlaying && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                )}
              </button>

              {isPlaying && (
                <button 
                  onClick={handleStop}
                  className="px-8 py-4 bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-xl font-bold transition-colors"
                >
                  Stop
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
