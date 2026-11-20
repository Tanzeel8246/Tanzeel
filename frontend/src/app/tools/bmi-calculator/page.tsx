'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BmiCalculatorPage() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  // Metric
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  
  // Imperial
  const [weightLbs, setWeightLbs] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');

  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<{ name: string; color: string; desc: string } | null>(null);

  useEffect(() => {
    calculateBmi();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, weightKg, heightCm, weightLbs, heightFt, heightIn]);

  const calculateBmi = () => {
    let bmiValue = 0;

    if (unit === 'metric') {
      const w = parseFloat(weightKg);
      const h = parseFloat(heightCm) / 100; // to meters
      if (w > 0 && h > 0) {
        bmiValue = w / (h * h);
      }
    } else {
      const w = parseFloat(weightLbs);
      const ft = parseFloat(heightFt) || 0;
      const inch = parseFloat(heightIn) || 0;
      const h = (ft * 12) + inch; // total inches
      
      if (w > 0 && h > 0) {
        bmiValue = 703 * (w / (h * h));
      }
    }

    if (bmiValue > 0) {
      setBmi(parseFloat(bmiValue.toFixed(1)));
      determineCategory(bmiValue);
    } else {
      setBmi(null);
      setCategory(null);
    }
  };

  const determineCategory = (val: number) => {
    if (val < 18.5) {
      setCategory({ name: 'Underweight', color: 'text-blue-500', desc: 'You are considered underweight. It might be a good idea to consult a doctor.' });
    } else if (val >= 18.5 && val < 24.9) {
      setCategory({ name: 'Normal Weight', color: 'text-green-500', desc: 'You have a healthy body weight. Keep up the good work!' });
    } else if (val >= 25 && val < 29.9) {
      setCategory({ name: 'Overweight', color: 'text-yellow-500', desc: 'You are slightly overweight. Consider a balanced diet and regular exercise.' });
    } else {
      setCategory({ name: 'Obese', color: 'text-red-500', desc: 'Your BMI falls within the obese range. We recommend consulting a healthcare provider.' });
    }
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
              BMI Calculator
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Check your Body Mass Index (BMI) to understand if you are at a healthy weight.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-12 items-start">
            
            {/* Input Section */}
            <div className="w-full md:w-1/2 space-y-8">
              
              {/* Unit Toggle */}
              <div className="flex bg-gray-200 dark:bg-gray-700 p-1 rounded-xl">
                <button
                  onClick={() => setUnit('metric')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${unit === 'metric' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  onClick={() => setUnit('imperial')}
                  className={`flex-1 py-3 text-sm font-bold rounded-lg transition-colors ${unit === 'imperial' ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow' : 'text-gray-600 dark:text-gray-300'}`}
                >
                  Imperial (lbs/ft)
                </button>
              </div>

              {unit === 'metric' ? (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Weight (kg)</label>
                    <input 
                      type="number"
                      min="0"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder="e.g. 70"
                      className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Height (cm)</label>
                    <input 
                      type="number"
                      min="0"
                      value={heightCm}
                      onChange={(e) => setHeightCm(e.target.value)}
                      placeholder="e.g. 175"
                      className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Weight (lbs)</label>
                    <input 
                      type="number"
                      min="0"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(e.target.value)}
                      placeholder="e.g. 150"
                      className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Height (ft)</label>
                      <input 
                        type="number"
                        min="0"
                        value={heightFt}
                        onChange={(e) => setHeightFt(e.target.value)}
                        placeholder="e.g. 5"
                        className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Height (in)</label>
                      <input 
                        type="number"
                        min="0"
                        max="11"
                        value={heightIn}
                        onChange={(e) => setHeightIn(e.target.value)}
                        placeholder="e.g. 9"
                        className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                      />
                    </div>
                  </div>
                </>
              )}

            </div>

            {/* Results Section */}
            <div className="w-full md:w-1/2">
              {!bmi || !category ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">⚖️</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Enter your weight and height to see your BMI result.</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm h-full flex flex-col justify-center text-center">
                  
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Your BMI Is</p>
                  
                  <div className="mb-4">
                    <span className={`text-6xl font-extrabold ${category.color}`}>{bmi}</span>
                  </div>
                  
                  <div className={`inline-block px-4 py-1 rounded-full bg-gray-100 dark:bg-gray-900 mb-6 font-bold uppercase tracking-wider text-sm ${category.color}`}>
                    {category.name}
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-sm mx-auto">
                    {category.desc}
                  </p>

                  {/* BMI Gauge / Scale visual */}
                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <div className="w-full h-3 flex rounded-full overflow-hidden mb-2">
                      <div className="bg-blue-500" style={{ width: '25%' }}></div>
                      <div className="bg-green-500" style={{ width: '25%' }}></div>
                      <div className="bg-yellow-500" style={{ width: '25%' }}></div>
                      <div className="bg-red-500" style={{ width: '25%' }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-400 px-1">
                      <span>Under</span>
                      <span>Normal</span>
                      <span>Over</span>
                      <span>Obese</span>
                    </div>
                  </div>
                  
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
