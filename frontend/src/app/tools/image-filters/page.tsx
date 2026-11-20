'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ImageFiltersPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  
  const [filter, setFilter] = useState<string>('none');
  const [blur, setBlur] = useState<number>(0);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setImgSrc(event.target?.result as string);
        
        // Load image for canvas drawing
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          imgRef.current = img;
          applyFilters(); // Initial render
        };
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const applyFilters = () => {
    if (!canvasRef.current || !imgRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    
    if (!ctx) return;

    // Set canvas size to image original size to keep quality
    canvas.width = img.width;
    canvas.height = img.height;

    // Construct filter string
    let filterString = '';
    
    if (filter !== 'none') {
      if (filter === 'grayscale') filterString += 'grayscale(100%) ';
      if (filter === 'sepia') filterString += 'sepia(100%) ';
      if (filter === 'invert') filterString += 'invert(100%) ';
    }
    
    if (blur > 0) filterString += `blur(${blur}px) `;
    if (brightness !== 100) filterString += `brightness(${brightness}%) `;
    if (contrast !== 100) filterString += `contrast(${contrast}%) `;
    if (saturation !== 100) filterString += `saturate(${saturation}%) `;

    // Clear and draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Apply filters
    ctx.filter = filterString.trim() || 'none';
    
    // Draw original image with filter applied
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  // Re-apply filters whenever settings change
  useEffect(() => {
    applyFilters();
  }, [filter, blur, brightness, contrast, saturation]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `filtered_${file.name}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, file.type || 'image/png');
  };
  
  const resetFilters = () => {
    setFilter('none');
    setBlur(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
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
              Image Filters
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Apply stunning filters and adjust colors instantly in your browser.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-6">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Upload Image</span></p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {imgSrc && (
              <div className="space-y-6 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Settings</h3>
                  <button onClick={resetFilters} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold">Reset All</button>
                </div>

                {/* Preset Filters */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase">Color Filter</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['none', 'grayscale', 'sepia', 'invert'].map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`py-2 px-2 rounded-lg text-sm font-bold capitalize transition-colors ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sliders */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Blur</label>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">{blur}px</span>
                    </div>
                    <input type="range" min="0" max="20" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Brightness</label>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">{brightness}%</span>
                    </div>
                    <input type="range" min="0" max="200" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Contrast</label>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">{contrast}%</span>
                    </div>
                    <input type="range" min="0" max="200" value={contrast} onChange={(e) => setContrast(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Saturation</label>
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">{saturation}%</span>
                    </div>
                    <input type="range" min="0" max="200" value={saturation} onChange={(e) => setSaturation(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  <span>Download Image</span>
                </button>
              </div>
            )}
            
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-medium">{error}</div>}
          </div>

          {/* Main Output Area (Preview) */}
          <div className="flex-1 p-8 bg-white dark:bg-gray-800 flex flex-col items-center justify-center h-[70vh]">
            {imgSrc ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-4">
                {/* 
                  The canvas contains the actual full-resolution image being modified.
                  We use CSS to scale it nicely within the preview area without losing its internal resolution.
                */}
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/20 text-center p-6">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">Image Preview</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-xs">Upload an image from the sidebar to start applying filters.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
