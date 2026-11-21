import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck, Lock, Eye, Cookie, Globe, HelpCircle } from 'lucide-react';
import { getPageContent } from '@/lib/pages-store';
import ReactMarkdown from 'react-markdown';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how CodeHubb Tools protects your privacy, manages cookies, and processes files locally in your browser without storing personal data.',
  alternates: { canonical: './' },
};

export default function PrivacyPolicyPage() {
  const pageData = getPageContent('privacy');
  const lastUpdated = pageData.lastUpdated || 'November 11, 2026';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 sm:p-12 border border-gray-100 dark:border-gray-700">
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-4">
            <ShieldCheck size={16} />
            <span>Transparency &amp; Trust</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            {pageData.title || 'Privacy Policy'}
          </h1>
          {pageData.subtitle && (
            <p className="text-base text-gray-600 dark:text-gray-300 mt-2">
              {pageData.subtitle}
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Last Updated: {lastUpdated} &bull; Effective Immediately
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
              <Lock className="text-indigo-600 dark:text-indigo-400" size={22} />
              1. Our Core Privacy Commitment: Zero File Retention
            </h2>
            <p>
              At <strong>CodeHubb Tools</strong> (accessible via <code>tanzeel.work</code>), user privacy is our highest fundamental priority. Unlike traditional cloud converter websites, the vast majority of our online utilities—including <strong>PDF merging, splitting, signing, OCR, SVG conversions, image editing, and code formatting</strong>—execute directly within your device&apos;s browser memory utilizing modern client-side technologies (WebAssembly, HTML5 Canvas, and Web Workers).
            </p>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 rounded-r-xl my-4 text-sm">
              <strong>Zero Server Storage Guarantee:</strong> Your confidential documents, financial statements, contracts, personal photos, and passwords processed through our client-side tools are <em>never</em> uploaded to, transmitted across, or stored on our servers. When you close your browser tab, the temporary memory buffer is completely cleared.
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Eye className="text-indigo-600 dark:text-indigo-400" size={22} />
              2. Information We Collect
            </h2>
            <p>
              We only collect information strictly necessary to provide authentic, reliable digital services:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account &amp; Authentication Data:</strong> If you register an account, we collect your name, email address, and an encrypted hash of your password (via BCrypt). We also support Google Single Sign-On (OAuth), which provides your verified email and profile picture.
              </li>
              <li>
                <strong>AI Assistant Interactions:</strong> If you choose to use our AI Assistants (such as Tanzeel AI, Urdu Translator, or Khutbat-e-Jumu&apos;ah) while logged in, chat messages are stored securely in our private SQLite database solely so you can review your past history.
              </li>
              <li>
                <strong>Technical Telemetry:</strong> Standard non-personally identifiable server logs (such as browser type, operating system, timestamp, and referring URL) to monitor uptime and prevent denial-of-service abuse.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Cookie className="text-indigo-600 dark:text-indigo-400" size={22} />
              3. Cookies and Advertising Partners (Google AdSense)
            </h2>
            <p>
              CodeHubb Tools uses cookies to maintain user session states (such as staying logged in and remembering dark/light theme preferences).
            </p>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-4 mb-2">
              Google AdSense &amp; DoubleClick DART Cookies
            </h3>
            <p>
              Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the internet.
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Google&apos;s use of advertising cookies enables it and its partners to serve personalized ads to our visitors based on their visit to our sites and/or other sites on the Internet.
              </li>
              <li>
                Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">Google Ads Settings</a>.
              </li>
              <li>
                Alternatively, you can opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold">www.aboutads.info</a>.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="text-indigo-600 dark:text-indigo-400" size={22} />
              4. GDPR &amp; CCPA Compliance (Your Privacy Rights)
            </h2>
            <p>
              Under global data protection regulations (including the EU General Data Protection Regulation and California Consumer Privacy Act), you retain comprehensive rights regarding your information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Right of Access:</strong> Request a full copy of any personal account data we hold about you.</li>
              <li><strong>Right of Rectification:</strong> Request correction of inaccurate information.</li>
              <li><strong>Right of Erasure (&quot;Right to be Forgotten&quot;):</strong> Request immediate and irreversible deletion of your account and associated chat sessions.</li>
              <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of whether you exercise privacy rights.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <HelpCircle className="text-indigo-600 dark:text-indigo-400" size={22} />
              5. Contact Us Regarding Privacy
            </h2>
            <p>
              If you have any questions, inquiries, or requests regarding this Privacy Policy or our security practices, please contact our Data Protection Officer:
            </p>
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-200 dark:border-gray-600 text-sm mt-3">
              <p><strong>CodeHubb Tools Support &amp; Compliance Team</strong></p>
              <p>Email: <a href="mailto:support@tanzeel.work" className="text-indigo-600 dark:text-indigo-400 underline font-medium">support@tanzeel.work</a></p>
              <p>Website: <Link href="/contact" className="text-indigo-600 dark:text-indigo-400 underline font-medium">https://tanzeel.work/contact</Link></p>
            </div>
          </section>

          </div>
        )}
      </div>
    </div>
  );
}
