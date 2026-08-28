import React from 'react';
import { SingleAdmixtureComponent } from '../../../types/vahaduo';

interface VahaduoHistogramChartProps {
  components: SingleAdmixtureComponent[];
  targetName: string;
  distance: number;
}

export function VahaduoHistogramChart({ components, targetName, distance }: VahaduoHistogramChartProps) {
  const activeComponents = components.filter((c) => c.percentage > 0);

  // Define bins for percentage contribution
  const bins = [
    { label: '0.1% - 5.0%', min: 0.1, max: 5.0, name: 'Trazas', color: '#94a3b8' },
    { label: '5.1% - 15.0%', min: 5.1, max: 15.0, name: 'Menor', color: '#38bdf8' },
    { label: '15.1% - 30.0%', min: 15.1, max: 30.0, name: 'Moderado', color: '#3b82f6' },
    { label: '30.1% - 50.0%', min: 30.1, max: 50.0, name: 'Mayor', color: '#8b5cf6' },
    { label: '> 50.0%', min: 50.1, max: 100.0, name: 'Dominante', color: '#ec4899' }
  ];

  const binData = bins.map((b) => {
    const items = activeComponents.filter(
      (c) => c.percentage >= b.min && c.percentage <= b.max
    );
    const sumPct = items.reduce((acc, c) => acc + c.percentage, 0);
    return {
      ...b,
      items,
      count: items.length,
      sumPct
    };
  });

  const maxCount = Math.max(...binData.map((b) => b.count), 1);

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs animate-in fade-in duration-200 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">
            HISTOGRAMA DE DISTRIBUCIÓN DE COMPONENTES
          </span>
          <h4 className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
            {targetName}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
            {activeComponents.length} poblaciones activas
          </span>
        </div>
      </div>

      {/* Histogram Frequency Columns */}
      <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end h-56 pt-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        {binData.map((b) => {
          const heightPct = (b.count / maxCount) * 100;
          return (
            <div key={b.label} className="flex flex-col items-center h-full justify-end group">
              <div className="text-[11px] font-bold text-neutral-900 dark:text-white mb-1">
                {b.count > 0 ? `${b.count} pop` : '-'}
              </div>

              {/* Histogram Column */}
              <div className="w-full max-w-[64px] bg-neutral-100 dark:bg-neutral-950 rounded-t-xl overflow-hidden flex flex-col justify-end border border-b-0 border-neutral-200 dark:border-neutral-800 h-full p-1">
                <div
                  className="w-full rounded-t-lg transition-all duration-500 flex flex-col justify-between items-center py-1 group-hover:brightness-110"
                  style={{
                    height: `${Math.max(heightPct, 6)}%`,
                    backgroundColor: b.color
                  }}
                >
                  {b.count > 0 && (
                    <span className="text-[10px] text-white font-bold drop-shadow-xs">
                      {b.sumPct.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              <div className="text-center mt-2">
                <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 block truncate">
                  {b.name}
                </span>
                <span className="text-[9px] text-neutral-400 block truncate">
                  {b.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* List of items per bin */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {binData
          .filter((b) => b.items.length > 0)
          .map((b) => (
            <div
              key={b.label}
              className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1.5"
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span style={{ color: b.color }}>{b.name} ({b.label})</span>
                <span className="text-neutral-500 text-[11px]">{b.sumPct.toFixed(2)}%</span>
              </div>
              <div className="flex flex-wrap gap-1 text-[11px]">
                {b.items.map((it) => (
                  <span
                    key={it.sourceName}
                    className="px-2 py-0.5 rounded-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
                  >
                    {it.sourceName}: <strong>{it.percentage.toFixed(1)}%</strong>
                  </span>
                ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
