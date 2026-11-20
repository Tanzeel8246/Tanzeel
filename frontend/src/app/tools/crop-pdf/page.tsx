'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
import { Crop, FileText, Check, AlertCircle, Scissors } from 'lucide-react';

export default function CropPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  
  // Margins in points (1 pt = 1/72 inch)
  const [marginTop, setMarginTop] = useState<number>(30);
  const [marginBottom, setMarginBottom] = useState<number>(30);
  const [marginLeft, setMarginLeft] = useState<number>(30);
  const [marginRight, setMarginRight] = useState<number>(30);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setError(null);
      setSuccess(false);
    }
  };

  const applyPreset = (margin: number) => {
    setMarginTop(margin);
    setMarginBottom(margin);
    setMarginLeft(margin);
    setMarginRight(margin);
  };

  const handleCrop = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      pages.forEach(page => {
        const { width, height } = page.getSize();
        
        // Define new crop box (pdf-lib coordinate system originates at bottom-left)
        const x = marginLeft;
        const y = marginBottom;
        const newWidth = width - marginLeft - marginRight;
        const newHeight = height - marginTop - marginBottom;

        if (newWidth <= 0 || newHeight <= 0) {
          throw new Error('Specified margins are larger than page dimensions.');
        }

        page.setCropBox(x, y, newWidth, newHeight);
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `cropped_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to crop PDF. Ensure margins are valid.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulated visual scaling for preview page (standard A4 ratio 1:1.414)
  const maxSimWidth = 200;
  const maxSimHeight = 280;
  const simMarginTop = Math.min(60, Math.max(0, marginTop * 0.4));
  const simMarginBottom = Math.min(60, Math.max(0, marginBottom * 0.4));
  const simMarginLeft = Math.min(50, Math.max(0, marginLeft * 0.4));
  const simMarginRight = Math.min(50, Math.max(0, marginRight * 0.4));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Crop PDF Margins
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Trim whitespace, header annotations, or print bleeds with interactive visual margins.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            <div className="max-w-4xl mx-auto">
              {/* File Input */}
              <div className="mb-8">
                {!file ? (
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700/50 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors shadow-sm">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Crop className="w-10 h-10 mb-2 text-indigo-500" />
                      <p className="text-base font-bold text-gray-700 dark:text-gray-200">
                        Select PDF Document to Crop
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Processed securely in your browser</p>
                    </div>
                    <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                  </label>
                ) : (
                  <div className="p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3 truncate">
                      <FileText className="text-indigo-500 shrink-0" size={24} />
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => { setFile(null); setSuccess(false); }} 
                      className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Controls and Live Visual Simulator */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-start">
                {/* Numeric Margin Inputs */}
                <div className="md:col-span-7 bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Margin Adjustments (Points)
                    </h3>
                    <span className="text-[11px] text-gray-400">72 points = 1 inch</span>
                  </div>

                  {/* Presets */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => applyPreset(15)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                    >
                      Minimal (15pt)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(30)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                    >
                      Standard (30pt)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(50)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                    >
                      Wide (50pt)
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset(0)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 dark:bg-gray-600 hover:bg-red-50 hover:text-red-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200"
                    >
                      Zero (0pt)
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="margin-top" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1.5">Top Margin</label>
                      <input 
                        id="margin-top"
                        type="number" 
                        min="0" 
                        max="200"
                        value={marginTop} 
                        onChange={(e) => setMarginTop(Math.max(0, parseInt(e.target.value) || 0))} 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
                      />
                    </div>
                    <div>
                      <label htmlFor="margin-bottom" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1.5">Bottom Margin</label>
                      <input 
                        id="margin-bottom"
                        type="number" 
                        min="0" 
                        max="200"
                        value={marginBottom} 
                        onChange={(e) => setMarginBottom(Math.max(0, parseInt(e.target.value) || 0))} 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
                      />
                    </div>
                    <div>
                      <label htmlFor="margin-left" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1.5">Left Margin</label>
                      <input 
                        id="margin-left"
                        type="number" 
                        min="0" 
                        max="200"
                        value={marginLeft} 
                        onChange={(e) => setMarginLeft(Math.max(0, parseInt(e.target.value) || 0))} 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
                      />
                    </div>
                    <div>
                      <label htmlFor="margin-right" className="block text-xs font-bold text-gray-600 dark:text-gray-300 uppercase mb-1.5">Right Margin</label>
                      <input 
                        id="margin-right"
                        type="number" 
                        min="0" 
                        max="200"
                        value={marginRight} 
                        onChange={(e) => setMarginRight(Math.max(0, parseInt(e.target.value) || 0))} 
                        className="w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm" 
                      />
                    </div>
                  </div>
                </div>

                {/* Live Visual Sheet Simulator */}
                <div className="md:col-span-5 bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600 shadow-sm flex flex-col items-center">
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    <Scissors size={14} className="text-indigo-500" /> Real-time Crop Preview
                  </span>

                  <div 
                    className="relative bg-gray-100 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded shadow-md overflow-hidden flex items-center justify-center"
                    style={{ width: `${maxSimWidth}px`, height: `${maxSimHeight}px` }}
                  >
                    {/* Active cropped content area */}
                    <div 
                      className="absolute bg-white dark:bg-gray-900 border-2 border-dashed border-indigo-500 transition-all duration-150 flex flex-col items-center justify-center p-2 text-center"
                      style={{
                        top: `${simMarginTop}px`,
                        bottom: `${simMarginBottom}px`,
                        left: `${simMarginLeft}px`,
                        right: `${simMarginRight}px`,
                      }}
                    >
                      <FileText className="text-indigo-400 opacity-60 mb-1" size={24} />
                      <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        Preserved Area
                      </span>
                    </div>

                    {/* Shaded margin indicators */}
                    <div className="absolute top-1 left-2 text-[9px] font-mono text-gray-400">{marginTop}pt</div>
                    <div className="absolute bottom-1 right-2 text-[9px] font-mono text-gray-400">{marginBottom}pt</div>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-3 text-center">
                    Gray perimeter indicates trimmed margin regions.
                  </p>
                </div>
              </div>

              {/* Error & Success Alerts */}
              {error && (
                <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-sm flex items-center gap-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium text-sm flex items-center gap-2">
                  <Check size={18} className="shrink-0" />
                  <span>PDF cropped successfully! Your cropped document is downloaded.</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleCrop}
                disabled={!file || isProcessing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                {isProcessing ? 'Cropping Margins...' : 'Crop Margins & Download'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
