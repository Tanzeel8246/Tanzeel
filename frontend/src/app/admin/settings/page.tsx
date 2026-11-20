'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Settings, Key, Bot, Shield, Globe, DollarSign, Save, RefreshCw, 
  CheckCircle2, AlertCircle, ArrowLeft, Eye, EyeOff, Sparkles, Sliders
} from 'lucide-react';

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  contactEmail: string;
  supportPhone?: string;
  adsenseClientId?: string;
  enableAds: boolean;
  googleAnalyticsId?: string;

  groqApiKeys: string;
  geminiApiKeys: string;
  aiModelTanzeel: string;
  aiModelTranslator: string;
  aiModelTutor: string;
  aiModelKhutbat: string;
  aiModelGemini: string;

  googleClientId: string;
  googleClientSecret: string;
  adminSecretKey: string;
  nextauthUrl: string;

  stripePublishableKey?: string;
  stripeSecretKey?: string;
}

export default function AdminSettingsPage() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isKeyAuthenticated, setIsKeyAuthenticated] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [activeTab, setActiveTab] = useState<'ai' | 'google' | 'adsense' | 'security'>('ai');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const [settings, setSettings] = useState<SiteSettings>({
    siteTitle: 'CodeHubb Tools',
    siteDescription: 'Over 88 free, fast, and secure client-side productivity utilities and AI assistants.',
    contactEmail: 'support@tanzeel.work',
    supportPhone: '+92 300 1234567',
    adsenseClientId: '',
    enableAds: true,
    googleAnalyticsId: '',

    groqApiKeys: '',
    geminiApiKeys: '',
    aiModelTanzeel: 'qwen/qwen3.8-27b',
    aiModelTranslator: 'qwen/qwen3.8-27b',
    aiModelTutor: 'qwen/qwen3.8-27b',
    aiModelKhutbat: 'qwen/qwen3.8-27b',
    aiModelGemini: 'gemini-2.0-flash',

    googleClientId: '',
    googleClientSecret: '',
    adminSecretKey: 'tanzeel-admin-2026',
    nextauthUrl: 'https://tanzeel.work',

    stripePublishableKey: '',
    stripeSecretKey: '',
  });

  useEffect(() => {
    const savedKey = localStorage.getItem('codehubb_admin_key') || 'tanzeel-admin-2026';
    setAdminKey(savedKey);
    fetchSettings(savedKey);
  }, []);

  const fetchSettings = async (keyToUse = adminKey) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/settings', {
        headers: {
          'x-admin-key': keyToUse || 'tanzeel-admin-2026',
        },
      });

      if (res.status === 401) {
        setIsKeyAuthenticated(false);
        setStatusMessage({ type: 'error', text: 'Admin authorization required. Enter the passcode.' });
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      if (data.settings) {
        setSettings(prev => ({ ...prev, ...data.settings }));
        setIsKeyAuthenticated(true);
      }
    } catch (err: any) {
      console.error('Failed to load settings:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load system settings' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    localStorage.setItem('codehubb_admin_key', adminKey.trim());
    fetchSettings(adminKey.trim());
  };

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'tanzeel-admin-2026',
        },
        body: JSON.stringify(settings),
      });

      if (res.status === 401) {
        setIsKeyAuthenticated(false);
        setStatusMessage({ type: 'error', text: 'Admin authorization required.' });
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: 'Settings updated successfully! Changes applied immediately in memory.' });
        if (settings.adminSecretKey && settings.adminSecretKey !== adminKey) {
          localStorage.setItem('codehubb_admin_key', settings.adminSecretKey);
          setAdminKey(settings.adminSecretKey);
        }
      } else {
        throw new Error(data.error || 'Failed to update settings');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving settings' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-3">
              <Link 
                href="/admin" 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors text-gray-500"
                title="Back to Admin Center"
              >
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Settings className="text-indigo-600" size={28} />
                <span>API &amp; System Settings</span>
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-11">
              Configure AI API keys, model assignments, Google OAuth credentials, and AdSense without restarting the server.
            </p>
          </div>

          <div className="flex items-center gap-2 ml-11 sm:ml-0">
            <Link
              href="/admin/tools"
              className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
            >
              Tools Manager
            </Link>
            <Link
              href="/admin/pages"
              className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
            >
              Pages Editor
            </Link>
            <Link
              href="/admin/blogs"
              className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
            >
              Blog Posts
            </Link>
          </div>
        </div>

        {/* Passcode Authentication Bar if not authenticated */}
        {!isKeyAuthenticated && (
          <form onSubmit={handleAdminKeySubmit} className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Key className="w-8 h-8 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Passcode Authentication Required</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">Enter the system master secret passcode to unlock setting controls.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="password"
                placeholder="Enter Admin Passcode"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none w-full sm:w-64"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors"
              >
                Authenticate
              </button>
            </div>
          </form>
        )}

        {/* Status Alert */}
        {statusMessage && (
          <div className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-sm font-medium ${
            statusMessage.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
          }`}>
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{statusMessage.text}</span>
            </div>
            <button onClick={() => setStatusMessage(null)} className="text-xs opacity-70 hover:opacity-100">Dismiss</button>
          </div>
        )}

        {/* Main Tabs Container */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          {/* Tabs Navigation */}
          <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 pt-4 gap-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'ai'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Bot size={18} />
              <span>AI Models &amp; API Keys</span>
            </button>

            <button
              onClick={() => setActiveTab('google')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'google'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Shield size={18} />
              <span>Google Authentication</span>
            </button>

            <button
              onClick={() => setActiveTab('adsense')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'adsense'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <Globe size={18} />
              <span>AdSense &amp; Site Meta</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-sm transition-all whitespace-nowrap ${
                activeTab === 'security'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <DollarSign size={18} />
              <span>Security &amp; Billing</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="p-6 sm:p-8 space-y-8">
            
            {/* TAB 1: AI CONFIGURATION */}
            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="text-indigo-600" size={20} />
                    <span>AI Provider Keys &amp; Load Balancing</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Multiple keys can be comma-separated. The system automatically round-robins and falls back if a key hits rate-limits.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Groq Keys */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Groq API Keys (Comma-separated for Rotation)
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.groq ? 'text' : 'password'}
                        value={settings.groqApiKeys}
                        onChange={(e) => setSettings({ ...settings, groqApiKeys: e.target.value })}
                        placeholder="gsk_key1, gsk_key2..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('groq')}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showSecrets.groq ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-1 block">Primary engine for high-speed streaming responses.</span>
                  </div>

                  {/* Gemini Keys */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Google Gemini API Keys (Comma-separated)
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.gemini ? 'text' : 'password'}
                        value={settings.geminiApiKeys}
                        onChange={(e) => setSettings({ ...settings, geminiApiKeys: e.target.value })}
                        placeholder="AIzaSy..., AQ.Ab8RN..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('gemini')}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showSecrets.gemini ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <span className="text-[11px] text-gray-500 mt-1 block">Automatic secondary fallback if Groq quota is exhausted.</span>
                  </div>
                </div>

                {/* Model Assignments */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Sliders size={16} />
                    <span>Model Selection Per Assistant</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Tanzeel AI Model
                      </label>
                      <input
                        type="text"
                        value={settings.aiModelTanzeel}
                        onChange={(e) => setSettings({ ...settings, aiModelTanzeel: e.target.value })}
                        placeholder="qwen/qwen3.8-27b"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Urdu Translator Model
                      </label>
                      <input
                        type="text"
                        value={settings.aiModelTranslator}
                        onChange={(e) => setSettings({ ...settings, aiModelTranslator: e.target.value })}
                        placeholder="qwen/qwen3.8-27b"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Master Tutor Model
                      </label>
                      <input
                        type="text"
                        value={settings.aiModelTutor}
                        onChange={(e) => setSettings({ ...settings, aiModelTutor: e.target.value })}
                        placeholder="qwen/qwen3.8-27b"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Khutbat-e-Jumu'ah Model
                      </label>
                      <input
                        type="text"
                        value={settings.aiModelKhutbat}
                        onChange={(e) => setSettings({ ...settings, aiModelKhutbat: e.target.value })}
                        placeholder="qwen/qwen3.8-27b"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        Gemini Fallback Model
                      </label>
                      <input
                        type="text"
                        value={settings.aiModelGemini}
                        onChange={(e) => setSettings({ ...settings, aiModelGemini: e.target.value })}
                        placeholder="gemini-2.0-flash"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: GOOGLE AUTHENTICATION */}
            {activeTab === 'google' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Shield className="text-indigo-600" size={20} />
                    <span>Google OAuth 2.0 Credentials</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Manage your Google Cloud Console credentials for One-Tap / Single Sign-On.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Google Client ID
                    </label>
                    <input
                      type="text"
                      value={settings.googleClientId}
                      onChange={(e) => setSettings({ ...settings, googleClientId: e.target.value })}
                      placeholder="XXXXX.apps.googleusercontent.com"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Google Client Secret
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.googleSecret ? 'text' : 'password'}
                        value={settings.googleClientSecret}
                        onChange={(e) => setSettings({ ...settings, googleClientSecret: e.target.value })}
                        placeholder="GOCSPX-..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('googleSecret')}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showSecrets.googleSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      NextAuth Production URL
                    </label>
                    <input
                      type="text"
                      value={settings.nextauthUrl}
                      onChange={(e) => setSettings({ ...settings, nextauthUrl: e.target.value })}
                      placeholder="https://tanzeel.work"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                    <span className="text-[11px] text-gray-500 mt-1 block">
                      Must match the Authorized Redirect URI in Google Cloud Console: <code>{settings.nextauthUrl}/api/auth/callback/google</code>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: ADSENSE & SITE META */}
            {activeTab === 'adsense' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Globe className="text-indigo-600" size={20} />
                    <span>Monetization &amp; Site Information</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Configure Google AdSense publisher code, meta titles, and contact channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Google AdSense Publisher ID
                    </label>
                    <input
                      type="text"
                      value={settings.adsenseClientId || ''}
                      onChange={(e) => setSettings({ ...settings, adsenseClientId: e.target.value })}
                      placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2 flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
                    <div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white block">Enable Google AdSense Units</span>
                      <span className="text-xs text-gray-500">Toggle whether ads are injected into tool views and sidebar slots.</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={settings.enableAds} 
                        onChange={(e) => setSettings({ ...settings, enableAds: e.target.checked })}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Global Site Title
                    </label>
                    <input
                      type="text"
                      value={settings.siteTitle}
                      onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Google Analytics ID
                    </label>
                    <input
                      type="text"
                      value={settings.googleAnalyticsId || ''}
                      onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })}
                      placeholder="G-XXXXXXXXXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Support Contact Email
                    </label>
                    <input
                      type="email"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Support Contact Phone
                    </label>
                    <input
                      type="text"
                      value={settings.supportPhone || ''}
                      onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SECURITY & BILLING */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Key className="text-indigo-600" size={20} />
                    <span>Admin Master Passcode &amp; Payment Gateway</span>
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Control access to admin dashboards and configure Stripe checkout keys.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                      Admin Secret Passcode
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.adminPass ? 'text' : 'password'}
                        value={settings.adminSecretKey}
                        onChange={(e) => setSettings({ ...settings, adminSecretKey: e.target.value })}
                        placeholder="tanzeel-admin-2026"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => toggleSecret('adminPass')}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      >
                        {showSecrets.adminPass ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 mt-1 block">
                      Warning: Changing this passcode will immediately require re-authenticating on all admin screens.
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">
                      Stripe Payment Keys (Optional Pro Subscriptions)
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          Stripe Publishable Key
                        </label>
                        <input
                          type="text"
                          value={settings.stripePublishableKey || ''}
                          onChange={(e) => setSettings({ ...settings, stripePublishableKey: e.target.value })}
                          placeholder="pk_live_..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                          Stripe Secret Key
                        </label>
                        <input
                          type="password"
                          value={settings.stripeSecretKey || ''}
                          onChange={(e) => setSettings({ ...settings, stripeSecretKey: e.target.value })}
                          placeholder="sk_live_..."
                          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                All changes apply immediately to live API requests.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                {saving ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Saving Changes...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save All Settings</span>
                  </>
                )}
              </button>
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
