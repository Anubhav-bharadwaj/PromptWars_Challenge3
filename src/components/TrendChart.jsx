// ═══════════════════════════════════════════════════
// ECOTRACK AI — WEEKLY TREND AREA CHART COMPONENT
// ═══════════════════════════════════════════════════

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-4 py-3 shadow-xl">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
          {label}
        </p>
        <p className="text-lg font-bold font-display text-primary-600 dark:text-primary-400">
          {payload[0].value.toFixed(1)} kg
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">CO₂ emissions</p>
      </div>
    );
  }
  return null;
}

export default function TrendChart({ data = [] }) {
  const hasData = data && data.length > 0 && data.some((d) => d.co2 > 0);

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-dark-surface flex items-center justify-center mb-4">
          <span className="text-3xl">📈</span>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Log activities to see trends
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Your weekly CO₂ trend will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 12,
              fill: '#9ca3af',
              fontFamily: 'Inter',
            }}
            dy={10}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{
              fontSize: 11,
              fill: '#9ca3af',
              fontFamily: 'Space Grotesk',
            }}
            tickFormatter={(value) => `${value}`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="co2"
            stroke="#10b981"
            strokeWidth={2.5}
            fill="url(#greenGradient)"
            dot={{
              r: 4,
              fill: '#10b981',
              stroke: '#fff',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: '#059669',
              stroke: '#fff',
              strokeWidth: 2,
              className: 'drop-shadow-lg',
            }}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
