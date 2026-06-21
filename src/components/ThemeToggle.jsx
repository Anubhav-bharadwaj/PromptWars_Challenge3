// ═══════════════════════════════════════════════════
// ECOTRACK AI — THEME TOGGLE COMPONENT
// ═══════════════════════════════════════════════════

import { Sun, Moon } from 'lucide-react';
import { useApp } from '../store/AppContext';

export default function ThemeToggle() {
  const { state, dispatch } = useApp();
  const isDark = state.theme === 'dark';

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative flex items-center justify-center w-10 h-10 rounded-xl 
        bg-primary-100 dark:bg-dark-card 
        border border-primary-200 dark:border-dark-border
        hover:bg-primary-200 dark:hover:bg-dark-surface
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-primary-400/50
        transition-all duration-300 group"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div
        className="transition-transform duration-500 ease-in-out"
        style={{ transform: isDark ? 'rotate(360deg)' : 'rotate(0deg)' }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
        ) : (
          <Moon className="w-5 h-5 text-primary-700 group-hover:text-primary-600 transition-colors" />
        )}
      </div>

      {/* Subtle glow ring on hover */}
      <div
        className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
          isDark
            ? 'shadow-[0_0_12px_rgba(250,204,21,0.2)]'
            : 'shadow-[0_0_12px_rgba(5,150,105,0.15)]'
        }`}
      />
    </button>
  );
}
