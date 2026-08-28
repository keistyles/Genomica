import React, { useMemo } from 'react';
import { parseG25Coordinates, DEFAULT_TARGET_COORDS, aggregateG25RawText } from '../../utils/vahaduoMath';
import { Target, CheckCircle, AlertCircle, Trash2, RotateCcw, Combine } from 'lucide-react';
import { G25Sample } from '../../types/vahaduo';

interface VahaduoTargetTabProps {
  targetText: string;
  onTargetTextChange: (text: string) => void;
}

export function VahaduoTargetTab({
  targetText,
  onTargetTextChange
}: VahaduoTargetTabProps) {
  const parsedSamples = useMemo(() => {
    return parseG25Coordinates(targetText);
  }, [targetText]);

  const isValid = parsedSamples.length > 0;

  const handleAggregate = () => {
    if (!targetText.trim()) return;
    const aggregated = aggregateG25RawText(targetText);
    onTargetTextChange(aggregated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top action & status bar */}
      <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-neutral-900 dark:text-white flex items-center gap-2">
              <span>Coordenadas de Muestras Objetivo (TARGET)</span>
              {isValid ? (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> {parsedSamples.length} muestras objetivo
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/40 px-2 py-0.5 rounded-full">
                  <AlertCircle className="w-3 h-3" /> Sin coordenadas válidas
                </span>
              )}
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              Pega las coordenadas G25 de tu muestra individual o poblaciones a testear.
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleAggregate}
            disabled={!isValid}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-800 dark:text-neutral-200 text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer font-bold"
            title="Promediar poblaciones que comparten el mismo nombre base (Aggregate)"
          >
            <Combine className="w-3.5 h-3.5 text-indigo-500" />
            <span>AGGREGATE</span>
          </button>

          <button
            onClick={() => onTargetTextChange(DEFAULT_TARGET_COORDS)}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Cargar muestra de ejemplo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muestra Ejemplo</span>
          </button>

          <button
            onClick={() => onTargetTextChange('')}
            className="px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-300 text-xs font-mono border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Limpiar área de texto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative">
        <textarea
          value={targetText}
          onChange={(e) => onTargetTextChange(e.target.value)}
          placeholder={`Mi_Muestra_G25,0.128,0.142,0.048,-0.002,... (25 dimensiones G25)`}
          rows={14}
          spellCheck={false}
          className="w-full p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 focus:border-neutral-900 dark:focus:border-white rounded-xl text-xs font-mono text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden leading-relaxed resize-y"
        />
        <div className="absolute bottom-3 right-3 text-[10px] font-mono text-neutral-500 bg-neutral-100 dark:bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800">
          Líneas: {targetText.split('\n').filter((l) => l.trim()).length}
        </div>
      </div>
    </div>
  );
}
