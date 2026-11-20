'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function ImageCompressorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(70);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG, PNG, WebP).');
        return;
      }
      setFile(selectedFile);
      setOriginalSize(selectedFile.size);
      setCompressedSize(0);
      setCompressedUrl(null);
      setError(null);
      setSuccess(false);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleCompress = () => {
    if (!file) {
      setError('Please select an image file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);
    setCompressedUrl(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          setError('Canvas is not supported in your browser.');
          setIsProcessing(false);
          return;
        }

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert quality to decimal 0.0 - 1.0
        const qualityDecimal = quality / 100;
        
        // Force output to JPEG or WebP for compression (PNG doesn't support quality parameter in the same way)
        const outputType = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            setCompressedUrl(url);
            setCompressedSize(blob.size);
            setSuccess(true);
            setIsProcessing(false);
          } else {
            setError('Failed to compress image.');
            setIsProcessing(false);
          }
        }, outputType, qualityDecimal);
      };
      
      img.onerror = () => {
        setError('Failed to load image.');
        setIsProcessing(false);
      };
    };
  };

  const calculateSaved = () => {
    if (originalSize > 0 && compressedSize > 0) {
      const savedBytes = originalSize - compressedSize;
      const percentage = (savedBytes / originalSize) * 100;
      return percentage > 0 ? percentage.toFixed(1) : 0;
    }
    return 0;
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
              Image Compressor
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Reduce your image file size instantly without losing visible quality. Processed 100% securely in your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-xl">
              {/* File Input */}
              <div className="mb-8">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-indigo-50 dark:bg-indigo-900/10 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG, WebP</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
                {file && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">Size: {formatBytes(originalSize)}</span>
                    </div>
                    <button onClick={() => {setFile(null); setCompressedUrl(null);}} className="text-red-500 hover:text-red-700 text-sm font-bold uppercase tracking-wider ml-4">Remove</button>
                  </div>
                )}
              </div>

              {/* Quality Slider */}
              <div className="mb-8 p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Compression Quality
                  </label>
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-sm">
                    {quality}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  value={quality} 
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  <span>Smaller File (Low Quality)</span>
                  <span>Larger File (High Quality)</span>
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              
              {/* Action Button */}
              {!compressedUrl ? (
                <button
                  onClick={handleCompress}
                  disabled={!file || isProcessing}
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
                    <span>Compress Image</span>
                  )}
                </button>
              ) : (
                <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-2">Compression Successful! 🎉</h3>
                  <div className="flex justify-center items-center space-x-8 my-4">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Original</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{formatBytes(originalSize)}</span>
                    </div>
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Compressed</span>
                      <span className="font-bold text-green-700 dark:text-green-300 text-xl">{formatBytes(compressedSize)}</span>
                    </div>
                  </div>
                  <div className="inline-block px-4 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-sm font-bold mb-6">
                    Saved {calculateSaved()}% space
                  </div>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={handleCompress}
                      className="flex-1 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Re-Compress
                    </button>
                    <a 
                      href={compressedUrl}
                      download={`compressed_${file?.name}`}
                      className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex justify-center items-center space-x-2 transition-colors shadow-md"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      <span>Download</span>
                    </a>
                  </div>
                </div>
              )}
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
