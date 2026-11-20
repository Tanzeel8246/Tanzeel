'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ColorConverterPage() {
  const [hex, setHex] = useState('#4F46E5');
  const [r, setR] = useState(79);
  const [g, setG] = useState(70);
  const [b, setB] = useState(229);
  const [lastEdited, setLastEdited] = useState<'hex' | 'rgb'>('hex');

  const hexToRgb = (hexStr: string) => {
    let cleanHex = hexStr.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(char => char + char).join('');
    }
    if (cleanHex.length === 6) {
      const num = parseInt(cleanHex, 16);
      return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
    }
    return null;
  };

  const rgbToHex = (rVal: number, gVal: number, bVal: number) => {
    const toHex = (n: number) => {
      const hex = Math.max(0, Math.min(255, n)).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(rVal)}${toHex(gVal)}${toHex(bVal)}`;
  };

  const rgbToHsl = (rVal: number, gVal: number, bVal: number) => {
    const rNorm = rVal / 255;
    const gNorm = gVal / 255;
    const bNorm = bVal / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
        case gNorm: h = (bNorm - rNorm) / d + 2; break;
        case bNorm: h = (rNorm - gNorm) / d + 4; break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  useEffect(() => {
    if (lastEdited === 'hex') {
      const rgb = hexToRgb(hex);
      if (rgb) {
        setR(rgb.r);
        setG(rgb.g);
        setB(rgb.b);
      }
    } else {
      setHex(rgbToHex(r, g, b));
    }
  }, [hex, r, g, b, lastEdited]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const hsl = rgbToHsl(r, g, b);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Color Converter
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Easily convert between HEX, RGB, and HSL color formats in real-time.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-12 items-center">
            
            {/* Controls */}
            <div className="flex-1 w-full space-y-6">
              
              {/* HEX Input */}
              <div className="bg-white dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm relative">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  HEX Code
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={hex}
                    onChange={(e) => {
                      setHex(e.target.value);
                      setLastEdited('hex');
                    }}
                    className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-100 font-mono uppercase"
                  />
                  <button 
                    onClick={() => copyToClipboard(hex)}
                    className="px-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-r-lg font-medium hover:bg-indigo-200 transition-colors border border-l-0 border-gray-300 dark:border-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* RGB Input */}
              <div className="bg-white dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm relative">
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    RGB Code
                  </label>
                  <button 
                    onClick={() => copyToClipboard(`rgb(${r}, ${g}, ${b})`)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    Copy rgb()
                  </button>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs text-red-500 font-bold">R</label>
                    <input 
                      type="number" min="0" max="255" value={r} 
                      onChange={(e) => { setR(parseInt(e.target.value) || 0); setLastEdited('rgb'); }}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-red-500 outline-none text-center font-mono text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-green-500 font-bold">G</label>
                    <input 
                      type="number" min="0" max="255" value={g} 
                      onChange={(e) => { setG(parseInt(e.target.value) || 0); setLastEdited('rgb'); }}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-green-500 outline-none text-center font-mono text-gray-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-blue-500 font-bold">B</label>
                    <input 
                      type="number" min="0" max="255" value={b} 
                      onChange={(e) => { setB(parseInt(e.target.value) || 0); setLastEdited('rgb'); }}
                      className="w-full p-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* HSL Output */}
              <div className="bg-white dark:bg-gray-700 p-5 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm relative">
                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    HSL Code
                  </label>
                  <button 
                    onClick={() => copyToClipboard(hsl)}
                    className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold"
                  >
                    Copy hsl()
                  </button>
                </div>
                <div className="flex">
                  <input
                    type="text"
                    readOnly
                    value={hsl}
                    className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-l-lg font-mono text-gray-800 dark:text-gray-100"
                  />
                  <button 
                    onClick={() => copyToClipboard(hsl)}
                    className="px-4 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300 rounded-r-lg font-medium hover:bg-indigo-200 transition-colors border border-l-0 border-gray-300 dark:border-gray-600"
                  >
                    Copy
                  </button>
                </div>
              </div>

            </div>

            {/* Preview Box */}
            <div className="flex-shrink-0 w-full md:w-64">
              <div 
                className="w-full aspect-square rounded-2xl shadow-inner border-4 border-white dark:border-gray-700 flex flex-col items-center justify-center text-white"
                style={{ backgroundColor: hex, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}
              >
                <div className="font-mono text-xl font-bold uppercase">{hex}</div>
                <div className="font-mono text-sm">rgb({r}, {g}, {b})</div>
                <div className="font-mono text-xs mt-1 text-gray-200">{hsl}</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
