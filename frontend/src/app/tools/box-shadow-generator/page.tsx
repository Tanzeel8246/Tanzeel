'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BoxShadowGeneratorPage() {
  const [hOffset, setHOffset] = useState(10);
  const [vOffset, setVOffset] = useState(10);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(-3);
  const [shadowColor, setShadowColor] = useState('rgba(0, 0, 0, 0.1)');
  const [boxColor, setBoxColor] = useState('#ffffff');
  const [bgColor, setBgColor] = useState('#f3f4f6');
  const [inset, setInset] = useState(false);
  
  const [cssCode, setCssCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    generateShadow();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hOffset, vOffset, blur, spread, shadowColor, inset]);

  const generateShadow = () => {
    const insetString = inset ? 'inset ' : '';
    const shadow = `${insetString}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${shadowColor}`;
    
    const code = `box-shadow: ${shadow};\n-webkit-box-shadow: ${shadow};\n-moz-box-shadow: ${shadow};`;
    setCssCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Convert Hex to RGBA for shadow color picker simplicity
  const handleHexShadowColor = (hex: string) => {
    // simple hex to rgba conversion
    let r = 0, g = 0, b = 0;
    if (hex.length === 7) {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    setShadowColor(`rgba(${r}, ${g}, ${b}, 0.5)`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Controls Side */}
          <div className="lg:w-2/5 p-8 sm:p-10 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Box Shadow Generator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Design stunning CSS box-shadows visually.</p>

            <div className="space-y-6">
              
              {/* Sliders */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Horizontal Offset</label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{hOffset}px</span>
                </div>
                <input type="range" min="-50" max="50" value={hOffset} onChange={(e) => setHOffset(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Vertical Offset</label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{vOffset}px</span>
                </div>
                <input type="range" min="-50" max="50" value={vOffset} onChange={(e) => setVOffset(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Blur Radius</label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{blur}px</span>
                </div>
                <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spread Radius</label>
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{spread}px</span>
                </div>
                <input type="range" min="-50" max="50" value={spread} onChange={(e) => setSpread(Number(e.target.value))} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-indigo-600" />
              </div>

              {/* Toggles & Colors */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-4">
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Inset Shadow</label>
                  <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" checked={inset} onChange={(e) => setInset(e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" style={{ right: inset ? '0' : 'auto', left: inset ? 'auto' : '0', borderColor: inset ? '#4F46E5' : '#D1D5DB' }}/>
                    <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${inset ? 'bg-indigo-600' : 'bg-gray-300'}`}></label>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Shadow Color (RGBA)</label>
                  <input type="text" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-40 p-2 text-sm bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg outline-none text-gray-900 dark:text-white" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Box Color</label>
                    <input type="color" value={boxColor} onChange={(e) => setBoxColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border-0 p-0" />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">Background Color</label>
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-full h-10 rounded cursor-pointer border-0 p-0" />
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Preview & Code Side */}
          <div className="lg:w-3/5 flex flex-col relative" style={{ backgroundColor: bgColor }}>
            
            {/* Preview Area */}
            <div className="flex-1 flex items-center justify-center p-12 transition-colors duration-300">
              <div 
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-2xl transition-all duration-200 flex items-center justify-center text-center p-4"
                style={{
                  backgroundColor: boxColor,
                  boxShadow: `${inset ? 'inset ' : ''}${hOffset}px ${vOffset}px ${blur}px ${spread}px ${shadowColor}`
                }}
              >
                <span className="text-sm font-bold opacity-50" style={{ color: shadowColor === boxColor ? 'gray' : 'inherit' }}>
                  Preview Box
                </span>
              </div>
            </div>

            {/* CSS Code Box */}
            <div className="bg-gray-900 p-8 flex flex-col justify-end border-t border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-gray-300 font-bold text-sm tracking-widest uppercase">CSS Code</h3>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center space-x-2 text-sm font-bold shadow-md"
                >
                  {isCopied ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      <span>Copy CSS</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                value={cssCode}
                readOnly
                className="w-full bg-gray-950 text-green-400 p-4 rounded-xl font-mono text-sm outline-none resize-none h-28 border border-gray-700 leading-relaxed"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
