'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CryptoJS from 'crypto-js';

export default function HashGeneratorPage() {
  const [input, setInput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha384: '',
    sha512: '',
  });

  const generateHashes = async (text: string) => {
    if (!text) {
      setHashes({ md5: '', sha1: '', sha256: '', sha384: '', sha512: '' });
      return;
    }

    try {
      const md5Hash = CryptoJS.MD5(text).toString();
      const msgUint8 = new TextEncoder().encode(text);

      const hashBufferSHA1 = await crypto.subtle.digest('SHA-1', msgUint8);
      const hashBufferSHA256 = await crypto.subtle.digest('SHA-256', msgUint8);
      const hashBufferSHA384 = await crypto.subtle.digest('SHA-384', msgUint8);
      const hashBufferSHA512 = await crypto.subtle.digest('SHA-512', msgUint8);

      const toHex = (buffer: ArrayBuffer) => 
        Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');

      setHashes({
        md5: md5Hash,
        sha1: toHex(hashBufferSHA1),
        sha256: toHex(hashBufferSHA256),
        sha384: toHex(hashBufferSHA384),
        sha512: toHex(hashBufferSHA512),
      });
    } catch (e) {
      console.error('Error generating hashes', e);
    }
  };

  useEffect(() => {
    generateHashes(input);
  }, [input]);

  const copyToClipboard = (textToCopy: string) => {
    if (textToCopy) navigator.clipboard.writeText(textToCopy);
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
              Hash Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Instantly generate MD5, SHA-1, SHA-256, SHA-384, and SHA-512 hashes for any text securely in your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {/* Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Input Text
              </label>
              <textarea
                className="w-full h-32 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-y transition-all text-sm font-mono"
                placeholder="Enter string to hash..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </div>

            {/* Outputs */}
            <div className="space-y-6">
              {[
                { name: 'MD5', value: hashes.md5 },
                { name: 'SHA-256 (Recommended)', value: hashes.sha256 },
                { name: 'SHA-512', value: hashes.sha512 },
                { name: 'SHA-384', value: hashes.sha384 },
                { name: 'SHA-1 (Legacy)', value: hashes.sha1 },
              ].map((hashAlgo, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{hashAlgo.name}</span>
                    <button 
                      onClick={() => copyToClipboard(hashAlgo.value)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="break-all font-mono text-sm text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg min-h-[3rem] flex items-center">
                    {hashAlgo.value || <span className="text-gray-400 italic">Hash will appear here...</span>}
                  </div>
                </div>
              ))}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
