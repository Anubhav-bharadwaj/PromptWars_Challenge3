// ═══════════════════════════════════════════════════
// ECOTRACK AI — ECO SCORE GAUGE COMPONENT
// ═══════════════════════════════════════════════════

import { useEffect, useState } from 'react';

export default function EcoScoreGauge({ score = 0, tier = {} }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedOffset, setAnimatedOffset] = useState(283);

  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;

  // Determine color based on score tier
  const getColor = () => {
    if (score >= 75) return '#059669';
    if (score >= 45) return '#f59e0b';
    return '#ef4444';
  };

  const getGlowColor = () => {
    if (score >= 75) return 'rgba(5, 150, 105, 0.3)';
    if (score >= 45) return 'rgba(245, 158, 11, 0.3)';
    return 'rgba(239, 68, 68, 0.3)';
  };

  const color = getColor();
  const glowColor = getGlowColor();

  // Animate score count-up and arc
  useEffect(() => {
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore(Math.round(eased * score));
      setAnimatedOffset(circumference - eased * (score / 100) * circumference);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [score, circumference]);

  return (
    <div className="flex flex-col items-center">
      {/* Gauge */}
      <div className="relative" style={{ width: size, height: size }}>
        {/* Dark mode glow */}
        <div
          className="absolute inset-0 rounded-full hidden dark:block"
          style={{
            boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}`,
          }}
        />

        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200 dark:text-dark-border"
          />

          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animatedOffset}
            style={{
              filter: `drop-shadow(0 0 6px ${glowColor})`,
              transition: 'stroke 0.3s ease',
            }}
          />

          {/* Secondary thin arc for decoration */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius - strokeWidth - 4}
            stroke={color}
            strokeWidth={2}
            fill="none"
            opacity={0.2}
            strokeDasharray="4 8"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-5xl font-bold font-display leading-none"
            style={{ color }}
          >
            {animatedScore}
          </span>
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500 mt-1 uppercase tracking-wider">
            EcoScore
          </span>
        </div>
      </div>

      {/* Tier label */}
      <div className="mt-4 text-center">
        <span className="text-2xl">{tier.emoji || '🌱'}</span>
        <p
          className="text-sm font-semibold font-display mt-1"
          style={{ color: tier.color || color }}
        >
          {tier.label || 'Green Hero'}
        </p>
      </div>
    </div>
  );
}
