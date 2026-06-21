// ═══════════════════════════════════════════════════
// ECOTRACK AI — CHALLENGE CARD COMPONENT
// ═══════════════════════════════════════════════════

import { CheckCircle, Clock, Flame } from 'lucide-react';

const DIFFICULTY_STYLES = {
  Easy: {
    bg: 'bg-green-100 dark:bg-green-900/20',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800/30',
  },
  Medium: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    border: 'border-yellow-200 dark:border-yellow-800/30',
  },
  Hard: {
    bg: 'bg-red-100 dark:bg-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800/30',
  },
};

export default function ChallengeCard({
  challenge,
  onJoin,
  onLeave,
  onComplete,
}) {
  const {
    id,
    title,
    description,
    icon,
    duration,
    co2Savings,
    difficulty,
    joined,
    progress,
    completed,
  } = challenge;

  const diffStyle = DIFFICULTY_STYLES[difficulty] || DIFFICULTY_STYLES.Easy;

  return (
    <div
      className={`relative glass-card p-5 card-hover overflow-hidden transition-all duration-300
        ${completed ? 'ring-2 ring-primary-400 dark:ring-primary-500 animate-glow' : ''}
      `}
    >
      {/* Completed overlay */}
      {completed && (
        <div className="absolute top-3 right-3 z-10">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold shadow-md">
            <CheckCircle className="w-3.5 h-3.5" />
            Completed
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 dark:bg-dark-surface text-2xl flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold font-display text-gray-800 dark:text-white truncate">
            {title}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        {/* Difficulty badge */}
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border
            ${diffStyle.bg} ${diffStyle.text} ${diffStyle.border}`}
        >
          <Flame className="w-3 h-3" />
          {difficulty}
        </span>

        {/* Duration */}
        <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          {duration} day{duration !== 1 ? 's' : ''}
        </span>

        {/* CO2 Savings */}
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400">
          🌿 -{co2Savings} kg CO₂
        </span>
      </div>

      {/* Progress bar (when joined) */}
      {joined && !completed && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Progress</span>
            <span className="text-xs font-bold font-display text-primary-600 dark:text-primary-400">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2.5 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
            <div
              className="h-full rounded-full gradient-green transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!completed && (
        <div className="flex gap-2">
          {!joined ? (
            <button
              onClick={() => onJoin && onJoin(id)}
              className="flex-1 py-2.5 rounded-xl gradient-green text-white text-sm font-semibold
                shadow-md shadow-primary-500/20 hover:shadow-lg hover:scale-[1.02]
                active:scale-[0.98] transition-all duration-200"
            >
              Join Challenge
            </button>
          ) : (
            <>
              <button
                onClick={() => onComplete && onComplete(id)}
                className="flex-1 py-2.5 rounded-xl gradient-green text-white text-sm font-semibold
                  shadow-md shadow-primary-500/20 hover:shadow-lg hover:scale-[1.02]
                  active:scale-[0.98] transition-all duration-200"
              >
                Mark Complete
              </button>
              <button
                onClick={() => onLeave && onLeave(id)}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold
                  bg-gray-100 dark:bg-dark-surface text-gray-500 dark:text-gray-400
                  border border-gray-200 dark:border-dark-border
                  hover:bg-gray-200 dark:hover:bg-dark-card
                  transition-all duration-200"
              >
                Leave
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
