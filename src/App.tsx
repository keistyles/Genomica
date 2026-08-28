/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { OverallAnalysisReport, ParsedRawDNA, TraitCategory } from './types/genetics';
import { parseRawDNAFile } from './utils/dnaParser';
import { generateFullGenomicReport } from './utils/genomicEngine';
import { DemoProfile } from './data/demoProfiles';
import { Navbar } from './components/Navbar';
import { FileUploadZone } from './components/FileUploadZone';
import { AnalysisProgressBar } from './components/AnalysisProgressBar';
import { OverviewMetrics } from './components/OverviewMetrics';
import { CategoryNav } from './components/CategoryNav';
import { TraitCard } from './components/TraitCard';
import { AncestryView } from './components/AncestryView';
import { VahaduoG25Suite } from './components/vahaduo/VahaduoG25Suite';
import { CustomSNPChecker } from './components/CustomSNPChecker';
import { DisclaimerBanner } from './components/DisclaimerBanner';
import { ExportModal } from './components/ExportModal';

export type ThemeMode = 'light' | 'dark';

export default function App() {
  // Theme state persisted in localStorage
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('app_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [parsedDNA, setParsedDNA] = useState<ParsedRawDNA | null>(null);
  const [report, setReport] = useState<OverallAnalysisReport | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<TraitCategory | 'all'>('health_vulnerability');

  // URL route detection for /Vahaduo
  const [isVahaduoDirect, setIsVahaduoDirect] = useState<boolean>(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      return path.includes('/vahaduo') || hash.includes('vahaduo');
    } catch {
      return false;
    }
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Sync theme changes with DOM and localStorage
  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    try {
      localStorage.setItem('app_theme', newTheme);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Sync browser back/forward history navigation for /Vahaduo
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const isVaha = path.includes('/vahaduo') || hash.includes('vahaduo');
      setIsVahaduoDirect(isVaha);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToVahaduo = (enable: boolean) => {
    setIsVahaduoDirect(enable);
    try {
      if (enable) {
        window.history.pushState({ page: 'vahaduo' }, '', '/Vahaduo');
      } else {
        window.history.pushState({ page: 'home' }, '', '/');
      }
    } catch {
      // Fallback
    }
  };

  // Execute full genomic pipeline on raw file text
  const processGenomicData = async (rawContent: string, fileName: string) => {
    setIsLoading(true);
    setLoadingProgress(5);
    setStatusMessage('Iniciando lectura del kit genómico...');

    try {
      const parsed = await parseRawDNAFile(rawContent, fileName, (progress, msg) => {
        setLoadingProgress(progress);
        setStatusMessage(msg);
      });

      setStatusMessage('Calculando asociaciones genómicas, farmacología y ancestralidad...');
      setLoadingProgress(88);

      await new Promise((r) => setTimeout(r, 200));

      const generatedReport = generateFullGenomicReport(parsed);

      setLoadingProgress(100);
      setStatusMessage('¡Análisis completado!');

      await new Promise((r) => setTimeout(r, 150));

      setParsedDNA(parsed);
      setReport(generatedReport);
      setSelectedCategory('health_vulnerability');
      setIsLoading(false);

      try {
        confetti({
          particleCount: 35,
          spread: 55,
          origin: { y: 0.8 },
          colors: ['#18181b', '#71717a', '#a1a1aa']
        });
      } catch {
        // Safe fallback
      }
    } catch (err) {
      console.error('Error processing genomic data:', err);
      setIsLoading(false);
      alert('Hubo un error al procesar el archivo. Por favor verifica que contenga datos genómicos válidos.');
    }
  };

  const handleDemoSelected = (demoProfile: DemoProfile) => {
    processGenomicData(demoProfile.rawText, `${demoProfile.name}.txt`);
  };

  const handleReset = () => {
    setParsedDNA(null);
    setReport(null);
    setSelectedCategory('health_vulnerability');
    setSearchQuery('');
    setStatusFilter('all');
  };

  // Filter and search trait results
  const filteredTraits = useMemo(() => {
    if (!report || selectedCategory === 'ancestry') return [];

    return report.traitResults.filter((result) => {
      // Category filter
      if (selectedCategory !== 'all' && result.trait.category !== selectedCategory) {
        return false;
      }

      // Status filter
      if (statusFilter !== 'all') {
        if (statusFilter === 'elevated') {
          if (result.riskStatus !== 'elevated' && result.riskStatus !== 'trait_present' && result.riskStatus !== 'variant_present') return false;
        } else if (statusFilter === 'moderate') {
          if (result.riskStatus !== 'moderate') return false;
        } else if (statusFilter === 'protective') {
          if (result.riskStatus !== 'protective' && result.riskStatus !== 'variant_absent') return false;
        } else if (statusFilter === 'average') {
          if (result.riskStatus !== 'average' && result.riskStatus !== 'trait_absent') return false;
        }
      }

      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesTitle = result.trait.title.toLowerCase().includes(query);
        const matchesCategory = result.trait.categoryLabel.toLowerCase().includes(query);
        const matchesDescription = result.trait.description.toLowerCase().includes(query);
        const matchesGenes = result.trait.snps.some((s) => s.gene.toLowerCase().includes(query));
        const matchesRsid = result.trait.snps.some((s) => s.rsid.toLowerCase().includes(query));
        const matchesDrug = result.trait.drugName?.toLowerCase().includes(query);

        if (!matchesTitle && !matchesCategory && !matchesDescription && !matchesGenes && !matchesRsid && !matchesDrug) {
          return false;
        }
      }

      return true;
    });
  }, [report, selectedCategory, statusFilter, searchQuery]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    if (!report) return {};
    const counts: Record<string, number> = { all: report.traitResults.length };
    for (const res of report.traitResults) {
      const cat = res.trait.category;
      counts[cat] = (counts[cat] || 0) + 1;
    }
    return counts;
  }, [report]);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        theme={theme}
        onThemeChange={handleThemeChange}
        onReset={handleReset}
        onExport={() => setIsExportOpen(true)}
        hasResults={!!report}
        fileName={parsedDNA?.fileName}
        isVahaduoActive={isVahaduoDirect || selectedCategory === 'vahaduo'}
        onToggleVahaduo={() => {
          if (report) {
            setSelectedCategory(selectedCategory === 'vahaduo' ? 'health_vulnerability' : 'vahaduo');
          } else {
            navigateToVahaduo(!isVahaduoDirect);
          }
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Loading Progress State */}
        {isLoading && (
          <AnalysisProgressBar
            progress={loadingProgress}
            statusMessage={statusMessage}
          />
        )}

        {/* View 1: Dedicated Vahaduo G25 Suite Page (URL /Vahaduo or standalone toggle) */}
        {isVahaduoDirect && !isLoading && (
          <VahaduoG25Suite onBackToGenome={() => navigateToVahaduo(false)} />
        )}

        {/* View 2: Empty Upload State */}
        {!report && !isLoading && !isVahaduoDirect && (
          <div className="space-y-10">
            <FileUploadZone
              onFileLoaded={processGenomicData}
              onDemoSelected={handleDemoSelected}
              onOpenVahaduo={() => navigateToVahaduo(true)}
              isLoading={isLoading}
            />

            <DisclaimerBanner />
          </div>
        )}

        {/* View 3: Complete Results Dashboard */}
        {report && !isLoading && parsedDNA && !isVahaduoDirect && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Overview Metric Bar */}
            <OverviewMetrics
              report={report}
              onNavigateToAncestry={() => setSelectedCategory('ancestry')}
            />

            {/* Custom SNP Raw Query Tool */}
            <CustomSNPChecker parsedDNA={parsedDNA} />

            {/* Category Primary Navigation Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 font-mono">
                  Exploración por Categorías
                </h2>
                <span className="text-xs font-mono text-neutral-500">
                  {report.traitResults.length} marcadores / rasgos analizados
                </span>
              </div>

              <CategoryNav
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => {
                  setSelectedCategory(cat);
                  setSearchQuery('');
                }}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                countsByCategory={categoryCounts}
              />
            </div>

            {/* View Content: Ancestry View OR Vahaduo G25 Suite OR Trait Cards List */}
            {selectedCategory === 'vahaduo' ? (
              <VahaduoG25Suite />
            ) : selectedCategory === 'ancestry' ? (
              <AncestryView
                ancestry={report.ancestry}
                parsedDNA={parsedDNA}
              />
            ) : (
              <div>
                {filteredTraits.length > 0 ? (
                  <div className="space-y-3.5">
                    {filteredTraits.map((result, idx) => (
                      <TraitCard
                        key={result.trait.id}
                        result={result}
                        defaultExpanded={idx === 0 && filteredTraits.length <= 4}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 space-y-3">
                    <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      No se encontraron resultados para los filtros actuales
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      Prueba a limpiar el término de búsqueda o cambiar el nivel de filtro.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="px-4 py-2 text-xs font-bold rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity cursor-pointer"
                    >
                      Restablecer Filtros
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Disclaimer at Bottom of Dashboard */}
            <DisclaimerBanner />
          </div>
        )}
      </main>

      {/* Export / Print Modal */}
      {report && (
        <ExportModal
          report={report}
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
        />
      )}

      {/* Minimal Footer with Copyright, Developer credit and X profile */}
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500 dark:text-neutral-400 no-print bg-white/50 dark:bg-neutral-950/50 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
              © 2026 Desarrollado por <strong className="text-neutral-900 dark:text-white font-mono">Uomesk (El Uomo)</strong>
            </span>
            <span className="hidden sm:inline text-neutral-300 dark:text-neutral-700">·</span>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
              Genómica SNP Analyzer &amp; Vahaduo G25 Suite
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              id="btn-footer-twitter-x"
              href="https://x.com/uomesk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all font-mono text-xs font-bold shadow-xs cursor-pointer"
              title="Visitar perfil de X (@uomesk)"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>@uomesk</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
