'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// Helper to convert AudioBuffer to a valid WAV Blob completely client-side
function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new DataView(new ArrayBuffer(length));
  const channels: Float32Array[] = [];
  const sampleRate = buffer.sampleRate;
  let offset = 0;
  let pos = 0;

  function setUint16(data: number) {
    out.setUint16(pos, data, true);
    pos += 2;
  }
  function setUint32(data: number) {
    out.setUint32(pos, data, true);
    pos += 4;
  }

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(sampleRate);
  setUint32(sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      out.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return new Blob([out], { type: 'audio/wav' });
}

export default function VideoToAudioPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFileName, setAudioFileName] = useState<string>('');

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const selected = e.target.files[0];
    setFile(selected);
    setError(null);
    setAudioUrl(null);
  };

  const handleConvert = async () => {
    if (!file) {
      setError('Please select a video file first.');
      return;
    }

    setLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        throw new Error('Web Audio API is not supported in this browser.');
      }

      const audioCtx = new AudioCtx();
      const arrayBuffer = await file.arrayBuffer();

      // Decode audio data from video container
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      if (!decodedBuffer || decodedBuffer.length === 0) {
        throw new Error('No audio track found in this video.');
      }

      const wavBlob = audioBufferToWav(decodedBuffer);
      const url = URL.createObjectURL(wavBlob);
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const downloadName = `${baseName}_audio.wav`;

      setAudioUrl(url);
      setAudioFileName(downloadName);

      // Trigger automatic download
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await audioCtx.close();
    } catch (err: any) {
      console.error('Audio extraction error:', err);
      setError(err.message || 'Failed to extract audio. Ensure the video file contains an active audio track.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">Video to Audio (WAV/MP3)</h1>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-8">
            Extract high-fidelity audio directly from any video file in your browser — 100% private and instantaneous.
          </p>

          {!file ? (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center bg-gray-50/50 dark:bg-gray-700/30 mb-6 transition-colors hover:border-indigo-500">
              <label className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-colors inline-block">
                Select Video File
                <input 
                  type="file" 
                  accept="video/*,.mp4,.mkv,.webm,.mov,.avi,.flv" 
                  className="hidden" 
                  onChange={handleSelectFile}
                  disabled={loading}
                />
              </label>
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">Supports MP4, WebM, MKV, MOV, AVI, etc. (All processing happens in your browser)</p>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl flex justify-between items-center border border-gray-200 dark:border-gray-600">
              <div className="flex items-center space-x-3 overflow-hidden">
                <svg className="w-8 h-8 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <div className="truncate">
                  <span className="font-medium text-gray-800 dark:text-gray-200 block truncate">{file.name}</span>
                  <span className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
              <button 
                onClick={() => { setFile(null); setAudioUrl(null); }} 
                className="text-red-500 hover:text-red-700 text-sm font-semibold bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors ml-3 flex-shrink-0"
              >
                Change
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
              <p className="text-red-700 dark:text-red-300 font-medium text-sm">{error}</p>
            </div>
          )}

          {audioUrl && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-6 rounded-xl mb-6 text-center">
              <div className="text-green-600 dark:text-green-400 font-bold mb-3 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Audio Extracted Successfully!
              </div>
              <audio controls src={audioUrl} className="w-full mb-4" />
              <a 
                href={audioUrl} 
                download={audioFileName}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2.5 rounded-lg shadow transition-colors"
              >
                Download Audio File ({audioFileName})
              </a>
            </div>
          )}

          <button 
            onClick={handleConvert}
            disabled={!file || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Extracting Audio (in browser)...' : 'Extract Audio Now'}
          </button>
        </div>
      </div>
    </div>
  );
}
