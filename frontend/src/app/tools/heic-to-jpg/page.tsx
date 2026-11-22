'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUsage } from '@/context/UsageContext';

export default function HeicToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('image/jpeg');
  const [quality, setQuality] = useState<number>(92);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSize, setConvertedSize] = useState<number>(0);
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
      const lowerName = selectedFile.name.toLowerCase();
      const isHeic =
        lowerName.endsWith('.heic') ||
        lowerName.endsWith('.heif') ||
        selectedFile.type === 'image/heic' ||
        selectedFile.type === 'image/heif';
      if (!isHeic) {
        setError('Please select a HEIC or HEIF photo (the format iPhones save by default). For JPG, PNG or WebP files, use the Image Converter tool instead.');
        return;
      }
      setFile(selectedFile);
      setConvertedUrl(null);
      setConvertedSize(0);
      setError(null);
    }
  };

  const convertImage = async () => {
    if (!file) return;

    if (!incrementUsage()) return; // Abort if limit reached

    setIsProcessing(true);
    setError(null);

    try {
      // heic2any decodes HEIC in the browser using a WebAssembly decoder.
      // It is loaded on demand so other pages do not pay its download cost.
      const heic2any = (await import('heic2any')).default;
      const result = await heic2any({
        blob: file,
        toType: format,
        quality: format === 'image/jpeg' ? quality / 100 : undefined,
      });
      const blob = Array.isArray(result) ? result[0] : result;
      if (!blob) throw new Error('Conversion returned no image data.');
      setConvertedUrl(URL.createObjectURL(blob));
      setConvertedSize(blob.size);
    } catch (err) {
      console.error(err);
      setError('Failed to convert this HEIC photo. The file may be corrupted, or it may use a HEIC variant this decoder cannot read. Try a different photo, or convert it once on the iPhone (share it as JPG) and use the Image Compressor afterwards.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!convertedUrl || !file) return;
    const a = document.createElement('a');
    a.href = convertedUrl;
    const ext = format === 'image/jpeg' ? 'jpg' : 'png';
    const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || 'converted';
    a.download = `${baseName}.${ext}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              HEIC to JPG Converter
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Convert iPhone HEIC and HEIF photos to JPG or PNG so they open anywhere. Processed 100% in your browser — your photos are never uploaded.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            <div className="w-full max-w-2xl">

              {!file ? (
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-8">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-16 h-16 mb-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400"><span className="font-bold text-indigo-600 dark:text-indigo-400">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">HEIC or HEIF photos (one at a time)</p>
                  </div>
                  <input type="file" className="hidden" accept=".heic,.heif,image/heic,image/heif" onChange={handleFileChange} />
                </label>
              ) : (
                <div className="mb-8 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between shadow-sm">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">Size: {formatBytes(file.size)}</span>
                  </div>
                  <button
                    onClick={() => { setFile(null); setConvertedUrl(null); setConvertedSize(0); }}
                    className="text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-400 ml-4 shrink-0"
                  >
                    Remove Photo
                  </button>
                </div>
              )}

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}

              {file && !convertedUrl && (
                <div className="bg-white dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm mb-8">
                  <label className="block mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">Convert To</label>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {['image/jpeg', 'image/png'].map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`py-3 rounded-lg border-2 font-bold text-sm uppercase transition-colors ${
                          format === f
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500'
                        }`}
                      >
                        {f === 'image/jpeg' ? 'JPG' : 'PNG'}
                      </button>
                    ))}
                  </div>

                  {format === 'image/jpeg' && (
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">JPG Quality</label>
                        <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg text-sm">{quality}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={quality}
                        onChange={(e) => setQuality(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2 font-medium">
                        <span>Smaller File</span>
                        <span>Best Quality</span>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                    The first conversion can take a few extra seconds while the HEIC decoder loads in your browser. Very large photos (20 MB+) may be slow on older phones.
                  </p>

                  <button
                    onClick={convertImage}
                    disabled={isProcessing}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Converting...</span>
                      </>
                    ) : (
                      <span>Convert Now</span>
                    )}
                  </button>
                </div>
              )}

              {convertedUrl && (
                <div className="w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 text-center mb-8">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Conversion Successful!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 uppercase tracking-widest font-semibold">
                    {format === 'image/jpeg' ? 'JPG' : 'PNG'} Format &middot; {file ? formatBytes(file.size) : ''} &rarr; {formatBytes(convertedSize)}
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-center shadow-sm mb-6">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={convertedUrl} alt="Converted photo" className="max-w-full max-h-64 object-contain" />
                  </div>

                  <button
                    onClick={handleDownload}
                    className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md transition-colors flex items-center justify-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download Converted Image</span>
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
