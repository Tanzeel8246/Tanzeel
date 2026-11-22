'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUsage } from '@/context/UsageContext';

let qpdfFactoryPromise: Promise<any> | null = null;

function loadQpdfFactory(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Browser only'));
  const w = window as any;
  if (w.Module) return Promise.resolve(w.Module);
  if (!qpdfFactoryPromise) {
    qpdfFactoryPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = '/wasm/qpdf.js';
      script.async = true;
      script.onload = () => {
        if (w.Module) resolve(w.Module);
        else reject(new Error('qpdf factory not found after script load'));
      };
      script.onerror = () => reject(new Error('Failed to load the qpdf engine script'));
      document.head.appendChild(script);
    });
  }
  return qpdfFactoryPromise;
}

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number } | null>(null);
  const { incrementUsage } = useUsage();

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a valid PDF file.');
        return;
      }
      setFile(selectedFile);
      setResult(null);
      setError(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;

    if (!incrementUsage()) return; // Abort if limit reached

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      // qpdf compiled to WebAssembly: recompresses the PDF's internal
      // streams and rebuilds its object structure without touching the
      // page content, so text stays selectable and images stay embedded.
      // The Emscripten glue script is loaded at runtime from /wasm/qpdf.js
      // (it cannot pass through the bundler, which cannot resolve the
      // Node-only modules the glue references for its non-browser mode).
      const createModule = await loadQpdfFactory();
      const qpdf = await createModule({
        locateFile: () => '/wasm/qpdf.wasm',
      });

      const inputBytes = new Uint8Array(await file.arrayBuffer());
      qpdf.FS.writeFile('/input.pdf', inputBytes);

      const exitCode: number = qpdf.callMain([
        '/input.pdf',
        '--object-streams=generate',
        '--compress-streams=y',
        '--decode-level=generalized',
        '--recompress-flate',
        '--',
        '/output.pdf',
      ]);

      let outputBytes: Uint8Array | null = null;
      try {
        outputBytes = qpdf.FS.readFile('/output.pdf') as Uint8Array;
      } catch {
        outputBytes = null;
      }

      // qpdf exit codes: 0 = success, 3 = success with warnings.
      if (!outputBytes || outputBytes.length === 0 || (exitCode !== 0 && exitCode !== 3)) {
        throw new Error('qpdf could not process this PDF.');
      }

      const blob = new Blob([outputBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size });
    } catch (err) {
      console.error(err);
      setError('Failed to compress this PDF. Password-protected (encrypted) PDFs cannot be compressed here — remove the password first. Very large files may also exceed your browser memory; try a desktop browser if a big file fails.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result || !file) return;
    const a = document.createElement('a');
    a.href = result.url;
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'document';
    a.download = `${baseName}-compressed.pdf`;
    a.click();
  };

  const savedPct = file && result ? ((file.size - result.size) / file.size) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Compress PDF
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Reduce a PDF&apos;s file size by recompressing its internal data — your text stays selectable and copyable, and the file never leaves your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            <div className="w-full max-w-2xl">

              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-8">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-16 h-16 mb-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6M9 8h6M5 3h9l5 5v13a1 1 0 01-1 1H5a1 1 0 01-1-1V4a1 1 0 011-1z"></path></svg>
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400"><span className="font-bold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">One PDF file</p>
                  </div>
                  <input type="file" className="hidden" accept="application/pdf,.pdf" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="mb-8 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">Size: {formatBytes(file.size)}</span>
                  </div>
                  <button
                    onClick={() => { setFile(null); setResult(null); }}
                    className="text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-400 ml-4 shrink-0"
                  >
                    Remove File
                  </button>
                </div>
              )}

              <div className="mb-8 p-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Honest expectation:</strong> this compressor keeps your PDF fully intact — text, links and images — so the saving is modest, typically around <strong>5–20%</strong>. PDFs that were exported with uncompressed data can shrink more; PDFs that are already well optimized may not shrink at all, and you will see the real before/after sizes before downloading. The first compression takes a few extra seconds while the compression engine loads.
                </p>
              </div>

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}

              {file && !result && (
                <button
                  onClick={handleCompress}
                  disabled={isProcessing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Compressing...</span>
                    </>
                  ) : (
                    <span>Compress PDF</span>
                  )}
                </button>
              )}

              {result && file && (
                <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Compression Complete!</h3>

                  <div className="flex justify-center items-center space-x-8 my-4">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Original</span>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{formatBytes(file.size)}</span>
                    </div>
                    <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">Compressed</span>
                      <span className="font-bold text-green-700 dark:text-green-300 text-xl">{formatBytes(result.size)}</span>
                    </div>
                  </div>

                  {savedPct > 0.05 ? (
                    <div className="inline-block px-4 py-1 bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 rounded-full text-sm font-bold mb-6">
                      Saved {savedPct.toFixed(1)}% space
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                      This PDF was already well optimized, so it could not be made meaningfully smaller without converting pages to images. The file below is a valid, structurally cleaned copy of your document.
                    </p>
                  )}

                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download Compressed PDF</span>
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
