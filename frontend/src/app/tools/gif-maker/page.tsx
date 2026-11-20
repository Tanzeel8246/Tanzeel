'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

// Dynamically import gifenc to avoid SSR issues
let gifenc: any = null;

export default function GifMakerPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [delay, setDelay] = useState(500); // 500ms per frame
  const [isProcessing, setIsProcessing] = useState(false);
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    import('gifenc').then((mod) => {
      gifenc = mod;
    }).catch(err => {
      console.error("Failed to load gifenc", err);
    });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
      setFiles(prev => [...prev, ...selectedFiles]);
      setGifUrl(null);
      setError(null);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setFiles(prev => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index - 1];
      newFiles[index - 1] = temp;
      return newFiles;
    });
  };

  const moveDown = (index: number) => {
    if (index === files.length - 1) return;
    setFiles(prev => {
      const newFiles = [...prev];
      const temp = newFiles[index];
      newFiles[index] = newFiles[index + 1];
      newFiles[index + 1] = temp;
      return newFiles;
    });
  };

  const loadImage = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  };

  const createGif = async () => {
    if (!gifenc) {
      setError('GIF encoder is still loading. Please wait a moment.');
      return;
    }
    
    if (files.length < 2) {
      setError('Please add at least 2 images to create a GIF.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setGifUrl(null);

    try {
      const { GIFEncoder, quantize, applyPalette } = gifenc;
      
      // Load all images first
      const images = await Promise.all(files.map(f => loadImage(f)));
      
      // Use the dimensions of the first image as the base
      const width = images[0].naturalWidth || 500;
      const height = images[0].naturalHeight || 500;
      
      // We should scale down huge images to prevent crashing the browser
      const maxDim = 800;
      let finalWidth = width;
      let finalHeight = height;
      
      if (width > maxDim || height > maxDim) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        finalWidth = Math.floor(width * ratio);
        finalHeight = Math.floor(height * ratio);
      }

      const gif = GIFEncoder();
      const canvas = document.createElement('canvas');
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas not supported');

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        // Clear background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, finalWidth, finalHeight);
        
        // Draw image, centered and covering the canvas if possible
        // Simple scale to fit:
        ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
        
        // Get RGBA data
        const imageData = ctx.getImageData(0, 0, finalWidth, finalHeight);
        const rgba = imageData.data;
        
        // Quantize colors for GIF (256 colors max)
        const palette = quantize(rgba, 256, { format: 'rgba4444' });
        const index = applyPalette(rgba, palette);
        
        // Add frame to GIF
        gif.writeFrame(index, finalWidth, finalHeight, { palette, delay });
      }

      gif.finish();
      const bytes = gif.bytes();
      
      const blob = new Blob([bytes], { type: 'image/gif' });
      const url = URL.createObjectURL(blob);
      setGifUrl(url);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to generate GIF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadGif = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = `animated_${new Date().getTime()}.gif`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[70vh]">
          
          {/* Sidebar / Controls */}
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col h-[70vh] overflow-y-auto">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              GIF Maker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Create animated GIFs by combining multiple images together.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-6 flex-shrink-0">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Add Images</span></p>
              </div>
              <input type="file" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
            </label>

            <div className="mb-6 flex-shrink-0">
              <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Animation Speed (Delay)</label>
              <div className="flex items-center space-x-4">
                <input 
                  type="range" 
                  min="50" max="2000" step="50" 
                  value={delay} 
                  onChange={(e) => setDelay(Number(e.target.value))} 
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600" 
                />
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap w-16 text-right">{delay} ms</span>
              </div>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-medium">{error}</div>}

            <div className="flex-1 flex flex-col mb-4">
               <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Image Sequence ({files.length})</div>
               <ul className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                 {files.map((file, idx) => (
                   <li key={idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm">
                      <div className="flex items-center space-x-2 truncate">
                        <span className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{file.name}</span>
                      </div>
                      <div className="flex space-x-1 flex-shrink-0">
                         <button onClick={() => moveUp(idx)} disabled={idx === 0} className="p-1 text-gray-400 hover:text-indigo-500 disabled:opacity-30">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path></svg>
                         </button>
                         <button onClick={() => moveDown(idx)} disabled={idx === files.length - 1} className="p-1 text-gray-400 hover:text-indigo-500 disabled:opacity-30">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                         </button>
                         <button onClick={() => removeFile(idx)} className="p-1 text-gray-400 hover:text-red-500">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                         </button>
                      </div>
                   </li>
                 ))}
                 {files.length === 0 && (
                   <div className="text-center p-4 text-xs text-gray-400">No images added yet.</div>
                 )}
               </ul>
            </div>

            <button
              onClick={createGif}
              disabled={files.length < 2 || isProcessing}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2 flex-shrink-0"
            >
              {isProcessing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating GIF...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  <span>Generate Animated GIF</span>
                </>
              )}
            </button>
          </div>

          {/* Main Output Area */}
          <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center h-[70vh]">
            {gifUrl ? (
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="relative max-w-full max-h-[80%] overflow-hidden rounded-xl shadow-2xl border border-gray-300 dark:border-gray-700 bg-white p-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={gifUrl} alt="Generated GIF" className="max-w-full h-auto object-contain" style={{ maxHeight: '100%' }} />
                </div>
                
                <button
                  onClick={downloadGif}
                  className="mt-8 px-8 py-4 bg-gray-900 hover:bg-black dark:bg-gray-100 dark:hover:bg-white dark:text-gray-900 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  <span>Download GIF</span>
                </button>
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/20 text-center p-6">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">GIF Preview</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-xs">Add images and click Generate to see your animated GIF here.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
