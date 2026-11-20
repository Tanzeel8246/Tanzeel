'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

const themes = [
  { name: 'Indigo', value: 'indigo', colorClass: 'bg-indigo-500' },
  { name: 'Blue', value: 'blue', colorClass: 'bg-blue-500' },
  { name: 'Emerald', value: 'emerald', colorClass: 'bg-emerald-500' },
  { name: 'Rose', value: 'rose', colorClass: 'bg-rose-500' },
  { name: 'Orange', value: 'orange', colorClass: 'bg-orange-500' },
];

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Restore color on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('theme-color');
    if (savedColor) {
      document.documentElement.setAttribute('data-theme', savedColor);
    }
  }, []);

  if (!mounted) return <div className="w-8 h-8" />;

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Read the active color from html data-theme
  const activeColor = typeof document !== 'undefined' ? document.documentElement.getAttribute('data-theme') || 'indigo' : 'indigo';

  const toggleDarkMode = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const changeColor = (color: string) => {
    document.documentElement.setAttribute('data-theme', color);
    // Optionally persist this in localStorage
    localStorage.setItem('theme-color', color);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          )}
        </button>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors focus:outline-none flex items-center justify-center"
          aria-label="Change Theme Color"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
        </button>
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white dark:bg-gray-900 shadow-xl ring-1 ring-black ring-opacity-5 border border-gray-100 dark:border-gray-800 z-50">
            <div className="p-3 grid grid-cols-5 gap-2">
              {themes.map((t) => (
                <button
                  key={t.value}
                  onClick={() => changeColor(t.value)}
                  title={t.name}
                  className={`w-6 h-6 rounded-full focus:outline-none flex items-center justify-center ${t.colorClass} ${activeColor === t.value ? 'ring-2 ring-offset-2 ring-gray-400 dark:ring-offset-gray-900' : ''}`}
                >
                  {activeColor === t.value && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
