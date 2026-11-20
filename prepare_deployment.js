const fs = require('fs');
const path = require('path');
const { ZipArchive } = require('archiver');

function copyFolderSync(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.readdirSync(from).forEach(element => {
    const stat = fs.lstatSync(path.join(from, element));
    if (stat.isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element));
    } else if (stat.isDirectory()) {
      copyFolderSync(path.join(from, element), path.join(to, element));
    }
  });
}

const rootDir = __dirname;
const frontendDir = path.join(rootDir, 'frontend');
const standaloneDir = path.join(frontendDir, '.next', 'standalone');
const standaloneFrontend = path.join(standaloneDir, 'frontend');

console.log('1. Copying full .next build (server, static, manifests) to both root and frontend...');
// 1a. Copy full .next directory (server, static, and manifests)
copyFolderSync(path.join(frontendDir, '.next', 'static'), path.join(standaloneDir, '.next', 'static'));
copyFolderSync(path.join(frontendDir, '.next', 'static'), path.join(standaloneFrontend, '.next', 'static'));
copyFolderSync(path.join(frontendDir, '.next', 'server'), path.join(standaloneDir, '.next', 'server'));
copyFolderSync(path.join(frontendDir, '.next', 'server'), path.join(standaloneFrontend, '.next', 'server'));

// 1b. Copy _next/static for LiteSpeed direct static file serving
copyFolderSync(path.join(frontendDir, '.next', 'static'), path.join(standaloneDir, '_next', 'static'));
copyFolderSync(path.join(frontendDir, '.next', 'static'), path.join(standaloneFrontend, '_next', 'static'));
copyFolderSync(path.join(frontendDir, '.next', 'static'), path.join(standaloneDir, 'public', '_next', 'static'));
copyFolderSync(path.join(frontendDir, '.next', 'static'), path.join(standaloneFrontend, 'public', '_next', 'static'));

// 1c. Copy all manifest files from .next
const manifestFiles = [
  'BUILD_ID',
  'build-manifest.json',
  'prerender-manifest.json',
  'routes-manifest.json',
  'react-loadable-manifest.json',
  'server-reference-manifest.json',
  'next-minimal-server.js.nft.json',
  'package.json'
];
for (const mf of manifestFiles) {
  const src = path.join(frontendDir, '.next', mf);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(standaloneDir, '.next', mf));
    fs.copyFileSync(src, path.join(standaloneFrontend, '.next', mf));
  }
}

console.log('2. Copying public assets...');
copyFolderSync(path.join(frontendDir, 'public'), path.join(standaloneDir, 'public'));
copyFolderSync(path.join(frontendDir, 'public'), path.join(standaloneFrontend, 'public'));

console.log('3. Copying prisma database & schema...');
copyFolderSync(path.join(frontendDir, 'prisma'), path.join(standaloneDir, 'prisma'));
copyFolderSync(path.join(frontendDir, 'prisma'), path.join(standaloneFrontend, 'prisma'));

console.log('3b. Copying data directory (tools database)...');
copyFolderSync(path.join(frontendDir, 'data'), path.join(standaloneDir, 'data'));
copyFolderSync(path.join(frontendDir, 'data'), path.join(standaloneFrontend, 'data'));

console.log('4. Ensuring node_modules exists in both root and frontend in standalone...');
const srcNodeModules = path.join(standaloneFrontend, 'node_modules');
const destNodeModules = path.join(standaloneDir, 'node_modules');
if (fs.existsSync(srcNodeModules) && !fs.existsSync(destNodeModules)) {
  copyFolderSync(srcNodeModules, destNodeModules);
}

