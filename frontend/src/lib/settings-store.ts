import fs from 'fs';
import path from 'path';

export interface SiteSettings {
  // General Site Settings
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone?: string;
  adsenseClientId?: string;
  enableAds: boolean;
  googleAnalyticsId?: string;

  // AI API Configuration
  groqApiKeys: string;
  geminiApiKeys: string;
  aiModelTanzeel: string;
  aiModelTranslator: string;
  aiModelTutor: string;
  aiModelKhutbat: string;
  aiModelGemini: string;

  // Authentication & OAuth
  googleClientId: string;
  googleClientSecret: string;
  adminSecretKey: string;
  nextauthUrl: string;

  // Stripe Payments
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  
  updatedAt: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteTitle: 'CodeHubb Tools',
  siteDescription: 'Over 88 free, fast, and secure client-side productivity utilities and AI assistants.',
  contactEmail: 'support@tanzeel.work',
  supportPhone: '+92 300 1234567',
  adsenseClientId: '',
  enableAds: true,
  googleAnalyticsId: '',

  groqApiKeys: process.env.GROQ_API_KEYS || '',
  geminiApiKeys: process.env.GEMINI_API_KEYS || '',
  aiModelTanzeel: process.env.AI_MODEL_TANZEEL || 'qwen/qwen3.8-27b',
  aiModelTranslator: process.env.AI_MODEL_TRANSLATOR || 'qwen/qwen3.8-27b',
  aiModelTutor: process.env.AI_MODEL_TUTOR || 'qwen/qwen3.8-27b',
  aiModelKhutbat: process.env.AI_MODEL_KHUTBAT || 'qwen/qwen3.8-27b',
  aiModelGemini: process.env.AI_MODEL_GEMINI || 'gemini-2.0-flash',

  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  adminSecretKey: process.env.ADMIN_SECRET_KEY || 'tanzeel-admin-2026',
  nextauthUrl: process.env.NEXTAUTH_URL || 'https://tanzeel.work',

  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',

  updatedAt: new Date().toISOString(),
};

function getSettingsFilePath(): string {
  const p1 = path.join(process.cwd(), 'data', 'settings-db.json');
  if (fs.existsSync(p1)) return p1;
  const p2 = path.join(process.cwd(), 'src', 'data', 'settings-db.json');
  if (fs.existsSync(p2)) return p2;
  return p1;
}

export function getSettings(): SiteSettings {
  try {
    const filePath = getSettingsFilePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.error('Error reading settings-db.json, using defaults:', err);
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(newSettings: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const merged: SiteSettings = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  };

  try {
    const filePath = getSettingsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(merged, null, 2), 'utf8');

    // Also sync in-memory process.env so existing modules get immediate updates
    if (merged.groqApiKeys) process.env.GROQ_API_KEYS = merged.groqApiKeys;
    if (merged.geminiApiKeys) process.env.GEMINI_API_KEYS = merged.geminiApiKeys;
    if (merged.adminSecretKey) process.env.ADMIN_SECRET_KEY = merged.adminSecretKey;
    if (merged.googleClientId) process.env.GOOGLE_CLIENT_ID = merged.googleClientId;
    if (merged.googleClientSecret) process.env.GOOGLE_CLIENT_SECRET = merged.googleClientSecret;
    if (merged.aiModelTanzeel) process.env.AI_MODEL_TANZEEL = merged.aiModelTanzeel;
    if (merged.aiModelTranslator) process.env.AI_MODEL_TRANSLATOR = merged.aiModelTranslator;
    if (merged.aiModelTutor) process.env.AI_MODEL_TUTOR = merged.aiModelTutor;
    if (merged.aiModelKhutbat) process.env.AI_MODEL_KHUTBAT = merged.aiModelKhutbat;
    if (merged.aiModelGemini) process.env.AI_MODEL_GEMINI = merged.aiModelGemini;
  } catch (err) {
    console.error('Failed to save settings to disk:', err);
  }

  return merged;
}
