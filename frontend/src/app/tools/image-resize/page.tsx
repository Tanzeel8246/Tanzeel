'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ImageResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  
  const [origWidth, setOrigWidth] = useState<number>(0);
  const [origHeight, setOrigHeight] = useState<number>(0);
  
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [maintainRatio, setMaintainRatio] = useState<boolean>(true);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setResizedUrl(null);
      setError(null);
      
      const img = new window.Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setWidth(img.width.toString());
        setHeight(img.height.toString());
      };
      img.src = url;
    }
  };

  const handleWidthChange = (val: string) => {
    setWidth(val);
    if (maintainRatio && origWidth > 0 && val !== '') {
      const newW = parseInt(val) || 0;
      setHeight(Math.round(newW * (origHeight / origWidth)).toString());
    }
  };

  const handleHeightChange = (val: string) => {
    setHeight(val);
    if (maintainRatio && origHeight > 0 && val !== '') {
      const newH = parseInt(val) || 0;
      setWidth(Math.round(newH * (origWidth / origHeight)).toString());
    }
  };

  const resizeImage = () => {
    if (!file || !preview) return;
    const w = parseInt(width);
    const h = parseInt(height);
    
    if (!w || !h || w <= 0 || h <= 0) {
      setError('Please provide valid positive numbers for width and height.');
      return;
    }
    
    setIsProcessing(true);
    setError(null);

    const img = new window.Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) throw new Error('Canvas not supported');
        
        // High quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        ctx.drawImage(img, 0, 0, w, h);

        const outFormat = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        
        if (w === 0 || h === 0) {
          throw new Error('Invalid image dimensions');
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            setError('Failed to create blob. The image might be corrupted or too large.');
            setIsProcessing(false);
            return;
          }
          const url = URL.createObjectURL(blob);
          setResizedUrl(url);
          setIsProcessing(false);
        }, outFormat, 0.95);
      } catch (err: any) {
        console.error(err);
        setError('Failed to resize image.');
        setIsProcessing(false);
      }
    };
    
    img.onerror = () => {
      setError('Failed to load image for resizing.');
      setIsProcessing(false);
    };
    
    img.src = preview;
  };

  const handleDownload = () => {
    if (!resizedUrl || !file) return;
    const a = document.createElement('a');
    a.href = resizedUrl;
    
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'image';
    a.download = `${baseName}_${width}x${height}.${ext}`;
    
    a.click();
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
              Image Resizer
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Change the dimensions of your images quickly and securely. No data leaves your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-2xl">
              
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-8">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-16 h-16 mb-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400"><span className="font-bold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Any Image Format</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Original: {origWidth} × {origHeight}</h3>
                    <button 
                      onClick={() => { setFile(null); setPreview(null); setResizedUrl(null); }}
                      className="text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-400"
                    >
                      Remove Image
                    </button>
                  </div>
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-center shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="max-w-full max-h-64 object-contain" />
                  </div>
                </div>
              )}

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}

              {preview && !resizedUrl && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm mb-8">
                  <label className="block mb-6 text-sm font-bold text-gray-700 dark:text-gray-300">Set New Dimensions</label>
                  
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Width (px)</label>
                      <input 
                        type="number" 
                        value={width}
                        onChange={(e) => handleWidthChange(e.target.value)}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div className="flex flex-col items-center justify-center pt-6 text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Height (px)</label>
                      <input 
                        type="number" 
                        value={height}
                        onChange={(e) => handleHeightChange(e.target.value)}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                  </div>

                  <div className="flex items-center mb-6">
                    <input 
                      type="checkbox" 
                      id="maintainRatio" 
                      checked={maintainRatio}
                      onChange={(e) => setMaintainRatio(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label htmlFor="maintainRatio" className="ml-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                      Maintain Aspect Ratio
                    </label>
                  </div>

                  <button
                    onClick={resizeImage}
                    disabled={isProcessing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Resizing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                        <span>Resize Image</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {resizedUrl && (
                <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Resize Successful!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 uppercase tracking-widest font-semibold">{width} × {height} px</p>
                  
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setResizedUrl(null)}
                      className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-xl font-bold transition-colors"
                    >
                      Resize Again
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                      <span>Download</span>
                    </button>
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
