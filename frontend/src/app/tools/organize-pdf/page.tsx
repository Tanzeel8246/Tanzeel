'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
import { ArrowLeft, ArrowRight, Trash2, Copy, FileText, Check, AlertCircle } from 'lucide-react';

export default function OrganizePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pagesList, setPagesList] = useState<number[]>([]);
  const [pageOrder, setPageOrder] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState<number>(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      setSuccess(false);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const count = pdfDoc.getPageCount();
        setTotalPages(count);
        
        const initialPages = Array.from({ length: count }, (_, i) => i + 1);
        setPagesList(initialPages);
        setPageOrder(initialPages.join(', '));
      } catch (err) {
        setError('Invalid PDF file. Cannot read page structure.');
        setTotalPages(0);
        setPagesList([]);
        setPageOrder('');
      }
    }
  };

  const handleManualOrderChange = (val: string) => {
    setPageOrder(val);
    const parsed = val.split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= totalPages);
    if (parsed.length > 0) {
      setPagesList(parsed);
    }
  };

  const movePage = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= pagesList.length) return;

    const updated = [...pagesList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setPagesList(updated);
    setPageOrder(updated.join(', '));
  };

  const removePage = (index: number) => {
    if (pagesList.length <= 1) {
      setError('A PDF document must have at least one page.');
      return;
    }
    const updated = pagesList.filter((_, i) => i !== index);
    setPagesList(updated);
    setPageOrder(updated.join(', '));
  };

  const duplicatePage = (index: number) => {
    const updated = [...pagesList];
    updated.splice(index + 1, 0, pagesList[index]);
    setPagesList(updated);
    setPageOrder(updated.join(', '));
  };

  const resetOrder = () => {
    if (totalPages > 0) {
      const initialPages = Array.from({ length: totalPages }, (_, i) => i + 1);
      setPagesList(initialPages);
      setPageOrder(initialPages.join(', '));
      setError(null);
    }
  };

  const handleOrganize = async () => {
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }

    if (pagesList.length === 0) {
      setError('Please specify at least one page.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdfDoc = await PDFDocument.load(arrayBuffer);
      const total = sourcePdfDoc.getPageCount();

      // Zero-indexed mapping for pdf-lib
      const newOrderIndices = pagesList.map(p => p - 1);

      // Validate bounds
      for (const idx of newOrderIndices) {
        if (idx < 0 || idx >= total) {
          throw new Error(`Page number out of bounds (1-${total}).`);
        }
      }

      // Create new PDF document
      const newPdfDoc = await PDFDocument.create();
      const copiedPages = await newPdfDoc.copyPages(sourcePdfDoc, newOrderIndices);
      copiedPages.forEach(page => newPdfDoc.addPage(page));

      // Save and download
      const pdfBytes = await newPdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `organized_${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to reorganize pages.');
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

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Organize & Reorder PDF Pages
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Visually rearrange, move, delete, or duplicate pages in your PDF document with one-click page cards.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {!file ? (
              <div className="max-w-xl mx-auto">
                <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700/50 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors shadow-sm">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FileText className="w-12 h-12 mb-3 text-indigo-500" />
                    <p className="mb-2 text-base font-bold text-gray-700 dark:text-gray-200">
                      Click to choose PDF or drag & drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">PDF documents only</p>
                  </div>
                  <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                </label>
              </div>
            ) : (
              <div className="space-y-8">
                {/* File Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-600 gap-4 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/50 rounded-xl text-indigo-600 dark:text-indigo-400">
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-xs sm:max-w-md">{file.name}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{totalPages} total pages detected</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={resetOrder}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-200"
                    >
                      Reset Order
                    </button>
                    <button 
                      type="button"
                      onClick={() => { setFile(null); setTotalPages(0); setPagesList([]); setPageOrder(''); setSuccess(false); }}
                      className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100"
                    >
                      Change File
                    </button>
                  </div>
                </div>

                {/* Visual Page Cards Grid */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                      Visual Page Sequence ({pagesList.length} Pages)
                    </h2>
                    <span className="text-xs text-gray-400">Use arrow buttons to shift positions</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {pagesList.map((pageNum, idx) => (
                      <div 
                        key={`${pageNum}-${idx}`}
                        className="bg-white dark:bg-gray-700 border-2 border-indigo-100 dark:border-gray-600 rounded-2xl p-3 flex flex-col items-center justify-between shadow-sm hover:shadow-md transition-shadow relative group"
                      >
                        {/* Position Indicator Badge */}
                        <div className="w-full flex justify-between items-center mb-2">
                          <span className="text-[10px] font-mono text-gray-400">#{idx + 1}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300">
                            Page {pageNum}
                          </span>
                        </div>

                        {/* Page Preview Thumbnail Placeholder */}
                        <div className="w-full h-24 bg-gray-50 dark:bg-gray-800/80 rounded-xl border border-gray-100 dark:border-gray-600 flex flex-col items-center justify-center mb-3">
                          <FileText size={28} className="text-indigo-400 mb-1" />
                          <span className="text-[10px] font-semibold text-gray-500">Page {pageNum}</span>
                        </div>

                        {/* Interactive Page Controls */}
                        <div className="flex items-center justify-between w-full pt-1 border-t border-gray-100 dark:border-gray-600/50">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => movePage(idx, 'left')}
                            className="p-1 rounded text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-500"
                            title="Move Left"
                          >
                            <ArrowLeft size={14} />
                          </button>
                          
                          <button
                            type="button"
                            onClick={() => duplicatePage(idx)}
                            className="p-1 rounded text-gray-500 hover:text-indigo-600"
                            title="Duplicate Page"
                          >
                            <Copy size={13} />
                          </button>

                          <button
                            type="button"
                            onClick={() => removePage(idx)}
                            className="p-1 rounded text-gray-500 hover:text-red-500"
                            title="Delete Page"
                          >
                            <Trash2 size={13} />
                          </button>

                          <button
                            type="button"
                            disabled={idx === pagesList.length - 1}
                            onClick={() => movePage(idx, 'right')}
                            className="p-1 rounded text-gray-500 hover:text-indigo-600 disabled:opacity-30 disabled:hover:text-gray-500"
                            title="Move Right"
                          >
                            <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comma-Separated Manual Order Sync */}
                <div className="bg-white dark:bg-gray-700 p-6 rounded-2xl border border-gray-200 dark:border-gray-600">
                  <label htmlFor="manual-order" className="block text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Custom Order String (Auto-synced)
                  </label>
                  <input 
                    id="manual-order"
                    type="text" 
                    value={pageOrder} 
                    onChange={(e) => handleManualOrderChange(e.target.value)}
                    placeholder="e.g. 3, 1, 2"
                    className="w-full p-3.5 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-gray-100 font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    You can also type custom page sequences, reverse pages (e.g. 4, 3, 2, 1), or repeat pages.
                  </p>
                </div>

                {error && (
                  <div className="p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-sm flex items-center gap-2">
                    <AlertCircle size={18} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div className="p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium text-sm flex items-center gap-2">
                    <Check size={18} className="shrink-0" />
                    <span>PDF reorganized successfully! Your newly sequenced PDF has been downloaded.</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleOrganize}
                  disabled={pagesList.length === 0 || isProcessing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center space-x-2"
                >
                  {isProcessing ? 'Generating Organized PDF...' : 'Download Reordered PDF'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
