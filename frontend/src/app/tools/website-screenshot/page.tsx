'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WebsiteScreenshotPage() {
  const [url, setUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

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
    setScreenshotUrl(null);

    try {
      // Using microlink.io free API for screenshots
      const apiUrl = `https://api.microlink.io/?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false`;
      
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error('Failed to capture website. Make sure the URL is accessible.');
      }
      
      const data = await response.json();
      
      if (data.status === 'success' && data.data && data.data.screenshot && data.data.screenshot.url) {
        setScreenshotUrl(data.data.screenshot.url);
      } else {
        throw new Error('Failed to generate screenshot.');
      }
      
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while capturing the website.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!screenshotUrl) return;
    
    try {
      // Attempt to fetch and download as blob to force download instead of navigation
      const response = await fetch(screenshotUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      
      // Create a nice filename from the entered URL
      let filename = 'screenshot';
      try {
        const parsedUrl = new URL(url.startsWith('http') ? url : 'https://' + url);
        filename = parsedUrl.hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      } catch (e) {}
      
      a.download = `${filename}.png`;
      a.click();
      
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      // Fallback if fetch fails due to CORS on the image CDN
      window.open(screenshotUrl, '_blank');
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
              Website Screenshot
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Enter any website URL to instantly capture a high-quality, full-page screenshot.
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                    <input 
                      type="text" 
                      value={url} 
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="example.com"
                      className="block w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-shadow" 
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isProcessing || !url.trim()}
                  className="md:w-auto w-full px-8 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2 whitespace-nowrap"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Capturing...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span>Screenshot</span>
                    </>
                  )}
                </button>
              </form>

              {error && <div className="mb-8 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              
              {/* Preview Area */}
              {screenshotUrl ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full overflow-hidden rounded-xl shadow-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900">
                     {/* Browser-like header for preview */}
                     <div className="bg-gray-200 dark:bg-gray-800 px-4 py-2 flex items-center border-b border-gray-300 dark:border-gray-700">
                       <div className="flex space-x-1.5">
                         <div className="w-3 h-3 rounded-full bg-red-400"></div>
                         <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                         <div className="w-3 h-3 rounded-full bg-green-400"></div>
                       </div>
                       <div className="mx-4 flex-1 bg-white dark:bg-gray-700 rounded-md text-center text-xs py-1 text-gray-500 dark:text-gray-400 font-mono truncate px-2">
                         {url}
                       </div>
                     </div>
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={screenshotUrl} alt="Website Screenshot" className="w-full h-auto block max-h-[60vh] object-cover object-top" />
                  </div>

                  <button
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download Image (PNG)</span>
                  </button>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-gray-800">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="text-gray-400 dark:text-gray-500 font-medium">Enter a URL to see the preview here</p>
                </div>
              )}
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
