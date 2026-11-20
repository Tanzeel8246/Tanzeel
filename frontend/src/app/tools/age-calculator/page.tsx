'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AgeCalculatorPage() {
  const [dob, setDob] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);
  const [extraInfo, setExtraInfo] = useState<{ totalMonths: number; totalWeeks: number; totalDays: number } | null>(null);

  useEffect(() => {
    // Set today's date as default target date
    const today = new Date().toISOString().split('T')[0];
    setTargetDate(today);
  }, []);

  useEffect(() => {
    calculateAge();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dob, targetDate]);

  const calculateAge = () => {
    if (!dob || !targetDate) {
      setAge(null);
      setExtraInfo(null);
      return;
    }

    const birthDate = new Date(dob);
    const currentDate = new Date(targetDate);

    if (birthDate > currentDate) {
      setAge(null);
      setExtraInfo(null);
      return; // Invalid date
    }

    // Calculate Years, Months, Days
    let years = currentDate.getFullYear() - birthDate.getFullYear();
    let months = currentDate.getMonth() - birthDate.getMonth();
    let days = currentDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      // Get days in previous month
      const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
      days += prevMonthDate.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setAge({ years, months, days });

    // Calculate Totals
    const diffTime = Math.abs(currentDate.getTime() - birthDate.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalMonths = (years * 12) + months;
    const totalWeeks = Math.floor(totalDays / 7);
    
    setExtraInfo({ totalMonths, totalWeeks, totalDays });
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
              Age Calculator
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Calculate your exact age in years, months, days, and even weeks.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-12 items-start">
            
            {/* Input Section */}
            <div className="w-full md:w-1/2 space-y-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Date of Birth
                </label>
                <input 
                  type="date" 
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Calculate age at the date of
                </label>
                <input 
                  type="date" 
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="w-full md:w-1/2">
              {!age ? (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🎂</span>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Please select a valid date of birth to see the results.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Main Result Box */}
                  <div className="bg-indigo-600 rounded-2xl p-8 text-center text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white opacity-10 rounded-full"></div>
                    
                    <h3 className="text-indigo-100 text-sm font-bold uppercase tracking-wider mb-4">Your Age Is</h3>
                    
                    <div className="flex justify-center items-end space-x-2">
                      <div className="text-center">
                        <span className="text-5xl font-extrabold">{age.years}</span>
                        <span className="block text-xs font-medium uppercase mt-1">Years</span>
                      </div>
                      <span className="text-3xl font-light text-indigo-300 pb-5">,</span>
                      <div className="text-center">
                        <span className="text-5xl font-extrabold">{age.months}</span>
                        <span className="block text-xs font-medium uppercase mt-1">Months</span>
                      </div>
                      <span className="text-3xl font-light text-indigo-300 pb-5">,</span>
                      <div className="text-center">
                        <span className="text-5xl font-extrabold">{age.days}</span>
                        <span className="block text-xs font-medium uppercase mt-1">Days</span>
                      </div>
                    </div>
                  </div>

                  {/* Extra Info */}
                  {extraInfo && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">Total Time Alive</h4>
                      
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400">Total Months</span>
                          <span className="font-bold text-gray-900 dark:text-white text-lg">{extraInfo.totalMonths.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-gray-700">
                          <span className="text-gray-500 dark:text-gray-400">Total Weeks</span>
                          <span className="font-bold text-gray-900 dark:text-white text-lg">{extraInfo.totalWeeks.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500 dark:text-gray-400">Total Days</span>
                          <span className="font-bold text-gray-900 dark:text-white text-lg">{extraInfo.totalDays.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
