// ═══════════════════════════════════════════════════
// ECOTRACK AI — CATEGORY DONUT CHART COMPONENT
// ═══════════════════════════════════════════════════

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CATEGORY_COLORS = {
  Transport: '#3b82f6',
  Electricity: '#f59e0b',
  Food: '#10b981',
  Shopping: '#8b5cf6',
};

const DEFAULT_COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="glass-card px-4 py-3 shadow-xl">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.payload.color || data.color }}
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {data.name}
          </span>
        </div>
        <p className="text-lg font-bold font-display text-gray-900 dark:text-white mt-1">
          {data.value.toFixed(1)} kg
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">CO₂ equivalent</p>
      </div>
    );
  }
  return null;
}

export default function CategoryChart({ data = [] }) {
  // Normalize data: handle both array and object formats
  let chartInput = data;
  if (data && !Array.isArray(data)) {
    chartInput = Object.entries(data).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value || 0,
    }));
  }
  const hasData = chartInput && chartInput.length > 0 && chartInput.some((d) => d.value > 0);
  const total = Array.isArray(chartInput) ? chartInput.reduce((sum, d) => sum + (d.value || 0), 0) : 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <div className="w-20 h-20 rounded-full bg-primary-50 dark:bg-dark-surface flex items-center justify-center mb-4">
          <span className="text-3xl">📊</span>
        </div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          No data yet
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Log activities to see your breakdown
        </p>
      </div>
    );
  }

  const chartData = chartInput.filter((d) => d.value > 0);

  return (
    <div className="relative h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={4}
            dataKey="value"
            nameKey="name"
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={entry.name}
                fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-bold font-display text-gray-800 dark:text-white">
          {total.toFixed(1)}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          kg CO₂
        </span>
      </div>
    </div>
  );
}
