import React, { useState, useEffect, useMemo } from 'react';
import { G25Sample, DistanceResult, DistanceGradientThresholds, DEFAULT_GRADIENT_THRESHOLDS } from '../../types/vahaduo';
import { computeG25Distances, formatDistance8Decimals, getVahaduoDistanceBadgeStyle } from '../../utils/vahaduoMath';
import { Play, Trash2, Copy, Check, SlidersHorizontal, Search, User, Users, RefreshCw, X } from 'lucide-react';
import { DistanceGradientRegulator } from './DistanceGradientRegulator';

interface VahaduoDistanceTabProps {
  targets: G25Sample[];
  sources: G25Sample[];
  gradientThresholds?: DistanceGradientThresholds;
  onGradientThresholdsChange?: (thresholds: DistanceGradientThresholds) => void;
}

export function VahaduoDistanceTab({
  targets,
  sources,
  gradientThresholds = DEFAULT_GRADIENT_THRESHOLDS,
  onGradientThresholdsChange
}: VahaduoDistanceTabProps) {
  const [maxOutput, setMaxOutput] = useState<number>(25);
  const [selectedTarget, setSelectedTarget] = useState<string>('all');
  const [results, setResults] = useState<DistanceResult[] | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | 'all' | null>(null);

  // Compute distances for all or for an individual target person
  const handleRunDistances = (targetNameToRun?: string) => {
    if (!targets.length || !sources.length) return;
    
    const which = targetNameToRun || selectedTarget;
    const targetsToRun = which === 'all' 
      ? targets 
      : targets.filter((t) => t.name === which);

    if (targetsToRun.length === 0) return;

    const computed = computeG25Distances(targetsToRun, sources, maxOutput);

    // If running an individual target, update or merge into current results
    if (which !== 'all') {
      setResults((prev) => {
        if (!prev) return computed;
        const otherResults = prev.filter((r) => r.targetName !== which);
        return [...otherResults, ...computed];
      });
    } else {
      setResults(computed);
    }
  };

  const handleClear = () => {
    setResults(null);
  };

  const handleRemoveTargetResult = (targetName: string) => {
    setResults((prev) => {
      if (!prev) return null;
      const updated = prev.filter((r) => r.targetName !== targetName);
      return updated.length > 0 ? updated : null;
    });
  };

  const handleCopyAll = () => {
    if (!results || !results.length) return;
    let text = '';
    for (const res of results) {
      text += `Distance to:\t${res.targetName}\n`;
      res.items.forEach((item) => {
        text += `${formatDistance8Decimals(item.distance)}\t${item.sourceName}\n`;
      });
      text += '\n';
    }
    navigator.clipboard.writeText(text);
    setCopiedIndex('all');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopySingle = (res: DistanceResult, index: number) => {
    let text = `Distance to:\t${res.targetName}\n`;
    res.items.forEach((item) => {
      text += `${formatDistance8Decimals(item.distance)}\t${item.sourceName}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Filter items in view if search query is provided
  const filteredResults = useMemo(() => {
    if (!results) return [];
    let list = results;
    if (selectedTarget !== 'all') {
      list = list.filter((r) => r.targetName === selectedTarget);
    }
    if (!searchFilter.trim()) return list;
    const q = searchFilter.toLowerCase().trim();
    return list.map((res) => ({
      ...res,
      items: res.items.filter((item) => item.sourceName.toLowerCase().includes(q))
    }));
  }, [results, selectedTarget, searchFilter]);

  return (
    <div className="w-full space-y-5 animate-in fade-in duration-200">
      {/* Individual Target Selector Bar when multiple targets exist */}
      {targets.length > 0 && (
        <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 shrink-0">
            <User className="w-4 h-4 text-neutral-500" />
            <span>PERSONA / TARGET:</span>
          </div>

          {/* Quick Target Chips / Selector */}
          <div className="flex flex-wrap items-center gap-1.5 flex-1">
            <button
              onClick={() => setSelectedTarget('all')}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                selectedTarget === 'all'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Users className="w-3 h-3" />
                <span>TODOS ({targets.length})</span>
              </span>
            </button>

            {targets.map((target, idx) => {
              const isSelected = selectedTarget === target.name;
              return (
                <div key={idx} className="flex items-center">
                  <button
                    onClick={() => setSelectedTarget(target.name)}
                    className={`px-2.5 py-1 rounded-l-lg text-xs font-mono transition-all cursor-pointer border border-r-0 max-w-[200px] truncate ${
                      isSelected
                        ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold border-neutral-900 dark:border-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                    title={`Seleccionar ${target.name}`}
                  >
                    👤 {target.name}
                  </button>
                  <button
                    onClick={() => handleRunDistances(target.name)}
                    disabled={!sources.length}
                    className={`px-2 py-1 rounded-r-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black border-neutral-900 dark:border-white hover:opacity-90'
                        : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-600 hover:bg-neutral-300'
                    }`}
                    title={`Correr distancia individualmente para ${target.name}`}
                  >
                    RUN
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Top Toolbar Controls */}
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-distance-run"
            onClick={() => handleRunDistances()}
            disabled={!targets.length || !sources.length}
            className="px-5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed font-bold font-mono text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {selectedTarget === 'all' 
                ? `RUN DISTANCE (${targets.length} TARGETS)` 
                : `RUN: ${selectedTarget}`}
            </span>
          </button>

          <button
            id="btn-distance-copy"
            onClick={handleCopyAll}
            disabled={!results || !results.length}
            className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-700 dark:text-neutral-200 font-mono text-xs border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {copiedIndex === 'all' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">COPIADO</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>COPIAR TODO</span>
              </>
            )}
          </button>

          <button
            id="btn-distance-clear"
            onClick={handleClear}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-100 dark:hover:bg-red-950/40 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-300 font-mono text-xs border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>CLEAR</span>
          </button>
        </div>

        {/* Right Settings & Filter */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Filter */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrar poblaciones..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-hidden w-44 sm:w-56"
            />
          </div>

          {/* Max Output Selector */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <label htmlFor="dist-max-output" className="text-[11px]">
              MAX OUTPUT:
            </label>
            <select
              id="dist-max-output"
              value={maxOutput}
              onChange={(e) => setMaxOutput(Number(e.target.value))}
              className="bg-transparent text-neutral-900 dark:text-neutral-100 font-bold font-mono text-xs focus:outline-hidden cursor-pointer"
            >
              <option value={10} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">10</option>
              <option value={20} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">20</option>
              <option value={25} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">25</option>
              <option value={50} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">50</option>
              <option value={100} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">100</option>
              <option value={0} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">TODAS</option>
            </select>
          </div>
        </div>
      </div>

      {/* Color Gradient Range Regulator */}
      {onGradientThresholdsChange && (
        <DistanceGradientRegulator
          thresholds={gradientThresholds}
          onChange={onGradientThresholdsChange}
        />
      )}

      {/* Main Results Display - Distance Output with Regulated Color Spectrum */}
      {filteredResults && filteredResults.length > 0 ? (
        <div className="space-y-6">
          {filteredResults.map((targetBlock, bIdx) => (
            <div
              key={bIdx}
              className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs"
            >
              {/* Header: Distance to: Target_Name with individual actions */}
              <div className="px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5 font-mono text-xs sm:text-sm">
                  <span className="text-neutral-500 font-medium tracking-wide">
                    Distance to:
                  </span>
                  <span className="text-neutral-900 dark:text-white font-bold tracking-tight">
                    {targetBlock.targetName}
                  </span>
                  <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
                    ({targetBlock.items.length} poblaciones)
                  </span>
                </div>

                {/* Per-target actions: Recalculate, Copy, Remove */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleRunDistances(targetBlock.targetName)}
                    className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
                    title={`Recalcular distancia para ${targetBlock.targetName}`}
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span className="hidden md:inline text-[10px]">Recalcular</span>
                  </button>

                  <button
                    onClick={() => handleCopySingle(targetBlock, bIdx)}
                    className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 font-mono"
                    title="Copiar resultado de este target"
                  >
                    {copiedIndex === bIdx ? (
                      <Check className="w-3 h-3 text-emerald-500" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span className="hidden md:inline text-[10px]">Copiar</span>
                  </button>

                  <button
                    onClick={() => handleRemoveTargetResult(targetBlock.targetName)}
                    className="p-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                    title="Ocultar resultado de este target"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Exact Rows Table with Dynamic Granular Color Spectrum */}
              <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {targetBlock.items.length === 0 ? (
                  <div className="p-4 text-center text-xs font-mono text-neutral-500">
                    No se encontraron poblaciones con el filtro actual.
                  </div>
                ) : (
                  targetBlock.items.map((item, rowIdx) => {
                    const badgeStyle = getVahaduoDistanceBadgeStyle(item.distance, gradientThresholds);
                    return (
                      <div
                        key={rowIdx}
                        className="flex items-center gap-3 px-3 py-1 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
                      >
                        {/* Left: Dynamic Color-Coded Box with 8 decimals */}
                        <div
                          style={{
                            backgroundColor: badgeStyle.backgroundColor,
                            color: badgeStyle.color
                          }}
                          className="shrink-0 font-mono font-bold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-none text-center select-all min-w-[92px] sm:min-w-[102px] transition-colors shadow-xs"
                        >
                          {formatDistance8Decimals(item.distance)}
                        </div>

                        {/* Right: Population Name */}
                        <div className="text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white font-mono text-xs sm:text-[13px] tracking-tight truncate select-all">
                          {item.sourceName}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty / Initial State */
        <div className="p-12 text-center bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 space-y-3">
          <p className="text-sm font-mono text-neutral-500 dark:text-neutral-400">
            {targets.length === 0 || sources.length === 0
              ? 'Por favor define muestras en las pestañas TARGET y SOURCE para calcular distancias.'
              : 'Presiona "RUN DISTANCE" para calcular el ranking de distancias genéticas euclidianas (25D).'}
          </p>
          {targets.length > 0 && sources.length > 0 && (
            <button
              onClick={() => handleRunDistances()}
              className="px-5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold font-mono text-xs cursor-pointer shadow-xs"
            >
              RUN DISTANCE
            </button>
          )}
        </div>
      )}
    </div>
  );
}
