'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function ImageToBase64Page() {
  const [file, setFile] = useState<File | null>(null);
  const [base64String, setBase64String] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [includePrefix, setIncludePrefix] = useState(true);

  const rawBase64 = base64String.split(',')[1] || '';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setCopied(false);

      const reader = new FileReader();
      reader.onload = (event) => {
        setBase64String(event.target?.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleCopy = () => {
    const textToCopy = includePrefix ? base64String : rawBase64;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearAll = () => {
    setFile(null);
    setBase64String('');
    setError(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[70vh]">
          
          {/* Sidebar / Controls */}
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col h-[70vh] overflow-y-auto">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Image to Base64
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Convert any image into a Base64 encoded string. Useful for embedding images directly into HTML or CSS.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-6">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Upload Image</span></p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {file && (
              <div className="space-y-4 flex-1">
                <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">File Name</span>
                    <button onClick={clearAll} className="text-xs text-red-500 hover:underline font-bold">Remove</button>
                  </div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                  
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 dark:border-gray-600">
                     <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">File Size</span>
                     <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{formatBytes(file.size)}</span>
                  </div>
                </div>

                <div className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase block mb-2">Options</span>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={includePrefix} 
                      onChange={(e) => setIncludePrefix(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Include Data URI prefix <span className="text-xs text-gray-400 block">(e.g. data:image/png;base64,...)</span></span>
                  </label>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={handleCopy}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {copied ? (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                        <span>Copy Base64</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-medium">{error}</div>}
          </div>

          {/* Main Output Area (Code View) */}
          <div className="flex-1 p-8 bg-white dark:bg-gray-800 flex flex-col items-center justify-center h-[70vh]">
            {base64String ? (
              <div className="w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Base64 Output</span>
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{formatBytes(new Blob([includePrefix ? base64String : rawBase64]).size)} output size</span>
                </div>
                <textarea
                  readOnly
                  value={includePrefix ? base64String : rawBase64}
                  className="w-full flex-1 p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-300 font-mono text-xs resize-none"
                />
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/20 text-center p-6">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">Base64 Output</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-xs">Upload an image on the left to see its Base64 string here.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
