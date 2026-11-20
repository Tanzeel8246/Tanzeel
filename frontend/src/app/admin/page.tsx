import React from 'react';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAllTools } from '@/lib/tools-store';
import { 
  Wrench, Users, ShieldCheck, ArrowRight, Plus, ExternalLink, Settings, 
  Sparkles, Layers, Activity, FileText, CheckCircle2 
} from 'lucide-react';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  // In production, enforce ADMIN role check (if not admin, redirect)
  if (process.env.NODE_ENV === 'production' && (!session || (session.user as any)?.role !== 'ADMIN')) {
    redirect('/login?callbackUrl=/admin');
  }

  // Safely fetch users with dynamic prisma import to prevent build-time crashes
  let users: any[] = [];
  try {
    const prismaModule = await import('@/lib/prisma');
    const prisma = prismaModule.default || prismaModule.prisma;
    if (prisma) {
      users = await prisma.user.findMany({
        orderBy: { id: 'desc' },
      });
    }
  } catch (err) {
    console.warn('Non-fatal: Could not fetch users from SQLite:', err);
  }

  const allTools = getAllTools();
  const totalTools = allTools.length;
  const activeTools = allTools.filter(t => t.status === 'active').length;
  const customTools = allTools.filter(t => t.isCustom).length;
  const totalUsers = users.length;
  const proUsers = users.filter((u) => u.role === 'PRO').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider mb-3">
              <ShieldCheck size={16} />
              <span>Admin Control Center</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Super Admin Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Manage website tools, edit parameters, monitor users, and configure live deployments.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/tools"
              className="inline-flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
            >
              <Wrench size={18} />
              <span>Open Tools Editor</span>
            </Link>
            <Link 
              href="/" 
              className="px-5 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-2xl text-sm font-bold shadow-sm hover:shadow-md transition-all text-gray-700 dark:text-gray-200"
            >
              Back to Website
            </Link>
          </div>
        </div>

        {/* Primary Admin Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link 
            href="/admin/tools"
            className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center font-bold">
                  <Wrench size={24} />
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">Tools Manager</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Add, edit, rename, customize mockups, and toggle 88+ tools.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-600">{totalTools} Total Tools</span>
              <span className="text-gray-400">{activeTools} Active</span>
            </div>
          </Link>

          <Link 
            href="/admin/pages"
            className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl flex items-center justify-center font-bold">
                  <FileText size={24} />
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">Pages &amp; Legal Editor</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Edit Privacy Policy, Terms, About, Contact &amp; Homepage copy.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-green-600">5 Site Pages</span>
              <span className="text-gray-400">Live Markdown</span>
            </div>
          </Link>

          <Link 
            href="/admin/blogs"
            className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center font-bold">
                  <Sparkles size={24} />
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">Blogs &amp; Guides</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Publish high-value SEO articles to ensure AdSense approval.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-purple-600">SEO Publisher</span>
              <span className="text-gray-400">AdSense Ready</span>
            </div>
          </Link>

          <Link 
            href="/admin/settings"
            className="group bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-indigo-500 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center font-bold">
                  <Settings size={24} />
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="font-extrabold text-gray-900 dark:text-white text-lg">API &amp; System Settings</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Rotate Groq/Gemini keys, Google OAuth, and AdSense client ID.
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between text-xs">
              <span className="font-bold text-amber-600">Live Key Rotation</span>
              <span className="text-gray-400">Zero Restart</span>
            </div>
          </Link>
        </div>

        {/* Quick Tools Access Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-extrabold">Instant Tools Editor &amp; Publisher</h2>
            <p className="text-indigo-100 text-sm max-w-xl">
              Add new utilities, update existing tool descriptions, toggle live visibility, or embed interactive HTML/JS widgets directly without rebuilding or restarting the server.
            </p>
          </div>
          <Link
            href="/admin/tools"
            className="px-6 py-3.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl font-extrabold text-sm shadow-lg transition-all hover:scale-105 shrink-0"
          >
            Launch Tools Manager &rarr;
          </Link>
        </div>

        {/* Registered Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users size={20} className="text-indigo-600" />
              <span>Registered Accounts</span>
            </h2>
            <span className="text-xs text-gray-400">{users.length} total users in database</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/50">
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID</th>
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                  <th className="p-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400 font-mono">...{u.id.slice(-6)}</td>
                    <td className="p-4 text-sm font-bold text-gray-900 dark:text-white">{u.name || 'N/A'}</td>
                    <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                        ${u.role === 'ADMIN' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : ''}
                        ${u.role === 'PRO' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : ''}
                        ${u.role === 'USER' ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' : ''}
                      `}>
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500 dark:text-gray-400">
                      No user accounts registered yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
