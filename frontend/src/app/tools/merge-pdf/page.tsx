'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
import { CheckCircle2, Download, RefreshCw, FileText, ArrowRight, ShieldCheck, Zap, Lock, HelpCircle } from 'lucide-react';

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [mergedResult, setMergedResult] = useState<{ url: string; fileName: string; size: string; pageCount: number } | null>(null);

  const handleMultiUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (newFiles.length !== e.target.files.length) {
      setError('Some non-PDF files were automatically excluded.');
    } else {
      setError(null);
    }
    
    setFiles(prev => [...prev, ...newFiles]);
    setMergedResult(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setProgress('Initializing PDF engine...');
    
    try {
      const mergedPdf = await PDFDocument.create();
      let totalPages = 0;
      
      for (let i = 0; i < files.length; i++) {
        setProgress(`Merging document ${i + 1} of ${files.length} (${files[i].name})...`);
        const file = files[i];
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
          totalPages++;
        });
      }
      
      setProgress('Generating optimized PDF...');
      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const fileName = `merged_${Date.now()}.pdf`;
      const sizeStr = (blob.size / 1024).toFixed(1) + ' KB';
      
      setMergedResult({
        url,
        fileName,
        size: sizeStr,
        pageCount: totalPages,
      });

      // Auto-trigger download once for convenience
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setProgress('');
    } catch (err: any) {
      setError(err.message || 'Error merging PDFs. One or more files might be password-protected or corrupted.');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (mergedResult?.url) {
      URL.revokeObjectURL(mergedResult.url);
    }
    setFiles([]);
    setMergedResult(null);
    setError(null);
    setProgress('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>

        {/* Tool Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
            Merge PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-xl mx-auto">
            Combine multiple PDF files into a single consolidated document in your desired order. 100% private and processed in your browser.
          </p>
          
          {/* Success Result View */}
          {mergedResult && (
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500/30 rounded-2xl animate-fade-in text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-800/40 text-green-600 dark:text-green-400 rounded-full mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                PDFs Merged Successfully!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Combined <span className="font-semibold text-indigo-600 dark:text-indigo-400">{files.length} documents</span> into <span className="font-semibold">{mergedResult.pageCount} pages</span> ({mergedResult.size}).
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <a
                  href={mergedResult.url}
                  download={mergedResult.fileName}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all text-base"
                >
                  <Download size={20} />
                  <span>Download Merged PDF</span>
                </a>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-all text-base"
                >
                  <RefreshCw size={18} />
                  <span>Merge More Files</span>
                </button>
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center bg-gray-50 dark:bg-gray-700/30 mb-6 hover:border-indigo-500 transition-colors">
            <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition-all inline-flex items-center gap-2">
              <FileText size={20} />
              <span>{loading ? 'Processing...' : 'Select PDF Files'}</span>
              <input 
                type="file" 
                multiple 
                accept=".pdf,application/pdf" 
                className="hidden" 
                onChange={handleMultiUpload}
                disabled={loading}
              />
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              Hold Shift or Ctrl to select multiple PDFs at once. No file size limit.
            </p>
          </div>

          {/* Selected Files List */}
          {files.length > 0 && !mergedResult && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">
                  Selected Files ({files.length})
                </h3>
                <button 
                  onClick={() => setFiles([])}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Clear All
                </button>
              </div>
              <ul className="divide-y divide-gray-200 dark:divide-gray-700 border dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
                {files.map((f, i) => (
                  <li key={i} className="px-4 py-3 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <span className="flex items-center gap-2 truncate pr-4">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 font-mono text-xs flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span className="truncate font-medium">{f.name}</span>
                      <span className="text-xs text-gray-400 shrink-0">({(f.size / 1024).toFixed(1)} KB)</span>
                    </span>
                    <button 
                      onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      className="text-gray-400 hover:text-red-500 font-bold p-1 transition-colors"
                      title="Remove file"
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium text-center border border-red-200 dark:border-red-800">
              {error}
            </div>
          )}

          {progress && (
            <div className="p-4 mb-6 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium text-center border border-indigo-200 dark:border-indigo-800 animate-pulse">
              {progress}
            </div>
          )}

          {!mergedResult && (
            <button 
              onClick={handleMerge}
              disabled={files.length < 2 || loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Zap size={20} />
              <span>{loading ? 'Merging PDFs...' : `Merge ${files.length > 1 ? `${files.length} PDFs` : 'PDFs'} Now`}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