console.log('5. Creating root bridge server.js & app.js...');
const rootBridgeServer = `// cPanel LiteSpeed / Phusion Passenger Bridge for Next.js Standalone
const http = require('http');
const path = require('path');
const fs = require('fs');

console.log('[tanzeel.work] Starting Passenger Bridge Server...');
console.log('[tanzeel.work] Node version:', process.version);
console.log('[tanzeel.work] Current working directory:', process.cwd());
console.log('[tanzeel.work] PASSENGER PORT env:', process.env.PORT);

// 1. One-time self-healing Linux directory & file permissions
const markerFile = path.join(__dirname, '.permissions_ok');
if (!fs.existsSync(markerFile)) {
  try {
    console.log('[tanzeel.work] First-run: Ensuring 0755 permissions on all directories...');
    function fixPerms(dir, depth = 0) {
      if (depth > 5) return;
      try {
        fs.chmodSync(dir, 0o755);
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const full = path.join(dir, entry.name);
          try {
            if (entry.isDirectory()) {
              fs.chmodSync(full, 0o755);
              fixPerms(full, depth + 1);
            } else {
              fs.chmodSync(full, 0o644);
            }
          } catch (e) {}
        }
      } catch (e) {}
    }
    fixPerms(__dirname, 0);
    fs.writeFileSync(markerFile, 'ok');
    console.log('[tanzeel.work] Permissions verified successfully.');
  } catch (err) {
    console.warn('[tanzeel.work] Warning during chmod:', err.message);
  }
}

// 2. Monkey-patch http.Server.prototype.listen to bind cleanly to Passenger
const originalListen = http.Server.prototype.listen;
http.Server.prototype.listen = function(...args) {
  if (typeof PhusionPassenger !== 'undefined') {
    console.log('[tanzeel.work] Detected PhusionPassenger global binding...');
    return originalListen.call(this, 'passenger');
  }
  const passengerTarget = process.env.PORT;
  if (passengerTarget) {
    if (isNaN(Number(passengerTarget))) {
      console.log('[tanzeel.work] Listening on Phusion Passenger UNIX socket:', passengerTarget);
      return originalListen.call(this, passengerTarget);
    } else {
      const pNum = Number(passengerTarget);
      console.log('[tanzeel.work] Listening on Phusion Passenger port:', pNum);
      return originalListen.call(this, pNum, '127.0.0.1');
    }
  }
  return originalListen.apply(this, args);
};

// 3. Set production environment
process.env.NODE_ENV = 'production';

// 4. Require Next.js standalone entrypoint
const frontendServer = path.join(__dirname, 'frontend', 'server.js');
if (fs.existsSync(frontendServer)) {
  console.log('[tanzeel.work] Loading Next.js from frontend/server.js');
  process.chdir(path.join(__dirname, 'frontend'));
  require(frontendServer);
} else {
  const altServer = path.join(__dirname, '.next', 'standalone', 'server.js');
  if (fs.existsSync(altServer)) {
    console.log('[tanzeel.work] Loading Next.js from .next/standalone/server.js');
    require(altServer);
  } else {
    console.error('[tanzeel.work] FATAL: Next.js standalone server.js not found in frontend/ or .next/standalone/');
    process.exit(1);
  }
}
`;

fs.writeFileSync(path.join(standaloneDir, 'server.js'), rootBridgeServer);
fs.writeFileSync(path.join(standaloneDir, 'app.js'), "require('./server.js');\n");

const fixPermsPhp = `<?php
// One-click Linux permission fixer & Passenger reloader for cPanel LiteSpeed
header('Content-Type: text/plain');
$dir = __DIR__;
echo "Starting permission fix and asset verification on: $dir\\n";

// 1. Recursive chmod
$iterator = new RecursiveIteratorIterator(
    new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
    RecursiveIteratorIterator::SELF_FIRST
);

$count = 0;
foreach ($iterator as $item) {
    if ($item->isDir()) {
        chmod($item->getPathname(), 0755);
    } else {
        chmod($item->getPathname(), 0644);
    }
    $count++;
}
chmod($dir, 0755);

// 2. Ensure _next/static exists in Document Root for direct LiteSpeed serving
$rootNextStatic = $dir . '/_next/static';
$frontendNextStatic = $dir . '/frontend/.next/static';
$altNextStatic = $dir . '/.next/static';

if (!is_dir($rootNextStatic)) {
    if (is_dir($frontendNextStatic)) {
        @mkdir($dir . '/_next', 0755, true);
        @symlink($frontendNextStatic, $rootNextStatic);
        echo "Created symlink: _next/static -> frontend/.next/static\\n";
    } elseif (is_dir($altNextStatic)) {
        @mkdir($dir . '/_next', 0755, true);
        @symlink($altNextStatic, $rootNextStatic);
        echo "Created symlink: _next/static -> .next/static\\n";
    }
}

// 3. Touch restart.txt to reload Passenger Node.js app
$tmpDir = $dir . '/tmp';
if (!is_dir($tmpDir)) {
    mkdir($tmpDir, 0755, true);
}
touch($tmpDir . '/restart.txt');
echo "Done! Fixed permissions on $count files/folders to 0755/0644.\\n";
echo "Reloaded Phusion Passenger by updating $tmpDir/restart.txt\\n";

// 4. Display last 35 lines of stderr.log if available
$logFile = $dir . '/stderr.log';
if (file_exists($logFile)) {
    echo "\\n=== RECENT SERVER LOGS (stderr.log) ===\\n";
    $lines = file($logFile);
    echo implode("", array_slice($lines, -35));
}
`;
fs.writeFileSync(path.join(standaloneDir, 'fix_permissions.php'), fixPermsPhp);
fs.writeFileSync(path.join(standaloneFrontend, 'fix_permissions.php'), fixPermsPhp);
fs.writeFileSync(path.join(standaloneDir, 'fix-permissions.php'), fixPermsPhp);
fs.writeFileSync(path.join(standaloneFrontend, 'fix-permissions.php'), fixPermsPhp);

