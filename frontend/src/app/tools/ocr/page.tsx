'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';

export default function OcrPage() {
  const [image, setImage] = useState<string | null>(null);
  const [text, setText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<string>('eng'); // Switched back to English for CAD images
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setText('');
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  // Helper function to compress large images for the free API (1MB limit)
  const compressImage = (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      // Rough estimation: base64 size in bytes is approx length * 0.75
      const sizeKB = (dataUrl.length * 0.75) / 1024;
      if (sizeKB <= 1000) { // If under ~1MB, return as is
        resolve(dataUrl);
        return;
      }
      
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Scale down to max 2000px on the longest side
        const maxDim = 2000;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = "white"; // ensure solid background
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to JPEG with 0.7 quality to reduce size significantly
            const newDataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(newDataUrl);
        } else {
            resolve(dataUrl);
        }
      };
      img.src = dataUrl;
    });
  };

  const extractText = async () => {
    if (!image) return;
    
    setIsProcessing(true);
    setError(null);
    setText('');
    
    try {
      // Compress the image before sending if it's too large
      const processedImage = await compressImage(image);

      const apiKey = 'helloworld'; 
      
      const formData = new FormData();
      formData.append('base64Image', processedImage);
      formData.append('language', language);
      formData.append('apikey', apiKey);
      
      // Engine 1 is standard, Engine 2 is LSTM. Engine 3 is required for Urdu support.
      formData.append('OCREngine', language === 'urd' ? '3' : '2'); 

      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
         throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.IsErroredOnProcessing) {
        throw new Error(data.ErrorMessage?.[0] || 'Unknown error occurred during processing.');
      }
      
      if (data.ParsedResults && data.ParsedResults.length > 0) {
        setText(data.ParsedResults[0].ParsedText);
      } else {
        setText('No text could be found in the image.');
      }
      
    } catch (err: any) {
      console.error(err);
      if (err.message === 'Failed to fetch') {
         setError('Network error (Failed to fetch). The image might be too large, or an Adblocker/Extension is blocking the OCR API request. Please disable extensions and try again.');
      } else {
         setError(err.message || 'An error occurred. Please try a different image.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      alert('Text copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-indigo-50/50 dark:bg-indigo-900/10 relative">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Image to Text (OCR)</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Extract English, Urdu, and Arabic text from images securely using Cloud AI.
            </p>
            <span className="absolute top-8 right-8 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs font-bold px-2 py-1 rounded">API Integration</span>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Image Upload & Controls */}
              <div className="flex flex-col space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Select Language
                  </label>
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    disabled={isProcessing}
                    suppressHydrationWarning
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow"
                  >
                    <option suppressHydrationWarning value="eng">English</option>
                    <option suppressHydrationWarning value="urd">Urdu (اردو)</option>
                    <option suppressHydrationWarning value="ara">Arabic (العربية)</option>
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Image
                  </label>
                  {!image ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Click to select an image</span>
                      <span className="text-xs text-gray-400 mt-1">Large files are auto-compressed</span>
                    </div>
                  ) : (
                    <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden h-64 bg-black/5 group">
                      <img src={image} alt="Upload preview" className="w-full h-full object-contain" />
                      <button 
                        onClick={() => {setImage(null); setText('');}}
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

                <button
                  onClick={extractText}
                  disabled={!image || isProcessing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex justify-center items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Scanning via Cloud...</span>
                    </>
                  ) : (
                    <span>Extract Text</span>
                  )}
                </button>

              </div>

              {/* Right Column: Output */}
              <div className="flex flex-col h-full">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Extracted Text
                </label>
                <div className="relative flex-1 min-h-[300px]">
                  <textarea
                    value={text}
                    readOnly
                    placeholder="Extracted text will appear here..."
                    className="w-full h-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-gray-900 dark:text-white resize-none focus:ring-0 focus:outline-none"
                    dir={language === 'urd' || language === 'ara' ? 'rtl' : 'ltr'}
                  />
                  {text && (
                    <button 
                      onClick={copyToClipboard}
                      className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      <span>Copy</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
