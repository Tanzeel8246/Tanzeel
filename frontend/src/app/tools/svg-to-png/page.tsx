'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function SvgToPngPage() {
  const [file, setFile] = useState<File | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [scale, setScale] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [isRendering, setIsRendering] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      const isSvgName = selectedFile.name.toLowerCase().endsWith('.svg');
      const isSvgType = selectedFile.type === 'image/svg+xml' || selectedFile.type === 'text/xml';

      if (!isSvgName && !isSvgType) {
        setError('Please select a valid SVG file (.svg).');
        return;
      }

      setFile(selectedFile);
      setError(null);
      setPreviewSrc('');
      setIsRendering(true);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setSvgContent(text);
        renderSvg(text, scale);
      };
      reader.onerror = () => {
        setError('Failed to read the SVG file.');
        setIsRendering(false);
      };
      reader.readAsText(selectedFile);
    }
  };

  const renderSvg = (svgString: string, currentScale: number) => {
    if (!svgString) {
      setIsRendering(false);
      return;
    }

    try {
      // 1. Parse SVG XML to extract exact dimensions or viewBox coordinates
      const parser = new DOMParser();
      const doc = parser.parseFromString(svgString, 'image/svg+xml');
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        throw new Error('Invalid SVG XML format.');
      }

      const svgEl = doc.querySelector('svg');
      if (!svgEl) {
        throw new Error('No <svg> root element found.');
      }

      let baseWidth = parseFloat(svgEl.getAttribute('width') || '0');
      let baseHeight = parseFloat(svgEl.getAttribute('height') || '0');

      // If width/height attributes are missing or invalid, extract from viewBox
      if (!baseWidth || !baseHeight || isNaN(baseWidth) || isNaN(baseHeight)) {
        const viewBox = svgEl.getAttribute('viewBox');
        if (viewBox) {
          const parts = viewBox.trim().split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            baseWidth = parts[2];
            baseHeight = parts[3];
          }
        }
      }

      // Default fallback if neither dimensions nor viewBox exist
      if (!baseWidth || baseWidth <= 0) baseWidth = 800;
      if (!baseHeight || baseHeight <= 0) baseHeight = 800;

      // Always inject explicit width and height into the SVG element so browser rasterizer never outputs 0x0
      svgEl.setAttribute('width', baseWidth.toString());
      svgEl.setAttribute('height', baseHeight.toString());
      const normalizedSvg = new XMLSerializer().serializeToString(doc);

      // 2. Render to Image
      const svgBlob = new Blob([normalizedSvg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      const img = new window.Image();
      img.onload = () => {
        try {
          // 3. Render offscreen in memory without depending on React DOM ref timing
          const canvas = document.createElement('canvas');
          const finalWidth = Math.round(baseWidth * currentScale);
          const finalHeight = Math.round(baseHeight * currentScale);

          canvas.width = finalWidth;
          canvas.height = finalHeight;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas 2D context not available.');
          }

          ctx.clearRect(0, 0, finalWidth, finalHeight);
          ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

          const pngUrl = canvas.toDataURL('image/png');
          setPreviewSrc(pngUrl);
          setError(null);
        } catch (err: any) {
          setError(err.message || 'Error converting SVG to PNG.');
        } finally {
          URL.revokeObjectURL(url);
          setIsRendering(false);
        }
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        setIsRendering(false);
        setError('Failed to rasterize SVG. Please verify the vector contents.');
      };

      img.src = url;
    } catch (err: any) {
      console.error('SVG conversion error:', err);
      setError(err.message || 'Invalid SVG content.');
      setIsRendering(false);
    }
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newScale = parseFloat(e.target.value);
    setScale(newScale);
    if (svgContent) {
      setIsRendering(true);
      renderSvg(svgContent, newScale);
    }
  };

  const handleDownload = () => {
    if (!previewSrc || !file) return;

    const a = document.createElement('a');
    a.href = previewSrc;
    const baseName = file.name.replace(/\.svg$/i, '') || 'converted';
    a.download = `${baseName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
              SVG to PNG Converter
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Convert vector graphics (SVG) into raster images (PNG) with adjustable resolution and crisp rendering.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            <div className="w-full max-w-2xl">
              {/* Controls */}
              <div className="flex flex-col md:flex-row gap-6 mb-8 items-end p-6 bg-white dark:bg-gray-700 rounded-xl shadow-sm border border-gray-200 dark:border-gray-600">
                <div className="flex-1 w-full">
                  <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    1. Select SVG File
                  </label>
                  <input 
                    type="file" 
                    accept=".svg,image/svg+xml" 
                    onChange={handleFileChange} 
                    className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 dark:file:bg-indigo-900/30 dark:file:text-indigo-400 cursor-pointer" 
                  />
                </div>

                <div className="w-full md:w-48">
                  <label className="block mb-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    2. Quality / Scale
                  </label>
                  <select 
                    value={scale} 
                    onChange={handleScaleChange}
                    className="w-full p-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg outline-none text-gray-800 dark:text-gray-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value={1}>1x (Original Size)</option>
                    <option value={2}>2x (High Quality)</option>
                    <option value={4}>4x (Ultra HD)</option>
                    <option value={8}>8x (Massive)</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Output Area */}
              {isRendering ? (
                <div className="w-full h-64 border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-gray-800">
                  <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">Rasterizing SVG into high-resolution PNG...</p>
                </div>
              ) : previewSrc ? (
                <div className="flex flex-col items-center">
                  <div className="w-full bg-gray-200 dark:bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-300 dark:border-gray-600 p-8 flex items-center justify-center min-h-[300px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={previewSrc} alt="PNG Preview" className="max-w-full h-auto drop-shadow-md rounded" style={{ maxHeight: '500px' }} />
                  </div>

                  <button
                    onClick={handleDownload}
                    className="mt-8 w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                    </svg>
                    <span>Download PNG</span>
                  </button>
                </div>
              ) : (
                <div className="w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center bg-white dark:bg-gray-800">
                  <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-gray-400 dark:text-gray-500 font-medium">Upload an SVG file to see the PNG preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
