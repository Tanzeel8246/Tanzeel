'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Plus, Search, Edit2, Trash2, ExternalLink, CheckCircle2, AlertCircle, 
  RefreshCw, Power, Filter, Wrench, Shield, ArrowLeft, Eye, Code, FileText, 
  Sparkles, Layers, Check, X, Lock, Key
} from 'lucide-react';

interface ToolItem {
  id: string;
  name: string;
  slug: string;
  path: string;
  description: string;
  category: string;
  icon: string;
  status: 'active' | 'inactive' | 'maintenance' | 'beta';
  badge?: 'New' | 'Popular' | 'Pro' | 'Free' | '';
  isCustom?: boolean;
  mockupImage?: string;
  content?: string;
  embedCode?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminToolsPage() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminKey, setAdminKey] = useState<string>('');
  const [isKeyAuthenticated, setIsKeyAuthenticated] = useState<boolean>(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);
  const [activeTab, setActiveTab] = useState<'basic' | 'embed' | 'seo'>('basic');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Developer Tools',
    description: '',
    icon: 'Wand2',
    status: 'active' as 'active' | 'inactive' | 'maintenance' | 'beta',
    badge: '' as 'New' | 'Popular' | 'Pro' | 'Free' | '',
    isCustom: true,
    mockupImage: '',
    embedCode: '',
    content: '',
  });

  // Delete Confirmation Modal
  const [toolToDelete, setToolToDelete] = useState<ToolItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('codehubb_admin_key') || 'tanzeel-admin-2026';
    setAdminKey(savedKey);
    fetchTools(savedKey);
  }, []);

  const fetchTools = async (keyToUse = adminKey) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/tools', {
        headers: {
          'x-admin-key': keyToUse || 'tanzeel-admin-2026',
        },
      });

      if (res.status === 401) {
        setIsKeyAuthenticated(false);
        setError('Admin authorization required. Please enter the Admin Passcode below.');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const data = await res.json();
      if (data.tools) {
        setTools(data.tools);
        setCategories(data.categories || []);
        setIsKeyAuthenticated(true);
      }
    } catch (err: any) {
      console.error('Failed to load tools:', err);
      setError(err.message || 'Could not connect to tools database.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    localStorage.setItem('codehubb_admin_key', adminKey.trim());
    fetchTools(adminKey.trim());
  };

  const handleOpenAddModal = () => {
    setEditingTool(null);
    setFormData({
      name: '',
      slug: '',
      category: categories[0] || 'Developer Tools',
      description: '',
      icon: 'Sparkles',
      status: 'active',
      badge: 'New',
      isCustom: true,
      mockupImage: '',
      embedCode: '',
      content: '',
    });
    setActiveTab('basic');
    setSaveSuccess(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (tool: ToolItem) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      slug: tool.slug,
      category: tool.category,
      description: tool.description,
      icon: tool.icon || 'Wand2',
      status: tool.status || 'active',
      badge: tool.badge || '',
      isCustom: tool.isCustom ?? false,
      mockupImage: tool.mockupImage || '',
      embedCode: tool.embedCode || '',
      content: tool.content || '',
    });
    setActiveTab('basic');
    setSaveSuccess(null);
    setIsModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    const autoSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData(prev => ({
      ...prev,
      name,
      slug: !editingTool ? autoSlug : prev.slug,
    }));
  };

  const handleSaveTool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.slug.trim()) {
      alert('Tool Name and Slug are required!');
      return;
    }

    setSaving(true);
    setSaveSuccess(null);

    try {
      const url = editingTool 
        ? `/api/admin/tools/${editingTool.id}`
        : '/api/admin/tools';
      
      const method = editingTool ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        id: editingTool ? editingTool.id : formData.slug,
        path: formData.isCustom ? `/tools/custom/${formData.slug}` : (editingTool?.path || `/tools/${formData.slug}`),
      };

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'tanzeel-admin-2026',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save tool');
      }

      setSaveSuccess(editingTool ? 'Tool updated successfully!' : 'New tool published successfully!');
      
      // Refresh list
      await fetchTools();

      setTimeout(() => {
        setIsModalOpen(false);
      }, 1000);
    } catch (err: any) {
      alert(err.message || 'Error saving tool.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (tool: ToolItem) => {
    // Optimistic UI update
    const nextStatus = tool.status === 'active' ? 'inactive' : 'active';
    setTools(prev => prev.map(t => t.id === tool.id ? { ...t, status: nextStatus } : t));

    try {
      const res = await fetch(`/api/admin/tools/${tool.id}/toggle`, {
        method: 'PATCH',
        headers: {
          'x-admin-key': adminKey || 'tanzeel-admin-2026',
        },
      });

      if (!res.ok) {
        // Revert on error
        setTools(prev => prev.map(t => t.id === tool.id ? { ...t, status: tool.status } : t));
        alert('Failed to toggle status.');
      }
    } catch (err) {
      setTools(prev => prev.map(t => t.id === tool.id ? { ...t, status: tool.status } : t));
    }
  };

  const handleDeleteTool = async () => {
    if (!toolToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/tools/${toolToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey || 'tanzeel-admin-2026',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete tool');
      }

      setTools(prev => prev.filter(t => t.id !== toolToDelete.id));
      setToolToDelete(null);
    } catch (err: any) {
      alert(err.message || 'Error deleting tool.');
    } finally {
      setDeleting(false);
    }
  };

  // Filter tools
  const filteredTools = tools.filter(tool => {
    const matchesSearch = 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || tool.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = tools.filter(t => t.status === 'active').length;
  const customCount = tools.filter(t => t.isCustom).length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <div className="flex items-center gap-3">
              <Link href="/admin" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl text-gray-500 transition-colors">
                <ArrowLeft size={20} />
              </Link>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <Wrench className="text-indigo-600 dark:text-indigo-400" />
                <span>Tools Dashboard &amp; Editor</span>
              </h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 ml-11">
              Add new tools, update descriptions, toggle active statuses, and configure custom tool runners.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/pages"
              className="px-3.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors"
            >
              Pages Editor
            </Link>
            <Link
              href="/admin/blogs"
              className="px-3.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors"
            >
              Blog Posts
            </Link>
            <Link
              href="/admin/settings"
              className="px-3.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 transition-colors"
            >
              API Settings
            </Link>
            <button
              onClick={() => fetchTools()}
              className="p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl text-gray-700 dark:text-gray-200 transition-colors"
              title="Refresh tools list"
            >
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={handleOpenAddModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={16} />
              <span>Add Tool</span>
            </button>
          </div>
        </div>

        {/* Admin Passcode Card (if needed) */}
        {!isKeyAuthenticated && (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 p-6 rounded-3xl text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-3 mb-3">
              <Key size={24} className="text-amber-600 dark:text-amber-400 shrink-0" />
              <h3 className="text-lg font-bold">Admin Authorization Required</h3>
            </div>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-4">
              Enter your Admin Secret Key to manage, edit, and publish tools:
            </p>
            <form onSubmit={handleAdminKeySubmit} className="flex gap-3 max-w-md">
              <input
                type="password"
                placeholder="Enter Admin Passcode..."
                value={adminKey}
                onChange={e => setAdminKey(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm rounded-xl transition-all"
              >
                Authenticate
              </button>
            </form>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Registered</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">{tools.length}</div>
            <span className="text-xs text-indigo-500 font-semibold mt-1 inline-block">Across all categories</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active &amp; Live</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-green-600 dark:text-green-400 mt-2">{activeCount}</div>
            <span className="text-xs text-green-500 font-semibold mt-1 inline-block">Displayed on Home</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Inactive / Hidden</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-500 mt-2">{tools.length - activeCount}</div>
            <span className="text-xs text-amber-500 font-semibold mt-1 inline-block">Drafts or Maintenance</span>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Custom Created</span>
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400 mt-2">{customCount}</div>
            <span className="text-xs text-purple-500 font-semibold mt-1 inline-block">Dynamic tools added</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, slug..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-gray-400" />
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Categories ({tools.length})</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Tools Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Tools List ({filteredTools.length})
            </h2>
            <span className="text-xs text-gray-400">
              Click toggle switch to instantly activate or hide a tool
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Tool Name</th>
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Path / URL</th>
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Badge</th>
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTools.map(tool => (
                  <tr key={tool.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-750 transition-colors">
                    {/* Name & Icon */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                          {tool.icon?.length <= 4 ? tool.icon : <Wrench size={18} />}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span>{tool.name}</span>
                            {tool.isCustom && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-300">
                                CUSTOM
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 max-w-xs truncate mt-0.5">
                            {tool.description || 'No description provided'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="p-4 text-sm font-medium text-gray-600 dark:text-gray-300">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-semibold">
                        {tool.category}
                      </span>
                    </td>

                    {/* Path */}
                    <td className="p-4 text-xs font-mono text-gray-500 dark:text-gray-400">
                      {tool.path}
                    </td>

                    {/* Badge */}
                    <td className="p-4">
                      {tool.badge ? (
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          tool.badge === 'Popular' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                          tool.badge === 'New' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                          tool.badge === 'Pro' ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                        }`}>
                          {tool.badge}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
                      )}
                    </td>

                    {/* Status Toggle Switch */}
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleStatus(tool)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                          tool.status === 'active'
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-200'
                        }`}
                        title="Click to toggle status"
                      >
                        <span className={`w-2 h-2 rounded-full ${tool.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                        <span className="capitalize">{tool.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={tool.path}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Open live tool"
                        >
                          <ExternalLink size={16} />
                        </Link>
                        <button
                          onClick={() => handleOpenEditModal(tool)}
                          className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit tool"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setToolToDelete(tool)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                          title="Delete tool"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredTools.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="p-12 text-center text-gray-500 dark:text-gray-400">
                      No tools found matching your search and filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ADD / EDIT TOOL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  {editingTool ? `Edit Tool: ${editingTool.name}` : 'Add New Tool'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Configure tool attributes, categories, live status, and custom scripts.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 px-6 bg-gray-50 dark:bg-gray-900/40">
              <button
                onClick={() => setActiveTab('basic')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'basic'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                1. General Settings
              </button>
              <button
                onClick={() => setActiveTab('embed')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'embed'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                2. Custom Code / Embed
              </button>
              <button
                onClick={() => setActiveTab('seo')}
                className={`py-3 px-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === 'seo'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                3. User Guide &amp; SEO
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveTool} className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {saveSuccess && (
                <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-2xl flex items-center gap-2 text-sm font-semibold">
                  <CheckCircle2 size={18} />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        Tool Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => handleNameChange(e.target.value)}
                        placeholder="e.g. Unit Converter, Currency Exchange"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        URL Slug *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().trim() })}
                        placeholder="e.g. unit-converter"
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="active">Active (Visible)</option>
                        <option value="inactive">Inactive (Hidden)</option>
                        <option value="beta">Beta</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                        Badge
                      </label>
                      <select
                        value={formData.badge}
                        onChange={e => setFormData({ ...formData, badge: e.target.value as any })}
                        className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="">None</option>
                        <option value="New">New</option>
                        <option value="Popular">Popular</option>
                        <option value="Pro">Pro</option>
                        <option value="Free">Free</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Short Description
                    </label>
                    <textarea
                      rows={2}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief 1-2 sentence description shown on the tool card."
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Icon Name or Emoji
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={e => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="e.g. Wand2, Sparkles, Merge, Calculator, or ⚡"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      Card Mockup / Preview Image URL (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.mockupImage}
                      onChange={e => setFormData({ ...formData, mockupImage: e.target.value })}
                      placeholder="e.g. https://images.unsplash.com/... or /images/mockup.png"
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {formData.mockupImage && (
                      <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center gap-3">
                        <img 
                          src={formData.mockupImage} 
                          alt="Preview" 
                          className="w-16 h-12 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                        <span className="text-xs text-gray-500 dark:text-gray-400">Card Header Preview Banner</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: CUSTOM CODE / EMBED */}
              {activeTab === 'embed' && (
                <div className="space-y-4">
                  <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-xs text-indigo-800 dark:text-indigo-300">
                    <p className="font-bold mb-1">✨ Dynamic Tool Interactive Runner</p>
                    <p>
                      You can paste custom HTML, CSS, JavaScript, or an iframe embed here. When users visit the tool page (<code>/tools/custom/{formData.slug || 'your-slug'}</code>), this interactive component will run inside a sandboxed workspace!
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      HTML / JavaScript / Iframe Code
                    </label>
                    <textarea
                      rows={10}
                      value={formData.embedCode}
                      onChange={e => setFormData({ ...formData, embedCode: e.target.value })}
                      placeholder="<div id='app'>...</div><script>...</script>"
                      className="w-full p-4 bg-gray-900 text-green-400 font-mono text-xs rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SEO & CONTENT */}
              {activeTab === 'seo' && (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300">
                    <p className="font-bold mb-1">📚 In-Depth User Guide &amp; Search Engine Optimization</p>
                    <p>Write step-by-step instructions, features, and FAQs to help users and boost organic Google rankings.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                      User Guide Content (Markdown/Text)
                    </label>
                    <textarea
                      rows={10}
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      placeholder="### How to use this tool&#10;1. Step 1: Upload or input...&#10;2. Step 2: Click process...&#10;&#10;### Frequently Asked Questions..."
                      className="w-full p-4 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white font-sans text-sm rounded-xl border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* Modal Footer */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>{editingTool ? 'Update Tool' : 'Publish Tool'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {toolToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 max-w-md w-full p-6 text-center">
            <div className="w-14 h-14 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Delete Tool?
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete <span className="font-bold text-gray-900 dark:text-white">{toolToDelete.name}</span>? This will remove it from the home page and tools directory.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setToolToDelete(null)}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTool}
                disabled={deleting}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
