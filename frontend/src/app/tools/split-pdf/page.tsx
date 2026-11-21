'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { CheckCircle2, Download, RefreshCw, FileText, ShieldCheck, Zap, Scissors, HelpCircle } from 'lucide-react';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [splitResult, setSplitResult] = useState<{ url: string; fileName: string; size: string; pageCount: number } | null>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selectedFile = e.target.files[0];
    
    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file.');
      return;
    }
    
    setError(null);
    setFile(selectedFile);
    setSplitResult(null);
  };

  const handleSplit = async () => {
    if (!file) {
      setError('Please upload a PDF file to split.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setProgress('Loading PDF structure...');
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const pageCount = pdf.getPageCount();
      
      if (pageCount <= 1) {
        setError('This PDF contains only 1 page. Splitting requires at least 2 pages.');
        setLoading(false);
        setProgress('');
        return;
      }

      setProgress(`Extracting all ${pageCount} pages...`);
      const zip = new JSZip();
      const folderName = `split_${file.name.replace(/\.[^/.]+$/, '')}`;
      const folder = zip.folder(folderName);
      
      for (let i = 0; i < pageCount; i++) {
        setProgress(`Saving page ${i + 1} of ${pageCount}...`);
        const newPdf = await PDFDocument.create();
        const [copiedPage] = await newPdf.copyPages(pdf, [i]);
        newPdf.addPage(copiedPage);
        const pdfBytes = await newPdf.save();
        folder?.file(`page_${String(i + 1).padStart(3, '0')}.pdf`, pdfBytes);
      }
      
      setProgress('Bundling pages into ZIP archive...');
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      const url = URL.createObjectURL(zipBlob);
      const fileName = `${folderName}_all_pages.zip`;
      const sizeStr = (zipBlob.size / 1024).toFixed(1) + ' KB';
      
      setSplitResult({
        url,
        fileName,
        size: sizeStr,
        pageCount,
      });

      // Auto-trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setProgress('');
    } catch (err: any) {
      setError(err.message || 'Error splitting PDF. It might be password-protected or corrupted.');
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (splitResult?.url) {
      URL.revokeObjectURL(splitResult.url);
    }
    setFile(null);
    setSplitResult(null);
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
            Split PDF
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8 max-w-xl mx-auto">
            Extract every page into a standalone PDF document or download all individual pages packaged in a clean ZIP archive.
          </p>
          
          {/* Success Result View */}
          {splitResult && (
            <div className="mb-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-500/30 rounded-2xl text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 bg-green-100 dark:bg-green-800/40 text-green-600 dark:text-green-400 rounded-full mb-3">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                PDF Split Successfully!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Separated into <span className="font-semibold text-indigo-600 dark:text-indigo-400">{splitResult.pageCount} individual PDF files</span> ({splitResult.size} ZIP archive).
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <a
                  href={splitResult.url}
                  download={splitResult.fileName}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all text-base"
                >
                  <Download size={20} />
                  <span>Download Pages ZIP</span>
                </a>
                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-bold rounded-xl transition-all text-base"
                >
                  <RefreshCw size={18} />
                  <span>Split Another PDF</span>
                </button>
              </div>
            </div>
          )}

          {!file && !splitResult && (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8 text-center bg-gray-50 dark:bg-gray-700/30 mb-6 hover:border-indigo-500 transition-colors">
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md transition-all inline-flex items-center gap-2">
                <FileText size={20} />
                <span>{loading ? 'Processing...' : 'Select PDF File'}</span>
                <input 
                  type="file" 
                  accept=".pdf,application/pdf" 
                  className="hidden" 
                  onChange={handleUpload}
                  disabled={loading}
                />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                Select any PDF document with 2 or more pages. No file upload required.
              </p>
            </div>
          )}

          {file && !splitResult && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex justify-between items-center border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-3 truncate pr-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <FileText size={22} />
                </div>
                <div className="truncate">
                  <p className="font-semibold text-gray-800 dark:text-gray-200 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)} 
                className="text-red-500 hover:text-red-700 text-sm font-bold flex-shrink-0 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Change File
              </button>
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

          {file && !splitResult && (
            <button 
              onClick={handleSplit}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Scissors size={20} />
              <span>{loading ? 'Splitting PDF...' : 'Split into Separate Pages Now'}</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
