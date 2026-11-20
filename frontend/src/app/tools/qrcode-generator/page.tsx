'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function QrCodeGeneratorPage() {
  const [value, setValue] = useState('https://example.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);

  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `qrcode_${Date.now()}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Custom QR Code Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Generate customizable QR codes for links, text, or contacts and download them instantly.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-12">
            
            {/* Controls */}
            <div className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content (URL or Text)
                </label>
                <textarea
                  className="w-full h-32 p-4 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-sm focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-gray-800 dark:text-gray-100 resize-none text-sm"
                  placeholder="Enter URL or text here..."
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    QR Color (Foreground)
                  </label>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="color" 
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{fgColor}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Color
                  </label>
                  <div className="flex items-center space-x-3">
                    <input 
                      type="color" 
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <span className="font-mono text-sm text-gray-500 dark:text-gray-400">{bgColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Size: {size}px</label>
                </div>
                <input 
                  type="range" 
                  min="128" 
                  max="1024" 
                  step="8"
                  value={size} 
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                />
              </div>
            </div>

            {/* Preview & Download */}
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-700 p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-600">
              <div 
                ref={qrRef} 
                className="bg-white p-4 rounded-xl shadow-inner mb-8"
                style={{ backgroundColor: bgColor }}
              >
                <QRCodeSVG 
                  value={value || ' '}
                  size={size > 300 ? 300 : size} // Render max 300px in preview, scale when downloading
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level="Q"
                  includeMargin={false}
                />
              </div>

              <button 
                onClick={downloadQR}
                disabled={!value}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-[1.02]"
              >
                Download PNG
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
