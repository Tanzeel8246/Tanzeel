'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function CropImagePage() {
  const [imgSrc, setImgSrc] = useState('');
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [scale, setScale] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  
  const [error, setError] = useState<string | null>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        setImgSrc(reader.result?.toString() || ''),
      );
      reader.readAsDataURL(e.target.files[0]);
      setError(null);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (aspect) {
      const { width, height } = e.currentTarget;
      setCrop(centerAspectCrop(width, height, aspect));
    }
  };

  const handleToggleAspectClick = () => {
    if (aspect) {
      setAspect(undefined);
      setCrop(undefined);
    } else {
      setAspect(1);
      if (imgRef.current) {
        const { width, height } = imgRef.current;
        setCrop(centerAspectCrop(width, height, 1));
      }
    }
  };

  const handleDownloadCrop = async () => {
    if (!completedCrop || !imgRef.current) {
      setError('Please select an area to crop first.');
      return;
    }
    
    setError(null);
    
    const image = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      setError('No 2d context');
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    
    canvas.width = completedCrop.width * scaleX;
    canvas.height = completedCrop.height * scaleY;
    
    ctx.imageSmoothingQuality = 'high';
    
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (!blob) {
        setError('Canvas is empty');
        return;
      }
      const previewUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = 'cropped_image.jpg';
      a.click();
      setTimeout(() => URL.revokeObjectURL(previewUrl), 100);
    }, 'image/jpeg');
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
              Crop Image
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Trim and frame your images perfectly. Processed entirely in your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full">
              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center items-center p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">1. Select Image</label>
                  <input type="file" accept="image/*" onChange={onSelectFile} className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 cursor-pointer" />
                </div>
                
                {imgSrc && (
                  <div className="flex flex-col items-center space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">2. Options</label>
                    <button 
                      onClick={handleToggleAspectClick}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold rounded-lg border border-gray-300 dark:border-gray-500 hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                    >
                      {aspect ? 'Turn OFF Square Aspect (1:1)' : 'Turn ON Square Aspect (1:1)'}
                    </button>
                  </div>
                )}
                
                {imgSrc && (
                  <div className="flex flex-col items-center space-y-2">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">3. Scale</label>
                    <input 
                      type="range" 
                      min="0.5" max="3" step="0.1" 
                      value={scale} 
                      onChange={(e) => setScale(Number(e.target.value))}
                      className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600"
                    />
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              
              {/* Crop Area */}
              {imgSrc ? (
                <div className="flex flex-col items-center">
                  <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-900 relative">
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspect}
                    >
                      <img
                        ref={imgRef}
                        alt="Crop me"
                        src={imgSrc}
                        style={{ transform: `scale(${scale})`, transformOrigin: 'top left', maxWidth: '100%', maxHeight: '60vh' }}
                        onLoad={onImageLoad}
                      />
                    </ReactCrop>
                  </div>

                  <button
                    onClick={handleDownloadCrop}
                    className="mt-8 px-12 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    <span>Crop & Download Image</span>
                  </button>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex items-center justify-center bg-white dark:bg-gray-800">
                  <p className="text-gray-400 dark:text-gray-500 font-medium">Please select an image above to start cropping</p>
                </div>
              )}
              
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
