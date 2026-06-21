// ═══════════════════════════════════════════════════
// ECOTRACK AI — ACTIVITY CARD COMPONENT
// ═══════════════════════════════════════════════════

import { X, Car, Zap, UtensilsCrossed, ShoppingBag } from 'lucide-react';

const CATEGORY_CONFIG = {
  transport: {
    icon: Car,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    borderColor: 'border-blue-200 dark:border-blue-800/30',
    label: 'Transport',
  },
  electricity: {
    icon: Zap,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    borderColor: 'border-yellow-200 dark:border-yellow-800/30',
    label: 'Electricity',
  },
  food: {
    icon: UtensilsCrossed,
    color: 'text-green-500',
    bgColor: 'bg-green-100 dark:bg-green-900/20',
    borderColor: 'border-green-200 dark:border-green-800/30',
    label: 'Food',
  },
  shopping: {
    icon: ShoppingBag,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    borderColor: 'border-purple-200 dark:border-purple-800/30',
    label: 'Shopping',
  },
};

/**
 * Format a date into a relative time string.
 */
function getRelativeTime(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return date.toLocaleDateString();
}

/**
 * Capitalize the first letter and replace underscores.
 */
function formatType(type) {
  if (!type) return '';
  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ActivityCard({ activity, onDelete }) {
  const { id, category, type, value, unit, co2, date } = activity;

  const config = CATEGORY_CONFIG[category?.toLowerCase()] || CATEGORY_CONFIG.transport;
  const Icon = config.icon;

  return (
    <div className="animate-slide-in-right group glass-card p-4 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Category Icon */}
        <div
          className={`flex items-center justify-center w-10 h-10 rounded-xl flex-shrink-0 ${config.bgColor}`}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 dark:text-white truncate">
              {formatType(type)}
            </span>
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border
                ${config.bgColor} ${config.color} ${config.borderColor}`}
            >
              {config.label}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {value} {unit}
            </span>
            <span className="text-xs text-gray-300 dark:text-gray-600">•</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {getRelativeTime(date)}
            </span>
          </div>
        </div>

        {/* CO2 Amount */}
        <div className="text-right flex-shrink-0">
          <span className="text-base font-bold font-display text-gray-800 dark:text-white">
            {co2.toFixed(2)}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">kg</span>
        </div>

        {/* Delete Button */}
        <button
          onClick={() => onDelete && onDelete(id)}
          className="flex items-center justify-center w-7 h-7 rounded-lg
            opacity-0 group-hover:opacity-100
            bg-red-50 dark:bg-red-900/10 text-red-400 
            hover:bg-red-100 dark:hover:bg-red-900/20 hover:text-red-500
            transition-all duration-200 flex-shrink-0"
          aria-label="Delete activity"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
