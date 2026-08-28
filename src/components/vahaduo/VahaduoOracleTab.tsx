import React, { useState, useEffect } from 'react';
import { G25Sample, OracleResult, DistanceGradientThresholds, DEFAULT_GRADIENT_THRESHOLDS } from '../../types/vahaduo';
import { solveG25OracleNWay, getVahaduoDistanceBadgeStyle } from '../../utils/vahaduoMath';
import { Play, Trash2, Copy, Check, Sparkles, Lock, Layers } from 'lucide-react';
import { DistanceGradientRegulator } from './DistanceGradientRegulator';

interface VahaduoOracleTabProps {
  targets: G25Sample[];
  sources: G25Sample[];
  gradientThresholds?: DistanceGradientThresholds;
  onGradientThresholdsChange?: (thresholds: DistanceGradientThresholds) => void;
}

export function VahaduoOracleTab({
  targets,
  sources,
  gradientThresholds = DEFAULT_GRADIENT_THRESHOLDS,
  onGradientThresholdsChange
}: VahaduoOracleTabProps) {
  const [nWay, setNWay] = useState<number>(2);
  const [selectedTargetIdx, setSelectedTargetIdx] = useState<number>(0);
  const [iterationMode, setIterationMode] = useState<boolean>(false);
  const [maxOutput, setMaxOutput] = useState<number>(25);
  const [addGradient, setAddGradient] = useState<boolean>(true);
  const [results, setResults] = useState<OracleResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Fixed Source Pop feature state
  const [fixedSourcePop, setFixedSourcePop] = useState<boolean>(false);
  const [fixedSourceName, setFixedSourceName] = useState<string>('');
  const [fixedMinPct, setFixedMinPct] = useState<number>(10);
  const [fixedMaxPct, setFixedMaxPct] = useState<number>(60);

  // Default fixed source name when sources load
  useEffect(() => {
    if (sources.length > 0 && (!fixedSourceName || !sources.some((s) => s.name === fixedSourceName))) {
      setFixedSourceName(sources[0].name);
    }
  }, [sources, fixedSourceName]);

  const handleRun = () => {
    if (!targets.length || !sources.length) return;
    setIsCalculating(true);

    const target = targets[selectedTargetIdx] || targets[0];
    setTimeout(() => {
      try {
        const res = solveG25OracleNWay(target, sources, nWay, {
          maxOutput,
          iterationMode,
          fixedSourcePop,
          fixedSourceName: fixedSourcePop ? fixedSourceName : undefined,
          fixedMinPct: fixedSourcePop ? fixedMinPct : undefined,
          fixedMaxPct: fixedSourcePop ? fixedMaxPct : undefined
        });
        setResults(res);
      } catch (err) {
        console.error('Error running Oracle:', err);
      } finally {
        setIsCalculating(false);
      }
    }, 40);
  };

  const handleClear = () => {
    setResults(null);
  };

  const handleCopy = () => {
    if (!results) return;
    let tsv = `Oracle ${nWay}-Way for Target: ${results.targetName}\nRank\tDistance\tComponents\n`;
    results.entries.forEach((e, idx) => {
      tsv += `${idx + 1}\t${(e.distance * 100).toFixed(4)}\t${e.label}\n`;
    });
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Distance Gradient Range Regulator */}
      {onGradientThresholdsChange && (
        <DistanceGradientRegulator
          thresholds={gradientThresholds}
          onChange={onGradientThresholdsChange}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar Controls */}
        <div className="lg:col-span-1 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-xs">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
            <span className="text-xs font-mono uppercase font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-neutral-500" />
              Controles Oracle
            </span>
            <button
              onClick={handleClear}
              className="text-[10px] font-mono text-neutral-500 hover:text-red-500 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3 h-3" /> CLEAR
            </button>
          </div>

          {/* Action Run Button */}
          <button
            onClick={handleRun}
            disabled={!targets.length || !sources.length || isCalculating}
            className="w-full py-2.5 rounded-xl bg-black dark:bg-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-black font-bold font-mono text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isCalculating ? 'CALCULANDO...' : 'RUN ORACLE'}</span>
          </button>

          {/* Target Sample Selector */}
          {targets.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                TARGET SAMPLE
              </label>
              <select
                value={selectedTargetIdx}
                onChange={(e) => setSelectedTargetIdx(Number(e.target.value))}
                className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-neutral-100 focus:border-neutral-900 dark:focus:border-white focus:outline-hidden"
              >
                {targets.map((t, idx) => (
                  <option key={idx} value={idx}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* N-Way Mode Selector (2-Way up to 10-Way) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
              <span>COMBINACIÓN N-WAY</span>
              <span className="text-neutral-900 dark:text-white font-bold">{nWay}-Way</span>
            </div>
            <select
              value={nWay}
              onChange={(e) => setNWay(Number(e.target.value))}
              className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-neutral-100 font-bold focus:border-neutral-900 dark:focus:border-white focus:outline-hidden"
            >
              <option value={1}>1-Way (1 sola población / Distancia directa)</option>
              <option value={2}>2-Way (Pares de 2 poblaciones)</option>
              <option value={3}>3-Way (Tríos de 3 poblaciones)</option>
              <option value={4}>4-Way (4 poblaciones)</option>
              <option value={5}>5-Way (5 poblaciones)</option>
              <option value={6}>6-Way (6 poblaciones)</option>
              <option value={7}>7-Way (7 poblaciones)</option>
              <option value={8}>8-Way (8 poblaciones)</option>
              <option value={9}>9-Way (9 poblaciones)</option>
              <option value={10}>10-Way (10 poblaciones)</option>
            </select>
          </div>

          {/* Fixed Source Population Feature */}
          <div className="space-y-3 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-bold text-neutral-800 dark:text-neutral-200 cursor-pointer">
                <Lock className="w-3.5 h-3.5 text-neutral-500" />
                <span>Fixed Source Pop</span>
              </label>
              <button
                type="button"
                onClick={() => setFixedSourcePop(!fixedSourcePop)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  fixedSourcePop ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white dark:bg-black shadow-lg ring-0 transition duration-200 ease-in-out ${
                    fixedSourcePop ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {fixedSourcePop && (
              <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <span className="text-[10px] text-neutral-500 uppercase font-semibold">Fuente Obligatoria:</span>
                  <select
                    value={fixedSourceName}
                    onChange={(e) => setFixedSourceName(e.target.value)}
                    className="w-full p-1.5 bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded-lg text-xs font-mono text-neutral-900 dark:text-neutral-100"
                  >
                    {sources.map((s, idx) => (
                      <option key={idx} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
                    <span>Rango de % Permitido:</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {fixedMinPct}% - {fixedMaxPct}%
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400 w-8">Mín:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={fixedMinPct}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFixedMinPct(val);
                          if (val > fixedMaxPct) setFixedMaxPct(val);
                        }}
                        className="w-full accent-neutral-900 dark:accent-white h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[11px] font-bold w-9 text-right">{fixedMinPct}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-neutral-400 w-8">Máx:</span>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        value={fixedMaxPct}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFixedMaxPct(val);
                          if (val < fixedMinPct) setFixedMinPct(val);
                        }}
                        className="w-full accent-neutral-900 dark:accent-white h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-[11px] font-bold w-9 text-right">{fixedMaxPct}%</span>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-500 italic">
                  Fuerza a la calculadora a incluir <strong>{fixedSourceName}</strong> con un porcentaje entre {fixedMinPct}% y {fixedMaxPct}%.
                </p>
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center justify-between">
              <span title="Modo discreto con proporciones fijas en lugar de continuo">ITERATION MODE (DISCRETO)</span>
              <input
                type="checkbox"
                checked={iterationMode}
                onChange={(e) => setIterationMode(e.target.checked)}
                className="accent-neutral-900 dark:accent-white w-4 h-4 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <span>GRADIENTE DE COLOR</span>
              <input
                type="checkbox"
                checked={addGradient}
                onChange={(e) => setAddGradient(e.target.checked)}
                className="accent-neutral-900 dark:accent-white w-4 h-4 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Max Output */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
              <span>MAX RESULTADOS</span>
              <span className="text-neutral-900 dark:text-white font-bold">{maxOutput}</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={maxOutput}
              onChange={(e) => setMaxOutput(Number(e.target.value))}
              className="w-full accent-neutral-900 dark:accent-white bg-neutral-200 dark:bg-neutral-700 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Main Results Table Area */}
        <div className="lg:col-span-3 space-y-4">
          {results ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-neutral-900 dark:text-white font-bold flex items-center gap-2">
                  <span>Resultados Oracle {nWay}-Way · Objetivo: <strong>{results.targetName}</strong></span>
                  {fixedSourcePop && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                      Fijo: {fixedSourceName} ({fixedMinPct}% - {fixedMaxPct}%)
                    </span>
                  )}
                </span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar Resultados</span>
                </button>
              </div>

              <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                        <th className="py-2.5 px-3 w-12 text-center">#</th>
                        <th className="py-2.5 px-4 w-32 text-center">Distancia</th>
                        <th className="py-2.5 px-4">Combinación de Mezcla Óptima ({nWay} Poblaciones)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                      {results.entries.map((entry, idx) => {
                        const badgeStyle = addGradient ? getVahaduoDistanceBadgeStyle(entry.distance, gradientThresholds) : null;
                        return (
                          <tr
                            key={idx}
                            className="transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-850/50"
                          >
                            <td className="py-2.5 px-3 text-center text-neutral-400 font-bold">
                              {idx + 1}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {badgeStyle ? (
                                <span
                                  style={{
                                    backgroundColor: badgeStyle.backgroundColor,
                                    color: badgeStyle.color
                                  }}
                                  className="inline-block px-2 py-0.5 font-mono font-bold text-[11px] rounded-xs shadow-xs"
                                >
                                  {(entry.distance * 100).toFixed(4)}%
                                </span>
                              ) : (
                                <span className="font-bold text-neutral-900 dark:text-white">
                                  {(entry.distance * 100).toFixed(4)}%
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-neutral-800 dark:text-neutral-200">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {entry.components.map((comp, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] ${
                                      fixedSourcePop && comp.sourceName === fixedSourceName
                                        ? 'bg-neutral-200 dark:bg-neutral-800 border-neutral-400 dark:border-neutral-600 font-bold'
                                        : 'bg-neutral-100 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800'
                                    }`}
                                  >
                                    <strong className="text-neutral-900 dark:text-white mr-1.5">{comp.percentage.toFixed(2)}%</strong>
                                    <span className="text-neutral-700 dark:text-neutral-300">{comp.sourceName}</span>
                                  </span>
                                ))}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {results.entries.length === 0 && (
                        <tr>
                          <td colSpan={3} className="text-center py-12 text-neutral-500">
                            No se encontraron combinaciones válidas para {nWay}-Way con las fuentes y filtros actuales.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center p-8 space-y-3">
              <Sparkles className="w-10 h-10 text-neutral-400 dark:text-neutral-600" />
              <h4 className="text-sm font-mono font-bold text-neutral-800 dark:text-neutral-200">
                Listo para modelar Oracle {nWay}-Way
              </h4>
              <p className="text-xs font-mono text-neutral-500 max-w-sm">
                Selecciona el modo desde <strong>2-Way hasta 10-Way</strong>, ajusta si deseas <strong>Fixed Source Pop</strong> y haz clic en <strong>RUN ORACLE</strong>.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
