'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);

  const generatePassword = () => {
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    if (charset === '') {
      setPassword('Please select at least one option.');
      return;
    }

    let newPassword = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);

    for (let i = 0; i < length; i++) {
      newPassword += charset[randomValues[i] % charset.length];
    }
    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols]);

  const copyToClipboard = () => {
    if (password && password !== 'Please select at least one option.') {
      navigator.clipboard.writeText(password);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 sm:p-12 border-b border-gray-200 dark:border-gray-700 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
              Secure Password Generator
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Create strong, random passwords instantly to keep your accounts secure.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            {/* Password Display */}
            <div className="relative mb-8 group">
              <div className="w-full bg-white dark:bg-gray-700 p-6 rounded-xl shadow-inner border-2 border-gray-200 dark:border-gray-600 text-center flex items-center justify-center min-h-[5rem] overflow-hidden">
                <span className="text-2xl sm:text-3xl font-mono text-gray-800 dark:text-white break-all select-all">
                  {password}
                </span>
              </div>
              <button 
                onClick={copyToClipboard}
                className="absolute top-1/2 right-4 -translate-y-1/2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/50 dark:hover:bg-indigo-800/80 dark:text-indigo-300 p-2 rounded-lg transition-colors font-medium text-sm"
              >
                Copy
              </button>
            </div>

            {/* Controls */}
            <div className="space-y-8">
              {/* Length Slider */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password Length</label>
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{length}</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="64" 
                  value={length} 
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-indigo-600"
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Uppercase (A-Z)', state: includeUppercase, setter: setIncludeUppercase },
                  { label: 'Lowercase (a-z)', state: includeLowercase, setter: setIncludeLowercase },
                  { label: 'Numbers (0-9)', state: includeNumbers, setter: setIncludeNumbers },
                  { label: 'Symbols (!@#$)', state: includeSymbols, setter: setIncludeSymbols },
                ].map((opt, idx) => (
                  <label key={idx} className="flex items-center space-x-3 bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 cursor-pointer shadow-sm hover:border-indigo-400 transition-colors">
                    <input 
                      type="checkbox" 
                      checked={opt.state} 
                      onChange={(e) => opt.setter(e.target.checked)}
                      className="w-5 h-5 text-indigo-600 bg-gray-100 border-gray-300 rounded focus:ring-indigo-500 dark:focus:ring-indigo-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <span className="text-gray-700 dark:text-gray-200 font-medium select-none">{opt.label}</span>
                  </label>
                ))}
              </div>

              {/* Generate Button */}
              <button 
                onClick={generatePassword}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg shadow-lg transition-transform hover:scale-[1.02]"
              >
                Generate New Password
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
