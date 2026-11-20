const fs = require('fs');
const path = require('path');

const toolsDir = path.join(__dirname, 'src', 'app', 'tools');
const dirs = fs.readdirSync(toolsDir).filter(f => fs.statSync(path.join(toolsDir, f)).isDirectory());

const results = {
  backend_dependent: [],
  client_side_functional: [],
  ui_stub: [],
  unknown: []
};

dirs.forEach(toolName => {
  const pagePath = path.join(toolsDir, toolName, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    const code = fs.readFileSync(pagePath, 'utf8');
    
    // Check if it calls a backend API
    const hasFetch = code.includes('fetch(') || code.includes('axios.');
    const hasApiUrl = code.includes('/api/') || code.includes('NEXT_PUBLIC_API_URL');
    
    // Check if it's a known client-side library
    const hasPdfLib = code.includes('pdf-lib');
    const hasPdfJs = code.includes('pdfjs-dist');
    const hasHtml2Pdf = code.includes('html2pdf');
    const hasDocx = code.includes('docx');
    
    // Check for stubs
    const isStub = code.includes('Coming soon') || code.includes('Not implemented') || (!hasFetch && !hasPdfLib && !hasPdfJs && !hasHtml2Pdf && !hasDocx && code.length < 1500);

    if (hasFetch && hasApiUrl) {
      results.backend_dependent.push(toolName);
    } else if (hasPdfLib || hasPdfJs || hasHtml2Pdf || hasDocx || (!hasFetch && code.length > 2000)) {
      results.client_side_functional.push(toolName);
    } else if (isStub) {
      results.ui_stub.push(toolName);
    } else {
      results.unknown.push(toolName);
    }
  }
});

console.log(JSON.stringify(results, null, 2));
