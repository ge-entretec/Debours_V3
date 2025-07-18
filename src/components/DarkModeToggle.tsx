import React from 'react';
import { Sun, Moon } from 'lucide-react';

interface DarkModeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

export function DarkModeToggle({ isDarkMode, onToggle }: DarkModeToggleProps) {
  return (
    <button
      onClick={onToggle}
      className="relative p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 group shadow-sm hover:shadow-md"
      title={isDarkMode ? 'Passer en mode jour' : 'Passer en mode nuit'}
    >
      <div className="relative w-5 h-5">
        <Sun className={`absolute inset-0 w-5 h-5 text-yellow-500 transition-all duration-300 ${
          isDarkMode ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`} />
        <Moon className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
          isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
        }`} />
      </div>
      
      {/* Effet de glow au hover */}
      <div className={`absolute inset-0 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100 ${
        isDarkMode 
          ? 'bg-blue-400/10 shadow-lg shadow-blue-400/20' 
          : 'bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
      }`}></div>
    </button>
  );
}