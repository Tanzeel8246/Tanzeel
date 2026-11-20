'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';

export default function ImageSplitterPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [rows, setRows] = useState<number>(3);
  const [cols, setCols] = useState<number>(3);
  
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (!selectedFile.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        setImgSrc(src);
        
        const img = new window.Image();
        img.onload = () => {
          imageRef.current = img;
        };
        img.src = src;
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const splitImage = async () => {
    if (!imageRef.current || !file) {
      setError('Please upload an image first.');
      return;
    }
    
    if (rows < 1 || cols < 1 || rows > 20 || cols > 20) {
      setError('Grid dimensions must be between 1 and 20.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const img = imageRef.current;
      const pieceWidth = Math.floor(img.naturalWidth / cols);
      const pieceHeight = Math.floor(img.naturalHeight / rows);
      
      const zip = new JSZip();
      const folderName = `split_${file.name.replace(/\.[^/.]+$/, "")}`;
      const imgFolder = zip.folder(folderName);
      
      // Determine output extension based on original file type
      const isPng = file.type === 'image/png';
      const outputType = isPng ? 'image/png' : 'image/jpeg';
      const extension = isPng ? 'png' : 'jpg';

      // We'll create a single canvas and reuse it to extract pieces
      const canvas = document.createElement('canvas');
      canvas.width = pieceWidth;
      canvas.height = pieceHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) throw new Error('Canvas 2D context is not supported.');

      // Need to keep track of promises for toBlob
      const blobPromises = [];

      let index = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          ctx.clearRect(0, 0, pieceWidth, pieceHeight);
          
          // Draw the specific chunk of the image onto the canvas
          ctx.drawImage(
            img,
            c * pieceWidth, r * pieceHeight, pieceWidth, pieceHeight, // Source Rect
            0, 0, pieceWidth, pieceHeight // Dest Rect
          );

          // Get blob and add to zip
          const blobPromise = new Promise<void>((resolve, reject) => {
            const fileName = `piece_${r + 1}x${c + 1}_${index}.${extension}`;
            canvas.toBlob((blob) => {
              if (blob) {
                imgFolder?.file(fileName, blob);
                resolve();
              } else {
                reject(new Error('Failed to generate image piece.'));
              }
            }, outputType, 0.95);
          });
          
          blobPromises.push(blobPromise);
          index++;
        }
      }

      await Promise.all(blobPromises);
      
      const content = await zip.generateAsync({ type: 'blob' });
      
      // Trigger Download
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}.zip`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to split image.');
    } finally {
      setIsProcessing(false);
    }
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
              Image Splitter (Grid Maker)
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Split your image into a perfect grid (e.g. 3x3 for Instagram) and download all pieces in a ZIP file.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-xl">
              {/* Controls */}
              <div className="flex flex-col gap-6 mb-8 p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="w-full">
                  <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">1. Select Image</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 cursor-pointer" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rows (Vertical)</label>
                     <input type="number" min="1" max="20" value={rows} onChange={e => setRows(Number(e.target.value) || 1)} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none font-bold" />
                  </div>
                  <div>
                     <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Columns (Horizontal)</label>
                     <input type="number" min="1" max="20" value={cols} onChange={e => setCols(Number(e.target.value) || 1)} className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none font-bold" />
                  </div>
                </div>
                
                <div className="text-center">
                   <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full">
                     Total Pieces: {rows * cols}
                   </span>
                </div>
              </div>

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              {success && <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium text-center">ZIP file created successfully! Check your downloads.</div>}
              
              {/* Preview Area */}
              {imgSrc ? (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-sm mx-auto overflow-hidden rounded-lg shadow-md border border-gray-300 dark:border-gray-600">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                     <img src={imgSrc} alt="Preview" className="w-full h-auto block" />
                     
                     {/* Overlay Grid */}
                     <div className="absolute inset-0 pointer-events-none grid" 
                          style={{ 
                            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` 
                          }}>
                       {Array.from({ length: rows * cols }).map((_, i) => (
                         <div key={i} className="border border-white/70 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.3)]"></div>
                       ))}
                     </div>
                  </div>

                  <button
                    onClick={splitImage}
                    disabled={isProcessing}
                    className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? 'Processing...' : `Split Image & Download ZIP`}
                  </button>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-gray-800">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <p className="text-gray-400 dark:text-gray-500 font-medium">Upload an image to see the grid preview</p>
                </div>
              )}
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
