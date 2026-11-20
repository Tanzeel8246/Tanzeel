'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function PercentageCalculatorPage() {
  // Mode 1: What is X% of Y?
  const [m1x, setM1x] = useState('');
  const [m1y, setM1y] = useState('');
  
  // Mode 2: X is what % of Y?
  const [m2x, setM2x] = useState('');
  const [m2y, setM2y] = useState('');
  
  // Mode 3: % Increase/Decrease from X to Y
  const [m3x, setM3x] = useState('');
  const [m3y, setM3y] = useState('');

  const calculateM1 = () => {
    const x = parseFloat(m1x);
    const y = parseFloat(m1y);
    if (!isNaN(x) && !isNaN(y)) return (x / 100) * y;
    return null;
  };

  const calculateM2 = () => {
    const x = parseFloat(m2x);
    const y = parseFloat(m2y);
    if (!isNaN(x) && !isNaN(y) && y !== 0) return (x / y) * 100;
    return null;
  };

  const calculateM3 = () => {
    const x = parseFloat(m3x);
    const y = parseFloat(m3y);
    if (!isNaN(x) && !isNaN(y) && x !== 0) {
      const diff = y - x;
      return (diff / Math.abs(x)) * 100;
    }
    return null;
  };

  const formatResult = (num: number | null) => {
    if (num === null) return '-';
    // Remove trailing zeros for integers, max 4 decimals
    return parseFloat(num.toFixed(4)).toString();
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
              Percentage Calculator
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Easily calculate percentages for common scenarios. Just fill in two fields to see the result.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 space-y-12">
            
            {/* Mode 1 */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">1. What is X% of Y?</h2>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <span className="font-bold text-gray-700 dark:text-gray-300 w-full md:w-auto text-center">What is</span>
                <input 
                  type="number" 
                  value={m1x} 
                  onChange={(e) => setM1x(e.target.value)} 
                  placeholder="X" 
                  className="w-full md:w-24 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-center text-indigo-600 dark:text-indigo-400" 
                />
                <span className="font-bold text-gray-700 dark:text-gray-300 w-full md:w-auto text-center">% of</span>
                <input 
                  type="number" 
                  value={m1y} 
                  onChange={(e) => setM1y(e.target.value)} 
                  placeholder="Y" 
                  className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-center text-indigo-600 dark:text-indigo-400" 
                />
                <span className="font-bold text-gray-700 dark:text-gray-300 w-full md:w-auto text-center">?</span>
                <div className="flex-1 w-full flex justify-end">
                  <div className="w-full md:w-auto min-w-[120px] p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-xl font-extrabold text-center text-xl border border-indigo-100 dark:border-indigo-800">
                    {formatResult(calculateM1())}
                  </div>
                </div>
              </div>
            </div>

            {/* Mode 2 */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">2. X is what percent of Y?</h2>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <input 
                  type="number" 
                  value={m2x} 
                  onChange={(e) => setM2x(e.target.value)} 
                  placeholder="X" 
                  className="w-full md:w-24 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-center text-green-600 dark:text-green-400" 
                />
                <span className="font-bold text-gray-700 dark:text-gray-300 w-full md:w-auto text-center">is what % of</span>
                <input 
                  type="number" 
                  value={m2y} 
                  onChange={(e) => setM2y(e.target.value)} 
                  placeholder="Y" 
                  className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-center text-green-600 dark:text-green-400" 
                />
                <span className="font-bold text-gray-700 dark:text-gray-300 w-full md:w-auto text-center">?</span>
                <div className="flex-1 w-full flex justify-end">
                  <div className="w-full md:w-auto min-w-[120px] p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-extrabold text-center text-xl border border-green-100 dark:border-green-800 flex items-center justify-center">
                    {formatResult(calculateM2())} {calculateM2() !== null && '%'}
                  </div>
                </div>
              </div>
            </div>

            {/* Mode 3 */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">3. Percentage Increase / Decrease</h2>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <span className="font-bold text-gray-700 dark:text-gray-300 w-full md:w-auto text-center">From</span>
                <input 
                  type="number" 
                  value={m3x} 
                  onChange={(e) => setM3x(e.target.value)} 
                  placeholder="X" 
                  className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-center text-orange-600 dark:text-orange-400" 
                />
                <span className="font-bold text-gray-700 dark:text-gray-300 w-full md:w-auto text-center">to</span>
                <input 
                  type="number" 
                  value={m3y} 
                  onChange={(e) => setM3y(e.target.value)} 
                  placeholder="Y" 
                  className="w-full md:w-32 p-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-center text-orange-600 dark:text-orange-400" 
                />
                <div className="flex-1 w-full flex justify-end">
                  <div className="w-full md:w-auto min-w-[120px] p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-xl font-extrabold text-center text-xl border border-orange-100 dark:border-orange-800 flex flex-col justify-center items-center">
                    {calculateM3() !== null ? (
                      <>
                        <span>{Math.abs(calculateM3() as number).toFixed(4).replace(/\.?0+$/, '')}%</span>
                        <span className="text-xs uppercase tracking-widest mt-1">
                          {(calculateM3() as number) >= 0 ? 'Increase' : 'Decrease'}
                        </span>
                      </>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
