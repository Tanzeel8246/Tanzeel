'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { PDFDocument } from 'pdf-lib';
let pdfjsLib: any = null;
export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [pdfData, setPdfData] = useState<Uint8Array | null>(null);
  
  // Signature Canvas Ref
  const sigCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [penColor, setPenColor] = useState('#000000');

  useEffect(() => {
    import('pdfjs-dist').then(mod => {
      pdfjsLib = mod;
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    });
  }, []);

  // PDF Preview Canvas Ref
  const pdfCanvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<any>(null);
  
  // Signature Position on PDF
  const [sigPos, setSigPos] = useState({ x: 100, y: 100 });
  const [sigSize, setSigSize] = useState({ width: 200, height: 100 });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError(null);
      setSuccess(false);

      try {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const data = new Uint8Array(arrayBuffer);
        setPdfData(data);
        
        if (!pdfjsLib) throw new Error('PDF library loading, please try again in a moment');
        
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(data.slice(0)) });
        const pdfDoc = await loadingTask.promise;
        setTotalPages(pdfDoc.numPages);
        setCurrentPage(1);
        renderPage(pdfDoc, 1);
      } catch (err: any) {
        setError('Failed to load PDF preview.');
      }
    }
  };

  const renderPage = async (pdfDoc: any, pageNum: number) => {
    if (!pdfCanvasRef.current) return;
    
    if (renderTaskRef.current) {
      await renderTaskRef.current.promise.catch(() => {});
    }

    try {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale: 1.0 }); // Use scale 1 to map coordinates easily
      
      const canvas = pdfCanvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };

      renderTaskRef.current = page.render(renderContext);
      await renderTaskRef.current.promise;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (pdfData) {
      const load = async () => {
        if (!pdfjsLib) return;
        const loadingTask = pdfjsLib.getDocument({ data: new Uint8Array(pdfData.slice(0)) });
        const pdfDoc = await loadingTask.promise;
        renderPage(pdfDoc, currentPage);
      };
      load();
    }
  }, [currentPage, pdfData]);

  // Signature Drawing Logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    
    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.strokeStyle = penColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  const handleApplySignature = async () => {
    if (!file || !pdfData) {
      setError('No PDF loaded.');
      return;
    }
    if (!hasSignature || !sigCanvasRef.current) {
      setError('Please draw a signature first.');
      return;
    }

    setIsProcessing(true);
    setError(null);
    
    try {
      // 1. Get Signature as PNG Data URL
      const sigDataUrl = sigCanvasRef.current.toDataURL('image/png');
      
      // 2. Load PDF
      const freshBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(freshBuffer);
      
      // 3. Embed Signature Image
      const pngImage = await pdfDoc.embedPng(sigDataUrl);
      
      // 4. Add to specific page
      const page = pdfDoc.getPage(currentPage - 1);
      const { height } = page.getSize();
      
      // Calculate coordinates (pdf-lib y-axis is from bottom up)
      const pdfY = height - sigPos.y - sigSize.height;

      page.drawImage(pngImage, {
        x: sigPos.x,
        y: pdfY,
        width: sigSize.width,
        height: sigSize.height,
      });

      // Save and Download
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `signed_${file.name}`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to sign PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:underline mb-6 inline-block">
          &larr; Back to Tools
        </Link>
        
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[75vh]">
          
          {/* Sidebar / Controls */}
          <div className="w-full md:w-1/3 p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 flex flex-col h-[75vh] overflow-y-auto">
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">
              Sign PDF
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
              Draw your signature and place it anywhere on your PDF document securely in your browser.
            </p>
            
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-2xl cursor-pointer bg-white dark:bg-gray-700 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors mb-6">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <p className="mb-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400">Upload PDF</p>
              </div>
              <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
            </label>

            {file && (
              <div className="space-y-6 flex-1">
                {/* Page Navigation */}
                {totalPages > 1 && (
                   <div className="flex justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-xl border border-gray-200 dark:border-gray-600">
                     <button 
                       onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                       disabled={currentPage === 1}
                       className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded disabled:opacity-50 text-sm font-bold"
                     >
                       Prev
                     </button>
                     <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                       Page {currentPage} of {totalPages}
                     </span>
                     <button 
                       onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                       disabled={currentPage === totalPages}
                       className="px-3 py-1 bg-gray-100 dark:bg-gray-600 rounded disabled:opacity-50 text-sm font-bold"
                     >
                       Next
                     </button>
                   </div>
                )}

                {/* Signature Pad */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Draw Signature</label>
                    <button onClick={clearSignature} className="text-xs text-red-500 font-bold hover:underline">Clear</button>
                  </div>
                  <div className="border-2 border-gray-300 dark:border-gray-600 bg-white rounded-xl overflow-hidden cursor-crosshair">
                    <canvas 
                      ref={sigCanvasRef}
                      width={300}
                      height={150}
                      className="w-full bg-white touch-none"
                      onMouseDown={startDrawing}
                      onMouseMove={draw}
                      onMouseUp={stopDrawing}
                      onMouseOut={stopDrawing}
                      onTouchStart={startDrawing}
                      onTouchMove={draw}
                      onTouchEnd={stopDrawing}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs font-medium text-gray-500">Pen Color:</span>
                    <input type="color" value={penColor} onChange={e => setPenColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                  </div>
                </div>

                {/* Placement Adjustments */}
                <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600">
                  <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 text-center">Signature Position (X, Y)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Left (X)</span>
                      <input type="number" value={sigPos.x} onChange={e => setSigPos({...sigPos, x: Number(e.target.value)})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-sm" />
                    </div>
                    <div>
                      <span className="text-xs text-gray-400 block mb-1">Top (Y)</span>
                      <input type="number" value={sigPos.y} onChange={e => setSigPos({...sigPos, y: Number(e.target.value)})} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-sm" />
                    </div>
                  </div>
                </div>

                {error && <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center font-medium">{error}</div>}
                {success && <div className="p-3 bg-green-100 text-green-700 rounded-xl text-sm text-center font-medium">Signed PDF Downloaded!</div>}

                <button
                  onClick={handleApplySignature}
                  disabled={isProcessing || !hasSignature}
                  className="w-full py-4 mt-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center space-x-2"
                >
                  {isProcessing ? 'Signing...' : 'Sign & Download'}
                </button>
              </div>
            )}
          </div>

          {/* Main Output Area (Preview) */}
          <div className="flex-1 p-8 bg-gray-100 dark:bg-gray-900 flex flex-col items-center overflow-auto h-[75vh] relative">
            {file ? (
              <div className="relative shadow-2xl border border-gray-300 dark:border-gray-700 bg-white inline-block">
                <canvas ref={pdfCanvasRef} className="max-w-full h-auto block" />
                
                {/* Visual indicator of signature placement */}
                {hasSignature && (
                   <div 
                     className="absolute border-2 border-indigo-500 bg-indigo-500/20 flex items-center justify-center text-indigo-800 font-bold text-xs pointer-events-none"
                     style={{
                       left: `${sigPos.x}px`,
                       top: `${sigPos.y}px`,
                       width: `${sigSize.width}px`,
                       height: `${sigSize.height}px`
                     }}
                   >
                     Signature Here
                   </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex items-center justify-center text-gray-400">
                Upload a PDF to see preview
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
