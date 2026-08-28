import React, { useState, useMemo, useEffect } from 'react';
import { G25Sample, MultiModelResult } from '../../types/vahaduo';
import { solveG25MultiAdmixture, DEFAULT_G25_PALETTE } from '../../utils/vahaduoMath';
import { VahaduoStackedBarChart } from './charts/VahaduoStackedBarChart';
import { VahaduoQpadmBarChart } from './charts/VahaduoQpadmBarChart';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Play,
  Trash2,
  Copy,
  Check,
  Table,
  RotateCcw,
  Sliders,
  Maximize2,
  Minimize2,
  BarChart2,
  BarChart,
  Filter,
  Layers,
  Sparkles,
  ArrowUpDown,
  GripVertical,
  ChevronUp,
  ChevronDown,
  ArrowDownAZ,
  ArrowUpAZ,
  Search,
  Settings2,
  Timer,
  X
} from 'lucide-react';

interface VahaduoMultiTabProps {
  targets: G25Sample[];
  sources: G25Sample[];
  customColors?: Record<string, string>;
}

export function VahaduoMultiTab({ targets, sources, customColors = {} }: VahaduoMultiTabProps) {
  const { t } = useLanguage();
  const [cycles, setCycles] = useState<number>(1.0);
  const [reduce, setReduce] = useState<boolean>(true);
  const [aggregate, setAggregate] = useState<boolean>(false);
  const [addDistCol, setAddDistCol] = useState<boolean>(false);
  const [distColScale, setDistColScale] = useState<number>(1.0);
  const [result, setResult] = useState<MultiModelResult | null>(null);
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [copiedCSV, setCopiedCSV] = useState<boolean>(false);
  const [copiedTSV, setCopiedTSV] = useState<boolean>(false);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isDense, setIsDense] = useState<boolean>(true);
  const [multiView, setMultiView] = useState<'TABLE' | 'QPADM_BARS' | 'STACKED_BAR' | 'HISTOGRAM' | 'FUNNEL' | 'BAR_AVG'>('TABLE');
  const [executionTime, setExecutionTime] = useState<number | null>(null);

  // Custom ordering states for Samples (Targets) and Populations (Sources)
  const [customTargetOrder, setCustomTargetOrder] = useState<string[]>([]);
  const [customSourceOrder, setCustomSourceOrder] = useState<string[]>([]);
  const [showOrderManager, setShowOrderManager] = useState<boolean>(false);
  const [orderTab, setOrderTab] = useState<'TARGETS' | 'SOURCES'>('TARGETS');
  const [filterSearch, setFilterSearch] = useState<string>('');

  // Drag-and-drop state
  const [draggedTargetIdx, setDraggedTargetIdx] = useState<number | null>(null);
  const [draggedSourceIdx, setDraggedSourceIdx] = useState<number | null>(null);

  // Synchronize target names order when targets prop changes
  useEffect(() => {
    const currentTargetNames = targets.map((t) => t.name);
    setCustomTargetOrder((prev) => {
      const remaining = prev.filter((name) => currentTargetNames.includes(name));
      const newlyAdded = currentTargetNames.filter((name) => !remaining.includes(name));
      return [...remaining, ...newlyAdded];
    });
  }, [targets]);

  // Synchronize source names order when sources prop changes
  useEffect(() => {
    const currentSourceNames = sources.map((s) => s.name);
    setCustomSourceOrder((prev) => {
      const remaining = prev.filter((name) => currentSourceNames.includes(name));
      const newlyAdded = currentSourceNames.filter((name) => !remaining.includes(name));
      return [...remaining, ...newlyAdded];
    });
  }, [sources]);

  // Map each source to its custom or unique palette color
  const sourceColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    sources.forEach((s, idx) => {
      map[s.name] = customColors[s.name] || s.color || DEFAULT_G25_PALETTE[idx % DEFAULT_G25_PALETTE.length];
    });
    return map;
  }, [sources, customColors]);

  const getSourceColor = (sourceName: string, fallbackIdx = 0) => {
    return sourceColorMap[sourceName] || customColors[sourceName] || DEFAULT_G25_PALETTE[fallbackIdx % DEFAULT_G25_PALETTE.length];
  };

  const handleRun = () => {
    if (!targets.length || !sources.length) return;
    setIsCalculating(true);
    const t0 = performance.now();
    setTimeout(() => {
      const computed = solveG25MultiAdmixture(targets, sources, {
        cycles,
        reduce,
        aggregate,
        addDistCol,
        distColScale
      });
      const t1 = performance.now();
      setResult(computed);
      setExecutionTime(Math.max(0.1, t1 - t0));
      setIsCalculating(false);
    }, 50);
  };

  const handleClear = () => {
    setResult(null);
    setSortCol(null);
    setExecutionTime(null);
  };

  const handleResetSorting = () => {
    setSortCol(null);
    setSortAsc(true);
    setCustomTargetOrder(targets.map((t) => t.name));
    setCustomSourceOrder(sources.map((s) => s.name));
  };

  // Reorder Source populations based on customSourceOrder
  const effectiveSourceNames = useMemo(() => {
    if (!result) return sources.map((s) => s.name);
    const set = new Set(result.sourceNames);
    const ordered = customSourceOrder.filter((s) => set.has(s));
    const missing = result.sourceNames.filter((s) => !ordered.includes(s));
    return [...ordered, ...missing];
  }, [result, sources, customSourceOrder]);

  // Matrix with sorted/custom ordered rows
  const sortedMatrix = useMemo(() => {
    if (!result) return [];
    
    // If a specific table column is selected for sorting
    if (sortCol) {
      return [...result.matrix].sort((a, b) => {
        let valA = 0;
        let valB = 0;
        if (sortCol === '__distance__') {
          valA = a.distance;
          valB = b.distance;
        } else if (sortCol === '__target__') {
          return sortAsc
            ? a.targetName.localeCompare(b.targetName)
            : b.targetName.localeCompare(a.targetName);
        } else {
          valA = a.values[sortCol] || 0;
          valB = b.values[sortCol] || 0;
        }
        return sortAsc ? valA - valB : valB - valA;
      });
    }

    // Otherwise, follow the customTargetOrder
    const orderMap = new Map<string, number>();
    customTargetOrder.forEach((name, idx) => orderMap.set(name, idx));
    return [...result.matrix].sort((a, b) => {
      const idxA = orderMap.has(a.targetName) ? (orderMap.get(a.targetName) as number) : 9999;
      const idxB = orderMap.has(b.targetName) ? (orderMap.get(b.targetName) as number) : 9999;
      return idxA - idxB;
    });
  }, [result, sortCol, sortAsc, customTargetOrder]);

  // Synchronized MultiModelResult reflecting effective source order
  const synchronizedResult = useMemo(() => {
    if (!result) return null;
    return {
      ...result,
      sourceNames: effectiveSourceNames,
      matrix: sortedMatrix
    };
  }, [result, effectiveSourceNames, sortedMatrix]);

  // Cohort Averages for Bar and Funnel
  const cohortStats = useMemo(() => {
    if (!result || result.matrix.length === 0) return null;
    const totalTargets = result.matrix.length;

    // Average distance
    const avgDistance =
      result.matrix.reduce((acc, row) => acc + row.distance, 0) / totalTargets;

    // Average contribution per source (respecting effective source colors)
    const sourceAverages = effectiveSourceNames.map((sName, idx) => {
      const sum = result.matrix.reduce((acc, row) => acc + (row.values[sName] || 0), 0);
      const avg = sum / totalTargets;
      return {
        sourceName: sName,
        percentage: avg,
        color: getSourceColor(sName, idx)
      };
    }).filter((s) => s.percentage > 0.01);

    // Distance distribution histogram bins
    const distBins = [
      { label: '< 1.0%', min: 0, max: 0.01, name: t('vahaduo.distExcellent', 'Excelente'), color: '#10b981' },
      { label: '1.0% - 2.0%', min: 0.01, max: 0.02, name: t('vahaduo.distVeryGood', 'Muy Bueno'), color: '#3b82f6' },
      { label: '2.0% - 3.0%', min: 0.02, max: 0.03, name: t('vahaduo.distGood', 'Bueno'), color: '#f59e0b' },
      { label: '3.0% - 5.0%', min: 0.03, max: 0.05, name: t('vahaduo.distModerate', 'Moderado'), color: '#f97316' },
      { label: '> 5.0%', min: 0.05, max: 1.0, name: t('vahaduo.distDistant', 'Distante'), color: '#ef4444' }
    ];

    const distanceHistogram = distBins.map((bin) => {
      const matching = result.matrix.filter(
        (r) => r.distance >= bin.min && r.distance < bin.max
      );
      return {
        ...bin,
        count: matching.length,
        pctOfCohort: (matching.length / totalTargets) * 100,
        samples: matching.map((m) => m.targetName)
      };
    });

    return {
      avgDistance,
      sourceAverages,
      distanceHistogram,
      totalTargets
    };
  }, [result, effectiveSourceNames, sourceColorMap, t]);

  // Target sorting operations
  const sortTargetsAZ = () => {
    setSortCol(null);
    setCustomTargetOrder((prev) => [...prev].sort((a, b) => a.localeCompare(b)));
  };

  const sortTargetsZA = () => {
    setSortCol(null);
    setCustomTargetOrder((prev) => [...prev].sort((a, b) => b.localeCompare(a)));
  };

  const sortTargetsByDistanceAsc = () => {
    if (!result) return;
    setSortCol(null);
    const distMap = new Map<string, number>(result.matrix.map((r) => [r.targetName, r.distance]));
    setCustomTargetOrder((prev) =>
      [...prev].sort((a, b) => (distMap.get(a) ?? 0) - (distMap.get(b) ?? 0))
    );
  };

  const sortTargetsByDistanceDesc = () => {
    if (!result) return;
    setSortCol(null);
    const distMap = new Map<string, number>(result.matrix.map((r) => [r.targetName, r.distance]));
    setCustomTargetOrder((prev) =>
      [...prev].sort((a, b) => (distMap.get(b) ?? 0) - (distMap.get(a) ?? 0))
    );
  };

  const moveTarget = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= customTargetOrder.length) return;
    setSortCol(null);
    const updated = [...customTargetOrder];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setCustomTargetOrder(updated);
  };

  // Source sorting operations
  const sortSourcesAZ = () => {
    setSortCol(null);
    setCustomSourceOrder((prev) => [...prev].sort((a, b) => a.localeCompare(b)));
  };

  const sortSourcesZA = () => {
    setSortCol(null);
    setCustomSourceOrder((prev) => [...prev].sort((a, b) => b.localeCompare(a)));
  };

  const sortSourcesByContributionDesc = () => {
    if (!result) return;
    setSortCol(null);
    const avgMap = new Map<string, number>();
    result.sourceNames.forEach((s) => {
      const sum = result.matrix.reduce((acc, row) => acc + (row.values[s] || 0), 0);
      avgMap.set(s, sum);
    });
    setCustomSourceOrder((prev) =>
      [...prev].sort((a, b) => (avgMap.get(b) || 0) - (avgMap.get(a) || 0))
    );
  };

  const sortSourcesByContributionAsc = () => {
    if (!result) return;
    setSortCol(null);
    const avgMap = new Map<string, number>();
    result.sourceNames.forEach((s) => {
      const sum = result.matrix.reduce((acc, row) => acc + (row.values[s] || 0), 0);
      avgMap.set(s, sum);
    });
    setCustomSourceOrder((prev) =>
      [...prev].sort((a, b) => (avgMap.get(a) || 0) - (avgMap.get(b) || 0))
    );
  };

  const moveSource = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= customSourceOrder.length) return;
    setSortCol(null);
    const updated = [...customSourceOrder];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setCustomSourceOrder(updated);
  };

  const handleCopyCSV = () => {
    if (!result) return;
    let csv = `Target,Distance,${effectiveSourceNames.join(',')}\n`;
    sortedMatrix.forEach((row) => {
      const vals = effectiveSourceNames.map((s) => (row.values[s] || 0).toFixed(2));
      csv += `"${row.targetName}",${(row.distance * 100).toFixed(4)},${vals.join(',')}\n`;
    });
    navigator.clipboard.writeText(csv);
    setCopiedCSV(true);
    setTimeout(() => setCopiedCSV(false), 2000);
  };

  const handleCopyTSV = () => {
    if (!result) return;
    let tsv = `Target\tDistance\t${effectiveSourceNames.join('\t')}\n`;
    sortedMatrix.forEach((row) => {
      const vals = effectiveSourceNames.map((s) => (row.values[s] || 0).toFixed(2));
      tsv += `${row.targetName}\t${(row.distance * 100).toFixed(4)}\t${vals.join('\t')}\n`;
    });
    navigator.clipboard.writeText(tsv);
    setCopiedTSV(true);
    setTimeout(() => setCopiedTSV(false), 2000);
  };

  const getHeatmapColor = (pct: number) => {
    if (pct <= 0) {
      return {
        color: '#a1a1aa'
      };
    }
    const normalized = Math.min(1, pct / 100);
    const alpha = 0.12 + normalized * 0.58;
    return {
      backgroundColor: `rgba(16, 185, 129, ${alpha})`,
      color: normalized > 0.35 ? '#047857' : undefined,
      fontWeight: normalized > 0.05 ? '600' : 'normal'
    };
  };

  const filteredTargets = useMemo(() => {
    if (!filterSearch.trim()) return customTargetOrder;
    return customTargetOrder.filter((name) =>
      name.toLowerCase().includes(filterSearch.toLowerCase())
    );
  }, [customTargetOrder, filterSearch]);

  const filteredSources = useMemo(() => {
    if (!filterSearch.trim()) return customSourceOrder;
    return customSourceOrder.filter((name) =>
      name.toLowerCase().includes(filterSearch.toLowerCase())
    );
  }, [customSourceOrder, filterSearch]);

  return (
    <div className="space-y-4 animate-in fade-in duration-200 font-mono">
      {/* Top Proportional Controls Bar */}
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Action Trigger & Status */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={!targets.length || !sources.length || isCalculating}
              className="px-5 py-2 rounded-xl bg-black dark:bg-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-black font-bold font-mono text-xs shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isCalculating ? t('vahaduo.processing', 'PROCESANDO...') : 'RUN MULTI'}</span>
            </button>

            <button
              onClick={handleClear}
              disabled={!result}
              className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 font-mono text-xs border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              title={t('vahaduo.clearResults', 'Limpiar resultados')}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t('vahaduo.clear', 'CLEAR')}</span>
            </button>

            {/* Reorder Samples Manager Toggle Button */}
            <button
              onClick={() => setShowOrderManager(!showOrderManager)}
              className={`px-3.5 py-2 rounded-xl border font-mono text-xs flex items-center gap-2 transition-all cursor-pointer ${
                showOrderManager
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black border-transparent shadow-xs font-bold'
                  : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 border-neutral-200 dark:border-neutral-700'
              }`}
              title={t('vahaduo.reorderTooltip', 'Reordenar muestras y poblaciones manualmente o por orden alfabético')}
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-blue-500" />
              <span>{t('vahaduo.reorderSamples', 'Ordenar Muestras (Drag & Drop)')}</span>
            </button>
          </div>

          {/* Graphical View Selectors in Multi */}
          <div className="flex flex-wrap items-center gap-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs">
            <button
              onClick={() => setMultiView('TABLE')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                multiView === 'TABLE'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>{t('vahaduo.matrix', 'Matriz')}</span>
            </button>

            <button
              onClick={() => setMultiView('QPADM_BARS')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                multiView === 'QPADM_BARS'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
              title={t('vahaduo.g25BarsTooltip', 'Gráfica de Barras G25 con Intervalos de Error Estándar (±SE) y valores Z')}
            >
              <BarChart2 className="w-3.5 h-3.5 text-amber-500" />
              <span>{t('vahaduo.g25Bars', 'Barras G25 (±SE)')}</span>
            </button>

            <button
              onClick={() => setMultiView('STACKED_BAR')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                multiView === 'STACKED_BAR'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{t('vahaduo.stackedBar', 'Barras Apiladas')}</span>
            </button>

            <button
              onClick={() => setMultiView('BAR_AVG')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                multiView === 'BAR_AVG'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>{t('vahaduo.averages', 'Promedios')}</span>
            </button>

            <button
              onClick={() => setMultiView('HISTOGRAM')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                multiView === 'HISTOGRAM'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <BarChart className="w-3.5 h-3.5" />
              <span>{t('vahaduo.histogram', 'Histograma')}</span>
            </button>

            <button
              onClick={() => setMultiView('FUNNEL')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${
                multiView === 'FUNNEL'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{t('vahaduo.funnel', 'Embudo')}</span>
            </button>
          </div>

          {/* Configuration options */}
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
              <span className="text-neutral-500 text-[11px]">{t('vahaduo.cycles', 'CYCLES')}:</span>
              <select
                value={cycles}
                onChange={(e) => setCycles(Number(e.target.value))}
                className="bg-transparent font-bold text-neutral-900 dark:text-white focus:outline-hidden cursor-pointer"
              >
                <option value={0.25} className="dark:bg-neutral-900">0.25X (Rápido)</option>
                <option value={0.5} className="dark:bg-neutral-900">0.50X</option>
                <option value={1.0} className="dark:bg-neutral-900">1.00X (Estándar)</option>
                <option value={2.0} className="dark:bg-neutral-900">2.00X (Preciso)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={reduce}
                onChange={(e) => setReduce(e.target.checked)}
                className="accent-black dark:accent-white w-3.5 h-3.5 rounded"
              />
              <span className="text-neutral-700 dark:text-neutral-300 text-[11px]">{t('vahaduo.reduce', 'REDUCE (<0.5% = 0)')}</span>
            </label>

            <label className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={aggregate}
                onChange={(e) => setAggregate(e.target.checked)}
                className="accent-black dark:accent-white w-3.5 h-3.5 rounded"
              />
              <span className="text-neutral-700 dark:text-neutral-300 text-[11px]">{t('vahaduo.aggregate', 'AGGREGATE')}</span>
            </label>

            <label className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 cursor-pointer">
              <input
                type="checkbox"
                checked={addDistCol}
                onChange={(e) => setAddDistCol(e.target.checked)}
                className="accent-black dark:accent-white w-3.5 h-3.5 rounded"
              />
              <span className="text-neutral-700 dark:text-neutral-300 text-[11px]">{t('vahaduo.addDistCol', 'ADD DIST COL')}</span>
            </label>

            {addDistCol && (
              <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                <span className="text-neutral-500 text-[11px]">SCALE:</span>
                <select
                  value={distColScale}
                  onChange={(e) => setDistColScale(Number(e.target.value))}
                  className="bg-transparent font-bold text-neutral-900 dark:text-white focus:outline-hidden cursor-pointer text-[11px]"
                >
                  <option value={0.25} className="dark:bg-neutral-900">x0.25</option>
                  <option value={0.5} className="dark:bg-neutral-900">x0.5</option>
                  <option value={1.0} className="dark:bg-neutral-900">x1</option>
                  <option value={2.0} className="dark:bg-neutral-900">x2</option>
                  <option value={4.0} className="dark:bg-neutral-900">x4</option>
                </select>
              </div>
            )}

            {multiView === 'TABLE' && (
              <button
                onClick={() => setIsDense(!isDense)}
                className="px-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-800 flex items-center gap-1.5 text-[11px] cursor-pointer"
                title="Alternar tamaño proporcional"
              >
                {isDense ? <Maximize2 className="w-3 h-3" /> : <Minimize2 className="w-3 h-3" />}
                <span>{isDense ? t('vahaduo.compact', 'COMPACTA') : t('vahaduo.expanded', 'EXPANDIDA')}</span>
              </button>
            )}
          </div>

          {/* Counts & Export actions */}
          <div className="flex items-center gap-2">
            <div className="text-[11px] font-mono text-neutral-500 hidden sm:block mr-2">
              <span>Targets: <strong className="text-neutral-900 dark:text-white">{targets.length}</strong></span>
              <span className="mx-1.5">·</span>
              <span>Sources: <strong className="text-neutral-900 dark:text-white">{sources.length}</strong></span>
            </div>

            {executionTime !== null && (
              <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700" title="Tiempo que ha tardado en generarse la gráfica">
                <Timer className="w-3 h-3 text-neutral-500" />
                <span>Tiempo: <strong className="text-neutral-900 dark:text-white">{executionTime < 1000 ? `${executionTime.toFixed(1)} ms` : `${(executionTime / 1000).toFixed(2)} s`}</strong></span>
              </div>
            )}

            {result && (
              <>
                <button
                  onClick={handleResetSorting}
                  className="px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 cursor-pointer transition-colors"
                  title={t('vahaduo.resetOrder', 'Restablecer orden inicial')}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden md:inline">RESET</span>
                </button>

                <button
                  onClick={handleCopyCSV}
                  className="px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedCSV ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>CSV</span>
                </button>

                <button
                  onClick={handleCopyTSV}
                  className="px-2.5 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-lg text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {copiedTSV ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  <span>TSV</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 🛠️ SAMPLES & POPULATIONS DRAG-AND-DROP REORDERING MANAGER DRAWER */}
        {showOrderManager && (
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOrderTab('TARGETS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    orderTab === 'TARGETS'
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {t('vahaduo.targetSamples', 'Muestras TARGET')} ({customTargetOrder.length})
                </button>

                <button
                  onClick={() => setOrderTab('SOURCES')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    orderTab === 'SOURCES'
                      ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                      : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                  }`}
                >
                  {t('vahaduo.sourcePopulations', 'Poblaciones SOURCE')} ({customSourceOrder.length})
                </button>
              </div>

              {/* Quick sorting buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {orderTab === 'TARGETS' ? (
                  <>
                    <button
                      onClick={sortTargetsAZ}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[11px] flex items-center gap-1 cursor-pointer"
                      title="Ordenar alfabéticamente A-Z"
                    >
                      <ArrowDownAZ className="w-3 h-3 text-blue-500" />
                      <span>A-Z</span>
                    </button>
                    <button
                      onClick={sortTargetsZA}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[11px] flex items-center gap-1 cursor-pointer"
                      title="Ordenar alfabéticamente Z-A"
                    >
                      <ArrowUpAZ className="w-3 h-3 text-blue-500" />
                      <span>Z-A</span>
                    </button>
                    {result && (
                      <>
                        <button
                          onClick={sortTargetsByDistanceAsc}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Menor distancia primero"
                        >
                          <span className="text-emerald-500 font-bold">d↓</span>
                          <span>{t('vahaduo.distMin', 'Menor Dist')}</span>
                        </button>
                        <button
                          onClick={sortTargetsByDistanceDesc}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Mayor distancia primero"
                        >
                          <span className="text-amber-500 font-bold">d↑</span>
                          <span>{t('vahaduo.distMax', 'Mayor Dist')}</span>
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <button
                      onClick={sortSourcesAZ}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[11px] flex items-center gap-1 cursor-pointer"
                      title="Ordenar alfabéticamente A-Z"
                    >
                      <ArrowDownAZ className="w-3 h-3 text-blue-500" />
                      <span>A-Z</span>
                    </button>
                    <button
                      onClick={sortSourcesZA}
                      className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[11px] flex items-center gap-1 cursor-pointer"
                      title="Ordenar alfabéticamente Z-A"
                    >
                      <ArrowUpAZ className="w-3 h-3 text-blue-500" />
                      <span>Z-A</span>
                    </button>
                    {result && (
                      <>
                        <button
                          onClick={sortSourcesByContributionDesc}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Mayor aporte promedio primero"
                        >
                          <span className="text-emerald-500 font-bold">%↓</span>
                          <span>{t('vahaduo.contribMax', 'Mayor %')}</span>
                        </button>
                        <button
                          onClick={sortSourcesByContributionAsc}
                          className="px-2.5 py-1 rounded-lg bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-[11px] flex items-center gap-1 cursor-pointer"
                          title="Menor aporte promedio primero"
                        >
                          <span className="text-amber-500 font-bold">%↑</span>
                          <span>{t('vahaduo.contribMin', 'Menor %')}</span>
                        </button>
                      </>
                    )}
                  </>
                )}

                <button
                  onClick={() => setShowOrderManager(false)}
                  className="p-1 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer ml-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Instruction and Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1">
              <span className="text-[11px] text-neutral-500">
                {t('vahaduo.dragInstructions', '💡 Arrastra cualquier elemento con el ratón o usa las flechas (↑ / ↓) para fijar el orden exacto deseado.')}
              </span>
              <div className="relative w-full sm:w-60">
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t('vahaduo.filterList', 'Filtrar lista...')}
                  value={filterSearch}
                  onChange={(e) => setFilterSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Draggable Items Grid / List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1 custom-scrollbar">
              {orderTab === 'TARGETS' ? (
                filteredTargets.map((name) => {
                  const originalIdx = customTargetOrder.indexOf(name);
                  const matchingRow = result?.matrix.find((r) => r.targetName === name);

                  return (
                    <div
                      key={name}
                      draggable
                      onDragStart={() => setDraggedTargetIdx(originalIdx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedTargetIdx !== null && draggedTargetIdx !== originalIdx) {
                          moveTarget(draggedTargetIdx, originalIdx);
                          setDraggedTargetIdx(null);
                        }
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border text-xs cursor-grab active:cursor-grabbing transition-all select-none group ${
                        draggedTargetIdx === originalIdx
                          ? 'border-blue-500 ring-2 ring-blue-500/20 opacity-70'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-1">
                        <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 shrink-0" />
                        <span className="text-[10px] font-bold text-neutral-400 min-w-[18px]">
                          #{originalIdx + 1}
                        </span>
                        <span className="font-semibold text-neutral-900 dark:text-white truncate" title={name}>
                          {name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {matchingRow && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold mr-1">
                            d={(matchingRow.distance * 100).toFixed(2)}%
                          </span>
                        )}
                        <button
                          onClick={() => moveTarget(originalIdx, originalIdx - 1)}
                          disabled={originalIdx === 0}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded disabled:opacity-20 cursor-pointer"
                          title="Subir"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveTarget(originalIdx, originalIdx + 1)}
                          disabled={originalIdx === customTargetOrder.length - 1}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded disabled:opacity-20 cursor-pointer"
                          title="Bajar"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                filteredSources.map((name) => {
                  const originalIdx = customSourceOrder.indexOf(name);
                  const color = getSourceColor(name, originalIdx);
                  const avgStat = cohortStats?.sourceAverages.find((s) => s.sourceName === name);

                  return (
                    <div
                      key={name}
                      draggable
                      onDragStart={() => setDraggedSourceIdx(originalIdx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => {
                        if (draggedSourceIdx !== null && draggedSourceIdx !== originalIdx) {
                          moveSource(draggedSourceIdx, originalIdx);
                          setDraggedSourceIdx(null);
                        }
                      }}
                      className={`flex items-center justify-between p-2 rounded-xl bg-white dark:bg-neutral-900 border text-xs cursor-grab active:cursor-grabbing transition-all select-none group ${
                        draggedSourceIdx === originalIdx
                          ? 'border-blue-500 ring-2 ring-blue-500/20 opacity-70'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate pr-1">
                        <GripVertical className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 shrink-0" />
                        <span
                          className="w-3 h-3 rounded-xs shrink-0 shadow-2xs"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-semibold text-neutral-900 dark:text-white truncate" title={name}>
                          {name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        {avgStat && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold mr-1">
                            {avgStat.percentage.toFixed(1)}%
                          </span>
                        )}
                        <button
                          onClick={() => moveSource(originalIdx, originalIdx - 1)}
                          disabled={originalIdx === 0}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded disabled:opacity-20 cursor-pointer"
                          title="Mover a la izquierda / arriba"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveSource(originalIdx, originalIdx + 1)}
                          disabled={originalIdx === customSourceOrder.length - 1}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded disabled:opacity-20 cursor-pointer"
                          title="Mover a la derecha / abajo"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Results Views */}
      {result && synchronizedResult ? (
        <div className="space-y-4">
          {/* Top Status & Generation Timing Banner */}
          <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-xs font-mono">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white uppercase tracking-wider">
                {multiView === 'TABLE' && 'Matriz Multi (NNLS 25D)'}
                {multiView === 'QPADM_BARS' && 'Gráfica de Barras Desglosadas (qpadm style)'}
                {multiView === 'STACKED_BAR' && 'Gráfica de Barras Apiladas (100%)'}
                {multiView === 'BAR_AVG' && 'Promedio de la Cohorte Multi'}
                {multiView === 'HISTOGRAM' && 'Histograma de Distancias de Ajuste'}
                {multiView === 'FUNNEL' && 'Embudo de Distribución de Distancias'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                {result.matrix.length} muestras
              </span>
            </div>

            {executionTime !== null && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 text-xs font-mono" title="Tiempo que ha tardado en generarse la gráfica desde que se pulsó RUN">
                <Timer className="w-3.5 h-3.5 text-neutral-500" />
                <span>Tiempo de generación: <strong className="text-neutral-900 dark:text-white">{executionTime < 1000 ? `${executionTime.toFixed(1)} ms` : `${(executionTime / 1000).toFixed(2)} s`}</strong></span>
              </div>
            )}
          </div>

          {/* 1. TABLE MATRIX VIEW: Optimized horizontal proportions & perfectly aligned non-clipping source headers */}
          {multiView === 'TABLE' && (
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
              <div className="overflow-x-auto max-h-[700px] custom-scrollbar">
                <table className="w-full text-left font-mono border-collapse select-text">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                      {/* Sticky Target Column */}
                      <th
                        onClick={() => {
                          setSortCol('__target__');
                          setSortAsc(sortCol === '__target__' ? !sortAsc : true);
                        }}
                        className="py-2.5 px-3 sticky left-0 bg-neutral-50 dark:bg-neutral-950 z-30 font-bold text-neutral-900 dark:text-white cursor-pointer hover:text-black dark:hover:text-white whitespace-nowrap border-r border-neutral-200 dark:border-neutral-800 text-xs min-w-[160px] max-w-[220px]"
                      >
                        <div className="flex items-center justify-between">
                          <span>Target Sample</span>
                          <span className="text-[10px]">{sortCol === '__target__' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                        </div>
                      </th>

                      {/* Distance Column */}
                      <th
                        onClick={() => {
                          setSortCol('__distance__');
                          setSortAsc(sortCol === '__distance__' ? !sortAsc : true);
                        }}
                        className="py-2.5 px-2 text-right font-bold text-neutral-900 dark:text-white cursor-pointer whitespace-nowrap border-r border-neutral-200 dark:border-neutral-800 text-xs min-w-[70px]"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Dist%</span>
                          <span className="text-[10px]">{sortCol === '__distance__' ? (sortAsc ? '▲' : '▼') : '↕'}</span>
                        </div>
                      </th>

                      {/* Clean Angled Source Headers: Fixed container with overflow protection */}
                      {effectiveSourceNames.map((sName) => (
                        <th
                          key={sName}
                          onClick={() => {
                            setSortCol(sName);
                            setSortAsc(sortCol === sName ? !sortAsc : false);
                          }}
                          className="p-0 text-center cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-850 transition-colors border-r border-neutral-200 dark:border-neutral-800 min-w-[40px] max-w-[75px]"
                          title={`Ordenar por fuente: ${sName}`}
                        >
                          <div className="h-32 w-full relative flex items-end justify-center pb-2.5 overflow-hidden">
                            <div className="transform -rotate-55 origin-bottom-left translate-x-3.5 text-[11px] font-semibold text-neutral-800 dark:text-neutral-200 whitespace-nowrap truncate max-w-[130px] select-none flex items-center gap-1">
                              <span
                                className="w-2 h-2 rounded-full inline-block shrink-0"
                                style={{ backgroundColor: getSourceColor(sName) }}
                              />
                              {sName}
                            </div>
                          </div>
                          <div className="py-0.5 border-t border-neutral-200 dark:border-neutral-800 text-[10px] text-neutral-400 bg-neutral-100/60 dark:bg-neutral-900/60">
                            {sortCol === sName ? (sortAsc ? '▲' : '▼') : '·'}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 text-xs">
                    {sortedMatrix.map((row) => (
                      <tr
                        key={row.targetName}
                        className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                      >
                        {/* Sticky Target Cell */}
                        <td
                          className={`px-3 sticky left-0 bg-white dark:bg-neutral-900 font-semibold text-neutral-900 dark:text-white whitespace-nowrap border-r border-neutral-200 dark:border-neutral-800 z-20 truncate max-w-[220px] ${
                            isDense ? 'py-1 text-[11px]' : 'py-2 text-xs'
                          }`}
                        >
                          {row.targetName}
                        </td>

                        {/* Distance Cell */}
                        <td
                          className={`px-2 text-right font-mono font-bold text-neutral-900 dark:text-white border-r border-neutral-200 dark:border-neutral-800 whitespace-nowrap ${
                            isDense ? 'py-1 text-[11px]' : 'py-2 text-xs'
                          }`}
                        >
                          {(row.distance * 100).toFixed(2)}
                        </td>

                        {/* Values Heatmap Cells */}
                        {effectiveSourceNames.map((sName) => {
                          const val = row.values[sName] || 0.0;
                          return (
                            <td
                              key={sName}
                              style={getHeatmapColor(val)}
                              className={`px-1 text-center font-mono border-r border-neutral-100 dark:border-neutral-800/40 whitespace-nowrap ${
                                isDense ? 'py-1 text-[11px]' : 'py-2 text-xs'
                              }`}
                            >
                              {val > 0 ? val.toFixed(1) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 2. G25 GROUPED BAR CHART WITH ERROR BARS (±SE) AND Z-SCORES */}
          {multiView === 'QPADM_BARS' && (
            <VahaduoQpadmBarChart
              matrix={sortedMatrix}
              sourceNames={effectiveSourceNames}
              customColors={sourceColorMap}
            />
          )}

          {/* 3. STACKED BAR CHART VIEW */}
          {multiView === 'STACKED_BAR' && (
            <VahaduoStackedBarChart
              result={synchronizedResult}
              customColors={sourceColorMap}
            />
          )}

          {/* 4. COHORT AVERAGE BARS */}
          {multiView === 'BAR_AVG' && cohortStats && (
            <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                    {t('vahaduo.cohortAvgTitle', 'PROMEDIO DE LA COHORTE MULTI')} ({cohortStats.totalTargets} {t('vahaduo.samplesCount', 'muestras')})
                  </span>
                  <h4 className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                    {t('vahaduo.sourceAvgContrib', 'Aporte Promedio de Poblaciones Fuente')}
                  </h4>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                  {t('vahaduo.avgDistance', 'Distancia Media')}: {(cohortStats.avgDistance * 100).toFixed(4)}%
                </span>
              </div>

              <div className="space-y-3 font-mono">
                {cohortStats.sourceAverages.map((c) => (
                  <div key={c.sourceName} className="space-y-1 group">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span
                          className="w-3 h-3 rounded-xs shrink-0 shadow-2xs"
                          style={{ backgroundColor: c.color }}
                        />
                        <span className="font-semibold text-neutral-900 dark:text-white truncate">
                          {c.sourceName}
                        </span>
                      </div>
                      <strong className="text-sm text-neutral-900 dark:text-white min-w-[54px] text-right">
                        {c.percentage.toFixed(2)}%
                      </strong>
                    </div>

                    <div className="w-full h-4 bg-neutral-100 dark:bg-neutral-950 rounded-lg overflow-hidden flex border border-neutral-200/60 dark:border-neutral-800/80 shadow-inner">
                      <div
                        className="h-full rounded-md transition-all duration-500 ease-out group-hover:brightness-110"
                        style={{
                          width: `${Math.max(c.percentage, 2)}%`,
                          backgroundColor: c.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. COHORT DISTANCE HISTOGRAM */}
          {multiView === 'HISTOGRAM' && cohortStats && (
            <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                    {t('vahaduo.distHistogramTitle', 'HISTOGRAMA DE DISTRIBUCIÓN DE DISTANCIAS (CALIDAD DE AJUSTE)')}
                  </span>
                  <h4 className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                    {t('vahaduo.multiCohort', 'Cohorte')} {cohortStats.totalTargets} {t('vahaduo.samplesCount', 'muestras')}
                  </h4>
                </div>
                <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700">
                  {t('vahaduo.avgDistance', 'Media')}: {(cohortStats.avgDistance * 100).toFixed(4)}%
                </span>
              </div>

              {/* Histogram Columns */}
              <div className="grid grid-cols-5 gap-2 sm:gap-4 items-end h-56 pt-6 pb-2 border-b border-neutral-200 dark:border-neutral-800">
                {cohortStats.distanceHistogram.map((b) => {
                  const maxCount = Math.max(...cohortStats.distanceHistogram.map((x) => x.count), 1);
                  const heightPct = (b.count / maxCount) * 100;

                  return (
                    <div key={b.label} className="flex flex-col items-center h-full justify-end group">
                      <div className="text-[11px] font-bold text-neutral-900 dark:text-white mb-1">
                        {b.count > 0 ? `${b.count} (${b.pctOfCohort.toFixed(0)}%)` : '-'}
                      </div>

                      <div className="w-full max-w-[64px] bg-neutral-100 dark:bg-neutral-950 rounded-t-xl overflow-hidden flex flex-col justify-end border border-b-0 border-neutral-200 dark:border-neutral-800 h-full p-1">
                        <div
                          className="w-full rounded-t-lg transition-all duration-500 flex flex-col justify-between items-center py-1 group-hover:brightness-110"
                          style={{
                            height: `${Math.max(heightPct, 6)}%`,
                            backgroundColor: b.color
                          }}
                        />
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

              {/* Sample list in each bucket */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
                {cohortStats.distanceHistogram
                  .filter((b) => b.count > 0)
                  .map((b) => (
                    <div
                      key={b.label}
                      className="p-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span style={{ color: b.color }}>{b.name} ({b.label})</span>
                        <span className="text-neutral-500 text-[11px]">{b.count} {t('vahaduo.samplesCount', 'muestras')}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[10px] max-h-24 overflow-y-auto">
                        {b.samples.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-0.5 rounded bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 6. COHORT GLOBAL FUNNEL */}
          {multiView === 'FUNNEL' && cohortStats && (
            <div className="p-5 sm:p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-6 shadow-xs font-mono">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                    {t('vahaduo.funnelTitle', 'EMBUDO ANCESTRAL GLOBAL DE LA COHORTE')}
                  </span>
                  <h4 className="text-sm font-bold font-mono text-neutral-900 dark:text-white">
                    {t('vahaduo.funnelHierarchy', 'Jerarquía de Aportes Promedio')} ({cohortStats.sourceAverages.length} {t('vahaduo.activeSources', 'fuentes activas')})
                  </h4>
                </div>
              </div>

              <div className="space-y-2.5 max-w-xl mx-auto py-2">
                {cohortStats.sourceAverages.map((c, idx) => {
                  const maxLevelWidth = 100;
                  const minLevelWidth = 28;
                  const levelWidth = Math.max(
                    minLevelWidth,
                    maxLevelWidth - idx * (70 / Math.max(cohortStats.sourceAverages.length, 1))
                  );

                  return (
                    <div key={c.sourceName} className="flex flex-col items-center group">
                      <div
                        className="transition-all duration-300 rounded-xl p-3 text-white flex items-center justify-between shadow-md relative overflow-hidden group-hover:scale-[1.02]"
                        style={{
                          width: `${levelWidth}%`,
                          backgroundColor: c.color
                        }}
                      >
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center p-8 space-y-3">
          <Table className="w-10 h-10 text-neutral-400 dark:text-neutral-600" />
          <h4 className="text-sm font-mono font-bold text-neutral-800 dark:text-neutral-200">
            {t('vahaduo.matrixPlaceholderTitle', 'Matriz Heatmap y Gráficas Multi-Target')}
          </h4>
          <p className="text-xs font-mono text-neutral-500 max-w-md">
            {t('vahaduo.matrixPlaceholderDesc', 'Haz clic en RUN MULTI para calcular la descomposición de todas tus muestras TARGET frente a SOURCE simultáneamente con vistas en Matriz, Barras Apiladas, Histograma o Embudo.')}
          </p>
        </div>
      )}
    </div>
  );
}
