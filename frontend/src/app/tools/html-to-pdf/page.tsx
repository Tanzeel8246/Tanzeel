'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { FileCode, Download, CheckCircle2, Type, Sparkles, ShieldCheck, Zap, HelpCircle } from 'lucide-react';

export default function HtmlToPdfPage() {
  const [htmlContent, setHtmlContent] = useState<string>(
`<h2>Invoice &amp; Project Summary</h2>
<p>This is a <b>PDF document</b> generated from HTML with <i>clean vector text embedding</i>.</p>
<hr />
<h3>Features Included:</h3>
<ul>
  <li>Full selectable and searchable text (Ctrl+F supported).</li>
  <li>Lightweight client-side processing in milliseconds.</li>
  <li>Zero server transmission — 100% private.</li>
</ul>
<p>Thank you for using <b>CodeHubb Tools</b>!</p>`
  );

  const [mode, setMode] = useState<'vector' | 'canvas'>('vector');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; fileName: string; size: string } | null>(null);

  // 1. Vector Mode: Native pdf-lib text embedding (100% selectable, searchable, lightweight)
  const generateVectorPdf = async (html: string) => {
    const pdfDoc = await PDFDocument.create();
    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const parser = new DOMParser();
    const doc = parser.parseFromString(`<div>${html}</div>`, 'text/html');

    // Standard A4 dimensions in points: 595.28 x 841.89
    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const margin = 50;
    const contentWidth = pageWidth - (margin * 2);

    let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
    let currentY = pageHeight - margin;

    const checkPageBreak = (neededHeight: number) => {
      if (currentY - neededHeight < margin) {
        currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
        currentY = pageHeight - margin;
      }
    };

    const wrapText = (text: string, font: any, size: number, maxWidth: number): string[] => {
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const width = font.widthOfTextAtSize(testLine, size);
        if (width <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines;
    };

    const walk = (node: Node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        if (tag === 'h1' || tag === 'h2') {
          const text = el.textContent?.trim() || '';
          if (text) {
            checkPageBreak(36);
            currentY -= 10;
            const lines = wrapText(text, fontBold, 18, contentWidth);
            lines.forEach(line => {
              currentPage.drawText(line, {
                x: margin,
                y: currentY,
                size: 18,
                font: fontBold,
                color: rgb(0.07, 0.09, 0.15),
              });
              currentY -= 22;
            });
            currentY -= 6;
          }
          return;
        }

        if (tag === 'h3' || tag === 'h4') {
          const text = el.textContent?.trim() || '';
          if (text) {
            checkPageBreak(28);
            currentY -= 8;
            const lines = wrapText(text, fontBold, 14, contentWidth);
            lines.forEach(line => {
              currentPage.drawText(line, {
                x: margin,
                y: currentY,
                size: 14,
                font: fontBold,
                color: rgb(0.12, 0.16, 0.23),
              });
              currentY -= 18;
            });
            currentY -= 4;
          }
          return;
        }

        if (tag === 'p') {
          const text = el.textContent?.trim() || '';
          if (text) {
            checkPageBreak(20);
            currentY -= 4;
            const lines = wrapText(text, fontRegular, 11, contentWidth);
            lines.forEach(line => {
              currentPage.drawText(line, {
                x: margin,
                y: currentY,
                size: 11,
                font: fontRegular,
                color: rgb(0.2, 0.25, 0.33),
              });
              currentY -= 15;
            });
            currentY -= 6;
          }
          return;
        }

        if (tag === 'li') {
          const text = el.textContent?.trim() || '';
          if (text) {
            checkPageBreak(18);
            currentPage.drawText('•', {
              x: margin + 8,
              y: currentY,
              size: 12,
              font: fontBold,
              color: rgb(0.3, 0.35, 0.5),
            });
            const lines = wrapText(text, fontRegular, 10.5, contentWidth - 24);
            lines.forEach((line, idx) => {
              currentPage.drawText(line, {
                x: margin + 24,
                y: currentY - (idx * 14),
                size: 10.5,
                font: fontRegular,
                color: rgb(0.2, 0.25, 0.33),
              });
            });
            currentY -= (lines.length * 14) + 4;
          }
          return;
        }

        if (tag === 'hr') {
          checkPageBreak(15);
          currentY -= 8;
          currentPage.drawLine({
            start: { x: margin, y: currentY },
            end: { x: pageWidth - margin, y: currentY },
            thickness: 1,
            color: rgb(0.85, 0.88, 0.92),
          });
          currentY -= 12;
          return;
        }

        // Recursively handle children
        Array.from(node.childNodes).forEach(walk);
      }
    };

    walk(doc.body);

    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes as any], { type: 'application/pdf' });
  };

  // 2. Canvas Mode: High-DPI rasterization via html2pdf.js
  const generateCanvasPdf = async (html: string) => {
    const container = document.createElement('div');
    container.innerHTML = html;
    container.style.width = '794px';
    container.style.minHeight = '1123px';
    container.style.padding = '36px';
    container.style.fontFamily = 'sans-serif, Arial, Helvetica';
    container.style.fontSize = '14px';
    container.style.lineHeight = '1.6';
    container.style.color = '#111827';
    container.style.backgroundColor = '#ffffff';
    container.style.boxSizing = 'border-box';
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '0';
    document.body.appendChild(container);

    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: 'converted.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
      };
      const blob = await html2pdf().set(opt as any).from(container).output('blob');
      return blob;
    } finally {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    }
  };

  const handleConvert = async () => {
    if (!htmlContent.trim()) {
      setError('Please enter some HTML code.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      let blob: Blob;
      if (mode === 'vector') {
        blob = await generateVectorPdf(htmlContent);
      } else {
        blob = await generateCanvasPdf(htmlContent);
      }

      const url = URL.createObjectURL(blob);
      const fileName = `html_document_${Date.now()}.pdf`;
      const size = (blob.size / 1024).toFixed(1) + ' KB';

      setResult({ url, fileName, size });

      // Auto-trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to convert HTML to PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>

        {/* Main Tool Container */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 mb-12">
          
          <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50/50 via-purple-50/30 to-transparent dark:from-indigo-950/30 dark:via-purple-950/20 dark:to-transparent">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
              HTML to PDF Converter
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base max-w-2xl">
              Convert raw HTML markup or styled templates into clean PDF documents with embedded, selectable vector text and zero server uploads.
            </p>
          </div>

          <div className="p-8 flex flex-col lg:flex-row gap-8">
            
            {/* Editor Area */}
            <div className="w-full lg:w-1/2 flex flex-col space-y-4">
              
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gray-50 dark:bg-gray-700/40 rounded-2xl border border-gray-200 dark:border-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase text-gray-500 dark:text-gray-400">Mode:</span>
                  <div className="inline-flex rounded-xl bg-gray-200 dark:bg-gray-600 p-1">
                    <button
                      onClick={() => setMode('vector')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${mode === 'vector' ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 dark:text-gray-300'}`}
                      title="Generates real selectable, searchable text in PDF"
                    >
                      <Type size={14} />
                      <span>Selectable Vector Text</span>
                    </button>
                    <button
                      onClick={() => setMode('canvas')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${mode === 'canvas' ? 'bg-indigo-600 text-white shadow' : 'text-gray-700 dark:text-gray-300'}`}
                      title="Renders complex CSS layouts and graphics as high-DPI canvas"
                    >
                      <Sparkles size={14} />
                      <span>Graphic Layout</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => { setHtmlContent(''); setResult(null); }} 
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Clear Editor
                </button>
              </div>

              <div className="flex-1 flex flex-col min-h-[350px]">
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-2">
                  HTML Source Code
                </label>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="<h2>Type your HTML here...</h2>"
                  className="w-full flex-1 p-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-gray-800 dark:text-gray-200 font-mono text-sm resize-none shadow-inner min-h-[300px]"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl text-sm font-medium text-center border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              {/* Success Result View */}
              {result && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-500/30 rounded-2xl text-center animate-fade-in">
                  <div className="inline-flex items-center gap-2 text-green-700 dark:text-green-400 font-bold mb-2">
                    <CheckCircle2 size={20} />
                    <span>PDF Generated Successfully ({result.size})</span>
                  </div>
                  <div className="flex justify-center">
                    <a
                      href={result.url}
                      download={result.fileName}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-all text-sm"
                    >
                      <Download size={18} />
                      <span>Download PDF Again</span>
                    </a>
                  </div>
                </div>
              )}

              <button
                onClick={handleConvert}
                disabled={!htmlContent.trim() || isProcessing}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 text-base"
              >
                {isProcessing ? (
                  <span>Generating PDF...</span>
                ) : (
                  <>
                    <Download size={20} />
                    <span>Convert &amp; Download PDF Document</span>
                  </>
                )}
              </button>
            </div>

            {/* Live Preview Area (Rendered in isolated iframe to prevent global DOM contamination) */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">
                  Real-time Document Preview
                </span>
                <span className="text-xs font-mono text-gray-400">A4 Standard Format</span>
              </div>
              <div className="w-full flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-white shadow-inner min-h-[400px]">
                <iframe
                  title="HTML to PDF Live Preview"
                  srcDoc={`<!DOCTYPE html><html><head><style>body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 28px; color: #1f2937; line-height: 1.6; } h2, h3, h4 { color: #111827; } hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }</style></head><body>${htmlContent}</body></html>`}
                  className="w-full h-full min-h-[400px] border-none"
                  sandbox="allow-same-origin"
                />
              </div>
            </div>

          </div>
        </div>

        {/* SEO Original Content & Guide Section */}
        <section className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              How to Convert HTML Code to PDF with Embedded Text
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-xl mb-2 block">01</span>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Paste HTML Code</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Paste your invoices, receipts, articles, or custom HTML snippets in the editor.</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-xl mb-2 block">02</span>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Choose Text Mode</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Select &quot;Selectable Vector Text&quot; so words can be highlighted, copied, and searched in Adobe Acrobat.</p>
              </div>
              <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                <span className="text-indigo-600 dark:text-indigo-400 font-black text-xl mb-2 block">03</span>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">Instant PDF Export</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Click Convert to save your standardized A4 PDF document with crisp typography.</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions (FAQ)
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Can I copy and highlight text in the converted PDF?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">Yes! In &quot;Selectable Vector Text&quot; mode, our engine embeds native PostScript/TrueType fonts so you can select, copy, and search words with Ctrl+F just like in a typed document.</p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/30">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Is my HTML or financial data uploaded to any server?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">No. All conversion is processed in your local browser memory using JavaScript and WebAssembly. Your data remains strictly on your device.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
