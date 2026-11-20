'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

interface ColorInfo {
  hex: string;
  rgb: string;
  percentage: number;
}

export default function ColorExtractorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setColors([]);
      setError(null);
    }
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  };

  const extractColors = () => {
    if (!preview) return;
    
    setIsProcessing(true);
    setError(null);
    setColors([]);

    const img = new window.Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Canvas not supported');
        
        // Scale down large images for faster processing
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;
        if (width > MAX_SIZE || height > MAX_SIZE) {
          if (width > height) {
            height = (height / width) * MAX_SIZE;
            width = MAX_SIZE;
          } else {
            width = (width / height) * MAX_SIZE;
            height = MAX_SIZE;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        
        const colorCounts: Record<string, { r: number, g: number, b: number, count: number }> = {};
        let totalValidPixels = 0;
        
        // Check every Nth pixel for speed
        const blockSize = 5; 
        
        for (let i = 0; i < data.length; i += 4 * blockSize) {
          const r = data[i];
          const g = data[i+1];
          const b = data[i+2];
          const a = data[i+3];
          
          if (a < 128) continue; // Skip transparent
          // Ignore pure white/black backgrounds sometimes if they dominate too much, but let's keep it simple
          
          // Quantize to group similar colors (round to nearest 24)
          const bucketR = Math.round(r / 24) * 24;
          const bucketG = Math.round(g / 24) * 24;
          const bucketB = Math.round(b / 24) * 24;
          
          const key = `${bucketR},${bucketG},${bucketB}`;
          
          if (!colorCounts[key]) {
            colorCounts[key] = { r: bucketR, g: bucketG, b: bucketB, count: 0 };
          }
          colorCounts[key].count++;
          totalValidPixels++;
        }
        
        // Sort by frequency
        const sortedColors = Object.values(colorCounts)
          .sort((a, b) => b.count - a.count)
          .slice(0, 12); // Top 12 colors
          
        const extracted: ColorInfo[] = sortedColors.map(c => {
          // Clamp to 255 just in case
          const r = Math.min(255, c.r);
          const g = Math.min(255, c.g);
          const b = Math.min(255, c.b);
          return {
            hex: rgbToHex(r, g, b).toUpperCase(),
            rgb: `rgb(${r}, ${g}, ${b})`,
            percentage: (c.count / totalValidPixels) * 100
          };
        });
        
        setColors(extracted);
      } catch (err: any) {
        console.error(err);
        setError('Failed to extract colors. The image might be corrupted.');
      } finally {
        setIsProcessing(false);
      }
    };
    
    img.onerror = () => {
      setError('Failed to load image for processing.');
      setIsProcessing(false);
    };
    
    img.src = preview;
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
              Image Color Extractor
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Upload an image to automatically extract its primary color palette. Perfect for designers and developers.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row min-h-[500px]">
            {/* Left Side: Upload & Preview */}
            <div className="lg:w-1/2 p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700 flex flex-col">
              
              {!preview ? (
                <label className="flex-1 flex flex-col items-center justify-center border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <svg className="w-16 h-16 mb-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="mb-2 text-xl font-bold text-gray-700 dark:text-gray-300">Upload Image</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Drag & drop or click to select</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Image Preview</h3>
                    <button 
                      onClick={() => { setFile(null); setPreview(null); setColors([]); }}
                      className="text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-400"
                    >
                      Change Image
                    </button>
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center relative shadow-inner p-4 mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview} alt="Preview" className="max-w-full max-h-[300px] object-contain drop-shadow-md" />
                  </div>
                  
                  <button
                    onClick={extractColors}
                    disabled={isProcessing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Extracting Colors...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                        <span>Extract Color Palette</span>
                      </>
                    )}
                  </button>
                  {error && <p className="mt-4 text-center text-red-500 font-medium text-sm">{error}</p>}
                </div>
              )}
            </div>

            {/* Right Side: Extracted Colors */}
            <div className="lg:w-1/2 p-8 sm:p-12 bg-white dark:bg-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Color Palette
              </h2>

              {colors.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-10 h-10 text-gray-300 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd"></path></svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">Extract colors to see the palette here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {colors.map((color, index) => (
                    <div 
                      key={index} 
                      className="group flex flex-col rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-gray-900 cursor-pointer"
                      onClick={() => copyToClipboard(color.hex, index)}
                    >
                      <div 
                        className="h-24 w-full relative" 
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className={`absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity ${copiedIndex === index ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                          <span className="text-white font-bold text-sm">
                            {copiedIndex === index ? 'Copied!' : 'Click to Copy'}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 text-center">
                        <p className="font-bold text-gray-800 dark:text-white uppercase text-sm tracking-wider">{color.hex}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{color.rgb}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
