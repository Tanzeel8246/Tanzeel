'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, Plus, Edit2, Trash2, ExternalLink, Save, RefreshCw, 
  CheckCircle2, AlertCircle, ArrowLeft, Eye, Key, Sparkles, X, Image as ImageIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorAvatar?: string;
  category: string;
  coverImage?: string;
  publishedAt: string;
  readTime: string;
  tags?: string[];
}

export default function AdminBlogsPage() {
  const [adminKey, setAdminKey] = useState<string>('');
  const [isKeyAuthenticated, setIsKeyAuthenticated] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: 'CodeHubb Editorial Team',
    category: 'Productivity & Guides',
    coverImage: '',
    readTime: '5 min read',
    tags: 'tools, productivity, guide',
  });

  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('split');

  useEffect(() => {
    const savedKey = localStorage.getItem('codehubb_admin_key') || 'tanzeel-admin-2026';
    setAdminKey(savedKey);
    fetchPosts(savedKey);
  }, []);

  const fetchPosts = async (keyToUse = adminKey) => {
    setLoading(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/blogs', {
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
      if (data.posts) {
        setPosts(data.posts);
        setIsKeyAuthenticated(true);
      }
    } catch (err: any) {
      console.error('Failed to load posts:', err);
      setStatusMessage({ type: 'error', text: err.message || 'Failed to fetch blogs' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdminKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminKey.trim()) return;
    localStorage.setItem('codehubb_admin_key', adminKey.trim());
    fetchPosts(adminKey.trim());
  };

  const handleOpenAdd = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '## Introduction\n\nWrite your informative article here with helpful tips and practical steps.\n\n### Key Features\n- Point 1\n- Point 2\n\n### Conclusion\nFinal thoughts.',
      author: 'CodeHubb Editorial Team',
      category: 'Productivity & Guides',
      coverImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
      readTime: '5 min read',
      tags: 'tools, productivity, guide',
    });
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      author: post.author,
      category: post.category,
      coverImage: post.coverImage || '',
      readTime: post.readTime,
      tags: (post.tags || []).join(', '),
    });
    setIsModalOpen(true);
    setStatusMessage(null);
  };

  const handleTitleChange = (title: string) => {
    const autoSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData(prev => ({
      ...prev,
      title,
      slug: !editingPost ? autoSlug : prev.slug,
    }));
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim()) {
      alert('Title and Slug are required!');
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        excerpt: formData.excerpt,
        content: formData.content,
        author: formData.author,
        category: formData.category,
        coverImage: formData.coverImage,
        readTime: formData.readTime,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      };

      const url = editingPost 
        ? `/api/admin/blogs/${editingPost.slug}`
        : '/api/admin/blogs';
      
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey || 'tanzeel-admin-2026',
        },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) {
        setIsKeyAuthenticated(false);
        setStatusMessage({ type: 'error', text: 'Admin authorization required.' });
        return;
      }

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: `Article "${formData.title}" published successfully!` });
        setIsModalOpen(false);
        fetchPosts();
      } else {
        throw new Error(data.error || 'Failed to save blog post');
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Error saving post' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePost = async () => {
    if (!postToDelete) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/blogs/${postToDelete.slug}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': adminKey || 'tanzeel-admin-2026',
        },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatusMessage({ type: 'success', text: `Deleted article "${postToDelete.title}"` });
        setPostToDelete(null);
        fetchPosts();
      } else {
        throw new Error(data.error || 'Failed to delete');
      }
    } catch (err: any) {
      alert(`Error deleting post: ${err.message}`);
    } finally {
      setDeleting(false);
    }
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
                <BookOpen className="text-indigo-600" size={28} />
                <span>Blogs &amp; Guides Manager</span>
              </h1>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-11">
              Create and manage organic SEO guide articles to satisfy Google AdSense high-value content requirements.
            </p>
          </div>

          <div className="flex items-center gap-3 ml-11 sm:ml-0">
            <Link
              href="/blog"
              target="_blank"
              className="px-4 py-2 text-xs font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>View Live Blog</span>
              <ExternalLink size={14} />
            </Link>
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5"
            >
              <Plus size={16} />
              <span>Write Article</span>
            </button>
          </div>
        </div>

        {/* Passcode Authentication Bar if not authenticated */}
        {!isKeyAuthenticated && (
          <form onSubmit={handleAdminKeySubmit} className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-300 dark:border-amber-700 p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Key className="w-8 h-8 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white text-base">Passcode Authentication Required</h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">Enter the system master secret passcode to unlock blog publishing.</p>
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

        {/* Status Message */}
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

        {/* Posts Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span>Published Articles</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold">
                {posts.length}
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="p-16 text-center text-gray-400 flex flex-col items-center gap-3">
              <RefreshCw size={24} className="animate-spin text-indigo-600" />
              <span>Loading articles database...</span>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-16 text-center text-gray-400 space-y-4">
              <p>No blog posts published yet.</p>
              <button
                onClick={handleOpenAdd}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold"
              >
                Write First Article
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="p-4">Article</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {posts.map((post) => (
                    <tr key={post.slug} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{post.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">/blog/{post.slug}</div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                          {post.category}
                        </span>
                      </td>
                      <td className="p-4 text-xs text-gray-500 dark:text-gray-400">{post.author}</td>
                      <td className="p-4 text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">{post.publishedAt}</td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="View Live Article"
                          >
                            <ExternalLink size={16} />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(post)}
                            className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Edit Article"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => setPostToDelete(post)}
                            className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            title="Delete Article"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Write / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 dark:border-gray-700">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingPost ? 'Edit Blog Article' : 'Write New Blog Article'}
                </h3>
                <span className="text-xs text-gray-400">SEO-Optimized Markdown Article Publisher</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePost} className="p-6 space-y-6 overflow-y-auto flex-1">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Article Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. 10 Client-Side PDF Tricks to Double Your Productivity"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="article-url-slug"
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-xs font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="Productivity & Guides">Productivity &amp; Guides</option>
                    <option value="AI & Machine Learning">AI &amp; Machine Learning</option>
                    <option value="PDF & Document Security">PDF &amp; Document Security</option>
                    <option value="Web Development & Tools">Web Development &amp; Tools</option>
                    <option value="Islamic Utilities">Islamic Utilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Read Time (e.g. 5 min read)
                  </label>
                  <input
                    type="text"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1">
                    Excerpt / Lead Paragraph
                  </label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Short 2-3 sentence overview that appears on blog cards and Google search results..."
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-xs focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  />
                </div>
              </div>

              {/* Markdown Content with View Mode */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Article Body (Markdown)
                  </label>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setViewMode('edit')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${viewMode === 'edit' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xs' : 'text-gray-500'}`}
                    >
                      Editor
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('split')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${viewMode === 'split' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xs' : 'text-gray-500'}`}
                    >
                      Split
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('preview')}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold ${viewMode === 'preview' ? 'bg-white dark:bg-gray-800 text-indigo-600 shadow-xs' : 'text-gray-500'}`}
                    >
                      Preview
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {(viewMode === 'edit' || viewMode === 'split') && (
                    <div className={viewMode === 'edit' ? 'lg:col-span-2' : ''}>
                      <textarea
                        rows={14}
                        required
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full p-4 rounded-2xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 font-mono text-xs leading-relaxed focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
                      />
                    </div>
                  )}

                  {(viewMode === 'preview' || viewMode === 'split') && (
                    <div className={`p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 overflow-y-auto max-h-[360px] prose dark:prose-invert prose-sm max-w-none ${
                      viewMode === 'preview' ? 'lg:col-span-2' : ''
                    }`}>
                      <ReactMarkdown>{formData.content}</ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Controls */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 flex items-center gap-2"
                >
                  {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                  <span>{editingPost ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-700 space-y-4">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">Delete Article?</h4>
            <p className="text-xs text-gray-500">
              Are you sure you want to delete <strong>"{postToDelete.title}"</strong>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPostToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeletePost}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold"
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
