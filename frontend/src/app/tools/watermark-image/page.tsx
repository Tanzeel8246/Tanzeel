'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function WatermarkImagePage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  
  const [watermarkText, setWatermarkText] = useState('© CodeHubb Tools');
  const [color, setColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState(0.5);
  const [fontSize, setFontSize] = useState(48);
  const [position, setPosition] = useState('bottom-right');
  
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
        
        const img = new window.Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          imgRef.current = img;
          applyWatermark(); 
        };
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const applyWatermark = () => {
    if (!canvasRef.current || !imgRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imgRef.current;
    
    if (!ctx) return;

    canvas.width = img.width;
    canvas.height = img.height;

    // Draw original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (!watermarkText) return;

    // Set Watermark styles
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    // Scale font size according to image width to make it proportional, or just use absolute.
    // Absolute is fine for simple tools, but proportional is better. We'll use absolute.
    ctx.font = `bold ${fontSize}px sans-serif`;
    
    const textMetrics = ctx.measureText(watermarkText);
    const textWidth = textMetrics.width;
    const textHeight = fontSize; // Approximate

    let x = 0;
    let y = 0;
    const padding = 20;

    switch (position) {
      case 'top-left':
        x = padding;
        y = padding + textHeight;
        break;
      case 'top-center':
        x = (canvas.width - textWidth) / 2;
        y = padding + textHeight;
        break;
      case 'top-right':
        x = canvas.width - textWidth - padding;
        y = padding + textHeight;
        break;
      case 'center':
        x = (canvas.width - textWidth) / 2;
        y = (canvas.height + textHeight) / 2;
        break;
      case 'bottom-left':
        x = padding;
        y = canvas.height - padding;
        break;
      case 'bottom-center':
        x = (canvas.width - textWidth) / 2;
        y = canvas.height - padding;
        break;
      case 'bottom-right':
      default:
        x = canvas.width - textWidth - padding;
        y = canvas.height - padding;
        break;
    }

    // Optional: Add shadow to make text visible on light backgrounds
    ctx.shadowColor = "rgba(0,0,0,0.8)";
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    ctx.fillText(watermarkText, x, y);
    
    // Reset alpha & shadow
    ctx.globalAlpha = 1.0;
    ctx.shadowColor = "transparent";
  };

  useEffect(() => {
    applyWatermark();
  }, [watermarkText, color, opacity, fontSize, position]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `watermarked_${file.name}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, file.type || 'image/png');
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
              Watermark Image
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Protect your images by adding a custom text watermark instantly.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-6">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Upload Image</span></p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {imgSrc && (
              <div className="space-y-5 flex-1">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Watermark Text</label>
                  <input 
                    type="text" 
                    value={watermarkText} 
                    onChange={(e) => setWatermarkText(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Color</label>
                    <input 
                      type="color" 
                      value={color} 
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-10 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Position</label>
                    <select 
                      value={position} 
                      onChange={(e) => setPosition(e.target.value)}
                      className="w-full h-10 px-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg outline-none text-gray-800 dark:text-gray-200 text-sm"
                    >
                      <option value="top-left">Top Left</option>
                      <option value="top-center">Top Center</option>
                      <option value="top-right">Top Right</option>
                      <option value="center">Center</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-center">Bottom Center</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Opacity</label>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">{Math.round(opacity * 100)}%</span>
                  </div>
                  <input type="range" min="0.1" max="1" step="0.05" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Font Size</label>
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-bold">{fontSize}px</span>
                  </div>
                  <input type="range" min="12" max="200" step="2" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
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
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full object-contain drop-shadow-md rounded-lg"
                />
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/20 text-center p-6">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">Image Preview</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-xs">Upload an image from the sidebar to preview your watermark.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
