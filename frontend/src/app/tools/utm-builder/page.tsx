'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UtmBuilderPage() {
  const [url, setUrl] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');
  
  const [generatedUrl, setGeneratedUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    generateUtmUrl();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, source, medium, campaign, term, content]);

  const generateUtmUrl = () => {
    if (!url) {
      setGeneratedUrl('');
      return;
    }

    try {
      // Validate URL (just checking if it starts with http/https broadly)
      let baseUrl = url;
      if (!/^https?:\/\//i.test(baseUrl)) {
        baseUrl = 'https://' + baseUrl;
      }
      
      const urlObj = new URL(baseUrl);
      
      if (source) urlObj.searchParams.set('utm_source', source);
      if (medium) urlObj.searchParams.set('utm_medium', medium);
      if (campaign) urlObj.searchParams.set('utm_campaign', campaign);
      if (term) urlObj.searchParams.set('utm_term', term);
      if (content) urlObj.searchParams.set('utm_content', content);
      
      setGeneratedUrl(urlObj.toString());
    } catch (e) {
      // If invalid URL is typed before completion, just don't crash
      setGeneratedUrl('Please enter a valid website URL to see the result.');
    }
  };

  const copyToClipboard = () => {
    if (!generatedUrl || generatedUrl.startsWith('Please')) return;
    navigator.clipboard.writeText(generatedUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const resetForm = () => {
    setUrl('');
    setSource('');
    setMedium('');
    setCampaign('');
    setTerm('');
    setContent('');
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
              UTM Link Builder
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Easily add campaign parameters to URLs so you can track Custom Campaigns in Google Analytics.
            </p>
          </div>

          <div className="p-8 sm:p-12 bg-gray-50 dark:bg-gray-800/50">
            
            <div className="space-y-6 max-w-2xl mx-auto mb-12">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input 
                  type="url" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
                <p className="mt-1 text-xs text-gray-500">The full website URL (e.g. https://www.example.com)</p>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Campaign Source <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="e.g. google, newsletter, facebook"
                  className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
                <p className="mt-1 text-xs text-gray-500">The referrer (e.g. google, newsletter)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Medium
                  </label>
                  <input 
                    type="text" 
                    value={medium}
                    onChange={(e) => setMedium(e.target.value)}
                    placeholder="e.g. cpc, banner, email"
                    className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                  <p className="mt-1 text-xs text-gray-500">Marketing medium (e.g. cpc, banner)</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Name
                  </label>
                  <input 
                    type="text" 
                    value={campaign}
                    onChange={(e) => setCampaign(e.target.value)}
                    placeholder="e.g. spring_sale"
                    className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                  <p className="mt-1 text-xs text-gray-500">Product, promo code, or slogan</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Term
                  </label>
                  <input 
                    type="text" 
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="e.g. running+shoes"
                    className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                  <p className="mt-1 text-xs text-gray-500">Identify the paid keywords</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Campaign Content
                  </label>
                  <input 
                    type="text" 
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="e.g. logolink or textlink"
                    className="w-full p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                  <p className="mt-1 text-xs text-gray-500">Use to differentiate ads</p>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button onClick={resetForm} className="text-sm font-bold text-red-500 hover:text-red-600 dark:text-red-400">Clear Form</button>
              </div>
            </div>

            {/* Generated URL Box */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md p-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                Generated Campaign URL
              </h3>
              
              <div className="relative">
                <textarea
                  value={generatedUrl}
                  readOnly
                  placeholder="Your generated URL will appear here..."
                  className="w-full h-32 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-800 dark:text-gray-200 font-mono text-sm resize-none outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={copyToClipboard}
                  disabled={!generatedUrl || generatedUrl.startsWith('Please')}
                  className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex items-center space-x-2"
                >
                  {isCopied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      <span>Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                      <span>Copy URL</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
