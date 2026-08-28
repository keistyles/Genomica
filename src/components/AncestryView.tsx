import { useState } from 'react';
import { Globe, Compass, Users, Sparkles, MapPin, Calendar, Dna, Info, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AncestryAnalysisReport, ParsedRawDNA } from '../types/genetics';

interface AncestryViewProps {
  ancestry: AncestryAnalysisReport;
  parsedDNA: ParsedRawDNA;
}

export function AncestryView({ ancestry, parsedDNA }: AncestryViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'continental' | 'maternal' | 'paternal' | 'neanderthal'>('continental');
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(ancestry.regions[0]?.id || 'europe');

  const selectedRegion = ancestry.regions.find(r => r.id === selectedRegionId) || ancestry.regions[0];

  return (
    <div className="space-y-6">
      {/* Ancestry Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('continental')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'continental'
              ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Ancestralidad Continental</span>
        </button>

        <button
          onClick={() => setActiveSubTab('maternal')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'maternal'
              ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Compass className="w-4 h-4 text-emerald-500" />
          <span>Linaje Materno (mtDNA)</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-md">
            {ancestry.maternal.haplogroup}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('paternal')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'paternal'
              ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-blue-500" />
          <span>Linaje Paterno (Y-DNA)</span>
          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
            ancestry.paternal.isFemaleXX
              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
          }`}>
            {ancestry.paternal.isFemaleXX ? 'XX (Femenino)' : ancestry.paternal.haplogroup}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('neanderthal')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeSubTab === 'neanderthal'
              ? 'bg-white dark:bg-neutral-800 text-black dark:text-white shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>ADN Neandertal</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-md">
            {ancestry.neanderthal.percentage}%
          </span>
        </button>
      </div>

      {/* 1. CONTINENTAL ANCESTRY TAB */}
      {activeSubTab === 'continental' && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-neutral-400 dark:text-neutral-500">
                  Estimación de Composición Genómica Global
                </span>
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                  Desglose Geográfico Continental
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Comparación contra paneles de referencia global y marcadores informativos de ancestralidad (AIMs).
                </p>
              </div>
            </div>

            {/* Stacked Progress Bar */}
            <div className="space-y-2 mb-6">
              <div className="h-4 w-full bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex shadow-inner">
                {ancestry.regions.map((reg) => (
                  <div
                    key={reg.id}
                    style={{ width: `${reg.percentage}%`, backgroundColor: reg.color }}
                    className="h-full transition-all relative group"
                    title={`${reg.name}: ${reg.percentage}%`}
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                {ancestry.regions.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegionId(reg.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all ${
                      selectedRegionId === reg.id
                        ? 'border-black dark:border-white bg-neutral-100 dark:bg-neutral-800 text-black dark:text-white font-semibold'
                        : 'border-transparent hover:border-neutral-300 dark:hover:border-neutral-700'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: reg.color }} />
                    <span>{reg.name}</span>
                    <span className="font-mono font-bold">{reg.percentage}%</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive World Map SVG Visualization */}
            <div className="relative p-4 bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono text-neutral-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  Mapa de Distribución Continental
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Región Activa: <strong className="text-black dark:text-white">{selectedRegion?.name} ({selectedRegion?.percentage}%)</strong>
                </span>
              </div>
              <div className="aspect-[21/9] w-full relative flex items-center justify-center">
                <svg viewBox="0 0 1000 450" className="w-full h-full text-neutral-300 dark:text-neutral-800 fill-current">
                  {/* Stylized simplified continental SVG paths */}
                  {/* North America */}
                  <path
                    d="M120 70 Q 200 60 260 110 Q 240 160 170 170 Q 140 220 180 240 L 150 250 Q 110 200 90 140 Z"
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedRegionId === 'indigenous_americas'
                        ? 'fill-red-500/80 stroke-red-600 stroke-2'
                        : 'hover:fill-neutral-400 dark:hover:fill-neutral-700'
                    }`}
                    onClick={() => setSelectedRegionId('indigenous_americas')}
                  />
                  {/* South America */}
                  <path
                    d="M220 250 Q 280 270 290 330 Q 260 410 220 430 Q 190 350 200 300 Z"
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedRegionId === 'indigenous_americas'
                        ? 'fill-red-500/80 stroke-red-600 stroke-2'
                        : 'hover:fill-neutral-400 dark:hover:fill-neutral-700'
                    }`}
                    onClick={() => setSelectedRegionId('indigenous_americas')}
                  />
                  {/* Europe */}
                  <path
                    d="M450 70 Q 540 60 560 120 Q 510 160 460 150 Q 420 120 450 70 Z"
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedRegionId === 'europe'
                        ? 'fill-blue-500/90 stroke-blue-600 stroke-2'
                        : 'hover:fill-neutral-400 dark:hover:fill-neutral-700'
                    }`}
                    onClick={() => setSelectedRegionId('europe')}
                  />
                  {/* North Africa & Middle East */}
                  <path
                    d="M460 160 Q 580 150 610 200 Q 550 230 480 220 Z"
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedRegionId === 'mena'
                        ? 'fill-amber-500/90 stroke-amber-600 stroke-2'
                        : 'hover:fill-neutral-400 dark:hover:fill-neutral-700'
                    }`}
                    onClick={() => setSelectedRegionId('mena')}
                  />
                  {/* Sub-Saharan Africa */}
                  <path
                    d="M480 220 Q 570 220 560 320 Q 530 390 490 370 Q 460 300 480 220 Z"
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedRegionId === 'africa'
                        ? 'fill-emerald-500/90 stroke-emerald-600 stroke-2'
                        : 'hover:fill-neutral-400 dark:hover:fill-neutral-700'
                    }`}
                    onClick={() => setSelectedRegionId('africa')}
                  />
                  {/* East Asia & Siberia */}
                  <path
                    d="M600 60 Q 820 60 850 160 Q 780 230 680 200 Q 580 140 600 60 Z"
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedRegionId === 'east_asia'
                        ? 'fill-purple-500/90 stroke-purple-600 stroke-2'
                        : 'hover:fill-neutral-400 dark:hover:fill-neutral-700'
                    }`}
                    onClick={() => setSelectedRegionId('east_asia')}
                  />
                  {/* South Asia */}
                  <path
                    d="M650 190 Q 720 190 730 260 Q 670 280 640 230 Z"
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedRegionId === 'south_asia'
                        ? 'fill-pink-500/90 stroke-pink-600 stroke-2'
                        : 'hover:fill-neutral-400 dark:hover:fill-neutral-700'
                    }`}
                    onClick={() => setSelectedRegionId('south_asia')}
                  />
                  {/* Oceania / Australia */}
                  <path
                    d="M780 300 Q 890 290 880 370 Q 800 390 760 340 Z"
                    className={`transition-all duration-300 cursor-pointer ${
                      selectedRegionId === 'oceania'
                        ? 'fill-cyan-500/90 stroke-cyan-600 stroke-2'
                        : 'hover:fill-neutral-400 dark:hover:fill-neutral-700'
                    }`}
                    onClick={() => setSelectedRegionId('oceania')}
                  />
                </svg>
              </div>
            </div>

            {/* Selected Region Detailed Card */}
            {selectedRegion && (
              <div className="p-5 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: selectedRegion.color }} />
                    <h4 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      {selectedRegion.name}
                    </h4>
                  </div>
                  <span className="text-lg font-mono font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedRegion.percentage}%
                  </span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                  {selectedRegion.description}
                </p>

                {/* Sub-region Breakdowns */}
                {selectedRegion.subRegions && selectedRegion.subRegions.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                      Subgrupos y poblaciones específicas detectadas
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                      {selectedRegion.subRegions.map((sub, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl"
                        >
                          <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                            {sub.name}
                          </span>
                          <span className="text-xs font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                            {sub.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. MATERNAL LINEAGE TAB (mtDNA) */}
      {activeSubTab === 'maternal' && (
        <div className="space-y-6">
          {/* Main Haplogroup Card */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
                  ADN Mitocondrial (mtDNA)
                </span>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  Haplogrupo Materno: {ancestry.maternal.haplogroup}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {ancestry.maternal.subHaplogroup}
                </p>
              </div>

              <div className="flex flex-col sm:items-end gap-1">
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{ancestry.maternal.originDate}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{ancestry.maternal.originLocation}</span>
                </div>
              </div>
            </div>

            <div className="py-4">
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {ancestry.maternal.description}
              </p>
            </div>

            {/* Defining mtDNA Markers */}
            <div className="p-4 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl mb-6">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                Mutaciones diagnósticas mitocondriales en región control (D-loop y coding region):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {ancestry.maternal.definingMarkers.map((marker, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-emerald-700 dark:text-emerald-300"
                  >
                    {marker}
                  </span>
                ))}
              </div>
            </div>

            {/* Chronological Migration Timeline */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                Ruta Filogenética y Cronología Migratoria Materna
              </h4>

              <div className="relative pl-6 space-y-6 border-l-2 border-emerald-500/30 dark:border-emerald-500/20 ml-3">
                {ancestry.maternal.migrationPath.map((step, idx) => (
                  <div key={idx} className="relative group">
                    {/* Circle Node */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 border-2 border-emerald-500 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </div>

                    <div className="p-4 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                          {step.step}
                          <ArrowRight className="w-3 h-3 text-neutral-400" />
                          <span className="text-xs font-normal text-emerald-600 dark:text-emerald-400">{step.region}</span>
                        </span>
                        <span className="text-[11px] font-mono text-neutral-500">
                          {step.period}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PATERNAL LINEAGE TAB (Y-DNA) */}
      {activeSubTab === 'paternal' && (
        <div className="space-y-6">
          {/* Female Biological XX Notice vs Male Lineage */}
          {ancestry.paternal.isFemaleXX ? (
            <div className="p-8 bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-4 text-center max-w-2xl mx-auto">
              <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-700 dark:text-neutral-300">
                <Info className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                Aviso de Genotipo Femenino (Cariotipo XX)
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                El kit analizado corresponde a una <strong className="text-neutral-900 dark:text-neutral-100">mujer biológica (XX)</strong>. Las mujeres no heredan el cromosoma Y paterno de forma directa en su genoma celular, por lo que el linaje paterno por cromosoma Y no está visible en esta muestra.
              </p>
              <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl text-left text-xs text-neutral-500 dark:text-neutral-400 space-y-2">
                <p className="font-semibold text-neutral-900 dark:text-neutral-200">
                  ¿Cómo conocer tu linaje paterno directo?
                </p>
                <p>
                  Para determinar el haplogrupo del linaje paterno directo de tu familia, puedes solicitar el análisis genómico de un familiar biológico varón emparentado por línea paterna directa (tu padre, un hermano biológico de padre común, o un tío/primo paterno).
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400">
                    Cromosoma Y (Y-DNA Patrilineal)
                  </span>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                    Haplogrupo Paterno: {ancestry.paternal.haplogroup}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    {ancestry.paternal.subHaplogroup}
                  </p>
                </div>

                <div className="flex flex-col sm:items-end gap-1">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    <span>{ancestry.paternal.originDate}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <span>{ancestry.paternal.originLocation}</span>
                  </div>
                </div>
              </div>

              <div className="py-4">
                <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {ancestry.paternal.description}
                </p>
              </div>

              {/* Defining Y Markers */}
              {ancestry.paternal.definingMarkers && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl mb-6">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-2">
                    Marcadores SNPs clave en el cromosoma Y:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {ancestry.paternal.definingMarkers.map((marker, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-xs font-mono bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md text-blue-700 dark:text-blue-300"
                      >
                        {marker}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Chronological Migration Timeline */}
              {ancestry.paternal.migrationPath && (
                <div>
                  <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-4 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-500" />
                    Filogenia y Cronología Migratoria Paterna
                  </h4>

                  <div className="relative pl-6 space-y-6 border-l-2 border-blue-500/30 dark:border-blue-500/20 ml-3">
                    {ancestry.paternal.migrationPath.map((step, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white dark:bg-neutral-900 border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        </div>

                        <div className="p-4 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                            <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                              {step.step}
                              <ArrowRight className="w-3 h-3 text-neutral-400" />
                              <span className="text-xs font-normal text-blue-600 dark:text-blue-400">{step.region}</span>
                            </span>
                            <span className="text-[11px] font-mono text-neutral-500">
                              {step.period}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-1">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 4. NEANDERTHAL ADMIXTURE TAB */}
      {activeSubTab === 'neanderthal' && (
        <div className="space-y-6">
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400">
                  Homininos Arcaicos (Homo neanderthalensis)
                </span>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mt-1">
                  {ancestry.neanderthal.percentage}% de ADN Neandertal
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {ancestry.neanderthal.variantCount.toLocaleString()} variantes arcaicas detectadas de {ancestry.neanderthal.totalAnalyzedVariants.toLocaleString()} analizadas
                </p>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-right">
                <span className="text-[10px] font-mono text-amber-800 dark:text-amber-300 block">
                  Percentil Poblacional
                </span>
                <span className="text-lg font-mono font-bold text-amber-900 dark:text-amber-200">
                  +{ancestry.neanderthal.percentileComparedToAvg}%
                </span>
                <span className="text-[10px] text-amber-700 dark:text-amber-400 block">
                  más material que la media
                </span>
              </div>
            </div>

            <div className="py-4">
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                {ancestry.neanderthal.description}
              </p>
            </div>

            {/* Inherited Traits Card */}
            <div className="p-5 bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-200 dark:border-neutral-800 rounded-2xl space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-500" />
                Adaptaciones biológicas heredadas de introgresión neandertal
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ancestry.neanderthal.traitsInherited.map((trait, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{trait}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
