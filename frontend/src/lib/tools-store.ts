import fs from 'fs';
import path from 'path';

export interface ToolItem {
  id: string; // unique identifier, e.g. 'merge-pdf', 'custom-qr'
  name: string; // e.g. "Merge PDF"
  slug: string; // e.g. "merge-pdf"
  path: string; // e.g. "/tools/merge-pdf" or "/tools/custom/my-tool"
  description: string;
  category: string; // e.g. "PDF Tools", "Image Tools", etc.
  icon: string; // Icon name (e.g. "Merge", "FileText", "Wand2", "Settings") or emoji
  status: 'active' | 'inactive' | 'maintenance' | 'beta';
  badge?: 'New' | 'Popular' | 'Pro' | 'Free' | '';
  isCustom?: boolean; // true if added via admin dashboard
  mockupImage?: string; // Optional card mockup or preview image URL
  content?: string; // Rich SEO markdown or instructions
  embedCode?: string; // Custom HTML/iframe/script if it's an interactive dynamic tool
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ToolCategory {
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const DEFAULT_CATEGORIES: ToolCategory[] = [
  {
    name: 'AI Assistants Hub',
    description: 'Interact with specialized AI models for translation, religious guidance, tutoring, and more.',
    icon: '🤖',
    color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800',
  },
  {
    name: 'PDF Tools',
    description: 'Merge, split, compress, and edit PDF files easily.',
    icon: '📄',
    color: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800',
  },
  {
    name: 'Image Tools',
    description: 'Edit, compress, and convert images directly in your browser.',
    icon: '🖼️',
    color: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
  },
  {
    name: 'Developer Tools',
    description: 'Useful utilities for coding, formatting, and debugging.',
    icon: '💻',
    color: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
  },
  {
    name: 'Text & Content Tools',
    description: 'Manipulate text, count words, and clean up content.',
    icon: '📝',
    color: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800',
  },
  {
    name: 'Media & Fun',
    description: 'Convert media files, generate random numbers, and more.',
    icon: '🎮',
    color: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-200 dark:border-pink-800',
  },
  {
    name: 'Capture Websites',
    description: 'Capture any website as a high-quality Screenshot or PDF.',
    icon: '🌐',
    color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  },
  {
    name: 'Archives',
    description: 'Create and extract ZIP archives directly in your browser.',
    icon: '🗜️',
    color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  },
  {
    name: 'Security & Crypto',
    description: 'Lock and unlock files securely inside your browser.',
    icon: '🔒',
    color: 'bg-slate-50 dark:bg-slate-900/20 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800',
  },
  {
    name: 'Web Design & SEO',
    description: 'Generate CSS styles, Meta tags, and tracking URLs.',
    icon: '✨',
    color: 'bg-fuchsia-50 dark:bg-fuchsia-900/20 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-200 dark:border-fuchsia-800',
  },
  {
    name: 'Calculators',
    description: 'Useful everyday calculators for age, discounts, BMI, and more.',
    icon: '🧮',
    color: 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-200 dark:border-teal-800',
  },
];

export const INITIAL_DEFAULT_TOOLS: ToolItem[] = [
  // AI Assistants Hub
  { id: 'tanzeel-ai', name: 'Tanzeel AI', slug: 'tanzeel-ai', path: '/ai-assistants/tanzeel-ai', description: 'Your digital twin and coding/design assistant.', category: 'AI Assistants Hub', icon: 'Wand2', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'urdu-translator', name: 'Professional Translator', slug: 'urdu-translator', path: '/ai-assistants/urdu-translator', description: 'Translate seamlessly between Urdu and English naturally.', category: 'AI Assistants Hub', icon: 'Type', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'khutbat-e-jumuah', name: "Khutbat-e-Jumu'ah", slug: 'khutbat-e-jumuah', path: '/ai-assistants/khutbat-e-jumuah', description: 'Authentic Islamic sermons and guidance.', category: 'AI Assistants Hub', icon: 'BookOpen', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'master-tutor', name: 'Master Tutor', slug: 'master-tutor', path: '/ai-assistants/master-tutor', description: 'Learn any subject through interactive Socratic method.', category: 'AI Assistants Hub', icon: 'GraduationCap', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // PDF Tools
  { id: 'merge-pdf', name: 'Merge PDF', slug: 'merge-pdf', path: '/tools/merge-pdf', description: 'Combine PDFs in the order you want with the easiest PDF merger available.', category: 'PDF Tools', icon: 'Merge', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'split-pdf', name: 'Split PDF', slug: 'split-pdf', path: '/tools/split-pdf', description: 'Separate one page or a whole set for easy conversion into independent PDF files.', category: 'PDF Tools', icon: 'SplitSquareHorizontal', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'rotate-pdf', name: 'Rotate PDF', slug: 'rotate-pdf', path: '/tools/rotate-pdf', description: 'Rotate your PDFs the way you need them.', category: 'PDF Tools', icon: 'RotateCw', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'remove-pdf-pages', name: 'Remove Pages', slug: 'remove-pdf-pages', path: '/tools/remove-pdf-pages', description: 'Remove pages from a PDF document.', category: 'PDF Tools', icon: 'FileMinus', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'extract-pdf-pages', name: 'Extract Pages', slug: 'extract-pdf-pages', path: '/tools/extract-pdf-pages', description: 'Extract pages from your PDF document.', category: 'PDF Tools', icon: 'Files', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'organize-pdf', name: 'Organize PDF', slug: 'organize-pdf', path: '/tools/organize-pdf', description: 'Sort, add and delete PDF pages.', category: 'PDF Tools', icon: 'LayoutGrid', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'crop-pdf', name: 'Crop PDF', slug: 'crop-pdf', path: '/tools/crop-pdf', description: 'Crop PDF pages to a selected area, adjust margin size.', category: 'PDF Tools', icon: 'Crop', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'watermark-pdf', name: 'Watermark PDF', slug: 'watermark-pdf', path: '/tools/watermark-pdf', description: 'Stamp an image or text over your PDF in seconds.', category: 'PDF Tools', icon: 'Stamp', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'add-page-numbers-pdf', name: 'Add Page Numbers', slug: 'add-page-numbers-pdf', path: '/tools/add-page-numbers-pdf', description: 'Add page numbers into PDFs with ease.', category: 'PDF Tools', icon: 'ListOrdered', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'sign-pdf', name: 'Sign PDF', slug: 'sign-pdf', path: '/tools/sign-pdf', description: 'Sign yourself or request electronic signatures from others.', category: 'PDF Tools', icon: 'PenLine', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'pdf-editor', name: 'PDF Editor', slug: 'pdf-editor', path: '/tools/pdf-editor', description: 'Edit PDF documents directly in your browser.', category: 'PDF Tools', icon: 'Edit3', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'html-to-pdf', name: 'HTML to PDF', slug: 'html-to-pdf', path: '/tools/html-to-pdf', description: 'Convert web pages or HTML files to PDF with selectable text.', category: 'PDF Tools', icon: 'FileCode', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'images-to-pdf', name: 'Images to PDF', slug: 'images-to-pdf', path: '/tools/images-to-pdf', description: 'Convert JPG, PNG, and other images to PDF.', category: 'PDF Tools', icon: 'Images', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'pdf-to-images', name: 'PDF to Images', slug: 'pdf-to-images', path: '/tools/pdf-to-images', description: 'Extract images from a PDF or convert pages to images.', category: 'PDF Tools', icon: 'ImageIcon', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'pdf-to-text', name: 'PDF to Text', slug: 'pdf-to-text', path: '/tools/pdf-to-text', description: 'Extract plain text from your PDF files.', category: 'PDF Tools', icon: 'FileText', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'pdf-to-word', name: 'PDF to Word', slug: 'pdf-to-word', path: '/tools/pdf-to-word', description: 'Easily convert your PDF files into easy to edit DOC and DOCX.', category: 'PDF Tools', icon: 'FileType2', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'pdf-to-csv', name: 'PDF to CSV', slug: 'pdf-to-csv', path: '/tools/pdf-to-csv', description: 'Convert PDF tables into CSV spreadsheets.', category: 'PDF Tools', icon: 'Table', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'compress-pdf', name: 'Compress PDF', slug: 'compress-pdf', path: '/tools/compress-pdf', description: 'Reduce PDF file size while keeping text selectable and copyable.', category: 'PDF Tools', icon: 'FileDown', status: 'active', badge: 'New', createdAt: '2026-11-21T00:00:00Z', updatedAt: '2026-11-21T00:00:00Z' },

  // Image Tools
  { id: 'ai-image-upscaler', name: 'AI Image Upscaler', slug: 'ai-image-upscaler', path: '/tools/ai-image-upscaler', description: 'Enhance blurry images and increase resolution up to 4x using AI.', category: 'Image Tools', icon: 'Maximize2', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'background-remover', name: 'Background Remover', slug: 'background-remover', path: '/tools/background-remover', description: 'Remove image backgrounds automatically using AI.', category: 'Image Tools', icon: 'ImageMinus', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'exif-remover', name: 'EXIF / Metadata Remover', slug: 'exif-remover', path: '/tools/exif-remover', description: 'Remove hidden GPS and camera data from photos for privacy.', category: 'Image Tools', icon: 'ShieldAlert', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'favicon-generator', name: 'Favicon Generator', slug: 'favicon-generator', path: '/tools/favicon-generator', description: 'Generate favicons for your website from a logo.', category: 'Image Tools', icon: 'LayoutGrid', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'psd-editor', name: 'PSD Editor', slug: 'psd-editor', path: '/tools/psd-editor', description: 'Professional online photo editor for PSD, XCF, Sketch, and image formats.', category: 'Image Tools', icon: 'Paintbrush', status: 'active', badge: 'Pro', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'image-compressor', name: 'Image Compressor', slug: 'image-compressor', path: '/tools/image-compressor', description: 'Reduce image file size while keeping quality.', category: 'Image Tools', icon: 'Minimize2', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'crop-image', name: 'Crop Image', slug: 'crop-image', path: '/tools/crop-image', description: 'Crop your images with custom aspect ratios.', category: 'Image Tools', icon: 'Crop', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'image-filters', name: 'Image Filters', slug: 'image-filters', path: '/tools/image-filters', description: 'Apply Instagram-like filters to your images.', category: 'Image Tools', icon: 'Wand2', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'watermark-image', name: 'Watermark Image', slug: 'watermark-image', path: '/tools/watermark-image', description: 'Add text or image watermarks to your pictures.', category: 'Image Tools', icon: 'Stamp', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'image-splitter', name: 'Image Splitter', slug: 'image-splitter', path: '/tools/image-splitter', description: 'Split an image into a grid of smaller images.', category: 'Image Tools', icon: 'Grid3X3', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'color-extractor', name: 'Color Extractor', slug: 'color-extractor', path: '/tools/color-extractor', description: 'Extract color palettes from any image.', category: 'Image Tools', icon: 'Pipette', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'meme-generator', name: 'Meme Generator', slug: 'meme-generator', path: '/tools/meme-generator', description: 'Create memes by adding text to images.', category: 'Image Tools', icon: 'Smile', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'color-picker', name: 'Color Picker', slug: 'color-picker', path: '/tools/color-picker', description: 'Pick colors from an image or choose from a color wheel.', category: 'Image Tools', icon: 'Palette', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'svg-to-png', name: 'SVG to PNG', slug: 'svg-to-png', path: '/tools/svg-to-png', description: 'Convert vector SVG graphics to standard PNG images.', category: 'Image Tools', icon: 'ImageMinus', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'image-convert', name: 'Image Converter', slug: 'image-convert', path: '/tools/image-convert', description: 'Convert between JPG, PNG, WEBP, and more.', category: 'Image Tools', icon: 'RefreshCw', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'heic-to-jpg', name: 'HEIC to JPG', slug: 'heic-to-jpg', path: '/tools/heic-to-jpg', description: 'Convert iPhone HEIC and HEIF photos to JPG or PNG.', category: 'Image Tools', icon: 'FileImage', status: 'active', badge: 'New', createdAt: '2026-11-21T00:00:00Z', updatedAt: '2026-11-21T00:00:00Z' },
  { id: 'passport-photo-maker', name: 'Passport Photo Maker', slug: 'passport-photo-maker', path: '/tools/passport-photo-maker', description: 'Make passport and visa photos at exact official sizes and KB limits.', category: 'Image Tools', icon: 'Camera', status: 'active', badge: 'New', createdAt: '2026-11-21T00:00:00Z', updatedAt: '2026-11-21T00:00:00Z' },
  { id: 'image-resize', name: 'Image Resizer', slug: 'image-resize', path: '/tools/image-resize', description: 'Resize images to exact pixel dimensions.', category: 'Image Tools', icon: 'Maximize2', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'base64-to-image', name: 'Base64 to Image', slug: 'base64-to-image', path: '/tools/base64-to-image', description: 'Decode Base64 strings back into image files.', category: 'Image Tools', icon: 'Code', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'image-to-base64', name: 'Image to Base64', slug: 'image-to-base64', path: '/tools/image-to-base64', description: 'Encode images into Base64 strings for web use.', category: 'Image Tools', icon: 'Binary', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'gif-maker', name: 'GIF Maker', slug: 'gif-maker', path: '/tools/gif-maker', description: 'Create animated GIFs from multiple images.', category: 'Image Tools', icon: 'Film', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'image-to-ico', name: 'Image to ICO', slug: 'image-to-ico', path: '/tools/image-to-ico', description: 'Convert images to Windows ICO format.', category: 'Image Tools', icon: 'AppWindow', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // Developer Tools
  { id: 'css-generator', name: 'CSS Layout Generator', slug: 'css-generator', path: '/tools/css-generator', description: 'Visually build CSS Flexbox and Grid layouts and generate code.', category: 'Developer Tools', icon: 'LayoutGrid', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'json-formatter', name: 'JSON Formatter', slug: 'json-formatter', path: '/tools/json-formatter', description: 'Beautify, validate, and format JSON code.', category: 'Developer Tools', icon: 'Braces', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'xml-formatter', name: 'XML Formatter', slug: 'xml-formatter', path: '/tools/xml-formatter', description: 'Format and pretty-print XML documents.', category: 'Developer Tools', icon: 'Code2', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'html-minifier', name: 'HTML Minifier', slug: 'html-minifier', path: '/tools/html-minifier', description: 'Minify HTML code to reduce file size.', category: 'Developer Tools', icon: 'FileJson', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'css-minifier', name: 'CSS Minifier', slug: 'css-minifier', path: '/tools/css-minifier', description: 'Minify CSS styles for faster loading.', category: 'Developer Tools', icon: 'Paintbrush', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'html-encoder', name: 'HTML Encoder', slug: 'html-encoder', path: '/tools/html-encoder', description: 'Encode or decode HTML entities.', category: 'Developer Tools', icon: 'CodeXml', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'url-encoder', name: 'URL Encoder', slug: 'url-encoder', path: '/tools/url-encoder', description: 'Encode or decode URL strings safely.', category: 'Developer Tools', icon: 'LinkIcon', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'base64-encoder', name: 'Base64 Encoder', slug: 'base64-encoder', path: '/tools/base64-encoder', description: 'Encode or decode text to Base64 format.', category: 'Developer Tools', icon: 'Hash', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'jwt-decoder', name: 'JWT Decoder', slug: 'jwt-decoder', path: '/tools/jwt-decoder', description: 'Decode JSON Web Tokens and view their payload.', category: 'Developer Tools', icon: 'ShieldCheck', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'hash-generator', name: 'Hash Generator', slug: 'hash-generator', path: '/tools/hash-generator', description: 'Generate MD5, SHA-1, SHA-256 hashes.', category: 'Developer Tools', icon: 'Fingerprint', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'uuid-generator', name: 'UUID Generator', slug: 'uuid-generator', path: '/tools/uuid-generator', description: 'Generate random universally unique identifiers (v4).', category: 'Developer Tools', icon: 'KeyRound', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'password-generator', name: 'Password Generator', slug: 'password-generator', path: '/tools/password-generator', description: 'Generate secure, random passwords.', category: 'Developer Tools', icon: 'Key', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'color-converter', name: 'Color Converter', slug: 'color-converter', path: '/tools/color-converter', description: 'Convert colors between HEX, RGB, HSL, etc.', category: 'Developer Tools', icon: 'Palette', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'markdown-previewer', name: 'Markdown Preview', slug: 'markdown-previewer', path: '/tools/markdown-previewer', description: 'Write and preview Markdown in real-time.', category: 'Developer Tools', icon: 'FileDown', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'qrcode-generator', name: 'QR Code Generator', slug: 'qrcode-generator', path: '/tools/qrcode-generator', description: 'Generate QR codes for text, URLs, and more.', category: 'Developer Tools', icon: 'QrCode', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'regex-tester', name: 'Regex Tester', slug: 'regex-tester', path: '/tools/regex-tester', description: 'Test regular expressions against sample text.', category: 'Developer Tools', icon: 'Regex', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // Text & Content Tools
  { id: 'ocr', name: 'Image to Text (OCR)', slug: 'ocr', path: '/tools/ocr', description: 'Extract text from images using optical character recognition.', category: 'Text & Content Tools', icon: 'FileText', status: 'active', badge: 'Popular', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'word-counter', name: 'Word Counter', slug: 'word-counter', path: '/tools/word-counter', description: 'Count words, characters, and sentences in text.', category: 'Text & Content Tools', icon: 'Type', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'case-converter', name: 'Case Converter', slug: 'case-converter', path: '/tools/case-converter', description: 'Convert text to uppercase, lowercase, title case.', category: 'Text & Content Tools', icon: 'SpellCheck', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', slug: 'lorem-ipsum', path: '/tools/lorem-ipsum', description: 'Generate placeholder text for design mockups.', category: 'Text & Content Tools', icon: 'AlignLeft', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'find-and-replace', name: 'Find & Replace', slug: 'find-and-replace', path: '/tools/find-and-replace', description: 'Find and replace text using simple strings or regex.', category: 'Text & Content Tools', icon: 'Search', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'reverse-text', name: 'Reverse Text', slug: 'reverse-text', path: '/tools/reverse-text', description: 'Reverse characters or words in a text string.', category: 'Text & Content Tools', icon: 'ArrowLeftRight', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'whitespace-remover', name: 'Whitespace Remover', slug: 'whitespace-remover', path: '/tools/whitespace-remover', description: 'Remove extra spaces, tabs, and line breaks.', category: 'Text & Content Tools', icon: 'Space', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'text-to-binary', name: 'Text to Binary', slug: 'text-to-binary', path: '/tools/text-to-binary', description: 'Convert standard text to binary code.', category: 'Text & Content Tools', icon: 'Binary', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'slug-generator', name: 'Slug Generator', slug: 'slug-generator', path: '/tools/slug-generator', description: 'Generate URL-friendly slugs from text.', category: 'Text & Content Tools', icon: 'Link2', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'csv-to-json', name: 'CSV to JSON', slug: 'csv-to-json', path: '/tools/csv-to-json', description: 'Convert CSV data to JSON format.', category: 'Text & Content Tools', icon: 'FileSpreadsheet', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // Media & Fun
  { id: 'text-to-speech', name: 'Text to Speech', slug: 'text-to-speech', path: '/tools/text-to-speech', description: 'Convert text to realistic sounding speech.', category: 'Media & Fun', icon: 'Mic', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'speech-to-text', name: 'Speech to Text', slug: 'speech-to-text', path: '/tools/speech-to-text', description: 'Transcribe audio to text.', category: 'Media & Fun', icon: 'AudioLines', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'screen-recorder', name: 'Screen Recorder', slug: 'screen-recorder', path: '/tools/screen-recorder', description: 'Record your screen and download as video.', category: 'Media & Fun', icon: 'MonitorPlay', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'webcam-recorder', name: 'Webcam Recorder', slug: 'webcam-recorder', path: '/tools/webcam-recorder', description: 'Record video directly from your webcam.', category: 'Media & Fun', icon: 'Camera', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'video-to-audio', name: 'Video to Audio', slug: 'video-to-audio', path: '/tools/video-to-audio', description: 'Extract audio track from video files.', category: 'Media & Fun', icon: 'Music', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'random-number-generator', name: 'Random Number', slug: 'random-number-generator', path: '/tools/random-number-generator', description: 'Generate random numbers with specific rules.', category: 'Media & Fun', icon: 'Dices', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // Capture Websites
  { id: 'website-screenshot', name: 'Website Screenshot', slug: 'website-screenshot', path: '/tools/website-screenshot', description: 'Take full-page screenshots of any website.', category: 'Capture Websites', icon: 'Camera', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'website-to-pdf', name: 'Website to PDF', slug: 'website-to-pdf', path: '/tools/website-to-pdf', description: 'Save any website as a PDF document.', category: 'Capture Websites', icon: 'FileText', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // Archives
  { id: 'create-archive', name: 'Create Archive', slug: 'create-archive', path: '/tools/create-archive', description: 'Zip multiple files into a single archive.', category: 'Archives', icon: 'Archive', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'extract-archive', name: 'Extract Archive', slug: 'extract-archive', path: '/tools/extract-archive', description: 'Extract files from a ZIP archive.', category: 'Archives', icon: 'FolderOpen', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // Security & Crypto
  { id: 'file-encryptor', name: 'File Encryptor', slug: 'file-encryptor', path: '/tools/file-encryptor', description: 'Encrypt files securely with a password.', category: 'Security & Crypto', icon: 'Lock', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'file-decryptor', name: 'File Decryptor', slug: 'file-decryptor', path: '/tools/file-decryptor', description: 'Decrypt previously encrypted files.', category: 'Security & Crypto', icon: 'Unlock', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // Web Design & SEO
  { id: 'gradient-generator', name: 'Gradient Generator', slug: 'gradient-generator', path: '/tools/gradient-generator', description: 'Create CSS gradients and copy the code.', category: 'Web Design & SEO', icon: 'Palette', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'box-shadow-generator', name: 'Box Shadow Generator', slug: 'box-shadow-generator', path: '/tools/box-shadow-generator', description: 'Design CSS box shadows visually.', category: 'Web Design & SEO', icon: 'Square', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'meta-tags-generator', name: 'Meta Tags Generator', slug: 'meta-tags-generator', path: '/tools/meta-tags-generator', description: 'Generate SEO meta tags for your website.', category: 'Web Design & SEO', icon: 'Tag', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'utm-builder', name: 'UTM Builder', slug: 'utm-builder', path: '/tools/utm-builder', description: 'Create trackable UTM links for campaigns.', category: 'Web Design & SEO', icon: 'LinkIcon', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },

  // Calculators
  { id: 'age-calculator', name: 'Age Calculator', slug: 'age-calculator', path: '/tools/age-calculator', description: 'Calculate exact age in years, months, and days.', category: 'Calculators', icon: 'Calendar', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'discount-calculator', name: 'Discount Calculator', slug: 'discount-calculator', path: '/tools/discount-calculator', description: 'Calculate final price after discount.', category: 'Calculators', icon: 'Percent', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'bmi-calculator', name: 'BMI Calculator', slug: 'bmi-calculator', path: '/tools/bmi-calculator', description: 'Calculate Body Mass Index and health status.', category: 'Calculators', icon: 'Activity', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'loan-calculator', name: 'Loan Calculator', slug: 'loan-calculator', path: '/tools/loan-calculator', description: 'Estimate monthly loan payments and interest.', category: 'Calculators', icon: 'BadgeDollarSign', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' },
  { id: 'percentage-calculator', name: 'Percentage Calculator', slug: 'percentage-calculator', path: '/tools/percentage-calculator', description: 'Solve various percentage problems.', category: 'Calculators', icon: 'Calculator', status: 'active', createdAt: '2026-11-10T00:00:00Z', updatedAt: '2026-11-11T00:00:00Z' }
];

function getStorageFilePath(): string {
  const p1 = path.join(process.cwd(), 'data', 'tools-db.json');
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(process.cwd(), 'src', 'data', 'tools-db.json');
  if (fs.existsSync(p2)) return p2;
  return p1;
}

export function getAllTools(): ToolItem[] {
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading tools store, falling back to defaults:', err);
  }

  return INITIAL_DEFAULT_TOOLS;
}

export function getActiveTools(): ToolItem[] {
  return getAllTools().filter(t => t.status === 'active');
}

export function getToolById(id: string): ToolItem | undefined {
  const tools = getAllTools();
  return tools.find(t => t.id === id || t.slug === id);
}

export function getToolBySlug(slug: string): ToolItem | undefined {
  const tools = getAllTools();
  return tools.find(t => t.slug === slug || t.path === `/tools/${slug}` || t.path === `/tools/custom/${slug}`);
}

export function saveTools(tools: ToolItem[]): boolean {
  try {
    const filePath = getStorageFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(tools, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to save tools store to disk:', err);
    return false;
  }
}

export function upsertTool(toolData: Partial<ToolItem> & { name: string; slug: string }): ToolItem {
  const tools = getAllTools();
  const now = new Date().toISOString();

  const id = toolData.id || toolData.slug;
  const existingIndex = tools.findIndex(t => t.id === id || t.slug === toolData.slug);

  const resolvedPath = toolData.path || (toolData.isCustom ? `/tools/custom/${toolData.slug}` : `/tools/${toolData.slug}`);

  const itemToSave: ToolItem = {
    id,
    name: toolData.name,
    slug: toolData.slug,
    path: resolvedPath,
    description: toolData.description || '',
    category: toolData.category || 'General Tools',
    icon: toolData.icon || 'Wand2',
    status: toolData.status || 'active',
    badge: toolData.badge || '',
    isCustom: toolData.isCustom ?? true,
    mockupImage: toolData.mockupImage || '',
    content: toolData.content || '',
    embedCode: toolData.embedCode || '',
    author: toolData.author || 'Admin',
    createdAt: existingIndex >= 0 ? tools[existingIndex].createdAt : now,
    updatedAt: now,
  };

  if (existingIndex >= 0) {
    tools[existingIndex] = { ...tools[existingIndex], ...itemToSave };
  } else {
    tools.unshift(itemToSave);
  }

  saveTools(tools);
  return itemToSave;
}

export function deleteTool(id: string): boolean {
  const tools = getAllTools();
  const filtered = tools.filter(t => t.id !== id && t.slug !== id);
  if (filtered.length !== tools.length) {
    return saveTools(filtered);
  }
  return false;
}

export function toggleToolStatus(id: string): ToolItem | null {
  const tools = getAllTools();
  const tool = tools.find(t => t.id === id || t.slug === id);
  if (!tool) return null;

  tool.status = tool.status === 'active' ? 'inactive' : 'active';
  tool.updatedAt = new Date().toISOString();
  saveTools(tools);
  return tool;
}
