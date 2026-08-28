import { FileText, Cpu, AlertTriangle, ShieldCheck, Check, UserCheck, Globe } from 'lucide-react';
import { OverallAnalysisReport } from '../types/genetics';
import { useLanguage } from '../i18n/LanguageContext';

interface OverviewMetricsProps {
  report: OverallAnalysisReport;
  onNavigateToAncestry?: () => void;
}

export function OverviewMetrics({ report, onNavigateToAncestry }: OverviewMetricsProps) {
  const { t } = useLanguage();
  const { fileMetadata, traitResults, ancestry } = report;

  // Calculate totals
  const elevatedTotal = traitResults.filter(t => t.riskStatus === 'elevated' || t.riskStatus === 'trait_present' || t.riskStatus === 'variant_present').length;
  const moderateTotal = traitResults.filter(t => t.riskStatus === 'moderate').length;
  const protectiveTotal = traitResults.filter(t => t.riskStatus === 'protective' || t.riskStatus === 'variant_absent').length;
  const averageTotal = traitResults.filter(t => t.riskStatus === 'average' || t.riskStatus === 'trait_absent').length;

  const isFemale = fileMetadata.inferredSex === 'Femenino (XX)' || fileMetadata.inferredSex?.includes('XX');
  const isMale = fileMetadata.inferredSex === 'Masculino (XY)' || fileMetadata.inferredSex?.includes('XY');

  return (
    <div className="w-full bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* File summary bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-neutral-100 dark:border-neutral-800 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-800 flex items-center justify-center text-neutral-900 dark:text-neutral-100">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                {fileMetadata.fileName}
              </span>
              <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold border border-neutral-200 dark:border-neutral-700">
                {fileMetadata.format}
              </span>
              {/* Biological Sex Badge */}
              <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${
                isFemale
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : isMale
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200'
              }`}>
                <UserCheck className="w-3 h-3" />
                {isFemale ? t('metrics.femaleKaryotype', 'Cariotipo Femenino (XX)') : isMale ? t('metrics.maleKaryotype', 'Cariotipo Masculino (XY)') : t('metrics.mixedKaryotype', 'Cromosomas mixtos')}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
              {fileMetadata.validSNPsCount.toLocaleString()} {t('metrics.validMarkers', 'marcadores válidos')} · {report.traitResults.length} {t('metrics.conditionsCalculated', 'condiciones/rasgos calculados')}
            </p>
          </div>
        </div>

        {/* Ancestry Quick Snippet */}
        {ancestry && onNavigateToAncestry && (
          <button
            onClick={onNavigateToAncestry}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500 transition-all text-left cursor-pointer"
          >
            <Globe className="w-4 h-4 text-neutral-500" />
            <div>
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                {ancestry.regions[0]?.name} ({ancestry.regions[0]?.percentage}%)
              </div>
              <div className="text-[10px] text-neutral-500">
                {t('metrics.lineage', 'Linaje')}: {ancestry.maternal.haplogroup} · Neandertal: {ancestry.neanderthal.percentage}%
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Metric Cards Grid - Clean Minimalism */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Elevated traits */}
        <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t('metrics.elevatedInterest', 'Interés / Elevado')}</span>
            <AlertTriangle className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
              {elevatedTotal}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {t('metrics.panels', 'paneles')}
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            {t('metrics.elevatedDesc', 'Tendencia o variante presente')}
          </p>
        </div>

        {/* Moderate traits */}
        <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t('metrics.moderate', 'Moderado')}</span>
            <Cpu className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
              {moderateTotal}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {t('metrics.panels', 'paneles')}
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            {t('metrics.moderateDesc', 'Genotipos heterocigotos intermedios')}
          </p>
        </div>

        {/* Protective traits */}
        <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t('metrics.protectiveNormal', 'Protector / Normal')}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-neutral-900 dark:text-neutral-100" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
              {protectiveTotal}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {t('metrics.panels', 'paneles')}
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            {t('metrics.protectiveDesc', 'Variante ausente / alta eficiencia')}
          </p>
        </div>

        {/* Average/Standard traits */}
        <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-950/60 border border-neutral-200/80 dark:border-neutral-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400 mb-2">
            <span>{t('metrics.populationBaseline', 'Poblacional Base')}</span>
            <Check className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-light text-neutral-900 dark:text-neutral-100">
              {averageTotal}
            </span>
            <span className="text-[11px] text-neutral-400 font-mono">
              {t('metrics.panels', 'paneles')}
            </span>
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1">
            {t('metrics.populationDesc', 'Alineado con frecuencias estándar')}
          </p>
        </div>

      </div>
    </div>
  );
}
