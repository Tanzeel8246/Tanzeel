'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle2, AlertCircle, Copy, ExternalLink } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setResetUrl(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to request password reset.');
      }

      setSuccessMessage(data.message || 'Password reset link generated.');
      if (data.resetUrl) {
        setResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (!resetUrl) return;
    navigator.clipboard.writeText(resetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <Link 
          href="/login" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back to Sign In
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 mb-4">
            <Mail size={24} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
            Enter your account email to receive your secure password reset link.
          </p>
        </div>

        {error && (
          <div 
            role="alert" 
            aria-live="polite" 
            className="flex items-center gap-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3.5 rounded-xl mb-6 text-sm font-medium border border-red-100 dark:border-red-800"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div 
            role="status" 
            aria-live="polite" 
            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-xl mb-6 text-sm border border-green-200 dark:border-green-800"
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              <CheckCircle2 size={18} className="text-green-600 dark:text-green-400 shrink-0" />
              <span>Link Ready</span>
            </div>
            <p className="text-xs text-green-800 dark:text-green-200">{successMessage}</p>

            {resetUrl && (
              <div className="mt-4 pt-3 border-t border-green-200 dark:border-green-800/50 flex flex-col gap-2">
                <Link
                  href={resetUrl}
                  className="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <ExternalLink size={14} /> Open Password Reset Page
                </Link>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="w-full py-2 px-4 bg-white dark:bg-gray-800 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-green-50 transition-colors"
                >
                  <Copy size={14} /> {copied ? 'Link Copied!' : 'Copy Reset Link'}
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              Email Address <span aria-hidden="true" className="text-red-500">*</span>
            </label>
            <input 
              id="reset-email"
              type="email" 
              name="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white font-medium text-sm transition-all" 
              placeholder="you@example.com"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? 'Generating Reset Link...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
          Remember your password?{' '}
          <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
