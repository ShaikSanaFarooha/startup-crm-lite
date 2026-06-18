import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const DarkModeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-between w-14 h-7 bg-slate-200 dark:bg-slate-700 rounded-full p-1 cursor-pointer select-none transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      aria-label="Toggle dark mode"
    >
      <Sun size={12} className="text-amber-500 ml-1" />
      <Moon size={12} className="text-slate-400 dark:text-blue-400 mr-1" />
      
      {/* Sliding Knob */}
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center
          ${isDarkMode ? 'translate-x-7' : 'translate-x-0'}`}
      >
        {isDarkMode ? (
          <Moon size={12} className="text-blue-400 fill-blue-400" />
        ) : (
          <Sun size={12} className="text-amber-500 fill-amber-500" />
        )}
      </div>
    </button>
  );
};

export default DarkModeToggle;
