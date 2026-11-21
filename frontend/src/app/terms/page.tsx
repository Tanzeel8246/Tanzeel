import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, CheckCircle, AlertTriangle, ShieldCheck, Scale, HelpCircle } from 'lucide-react';
import { getPageContent } from '@/lib/pages-store';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Terms of Service for CodeHubb Tools covering user rights, acceptable usage of online developer and AI utilities, and liability disclaimers.',
  alternates: { canonical: './' },
};

export default function TermsOfServicePage() {
  const pageData = getPageContent('terms');
  const lastUpdated = pageData.lastUpdated || 'November 11, 2026';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-4">
            <Scale size={16} />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            {pageData.title || 'Terms of Service'}
          </h1>
          {pageData.subtitle && (
            <p className="text-base text-gray-600 dark:text-gray-300 mt-2">
              {pageData.subtitle}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last Updated: {lastUpdated} &bull; Please read carefully
          </p>
        </div>

        {/* Content Body: Custom Markdown if provided by admin, otherwise standard compliance verbiage */}
        {pageData.content ? (
          <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed">
            <ReactMarkdown>{pageData.content}</ReactMarkdown>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="text-indigo-600 dark:text-indigo-400" size={22} />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing the web applications, APIs, and utilities hosted on <strong>CodeHubb Tools</strong> (<code>tanzeel.work</code>), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms of Service. If you do not agree with any portion of these terms, you must refrain from using the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="text-indigo-600 dark:text-indigo-400" size={22} />
              2. Intellectual Property &amp; User Content Ownership
            </h2>
            <p>
              <strong>You retain 100% full and unconditional ownership</strong> of any files, documents, source code, images, audio, video, or data you upload, process, convert, or generate through our platform. CodeHubb Tools claims zero ownership, license, or distribution rights over your content.
            </p>
            <p className="mt-2">
              The CodeHubb Tools platform, branding, logos, layout designs, and custom software code are the intellectual property of CodeHubb Tools and protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="text-indigo-600 dark:text-indigo-400" size={22} />
              3. Permitted &amp; Acceptable Use
            </h2>
            <p>
              You agree to use our tools exclusively for lawful personal, professional, educational, or commercial purposes. You agree NOT to:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Use the platform to process, generate, or distribute illegal, infringing, defamatory, or harmful content.</li>
              <li>Attempt to reverse-engineer, decompile, or launch automated scraping/denial-of-service attacks against our APIs or backend servers.</li>
              <li>Abuse free AI Assistant quotas through automated scripting or spamming queries.</li>
              <li>Impersonate any person, brand, or entity.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-indigo-600 dark:text-indigo-400" size={22} />
              4. Disclaimer of Warranties &amp; Limitation of Liability
            </h2>
            <p>
              CodeHubb Tools is provided on an <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong> basis without warranties of any kind, whether express or implied.
            </p>
            <p className="mt-2">
              While we engineer our utilities to the highest standards of reliability and accuracy, CodeHubb Tools and its operators shall not be held liable for any direct, indirect, incidental, consequential, or punitive damages resulting from your use of, or inability to use, our services—including but not limited to loss of data, corrupted document conversions, or system downtime.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="text-indigo-600 dark:text-indigo-400" size={22} />
              5. Contact &amp; Governance
            </h2>
            <p>
              These Terms shall be governed by and construed in accordance with standard international commercial laws. For any questions regarding these terms:
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 text-sm mt-3">
              <p>Email: <a href="mailto:support@tanzeel.work" className="text-indigo-600 dark:text-indigo-400 underline font-medium">support@tanzeel.work</a></p>
              <p>Inquiries: <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 underline font-medium">Contact Form</Link></p>
            </div>
          </section>

          </div>
        )}
      </div>
    </div>
  );
}