console.log('5b. Generating secure .htaccess for LiteSpeed Passenger with HTTPS & Security blocking...');
const htaccessContent = `# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION BEGIN
PassengerAppRoot "/home/mamfss/tanzeel.work"
PassengerBaseURI "/"
PassengerNodejs "/home/mamfss/nodevenv/tanzeel.work/24/bin/node"
PassengerAppType node
PassengerStartupFile server.js
# DO NOT REMOVE. CLOUDLINUX PASSENGER CONFIGURATION END

# 1. Enforce HTTPS Redirection
RewriteEngine On
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Direct Static File Serving for _next/static with fast MIME types
<IfModule mod_mime.c>
    AddType text/css .css
    AddType application/javascript .js
    AddType font/woff2 .woff2
    AddType font/woff .woff
    AddType image/svg+xml .svg
</IfModule>

<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
</IfModule>

# 2b. Guaranteed Static Assets Routing for LiteSpeed & Passenger
RewriteCond %{DOCUMENT_ROOT}/frontend/.next/static/$1 -f
RewriteRule ^_next/static/(.*)$ frontend/.next/static/$1 [L]

RewriteCond %{DOCUMENT_ROOT}/_next/static/$1 -f
RewriteRule ^_next/static/(.*)$ _next/static/$1 [L]

RewriteCond %{DOCUMENT_ROOT}/.next/static/$1 -f
RewriteRule ^_next/static/(.*)$ .next/static/$1 [L]

# 3. Block sensitive files from direct web access (zip, env, db, schema, logs, git)
<FilesMatch "(\\.(env.*|db|sqlite|prisma|zip|tar|gz|log|git)|schema\\.prisma|package\\.json|package-lock\\.json)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# 4. Disable Directory Browsing (Prevents "Index of /")
Options -Indexes
`;
fs.writeFileSync(path.join(standaloneDir, '.htaccess'), htaccessContent);
fs.writeFileSync(path.join(standaloneFrontend, '.htaccess'), htaccessContent);

console.log('6. Generating production .env...');
const envContent = `# Production Environment Variables for tanzeel.work
NODE_ENV=production
PORT=3000
DATABASE_URL="file:./prisma/dev.db"
ADMIN_SECRET_KEY="tanzeel-admin-2026"
NEXTAUTH_SECRET="very_secret_key_for_testing"
NEXTAUTH_URL="https://tanzeel.work"

STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

GOOGLE_CLIENT_ID="${process.env.GOOGLE_CLIENT_ID || ''}"
GOOGLE_CLIENT_SECRET="${process.env.GOOGLE_CLIENT_SECRET || ''}"

GROQ_API_KEYS="${process.env.GROQ_API_KEYS || ''}"
GEMINI_API_KEYS="${process.env.GEMINI_API_KEYS || ''}"
AI_MODEL_TANZEEL="${process.env.AI_MODEL_TANZEEL || 'qwen/qwen3.8-27b'}"
AI_MODEL_TRANSLATOR="${process.env.AI_MODEL_TRANSLATOR || 'qwen/qwen3.8-27b'}"
AI_MODEL_TUTOR="${process.env.AI_MODEL_TUTOR || 'qwen/qwen3.8-27b'}"
AI_MODEL_KHUTBAT="${process.env.AI_MODEL_KHUTBAT || 'qwen/qwen3.8-27b'}"
AI_MODEL_GEMINI="${process.env.AI_MODEL_GEMINI || 'gemini-2.0-flash'}"
`;

fs.writeFileSync(path.join(standaloneDir, '.env'), envContent);
fs.writeFileSync(path.join(standaloneFrontend, '.env'), envContent);
fs.writeFileSync(path.join(standaloneFrontend, '.env.production'), envContent);

console.log('7. Packaging deploy_tanzeel_work.zip with POSIX permissions...');
const zipFilePath = path.join(rootDir, 'deploy_tanzeel_work.zip');
const output = fs.createWriteStream(zipFilePath);
const archive = new ZipArchive({
  zlib: { level: 9 }
});

output.on('close', function() {
  console.log(`Success! ${archive.pointer()} total bytes written to deploy_tanzeel_work.zip`);
  console.log('Archive has been finalized cleanly.');
});

archive.on('error', function(err) {
  throw err;
});

archive.pipe(output);

// Add standalone directory with explicit POSIX modes
archive.directory(standaloneDir, false, (entry) => {
  if (entry.stats && entry.stats.isDirectory()) {
    entry.mode = 0o755;
  } else {
    entry.mode = 0o644;
  }
  return entry;
});

archive.finalize();
