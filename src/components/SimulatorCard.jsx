// ═══════════════════════════════════════════════════
// ECOTRACK AI — SIMULATOR CARD COMPONENT
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';
import { ArrowRight, TrendingDown, TreePine } from 'lucide-react';
import { getEquivalent } from '../utils/carbonCalculator';

export default function SimulatorCard({
  currentLabel = 'Current',
  currentCO2 = 0,
  alternativeLabel = 'Alternative',
  alternativeCO2 = 0,
  equivalents: externalEquivalents = null,
}) {
  const [animatedSavings, setAnimatedSavings] = useState(0);
  const savings = Math.max(0, currentCO2 - alternativeCO2);
  const equivalentData = externalEquivalents || getEquivalent(savings);

  const maxCO2 = Math.max(currentCO2, alternativeCO2, 1);
  const currentWidth = (currentCO2 / maxCO2) * 100;
  const altWidth = (alternativeCO2 / maxCO2) * 100;

  // Animate savings count-up
  useEffect(() => {
    if (savings <= 0) {
      setAnimatedSavings(0);
      return;
    }

    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedSavings(eased * savings);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [savings]);

  return (
    <div className="glass-card p-6 card-hover">
      {/* Comparison Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current Scenario */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Current
            </span>
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">
            {currentLabel}
          </h4>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold font-display text-gray-800 dark:text-white">
                {currentCO2.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">kg CO₂</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-red-400 to-orange-400 transition-all duration-700 ease-out"
                style={{ width: `${currentWidth}%` }}
              />
            </div>
          </div>
        </div>

        {/* Alternative Scenario */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary-400" />
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Alternative
            </span>
          </div>
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-200 capitalize">
            {alternativeLabel}
          </h4>
          <div className="space-y-2">
            <div className="flex items-end gap-2">
              <span className="text-2xl font-bold font-display text-primary-600 dark:text-primary-400">
                {alternativeCO2 === 0 ? '0' : alternativeCO2.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500 mb-1">
                {alternativeCO2 === 0 ? 'kg CO₂ — Zero emissions! 🌱' : 'kg CO₂'}
              </span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
              <div
                className="h-full rounded-full gradient-green transition-all duration-700 ease-out"
                style={{ width: `${altWidth}%` }}
              />
            </div>
          </div>
        </div>
      </div>


      {/* Savings Section */}
      {savings > 0 && (
        <div className="relative overflow-hidden rounded-xl p-5 gradient-green">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white" />
            <div className="absolute -left-2 -bottom-2 w-16 h-16 rounded-full bg-white" />
          </div>

          <div className="relative flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/70 font-medium">You could save</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold font-display text-white">
                    {animatedSavings.toFixed(1)}
                  </span>
                  <span className="text-sm text-white/80 mb-1">kg CO₂</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/15 rounded-lg px-3 py-2">
              <TreePine className="w-4 h-4 text-white/80" />
              <span className="text-sm text-white/90 font-medium">
                {equivalentData.description}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* No savings */}
      {savings <= 0 && (
        <div className="text-center py-4">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose different scenarios to compare their carbon impact
          </p>
        </div>
      )}
    </div>
  );
}
