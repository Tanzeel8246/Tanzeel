import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, Sparkles, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing & Plans',
  description: 'Choose the right plan for CodeHubb Tools. Access 84+ free developer, AI, PDF, and media utilities or upgrade to Pro for advanced features.',
  alternates: {
    canonical: './',
  },
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-4 border border-indigo-100 dark:border-indigo-800">
          <Sparkles size={16} /> Transparent Pricing
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4">
          Simple, Affordable Plans
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Use over 84+ web tools completely free, or upgrade to Pro for enterprise-grade encryption, higher limits, and priority AI processing.
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {/* Free Plan */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm flex flex-col justify-between text-left">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Free Plan</h2>
                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold rounded-full">
                  Forever Free
                </span>
              </div>
              <div className="my-6">
                <span className="text-5xl font-black text-gray-900 dark:text-white">$0</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">/ month</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Everything you need for everyday tasks, file operations, and AI assistance.
              </p>
              <ul className="space-y-3.5 mb-8 text-sm">
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check size={18} className="text-green-500 mr-3 flex-shrink-0" />
                  Access to 84+ Free Web Tools
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check size={18} className="text-green-500 mr-3 flex-shrink-0" />
                  PDF Tools (Merge, Split, Rotate, Convert)
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check size={18} className="text-green-500 mr-3 flex-shrink-0" />
                  Client-side AI Background Remover
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check size={18} className="text-green-500 mr-3 flex-shrink-0" />
                  Standard AI Assistants
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check size={18} className="text-green-500 mr-3 flex-shrink-0" />
                  No Account Required for Most Tools
                </li>
              </ul>
            </div>
            <Link
              href="/"
              className="w-full py-3.5 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl text-center transition-colors"
            >
              Start Using Tools
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-b from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-gray-900 rounded-3xl p-8 border-2 border-indigo-500 shadow-xl flex flex-col justify-between text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-wider">
              Popular
            </div>
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  CodeHubb Pro <Zap size={20} className="text-indigo-500 fill-indigo-500" />
                </h2>
              </div>
              <div className="my-6">
                <span className="text-5xl font-black text-gray-900 dark:text-white">$1.99</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">/ month</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                For power users who need advanced security, unlimited encryption, and priority AI speeds.
              </p>
              <ul className="space-y-3.5 mb-8 text-sm">
                <li className="flex items-center text-gray-900 dark:text-white font-semibold">
                  <Check size={18} className="text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
                  Everything in Free, plus:
                </li>
                <li className="flex items-center text-gray-900 dark:text-white font-semibold">
                  <Shield size={18} className="text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
                  Military-Grade AES-256 File Encryptor
                </li>
                <li className="flex items-center text-gray-900 dark:text-white font-semibold">
                  <Check size={18} className="text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
                  Priority AI Assistant processing & unlimited turns
                </li>
                <li className="flex items-center text-gray-900 dark:text-white font-semibold">
                  <Check size={18} className="text-indigo-600 dark:text-indigo-400 mr-3 flex-shrink-0" />
                  Persistent Cloud Chat History
                </li>
                <li className="flex items-center text-gray-700 dark:text-gray-300">
                  <Check size={18} className="text-green-500 mr-3 flex-shrink-0" />
                  100% Ad-Free Experience
                </li>
              </ul>
            </div>
            <Link
              href="/#pricing"
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-center shadow-lg shadow-indigo-500/25 transition-all"
            >
              Upgrade to Pro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
