import { useState } from 'react';
import { X, Printer, FileDown, Check, FileText, Loader2, Sparkles } from 'lucide-react';
import { OverallAnalysisReport } from '../types/genetics';
import { generateGenomicHealthPdf } from '../utils/pdfGenerator';
import { useLanguage } from '../i18n/LanguageContext';

interface ExportModalProps {
  report: OverallAnalysisReport;
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ report, isOpen, onClose }: ExportModalProps) {
  const { language } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      await generateGenomicHealthPdf(report, language);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('Error generating PDF report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-neutral-900 dark:text-neutral-100" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100 font-mono">
              Exportar Informe Genómico PDF
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          Genera un informe clínico y preventivo completo en formato PDF con todos los {report.traitResults.length} resultados de salud detallados:
          predisposiciones genéticas, estado de portador, farmacogenómica, nutrición, rasgos físicos y linajes de ancestralidad.
        </p>

        {/* Primary PDF Action Box */}
        <div className="space-y-3">
          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="w-full p-5 rounded-2xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 transition-all font-mono font-bold text-xs flex items-center justify-center gap-3 cursor-pointer shadow-md disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>GENERANDO INFORME PDF DE ALTA RESOLUCIÓN...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-5 h-5 text-emerald-500" />
                <span>¡INFORME PDF DESCARGADO CORRECTAMENTE!</span>
              </>
            ) : (
              <>
                <FileDown className="w-5 h-5" />
                <span>DESCARGAR INFORME PDF COMPLETO</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="w-full py-2.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 transition-colors font-mono text-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-neutral-500" />
            <span>Imprimir Vista Web / Vista Previa de Impresión</span>
          </button>
        </div>

        <div className="pt-2 flex justify-between items-center text-[11px] text-neutral-400 font-mono">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Incluye bibliografía PubMed e índices de evidencia
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
