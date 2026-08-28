import { useState, type FormEvent } from 'react';
import { Search, ExternalLink, Dna } from 'lucide-react';
import { ParsedRawDNA } from '../types/genetics';

interface CustomSNPCheckerProps {
  parsedDNA: ParsedRawDNA;
}

export function CustomSNPChecker({ parsedDNA }: CustomSNPCheckerProps) {
  const [query, setQuery] = useState('');
  const cleanQuery = query.trim().toLowerCase();
  const foundGenotype = cleanQuery ? parsedDNA.snps.get(cleanQuery) : undefined;

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
  };

  const quickSamples = ['rs4680', 'rs1801133', 'rs12913832', 'rs6152', 'rs17822931', 'rs1815739', 'rs9939609'];

  return (
    <div className="bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Dna className="w-4 h-4 text-neutral-900 dark:text-neutral-100" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
            Buscador Directo de rsIDs en tu Genoma
          </h3>
        </div>
        <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
          {parsedDNA.snps.size.toLocaleString()} marcadores indexados
        </span>
      </div>

      <p className="text-xs text-neutral-600 dark:text-neutral-400">
        ¿Quieres verificar un marcador específico mencionado en un estudio o foro? Escribe su código (ej. <code className="font-mono text-neutral-900 dark:text-neutral-100">rs4680</code>) para ver tu genotipo exacto en este archivo.
      </p>

      {/* Search Input */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            id="custom-snp-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Introduce un rsID (ej. rs4680, rs1801133, rs53576)..."
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm font-mono bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-black dark:focus:border-white"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-2 bg-black hover:opacity-85 dark:bg-white dark:hover:opacity-85 text-white dark:text-black rounded-full text-xs font-bold transition-opacity"
        >
          Consultar
        </button>
      </form>

      {/* Quick click suggestions */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Sugerencias:</span>
        {quickSamples.map((rs) => (
          <button
            key={rs}
            type="button"
            onClick={() => setQuery(rs)}
            className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 transition-colors"
          >
            {rs}
          </button>
        ))}
      </div>

      {/* Search Result Display */}
      {cleanQuery && (
        <div className="mt-3 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="font-mono text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {cleanQuery}
            </div>
            {foundGenotype ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Tu Genotipo:</span>
                <span className="px-3 py-1 rounded-full bg-black text-white dark:bg-white dark:text-black font-mono font-bold text-xs">
                  {foundGenotype}
                </span>
              </div>
            ) : (
              <span className="text-xs font-mono text-neutral-400 dark:text-neutral-500">
                Marcador no presente en este chip genómico
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <a
              href={`https://www.snpedia.com/index.php/${cleanQuery}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white underline decoration-neutral-300"
            >
              <span>Ver en SNPedia</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={`https://www.ncbi.nlm.nih.gov/snp/${cleanQuery}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white underline decoration-neutral-300"
            >
              <span>NCBI dbSNP</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
