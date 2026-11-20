'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';

export default function ExtractPdfPagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesToExtract, setPagesToExtract] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      setSuccess(false);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        setTotalPages(pdfDoc.getPageCount());
      } catch (err) {
        setError('Invalid PDF file. Cannot read page count.');
        setTotalPages(0);
      }
    }
  };

  const parsePageNumbers = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      if (trimmed.includes('-')) {
        const [startStr, endStr] = trimmed.split('-');
        const start = parseInt(startStr);
        const end = parseInt(endStr);
        
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= maxPages) pages.add(i);
          }
        } else {
          throw new Error(`Invalid range: ${trimmed}`);
        }
      } else {
        const num = parseInt(trimmed);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num);
        } else {
          throw new Error(`Invalid page number: ${trimmed}`);
        }
      }
    }
    
    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    if (!pagesToExtract.trim()) {
      setError('Please specify which pages to extract (e.g. 1, 3, 5-8).');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdfDoc = await PDFDocument.load(arrayBuffer);
      const total = sourcePdfDoc.getPageCount();

      const pageNumsToExtract = parsePageNumbers(pagesToExtract, total);
      
      if (pageNumsToExtract.length === 0) {
        throw new Error('No valid pages selected to extract.');
      }

      // pdf-lib expects 0-indexed page numbers for extraction
      const zeroIndexedPages = pageNumsToExtract.map(p => p - 1);

      // Create a new PDF document
      const newPdfDoc = await PDFDocument.create();
      
      // Copy pages from source
      const copiedPages = await newPdfDoc.copyPages(sourcePdfDoc, zeroIndexedPages);
      
      // Add pages to new document
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      // Save and download
      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `extracted_${file.name}`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to extract pages.');
    } finally {
      setIsProcessing(false);
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
              Extract PDF Pages
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Select specific pages from your PDF file and create a new PDF instantly and securely in your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-xl">
              {/* File Input */}
              <div className="mb-8">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-indigo-50 dark:bg-indigo-900/10 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF Files Only</p>
                  </div>
                  <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                </label>
                {file && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                      <button onClick={() => {setFile(null); setTotalPages(0); setSuccess(false);}} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider">Remove File</button>
                    </div>
                    {totalPages > 0 && (
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Total Pages: {totalPages}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Pages to Extract */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wider">
                  Pages to Extract
                </label>
                <input 
                  type="text" 
                  value={pagesToExtract} 
                  onChange={(e) => setPagesToExtract(e.target.value)}
                  placeholder="e.g. 1, 3, 5-8"
                  className="w-full p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 shadow-sm text-lg transition-all"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Enter comma-separated page numbers or ranges you want to keep.
                </p>
              </div>

              {/* Error / Success Messages */}
              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              {success && <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium text-center">Pages extracted successfully! Check your downloads.</div>}

              {/* Action Button */}
              <button
                onClick={handleExtract}
                disabled={!file || !pagesToExtract || isProcessing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Extract Pages & Download</span>
                )}
              </button>
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
