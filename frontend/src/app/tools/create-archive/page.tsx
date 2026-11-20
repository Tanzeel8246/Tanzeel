'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';

export default function CreateArchivePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [zipName, setZipName] = useState('archive');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Append new files to the existing list
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
      setError(null);
      setSuccess(false);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
    setError(null);
    setSuccess(false);
  };

  const createZip = async () => {
    if (files.length === 0) {
      setError('Please add at least one file to zip.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const zip = new JSZip();

      // Add each file to the zip
      files.forEach((file) => {
        zip.file(file.name, file);
      });

      // Generate zip blob
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Trigger Download
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${zipName || 'archive'}.zip`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to create archive.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = files.reduce((acc, file) => acc + file.size, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Create Archive (ZIP Maker)
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Combine multiple files into a single ZIP archive directly in your browser. Totally secure, no uploads required.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full">
              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-6 mb-8 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600 items-end">
                <div className="flex-1 w-full">
                  <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Add Files</label>
                  <label className="flex items-center justify-center w-full h-12 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-700 hover:bg-indigo-100 transition-colors">
                    <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                      Select Files to Zip
                    </span>
                    <input type="file" multiple className="hidden" onChange={handleFileChange} />
                  </label>
                </div>
                
                <div className="flex-1 w-full">
                  <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ZIP File Name</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={zipName} 
                      onChange={(e) => setZipName(e.target.value)}
                      placeholder="archive"
                      className="w-full p-3 pr-12 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none font-bold text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500" 
                    />
                    <span className="absolute right-4 top-3.5 text-gray-400 font-bold">.zip</span>
                  </div>
                </div>
              </div>

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              {success && <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium text-center">ZIP file created successfully! Check your downloads.</div>}
              
              {/* File List Area */}
              {files.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm mb-8">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                      {files.length} {files.length === 1 ? 'file' : 'files'} selected ({formatBytes(totalSize)})
                    </span>
                    <button onClick={clearAll} className="text-xs text-red-500 hover:underline font-bold">Clear All</button>
                  </div>
                  
                  <ul className="max-h-80 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                    {files.map((file, idx) => (
                      <li key={`${file.name}-${idx}`} className="px-6 py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                        <div className="flex items-center space-x-3 overflow-hidden">
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                        </div>
                        <div className="flex items-center space-x-4 ml-4">
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{formatBytes(file.size)}</span>
                          <button onClick={() => removeFile(idx)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="w-full h-48 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-gray-800 mb-8">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path></svg>
                  <p className="text-gray-400 dark:text-gray-500 font-medium">Add files to start creating your ZIP archive.</p>
                </div>
              )}
              
              <button
                onClick={createZip}
                disabled={files.length === 0 || isProcessing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Compressing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download ZIP Archive</span>
                  </>
                )}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
