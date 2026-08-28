import React, { useState, useMemo } from 'react';
import { MultiModelResult } from '../../../types/vahaduo';
import { DEFAULT_G25_PALETTE } from '../../../utils/vahaduoMath';
import { useLanguage } from '../../../i18n/LanguageContext';

interface VahaduoStackedBarChartProps {
  result: MultiModelResult;
  customColors?: Record<string, string>;
}

export function VahaduoStackedBarChart({ result, customColors = {} }: VahaduoStackedBarChartProps) {
  const { t } = useLanguage();
  const [sortOrder, setSortOrder] = useState<'ORIGINAL' | 'DISTANCE_ASC' | 'DISTANCE_DESC'>('ORIGINAL');
  const [hoveredSegment, setHoveredSegment] = useState<{
    target: string;
    source: string;
    value: number;
    distance: number;
  } | null>(null);

  // Filter sources that actually have > 0 values
  const activeSources = useMemo(() => {
    return result.sourceNames.filter((source) =>
      result.matrix.some((row) => (row.values[source] || 0) > 0.01)
    );
  }, [result]);

  const getColor = (source: string) => {
    if (customColors[source]) return customColors[source];
    const idx = result.sourceNames.indexOf(source);
    return DEFAULT_G25_PALETTE[(idx >= 0 ? idx : 0) % DEFAULT_G25_PALETTE.length];
  };

  const sortedRows = useMemo(() => {
    const list = [...result.matrix];
    if (sortOrder === 'DISTANCE_ASC') {
      list.sort((a, b) => a.distance - b.distance);
    } else if (sortOrder === 'DISTANCE_DESC') {
      list.sort((a, b) => b.distance - a.distance);
    }
    return list;
  }, [result.matrix, sortOrder]);

  return (
    <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs animate-in fade-in duration-200 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase text-neutral-500 block">
            {t('vahaduo.stackedBarTitle', 'GRÁFICA DE BARRAS APILADAS (100% STACKED BAR)')}
          </span>
          <h4 className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
            {t('vahaduo.multiCohort', 'Cohorte Multi-Target')} ({sortedRows.length} {t('vahaduo.samplesCount', 'muestras')})
          </h4>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-500">{t('vahaduo.sortBy', 'Ordenar por')}:</span>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg px-2.5 py-1 text-xs text-neutral-900 dark:text-white"
          >
            <option value="ORIGINAL">{t('vahaduo.originalOrder', 'Orden Original')}</option>
            <option value="DISTANCE_ASC">{t('vahaduo.distAsc', 'Distancia (Menor a Mayor)')}</option>
            <option value="DISTANCE_DESC">{t('vahaduo.distDesc', 'Distancia (Mayor a Menor)')}</option>
          </select>
        </div>
      </div>

      {/* Hover Info Tooltip Bar */}
      <div className="p-2.5 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs min-h-[38px] flex items-center justify-between">
        {hoveredSegment ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-neutral-500">{t('vahaduo.sample', 'Muestra')}: <strong className="text-neutral-900 dark:text-white">{hoveredSegment.target}</strong></span>
            <span className="text-neutral-500">{t('vahaduo.source', 'Fuente')}: <strong className="text-neutral-900 dark:text-white">{hoveredSegment.source}</strong></span>
            <span className="text-neutral-500">{t('vahaduo.contribution', 'Aporte')}: <strong className="text-emerald-600 dark:text-emerald-400">{hoveredSegment.value.toFixed(2)}%</strong></span>
            <span className="text-neutral-500">{t('vahaduo.distance', 'Distancia')}: <strong>{(hoveredSegment.distance * 100).toFixed(4)}%</strong></span>
          </div>
        ) : (
          <span className="text-neutral-400 text-[11px]">
            {t('vahaduo.hoverSegment', 'Pasa el cursor sobre cualquier segmento para ver los detalles de porcentaje.')}
          </span>
        )}
      </div>

      {/* Stacked Rows */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
        {sortedRows.map((row) => (
          <div key={row.targetName} className="space-y-1 group">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-xs group-hover:text-black dark:group-hover:text-white">
                {row.targetName}
              </span>
              <span className="text-[11px] text-neutral-500">
                d = {(row.distance * 100).toFixed(4)}%
              </span>
            </div>

            {/* 100% Horizontal Stacked Bar */}
            <div className="w-full h-6 bg-neutral-100 dark:bg-neutral-950 rounded-lg overflow-hidden flex border border-neutral-200 dark:border-neutral-800 shadow-inner">
              {activeSources.map((source) => {
                const val = row.values[source] || 0;
                if (val <= 0.001) return null;
                const color = getColor(source);

                return (
                  <div
                    key={source}
                    style={{
                      width: `${val}%`,
                      backgroundColor: color
                    }}
                    onMouseEnter={() =>
                      setHoveredSegment({
                        target: row.targetName,
                        source,
                        value: val,
                        distance: row.distance
                      })
                    }
                    onMouseLeave={() => setHoveredSegment(null)}
                    className="h-full transition-all hover:brightness-125 cursor-pointer relative"
                    title={`${row.targetName} -> ${source}: ${val.toFixed(2)}%`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend below chart */}
      <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
        <span className="text-[10px] text-neutral-500 uppercase block mb-2 font-bold">
          {t('vahaduo.sourcePopulations', 'POBLACIONES FUENTE')} ({activeSources.length})
        </span>
        <div className="flex flex-wrap gap-2.5">
          {activeSources.map((source) => (
            <div
              key={source}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs"
            >
              <span
                className="w-3 h-3 rounded-xs shrink-0"
                style={{ backgroundColor: getColor(source) }}
              />
              <span className="text-neutral-700 dark:text-neutral-300 font-medium truncate max-w-[140px]">
                {source}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
