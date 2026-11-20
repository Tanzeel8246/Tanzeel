'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ImageToIcoPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [size, setSize] = useState<number>(32); // Default favicon size
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [icoUrl, setIcoUrl] = useState<string | null>(null);

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
      setIcoUrl(null);
      setError(null);
    }
  };

  const convertToIco = () => {
    if (!file || !preview) return;
    
    setIsProcessing(true);
    setError(null);

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setError('Canvas not supported');
        setIsProcessing(false);
        return;
      }
      
      // Draw image centered/scaled
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      // Convert to PNG blob (modern ICO files can wrap PNG data)
      canvas.toBlob(async (blob) => {
        if (!blob) {
          setError('Failed to process image');
          setIsProcessing(false);
          return;
        }

        try {
          const pngBuffer = await blob.arrayBuffer();
          const pngData = new Uint8Array(pngBuffer);
          const pngSize = pngData.length;

          // ICO Header (6 bytes)
          // 0-1: Reserved (0)
          // 2-3: Type (1 = ICO)
          // 4-5: Count (1 image)
          const header = new Uint8Array([0, 0, 1, 0, 1, 0]);

          // ICO Directory Entry (16 bytes)
          // 0: Width (0-255, 0 = 256)
          // 1: Height (0-255, 0 = 256)
          // 2: Color count (0 = >8bpp)
          // 3: Reserved (0)
          // 4-5: Color planes (1)
          // 6-7: Bits per pixel (32)
          // 8-11: Image data size in bytes
          // 12-15: Image data offset from start of file (6 + 16 = 22)
          
          const dir = new Uint8Array(16);
          dir[0] = size === 256 ? 0 : size;
          dir[1] = size === 256 ? 0 : size;
          dir[2] = 0;
          dir[3] = 0;
          dir[4] = 1; dir[5] = 0;
          dir[6] = 32; dir[7] = 0;
          
          // Size (Little Endian)
          const dataView = new DataView(dir.buffer);
          dataView.setUint32(8, pngSize, true);
          // Offset (Little Endian)
          dataView.setUint32(12, 22, true);

          // Construct final ICO file
          const icoBuffer = new Uint8Array(header.length + dir.length + pngData.length);
          icoBuffer.set(header, 0);
          icoBuffer.set(dir, header.length);
          icoBuffer.set(pngData, header.length + dir.length);

          const icoBlob = new Blob([icoBuffer], { type: 'image/x-icon' });
          const url = URL.createObjectURL(icoBlob);
          setIcoUrl(url);
        } catch (err: any) {
          console.error(err);
          setError('Failed to create ICO file.');
        } finally {
          setIsProcessing(false);
        }

      }, 'image/png');
    };
    img.onerror = () => {
      setError('Failed to load image for conversion.');
      setIsProcessing(false);
    };
    img.src = preview;
  };

  const handleDownload = () => {
    if (!icoUrl) return;
    const a = document.createElement('a');
    a.href = icoUrl;
    let filename = 'favicon.ico';
    if (file) {
       const base = file.name.substring(0, file.name.lastIndexOf('.'));
       filename = `${base || 'image'}_${size}x${size}.ico`;
    }
    a.download = filename;
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
              Image to ICO (Favicon Generator)
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Convert any image (PNG, JPG, WebP) into an .ico file perfect for website favicons or Windows icons.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-2xl">
              
              {!preview ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-8">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-16 h-16 mb-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400"><span className="font-bold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Image Preview</h3>
                    <button 
                      onClick={() => { setFile(null); setPreview(null); setIcoUrl(null); }}
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

              {preview && !icoUrl && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm mb-8">
                  <label className="block mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">Select Favicon Size</label>
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[16, 32, 48, 64, 128, 256].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`py-3 rounded-lg border-2 font-bold text-sm transition-colors ${
                          size === s 
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300' 
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        {s}x{s}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={convertToIco}
                    disabled={isProcessing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Converting...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        <span>Convert to ICO</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {icoUrl && (
                <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ICO Generated Successfully!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Size: {size}x{size} pixels</p>
                  
                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download {size}x{size} ICO</span>
                  </button>
                </div>
              )}
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
