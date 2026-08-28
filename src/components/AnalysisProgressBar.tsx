import { motion } from 'motion/react';
import { Activity, CheckCircle2, Shield } from 'lucide-react';

interface AnalysisProgressBarProps {
  progress: number;
  statusMessage: string;
}

export function AnalysisProgressBar({ progress, statusMessage }: AnalysisProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-12 p-8 bg-white dark:bg-neutral-900/80 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Decodificando Kit Genómico
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono">
              {statusMessage || 'Leyendo marcadores biológicos...'}
            </p>
          </div>
        </div>
        <div className="text-right font-mono text-xs font-bold text-neutral-900 dark:text-neutral-100">
          {progress}%
        </div>
      </div>

      {/* Outer progress bar - minimal hairline */}
      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
        <motion.div
          className="bg-black dark:bg-white h-full rounded-full transition-all duration-300 ease-out"
          initial={{ width: '0%' }}
          animate={{ width: `${Math.max(5, progress)}%` }}
        />
      </div>

      {/* Step tags */}
      <div className="grid grid-cols-3 gap-2 mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
        <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-medium text-neutral-500 dark:text-neutral-400">
          <CheckCircle2 className={`w-3.5 h-3.5 ${progress > 25 ? 'text-black dark:text-white' : 'text-neutral-300 dark:text-neutral-700'}`} />
          <span>Extracción</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-medium text-neutral-500 dark:text-neutral-400">
          <Activity className={`w-3.5 h-3.5 ${progress > 60 ? 'text-black dark:text-white' : 'text-neutral-300 dark:text-neutral-700'}`} />
          <span>Mapeo</span>
        </div>
        <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-wider font-medium text-neutral-500 dark:text-neutral-400">
          <Shield className={`w-3.5 h-3.5 ${progress >= 95 ? 'text-black dark:text-white' : 'text-neutral-300 dark:text-neutral-700'}`} />
          <span>Poligénico</span>
        </div>
      </div>
    </div>
  );
}
