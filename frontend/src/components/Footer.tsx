import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles, FileText, Bot, Image as ImageIcon, Wrench, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md">
                <Sparkles size={20} />
              </div>
              <span className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                CodeHubb <span className="text-indigo-600 dark:text-indigo-400">Tools</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-4 max-w-sm">
              The premier privacy-first suite of 80+ online utilities and specialized AI assistants. Process files in your browser with zero server data retention.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-400 text-xs font-semibold border border-green-200 dark:border-green-800/40">
              <ShieldCheck size={16} />
              <span>100% Client-Side Private &amp; Secure</span>
            </div>
          </div>

          {/* AI Assistants Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
              <Bot size={16} className="text-indigo-500" />
              <span>AI Assistants</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/ai-assistants/tanzeel-ai" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Tanzeel AI
                </Link>
              </li>
              <li>
                <Link href="/ai-assistants/urdu-translator" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Urdu Translator
                </Link>
              </li>
              <li>
                <Link href="/ai-assistants/master-tutor" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Master Tutor
                </Link>
              </li>
              <li>
                <Link href="/ai-assistants/khutbat-e-jumuah" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Khutbat-e-Jumu&apos;ah
                </Link>
              </li>
              <li>
                <Link href="/ai-assistants" className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  View All Assistants &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Tools Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
              <FileText size={16} className="text-green-500" />
              <span>Popular Tools</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/tools/merge-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Merge PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/split-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Split PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/sign-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Sign PDF
                </Link>
              </li>
              <li>
                <Link href="/tools/ai-image-upscaler" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  AI Image Upscaler
                </Link>
              </li>
              <li>
                <Link href="/tools/svg-to-png" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  SVG to PNG
                </Link>
              </li>
              <li>
                <Link href="/tools/html-to-pdf" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  HTML to PDF
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Company Col */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white mb-4 flex items-center gap-1.5">
              <Globe size={16} className="text-purple-500" />
              <span>Company &amp; Trust</span>
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-gray-900 dark:text-white font-semibold">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium text-gray-900 dark:text-white font-semibold">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  Tutorials &amp; Guides
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium">
                  CodeHubb Pro
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} CodeHubb Tools (<code>tanzeel.work</code>). All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:underline">Privacy</Link>
            <Link href="/terms" className="hover:underline">Terms</Link>
            <Link href="/about" className="hover:underline">About</Link>
            <Link href="/contact" className="hover:underline">Contact</Link>
            <a href="/sitemap.xml" className="hover:underline" target="_blank" rel="noopener noreferrer">Sitemap</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
