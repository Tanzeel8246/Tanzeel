'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';

interface ZipEntry {
  name: string;
  size: number;
  dir: boolean;
  file: JSZip.JSZipObject;
}

export default function ExtractArchivePage() {
  const [file, setFile] = useState<File | null>(null);
  const [zipEntries, setZipEntries] = useState<ZipEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.name.endsWith('.zip') && selectedFile.type !== 'application/zip') {
        setError('Please select a valid ZIP file.');
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      setZipEntries([]);
      setIsProcessing(true);
      
      try {
        const zip = new JSZip();
        const loadedZip = await zip.loadAsync(selectedFile);
        
        const entries: ZipEntry[] = [];
        loadedZip.forEach((relativePath, zipEntry) => {
          if (!zipEntry.dir) {
             // In JSZip, original file size isn't immediately available without decompressing or parsing headers in some cases,
             // but we'll try to extract what we can, or default to 0. We can just list them.
             entries.push({
                name: zipEntry.name,
                size: 0, 
                dir: zipEntry.dir,
                file: zipEntry
             });
          }
        });
        
        setZipEntries(entries);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to read ZIP file.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const clearAll = () => {
    setFile(null);
    setZipEntries([]);
    setError(null);
  };

  const downloadFile = async (entry: ZipEntry) => {
    try {
      const blob = await entry.file.async('blob');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Extract filename from path
      link.download = entry.name.split('/').pop() || 'file';
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 100);
    } catch (err: any) {
      console.error(err);
      setError('Failed to download file: ' + entry.name);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Extract Archive (ZIP Unzipper)
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Extract files from a ZIP archive directly in your browser. Totally secure, no uploads required.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full">
              {/* Controls */}
              <div className="mb-8 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Select ZIP File</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-xl cursor-pointer bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-700 hover:bg-indigo-100 transition-colors">
                   <div className="flex flex-col items-center justify-center pt-5 pb-6">
                     {isProcessing ? (
                       <svg className="animate-spin h-8 w-8 text-indigo-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                     ) : (
                       <svg className="w-8 h-8 mb-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                     )}
                     <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                       {isProcessing ? 'Reading Archive...' : 'Click to Upload ZIP'}
                     </p>
                   </div>
                   <input type="file" accept=".zip,application/zip" className="hidden" onChange={handleFileChange} />
                </label>
              </div>

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              
              {/* File List Area */}
              {file && zipEntries.length > 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
                    <div>
                      <span className="text-sm font-bold text-gray-800 dark:text-white block mb-1">
                        {file.name}
                      </span>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {zipEntries.length} {zipEntries.length === 1 ? 'file found' : 'files found'}
                      </span>
                    </div>
                    <button onClick={clearAll} className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-colors">
                      Close Archive
                    </button>
                  </div>
                  
                  <ul className="max-h-[500px] overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                    {zipEntries.map((entry, idx) => (
                      <li key={`${entry.name}-${idx}`} className="px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors gap-3">
                        <div className="flex items-start space-x-3 overflow-hidden">
                          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200 break-all">{entry.name}</span>
                        </div>
                        <div className="flex items-center sm:ml-4 flex-shrink-0">
                          <button 
                            onClick={() => downloadFile(entry)} 
                            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:hover:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold transition-colors flex items-center space-x-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                            <span>Download</span>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : file && !isProcessing && zipEntries.length === 0 ? (
                 <div className="w-full p-6 text-center text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-xl">
                   No files found inside this archive.
                 </div>
              ) : null}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
