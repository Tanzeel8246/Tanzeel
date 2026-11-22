'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useUsage } from '@/context/UsageContext';

const DPI = 300;

interface SizePreset {
  id: string;
  label: string;
  wMm: number;
  hMm: number;
  note: string;
}

const PRESETS: SizePreset[] = [
  { id: '35x45', label: '35 × 45 mm', wMm: 35, hMm: 45, note: 'Pakistan passport, EU & UK standard' },
  { id: '51x51', label: '2 × 2 inch (51 × 51 mm)', wMm: 51, hMm: 51, note: 'US passport & visa, Pakistan visa' },
  { id: '33x48', label: '33 × 48 mm', wMm: 33, hMm: 48, note: 'China visa' },
  { id: '50x70', label: '50 × 70 mm', wMm: 50, hMm: 70, note: 'Canada passport' },
  { id: '40x60', label: '40 × 60 mm (4 × 6 cm)', wMm: 40, hMm: 60, note: 'Saudi Arabia, Hajj & Umrah' },
  { id: '30x40', label: '30 × 40 mm', wMm: 30, hMm: 40, note: 'Common ID & form size' },
  { id: '25x35', label: '25 × 35 mm', wMm: 25, hMm: 35, note: 'Stamp size (PAN & forms)' },
  { id: '1x1in', label: '1 × 1 inch (25.4 × 25.4 mm)', wMm: 25.4, hMm: 25.4, note: 'Small ID photos' },
];

const mmToPx = (mm: number) => Math.round((mm / 25.4) * DPI);

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop({ unit: '%', width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  );
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
}

