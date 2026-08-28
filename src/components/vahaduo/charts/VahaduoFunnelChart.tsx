import React from 'react';
import { SingleAdmixtureComponent } from '../../../types/vahaduo';

interface VahaduoFunnelChartProps {
  components: SingleAdmixtureComponent[];
  targetName: string;
  distance: number;
}

export function VahaduoFunnelChart({ components, targetName, distance }: VahaduoFunnelChartProps) {
  // Sort active components in descending order of contribution
  const sorted = [...components]
    .filter((c) => c.percentage > 0.01)
    .sort((a, b) => b.percentage - a.percentage);

  const totalSum = sorted.reduce((acc, c) => acc + c.percentage, 0) || 100;
  let cumulative = 0;

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs animate-in fade-in duration-200 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">
            GRÁFICA DE EMBUDO ANCESTRAL (FUNNEL)
          </span>
          <h4 className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
            {targetName}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
            Ajuste: {(distance * 100).toFixed(4)}%
          </span>
        </div>
      </div>

      {/* Funnel Layers */}
      <div className="space-y-2.5 max-w-xl mx-auto py-2">
        {sorted.map((c, idx) => {
          cumulative += c.percentage;
          // Calculate proportional width from 100% down to minimum 25%
          const maxLevelWidth = 100;
          const minLevelWidth = 28;
          const levelWidth = Math.max(
            minLevelWidth,
            maxLevelWidth - idx * (70 / Math.max(sorted.length, 1))
          );

          return (
            <div key={c.sourceName} className="flex flex-col items-center group">
              <div
                className="transition-all duration-300 rounded-xl p-3 text-white flex items-center justify-between shadow-md relative overflow-hidden group-hover:scale-[1.02]"
                style={{
                  width: `${levelWidth}%`,
                  backgroundColor: c.color || '#3b82f6'
                }}
              >
                {/* Background gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 pointer-events-none" />

                <div className="flex items-center gap-2 z-10 truncate pr-2">
                  <span className="text-[10px] bg-black/40 px-1.5 py-0.5 rounded font-bold">
                    #{idx + 1}
                  </span>
                  <span className="text-xs font-bold truncate drop-shadow-xs">
                    {c.sourceName}
                  </span>
                </div>

                <div className="flex items-center gap-2 z-10 shrink-0">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-black/30 rounded">
                    {c.percentage.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* Sub-label between funnel levels */}
              <div className="text-[10px] text-neutral-400 dark:text-neutral-500 py-0.5">
                Acumulado: {cumulative.toFixed(1)}% / {totalSum.toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
