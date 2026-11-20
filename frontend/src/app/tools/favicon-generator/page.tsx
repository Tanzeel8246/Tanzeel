'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import JSZip from 'jszip';

export default function FaviconGeneratorPage() {
  const [image, setImage] = useState<{ url: string; file: File } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG or JPG recommended).');
      return;
    }

    const url = URL.createObjectURL(file);
    setImage({ url, file });
    setError(null);
  };

  const resizeImage = (img: HTMLImageElement, size: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Clear background for transparency
        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error(`Failed to generate ${size}x${size} image`));
          }
        }, 'image/png');
      } else {
        reject(new Error('Failed to get canvas context'));
      }
    });
  };

  const generateFavicons = async () => {
    if (!image) return;
    setIsProcessing(true);
    setError(null);
    
    try {
      const img = new window.Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = image.url;
      });

      const zip = new JSZip();
      
      // Generate different sizes
      const sizes = [
        { name: 'favicon-16x16.png', size: 16 },
        { name: 'favicon-32x32.png', size: 32 },
        { name: 'apple-touch-icon.png', size: 180 },
        { name: 'android-chrome-192x192.png', size: 192 },
        { name: 'android-chrome-512x512.png', size: 512 }
      ];

      for (const item of sizes) {
        const blob = await resizeImage(img, item.size);
        zip.file(item.name, blob);
      }

      // Generate a standard favicon.ico (just by renaming the 32x32 png, modern browsers support it)
      // Note: true ICO format is complex, but renaming a PNG to .ico works in 99% of modern scenarios.
      const icoBlob = await resizeImage(img, 32);
      zip.file('favicon.ico', icoBlob);

      // Generate web app manifest
      const manifest = {
        name: "My Awesome App",
        short_name: "App",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone"
      };
      
      zip.file('site.webmanifest', JSON.stringify(manifest, null, 2));

      // Generate HTML snippet instructions
      const htmlSnippet = `<!-- Copy and paste these tags into the <head> of your HTML -->
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
`;
      zip.file('instructions.html', htmlSnippet);

      // Generate ZIP and trigger download
      const content = await zip.generateAsync({ type: 'blob' });
      const safeUrl = URL.createObjectURL(content);
      
      const a = document.createElement('a');
      a.href = safeUrl;
      a.download = 'favicons.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(safeUrl);
      
    } catch (err: any) {
      console.error(err);
      setError('Failed to generate favicons. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const htmlCode = `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-indigo-50/50 dark:bg-indigo-900/10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Favicon Generator</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Upload your logo and instantly generate all required favicon sizes and HTML code for modern browsers.
            </p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Left Column: Image Upload */}
              <div className="flex flex-col space-y-6">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Upload Logo (Square Image Recommended)
                  </label>
                  {!image ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-64 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700/50 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 cursor-pointer transition-colors"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <span className="text-gray-500 dark:text-gray-400 font-medium">Click to select a logo</span>
                    </div>
                  ) : (
                    <div className="relative border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden h-64 bg-gray-100 dark:bg-gray-900 flex items-center justify-center group p-4">
                      <img src={image.url} alt="Upload preview" className="max-w-full max-h-full object-contain" />
                      <button 
                        onClick={() => setImage(null)}
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
                  onClick={generateFavicons}
                  disabled={!image || isProcessing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex justify-center items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating Zip...</span>
                    </>
                  ) : (
                    <span>Download Favicon Package (.zip)</span>
                  )}
                </button>
              </div>

              {/* Right Column: HTML Snippet & Info */}
              <div className="flex flex-col space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Included in Package:</h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                    <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <code>favicon.ico</code> (Legacy fallback)</li>
                    <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <code>favicon-32x32.png</code> (Standard desktop)</li>
                    <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <code>favicon-16x16.png</code> (Small desktop)</li>
                    <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <code>apple-touch-icon.png</code> (iOS Homescreen)</li>
                    <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <code>android-chrome-192/512.png</code> (Android)</li>
                    <li className="flex items-center"><svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> <code>site.webmanifest</code></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">HTML Code</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Copy this code into the <code>&lt;head&gt;</code> of your website.</p>
                  <div className="relative">
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-xs overflow-x-auto border border-gray-700">
                      <code>{htmlCode}</code>
                    </pre>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(htmlCode);
                        alert('HTML copied to clipboard!');
                      }}
                      className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors shadow"
                      title="Copy Code"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
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
