'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DiscountCalculatorPage() {
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [discountValue, setDiscountValue] = useState<string>('');
  const [discountType, setDiscountType] = useState<'percent' | 'fixed'>('percent');
  const [taxPercent, setTaxPercent] = useState<string>('0');
  
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [savings, setSavings] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

  useEffect(() => {
    calculateDiscount();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [originalPrice, discountValue, discountType, taxPercent]);

  const calculateDiscount = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountValue);
    const tax = parseFloat(taxPercent);

    if (isNaN(price) || price < 0) {
      resetResults();
      return;
    }

    let calculatedSavings = 0;

    if (!isNaN(discount) && discount > 0) {
      if (discountType === 'percent') {
        calculatedSavings = price * (discount / 100);
      } else {
        calculatedSavings = discount;
      }
    }

    // Ensure savings don't exceed price
    if (calculatedSavings > price) {
      calculatedSavings = price;
    }

    const priceAfterDiscount = price - calculatedSavings;
    let calculatedTax = 0;
    
    if (!isNaN(tax) && tax > 0) {
      calculatedTax = priceAfterDiscount * (tax / 100);
    }

    setSavings(calculatedSavings);
    setTaxAmount(calculatedTax);
    setFinalPrice(priceAfterDiscount + calculatedTax);
  };

  const resetResults = () => {
    setFinalPrice(0);
    setSavings(0);
    setTaxAmount(0);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
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
              Discount Calculator
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Quickly calculate the final price after applying a discount and see how much you save.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col md:flex-row gap-12 items-start">
            
            {/* Input Section */}
            <div className="w-full md:w-1/2 space-y-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Original Price</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold">$</span>
                  </div>
                  <input 
                    type="number"
                    min="0"
                    step="0.01"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    placeholder="100.00"
                    className="w-full pl-10 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Discount</label>
                  <div className="flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                    <button 
                      onClick={() => setDiscountType('percent')}
                      className={`px-3 py-1 text-xs font-bold rounded-md ${discountType === 'percent' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow' : 'text-gray-500'}`}
                    >
                      % Off
                    </button>
                    <button 
                      onClick={() => setDiscountType('fixed')}
                      className={`px-3 py-1 text-xs font-bold rounded-md ${discountType === 'fixed' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow' : 'text-gray-500'}`}
                    >
                      $ Off
                    </button>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold">{discountType === 'percent' ? '%' : '$'}</span>
                  </div>
                  <input 
                    type="number"
                    min="0"
                    step="any"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percent' ? '20' : '15.00'}
                    className="w-full pl-10 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Sales Tax (Optional)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-500 font-bold">%</span>
                  </div>
                  <input 
                    type="number"
                    min="0"
                    step="0.1"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(e.target.value)}
                    className="w-full pl-10 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-bold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>

            </div>

            {/* Results Section */}
            <div className="w-full md:w-1/2">
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl p-8 shadow-sm h-full flex flex-col justify-center relative overflow-hidden">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 dark:bg-green-900/10 rounded-bl-full -mr-16 -mt-16"></div>
                
                <div className="relative z-10 text-center mb-8">
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Final Price</p>
                  <p className="text-5xl font-extrabold text-gray-900 dark:text-white">
                    {formatCurrency(finalPrice)}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-700 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">Original Price</span>
                    <span className="text-gray-900 dark:text-white font-bold">{formatCurrency(parseFloat(originalPrice) || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center text-green-600 dark:text-green-400">
                    <span className="font-medium">You Save</span>
                    <span className="font-bold">{formatCurrency(savings)}</span>
                  </div>

                  {taxAmount > 0 && (
                    <div className="flex justify-between items-center text-red-500">
                      <span className="font-medium">Tax</span>
                      <span className="font-bold">+{formatCurrency(taxAmount)}</span>
                    </div>
                  )}
                </div>

                {savings > 0 && (
                  <div className="mt-8 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-4 rounded-xl text-center font-bold text-sm flex items-center justify-center space-x-2">
                    <span className="text-xl">🎉</span>
                    <span>Great deal! You are saving {formatCurrency(savings)}</span>
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
