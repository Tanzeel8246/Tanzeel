'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function JwtDecoderPage() {
  const [token, setToken] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    if (!token.trim()) {
      setHeader('');
      setPayload('');
      return;
    }

    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid JWT format. Must contain 3 parts separated by dots.');
      }

      // Safe Base64Url decode without "URI malformed" error
      const decodeBase64Url = (str: string) => {
        try {
          let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) {
            base64 += '=';
          }
          const binaryStr = atob(base64);
          const bytes = Uint8Array.from(binaryStr, c => c.charCodeAt(0));
          return new TextDecoder().decode(bytes);
        } catch {
          throw new Error('یہ درست JWT نہیں ہے');
        }
      };

      const decodedHeader = JSON.parse(decodeBase64Url(parts[0]));
      const decodedPayload = JSON.parse(decodeBase64Url(parts[1]));

      setHeader(JSON.stringify(decodedHeader, null, 2));
      setPayload(JSON.stringify(decodedPayload, null, 2));

    } catch (err: any) {
      setError('یہ درست JWT نہیں ہے (Invalid JWT: The provided string cannot be decoded).');
      setHeader('');
      setPayload('');
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              JWT Decoder
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Decode JSON Web Tokens (Header & Payload) safely and securely in your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {/* Input */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Encoded JWT Token
              </label>
              <textarea
                className="w-full h-32 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-y transition-all text-sm font-mono"
                placeholder="Paste your JWT here (e.g. eyJhbGciOi...)"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              {error && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-lg border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}
            </div>

            {/* Decoded Outputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Header */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Header (Algorithm &amp; Token Type)
                </h3>
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 min-h-[16rem]">
                  <pre className="font-mono text-sm text-red-600 dark:text-red-400 overflow-x-auto">
                    {header || <span className="text-gray-400 italic font-sans">Header JSON will appear here...</span>}
                  </pre>
                </div>
              </div>

              {/* Payload */}
              <div>
                <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Payload (Data / Claims)
                </h3>
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 min-h-[16rem]">
                  <pre className="font-mono text-sm text-purple-600 dark:text-purple-400 overflow-x-auto">
                    {payload || <span className="text-gray-400 italic font-sans">Payload JSON will appear here...</span>}
                  </pre>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
