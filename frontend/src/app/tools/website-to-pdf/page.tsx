'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WebsiteToPdfPage() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleCapture = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let targetUrl = url.trim();
    if (!targetUrl) {
      setError('Please enter a valid website URL.');
      return;
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    setIsProcessing(true);
    setError(null);
    setPdfUrl(null);

    try {
      // Using microlink.io free API for generating PDFs from URLs
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&pdf=true&meta=false`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to capture website. Make sure the URL is accessible.');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data && data.data.pdf && data.data.pdf.url) {
        setPdfUrl(data.data.pdf.url);
      } else {
        throw new Error('Failed to generate PDF.');
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while capturing the website.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUrl) return;
    
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      
      let filename = 'document';
      try {
        const parsedUrl = new URL(url.startsWith('http') ? url : 'https://' + url);
        filename = parsedUrl.hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      } catch (e) {}
      
      a.download = `${filename}.pdf`;
      a.click();
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      // Fallback if fetch fails due to CORS
      window.open(pdfUrl, '_blank');
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
              Website to PDF
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Enter any website URL to instantly convert it into a high-quality PDF document.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-2xl">
              {/* Controls */}
              <form onSubmit={handleCapture} className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                  <div className="relative flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="example.com"
                      className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 transition-shadow" 
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing || !url.trim()}
                  className="md:w-auto w-full px-8 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating PDF...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                      <span>Convert to PDF</span>
                    </>
                  )}
                </button>
              </form>

              {error && <div className="mb-8 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              
              {/* Preview Area */}
              {pdfUrl ? (
                <div className="flex flex-col items-center">
                  <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center mb-8">
                     <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                     </div>
                     <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">PDF Generated Successfully!</h3>
                     <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 truncate px-4">{url}</p>
                     
                     <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={handleDownload}
                          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          <span>Download PDF</span>
                        </button>
                        
                        <a 
                          href={pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg font-bold shadow-sm transition-colors flex items-center justify-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          <span>Open in New Tab</span>
                        </a>
                     </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-gray-800">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <p className="text-gray-400 dark:text-gray-500 font-medium">Enter a URL to convert it to PDF</p>
                </div>
              )}
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
