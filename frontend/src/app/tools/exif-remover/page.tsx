'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function ExifRemoverPage() {
  const [image, setImage] = useState<{ url: string; file: File } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    const url = URL.createObjectURL(file);
    setImage({ url, file });
    setError(null);
    setSuccess(false);
  };

  const removeMetadata = () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    
    // Natively stripping EXIF by drawing to canvas and exporting
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        
        // Use the original image's format if it's JPEG or WebP, otherwise fallback to PNG
        const mimeType = image.file.type === 'image/jpeg' || image.file.type === 'image/webp' ? image.file.type : 'image/png';
        const quality = 0.85; // Standard optimal compression to prevent ballooning file size 
        
        canvas.toBlob((blob) => {
          if (blob) {
            const safeUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = safeUrl;
            
            // Keep original name but add suffix
            const extension = mimeType === 'image/jpeg' ? '.jpg' : mimeType === 'image/webp' ? '.webp' : '.png';
            const nameWithoutExt = image.file.name.substring(0, image.file.name.lastIndexOf('.')) || 'image';
            a.download = `${nameWithoutExt}_clean${extension}`;
            
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(safeUrl);
            
            setSuccess(true);
          } else {
            setError('Failed to process the image.');
          }
          setIsProcessing(false);
        }, mimeType, quality);
      } else {
        setError('Failed to initialize canvas context.');
        setIsProcessing(false);
      }
    };
    img.onerror = () => {
      setError('Failed to load image for processing.');
      setIsProcessing(false);
    };
    img.src = image.url;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-indigo-50/50 dark:bg-indigo-900/10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">EXIF & Metadata Remover</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Strip hidden data (GPS location, camera details, dates) from your photos to protect your privacy before sharing. 100% offline.
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Image Upload & Controls */}
              <div className="flex flex-col space-y-6">
                
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Photo
                  </label>
                  {!image ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Click to select an image</span>
                    </div>
                  ) : (
                    <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden h-64 bg-black/5 group">
                      <img src={image.url} alt="Upload preview" className="w-full h-full object-contain" />
                      <button 
                        onClick={() => {setImage(null); setSuccess(false);}}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-xl text-sm font-medium flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    Metadata removed successfully!
                  </div>
                )}

                <button
                  onClick={removeMetadata}
                  disabled={!image || isProcessing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex justify-center items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Clean Image & Download</span>
                  )}
                </button>
              </div>

              {/* Right Column: Info Area */}
              <div className="flex flex-col h-full">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-800 flex-1">
                  <h3 className="text-lg font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Why remove metadata?
                  </h3>
                  <div className="space-y-4 text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                    <p>
                      Every time you take a photo with a smartphone or digital camera, hidden information called <strong>EXIF data</strong> is embedded in the file.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>GPS Location:</strong> Exact latitude and longitude where the photo was taken.</li>
                      <li><strong>Device Details:</strong> Phone model, OS version, and camera settings.</li>
                      <li><strong>Timestamps:</strong> Exact date and time the photo was captured.</li>
                    </ul>
                    <p className="mt-4 font-semibold">
                      This tool uses your browser's Canvas API to instantly wipe all EXIF data. Your photo never leaves your device.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
