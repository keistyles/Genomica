import { ShieldAlert } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export function DisclaimerBanner() {
  const { t } = useLanguage();

  return (
    <div className="w-full rounded-2xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 p-5 text-xs text-neutral-600 dark:text-neutral-400 space-y-2 font-mono">
      <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-neutral-900 dark:text-neutral-100">
        <ShieldAlert className="w-4 h-4 text-neutral-700 dark:text-neutral-300 shrink-0" />
        <span>{t('disclaimer.title', 'Aviso Científico & Limitación de Responsabilidad')}</span>
      </div>
      <p className="leading-relaxed">
        {t('disclaimer.p1', 'Este analizador procesa archivos de genotipado comerciales (chips de microarrays) con fines exclusivamente educativos, investigativos y de divulgación. Las probabilidades reflejan correlaciones estadísticas poblacionales basadas en estudios GWAS y literatura científica.')}
      </p>
      <p className="leading-relaxed">
        <strong>{t('disclaimer.p2_bold', 'No constituye un diagnóstico médico, genético ni clínico vinculante.')}</strong>{' '}
        {t('disclaimer.p2_text', 'La epigenética, el microbioma, la alimentación, la actividad física y el entorno ambiental juegan un papel decisivo en la expresión fenotípica. Ante cualquier duda de salud o tratamiento farmacológico, consulta siempre con un profesional sanitario colegiado.')}
      </p>
    </div>
  );
}
