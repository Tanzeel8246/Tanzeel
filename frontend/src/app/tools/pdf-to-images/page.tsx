'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
let pdfjsLib: any = null;
export default function PdfToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<{url: string, name: string}[]>([]);
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
      setImages([]);
      setError(null);
    }
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setImages([]);

    try {
      if (!pdfjsLib) throw new Error('PDF library loading, please try again in a moment');
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      
      const extractedImages: {url: string, name: string}[] = [];
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas not supported in this browser.');

      // Limit to 20 pages to prevent browser crash on huge PDFs
      const maxPages = Math.min(pdf.numPages, 20);

      for (let i = 1; i <= maxPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // Higher scale for better quality
        
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to image URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        extractedImages.push({
          url: dataUrl,
          name: `${file.name.replace(/\.[^/.]+$/, "")}_page_${i}.jpg`
        });
      }

      setImages(extractedImages);
      
      if (pdf.numPages > 20) {
        setError(`Note: Only the first 20 pages were converted to prevent browser memory issues.`);
      }
      
    } catch (err: any) {
      console.error(err);
      setError('Failed to convert PDF. The file might be corrupted or password protected.');
    } finally {
      setIsProcessing(false);
    }
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
              PDF to Images
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Convert every page of your PDF into high-quality JPG images directly in your browser.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-4">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span></p>
                <p className="text-xs text-gray-400">PDF Files Only</p>
              </div>
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
            </label>

            {file && (
              <div className="mb-6 p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm flex justify-between items-center">
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                <button onClick={() => {setFile(null); setImages([]);}} className="text-red-500 text-xs font-bold uppercase ml-2">Clear</button>
              </div>
            )}

            {error && <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-xl text-sm font-medium">{error}</div>}

            <button
              onClick={handleConvert}
              disabled={!file || isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2 mt-auto"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Converting Pages...</span>
                </>
              ) : (
                <span>Convert to Images</span>
              )}
            </button>
          </div>

          {/* Main Output Area (Gallery) */}
          <div className="flex-1 p-8 bg-white dark:bg-gray-800 flex flex-col">
            <h2 className="text-lg font-bold text-gray-700 dark:text-gray-200 mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              Image Gallery {images.length > 0 && `(${images.length})`}
            </h2>
            
            {images.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 max-h-[60vh]">
                {images.map((img, idx) => (
                  <div key={idx} className="group relative bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                    <img src={img.url} alt={`Page ${idx + 1}`} className="w-full h-auto object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <a 
                        href={img.url} 
                        download={img.name}
                        className="px-4 py-2 bg-white text-gray-900 rounded-lg font-bold text-sm shadow-lg hover:scale-105 transition-transform"
                      >
                        Download JPG
                      </a>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-bold rounded">
                      Page {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/20 text-center p-6">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-gray-400 dark:text-gray-500 font-medium">Your extracted images will appear here</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Ready to be downloaded individually</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
