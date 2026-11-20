'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function MemeGeneratorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  
  const [topText, setTopText] = useState('WHEN YOU WRITE');
  const [bottomText, setBottomText] = useState('CODE THAT WORKS ON FIRST TRY');
  const [fontSize, setFontSize] = useState(40);
  const [textColor, setTextColor] = useState('#ffffff');
  const [strokeColor, setStrokeColor] = useState('#000000');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

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
          imageRef.current = img;
          drawMeme(); 
        };
      };
      reader.readAsDataURL(selectedFile);
      setError(null);
    }
  };

  const drawMeme = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;
    
    if (!ctx) return;

    // Set canvas dimensions to image dimensions
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    // Draw background image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Text Style Setup
    // Use dynamic font size based on image width to keep it somewhat proportional
    // But allow user to scale it via `fontSize` state (treating it as a percentage of width)
    const calculatedFontSize = Math.floor(canvas.width * (fontSize / 400)); 
    
    ctx.font = `900 ${calculatedFontSize}px Impact, Arial Black, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = textColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = calculatedFontSize / 15; // Stroke width proportional to font size

    // Helper to draw text with word wrap
    const drawText = (text: string, x: number, y: number, maxWidth: number, isBottom: boolean) => {
      const words = text.toUpperCase().split(' ');
      let line = '';
      const lines = [];

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          lines.push(line);
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line);

      const lineHeight = calculatedFontSize * 1.2;
      
      // Adjust starting Y if bottom text to draw upwards
      let startY = y;
      if (isBottom) {
        startY = y - (lines.length - 1) * lineHeight;
      }

      for (let i = 0; i < lines.length; i++) {
        ctx.strokeText(lines[i].trim(), x, startY + (i * lineHeight));
        ctx.fillText(lines[i].trim(), x, startY + (i * lineHeight));
      }
    };

    const margin = canvas.width * 0.05;
    const maxWidth = canvas.width - (margin * 2);
    
    // Draw Top Text
    if (topText) {
      drawText(topText, canvas.width / 2, margin + calculatedFontSize, maxWidth, false);
    }
    
    // Draw Bottom Text
    if (bottomText) {
      drawText(bottomText, canvas.width / 2, canvas.height - margin - (calculatedFontSize * 0.2), maxWidth, true);
    }
  };

  useEffect(() => {
    drawMeme();
  }, [topText, bottomText, fontSize, textColor, strokeColor]);

  const handleDownload = () => {
    if (!canvasRef.current || !file) return;
    
    const canvas = canvasRef.current;
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `meme_${file.name}`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(url), 100);
      }
    }, 'image/jpeg', 0.95);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[75vh]">
          
          {/* Sidebar / Controls */}
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col h-[75vh] overflow-y-auto">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Meme Generator
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Create classic memes instantly by adding top and bottom text to your images.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-6">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="mb-1 text-xs text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Upload Image</span></p>
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>

            {imgSrc && (
              <div className="space-y-4 flex-1">
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Top Text</label>
                  <textarea 
                    value={topText} 
                    onChange={(e) => setTopText(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 resize-none uppercase font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Bottom Text</label>
                  <textarea 
                    value={bottomText} 
                    onChange={(e) => setBottomText(e.target.value)}
                    rows={2}
                    className="w-full p-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 resize-none uppercase font-bold"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">Text Size</label>
                  </div>
                  <input type="range" min="10" max="100" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Text Color</label>
                    <input 
                      type="color" 
                      value={textColor} 
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1 uppercase">Border (Stroke)</label>
                    <input 
                      type="color" 
                      value={strokeColor} 
                      onChange={(e) => setStrokeColor(e.target.value)}
                      className="w-full h-10 p-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  onClick={handleDownload}
                  className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                  <span>Download Meme</span>
                </button>
              </div>
            )}
            
            {error && <div className="mt-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl text-sm font-medium">{error}</div>}
          </div>

          {/* Main Output Area (Preview) */}
          <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center h-[75vh]">
            {imgSrc ? (
              <div className="w-full h-full flex flex-col items-center justify-center relative bg-black rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 p-2 shadow-2xl">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full object-contain drop-shadow-md"
                />
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/20 text-center p-6">
                <svg className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                <p className="text-gray-400 dark:text-gray-500 font-medium text-lg">Meme Preview</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2 max-w-xs">Upload an image on the left to start generating your meme.</p>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
