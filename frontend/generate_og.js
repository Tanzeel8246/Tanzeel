const sharp = require('sharp');
const path = require('path');

const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="50%" stop-color="#1e1b4b"/>
      <stop offset="100%" stop-color="#311042"/>
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366f1"/>
      <stop offset="50%" stop-color="#a855f7"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- Badge -->
  <rect x="100" y="110" width="320" height="46" rx="23" fill="#312e81" stroke="#6366f1" stroke-width="2" opacity="0.9"/>
  <text x="130" y="140" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#a5b4fc">⚡ 84+ ALL-IN-ONE WEB TOOLS</text>

  <!-- Main Title -->
  <text x="100" y="240" font-family="Arial, sans-serif" font-size="68" font-weight="900" fill="#ffffff" letter-spacing="-1">CodeHubb Tools</text>

  <!-- Subtitle with Gradient text -->
  <text x="100" y="320" font-family="Arial, sans-serif" font-size="38" font-weight="700" fill="url(#glow)">AI Assistants, PDF, Image &amp; Developer Suite</text>

  <!-- Description -->
  <text x="100" y="390" font-family="Arial, sans-serif" font-size="24" fill="#cbd5e1">Fast, secure, client-side tools designed for developers, creators &amp; students.</text>
  <text x="100" y="425" font-family="Arial, sans-serif" font-size="24" fill="#94a3b8">100% Free • Privacy-First • No File Uploads to External Servers</text>

  <!-- Feature Tags -->
  <g transform="translate(100, 480)">
    <rect x="0" y="0" width="180" height="48" rx="12" fill="#1e293b" stroke="#475569"/>
    <text x="25" y="31" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">🤖 AI Assistants</text>

    <rect x="200" y="0" width="160" height="48" rx="12" fill="#1e293b" stroke="#475569"/>
    <text x="225" y="31" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">📄 PDF Suite</text>

    <rect x="380" y="0" width="190" height="48" rx="12" fill="#1e293b" stroke="#475569"/>
    <text x="405" y="31" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">🖼️ Image Studio</text>

    <rect x="590" y="0" width="190" height="48" rx="12" fill="#1e293b" stroke="#475569"/>
    <text x="615" y="31" font-family="Arial, sans-serif" font-size="20" fill="#e2e8f0">💻 Dev Utilities</text>
  </g>

  <!-- Domain Branding -->
  <text x="100" y="590" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#818cf8">🌐 tanzeel.work</text>
</svg>
`;

sharp(Buffer.from(svg))
  .jpeg({ quality: 95 })
  .toFile(path.join(__dirname, 'public', 'og-image.jpg'))
  .then(() => console.log('Successfully generated public/og-image.jpg!'))
  .catch(err => console.error(err));
