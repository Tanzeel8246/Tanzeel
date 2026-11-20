'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PsdEditorPage() {
  const [isLoading, setIsLoading] = useState(true);

  // When Photopea loads, it might take a moment. We'll hide the loading state after 2 seconds
  // or ideally we could listen for a message from the iframe if Photopea sends one.
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-[#474747] text-white">
      {/* Custom Header to integrate with our app but keep maximum screen space */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#2d2d2d] border-b border-[#1c1c1c] shrink-0 shadow-sm z-10">
        <div className="flex items-center space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white flex items-center text-sm font-medium transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Back to Tools
          </Link>
          <div className="h-4 w-px bg-gray-600"></div>
          <h1 className="font-bold text-sm tracking-wide text-gray-100 flex items-center">
            <span className="bg-indigo-500 text-white text-[10px] px-1.5 py-0.5 rounded mr-2 font-bold uppercase tracking-wider">Pro</span>
            PSD Editor
          </h1>
        </div>
        <div className="text-xs text-gray-400">
          Powered by Photopea
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 relative bg-[#474747]">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[#474747]">
            <svg className="animate-spin h-10 w-10 text-indigo-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-300 font-medium">Initializing Editor Workspace...</p>
          </div>
        )}
        
        {/* Photopea API integration via iframe */}
        <iframe 
          src="https://www.photopea.com" 
          className="w-full h-full border-none absolute inset-0"
          title="PSD Editor Workspace"
          allow="clipboard-read; clipboard-write; camera"
          onLoad={() => setIsLoading(false)}
        ></iframe>
      </div>
    </div>
  );
}