export default function PassportPhotoMakerPage() {
  const [imgSrc, setImgSrc] = useState('');
  const [fileName, setFileName] = useState('photo');
  const imgRef = useRef<HTMLImageElement>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [presetId, setPresetId] = useState('35x45');
  const [customW, setCustomW] = useState<number>(35);
  const [customH, setCustomH] = useState<number>(45);
  const [targetKb, setTargetKb] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; size: number; wPx: number; hPx: number; reduced: boolean } | null>(null);
  const { incrementUsage } = useUsage();

  const isCustom = presetId === 'custom';
  const preset = PRESETS.find((p) => p.id === presetId);
  const wMm = isCustom ? customW : preset!.wMm;
  const hMm = isCustom ? customH : preset!.hMm;
  const aspect = wMm > 0 && hMm > 0 ? wMm / hMm : 35 / 45;
  const outW = mmToPx(wMm);
  const outH = mmToPx(hMm);

  const formatKb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;

  const applyCenterCrop = (a: number = aspect) => {
    if (imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, a));
    }
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = e.target.files[0];
      if (!selected.type.startsWith('image/')) {
        setError('Please select a valid image file (JPG or PNG).');
        return;
      }
      setCrop(undefined);
      setCompletedCrop(undefined);
      setResult(null);
      setFileName(selected.name.substring(0, selected.name.lastIndexOf('.')) || 'photo');
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(selected);
      setError(null);
    }
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, aspect));
  };

  const handlePresetChange = (id: string) => {
    setPresetId(id);
    setResult(null);
    // Re-center the crop using the new preset's aspect ratio.
    const p = PRESETS.find((x) => x.id === id);
    const newAspect = id === 'custom' ? (customW > 0 && customH > 0 ? customW / customH : 35 / 45) : p!.wMm / p!.hMm;
    setTimeout(() => applyCenterCrop(newAspect), 0);
  };

  const handleGenerate = async () => {
    if (!completedCrop || !imgRef.current) {
      setError('Please position the crop over the face first.');
      return;
    }
    if (!(wMm >= 10 && wMm <= 200 && hMm >= 10 && hMm <= 200)) {
      setError('Custom size must be between 10 mm and 200 mm on each side.');
      return;
    }

    if (!incrementUsage()) return; // Abort if limit reached

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const image = imgRef.current;
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const sourceCanvas = document.createElement('canvas');
      sourceCanvas.width = outW;
      sourceCanvas.height = outH;
      const sctx = sourceCanvas.getContext('2d');
      if (!sctx) throw new Error('Canvas is not supported in your browser.');
      sctx.fillStyle = '#FFFFFF';
      sctx.fillRect(0, 0, outW, outH);
      sctx.imageSmoothingQuality = 'high';
      sctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0,
        0,
        outW,
        outH,
      );

      const targetBytes = targetKb > 0 ? targetKb * 1024 : 0;
      let workCanvas: HTMLCanvasElement = sourceCanvas;
      let blob: Blob | null = null;
      let reduced = false;

      // Try progressively lower JPEG quality, then smaller dimensions,
      // until the file fits the chosen KB target.
      for (let attempt = 0; attempt < 12; attempt++) {
        const qualities = [0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4];
        for (const q of qualities) {
          blob = await canvasToBlob(workCanvas, q);
          if (!blob) throw new Error('Failed to create the photo file.');
          if (targetBytes === 0 || blob.size <= targetBytes) break;
        }
        if (!blob) throw new Error('Failed to create the photo file.');
        if (targetBytes === 0 || blob.size <= targetBytes) break;

        const smaller = document.createElement('canvas');
        smaller.width = Math.round(workCanvas.width * 0.85);
        smaller.height = Math.round(workCanvas.height * 0.85);
        const cctx = smaller.getContext('2d');
        if (!cctx) break;
        cctx.fillStyle = '#FFFFFF';
        cctx.fillRect(0, 0, smaller.width, smaller.height);
        cctx.imageSmoothingQuality = 'high';
        cctx.drawImage(workCanvas, 0, 0, smaller.width, smaller.height);
        workCanvas = smaller;
        reduced = true;
      }

      if (!blob) throw new Error('Failed to create the photo file.');

      setResult({
        url: URL.createObjectURL(blob),
        size: blob.size,
        wPx: workCanvas.width,
        hPx: workCanvas.height,
        reduced,
      });
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Failed to create the passport photo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `${fileName}-passport-${wMm}x${hMm}mm.jpg`;
    a.click();
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
              Passport Photo Maker
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Create a passport or visa photo at the exact official size in millimetres, with an optional file-size target in KB for online portals. Everything runs in your browser — your photo is never uploaded.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            <div className="w-full max-w-3xl mx-auto">

              {/* Step 1: upload */}
              <div className="mb-8">
                <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">1. Click to upload a photo</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">JPG or PNG, taken against a plain light wall</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={onSelectFile} />
                </label>
              </div>

              {/* Step 2: size preset */}
              <div className="mb-8 p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
                <label className="block mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">2. Choose the photo size</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handlePresetChange(p.id)}
                      className={`p-3 rounded-lg border-2 text-left transition-colors ${
                        presetId === p.id
                          ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/30'
                          : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
                      }`}
                    >
                      <span className="block font-bold text-sm text-gray-800 dark:text-gray-100">{p.label}</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{p.note}</span>
                    </button>
                  ))}
                  <button
                    onClick={() => handlePresetChange('custom')}
                    className={`p-3 rounded-lg border-2 text-left transition-colors ${
                      isCustom
                        ? 'border-indigo-600 bg-indigo-50 dark:border-indigo-500 dark:bg-indigo-900/30'
                        : 'border-gray-200 bg-white hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500'
                    }`}
                  >
                    <span className="block font-bold text-sm text-gray-800 dark:text-gray-100">Custom size</span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">Enter any size in millimetres</span>
                  </button>
                </div>

                {isCustom && (
                  <div className="flex items-center gap-3 mt-4">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Width (mm)</label>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={customW}
                      onChange={(e) => { const v = parseFloat(e.target.value) || 0; setCustomW(v); setResult(null); if (v > 0 && customH > 0) setTimeout(() => applyCenterCrop(v / customH), 0); }}
                      className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    />
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Height (mm)</label>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={customH}
                      onChange={(e) => { const v = parseFloat(e.target.value) || 0; setCustomH(v); setResult(null); if (v > 0 && customW > 0) setTimeout(() => applyCenterCrop(customW / v), 0); }}
                      className="w-24 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                    />
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  Output: {wMm} × {hMm} mm at {DPI} DPI = {outW} × {outH} pixels (standard print resolution).
                </p>
              </div>

              {/* Step 3: crop */}
              {imgSrc && (
                <div className="mb-8 p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
                  <label className="block mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">3. Position the face inside the frame</label>
                  <div className="flex justify-center bg-gray-100 dark:bg-gray-900 rounded-xl p-4">
                    <ReactCrop
                      crop={crop}
                      onChange={(_, percentCrop) => setCrop(percentCrop)}
                      onComplete={(c) => setCompletedCrop(c)}
                      aspect={aspect}
                      locked={false}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        ref={imgRef}
                        alt="Your uploaded portrait"
                        src={imgSrc}
                        onLoad={onImageLoad}
                        className="max-w-full max-h-[480px]"
                      />
                    </ReactCrop>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Drag the frame so the face is centred with the head and shoulders visible. This tool does not change the background — use a plain, light-coloured wall behind the subject for official photos.
                  </p>
                </div>
              )}

              {/* Step 4: KB target + generate */}
              <div className="mb-8 p-6 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-sm">
                <label className="block mb-4 text-sm font-bold text-gray-700 dark:text-gray-300">4. File size target (for online forms)</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { v: 0, label: 'Best quality' },
                    { v: 50, label: 'Under 50 KB' },
                    { v: 100, label: 'Under 100 KB' },
                    { v: 200, label: 'Under 200 KB' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => { setTargetKb(opt.v); setResult(null); }}
                      className={`py-3 rounded-lg border-2 font-bold text-sm transition-colors ${
                        targetKb === opt.v
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-300'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:border-gray-500'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}

              <button
                onClick={handleGenerate}
                disabled={!imgSrc || isProcessing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center"
              >
                {isProcessing ? 'Creating Photo...' : 'Create Passport Photo'}
              </button>

              {result && (
                <div className="mt-8 p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl text-center">
                  <h3 className="text-lg font-bold text-green-800 dark:text-green-400 mb-4">Your Photo Is Ready!</h3>
                  <div className="flex justify-center mb-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={result.url} alt="Finished passport size photo" className="max-h-64 border border-gray-300 dark:border-gray-600 rounded-lg" />
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                    Size: <strong>{wMm} × {hMm} mm</strong> &middot; Pixels: <strong>{result.wPx} × {result.hPx}</strong> &middot; File: <strong>{formatKb(result.size)}</strong>
                  </p>
                  {result.reduced && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-1">
                      To fit the KB target, the pixel dimensions were reduced below {DPI} DPI. The printed size in millimetres stays the same.
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
                    When printing, choose &ldquo;actual size&rdquo; (100%) in the print dialog so the photo prints at exactly {wMm} × {hMm} mm.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold flex justify-center items-center space-x-2 transition-colors shadow-md"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    <span>Download JPG</span>
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
