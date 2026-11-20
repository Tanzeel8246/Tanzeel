'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Base64ToImagePage() {
  const [base64String, setBase64String] = useState('');
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    setError(null);
    setImgSrc(null);
    
    if (!base64String.trim()) {
      setError('Please paste a Base64 string first.');
      return;
    }

    let formattedString = base64String.trim();

    // Check if it already has data URI scheme, if not, attempt to guess or default to png
    if (!formattedString.startsWith('data:image')) {
      // Basic check for common image types based on magic numbers/starting chars
      let mimeType = 'image/png';
      if (formattedString.startsWith('/9j/')) mimeType = 'image/jpeg';
      else if (formattedString.startsWith('iVBORw0KGgo')) mimeType = 'image/png';
      else if (formattedString.startsWith('R0lGODdh') || formattedString.startsWith('R0lGODlh')) mimeType = 'image/gif';
      else if (formattedString.startsWith('UklGR')) mimeType = 'image/webp';
      else if (formattedString.startsWith('PHN2Zy')) mimeType = 'image/svg+xml';
      
      formattedString = `data:${mimeType};base64,${formattedString}`;
    }

    // Try to load the image to verify it's valid
    const img = new window.Image();
    img.onload = () => {
      setImgSrc(formattedString);
    };
    img.onerror = () => {
      setError('Invalid Base64 string. Could not render image.');
    };
    img.src = formattedString;
  };

  const handleDownload = () => {
    if (!imgSrc) return;
    
    const a = document.createElement('a');
    a.href = imgSrc;
    
    // Extract mime type to determine extension
    let ext = 'png';
    const match = imgSrc.match(/data:image\/(.*?);/);
    if (match && match[1]) {
      ext = match[1] === 'jpeg' ? 'jpg' : match[1];
      if (ext === 'svg+xml') ext = 'svg';
    }
    
    a.download = `decoded_image.${ext}`;
    a.click();
  };

  const clearAll = () => {
    setBase64String('');
    setImgSrc(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[70vh]">
          
          {/* Sidebar / Controls */}
          <div className="w-full md:w-1/2 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Base64 to Image
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Convert any Base64 encoded string back into a downloadable image file.
            </p>
            
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Base64 String</label>
                <button onClick={clearAll} className="text-xs text-red-500 hover:underline font-bold">Clear</button>
              </div>
              <textarea
                value={base64String}
                onChange={(e) => setBase64String(e.target.value)}
                placeholder="Paste your Base64 string here (e.g. data:image/png;base64,iVBORw0KGgo... or just the raw base64 string)"
                className="w-full flex-1 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-mono text-xs resize-none transition-all shadow-sm"
              />
            </div>

            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-medium text-center">{error}</div>}

            <button
              onClick={handleConvert}
              disabled={!base64String}
              className="w-full py-4 mt-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              <span>Preview & Decode Image</span>
            </button>
          </div>

          {/* Main Output Area (Preview) */}
          <div className="flex-1 p-8 bg-white dark:bg-gray-800 flex flex-col items-center justify-center">
            {imgSrc ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative">
                <div className="w-full flex-1 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-4 mb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={imgSrc} 
                    alt="Decoded output" 
                    className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"
                  />
                </div>
                <button
                  onClick={handleDownload}
                  className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  <span>Download Image</span>
                </button>
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/20 text-center p-6">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">Image Preview</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-xs">Paste your Base64 string on the left and click preview to see the image here.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
