import fs from 'fs';
import path from 'path';

export interface PageContent {
  id: string; // 'privacy' | 'terms' | 'about' | 'contact' | 'home'
  title: string;
  lastUpdated?: string;
  subtitle?: string;
  content?: string; // Rich markdown or HTML content
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
}

export interface SitePagesData {
  privacy: PageContent;
  terms: PageContent;
  about: PageContent;
  contact: PageContent;
  home: PageContent;
}

const DEFAULT_PAGES: SitePagesData = {
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy',
    lastUpdated: 'November 11, 2026',
    subtitle: 'Learn how CodeHubb Tools protects your privacy, manages cookies, and processes files locally without storing personal data.',
    content: '',
    metaTitle: 'Privacy Policy - CodeHubb Tools',
    metaDescription: 'Read our zero-server-storage privacy policy, Google AdSense DART cookies disclosure, and GDPR/CCPA data protection rights.',
    updatedAt: new Date().toISOString(),
  },
  terms: {
    id: 'terms',
    title: 'Terms of Service',
    lastUpdated: 'November 11, 2026',
    subtitle: 'Legal agreement governing acceptable usage, intellectual property rights, and platform terms.',
    content: '',
    metaTitle: 'Terms of Service - CodeHubb Tools',
    metaDescription: 'User terms, 100% intellectual property retention guarantee, and acceptable usage policy.',
    updatedAt: new Date().toISOString(),
  },
  about: {
    id: 'about',
    title: 'Free, Fast & Privacy-First Digital Utilities',
    subtitle: 'CodeHubb Tools was engineered to eliminate third-party cloud conversion servers by processing digital media, documents, and code entirely client-side.',
    content: '',
    metaTitle: 'About Us - CodeHubb Tools Engineering Philosophy',
    metaDescription: 'Discover our mission, high-speed WebAssembly architecture, and client-side processing model.',
    updatedAt: new Date().toISOString(),
  },
  contact: {
    id: 'contact',
    title: 'Get in Touch with CodeHubb Tools',
    subtitle: 'Have a feature request, bug report, or enterprise inquiry? Send us a message and our engineering team will respond within 24 hours.',
    content: '',
    metaTitle: 'Contact Us - CodeHubb Tools Support',
    metaDescription: 'Reach our team directly for bug reports, tool requests, or technical support.',
    updatedAt: new Date().toISOString(),
  },
  home: {
    id: 'home',
    title: 'Every tool you could need. All in one place.',
    subtitle: 'Free, secure, and fast tools to boost your productivity. All processed privately inside your browser.',
    content: '',
    metaTitle: 'CodeHubb Tools - 88+ Free Online Productivity Utilities',
    metaDescription: 'Comprehensive suite of PDF, Image, Developer, and AI tools with zero server storage.',
    updatedAt: new Date().toISOString(),
  },
};

function getPagesFilePath(): string {
  const p1 = path.join(process.cwd(), 'data', 'pages-db.json');
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(process.cwd(), 'src', 'data', 'pages-db.json');
  if (fs.existsSync(p2)) return p2;
  return p1;
}

export function getAllPages(): SitePagesData {
  try {
    const filePath = getPagesFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_PAGES, ...parsed };
    }
  } catch (err) {
    console.error('Error reading pages-db.json, using defaults:', err);
  }
  return DEFAULT_PAGES;
}

export function getPageContent(pageId: keyof SitePagesData): PageContent {
  const all = getAllPages();
  return all[pageId] || DEFAULT_PAGES[pageId];
}

export function savePageContent(pageId: keyof SitePagesData, data: Partial<PageContent>): PageContent {
  const all = getAllPages();
  const current = all[pageId] || DEFAULT_PAGES[pageId];

  const updated: PageContent = {
    ...current,
    ...data,
    id: pageId,
    updatedAt: new Date().toISOString(),
  };

  all[pageId] = updated;

  try {
    const filePath = getPagesFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(all, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to save pages-db.json:', err);
  }

  return updated;
}
