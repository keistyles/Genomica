import React from 'react';
import { SingleAdmixtureComponent } from '../../../types/vahaduo';

interface VahaduoBarChartProps {
  components: SingleAdmixtureComponent[];
  targetName: string;
  distance: number;
}

export function VahaduoBarChart({ components, targetName, distance }: VahaduoBarChartProps) {
  const activeComponents = components.filter((c) => c.percentage > 0.01);
  const maxPct = Math.max(...activeComponents.map((c) => c.percentage), 1);

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-xs animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">
            GRÁFICA DE BARRAS · DESGLOSE ANCESTRAL
          </span>
          <h4 className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
            {targetName}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
            Distancia: {(distance * 100).toFixed(4)}%
          </span>
        </div>
      </div>

      {/* Individual Bars for each active contributing component */}
      <div className="space-y-3 font-mono">
        {activeComponents.map((c) => {
          const barWidthPct = (c.percentage / maxPct) * 100;
          return (
            <div key={c.sourceName} className="space-y-1 group">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate pr-2">
                  <span
                    className="w-3 h-3 rounded-xs shrink-0 shadow-2xs"
                    style={{ backgroundColor: c.color || '#3b82f6' }}
                  />
                  <span className="font-semibold text-neutral-900 dark:text-white truncate">
                    {c.sourceName}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  {c.individualDistance !== undefined && (
                    <span className="text-[11px] text-neutral-400">
                      d = {(c.individualDistance * 100).toFixed(3)}%
                    </span>
                  )}
                  <strong className="text-sm text-neutral-900 dark:text-white min-w-[54px] text-right">
                    {c.percentage.toFixed(2)}%
                  </strong>
                </div>
              </div>

              {/* Progress Bar with smooth transition */}
              <div className="w-full h-4 bg-neutral-100 dark:bg-neutral-950 rounded-lg overflow-hidden flex border border-neutral-200/60 dark:border-neutral-800/80 shadow-inner">
                <div
                  className="h-full rounded-md transition-all duration-500 ease-out group-hover:brightness-110 flex items-center justify-end pr-1.5"
                  style={{
                    width: `${Math.max(barWidthPct, 3)}%`,
                    backgroundColor: c.color || '#3b82f6'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
