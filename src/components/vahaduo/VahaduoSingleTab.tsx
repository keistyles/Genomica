import React, { useState, useMemo, useRef } from 'react';
import { G25Sample, SingleModelResult } from '../../types/vahaduo';
import { solveG25AdmixtureNNLS } from '../../utils/vahaduoMath';
import { VahaduoPieChart } from './VahaduoPieChart';
import { VahaduoBarChart } from './charts/VahaduoBarChart';
import { VahaduoFunnelChart } from './charts/VahaduoFunnelChart';
import { VahaduoHistogramChart } from './charts/VahaduoHistogramChart';
import { toPng, toBlob } from 'html-to-image';
import {
  Play,
  Trash2,
  Copy,
  Check,
  BarChart2,
  PieChart as PieIcon,
  Filter,
  BarChart,
  Sliders,
  Palette,
  Image as ImageIcon,
  Download,
  Loader2,
  Timer
} from 'lucide-react';

interface VahaduoSingleTabProps {
  targets: G25Sample[];
  sources: G25Sample[];
  customColors: Record<string, string>;
  onColorChange: (sourceName: string, color: string) => void;
}

export function VahaduoSingleTab({
  targets,
  sources,
  customColors,
  onColorChange
}: VahaduoSingleTabProps) {
  const [selectedTargetIdx, setSelectedTargetIdx] = useState<number>(0);
  const [cycles, setCycles] = useState<number>(1.0);
  const [reduce, setReduce] = useState<boolean>(true);
  const [addDistCol, setAddDistCol] = useState<boolean>(true);
  const [distColScale, setDistColScale] = useState<number>(1.0);
  const [printZeroes, setPrintZeroes] = useState<boolean>(false);
  const [aggregate, setAggregate] = useState<boolean>(false);
  const [chartView, setChartView] = useState<'PIE' | 'BAR' | 'FUNNEL' | 'HISTOGRAM'>('PIE');
  const [result, setResult] = useState<SingleModelResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedImage, setCopiedImage] = useState<boolean>(false);
  const [downloadedImage, setDownloadedImage] = useState<boolean>(false);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const resultCaptureRef = useRef<HTMLDivElement | null>(null);

  // Merge custom colors into sources
  const activeSources = useMemo(() => {
    return sources.map((s) => ({
      ...s,
      color: customColors[s.name] || s.color
    }));
  }, [sources, customColors]);

  const handleRun = () => {
    if (!targets.length || !sources.length) return;
    const t0 = performance.now();
    const target = targets[selectedTargetIdx] || targets[0];
    const computed = solveG25AdmixtureNNLS(target, activeSources, {
      cycles,
      reduce,
      addDistCol,
      distColScale,
      printZeroes,
      aggregate
    });
    const t1 = performance.now();
    setResult(computed);
    setExecutionTime(Math.max(0.1, t1 - t0));
  };

  const handleClear = () => {
    setResult(null);
    setExecutionTime(null);
  };

  // Re-map colors in active result if customColors changes
  const enrichedResult = useMemo(() => {
    if (!result) return null;
    return {
      ...result,
      components: result.components.map((c) => ({
        ...c,
        color: customColors[c.sourceName] || c.color
      }))
    };
  }, [result, customColors]);

  const handleCopy = () => {
    if (!enrichedResult) return;
    let tsv = `Target: ${enrichedResult.targetName}\nDistance: ${(enrichedResult.distance * 100).toFixed(4)}%\n\nSource\tPercentage\n`;
    enrichedResult.components.forEach((c) => {
      tsv += `${c.sourceName}\t${c.percentage.toFixed(2)}%\n`;
    });
    tsv += `Sum\t${enrichedResult.sum.toFixed(2)}%\n`;
    navigator.clipboard.writeText(tsv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyImage = async () => {
    if (!resultCaptureRef.current) return;
    setIsCapturing(true);
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const blob = await toBlob(resultCaptureRef.current, {
        pixelRatio: 2,
        backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
        cacheBust: true,
      });

      if (!blob) {
        throw new Error('Failed to generate blob');
      }

      if (navigator.clipboard && navigator.clipboard.write) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
        } catch {
          // Fallback to download if clipboard write fails in iframe
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `Vahaduo_Single_${enrichedResult?.targetName || 'Model'}.png`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
        }
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Vahaduo_Single_${enrichedResult?.targetName || 'Model'}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      }
    } catch (err) {
      console.error('Error copying image:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!resultCaptureRef.current) return;
    setIsCapturing(true);
    try {
      const isDark = document.documentElement.classList.contains('dark');
      const dataUrl = await toPng(resultCaptureRef.current, {
        pixelRatio: 2,
        backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
        cacheBust: true,
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `Vahaduo_Single_${enrichedResult?.targetName || 'Model'}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setDownloadedImage(true);
      setTimeout(() => setDownloadedImage(false), 2500);
    } catch (err) {
      console.error('Error downloading image:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 animate-in fade-in duration-200 font-mono">
      {/* Left Sidebar Controls */}
      <div className="lg:col-span-1 p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-5 shadow-xs">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <span className="text-xs font-mono uppercase font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-neutral-500" />
            Controles Single
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
          disabled={!targets.length || !sources.length}
          className="w-full py-2.5 rounded-xl bg-black dark:bg-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white dark:text-black font-bold font-mono text-xs shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>RUN ALL</span>
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

        {/* Chart View Switcher (Pie, Bar, Funnel, Histogram) */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>TIPO DE GRÁFICA</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-neutral-100 dark:bg-neutral-950 p-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setChartView('PIE')}
              className={`py-1.5 px-2 text-[11px] font-mono rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                chartView === 'PIE'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <PieIcon className="w-3 h-3" />
              <span>Tarta</span>
            </button>
            <button
              onClick={() => setChartView('BAR')}
              className={`py-1.5 px-2 text-[11px] font-mono rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                chartView === 'BAR'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-3 h-3" />
              <span>Barras</span>
            </button>
            <button
              onClick={() => setChartView('FUNNEL')}
              className={`py-1.5 px-2 text-[11px] font-mono rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                chartView === 'FUNNEL'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Filter className="w-3 h-3" />
              <span>Embudo</span>
            </button>
            <button
              onClick={() => setChartView('HISTOGRAM')}
              className={`py-1.5 px-2 text-[11px] font-mono rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                chartView === 'HISTOGRAM'
                  ? 'bg-black dark:bg-white text-white dark:text-black font-bold shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <BarChart className="w-3 h-3" />
              <span>Histograma</span>
            </button>
          </div>
        </div>

        {/* Optimization Cycles Multiplier */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            <span>CYCLES MULTIPLIER</span>
            <span className="text-neutral-900 dark:text-white font-bold">{cycles}X</span>
          </div>
          <select
            value={cycles}
            onChange={(e) => setCycles(Number(e.target.value))}
            className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-neutral-100"
          >
            <option value={0.25}>0.25X (Rápido)</option>
            <option value={0.5}>0.50X</option>
            <option value={1.0}>1.00X (Estándar)</option>
            <option value={2.0}>2.00X (Alta Precisión)</option>
            <option value={4.0}>4.00X (Ultra)</option>
          </select>
        </div>

        {/* Parameter Switches */}
        <div className="space-y-3 pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center justify-between">
            <span>REDUCE (Filtrar trazas &lt;0.5%)</span>
            <input
              type="checkbox"
              checked={reduce}
              onChange={(e) => setReduce(e.target.checked)}
              className="accent-neutral-900 dark:accent-white w-4 h-4 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>ADD DIST COL</span>
            <input
              type="checkbox"
              checked={addDistCol}
              onChange={(e) => setAddDistCol(e.target.checked)}
              className="accent-neutral-900 dark:accent-white w-4 h-4 rounded cursor-pointer"
            />
          </div>

          {addDistCol && (
            <div className="space-y-1 pl-3 border-l-2 border-neutral-300 dark:border-neutral-700 py-1">
              <div className="flex items-center justify-between text-[10px] text-neutral-500">
                <span>DIST COL SCALE</span>
                <span className="font-bold text-neutral-900 dark:text-white">x{distColScale}</span>
              </div>
              <select
                value={distColScale}
                onChange={(e) => setDistColScale(Number(e.target.value))}
                className="w-full p-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded text-[11px] font-mono text-neutral-900 dark:text-neutral-100"
              >
                <option value={0.25}>x0.25</option>
                <option value={0.5}>x0.5</option>
                <option value={1.0}>x1 (Estándar)</option>
                <option value={2.0}>x2</option>
                <option value={4.0}>x4</option>
              </select>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span>PRINT ZEROES</span>
            <input
              type="checkbox"
              checked={printZeroes}
              onChange={(e) => setPrintZeroes(e.target.checked)}
              className="accent-neutral-900 dark:accent-white w-4 h-4 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between">
            <span>AGGREGATE</span>
            <input
              type="checkbox"
              checked={aggregate}
              onChange={(e) => setAggregate(e.target.checked)}
              className="accent-neutral-900 dark:accent-white w-4 h-4 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Main Results Area */}
      <div className="lg:col-span-3 space-y-6">
        {enrichedResult ? (
          <div ref={resultCaptureRef} className="space-y-6 p-2 rounded-2xl">
            {/* Top Overview & Copy bar */}
            <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-4 shadow-xs">
              <div>
                <span className="text-[10px] font-mono uppercase text-neutral-500 block">
                  MODELO DE MEZCLA INDIVIDUAL (NNLS 25D)
                </span>
                <h3 className="text-sm font-bold font-mono text-neutral-900 dark:text-white flex flex-wrap items-center gap-2">
                  <span>Objetivo: <strong>{enrichedResult.targetName}</strong></span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-mono">
                    Distancia: {(enrichedResult.distance * 100).toFixed(4)}%
                  </span>
                  {executionTime !== null && (
                    <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 font-mono flex items-center gap-1.5" title="Tiempo que ha tardado en generarse la gráfica">
                      <Timer className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Tiempo: <strong className="text-neutral-900 dark:text-white">{executionTime < 1000 ? `${executionTime.toFixed(1)} ms` : `${(executionTime / 1000).toFixed(2)} s`}</strong></span>
                    </span>
                  )}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 mr-1">
                  Suma: <strong className="text-neutral-900 dark:text-white">{enrichedResult.sum.toFixed(2)}%</strong>
                </span>

                {/* Copiar Modelo (TSV) */}
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Copiar texto tabulado del modelo"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copiar modelo</span>
                </button>

                {/* Copiar Imagen */}
                <button
                  onClick={handleCopyImage}
                  disabled={isCapturing}
                  className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Copiar captura de imagen al portapapeles"
                >
                  {isCapturing ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : copiedImage ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <ImageIcon className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedImage ? '¡Imagen copiada!' : 'Copiar imagen'}</span>
                </button>

                {/* Descargar Imagen */}
                <button
                  onClick={handleDownloadImage}
                  disabled={isCapturing}
                  className="px-3 py-1.5 bg-black dark:bg-white hover:opacity-85 text-white dark:text-black rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  title="Descargar imagen PNG del modelo y gráfica"
                >
                  {downloadedImage ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400 dark:text-emerald-600" />
                  ) : (
                    <Download className="w-3.5 h-3.5" />
                  )}
                  <span>{downloadedImage ? '¡PNG Descargado!' : 'Descargar imagen'}</span>
                </button>
              </div>
            </div>

            {/* Selected Visual Chart Component */}
            {chartView === 'PIE' && (
              <VahaduoPieChart
                components={enrichedResult.components}
                targetName={enrichedResult.targetName}
                distance={enrichedResult.distance}
              />
            )}

            {chartView === 'BAR' && (
              <VahaduoBarChart
                components={enrichedResult.components}
                targetName={enrichedResult.targetName}
                distance={enrichedResult.distance}
              />
            )}

            {chartView === 'FUNNEL' && (
              <VahaduoFunnelChart
                components={enrichedResult.components}
                targetName={enrichedResult.targetName}
                distance={enrichedResult.distance}
              />
            )}

            {chartView === 'HISTOGRAM' && (
              <VahaduoHistogramChart
                components={enrichedResult.components}
                targetName={enrichedResult.targetName}
                distance={enrichedResult.distance}
              />
            )}

            {/* Detailed Table with Live Color Pickers and Exact Two-Decimal Output */}
            <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
              <div className="px-4 py-2.5 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-neutral-900 dark:text-white flex items-center gap-2">
                  <Palette className="w-3.5 h-3.5 text-neutral-500" />
                  TABLA DE PORCENTAJES Y SELECTOR DE COLOR POR FUENTE
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  Formato Exacto (,xx)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-600 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                      <th className="py-2 px-3 w-16 text-center">Color</th>
                      <th className="py-2 px-4">Población Fuente (Source)</th>
                      <th className="py-2 px-4 w-32 text-right">Porcentaje</th>
                      {addDistCol && (
                        <th className="py-2 px-4 w-36 text-right">
                          Dist. (x{distColScale})
                        </th>
                      )}
                      <th className="py-2 px-4 w-48">Barra de Aporte</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {enrichedResult.components.map((comp) => (
                      <tr key={comp.sourceName} className="hover:bg-neutral-50 dark:hover:bg-neutral-850/50 transition-colors">
                        {/* Interactive Color Picker per row */}
                        <td className="py-2 px-3 text-center">
                          <input
                            type="color"
                            value={comp.color || '#4f46e5'}
                            onChange={(e) => onColorChange(comp.sourceName, e.target.value)}
                            className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                            title={`Cambiar color para ${comp.sourceName}`}
                          />
                        </td>
                        <td className="py-2 px-4 font-medium text-neutral-900 dark:text-white truncate max-w-xs">
                          {comp.sourceName}
                        </td>
                        {/* Percentage strictly formatted with two decimal places */}
                        <td className="py-2 px-4 text-right font-bold text-neutral-900 dark:text-white">
                          {comp.percentage.toFixed(2)}%
                        </td>
                        {addDistCol && (
                          <td className="py-2 px-4 text-right text-neutral-500">
                            {comp.scaledDistance !== undefined
                              ? (comp.scaledDistance * 100).toFixed(4)
                              : comp.individualDistance !== undefined
                              ? (comp.individualDistance * 100).toFixed(4)
                              : '-'}
                          </td>
                        )}
                        <td className="py-2 px-4">
                          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${comp.percentage}%`,
                                backgroundColor: comp.color || '#4f46e5'
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}

                    {/* Summary Total Row */}
                    <tr className="bg-neutral-50 dark:bg-neutral-950 font-bold text-neutral-900 dark:text-white border-t-2 border-neutral-200 dark:border-neutral-700">
                      <td className="py-2.5 px-3 text-center">∑</td>
                      <td className="py-2.5 px-4 uppercase text-neutral-700 dark:text-neutral-300">Suma Total / Distancia Modelo</td>
                      <td className="py-2.5 px-4 text-right text-emerald-600 dark:text-emerald-400">
                        {enrichedResult.sum.toFixed(2)}%
                      </td>
                      {addDistCol && (
                        <td className="py-2.5 px-4 text-right text-neutral-900 dark:text-white">
                          {(enrichedResult.distance * 100).toFixed(4)}%
                        </td>
                      )}
                      <td className="py-2.5 px-4 text-[11px] text-neutral-500">
                        Ajuste Exacto 100.00%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center p-8 space-y-3">
            <Sliders className="w-10 h-10 text-neutral-400 dark:text-neutral-600" />
            <h4 className="text-sm font-mono font-bold text-neutral-800 dark:text-neutral-200">
              Listo para modelar Admixture Individual (SINGLE)
            </h4>
            <p className="text-xs font-mono text-neutral-500 max-w-sm">
              Haz clic en <strong>RUN ALL</strong> para ejecutar la optimización de mínimos cuadrados no negativos (NNLS) y visualizar el gráfico circular, barras, embudo o histograma.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
