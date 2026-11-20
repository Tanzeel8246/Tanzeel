'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import CryptoJS from 'crypto-js';
import { useSession } from 'next-auth/react';

export default function FileEncryptorPage() {
  const { data: session } = useSession();
  const isPremiumUser = session?.user && ((session.user as any).role === 'PRO' || (session.user as any).role === 'ADMIN');

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      // Limit file size to 50MB to prevent browser crash
      if (selectedFile.size > 50 * 1024 * 1024) {
        setError('File is too large. Please select a file under 50MB for browser-based encryption.');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      setSuccess(false);
    }
  };

  const encryptFile = () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileDataUrl = e.target?.result as string;
        
        // Encrypt the Data URL (which contains file type and base64 data)
        const encrypted = CryptoJS.AES.encrypt(fileDataUrl, password).toString();
        
        // Create a blob from encrypted text
        const blob = new Blob([encrypted], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        // Download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file.name}.enc`;
        link.click();
        
        setTimeout(() => URL.revokeObjectURL(url), 100);
        setSuccess(true);
      } catch (err: any) {
        console.error(err);
        setError('Failed to encrypt file. It might be too large for your browser memory.');
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file.');
      setIsProcessing(false);
    };
    
    // Read as Data URL to preserve mime type automatically
    reader.readAsDataURL(file);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
              File Encryptor (Lock File)
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Securely encrypt your photos, videos, or documents with AES-256 military-grade encryption. Everything happens inside your browser.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center">
            
            <div className="w-full max-w-2xl">
              
              {/* File Input */}
              <div className="mb-8">
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-indigo-50 dark:bg-indigo-900/10 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    <p className="mb-2 text-lg text-gray-500 dark:text-gray-400"><span className="font-semibold text-indigo-600 dark:text-indigo-400">Select File to Encrypt</span></p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Any file type up to 50MB</p>
                  </div>
                  <input type="file" className="hidden" onChange={handleFileChange} />
                </label>
                
                {file && (
                  <div className="mt-4 p-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <svg className="w-6 h-6 text-indigo-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatBytes(file.size)}</span>
                      </div>
                    </div>
                    <button onClick={() => setFile(null)} className="text-red-500 hover:text-red-700 text-xs font-bold uppercase tracking-wider ml-4 flex-shrink-0">Remove</button>
                  </div>
                )}
              </div>

              {/* Password Input */}
              {file && (
                <div className="space-y-6 mb-8 p-6 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm">
                  <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Set Password</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter a strong password"
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <input 
                      type="password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                    />
                  </div>
                  <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold flex items-start space-x-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                    <span>Warning: If you forget this password, the file cannot be recovered! Keep it safe.</span>
                  </div>
                </div>
              )}

              {error && <div className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-medium text-center">{error}</div>}
              {success && <div className="mb-6 p-4 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-xl font-medium text-center">File encrypted successfully! Download started.</div>}
              
              {!isPremiumUser ? (
                <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 p-8 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <span className="text-8xl">👑</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2 relative z-10">Premium Feature</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 relative z-10">
                    Military-grade file encryption is a Pro feature. Upgrade your account for just $1.99/mo to unlock this and all other premium tools.
                  </p>
                  <Link href="/#pricing" className="inline-block px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all relative z-10">
                    Upgrade to Pro &rarr;
                  </Link>
                  {!session && (
                    <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 relative z-10">
                      Already have an account? <Link href="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Log in</Link>
                    </p>
                  )}
                </div>
              ) : (
                <button
                  onClick={encryptFile}
                  disabled={!file || !password || isProcessing}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Encrypting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      <span>Encrypt & Download (.enc)</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
