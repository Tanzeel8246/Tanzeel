'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function CssGeneratorPage() {
  const [displayType, setDisplayType] = useState<'flex' | 'grid'>('flex');
  
  // Flexbox state
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [gap, setGap] = useState('16px');
  
  // Grid state
  const [gridTemplateColumns, setGridTemplateColumns] = useState('repeat(3, 1fr)');
  const [gridTemplateRows, setGridTemplateRows] = useState('auto');
  const [gridJustifyItems, setGridJustifyItems] = useState('stretch');
  const [gridAlignItems, setGridAlignItems] = useState('stretch');

  // Box count
  const [boxCount, setBoxCount] = useState(5);

  const getCssCode = () => {
    if (displayType === 'flex') {
      return `.container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gap};
}`;
    } else {
      return `.container {
  display: grid;
  grid-template-columns: ${gridTemplateColumns};
  grid-template-rows: ${gridTemplateRows};
  justify-items: ${gridJustifyItems};
  align-items: ${gridAlignItems};
  gap: ${gap};
}`;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getCssCode());
    alert('CSS copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-indigo-50/50 dark:bg-indigo-900/10">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">CSS Layout Generator</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Visually build and test CSS Flexbox and Grid layouts and generate the code instantly.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row">
            
            {/* Left Sidebar: Controls */}
            <div className="w-full lg:w-1/3 p-6 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Layout Mode</label>
                <div className="flex bg-white dark:bg-gray-700 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-600">
                  <button 
                    onClick={() => setDisplayType('flex')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${displayType === 'flex' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                  >
                    Flexbox
                  </button>
                  <button 
                    onClick={() => setDisplayType('grid')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${displayType === 'grid' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                  >
                    CSS Grid
                  </button>
                </div>
              </div>

              {displayType === 'flex' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">flex-direction</label>
                    <select value={flexDirection} onChange={e => setFlexDirection(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="row">row</option>
                      <option value="row-reverse">row-reverse</option>
                      <option value="column">column</option>
                      <option value="column-reverse">column-reverse</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">justify-content</label>
                    <select value={justifyContent} onChange={e => setJustifyContent(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="flex-start">flex-start</option>
                      <option value="flex-end">flex-end</option>
                      <option value="center">center</option>
                      <option value="space-between">space-between</option>
                      <option value="space-around">space-around</option>
                      <option value="space-evenly">space-evenly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">align-items</label>
                    <select value={alignItems} onChange={e => setAlignItems(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="stretch">stretch</option>
                      <option value="flex-start">flex-start</option>
                      <option value="flex-end">flex-end</option>
                      <option value="center">center</option>
                      <option value="baseline">baseline</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">flex-wrap</label>
                    <select value={flexWrap} onChange={e => setFlexWrap(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="nowrap">nowrap</option>
                      <option value="wrap">wrap</option>
                      <option value="wrap-reverse">wrap-reverse</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">grid-template-columns</label>
                    <input type="text" value={gridTemplateColumns} onChange={e => setGridTemplateColumns(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">grid-template-rows</label>
                    <input type="text" value={gridTemplateRows} onChange={e => setGridTemplateRows(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">justify-items</label>
                    <select value={gridJustifyItems} onChange={e => setGridJustifyItems(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="stretch">stretch</option>
                      <option value="start">start</option>
                      <option value="end">end</option>
                      <option value="center">center</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">align-items</label>
                    <select value={gridAlignItems} onChange={e => setGridAlignItems(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option value="stretch">stretch</option>
                      <option value="start">start</option>
                      <option value="end">end</option>
                      <option value="center">center</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">gap (spacing)</label>
                  <input type="text" value={gap} onChange={e => setGap(e.target.value)} className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 uppercase">Number of Items</label>
                  <input type="range" min="1" max="20" value={boxCount} onChange={e => setBoxCount(parseInt(e.target.value))} className="w-full" />
                  <div className="text-right text-xs text-gray-500 font-mono mt-1">{boxCount} items</div>
                </div>
              </div>

            </div>

            {/* Right Area: Preview & Code */}
            <div className="w-full lg:w-2/3 p-6 flex flex-col h-full min-h-[600px]">
              
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Live Preview</h2>
              
              {/* Preview Canvas */}
              <div className="flex-1 bg-white dark:bg-gray-900 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl overflow-auto p-4 mb-6">
                <div 
                  className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded w-full h-full min-h-[300px] resize-y overflow-auto"
                  style={displayType === 'flex' ? {
                    display: 'flex',
                    flexDirection: flexDirection as any,
                    justifyContent: justifyContent,
                    alignItems: alignItems,
                    flexWrap: flexWrap as any,
                    gap: gap
                  } : {
                    display: 'grid',
                    gridTemplateColumns: gridTemplateColumns,
                    gridTemplateRows: gridTemplateRows,
                    justifyItems: gridJustifyItems,
                    alignItems: gridAlignItems,
                    gap: gap
                  }}
                >
                  {Array.from({ length: boxCount }).map((_, i) => (
                    <div 
                      key={i} 
                      className="bg-indigo-500 text-white font-bold flex items-center justify-center p-4 rounded shadow-sm text-xl min-w-[50px] min-h-[50px]"
                    >
                      {i + 1}
                    </div>
                  ))}
                </div>
              </div>

              {/* Code Output */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">CSS Code</h2>
                  <button 
                    onClick={copyToClipboard}
                    className="text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-1 px-3 rounded transition-colors flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    Copy CSS
                  </button>
                </div>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto border border-gray-700 font-mono">
                  <code>{getCssCode()}</code>
                </pre>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
