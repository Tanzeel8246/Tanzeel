'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PDFDocument, rgb } from 'pdf-lib';

export default function PdfEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [textToAdd, setTextToAdd] = useState('Signature');
  const [pageNum, setPageNum] = useState(1);
  const [xPos, setXPos] = useState(100);
  const [yPos, setYPos] = useState(100);
  const [textSize, setTextSize] = useState(24);
  const [color, setColor] = useState('#000000');
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

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

  const hexToRgbRatio = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };

  const handleEdit = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    if (pageNum < 1 || pageNum > totalPages) {
      setError(`Page number must be between 1 and ${totalPages}.`);
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      const pages = pdfDoc.getPages();
      const targetPage = pages[pageNum - 1]; // 0-indexed
      
      const rgbColor = hexToRgbRatio(color);
      
      targetPage.drawText(textToAdd, {
        x: xPos,
        y: yPos,
        size: textSize,
        color: rgb(rgbColor.r, rgbColor.g, rgbColor.b),
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `edited_${file.name}`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Failed to edit PDF. Make sure it is not password protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Simple PDF Editor
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Add text, signatures, or dates to any specific position on your PDF document securely in your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-12">
            
            {/* Upload Area */}
            <div className="flex-1">
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-indigo-50 dark:bg-indigo-900/10 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-12 h-12 mb-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to select PDF</span></p>
                </div>
                <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
              </label>

              {file && (
                <div className="mt-6 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm text-center">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate mb-1">{file.name}</p>
                  <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">{totalPages} Pages detected</p>
                </div>
              )}

              {/* Error / Success Messages */}
              <div className="mt-6">
                {error && <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-sm text-center">{error}</div>}
                {success && <div className="p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium text-sm text-center">PDF edited & downloaded successfully!</div>}
              </div>
            </div>

            {/* Controls Area */}
            <div className="flex-[1.5] space-y-6 bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Text to Add</label>
                <input 
                  type="text" 
                  value={textToAdd} 
                  onChange={(e) => setTextToAdd(e.target.value)}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Page Number</label>
                  <input 
                    type="number" min="1" max={totalPages || 1}
                    value={pageNum} 
                    onChange={(e) => setPageNum(parseInt(e.target.value) || 1)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Font Size</label>
                  <input 
                    type="number" min="8" max="100"
                    value={textSize} 
                    onChange={(e) => setTextSize(parseInt(e.target.value) || 24)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">X Position (Left to Right)</label>
                  <input 
                    type="number" 
                    value={xPos} 
                    onChange={(e) => setXPos(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Y Position (Bottom to Top)</label>
                  <input 
                    type="number" 
                    value={yPos} 
                    onChange={(e) => setYPos(parseInt(e.target.value) || 0)}
                    className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Text Color</label>
                <input 
                  type="color" 
                  value={color} 
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-12 p-1 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                />
              </div>

              <button
                onClick={handleEdit}
                disabled={!file || !textToAdd || isProcessing}
                className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all"
              >
                {isProcessing ? 'Processing...' : 'Add Text & Download'}
              </button>

            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
