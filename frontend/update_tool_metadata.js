const fs = require('fs');
const path = require('path');

const TOOL_METADATA = {
  'add-page-numbers-pdf': {
    title: 'Add Page Numbers to PDF',
    desc: 'Insert customizable header or footer page numbers into your PDF documents with custom font sizes, alignments, and starting numbers.'
  },
  'age-calculator': {
    title: 'Age Calculator',
    desc: 'Calculate exact chronological age in years, months, weeks, days, hours, and minutes from any birth date with next birthday countdown.'
  },
  'ai-image-upscaler': {
    title: 'AI Image Upscaler',
    desc: 'Enlarge and enhance low-resolution images up to 4x using browser-based AI super-resolution with zero server data upload.'
  },
  'background-remover': {
    title: 'AI Background Remover',
    desc: 'Instantly remove backgrounds from portrait and product photos in your browser with AI precision and transparent PNG output.'
  },
  'base64-encoder': {
    title: 'Base64 Encoder & Decoder',
    desc: 'Encode and decode plain text or raw data strings to and from standard Base64 format with UTF-8 character preservation.'
  },
  'base64-to-image': {
    title: 'Base64 to Image Converter',
    desc: 'Convert Base64 data URI strings into viewable PNG, JPEG, or WebP images with instant preview and one-click download.'
  },
  'bmi-calculator': {
    title: 'BMI Calculator',
    desc: 'Calculate Body Mass Index (BMI) instantly using metric or imperial units with health classification categories and ideal weight ranges.'
  },
  'box-shadow-generator': {
    title: 'CSS Box Shadow Generator',
    desc: 'Create beautiful CSS box shadows with interactive sliders for horizontal/vertical offsets, blur, spread radius, color, and inset styles.'
  },
  'case-converter': {
    title: 'Text Case Converter',
    desc: 'Transform text between UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase instantly.'
  },
  'color-converter': {
    title: 'Color Converter (HEX, RGB, HSL)',
    desc: 'Convert color values between HEX, RGB, RGBA, and HSL color models in real-time with visual preview and clipboard copying.'
  },
  'color-extractor': {
    title: 'Image Color Palette Extractor',
    desc: 'Extract dominant color palettes and harmonious shades from any uploaded photo or illustration with exact HEX/RGB codes.'
  },
  'color-picker': {
    title: 'Color Picker & Eyedropper',
    desc: 'Pick pixel-perfect colors from uploaded images or your computer screen using the native eyedropper with HEX, RGB, and palette copying.'
  },
  'create-archive': {
    title: 'Create ZIP Archive',
    desc: 'Bundle and compress multiple files into a fast, portable ZIP archive directly in your browser without uploading to external servers.'
  },
  'crop-image': {
    title: 'Image Cropper',
    desc: 'Crop, resize, and reframe images with custom aspect ratios (1:1, 16:9, 4:3) and interactive drag-and-drop bounding boxes.'
  },
  'crop-pdf': {
    title: 'Crop PDF Margins',
    desc: 'Trim unwanted whitespace, printer bleed margins, and headers from PDF pages with visual margin controls and instant download.'
  },
  'css-generator': {
    title: 'CSS Code Generator',
    desc: 'Visually configure border-radius, flexbox layouts, CSS grid, transitions, and transforms with clean, copy-paste CSS output.'
  },
  'css-minifier': {
    title: 'CSS Minifier & Optimizer',
    desc: 'Compress and minify stylesheets by removing unnecessary whitespace, comments, and redundant rules for faster web page load times.'
  },
  'csv-to-json': {
    title: 'CSV to JSON Converter',
    desc: 'Convert tabular CSV data into structured JSON objects or arrays with automatic column header detection and formatted preview.'
  },
  'discount-calculator': {
    title: 'Discount & Sale Calculator',
    desc: 'Calculate final prices after percentage discounts, sales tax, and coupons with clear savings breakdowns for shoppers and merchants.'
  },
  'exif-remover': {
    title: 'EXIF Metadata Remover',
    desc: 'Strip GPS coordinates, camera models, exposure data, and private timestamps from photos to safeguard your online privacy.'
  },
  'extract-archive': {
    title: 'Extract ZIP Archive',
    desc: 'Unpack and view files inside ZIP archives directly in your browser without installing third-party unzipping software.'
  },
  'extract-pdf-pages': {
    title: 'Extract PDF Pages',
    desc: 'Select and export specific individual pages or custom page ranges from large PDF documents into a new standalone PDF.'
  },
  'favicon-generator': {
    title: 'Favicon Generator',
    desc: 'Generate complete multi-size favicon packages (16x16, 32x32, 48x48, 180x180) from any logo or square image for websites and apps.'
  },
  'file-decryptor': {
    title: 'File Decryptor',
    desc: 'Decrypt password-protected AES-256 encrypted files safely on the client side without exposing your secret passphrases.'
  },
  'file-encryptor': {
    title: 'File Encryptor',
    desc: 'Secure any sensitive document, archive, or picture with bank-grade AES-256 client-side encryption and custom passwords.'
  },
  'find-and-replace': {
    title: 'Find and Replace Text Tool',
    desc: 'Search, find, and replace words or regex patterns across long texts with case sensitivity, whole-word matching, and count stats.'
  },
  'gif-maker': {
    title: 'Animated GIF Maker',
    desc: 'Assemble multiple image frames into smooth animated GIFs with customizable frame delays, looping counts, and export quality.'
  },
  'gradient-generator': {
    title: 'CSS Gradient Generator',
    desc: 'Design vibrant linear and radial CSS gradients with multi-color stops, angle controls, and ready-to-paste CSS background code.'
  },
  'hash-generator': {
    title: 'Hash Generator (MD5, SHA-256)',
    desc: 'Generate secure cryptographic hash checksums including MD5, SHA-1, SHA-256, and SHA-512 from any input string.'
  },
  'html-encoder': {
    title: 'HTML Entity Encoder & Decoder',
    desc: 'Convert special characters into safe HTML entities (&amp;, &lt;, &gt;, &quot;) and decode escaped HTML entities back to raw text.'
  },
  'html-minifier': {
    title: 'HTML Minifier & Compressor',
    desc: 'Minify raw HTML markup by collapsing whitespace, stripping redundant comments, and optimizing tags for lightweight delivery.'
  },
  'html-to-pdf': {
    title: 'HTML to PDF Converter',
    desc: 'Render custom HTML code or web snippets into standardized A4 multi-page PDF documents with clean layout preservation.'
  },
  'image-compressor': {
    title: 'Image Compressor',
    desc: 'Compress JPG, PNG, and WebP images to reduce file sizes by up to 80% while maintaining high visual clarity.'
  },
  'image-convert': {
    title: 'Image Format Converter',
    desc: 'Convert images seamlessly between PNG, JPEG, WebP, GIF, and BMP formats with adjustable compression quality.'
  },
  'image-filters': {
    title: 'Photo Filters & Effects',
    desc: 'Apply creative photo adjustments including grayscale, sepia, brightness, contrast, blur, and saturation in real time.'
  },
  'image-resize': {
    title: 'Image Resizer',
    desc: 'Resize images to exact pixel dimensions or percentage scales with locked aspect ratios and high-quality resampling.'
  },
  'image-splitter': {
    title: 'Image Splitter & Grid Cutter',
    desc: 'Slice images into multiple rows and columns for Instagram carousels, photo grids, or tile mapping with ZIP export.'
  },
  'image-to-base64': {
    title: 'Image to Base64 Converter',
    desc: 'Convert image files into Base64 data URI strings ready to embed directly into HTML, CSS background images, or JSON APIs.'
  },
  'image-to-ico': {
    title: 'Image to ICO Converter',
    desc: 'Convert PNG and JPEG images into Windows and website ICO icon format with support for multiple embedded resolutions.'
  },
  'images-to-pdf': {
    title: 'Images to PDF Converter',
    desc: 'Combine multiple photos, receipts, and scans into a single organized PDF document with custom margins and page orientations.'
  },
  'json-formatter': {
    title: 'JSON Formatter & Validator',
    desc: 'Beautify, format, validate, and minify JSON data with syntax error detection, collapsible trees, and clean indentation.'
  },
  'jwt-decoder': {
    title: 'JWT Decoder (JSON Web Token)',
    desc: 'Decode JSON Web Tokens (JWT) to inspect header algorithms, payload claims, timestamps, and signature data safely in your browser.'
  },
  'loan-calculator': {
    title: 'Loan & Mortgage EMI Calculator',
    desc: 'Calculate monthly loan EMI payments, total interest payable, and full loan amortization schedules for home, car, or personal loans.'
  },
  'lorem-ipsum': {
    title: 'Lorem Ipsum Generator',
    desc: 'Generate classic Cicero Latin placeholder text in paragraphs, sentences, or words for web development and graphic design mockups.'
  },
  'markdown-previewer': {
    title: 'Markdown Editor & Live Previewer',
    desc: 'Write and preview GitHub-flavored Markdown in real time with syntax highlighting, live HTML export, and clean typography.'
  },
  'meme-generator': {
    title: 'Meme Generator',
    desc: 'Create custom funny memes by uploading photos, adding classic top and bottom impact text, and exporting high-res images.'
  },
  'merge-pdf': {
    title: 'Merge PDF',
    desc: 'Combine multiple PDF documents into a single organized file in seconds directly in your browser. Fast, private, and 100% free with CodeHubb Tools.'
  },
  'meta-tags-generator': {
    title: 'SEO Meta Tags Generator',
    desc: 'Generate essential SEO title tags, meta descriptions, Open Graph cards, and Twitter Cards to maximize social media click-throughs.'
  },
  'ocr': {
    title: 'OCR Text Extractor (Image to Text)',
    desc: 'Extract readable text from scanned images, screenshots, and photos using client-side optical character recognition.'
  },
  'organize-pdf': {
    title: 'Organize & Reorder PDF Pages',
    desc: 'Rearrange, reorder, delete, and duplicate pages within any PDF document with intuitive page cards and instant export.'
  },
  'password-generator': {
    title: 'Strong Password Generator',
    desc: 'Generate ultra-secure, cryptographically random passwords with custom lengths, symbols, numbers, and entropy strength meters.'
  },
  'pdf-editor': {
    title: 'PDF Editor',
    desc: 'Annotate, add text, highlight sections, and insert shapes onto PDF pages directly in your web browser with zero software installations.'
  },
  'pdf-to-csv': {
    title: 'PDF to CSV Converter',
    desc: 'Extract structured tables, bank statements, and tabular data rows from PDF documents into Excel-compatible CSV files.'
  },
  'pdf-to-images': {
    title: 'PDF to Images Converter',
    desc: 'Convert each page of a PDF document into high-resolution JPG or PNG images with ZIP batch downloading.'
  },
  'pdf-to-text': {
    title: 'PDF to Text Extractor',
    desc: 'Extract all raw textual content from PDF files into plain text (.txt) format with clean paragraph formatting.'
  },
  'pdf-to-word': {
    title: 'PDF to Word Converter',
    desc: 'Convert PDF documents into editable Microsoft Word (.docx) files while preserving headings and paragraph flows.'
  },
  'percentage-calculator': {
    title: 'Percentage Calculator',
    desc: 'Calculate percentage increases, percentage discounts, proportions, and fraction values with step-by-step mathematical breakdowns.'
  },
  'psd-editor': {
    title: 'PSD File Viewer & Editor',
    desc: 'Open, inspect layers, and export Photoshop (.psd) files into PNG or JPG format directly inside your browser.'
  },
  'qrcode-generator': {
    title: 'QR Code Generator',
    desc: 'Create custom QR codes for URLs, WiFi credentials, contact vCards, phone numbers, and text with custom colors and PNG download.'
  },
  'random-number-generator': {
    title: 'Random Number Generator',
    desc: 'Generate truly random numbers and sequence sets within custom min-max ranges for lotteries, games, and research.'
  },
  'regex-tester': {
    title: 'Regular Expression (Regex) Tester',
    desc: 'Test and debug JavaScript regular expressions in real-time with match highlights, capturing groups, and flag toggles.'
  },
  'remove-pdf-pages': {
    title: 'Remove PDF Pages',
    desc: 'Delete unwanted or blank pages from PDF documents easily without damaging document quality or formatting.'
  },
  'reverse-text': {
    title: 'Reverse Text Generator',
    desc: 'Reverse text characters, reverse word orders, or flip paragraphs upside down for creative typography and testing.'
  },
  'rotate-pdf': {
    title: 'Rotate PDF Pages',
    desc: 'Rotate upside-down or sideways PDF pages by 90, 180, or 270 degrees permanently and download the corrected document.'
  },
  'screen-recorder': {
    title: 'Screen Recorder',
    desc: 'Record your desktop screen, browser tab, or application window with audio directly from your browser with no watermarks.'
  },
  'sign-pdf': {
    title: 'Sign PDF Online',
    desc: 'Draw, position, and burn your electronic signature onto any PDF document securely in your browser with zero server uploads.'
  },
  'slug-generator': {
    title: 'URL Slug Generator',
    desc: 'Convert article titles and headlines into clean, URL-friendly, SEO-optimized kebab-case slugs with accent stripping.'
  },
  'speech-to-text': {
    title: 'Speech to Text (Voice Transcriber)',
    desc: 'Transcribe spoken voice through your microphone into editable text in real time using the browser Web Speech recognition API.'
  },
  'split-pdf': {
    title: 'Split PDF',
    desc: 'Separate PDF documents into individual single-page files or custom page ranges with instant ZIP download.'
  },
  'svg-to-png': {
    title: 'SVG to PNG Converter',
    desc: 'Rasterize SVG vector illustrations into crisp, high-resolution PNG images up to 8x resolution with full viewBox handling.'
  },
  'text-to-binary': {
    title: 'Text to Binary & Binary to Text',
    desc: 'Convert ASCII and Unicode characters to 8-bit binary numbers (0s and 1s) and decode binary sequences back to text.'
  },
  'text-to-speech': {
    title: 'Text to Speech (Voice Synthesizer)',
    desc: 'Convert written text into natural-sounding speech with adjustable pitch, playback rates, and multiple language voices.'
  },
  'url-encoder': {
    title: 'URL Encoder & Decoder',
    desc: 'Encode query string parameters and special URL characters into percent-encoded format and decode escaped URLs back to text.'
  },
  'utm-builder': {
    title: 'UTM Campaign URL Builder',
    desc: 'Generate tracked marketing campaign links with utm_source, utm_medium, utm_campaign, utm_term, and utm_content parameters.'
  },
  'uuid-generator': {
    title: 'UUID / GUID Generator',
    desc: 'Generate cryptographically random Version-4 UUIDs in bulk with uppercase, lowercase, and hyphen toggles.'
  },
  'video-to-audio': {
    title: 'Video to Audio (WAV & MP3)',
    desc: 'Extract high-fidelity audio tracks from video files (MP4, WebM, MKV, AVI) completely client-side with instant playback and download.'
  },
  'watermark-image': {
    title: 'Watermark Image',
    desc: 'Add custom text or logo watermarks to photos with adjustable opacity, positioning, font size, and rotation to protect copyright.'
  },
  'watermark-pdf': {
    title: 'Watermark PDF',
    desc: 'Stamp confidential, draft, or custom text watermarks across all pages of a PDF document with custom transparency and angles.'
  },
  'webcam-recorder': {
    title: 'Webcam Video Recorder',
    desc: 'Record video messages, tutorials, and webcam clips with audio directly inside your web browser and save as WebM or MP4.'
  },
  'website-screenshot': {
    title: 'Website Screenshot Capture',
    desc: 'Capture full-page or viewport screenshots of any public website URL with responsive device previewing.'
  },
  'website-to-pdf': {
    title: 'Website to PDF Converter',
    desc: 'Convert any online web page into a printable, high-quality PDF document with one click.'
  },
  'whitespace-remover': {
    title: 'Whitespace & Line Break Remover',
    desc: 'Remove extra spaces, tabs, duplicate empty lines, and trailing spaces from text blocks and code snippets.'
  },
  'word-counter': {
    title: 'Word & Character Counter',
    desc: 'Count words, characters (with and without spaces), sentences, paragraphs, and estimated reading time in real time.'
  },
  'xml-formatter': {
    title: 'XML Formatter & Beautifier',
    desc: 'Format, indent, validate, and beautify raw XML code with syntax highlighting and tree structural inspection.'
  }
};

const toolsDir = path.join(__dirname, 'src', 'app', 'tools');
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('.'));

let updated = 0;
for (const d of dirs) {
  const layoutPath = path.join(toolsDir, d.name, 'layout.tsx');
  const info = TOOL_METADATA[d.name];
  
  const title = info ? info.title : d.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const desc = info ? info.desc : `Free online ${title} tool. Fast, private, client-side utility by CodeHubb Tools.`;

  const code = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${title.replace(/'/g, "\\'")}',
  description: '${desc.replace(/'/g, "\\'")}',
  alternates: {
    canonical: './',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;

  fs.writeFileSync(layoutPath, code);
  updated++;
}

console.log(`Successfully updated ${updated} tool layout files with unique, tailored metadata and canonical tags!`);
