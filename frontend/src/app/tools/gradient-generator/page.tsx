'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function GradientGeneratorPage() {
  const [color1, setColor1] = useState('#4F46E5');
  const [color2, setColor2] = useState('#EC4899');
  const [type, setType] = useState('linear');
  const [angle, setAngle] = useState(90);
  
  const [cssCode, setCssCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    generateGradient();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [color1, color2, type, angle]);

  const generateGradient = () => {
    let gradient = '';
    if (type === 'linear') {
      gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    } else {
      gradient = `radial-gradient(circle, ${color1}, ${color2})`;
    }
    
    const code = `background: ${color1};\nbackground: ${gradient};`;
    setCssCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const randomGradient = () => {
    const randomColor = () => '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    setColor1(randomColor());
    setColor2(randomColor());
    setAngle(Math.floor(Math.random() * 360));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
          
          {/* Controls Side */}
          <div className="lg:w-1/3 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">CSS Gradient Generator</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Design beautiful gradients visually and copy the CSS instantly.</p>

            <div className="space-y-8">
              {/* Type Selection */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Style</label>
                <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
                  <button
                    onClick={() => setType('linear')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'linear' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Linear
                  </button>
                  <button
                    onClick={() => setType('radial')}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${type === 'radial' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}
                  >
                    Radial
                  </button>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">Colors</label>
                <div className="flex items-center justify-between space-x-4">
                  <div className="flex flex-col items-center">
                    <input 
                      type="color" 
                      value={color1} 
                      onChange={(e) => setColor1(e.target.value)}
                      className="w-16 h-16 rounded-lg cursor-pointer border-0 p-0" 
                    />
                    <span className="mt-2 text-xs font-mono font-bold text-gray-600 dark:text-gray-400 uppercase">{color1}</span>
                  </div>
                  
                  <button onClick={() => {const temp = color1; setColor1(color2); setColor2(temp);}} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-gray-600 dark:text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                  </button>

                  <div className="flex flex-col items-center">
                    <input 
                      type="color" 
                      value={color2} 
                      onChange={(e) => setColor2(e.target.value)}
                      className="w-16 h-16 rounded-lg cursor-pointer border-0 p-0" 
                    />
                    <span className="mt-2 text-xs font-mono font-bold text-gray-600 dark:text-gray-400 uppercase">{color2}</span>
                  </div>
                </div>
              </div>

              {/* Angle Slider */}
              {type === 'linear' && (
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Angle</label>
                    <span className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded">{angle}°</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" max="360" 
                    value={angle} 
                    onChange={(e) => setAngle(Number(e.target.value))} 
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
                    <span>0°</span>
                    <span>180°</span>
                    <span>360°</span>
                  </div>
                </div>
              )}

              {/* Random Button */}
              <button 
                onClick={randomGradient}
                className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-gray-800 dark:text-gray-200 rounded-xl font-bold transition-all flex justify-center items-center space-x-2 shadow-sm"
              >
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                <span>Randomize</span>
              </button>
            </div>
          </div>

          {/* Preview & Code Side */}
          <div className="lg:w-2/3 flex flex-col relative">
            {/* Preview Box */}
            <div 
              className="flex-1 transition-all duration-300 ease-in-out" 
              style={{
                background: type === 'linear' 
                  ? `linear-gradient(${angle}deg, ${color1}, ${color2})`
                  : `radial-gradient(circle, ${color1}, ${color2})`
              }}
            >
            </div>

            {/* CSS Code Box */}
            <div className="bg-gray-900 p-8 flex flex-col justify-end">
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
                className="w-full bg-gray-950 text-green-400 p-4 rounded-xl font-mono text-sm outline-none resize-none h-24 border border-gray-700"
              />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
