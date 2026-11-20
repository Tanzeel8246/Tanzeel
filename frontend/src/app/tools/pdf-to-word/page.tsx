'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
let pdfjsLib: any = null;
import { Document, Packer, Paragraph, TextRun } from 'docx';

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    import('pdfjs-dist').then(mod => {
      pdfjsLib = mod;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      if (!pdfjsLib) throw new Error('PDF library loading, please try again in a moment');
      // 1. Extract text from PDF
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      const documentChildren = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        // Group items into lines based on Y coordinate to somewhat preserve layout
        const linesMap: { [y: number]: any[] } = {};
        
        textContent.items.forEach((item: any) => {
          // A somewhat hacky grouping by roughly rounding the Y position
          const y = Math.round(item.transform[5]); 
          if (!linesMap[y]) linesMap[y] = [];
          linesMap[y].push(item);
        });

        // Sort lines from top to bottom (Y decreases in PDF coords usually, but can vary)
        const sortedYs = Object.keys(linesMap).map(Number).sort((a, b) => b - a);
        
        sortedYs.forEach(y => {
          const lineItems = linesMap[y].sort((a, b) => a.transform[4] - b.transform[4]);
          const lineText = lineItems.map(item => item.str).join(' ');
          
          if (lineText.trim()) {
            documentChildren.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: lineText,
                    font: 'Calibri',
                    size: 24, // 12pt
                  }),
                ],
                spacing: { after: 200 }
              })
            );
          }
        });

        // Page break if not last page
        if (i < pdf.numPages) {
          documentChildren.push(
            new Paragraph({
              pageBreakBefore: true
            })
          );
        }
      }

      // 2. Create Word Document
      const doc = new Document({
        creator: 'CodeHubb Tools',
        title: 'Converted from PDF',
        sections: [
          {
            properties: {},
            children: documentChildren.length > 0 ? documentChildren : [
              new Paragraph({
                children: [new TextRun({ text: "No readable text found.", font: "Calibri", size: 24 })]
              })
            ],
          },
        ],
      });

      // 3. Download the Word file
      const docBlob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(docBlob);
      const link = document.createElement('a');
      link.href = url;
      // Replace .pdf with .docx
      const outName = file.name.replace(/\.[^/.]+$/, "") + ".docx";
      link.download = outName;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError('Failed to convert PDF. Ensure it contains actual text (not scanned images) and is not password protected.');
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
              PDF to Word Converter
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Extract text from your PDF document and instantly generate an editable Microsoft Word (.docx) file directly in your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-xl">
              {/* Info Alert */}
              <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  <strong>Note:</strong> This tool extracts <span className="font-bold underline">text only</span>. Complex layouts, images, and scanned documents (without OCR) might not convert perfectly.
                </p>
              </div>

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
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3 truncate">
                      <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" /></svg>
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                    </div>
                    <button onClick={() => {setFile(null); setSuccess(false);}} className="text-red-500 hover:text-red-700 text-sm font-bold uppercase tracking-wider ml-4">Remove</button>
                  </div>
                )}
              </div>

              {/* Error / Success Messages */}
              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              {success && <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium text-center flex flex-col items-center space-y-2">
                <span>Word document generated successfully!</span>
                <span className="text-sm opacity-80">Check your downloads folder for the .docx file.</span>
              </div>}

              {/* Action Button */}
              <button
                onClick={handleConvert}
                disabled={!file || isProcessing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2 group"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Extracting Text & Converting...</span>
                  </>
                ) : (
                  <>
                    <span>Convert to Word Document</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
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
