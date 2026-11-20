'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, ArrowLeft, Save, RefreshCw, CheckCircle2, AlertCircle, 
  Eye, Edit3, Shield, Info, Phone, Home, Sparkles, Key
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface PageContent {
  id: string;
  title: string;
  lastUpdated?: string;
  subtitle?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt: string;
}

export default function AdminPagesEditor() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isKeyAuthenticated, setIsKeyAuthenticated] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [selectedPage, setSelectedPage] = useState<'privacy' | 'terms' | 'about' | 'contact' | 'home'>('privacy');
  const [allPages, setAllPages] = useState<Record<string, PageContent>>({});
  const [currentEdit, setCurrentEdit] = useState<PageContent>({
    id: 'privacy',
    title: '',
    subtitle: '',
    content: '',
    metaTitle: '',
    metaDescription: '',
    lastUpdated: '',
    updatedAt: '',
  });

  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');

  useEffect(() => {
    const savedKey = localStorage.getItem('codehubb_admin_key') || 'tanzeel-admin-2026';
    setAdminKey(savedKey);
    fetchPages(savedKey);
  }, []);

  const fetchPages = async (keyToUse = adminKey) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/pages', {
        headers: {
          'x-admin-key': keyToUse || 'tanzeel-admin-2026',
        },
      });

      if (res.status === 401) {
        setIsKeyAuthenticated(false);
        setStatusMessage({ type: 'error', text: 'Admin authorization required.' });
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      if (data.pages) {
        setAllPages(data.pages);
        if (data.pages[selectedPage]) {
          setCurrentEdit(data.pages[selectedPage]);
        }
        setIsKeyAuthenticated(true);
      }
    } catch (err: any) {
      console.error('Failed to load pages:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to load page contents' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPage = (pageId: 'privacy' | 'terms' | 'about' | 'contact' | 'home') => {
    setSelectedPage(pageId);
    if (allPages[pageId]) {
      setCurrentEdit(allPages[pageId]);
    }
    setStatusMessage(null);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'tanzeel-admin-2026',
        },
        body: JSON.stringify({
          pageId: selectedPage,
          data: currentEdit,
        }),
      });

      if (res.status === 401) {
        setIsKeyAuthenticated(false);
        setStatusMessage({ type: 'error', text: 'Admin authorization required.' });
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: `Page "${selectedPage}" saved and live across the site!` });
        setAllPages(prev => ({ ...prev, [selectedPage]: data.saved }));
      } else {
        throw new Error(data.error || 'Failed to save page');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving page' });
    } finally {
      setSaving(false);
    }
  };

  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    localStorage.setItem('codehubb_admin_key', adminKey.trim());
    fetchPages(adminKey.trim());
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
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
                <FileText className="text-indigo-600" size={28} />
                <span>Pages &amp; Legal Content Editor</span>
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-11">
              Customize Privacy Policy, Terms of Service, About Us, Contact Us, and Homepage copy without code rebuilds.
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
              href="/admin/blogs"
              className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
            >
              Blog Posts
            </Link>
            <Link
              href="/admin/settings"
              className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors"
            >
              API Settings
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
                <p className="text-xs text-gray-600 dark:text-gray-300">Enter the system master secret passcode to unlock page editing controls.</p>
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

        {/* Page Select Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'privacy', label: 'Privacy Policy', icon: Shield, href: '/privacy' },
            { id: 'terms', label: 'Terms of Service', icon: FileText, href: '/terms' },
            { id: 'about', label: 'About Us', icon: Info, href: '/about' },
            { id: 'contact', label: 'Contact Us', icon: Phone, href: '/contact' },
            { id: 'home', label: 'Homepage Hero', icon: Home, href: '/' },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectPage(item.id as any)}
                className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-24 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20 scale-[1.02]'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-100 dark:border-gray-700 hover:border-indigo-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={20} className={isSelected ? 'text-white' : 'text-indigo-600'} />
                  <Link 
                    href={item.href} 
                    target="_blank"
                    onClick={(e) => e.stopPropagation()}
                    className={`text-[10px] underline hover:opacity-100 ${isSelected ? 'text-indigo-200' : 'text-gray-400'}`}
                  >
                    View &nearr;
                  </Link>
                </div>
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Editor Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          
          <form onSubmit={handleSavePage} className="p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  Editing: {selectedPage} Page Content
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Leave content blank to use standard verified legal verbiage, or write custom Markdown.
                </p>
              </div>

              {/* View Mode Switcher */}
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setViewMode('edit')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'edit' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Editor Only
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('split')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'split' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Split View
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('preview')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'preview' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  Live Preview
                </button>
              </div>
            </div>

            {/* Title & Subtitle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Page Main Title
                </label>
                <input
                  type="text"
                  value={currentEdit.title}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, title: e.target.value })}
                  placeholder="Page title..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Last Updated Label / Effective Date
                </label>
                <input
                  type="text"
                  value={currentEdit.lastUpdated || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, lastUpdated: e.target.value })}
                  placeholder="e.g. November 11, 2026"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Page Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={currentEdit.subtitle || ''}
                  onChange={(e) => setCurrentEdit({ ...currentEdit, subtitle: e.target.value })}
                  placeholder="Brief description or lead text..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            {/* SEO Meta Fields */}
            <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-700/60 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block">
                SEO &amp; Meta Header Controls (AdSense / Google Search)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={currentEdit.metaTitle || ''}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, metaTitle: e.target.value })}
                    placeholder="Page Title - CodeHubb Tools"
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={currentEdit.metaDescription || ''}
                    onChange={(e) => setCurrentEdit({ ...currentEdit, metaDescription: e.target.value })}
                    placeholder="Meta description for search engine results..."
                    className="w-full px-3.5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Content Editor / Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Page Body (Markdown / HTML Content)
                </label>
                <span className="text-[11px] text-gray-400">
                  {currentEdit.content?.length || 0} characters &bull; Markdown enabled
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Editor textarea */}
                {(viewMode === 'edit' || viewMode === 'split') && (
                  <div className={viewMode === 'edit' ? 'lg:col-span-2' : ''}>
                    <textarea
                      rows={16}
                      value={currentEdit.content || ''}
                      onChange={(e) => setCurrentEdit({ ...currentEdit, content: e.target.value })}
                      placeholder="# Enter Markdown Content here...\n\n### 1. Section Title\nDetailed content paragraphs..."
                      className="w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                    />
                  </div>
                )}

                {/* Preview pane */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                  <div className={`p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 overflow-y-auto max-h-[420px] prose dark:prose-invert prose-sm max-w-none ${
                    viewMode === 'preview' ? 'lg:col-span-2' : ''
                  }`}>
                    {currentEdit.content?.trim() ? (
                      <ReactMarkdown>{currentEdit.content}</ReactMarkdown>
                    ) : (
                      <div className="text-gray-400 italic text-center py-12">
                        Custom content is empty. The page is currently rendering the default verified legal layout.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Save Controls */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Changes persist instantly to <code>data/pages-db.json</code>.
              </span>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:scale-[1.02]"
              >
                {saving ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    <span>Saving Page...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Publish &amp; Save Page</span>
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
