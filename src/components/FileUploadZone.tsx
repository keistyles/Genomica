import React, { useRef, useState } from 'react';
import { UploadCloud, ShieldAlert, ArrowRight, Database, Cpu, Sparkles } from 'lucide-react';
import { DEMO_PROFILES, DemoProfile } from '../data/demoProfiles';

interface FileUploadZoneProps {
  onFileLoaded: (content: string, fileName: string) => void;
  onDemoSelected: (profile: DemoProfile) => void;
  onOpenVahaduo?: () => void;
  isLoading: boolean;
}

export function FileUploadZone({
  onFileLoaded,
  onDemoSelected,
  onOpenVahaduo,
  isLoading
}: FileUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragError, setDragError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file) return;

    setDragError(null);
    const validExtensions = ['.txt', '.csv', '.tsv', '.dna', '.zip'];
    const fileName = file.name.toLowerCase();
    const hasValidExt = validExtensions.some(ext => fileName.endsWith(ext));

    if (!hasValidExt) {
      setDragError('Formato no reconocido. Sube un archivo .txt, .csv o .tsv de 23andMe, AncestryDNA, MyHeritage, etc.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        onFileLoaded(text, file.name);
      }
    };
    reader.onerror = () => {
      setDragError('Error al leer el archivo en local. Verifica los permisos del navegador.');
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isLoading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Editorial Hero Intro */}
      <div className="text-center space-y-3 pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 text-[10px] font-bold uppercase tracking-widest border border-neutral-200 dark:border-neutral-800">
          <span>GENOMIC ENGINE & POLYGENIC RISK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-neutral-900 dark:text-neutral-50 max-w-3xl mx-auto leading-[1.15]">
          Analizador de SNPs <span className="text-neutral-400 font-normal">/ Tendencias Poligénicas</span>
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          Sube tu archivo de ADN en bruto de <strong>23andMe, AncestryDNA, MyHeritage, FamilyTreeDNA</strong> o <strong>TellmeGen</strong>. Procesamiento 100% en tu navegador con privacidad absoluta.
        </p>
      </div>

      {/* Main Drag and Drop Box - Clean Minimalism */}
      <div
        id="file-dropzone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`relative group cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-900/60 scale-[1.002]'
            : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-neutral-50/40 dark:bg-neutral-900/20'
        } ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFile(e.target.files[0]);
            }
          }}
          accept=".txt,.csv,.tsv,.dna"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200 group-hover:scale-105 transition-transform duration-200">
            <UploadCloud className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
              Upload SNP Kit
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Arrastra tu archivo aquí o haz clic para examinar
            </p>
          </div>

          <button
            type="button"
            className="mt-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:opacity-85 transition-opacity"
          >
            Examinar Archivo
          </button>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['23andMe (.txt)', 'AncestryDNA (.txt)', 'MyHeritage (.csv)', 'FamilyTreeDNA', 'TellmeGen'].map((badge) => (
              <span
                key={badge}
                className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-white dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {dragError && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs flex items-center justify-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{dragError}</span>
          </div>
        )}
      </div>

      {/* Direct Vahaduo G25 Tools Access Card (No File Required) */}
      {onOpenVahaduo && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0c1219] via-[#101824] to-[#0c1219] border border-cyan-500/30 text-white shadow-[0_0_20px_rgba(0,229,255,0.08)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold font-mono tracking-tight text-white flex items-center gap-1.5">
                  <span>VAHADUO G25 TOOLS</span>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                    Acceso Directo
                  </span>
                </h3>
              </div>
              <p className="text-xs text-neutral-300 font-mono">
                Modela coordenadas G25, Admixture NNLS, Oracle 2-10 Way y Heatmap sin necesidad de cargar archivo.
              </p>
            </div>
          </div>

          <button
            id="btn-open-vahaduo-hero"
            onClick={onOpenVahaduo}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs shadow-[0_0_15px_rgba(0,229,255,0.25)] flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ABRIR VAHADUO G25</span>
          </button>
        </div>
      )}

      {/* Instant Demo Kits Selection */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
            <h3 className="text-[10px] uppercase tracking-widest font-bold opacity-60 text-neutral-700 dark:text-neutral-300">
              Kits de muestra para probar al instante:
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_PROFILES.map((profile) => (
            <button
              key={profile.id}
              onClick={() => onDemoSelected(profile)}
              disabled={isLoading}
              className="text-left p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-black dark:hover:border-white bg-white dark:bg-neutral-900/60 transition-colors group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {profile.name}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
                    {profile.provider}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                  {profile.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white">
                <span>Cargar perfil demo</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-900 text-left">
        <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60">
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1 tracking-tight">
            +60 SNPs Clínicamente Validados
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Dermatitis seborreica, folato MTHFR, neurodiversidad (TEA, TDAH, TOC, AuDHD), hormonas y fenotipos.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60">
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1 tracking-tight">
            Seguridad & Privacidad Total
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            El archivo de genoma nunca sale de tu navegador. Motor JavaScript en memoria local efímera.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/60 dark:border-neutral-800/60">
          <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 mb-1 tracking-tight">
            Porcentajes & Desglose SNP
          </div>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Estimación poligénica ponderada, contraste con línea base poblacional y referencias científicas.
          </p>
        </div>
      </div>
    </div>
  );
}
