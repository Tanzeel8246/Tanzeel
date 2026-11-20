const fs = require('fs');
const path = require('path');

const copyDir = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  if (!fs.existsSync(src)) return;

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

const standaloneDir = path.join(__dirname, '.next', 'standalone', 'frontend');
const nextStaticDir = path.join(__dirname, '.next', 'static');
const publicDir = path.join(__dirname, 'public');

const destNextStatic = path.join(standaloneDir, 'public', '_next', 'static');
const destPublic = path.join(standaloneDir, 'public');

console.log('Copying .next/static to standalone/frontend/public/_next/static...');
copyDir(nextStaticDir, destNextStatic);

console.log('Copying public to standalone/frontend/public...');
copyDir(publicDir, destPublic);

console.log('Done! Now you can zip the contents of standalone/frontend and upload it.');
console.log('Note: cPanel will automatically serve the assets from public/_next/static!');
