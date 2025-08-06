import React, { useEffect, useState } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { MdOutlineLightMode } from "react-icons/md";

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  // Fallback to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const ThemeToggle: React.FC = () => {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // Optional: Listen to system theme changes and update if user hasn't set a preference
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setDarkMode(e.matches);
      }
    };
    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, []);

  return (
    <div className="relative group">
      <button
        onClick={() => setDarkMode((prev) => !prev)}
        className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:ring-2 ring-gray-300 transition"
        title="Toggle Theme"
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <SunIcon className="w-5 h-5 text-white-400" />
        ) : (
          <MoonIcon className="w-5 h-5 text-gray-600" />
        )}
      </button>
      {/* Tooltip */}
      <div className="absolute top-full left-0 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50 shadow-md">
  {darkMode ? "Switch to light mode" : "Switch to dark mode"}
  <div className="absolute bottom-full left-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
</div>



    </div>
  );
};

export default ThemeToggle; 