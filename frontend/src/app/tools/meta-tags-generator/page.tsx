'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function MetaTagsGeneratorPage() {
  const [siteTitle, setSiteTitle] = useState('');
  const [siteDesc, setSiteDesc] = useState('');
  const [siteKeywords, setSiteKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [allowRobots, setAllowRobots] = useState(true);
  const [language, setLanguage] = useState('English');
  const [charset, setCharset] = useState('UTF-8');
  
  const [generatedCode, setGeneratedCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    generateTags();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteTitle, siteDesc, siteKeywords, author, imageUrl, allowRobots, language, charset]);

  const generateTags = () => {
    let code = `<!-- Primary Meta Tags -->\n`;
    code += `<meta charset="${charset}">\n`;
    if (siteTitle) code += `<title>${siteTitle}</title>\n`;
    if (siteTitle) code += `<meta name="title" content="${siteTitle}">\n`;
    if (siteDesc) code += `<meta name="description" content="${siteDesc}">\n`;
    if (siteKeywords) code += `<meta name="keywords" content="${siteKeywords}">\n`;
    if (author) code += `<meta name="author" content="${author}">\n`;
    if (language) code += `<meta name="language" content="${language}">\n`;
    
    code += `<meta name="robots" content="${allowRobots ? 'index, follow' : 'noindex, nofollow'}">\n`;
    code += `<meta http-equiv="Content-Type" content="text/html; charset=${charset}">\n`;

    if (siteTitle || siteDesc || imageUrl) {
      code += `\n<!-- Open Graph / Facebook -->\n`;
      code += `<meta property="og:type" content="website">\n`;
      if (siteTitle) code += `<meta property="og:title" content="${siteTitle}">\n`;
      if (siteDesc) code += `<meta property="og:description" content="${siteDesc}">\n`;
      if (imageUrl) code += `<meta property="og:image" content="${imageUrl}">\n`;

      code += `\n<!-- Twitter -->\n`;
      code += `<meta property="twitter:card" content="summary_large_image">\n`;
      if (siteTitle) code += `<meta property="twitter:title" content="${siteTitle}">\n`;
      if (siteDesc) code += `<meta property="twitter:description" content="${siteDesc}">\n`;
      if (imageUrl) code += `<meta property="twitter:image" content="${imageUrl}">\n`;
    }

    setGeneratedCode(code);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row">
          
          {/* Form Side */}
          <div className="lg:w-1/2 p-8 sm:p-12 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80">
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Meta Tags Generator</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Generate perfect SEO meta tags for your website in seconds.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Site Title</label>
                <input 
                  type="text" 
                  value={siteTitle}
                  onChange={(e) => setSiteTitle(e.target.value)}
                  placeholder="e.g. CodeHubb - Free Online Tools"
                  className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Site Description</label>
                <textarea 
                  value={siteDesc}
                  onChange={(e) => setSiteDesc(e.target.value)}
                  placeholder="A brief description of your website for search engines..."
                  rows={3}
                  className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 resize-none" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Keywords (comma separated)</label>
                <input 
                  type="text" 
                  value={siteKeywords}
                  onChange={(e) => setSiteKeywords(e.target.value)}
                  placeholder="e.g. tools, online, free, seo"
                  className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Author</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Social Image URL (Open Graph / Twitter)</label>
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Allow Robots</label>
                  <select 
                    value={allowRobots ? 'yes' : 'no'}
                    onChange={(e) => setAllowRobots(e.target.value === 'yes')}
                    className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="yes">Yes (Index, Follow)</option>
                    <option value="no">No (Noindex, Nofollow)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Primary Language</label>
                  <input 
                    type="text" 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl outline-none font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Output Side */}
          <div className="lg:w-1/2 p-8 sm:p-12 bg-white dark:bg-gray-800 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Generated Code</h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all flex items-center space-x-2 text-sm font-bold"
              >
                {isCopied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    <span>Copy HTML</span>
                  </>
                )}
              </button>
            </div>
            
            <div className="flex-1 bg-gray-900 rounded-xl overflow-hidden shadow-inner border border-gray-700">
              <textarea
                value={generatedCode}
                readOnly
                className="w-full h-full min-h-[400px] p-6 bg-transparent text-green-400 font-mono text-sm outline-none resize-none"
              />
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-xl text-sm font-medium">
              💡 <strong>Tip:</strong> Copy the code above and paste it inside the <code>&lt;head&gt;</code> section of your HTML document.
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
