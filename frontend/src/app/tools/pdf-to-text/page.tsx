'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
let pdfjsLib: any = null;
export default function PdfToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import('pdfjs-dist').then(mod => {
      pdfjsLib = mod;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setText('');
      setError(null);
    }
  };

  const extractText = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setText('');

    try {
      if (!pdfjsLib) throw new Error('PDF library loading, please try again in a moment');
      
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' ');
        fullText += `--- Page ${i} ---\n${pageText}\n\n`;
      }
      
      setText(fullText.trim());
    } catch (err: any) {
      console.error(err);
      setError('Failed to extract text. The PDF might be an image, corrupted, or password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const copyText = () => {
    if (text) navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[70vh]">
          
          {/* Sidebar / Controls */}
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              PDF to Text
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Extract all readable text from your PDF document instantly in the browser.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-4">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span></p>
                <p className="text-xs text-gray-400">PDF Files</p>
              </div>
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
            </label>

            {file && (
              <div className="mb-6 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {file.name}
              </div>
            )}

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-medium">{error}</div>}

            <button
              onClick={extractText}
              disabled={!file || isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2 mt-auto"
            >
              {isProcessing ? (
                <span>Extracting...</span>
              ) : (
                <span>Extract Text</span>
              )}
            </button>
          </div>

          {/* Main Output Area */}
          <div className="flex-1 p-8 bg-white dark:bg-gray-800 flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200">Extracted Text</h2>
              {text && (
                <button onClick={copyText} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-bold rounded-lg transition-colors">
                  Copy All
                </button>
              )}
            </div>
            
            {text ? (
              <textarea
                readOnly
                value={text}
                className="w-full flex-1 p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none font-mono text-sm leading-relaxed text-gray-800 dark:text-gray-300 resize-none"
              />
            ) : (
              <div className="w-full flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center bg-gray-50 dark:bg-gray-900/20">
                <p className="text-gray-400 dark:text-gray-500 font-medium">Text will appear here...</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
