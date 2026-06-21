// ═══════════════════════════════════════════════════
// ECOTRACK AI — BADGE CARD COMPONENT
// ═══════════════════════════════════════════════════

import { useState } from 'react';
import { Lock } from 'lucide-react';

export default function BadgeCard({ badge }) {
  const [showTooltip, setShowTooltip] = useState(false);

  const { emoji, title, description, condition, earned, earnedDate } = badge;

  return (
    <div
      className="relative group"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Card */}
      <div
        className={`relative flex flex-col items-center justify-center w-24 h-24 rounded-2xl border-2 transition-all duration-300 cursor-default
          ${
            earned
              ? 'bg-primary-50 dark:bg-dark-surface border-primary-300 dark:border-primary-700 animate-glow hover:scale-110'
              : 'bg-gray-50 dark:bg-dark-surface border-gray-200 dark:border-dark-border grayscale hover:grayscale-[50%] hover:scale-105'
          }
        `}
      >
        {earned ? (
          <>
            <span className="text-3xl mb-1">{emoji}</span>
            <span className="text-[10px] font-semibold text-primary-700 dark:text-primary-300 text-center leading-tight px-1">
              {title}
            </span>
          </>
        ) : (
          <>
            <div className="relative">
              <span className="text-3xl opacity-30">{emoji}</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <Lock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </div>
            </div>
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 text-center leading-tight px-1 mt-1">
              {title}
            </span>
          </>
        )}
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 animate-fade-in">
          <div className="glass-card px-3 py-2.5 shadow-xl text-center">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1">
              {emoji} {title}
            </p>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              {earned ? description : condition}
            </p>
            {earned && earnedDate && (
              <p className="text-[10px] text-primary-500 mt-1.5 font-medium">
                Earned {new Date(earnedDate).toLocaleDateString()}
              </p>
            )}
            {!earned && (
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1.5 italic">
                🔒 Locked
              </p>
            )}
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 bg-white dark:bg-dark-card border-b border-r border-primary-100 dark:border-dark-border" />
          </div>
        </div>
      )}
    </div>
  );
}
