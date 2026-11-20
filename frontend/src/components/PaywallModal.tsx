'use client';

import React from 'react';
import Link from 'next/link';
import { useUsage } from '@/context/UsageContext';

export default function PaywallModal() {
  const { showPaywall, setShowPaywall, maxUsage } = useUsage();

  if (!showPaywall) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setShowPaywall(false)}
      ></div>
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[51] w-full max-w-md p-6">
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transform transition-all">
          <div className="p-8 text-center relative">
            <button 
              onClick={() => setShowPaywall(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto shadow-lg mb-6 shadow-indigo-500/30">
              <span className="text-3xl">🚀</span>
            </div>
            
            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Daily Limit Reached
            </h3>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
              You've used your {maxUsage} free tool runs for today. Upgrade to Pro for unlimited access and premium features!
            </p>
            
            <div className="space-y-3">
              <Link 
                href="/#pricing" 
                onClick={() => setShowPaywall(false)}
                className="w-full flex items-center justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/30"
              >
                View Pro Plans
              </Link>
              <button 
                onClick={() => setShowPaywall(false)}
                className="w-full py-4 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
