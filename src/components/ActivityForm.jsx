// ═══════════════════════════════════════════════════
// ECOTRACK AI — ACTIVITY FORM COMPONENT
// ═══════════════════════════════════════════════════

import { useState, useMemo } from 'react';
import { Car, Zap, UtensilsCrossed, ShoppingBag, Plus, Check, Leaf } from 'lucide-react';
import { calculateCO2 } from '../utils/carbonCalculator';
import { useApp } from '../store/AppContext';

const TABS = [
  { id: 'transport', label: 'Transport', icon: Car, emoji: '🚗' },
  { id: 'electricity', label: 'Electricity', icon: Zap, emoji: '⚡' },
  { id: 'food', label: 'Food', icon: UtensilsCrossed, emoji: '🍽️' },
  { id: 'shopping', label: 'Shopping', icon: ShoppingBag, emoji: '🛍️' },
];

const TRANSPORT_TYPES = [
  { value: 'car', label: 'Car' },
  { value: 'bus', label: 'Bus' },
  { value: 'train', label: 'Train' },
  { value: 'flight', label: 'Flight' },
  { value: 'bike', label: 'Bike' },
  { value: 'walk', label: 'Walk' },
  { value: 'electric_car', label: 'Electric Car' },
  { value: 'motorcycle', label: 'Motorcycle' },
];

const FOOD_TYPES = [
  { value: 'beef', label: 'Beef' },
  { value: 'chicken', label: 'Chicken' },
  { value: 'pork', label: 'Pork' },
  { value: 'fish', label: 'Fish' },
  { value: 'vegetarian', label: 'Vegetarian' },
  { value: 'vegan', label: 'Vegan' },
];

const SHOPPING_TYPES = [
  { value: 'clothing', label: 'Clothing' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'groceries', label: 'Groceries' },
  { value: 'furniture', label: 'Furniture' },
];

const UNITS = {
  transport: 'km',
  electricity: 'kWh',
  food: 'meals',
  shopping: 'items',
};

export default function ActivityForm() {
  const [activeTab, setActiveTab] = useState('transport');
  const [type, setType] = useState('car');
  const [value, setValue] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const { dispatch } = useApp();

  // Reset type when switching tabs
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setValue('');
    switch (tabId) {
      case 'transport': setType('car'); break;
      case 'electricity': setType('kwh'); break;
      case 'food': setType('beef'); break;
      case 'shopping': setType('clothing'); break;
      default: setType('car');
    }
  };

  // Live CO2 preview
  const previewCO2 = useMemo(() => {
    const numVal = parseFloat(value);
    if (!numVal || numVal <= 0) return 0;
    return calculateCO2(activeTab, type, numVal);
  }, [activeTab, type, value]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const numVal = parseFloat(value);
    if (!numVal || numVal <= 0) return;

    const co2 = calculateCO2(activeTab, type, numVal);

    const activity = {
      id: crypto.randomUUID(),
      category: activeTab,
      type: type,
      value: numVal,
      unit: UNITS[activeTab],
      co2,
      date: new Date().toISOString(),
      description: `${type} — ${numVal} ${UNITS[activeTab]}`,
    };

    dispatch({ type: 'ADD_ACTIVITY', payload: activity });

    // Show success animation
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);

    // Clear form
    setValue('');
  };

  const getTypeOptions = () => {
    switch (activeTab) {
      case 'transport': return TRANSPORT_TYPES;
      case 'food': return FOOD_TYPES;
      case 'shopping': return SHOPPING_TYPES;
      default: return [];
    }
  };

  const isGreenChoice = type === 'bike' || type === 'walk' || type === 'vegan' || type === 'vegetarian';

  return (
    <div className="glass-card p-6 relative overflow-hidden">
      {/* Success Toast */}
      {showSuccess && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 animate-bounce-in">
          <div className="flex items-center gap-2 px-5 py-3 rounded-xl gradient-green text-white shadow-xl shadow-primary-500/30">
            <Check className="w-5 h-5" />
            <span className="text-sm font-semibold">Activity logged!</span>
          </div>
        </div>
      )}

      {/* Header */}
      <h3 className="text-lg font-bold font-display text-gray-800 dark:text-white mb-5">
        Log Activity
      </h3>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-dark-surface rounded-xl mb-6">
        {TABS.map(({ id, label, emoji }) => (
          <button
            key={id}
            onClick={() => handleTabChange(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
              ${
                activeTab === id
                  ? 'bg-white dark:bg-dark-card text-gray-800 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }
            `}
          >
            <span className="text-base">{emoji}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type selector (not for electricity) */}
        {activeTab !== 'electricity' && (
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
              {activeTab === 'transport' ? 'Mode of Transport' : activeTab === 'food' ? 'Meal Type' : 'Item Type'}
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl appearance-none cursor-pointer
                  bg-gray-50 dark:bg-dark-surface
                  border border-gray-200 dark:border-dark-border
                  text-gray-700 dark:text-gray-200
                  focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-300 dark:focus:border-primary-600
                  transition-all duration-200 text-sm"
              >
                {getTypeOptions().map(({ value: v, label: l }) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Green choice indicator */}
            {isGreenChoice && (
              <div className="flex items-center gap-1.5 mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium animate-fade-in">
                <Leaf className="w-3 h-3" /> Great choice! Zero or minimal emissions 🌿
              </div>
            )}
          </div>
        )}

        {/* Value input */}
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
            {activeTab === 'transport'
              ? 'Distance'
              : activeTab === 'electricity'
              ? 'Energy Usage'
              : activeTab === 'food'
              ? 'Number of Meals'
              : 'Quantity'}
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              step="any"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter ${UNITS[activeTab]}`}
              className="w-full px-4 py-3 rounded-xl
                bg-gray-50 dark:bg-dark-surface
                border border-gray-200 dark:border-dark-border
                text-gray-700 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-gray-500
                focus:outline-none focus:ring-2 focus:ring-primary-400/30 focus:border-primary-300 dark:focus:border-primary-600
                transition-all duration-200 text-sm pr-16"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400 dark:text-gray-500">
              {UNITS[activeTab]}
            </span>
          </div>
        </div>

        {/* CO2 Preview */}
        {previewCO2 > 0 && (
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary-50 dark:bg-dark-surface border border-primary-100 dark:border-dark-border animate-fade-in">
            <span className="text-sm text-gray-600 dark:text-gray-300">Estimated CO₂</span>
            <div className="flex items-end gap-1">
              <span className="text-xl font-bold font-display gradient-green-text">
                {previewCO2.toFixed(2)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mb-0.5">kg</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!value || parseFloat(value) <= 0}
          className="w-full py-3.5 rounded-xl gradient-green text-white text-sm font-semibold
            shadow-md shadow-primary-500/20 
            hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02]
            active:scale-[0.98]
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Log Activity
        </button>
      </form>
    </div>
  );
}
