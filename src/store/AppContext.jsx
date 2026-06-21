// ═══════════════════════════════════════════════════
// ECOTRACK AI — UNIFIED APP CONTEXT & STATE MANAGEMENT
// ═══════════════════════════════════════════════════

import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { DEFAULT_CHALLENGES, DEFAULT_BADGES } from '../utils/challenges';
import {
  calculateEcoScore,
  getEcoTier,
  totalCO2,
  monthlyCO2,
  weeklyCO2,
  getCategoryBreakdown,
  getCurrentStreak,
  getWeeklyData,
} from '../utils/carbonCalculator';

const AppContext = createContext(null);

const STORAGE_KEY = 'ecotrack-ai-state';

// ─── Initial State ──────────────────────────────────

const defaultState = {
  theme: 'dark',
  activities: [],
  challenges: DEFAULT_CHALLENGES,
  badges: DEFAULT_BADGES,
  chatHistory: [],
};

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge saved state with defaults to pick up any new challenges/badges
      return {
        ...defaultState,
        ...parsed,
        challenges: mergeWithDefaults(parsed.challenges, DEFAULT_CHALLENGES, 'id'),
        badges: mergeWithDefaults(parsed.badges, DEFAULT_BADGES, 'id'),
      };
    }
  } catch (err) {
    console.warn('Failed to load state from localStorage:', err);
  }
  return defaultState;
}

/**
 * Merge saved items with defaults, preserving user progress on existing items
 * and adding any newly defined items.
 */
function mergeWithDefaults(saved, defaults, key) {
  if (!saved || !Array.isArray(saved)) return defaults;

  const savedMap = new Map(saved.map((item) => [item[key], item]));
  const merged = defaults.map((defaultItem) => {
    const savedItem = savedMap.get(defaultItem[key]);
    return savedItem ? { ...defaultItem, ...savedItem } : defaultItem;
  });

  return merged;
}

// ─── Badge Checking Logic ───────────────────────────

function checkBadges(state) {
  const { activities, challenges, badges } = state;
  const now = new Date().toISOString();
  const updatedBadges = badges.map((badge) => {
    if (badge.earned) return badge;

    switch (badge.id) {
      case 'first-step':
        if (activities.length >= 1) {
          return { ...badge, earned: true, earnedDate: now };
        }
        break;

      case 'on-fire':
        if (getCurrentStreak(activities) >= 3) {
          return { ...badge, earned: true, earnedDate: now };
        }
        break;

      case 'week-warrior':
        if (getCurrentStreak(activities) >= 7) {
          return { ...badge, earned: true, earnedDate: now };
        }
        break;

      case 'plant-powered': {
        const plantMeals = activities.filter(
          (a) => a.category === 'food' && (a.type === 'vegetarian' || a.type === 'vegan')
        );
        const totalPlantMeals = plantMeals.reduce((sum, a) => sum + (a.value || 1), 0);
        if (totalPlantMeals >= 10) {
          return { ...badge, earned: true, earnedDate: now };
        }
        break;
      }

      case 'pedal-pusher': {
        const greenTrips = activities.filter(
          (a) => a.category === 'transport' && (a.type === 'bike' || a.type === 'walk')
        ).length;
        if (greenTrips >= 5) {
          return { ...badge, earned: true, earnedDate: now };
        }
        break;
      }

      case 'challenge-champion': {
        const completed = challenges.filter((c) => c.completed).length;
        if (completed >= 3) {
          return { ...badge, earned: true, earnedDate: now };
        }
        break;
      }

      case 'eco-legend': {
        const completedCount = challenges.filter((c) => c.completed).length;
        const score = calculateEcoScore(activities, completedCount);
        if (score >= 90) {
          return { ...badge, earned: true, earnedDate: now };
        }
        break;
      }


      default:
        break;
    }

    return badge;
  });

  return updatedBadges;
}

// ─── Reducer ────────────────────────────────────────

function appReducer(state, action) {
  let newState;

  switch (action.type) {
    case 'ADD_ACTIVITY': {
      const activities = [...state.activities, action.payload];
      newState = { ...state, activities };
      newState.badges = checkBadges(newState);
      return newState;
    }

    case 'DELETE_ACTIVITY': {
      const activities = state.activities.filter((a) => a.id !== action.payload);
      return { ...state, activities };
    }

    case 'TOGGLE_THEME': {
      const theme = state.theme === 'dark' ? 'light' : 'dark';
      return { ...state, theme };
    }

    case 'JOIN_CHALLENGE': {
      const challenges = state.challenges.map((c) =>
        c.id === action.payload
          ? { ...c, joined: true, startDate: new Date().toISOString(), progress: 0 }
          : c
      );
      return { ...state, challenges };
    }

    case 'UPDATE_CHALLENGE_PROGRESS': {
      const { id, progress } = action.payload;
      const challenges = state.challenges.map((c) =>
        c.id === id ? { ...c, progress: Math.min(100, progress) } : c
      );
      return { ...state, challenges };
    }

    case 'COMPLETE_CHALLENGE': {
      const challenges = state.challenges.map((c) =>
        c.id === action.payload ? { ...c, completed: true, progress: 100 } : c
      );
      newState = { ...state, challenges };
      newState.badges = checkBadges(newState);
      return newState;
    }

    case 'EARN_BADGE': {
      const badges = state.badges.map((b) =>
        b.id === action.payload
          ? { ...b, earned: true, earnedDate: new Date().toISOString() }
          : b
      );
      return { ...state, badges };
    }

    case 'ADD_CHAT_MESSAGE': {
      const chatHistory = [...state.chatHistory, action.payload];
      return { ...state, chatHistory };
    }

    case 'CLEAR_CHAT': {
      return { ...state, chatHistory: [] };
    }

    case 'LEAVE_CHALLENGE': {
      const challenges = state.challenges.map((c) =>
        c.id === action.payload
          ? { ...c, joined: false, progress: 0, startDate: null }
          : c
      );
      return { ...state, challenges };
    }


    default:
      return state;
  }
}

// ─── Provider Component ─────────────────────────────

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, null, loadState);

  // Persist state to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to persist state:', err);
    }
  }, [state]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  // ─── Computed Values ──────────────────────────────

  const completedChallenges = state.challenges.filter((c) => c.completed).length;

  const computed = {
    totalCO2: totalCO2(state.activities),
    monthlyCO2: monthlyCO2(state.activities),
    weeklyCO2: weeklyCO2(state.activities),
    categoryBreakdown: getCategoryBreakdown(state.activities),
    ecoScore: calculateEcoScore(state.activities, completedChallenges),
    ecoTier: getEcoTier(calculateEcoScore(state.activities, completedChallenges)),
    currentStreak: getCurrentStreak(state.activities),
    weeklyData: getWeeklyData(state.activities),
    completedChallenges,
    activitiesCount: state.activities.length,
    earnedBadgesCount: state.badges.filter((b) => b.earned).length,
  };

  const value = {
    state,
    dispatch,
    ...computed,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// ─── Hook ───────────────────────────────────────────

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// ─── Re-export helpers for convenience ──────────────

export {
  totalCO2,
  monthlyCO2,
  weeklyCO2,
  getCategoryBreakdown,
  calculateEcoScore,
  getEcoTier,
  getCurrentStreak,
  getWeeklyData,
};
