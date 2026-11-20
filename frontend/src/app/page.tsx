'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import DynamicIcon from '@/components/DynamicIcon';
import { 
  Merge, SplitSquareHorizontal, RotateCw, FileMinus, Files, LayoutGrid, Crop, Stamp, ListOrdered, PenLine, Edit3, FileCode, Images, Image as ImageIcon, FileText, FileType2, Table, Minimize2, Wand2, Grid3X3, Pipette, Smile, Palette, ImageMinus, RefreshCw, Maximize2, Code, Binary, Film, AppWindow, Braces, Code2, FileJson, Paintbrush, CodeXml, Link as LinkIcon, Hash, ShieldCheck, ShieldAlert, Fingerprint, KeyRound, Key, FileDown, QrCode, Regex, Type, SpellCheck, AlignLeft, Search, ArrowLeftRight, Space, Link2, FileSpreadsheet, Mic, AudioLines, MonitorPlay, Camera, Music, Dices, Archive, FolderOpen, Lock, Unlock, Square, Tag, Calendar, Percent, Activity, BadgeDollarSign, Calculator, Settings2, BookOpen, GraduationCap
} from 'lucide-react';

const STATIC_CATEGORIES = [
    {
      name: 'AI Assistants Hub',
      description: 'Interact with specialized AI models for translation, religious guidance, tutoring, and more.',
      icon: '🤖',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      tools: [
        { name: 'Tanzeel AI', path: '/ai-assistants/tanzeel-ai', description: 'Your digital twin and coding/design assistant.', icon: Wand2 },
        { name: 'Professional Translator', path: '/ai-assistants/urdu-translator', description: 'Translate seamlessly between Urdu and English naturally.', icon: Type },
        { name: 'Khutbat-e-Jumu\'ah', path: '/ai-assistants/khutbat-e-jumuah', description: 'Authentic Islamic sermons and guidance.', icon: BookOpen },
        { name: 'Master Tutor', path: '/ai-assistants/master-tutor', description: 'Learn any subject through interactive Socratic method.', icon: GraduationCap }
      ]
    },
    {
      name: 'PDF Tools',
      description: 'Merge, split, compress, and edit PDF files easily.',
      icon: '📄',
      color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
      tools: [
        { name: 'Merge PDF', path: '/tools/merge-pdf', description: 'Combine PDFs in the order you want with the easiest PDF merger available.', icon: Merge },
        { name: 'Split PDF', path: '/tools/split-pdf', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', icon: SplitSquareHorizontal },
        { name: 'Rotate PDF', path: '/tools/rotate-pdf', description: 'Rotate your PDFs the way you need them.', icon: RotateCw },
        { name: 'Remove Pages', path: '/tools/remove-pdf-pages', description: 'Remove pages from a PDF document.', icon: FileMinus },
        { name: 'Extract Pages', path: '/tools/extract-pdf-pages', description: 'Extract pages from your PDF document.', icon: Files },
        { name: 'Organize PDF', path: '/tools/organize-pdf', description: 'Sort, add and delete PDF pages.', icon: LayoutGrid },
        { name: 'Crop PDF', path: '/tools/crop-pdf', description: 'Crop PDF pages to a selected area, adjust margin size.', icon: Crop },
        { name: 'Watermark PDF', path: '/tools/watermark-pdf', description: 'Stamp an image or text over your PDF in seconds.', icon: Stamp },
        { name: 'Add Page Numbers', path: '/tools/add-page-numbers-pdf', description: 'Add page numbers into PDFs with ease.', icon: ListOrdered },
        { name: 'Sign PDF', path: '/tools/sign-pdf', description: 'Sign yourself or request electronic signatures from others.', icon: PenLine },
        { name: 'PDF Editor', path: '/tools/pdf-editor', description: 'Edit PDF documents directly in your browser.', icon: Edit3 },
        { name: 'HTML to PDF', path: '/tools/html-to-pdf', description: 'Convert web pages or HTML files to PDF.', icon: FileCode },
        { name: 'Images to PDF', path: '/tools/images-to-pdf', description: 'Convert JPG, PNG, and other images to PDF.', icon: Images },
        { name: 'PDF to Images', path: '/tools/pdf-to-images', description: 'Extract images from a PDF or convert pages to images.', icon: ImageIcon },
        { name: 'PDF to Text', path: '/tools/pdf-to-text', description: 'Extract plain text from your PDF files.', icon: FileText },
        { name: 'PDF to Word', path: '/tools/pdf-to-word', description: 'Easily convert your PDF files into easy to edit DOC and DOCX.', icon: FileType2 },
        { name: 'PDF to CSV', path: '/tools/pdf-to-csv', description: 'Convert PDF tables into CSV spreadsheets.', icon: Table }
      ]
    },
    {
      name: 'Image Tools',
      description: 'Edit, compress, and convert images directly in your browser.',
      icon: '🖼️',
      color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
      tools: [
        { name: 'AI Image Upscaler', path: '/tools/ai-image-upscaler', description: 'Enhance blurry images and increase resolution up to 4x using AI.', icon: Maximize2 },
        { name: 'Background Remover', path: '/tools/background-remover', description: 'Remove image backgrounds automatically using AI.', icon: ImageMinus },
        { name: 'EXIF / Metadata Remover', path: '/tools/exif-remover', description: 'Remove hidden GPS and camera data from photos for privacy.', icon: ShieldAlert },
        { name: 'Favicon Generator', path: '/tools/favicon-generator', description: 'Generate favicons for your website from a logo.', icon: LayoutGrid },
        { name: 'PSD Editor', path: '/tools/psd-editor', description: 'Professional online photo editor for PSD, XCF, Sketch, and image formats.', icon: Paintbrush },
        { name: 'Image Compressor', path: '/tools/image-compressor', description: 'Reduce image file size while keeping quality.', icon: Minimize2 },
        { name: 'Crop Image', path: '/tools/crop-image', description: 'Crop your images with custom aspect ratios.', icon: Crop },
        { name: 'Image Filters', path: '/tools/image-filters', description: 'Apply Instagram-like filters to your images.', icon: Wand2 },
        { name: 'Watermark Image', path: '/tools/watermark-image', description: 'Add text or image watermarks to your pictures.', icon: Stamp },
        { name: 'Image Splitter', path: '/tools/image-splitter', description: 'Split an image into a grid of smaller images.', icon: Grid3X3 },
        { name: 'Color Extractor', path: '/tools/color-extractor', description: 'Extract color palettes from any image.', icon: Pipette },
        { name: 'Meme Generator', path: '/tools/meme-generator', description: 'Create memes by adding text to images.', icon: Smile },
        { name: 'Color Picker', path: '/tools/color-picker', description: 'Pick colors from an image or choose from a color wheel.', icon: Palette },
        { name: 'SVG to PNG', path: '/tools/svg-to-png', description: 'Convert vector SVG graphics to standard PNG images.', icon: ImageMinus },
        { name: 'Image Converter', path: '/tools/image-convert', description: 'Convert between JPG, PNG, WEBP, and more.', icon: RefreshCw },
        { name: 'Image Resizer', path: '/tools/image-resize', description: 'Resize images to exact pixel dimensions.', icon: Maximize2 },
        { name: 'Base64 to Image', path: '/tools/base64-to-image', description: 'Decode Base64 strings back into image files.', icon: Code },
        { name: 'Image to Base64', path: '/tools/image-to-base64', description: 'Encode images into Base64 strings for web use.', icon: Binary },
        { name: 'GIF Maker', path: '/tools/gif-maker', description: 'Create animated GIFs from multiple images.', icon: Film },
        { name: 'Image to ICO', path: '/tools/image-to-ico', description: 'Convert images to Windows ICO format.', icon: AppWindow }
      ]
    },
    {
      name: 'Developer Tools',
      description: 'Useful utilities for coding, formatting, and debugging.',
      icon: '💻',
      color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      tools: [
        { name: 'CSS Layout Generator', path: '/tools/css-generator', description: 'Visually build CSS Flexbox and Grid layouts and generate code.', icon: LayoutGrid },
        { name: 'JSON Formatter', path: '/tools/json-formatter', description: 'Beautify, validate, and format JSON code.', icon: Braces },
        { name: 'XML Formatter', path: '/tools/xml-formatter', description: 'Format and pretty-print XML documents.', icon: Code2 },
        { name: 'HTML Minifier', path: '/tools/html-minifier', description: 'Minify HTML code to reduce file size.', icon: FileJson },
        { name: 'CSS Minifier', path: '/tools/css-minifier', description: 'Minify CSS styles for faster loading.', icon: Paintbrush },
        { name: 'HTML Encoder', path: '/tools/html-encoder', description: 'Encode or decode HTML entities.', icon: CodeXml },
        { name: 'URL Encoder', path: '/tools/url-encoder', description: 'Encode or decode URL strings safely.', icon: LinkIcon },
        { name: 'Base64 Encoder', path: '/tools/base64-encoder', description: 'Encode or decode text to Base64 format.', icon: Hash },
        { name: 'JWT Decoder', path: '/tools/jwt-decoder', description: 'Decode JSON Web Tokens and view their payload.', icon: ShieldCheck },
        { name: 'Hash Generator', path: '/tools/hash-generator', description: 'Generate MD5, SHA-1, SHA-256 hashes.', icon: Fingerprint },
        { name: 'UUID Generator', path: '/tools/uuid-generator', description: 'Generate random universally unique identifiers (v4).', icon: KeyRound },
        { name: 'Password Generator', path: '/tools/password-generator', description: 'Generate secure, random passwords.', icon: Key },
        { name: 'Color Converter', path: '/tools/color-converter', description: 'Convert colors between HEX, RGB, HSL, etc.', icon: Palette },
        { name: 'Markdown Preview', path: '/tools/markdown-previewer', description: 'Write and preview Markdown in real-time.', icon: FileDown },
        { name: 'QR Code Generator', path: '/tools/qrcode-generator', description: 'Generate QR codes for text, URLs, and more.', icon: QrCode },
        { name: 'Regex Tester', path: '/tools/regex-tester', description: 'Test regular expressions against sample text.', icon: Regex }
      ]
    },
    {
      name: 'Text & Content Tools',
      description: 'Manipulate text, count words, and clean up content.',
      icon: '📝',
      color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      tools: [
        { name: 'Image to Text (OCR)', path: '/tools/ocr', description: 'Extract text from images using optical character recognition.', icon: FileText },
        { name: 'Word Counter', path: '/tools/word-counter', description: 'Count words, characters, and sentences in text.', icon: Type },
        { name: 'Case Converter', path: '/tools/case-converter', description: 'Convert text to uppercase, lowercase, title case.', icon: SpellCheck },
        { name: 'Lorem Ipsum', path: '/tools/lorem-ipsum', description: 'Generate placeholder text for design mockups.', icon: AlignLeft },
        { name: 'Find & Replace', path: '/tools/find-and-replace', description: 'Find and replace text using simple strings or regex.', icon: Search },
        { name: 'Reverse Text', path: '/tools/reverse-text', description: 'Reverse characters or words in a text string.', icon: ArrowLeftRight },
        { name: 'Whitespace Remover', path: '/tools/whitespace-remover', description: 'Remove extra spaces, tabs, and line breaks.', icon: Space },
        { name: 'Text to Binary', path: '/tools/text-to-binary', description: 'Convert standard text to binary code.', icon: Binary },
        { name: 'Slug Generator', path: '/tools/slug-generator', description: 'Generate URL-friendly slugs from text.', icon: Link2 },
        { name: 'CSV to JSON', path: '/tools/csv-to-json', description: 'Convert CSV data to JSON format.', icon: FileSpreadsheet }
      ]
    },
    {
      name: 'Media & Fun',
      description: 'Convert media files, generate random numbers, and more.',
      icon: '🎮',
      color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
      tools: [
        { name: 'Text to Speech', path: '/tools/text-to-speech', description: 'Convert text to realistic sounding speech.', icon: Mic },
        { name: 'Speech to Text', path: '/tools/speech-to-text', description: 'Transcribe audio to text.', icon: AudioLines },
        { name: 'Screen Recorder', path: '/tools/screen-recorder', description: 'Record your screen and download as video.', icon: MonitorPlay },
        { name: 'Webcam Recorder', path: '/tools/webcam-recorder', description: 'Record video directly from your webcam.', icon: Camera },
        { name: 'Video to Audio', path: '/tools/video-to-audio', description: 'Extract audio track from video files.', icon: Music },
        { name: 'Random Number', path: '/tools/random-number-generator', description: 'Generate random numbers with specific rules.', icon: Dices }
      ]
    },
    {
      name: 'Capture Websites',
      description: 'Capture any website as a high-quality Screenshot or PDF.',
      icon: '🌐',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      tools: [
        { name: 'Website Screenshot', path: '/tools/website-screenshot', description: 'Take full-page screenshots of any website.', icon: Camera },
        { name: 'Website to PDF', path: '/tools/website-to-pdf', description: 'Save any website as a PDF document.', icon: FileText }
      ]
    },
    {
      name: 'Archives',
      description: 'Create and extract ZIP archives directly in your browser.',
      icon: '🗜️',
      color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      tools: [
        { name: 'Create Archive', path: '/tools/create-archive', description: 'Zip multiple files into a single archive.', icon: Archive },
        { name: 'Extract Archive', path: '/tools/extract-archive', description: 'Extract files from a ZIP archive.', icon: FolderOpen }
      ]
    },
    {
      name: 'Security & Crypto',
      description: 'Lock and unlock files securely inside your browser.',
      icon: '🔒',
      color: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
      tools: [
        { name: 'File Encryptor', path: '/tools/file-encryptor', description: 'Encrypt files securely with a password.', icon: Lock },
        { name: 'File Decryptor', path: '/tools/file-decryptor', description: 'Decrypt previously encrypted files.', icon: Unlock }
      ]
    },
    {
      name: 'Web Design & SEO',
      description: 'Generate CSS styles, Meta tags, and tracking URLs.',
      icon: '✨',
      color: 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800',
      tools: [
        { name: 'Gradient Generator', path: '/tools/gradient-generator', description: 'Create CSS gradients and copy the code.', icon: Palette },
        { name: 'Box Shadow Generator', path: '/tools/box-shadow-generator', description: 'Design CSS box shadows visually.', icon: Square },
        { name: 'Meta Tags Generator', path: '/tools/meta-tags-generator', description: 'Generate SEO meta tags for your website.', icon: Tag },
        { name: 'UTM Builder', path: '/tools/utm-builder', description: 'Create trackable UTM links for campaigns.', icon: LinkIcon }
      ]
    },
    {
      name: 'Calculators',
      description: 'Useful everyday calculators for age, discounts, BMI, and more.',
      icon: '🧮',
      color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
      tools: [
        { name: 'Age Calculator', path: '/tools/age-calculator', description: 'Calculate exact age in years, months, and days.', icon: Calendar },
        { name: 'Discount Calculator', path: '/tools/discount-calculator', description: 'Calculate final price after discount.', icon: Percent },
        { name: 'BMI Calculator', path: '/tools/bmi-calculator', description: 'Calculate Body Mass Index and health status.', icon: Activity },
        { name: 'Loan Calculator', path: '/tools/loan-calculator', description: 'Estimate monthly loan payments and interest.', icon: BadgeDollarSign },
        { name: 'Percentage Calculator', path: '/tools/percentage-calculator', description: 'Solve various percentage problems.', icon: Calculator }
      ]
    }
  ];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [categories, setCategories] = useState<any[]>(STATIC_CATEGORIES);

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if (data.grouped && Array.isArray(data.grouped) && data.grouped.length > 0) {
          setCategories(data.grouped);
        }
      })
      .catch(err => console.warn('Dynamic tools fetch fallback:', err));
  }, []);

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev => ({...prev, [name]: !prev[name]}));
  };

  const filteredCategories = categories.map((category: any) => ({
    ...category,
    tools: (category.tools || []).filter((tool: any) => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter((category: any) => category.tools.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans relative">
      
      {/* Global Watermark */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden opacity-[0.02] dark:opacity-[0.015]">
        <Settings2 className="w-[1200px] h-[1200px] text-indigo-900 dark:text-white -rotate-12" strokeWidth={0.5} />
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 relative overflow-hidden pb-12">
        <div className="absolute inset-0 bg-gray-50 dark:bg-gray-950/50 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at center, #e5e7eb 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.4 }}></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs mb-6 border border-indigo-100 dark:border-indigo-800 shadow-sm uppercase tracking-wide">
            CodeHubb Tools Collection
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
            Every tool you could need.<br/>
            <span className="text-indigo-600 dark:text-indigo-400">All in one place.</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-500 dark:text-gray-400 mx-auto mb-10">
            {categories.reduce((acc, cat) => acc + cat.tools.length, 0)} free, secure, and fast tools to boost your productivity.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-2 transition-all focus-within:border-indigo-500 dark:focus-within:border-indigo-500">
              <Search className="w-6 h-6 text-gray-400 ml-3 mr-2" />
              <input 
                type="text" 
                placeholder="Search for tools (e.g., PDF to Word, Compress Image)..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 bg-transparent outline-none text-gray-900 dark:text-white font-medium placeholder-gray-400 text-lg"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tools Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No tools found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">We couldn't find any tools matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredCategories.map((category) => {
            const isSearching = searchQuery.length > 0;
            const isExpanded = expandedCategories[category.name] || false;
            const initialLimit = 8;
            const showAll = isExpanded || isSearching;
            const visibleTools = showAll ? category.tools : category.tools.slice(0, initialLimit);
            const hasMore = category.tools.length > initialLimit;

            return (
              <div key={category.name} id={category.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="scroll-mt-12 relative">
                <div className="flex items-center space-x-4 mb-8">
                  <span className={`text-4xl p-3 rounded-2xl ${category.color.split(' ')[0]} ${category.color.split(' ')[1]}`}>
                    {category.icon}
                  </span>
                  <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{category.name}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleTools.map((tool: any) => {
                    const bgColor = category.color?.split(' ')[0] || 'bg-indigo-50';
                    const textColor = category.color?.split(' ')[2] || 'text-indigo-600';
                    
                    return (
                      <Link 
                        key={tool.name} 
                        href={tool.path}
                        className="group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700/50 relative overflow-hidden flex flex-col h-full"
                      >
                        {tool.badge && (
                          <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 z-10">
                            {tool.badge}
                          </span>
                        )}

                        {tool.mockupImage && (
                          <div className="w-full h-36 mb-4 -mx-6 -mt-6 overflow-hidden bg-gray-100 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700 relative">
                            <img
                              src={tool.mockupImage}
                              alt={tool.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          </div>
                        )}
                        
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${bgColor} ${textColor} dark:bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                          <DynamicIcon name={tool.icon} className="w-7 h-7" strokeWidth={2.5} />
                        </div>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {tool.name}
                        </h3>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed flex-grow">
                          {tool.description}
                        </p>
                      </Link>
                    );
                  })}
                </div>

                {!showAll && hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button 
                      onClick={() => toggleCategory(category.name)}
                      className="group flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3.5 bg-white dark:bg-gray-800 border-2 border-indigo-100 dark:border-indigo-900/50 rounded-xl shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-indigo-700 dark:text-indigo-400 font-bold text-sm uppercase tracking-wider"
                    >
                      <span>View All {category.tools.length} Tools</span>
                      <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                  </div>
                )}
                
                {isExpanded && !isSearching && hasMore && (
                  <div className="mt-10 flex justify-center">
                    <button 
                      onClick={() => toggleCategory(category.name)}
                      className="group flex items-center justify-center space-x-2 w-full sm:w-auto px-8 py-3.5 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-gray-500 dark:text-gray-400 font-bold text-sm uppercase tracking-wider"
                    >
                      <span>Show Less</span>
                      <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7"></path></svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      
      {/* Pricing Section */}
      <div id="pricing" className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-24 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-4 border border-indigo-100 dark:border-indigo-800">
            Simple Pricing
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">Unlock Pro Features</h2>
          <p className="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-16">
            Get unlimited access to premium tools like File Encryptor, PDF Merger, Screen Recorder, and more.
          </p>

          <div className="max-w-lg mx-auto bg-gray-50 dark:bg-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl relative overflow-hidden transform hover:-translate-y-1 transition-all">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <span className="text-9xl">👑</span>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">Pro Subscription</h3>
            <div className="flex justify-center items-baseline my-8 relative z-10">
              <span className="text-6xl font-extrabold text-gray-900 dark:text-white">$1.99</span>
              <span className="text-xl text-gray-500 dark:text-gray-400 ml-2 font-medium">/month</span>
            </div>

            <ul className="space-y-4 mb-8 text-left relative z-10">
              <li className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Access to all 70+ Free Tools
              </li>
              <li className="flex items-center text-gray-900 dark:text-white font-bold">
                <svg className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Unlock AES-256 File Encryptor
              </li>
              <li className="flex items-center text-gray-900 dark:text-white font-bold">
                <svg className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Unlock Premium PDF Tools
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                Ad-free experience
              </li>
            </ul>

            <button 
              onClick={async () => {
                try {
                  const res = await fetch('/api/stripe/checkout', { method: 'POST' });
                  if (res.status === 401) {
                    window.location.href = '/login';
                  } else {
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }
                } catch(e) {
                  console.error(e);
                }
              }}
              className="w-full block py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all relative z-10 text-lg"
            >
              Get CodeHubb Pro
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
