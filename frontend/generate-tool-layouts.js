const fs = require('fs');
const path = require('path');

const toolsDir = path.join('src', 'app', 'tools');
const dirs = fs.readdirSync(toolsDir, { withFileTypes: true }).filter(d => d.isDirectory() && !d.name.startsWith('.'));
let count = 0;

for (const d of dirs) {
  const layoutPath = path.join(toolsDir, d.name, 'layout.tsx');
  if (!fs.existsSync(layoutPath)) {
    const titleName = d.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    // Better description mapping based on tool name
    const description = `Free online ${titleName} tool by CodeHubb Tools. A fast, secure, client-side developer utility for ${titleName.toLowerCase()}.`;

    const code = `import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '${titleName}',
  description: '${description}',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
    fs.writeFileSync(layoutPath, code);
    count++;
  }
}
console.log('Created layouts for tools:', count);
