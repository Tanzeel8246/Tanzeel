'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function ColorPickerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const [hoverColor, setHoverColor] = useState<{hex: string, rgb: string} | null>(null);
  const [selectedColor, setSelectedColor] = useState<{hex: string, rgb: string} | null>({
    hex: '#4F46E5',
    rgb: 'rgb(79, 70, 229)'
  });
  const [copied, setCopied] = useState(false);

  const drawToCanvas = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Exact pixel dimensions for accurate color sampling
    canvas.width = img.naturalWidth || img.width || 800;
    canvas.height = img.naturalHeight || img.height || 600;
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  };

  // Ensure canvas is drawn whenever imgSrc changes and canvas mounts
  useEffect(() => {
    if (imgSrc && imageRef.current && canvasRef.current) {
      drawToCanvas(imageRef.current);
    }
  }, [imgSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImgSrc(src);
        
        const img = new window.Image();
        img.onload = () => {
          imageRef.current = img;
          drawToCanvas(img);
        };
        img.src = src;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // Convert RGB to HEX
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  };

  const getPixelColor = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    // Map visual coordinates to actual canvas coordinates based on scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = Math.floor((clientX - rect.left) * scaleX);
    const y = Math.floor((clientY - rect.top) * scaleY);
    
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    
    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      if (pixel[3] === 0) return null; // Transparent
      
      const rgb = `rgb(${pixel[0]}, ${pixel[1]}, ${pixel[2]})`;
      const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);
      
      return { hex, rgb };
    } catch {
      return null;
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const color = getPixelColor(e);
    if (color) {
      setHoverColor(color);
    }
  };

  const handleMouseLeave = () => {
    setHoverColor(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const color = getPixelColor(e);
    if (color) {
      setSelectedColor(color);
      setCopied(false);
    }
  };

  // Native EyeDropper API support
  const handleNativeEyeDropper = async () => {
    if ('EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper();
        const result = await eyeDropper.open();
        if (result && result.sRGBHex) {
          const hex = result.sRGBHex.toUpperCase();
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          setSelectedColor({ hex, rgb: `rgb(${r}, ${g}, ${b})` });
        }
      } catch {
        // User canceled eyedropper
      }
    }
  };

  const handlePalettePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value.toUpperCase();
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    setSelectedColor({ hex, rgb: `rgb(${r}, ${g}, ${b})` });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[75vh]">
          
          {/* Sidebar / Info */}
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Color Picker
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Pick colors directly using the screen eyedropper or upload an image to sample exact HEX and RGB values.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-4">
              <div className="flex flex-col items-center justify-center pt-3 pb-3">
                <svg className="w-7 h-7 mb-1 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400">Upload Image to Sample</span>
                </p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {/* Direct Palette & Eyedropper Buttons */}
            <div className="flex gap-2 mb-6">
              <label className="flex-1 py-2.5 px-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 flex items-center justify-center gap-2 cursor-pointer hover:border-indigo-500 transition-colors shadow-sm">
                <input 
                  type="color" 
                  value={selectedColor?.hex || '#4F46E5'} 
                  onChange={handlePalettePick}
                  className="w-5 h-5 rounded cursor-pointer border-0 p-0" 
                />
                <span>Color Palette</span>
              </label>

              {typeof window !== 'undefined' && 'EyeDropper' in window && (
                <button
                  type="button"
                  onClick={handleNativeEyeDropper}
                  className="flex-1 py-2.5 px-3 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors shadow-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  </svg>
                  <span>Pick Screen Color</span>
                </button>
              )}
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-medium">{error}</div>}

            <div className="flex-1 space-y-4">
              {/* Selected Color Display */}
              <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl shadow-sm relative overflow-hidden">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2 block">Selected Color</span>
                
                {selectedColor ? (
                  <>
                    <div className="flex items-center space-x-4 mb-4">
                      <div 
                        className="w-16 h-16 rounded-xl border-2 border-gray-200 dark:border-gray-600 shadow-inner"
                        style={{ backgroundColor: selectedColor.hex }}
                      />
                      <div className="flex-1">
                        <div className="text-xl font-mono font-bold text-gray-800 dark:text-white">{selectedColor.hex}</div>
                        <div className="text-xs font-mono text-gray-500 dark:text-gray-400">{selectedColor.rgb}</div>
                      </div>
                    </div>
                    
                    <button 
                      type="button"
                      onClick={() => handleCopy(selectedColor.hex)}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center space-x-2 shadow"
                    >
                      {copied ? <span>Copied HEX!</span> : <span>Copy HEX Code</span>}
                    </button>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-24 text-gray-400 dark:text-gray-500 text-sm text-center">
                    Click on the image or use palette<br/>to select a color
                  </div>
                )}
              </div>
              
              {/* Hover Color Preview */}
              {hoverColor && (
                <div className="p-3 bg-gray-100 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center space-x-3">
                  <div 
                    className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600"
                    style={{ backgroundColor: hoverColor.hex }}
                  />
                  <div>
                    <div className="text-xs font-mono font-bold text-gray-700 dark:text-gray-300">{hoverColor.hex}</div>
                    <div className="text-[10px] font-mono text-gray-500">{hoverColor.rgb}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Output Area (Image Canvas) */}
          <div className="flex-1 p-8 bg-gray-200 dark:bg-gray-900 flex flex-col items-center justify-center relative overflow-hidden">
            {imgSrc ? (
              <div className="relative max-w-full max-h-full overflow-auto bg-white dark:bg-gray-800 shadow-2xl rounded-xl border border-gray-300 dark:border-gray-700 p-2 custom-scrollbar">
                <canvas 
                  ref={canvasRef}
                  className="cursor-crosshair max-w-full h-auto object-contain block"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                />
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-gray-50 dark:bg-gray-800/20">
                <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-gray-700 dark:text-gray-300 font-bold text-lg">Interactive Canvas</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 max-w-sm">
                  Upload any image or screenshot to extract colors with pixel precision.
                </p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
