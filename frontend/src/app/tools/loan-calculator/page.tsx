'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LoanCalculatorPage() {
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('5');
  const [tenure, setTenure] = useState('12');
  const [tenureType, setTenureType] = useState<'months' | 'years'>('months');
  
  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);

  useEffect(() => {
    calculateEMI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loanAmount, interestRate, tenure, tenureType]);

  const calculateEMI = () => {
    const p = parseFloat(loanAmount);
    const r = parseFloat(interestRate);
    const t = parseFloat(tenure);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      return;
    }

    const n = tenureType === 'years' ? t * 12 : t; // total months
    const monthlyRate = r / 12 / 100;

    let calculatedEmi = 0;
    if (monthlyRate === 0) {
      calculatedEmi = p / n;
    } else {
      calculatedEmi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    }

    const totalAmt = calculatedEmi * n;
    const totalInt = totalAmt - p;

    setEmi(calculatedEmi);
    setTotalPayment(totalAmt);
    setTotalInterest(totalInt);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
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
              Loan / EMI Calculator
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Calculate your Equated Monthly Installment (EMI) for home loans, car loans, or personal loans.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-12 items-start">
            
            {/* Input Section */}
            <div className="w-full md:w-1/2 space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Loan Amount</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold">$</span>
                  </div>
                  <input 
                    type="number"
                    min="0"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full pl-10 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Annual Interest Rate (%)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold">%</span>
                  </div>
                  <input 
                    type="number"
                    min="0"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full pl-10 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Loan Tenure</label>
                  <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    <button 
                      onClick={() => setTenureType('months')}
                      className={`px-3 py-1 text-xs font-bold rounded-md ${tenureType === 'months' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow' : 'text-gray-500'}`}
                    >
                      Months
                    </button>
                    <button 
                      onClick={() => setTenureType('years')}
                      className={`px-3 py-1 text-xs font-bold rounded-md ${tenureType === 'years' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow' : 'text-gray-500'}`}
                    >
                      Years
                    </button>
                  </div>
                </div>
                <input 
                  type="number"
                  min="1"
                  value={tenure}
                  onChange={(e) => setTenure(e.target.value)}
                  className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

            </div>

            {/* Results Section */}
            <div className="w-full md:w-1/2">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 shadow-sm h-full flex flex-col justify-center relative">
                
                <div className="text-center mb-8 bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2">Monthly EMI</p>
                  <p className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white">
                    {formatCurrency(emi)}
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-400 mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Principal Amount</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(parseFloat(loanAmount) || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-400 mr-3"></div>
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Total Interest</span>
                    </div>
                    <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(totalInterest)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-indigo-600 mr-3"></div>
                      <span className="text-gray-900 dark:text-white font-bold">Total Payment</span>
                    </div>
                    <span className="text-indigo-600 dark:text-indigo-400 font-extrabold text-xl">{formatCurrency(totalPayment)}</span>
                  </div>
                </div>

                {/* Simple Progress bar for visual representation */}
                {totalPayment > 0 && (
                  <div className="mt-8">
                    <div className="w-full h-4 flex rounded-full overflow-hidden">
                      <div className="bg-blue-400" style={{ width: `${(parseFloat(loanAmount) / totalPayment) * 100}%` }}></div>
                      <div className="bg-orange-400" style={{ width: `${(totalInterest / totalPayment) * 100}%` }}></div>
                    </div>
                  </div>
                )}
                
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
