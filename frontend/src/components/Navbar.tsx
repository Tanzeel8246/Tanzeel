'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

import ThemeToggle from './ThemeToggle';

const megaMenuCategories = [
  {
    name: 'AI Assistants',
    icon: '🤖',
    tools: [
      { name: 'Tanzeel AI', path: '/ai-assistants/tanzeel-ai' },
      { name: 'Translator', path: '/ai-assistants/urdu-translator' },
      { name: 'Khutbat', path: '/ai-assistants/khutbat-e-jumuah' },
      { name: 'Master Tutor', path: '/ai-assistants/master-tutor' },
    ]
  },
  {
    name: 'PDF Tools',
    icon: '📄',
    tools: [
      { name: 'Merge PDF', path: '/tools/merge-pdf' },
      { name: 'Split PDF', path: '/tools/split-pdf' },
      { name: 'PDF to Word', path: '/tools/pdf-to-word' },
      { name: 'Sign PDF', path: '/tools/sign-pdf' },
    ]
  },
  {
    name: 'Image & Media',
    icon: '🖼️',
    tools: [
      { name: 'Image Converter', path: '/tools/image-convert' },
      { name: 'Image Resizer', path: '/tools/image-resize' },
      { name: 'Color Extractor', path: '/tools/color-extractor' },
      { name: 'Remove Background', path: '/tools/background-remover' },
    ]
  },
  {
    name: 'Text & Formatting',
    icon: '📝',
    tools: [
      { name: 'Word Counter', path: '/tools/word-counter' },
      { name: 'Case Converter', path: '/tools/case-converter' },
      { name: 'HTML Minifier', path: '/tools/html-minifier' },
      { name: 'JSON Formatter', path: '/tools/json-formatter' },
    ]
  },
  {
    name: 'Web & Dev',
    icon: '💻',
    tools: [
      { name: 'Gradient Generator', path: '/tools/gradient-generator' },
      { name: 'Box Shadow', path: '/tools/box-shadow-generator' },
      { name: 'CSS Minifier', path: '/tools/css-minifier' },
      { name: 'URL Encoder', path: '/tools/url-encoder' },
    ]
  },
  {
    name: 'Calculators',
    icon: '🧮',
    tools: [
      { name: 'Age Calculator', path: '/tools/age-calculator' },
      { name: 'Discount Calculator', path: '/tools/discount-calculator' },
      { name: 'BMI Calculator', path: '/tools/bmi-calculator' },
      { name: 'Loan Calculator', path: '/tools/loan-calculator' },
    ]
  },
  {
    name: 'Security & Crypto',
    icon: '🔒',
    tools: [
      { name: 'Password Generator', path: '/tools/password-generator' },
      { name: 'File Encryptor', path: '/tools/file-encryptor' },
      { name: 'File Decryptor', path: '/tools/file-decryptor' },
      { name: 'Hash Generator', path: '/tools/hash-generator' },
    ]
  }
];

export default function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Row: Logo & Controls */}
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center space-x-2">
            <span className="text-3xl drop-shadow-md">⚡</span>
            <Link href="/" className="font-extrabold text-2xl tracking-tight text-gray-900 dark:text-white">
              CodeHubb <span className="text-indigo-600 dark:text-indigo-400">Tools</span>
            </Link>
          </div>
          
          {/* Controls: Premium, Theme, Auth (Desktop) */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/#pricing" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              Premium
            </Link>

            <ThemeToggle />
            
            {/* Auth Buttons */}
            {session ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-800">
                {(session.user as any)?.role === 'ADMIN' && (
                  <Link href="/admin" className="text-xs px-3 py-1 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold rounded-full hover:bg-red-200 transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2 cursor-pointer group">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-extrabold shadow-md group-hover:shadow-lg transition-all">
                    {session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-sm font-bold text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                <Link href="/login" className="text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Log in
                </Link>
                <Link href="/register" className="text-sm font-bold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5">
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom Row: Categories (Desktop) */}
        <div className="hidden md:flex justify-center items-center h-12 border-t border-gray-100 dark:border-gray-800/50 space-x-8">
          <Link href="/" className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors h-full flex items-center">
            Home
          </Link>

          {megaMenuCategories.map((category, idx) => (
            <div 
              key={idx}
              className="h-full flex items-center relative group"
            >
              <button className="text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1 h-full">
                {category.name}
                <svg className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 origin-top opacity-0 scale-95 invisible group-hover:opacity-100 group-hover:scale-100 group-hover:visible z-50"
              >
                <div className="p-3">
                  <ul className="space-y-1">
                    {category.tools.map((tool, tIdx) => (
                      <li key={tIdx}>
                        {(tool as any).comingSoon ? (
                          <div className="text-xs text-gray-400 dark:text-gray-500 font-medium flex items-center justify-between opacity-70 p-2">
                            <span>{tool.name}</span>
                            <span className="text-[9px] font-bold bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400 px-1.5 py-0.5 rounded-sm ml-2 whitespace-nowrap">Soon</span>
                          </div>
                        ) : (
                          <Link href={tool.path} className="text-xs text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium transition-colors p-2 rounded-lg block">
                            {tool.name}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-center">
                    <Link href={`/#${category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors p-2 block">
                      View all {category.name} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-6 space-y-6 max-h-[85vh] overflow-y-auto">
            {/* Mobile Auth */}
            <div className="flex items-center space-x-4 pb-4 border-b border-gray-100 dark:border-gray-800">
              {session ? (
                <>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-base font-extrabold shadow-md">
                    {session.user?.name?.[0] || session.user?.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 flex justify-between items-center">
                    <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{session.user?.name || 'User'}</span>
                    <button onClick={() => signOut()} className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors">Logout</button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center text-sm font-bold text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                    Log in
                  </Link>
                  <Link href="/register" onClick={() => setIsMobileMenuOpen(false)} className="flex-1 text-center text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-2 transition-colors">
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Premium Link for Mobile */}
            <Link href="/#pricing" onClick={() => setIsMobileMenuOpen(false)} className="block text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              Premium Plans &rarr;
            </Link>

            {/* Mobile Categories */}
            <div className="space-y-4">
              {megaMenuCategories.map((category, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="font-bold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2 border-b border-gray-50 dark:border-gray-800/50 pb-1">
                    <span>{category.icon}</span> {category.name}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pl-6">
                    {category.tools.map((tool, tIdx) => (
                      <div key={tIdx}>
                        {(tool as any).comingSoon ? (
                           <div className="text-xs text-gray-400 dark:text-gray-500 py-1 opacity-70">
                             {tool.name} <span className="text-[8px] bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 px-1 rounded">Soon</span>
                           </div>
                        ) : (
                          <Link
                            href={tool.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-xs text-gray-600 dark:text-gray-400 hover:text-indigo-600 py-1 block"
                          >
                            {tool.name}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
