import React, { useState } from 'react';
import { DistanceGradientThresholds, DEFAULT_GRADIENT_THRESHOLDS } from '../../types/vahaduo';
import { Sliders, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { getVahaduoDistanceBadgeStyle } from '../../utils/vahaduoMath';

interface DistanceGradientRegulatorProps {
  thresholds: DistanceGradientThresholds;
  onChange: (thresholds: DistanceGradientThresholds) => void;
}

export function DistanceGradientRegulator({
  thresholds,
  onChange
}: DistanceGradientRegulatorProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleReset = () => {
    onChange({ ...DEFAULT_GRADIENT_THRESHOLDS });
  };

  const sampleDistances = [
    { label: 'Verde (Muy cercana)', dist: thresholds.greenMax * 0.5 },
    { label: 'Amarillo (Cercana)', dist: (thresholds.greenMax + thresholds.yellowMax) / 2 },
    { label: 'Naranja (Intermedia)', dist: (thresholds.yellowMax + thresholds.orangeMax) / 2 },
    { label: 'Rojo (Distante)', dist: (thresholds.orangeMax + thresholds.redMax) / 2 },
    { label: 'Azul (Muy lejana / Outgroup)', dist: thresholds.redMax * 1.35 }
  ];

  return (
    <div className="w-full bg-neutral-50 dark:bg-neutral-900/60 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs font-mono">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2 font-semibold">
          <Sliders className="w-3.5 h-3.5 text-neutral-500" />
          <span>Regulador del Rango de Colores (Verde - Amarillo - Naranja - Rojo - Azul)</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1">
            {sampleDistances.map((item, idx) => {
              const style = getVahaduoDistanceBadgeStyle(item.dist, thresholds);
              return (
                <span
                  key={idx}
                  style={{ backgroundColor: style.backgroundColor, color: style.color }}
                  className="px-1.5 py-0.5 rounded-xs font-bold text-[10px]"
                >
                  {item.dist.toFixed(3)}
                </span>
              );
            })}
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Green Threshold */}
            <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Verde Máximo</span>
                <span className="font-bold text-neutral-900 dark:text-white">{thresholds.greenMax.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.040"
                step="0.001"
                value={thresholds.greenMax}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({
                    ...thresholds,
                    greenMax: val,
                    yellowMax: Math.max(val + 0.005, thresholds.yellowMax)
                  });
                }}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[10px] text-neutral-500">Distancias menores o iguales son verdes.</p>
            </div>

            {/* Yellow Threshold */}
            <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-600 dark:text-amber-400">Amarillo Máximo</span>
                <span className="font-bold text-neutral-900 dark:text-white">{thresholds.yellowMax.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.015"
                max="0.060"
                step="0.001"
                value={thresholds.yellowMax}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({
                    ...thresholds,
                    yellowMax: val,
                    orangeMax: Math.max(val + 0.005, thresholds.orangeMax)
                  });
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[10px] text-neutral-500">Transición a amarillo.</p>
            </div>

            {/* Orange Threshold */}
            <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-orange-600 dark:text-orange-400">Naranja Máximo</span>
                <span className="font-bold text-neutral-900 dark:text-white">{thresholds.orangeMax.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.025"
                max="0.090"
                step="0.001"
                value={thresholds.orangeMax}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({
                    ...thresholds,
                    orangeMax: val,
                    redMax: Math.max(val + 0.005, thresholds.redMax)
                  });
                }}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <p className="text-[10px] text-neutral-500">Transición a naranja.</p>
            </div>

            {/* Red Threshold */}
            <div className="space-y-1.5 p-3 rounded-lg bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-red-600 dark:text-red-400">Rojo Máximo</span>
                <span className="font-bold text-neutral-900 dark:text-white">{thresholds.redMax.toFixed(3)}</span>
              </div>
              <input
                type="range"
                min="0.040"
                max="0.150"
                step="0.002"
                value={thresholds.redMax}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  onChange({
                    ...thresholds,
                    redMax: val
                  });
                }}
                className="w-full accent-red-500 cursor-pointer"
              />
              <p className="text-[10px] text-neutral-500">Distancias mayores pasan a azul.</p>
            </div>
          </div>

          {/* Reset button and info */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-neutral-500">
              Los cambios se aplican automáticamente a todas las distancias en DISTANCE y ORACLE.
            </span>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer valores por defecto</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
