import { useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink, Dna, Info, CheckCircle, AlertTriangle, ShieldCheck, Sparkles, BookOpen, Lightbulb, Pill, ShieldAlert } from 'lucide-react';
import { TraitAnalysisResult, UserSNPResult } from '../types/genetics';

interface TraitCardProps {
  key?: string;
  result: TraitAnalysisResult;
  onInspectSNP?: (snp: UserSNPResult) => void;
  defaultExpanded?: boolean;
}

export function TraitCard({ result, defaultExpanded = false }: TraitCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { trait, calculatedProbability, baselineProbability, riskStatus, statusLabel, headlineSummary, snpResults, dataCoverage } = result;

  // Status color styles - Clean Minimalism styling
  const getStatusBadge = () => {
    switch (riskStatus) {
      case 'variant_present':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: ShieldAlert,
          barColor: 'bg-rose-600'
        };
      case 'variant_absent':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: ShieldCheck,
          barColor: 'bg-emerald-500'
        };
      case 'elevated':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
          icon: AlertTriangle,
          barColor: 'bg-rose-500'
        };
      case 'moderate':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
          icon: Info,
          barColor: 'bg-amber-500'
        };
      case 'protective':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
          icon: ShieldCheck,
          barColor: 'bg-emerald-500'
        };
      case 'trait_present':
        return {
          bg: 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white',
          icon: Sparkles,
          barColor: 'bg-black dark:bg-white'
        };
      case 'trait_absent':
        return {
          bg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700',
          icon: CheckCircle,
          barColor: 'bg-neutral-400'
        };
      default:
        return {
          bg: 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700',
          icon: CheckCircle,
          barColor: 'bg-neutral-500 dark:bg-neutral-400'
        };
    }
  };

  const badgeConfig = getStatusBadge();
  const StatusIcon = badgeConfig.icon;
  const genesList = Array.from(new Set(trait.snps.map(s => s.gene))).join(' · ');

  return (
    <div
      id={`trait-card-${trait.id}`}
      className={`border rounded-2xl transition-all duration-200 bg-white dark:bg-neutral-900/60 ${
        isExpanded
          ? 'border-black dark:border-white shadow-xs'
          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600'
      }`}
    >
      {/* Header / Clickable summary row */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-5 sm:p-6 text-left flex flex-col gap-4 cursor-pointer focus:outline-none"
        aria-expanded={isExpanded}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          {/* Title and Gene / Metadata */}
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                {trait.categoryLabel}
              </span>
              {trait.inheritanceMode && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700">
                  {trait.inheritanceMode}
                </span>
              )}
              {trait.pharmacologicalGroup && (
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
                  <Pill className="w-3 h-3" />
                  {trait.pharmacologicalGroup}
                </span>
              )}
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                {genesList}
              </span>
              {dataCoverage < 100 && (
                <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-500">
                  ({result.snpsFoundCount}/{result.snpsTotalCount} SNPs presentes)
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-light text-neutral-900 dark:text-neutral-100 tracking-tight">
              {trait.title}
            </h3>
          </div>

          {/* Status Badge & Toggle */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeConfig.bg}`}>
              <StatusIcon className="w-3.5 h-3.5 shrink-0" />
              <span>{statusLabel}</span>
            </div>
            <div className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </div>
        </div>

        {/* Dynamic Metric Meter based on trait type */}
        {trait.type === 'carrier' ? (
          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/50 border border-neutral-100 dark:border-neutral-800 rounded-xl flex items-center justify-between">
            <div className="text-xs text-neutral-600 dark:text-neutral-300">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">Estado de portador genético: </span>
              {result.isVariantPresent ? 'Variante patogénica detectada' : 'No se detectan variantes de riesgo'}
            </div>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full ${
              result.isVariantPresent
                ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200'
                : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200'
            }`}>
              {result.isVariantPresent ? 'Variante presente' : 'Variante ausente'}
            </span>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <div className="flex items-baseline justify-between text-xs font-mono">
              <span className="text-neutral-500 dark:text-neutral-400 text-[11px] uppercase tracking-wider">
                {trait.unit || 'Probabilidad / Tendencia:'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  {calculatedProbability}%
                </span>
                {trait.type !== 'phenotype' && (
                  <span className="text-neutral-400 dark:text-neutral-500 text-[11px]">
                    (vs {baselineProbability}% base)
                  </span>
                )}
              </div>
            </div>

            {/* Progress track */}
            <div className="relative w-full h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
              {trait.type !== 'phenotype' && (
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-neutral-400 dark:bg-neutral-500 z-10"
                  style={{ left: `${Math.min(99, Math.max(1, baselineProbability))}%` }}
                  title={`Media poblacional: ${baselineProbability}%`}
                />
              )}
              <div
                className={`h-full rounded-full transition-all duration-500 ${badgeConfig.barColor}`}
                style={{ width: `${Math.min(100, Math.max(3, calculatedProbability))}%` }}
              />
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pt-1">
              {headlineSummary}
            </p>
          </div>
        )}
      </button>

      {/* Expanded Accordion Body */}
      {isExpanded && (
        <div className="px-5 pb-6 sm:px-6 sm:pb-6 space-y-6 pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs sm:text-sm">
          
          {/* Clinical Recommendation (Pharmacology) */}
          {trait.clinicalRecommendation && (
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                <Pill className="w-3.5 h-3.5" />
                <span>Recomendación Farmacogenética (Guías CPIC / DPWG)</span>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-300">
                {trait.clinicalRecommendation}
              </p>
            </div>
          )}

          {/* Detailed Scientific Analysis */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase tracking-widest">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mecanismo Biológico y Análisis</span>
            </div>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed bg-neutral-50 dark:bg-neutral-950/50 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/80">
              {result.detailedAnalysis}
            </p>
          </div>

          {/* SNPs Breakdown Table */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase tracking-widest flex items-center gap-1.5">
                <Dna className="w-3.5 h-3.5" />
                Marcadores Evaluados en tu Archivo
              </span>
              <span className="text-[10px] font-mono text-neutral-400">
                Evidencia Clínica
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-neutral-200 dark:border-neutral-800">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-neutral-100/70 dark:bg-neutral-800/60 text-neutral-700 dark:text-neutral-300 border-b border-neutral-200 dark:border-neutral-800">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">rsID / Gen</th>
                    <th className="py-2.5 px-3 font-semibold">Tu Genotipo</th>
                    <th className="py-2.5 px-3 font-semibold">Efecto / Interpretación</th>
                    <th className="py-2.5 px-3 font-semibold hidden md:table-cell">Magnitud</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Referencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                  {snpResults.map((snp) => (
                    <tr key={snp.rsid} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-neutral-900 dark:text-neutral-100">{snp.rsid}</div>
                        <div className="text-[10px] text-neutral-500 dark:text-neutral-400">{snp.gene}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2.5 py-0.5 rounded-full font-mono font-bold text-xs ${
                          snp.userGenotype === '--'
                            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                            : 'bg-black text-white dark:bg-white dark:text-black'
                        }`}>
                          {snp.userGenotype}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-sans max-w-xs">
                        <div className="font-medium text-neutral-900 dark:text-neutral-100">
                          {snp.matchedImpact.label}
                        </div>
                        <div className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-tight line-clamp-2">
                          {snp.matchedImpact.description}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 hidden md:table-cell text-neutral-600 dark:text-neutral-400 text-[11px]">
                        {snp.matchedImpact.effectMagnitude}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <a
                          href={`https://www.snpedia.com/index.php/${snp.rsid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white underline decoration-neutral-300 dark:decoration-neutral-700"
                          title="Consultar SNPedia"
                        >
                          <span>SNPedia</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actionable Lifestyle / Health Insights */}
          {trait.lifestyleInsights && trait.lifestyleInsights.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-neutral-100 text-[11px] uppercase tracking-widest">
                <Lightbulb className="w-3.5 h-3.5 text-neutral-700 dark:text-neutral-300" />
                <span>Pautas Prácticas & Estilo de Vida</span>
              </div>
              <ul className="space-y-1.5 bg-neutral-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-neutral-100 dark:border-neutral-800">
                {trait.lifestyleInsights.map((insight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                    <span className="text-neutral-400 select-none">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
