'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function BackgroundRemoverPage() {
  const [image, setImage] = useState<{ url: string; file: File } | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    const url = URL.createObjectURL(file);
    setImage({ url, file });
    setResultImage(null);
    setError(null);
    setProgress(0);
  };

  const removeBackground = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    setProgress(10);
    
    try {
      // Dynamically import to avoid SSR issues with WASM/Browser APIs
      const { removeBackground: imglyRemoveBackground } = await import('@imgly/background-removal');
      
      const config = {
        publicPath: window.location.origin + '/static/imgly/', // Must be absolute URL to prevent URL constructor error
        progress: (key: string, current: number, total: number) => {
          // Calculate a rough percentage based on chunks loaded or processing steps
          const percent = Math.round((current / total) * 100);
          setProgress(Math.max(10, percent));
        }
      };

      const blob = await imglyRemoveBackground(image.file, config);
      const resultUrl = URL.createObjectURL(blob);
      setResultImage(resultUrl);
      
    } catch (err: any) {
      console.error('Background removal error:', err);
      setError(`Error: ${err.message || 'Unknown error'}. Please check console for details.`);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadResult = () => {
    if (resultImage && image) {
      const a = document.createElement('a');
      a.href = resultImage;
      const nameWithoutExt = image.file.name.substring(0, image.file.name.lastIndexOf('.')) || 'image';
      a.download = `${nameWithoutExt}_no_bg.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-indigo-50/50 dark:bg-indigo-900/10 relative">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">AI Background Remover</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Remove image backgrounds automatically using Client-Side AI. 100% Free and Private.
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Friendly Note:</strong> Since this tool uses original AI right inside your browser, the very first time you use it, it will download some AI files (~40MB). It might take a minute depending on your internet speed. Thank you for your patience! 😊
              </p>
            </div>
            
            <span className="absolute top-8 right-8 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-bold px-2 py-1 rounded hidden sm:block">WASM AI</span>
          </div>

          <div className="p-8">
            {!image ? (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-3xl h-80 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-all"
              >
                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-sm mb-4">
                  <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-bold text-lg">Click to upload an image</span>
                <span className="text-sm text-gray-500 dark:text-gray-400 mt-2">Works completely in your browser</span>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* Result Area */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Original Image */}
                  <div className="flex flex-col">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 text-center uppercase tracking-wider">
                      Original
                    </label>
                    <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden h-64 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                      <img src={image.url} alt="Original" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>

                  {/* Processed Image */}
                  <div className="flex flex-col">
                    <label className="block text-sm font-bold text-indigo-700 dark:text-indigo-400 mb-3 text-center uppercase tracking-wider">
                      Background Removed
                    </label>
                    <div className="relative border-2 border-indigo-200 dark:border-indigo-900/50 rounded-2xl overflow-hidden h-64 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIgLz4KPHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZWVlIiAvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2VlZSIgLz4KPC9zdmc+')] flex items-center justify-center">
                      {isProcessing ? (
                        <div className="flex flex-col items-center p-6 bg-white/80 dark:bg-gray-800/80 rounded-xl shadow-lg backdrop-blur-sm">
                          <svg className="animate-spin h-10 w-10 text-indigo-600 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="text-gray-800 dark:text-gray-200 font-medium">Processing AI Models...</span>
                          <span className="text-xs text-gray-500 mt-2">First run downloads ~40MB of data. Please wait.</span>
                          
                          {progress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mt-4 overflow-hidden">
                              <div className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                            </div>
                          )}
                        </div>
                      ) : resultImage ? (
                        <img src={resultImage} alt="Result" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-gray-400 dark:text-gray-500">Ready to process</span>
                      )}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium text-center">
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                  <button
                    onClick={() => {setImage(null); setResultImage(null);}}
                    disabled={isProcessing}
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    Upload Another
                  </button>
                  
                  {!resultImage ? (
                    <button
                      onClick={removeBackground}
                      disabled={isProcessing}
                      className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center disabled:opacity-50"
                    >
                      Remove Background
                    </button>
                  ) : (
                    <button
                      onClick={downloadResult}
                      className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      Download Image
                    </button>
                  )}
                </div>

              </div>
            )}
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
