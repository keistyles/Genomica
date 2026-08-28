import React, { useState, useMemo } from 'react';
import { VahaduoTab, G25Sample, DistanceGradientThresholds, DEFAULT_GRADIENT_THRESHOLDS } from '../../types/vahaduo';
import {
  parseG25Coordinates,
  DEFAULT_SOURCE_COORDS,
  DEFAULT_TARGET_COORDS
} from '../../utils/vahaduoMath';
import { VahaduoDataTab } from './VahaduoDataTab';
import { VahaduoSourceTab } from './VahaduoSourceTab';
import { VahaduoTargetTab } from './VahaduoTargetTab';
import { VahaduoDistanceTab } from './VahaduoDistanceTab';
import { VahaduoOracleTab } from './VahaduoOracleTab';
import { VahaduoSingleTab } from './VahaduoSingleTab';
import { VahaduoMultiTab } from './VahaduoMultiTab';
import { VahaduoPcaTab } from './VahaduoPcaTab';
import {
  Database,
  FileCode,
  Target,
  Compass,
  Sparkles,
  Sliders,
  Table,
  Orbit,
  ArrowLeft,
  Activity,
  Cpu
} from 'lucide-react';

interface VahaduoG25SuiteProps {
  onBackToGenome?: () => void;
}

export function VahaduoG25Suite({ onBackToGenome }: VahaduoG25SuiteProps) {
  const [activeTab, setActiveTab] = useState<VahaduoTab>('DATA');
  const [sourceText, setSourceText] = useState<string>(DEFAULT_SOURCE_COORDS);
  const [targetText, setTargetText] = useState<string>(DEFAULT_TARGET_COORDS);
  const [customColors, setCustomColors] = useState<Record<string, string>>({});
  const [gradientThresholds, setGradientThresholds] = useState<DistanceGradientThresholds>(DEFAULT_GRADIENT_THRESHOLDS);

  // Parse current coordinates
  const parsedSources = useMemo(() => {
    const raw = parseG25Coordinates(sourceText);
    return raw.map((s) => ({
      ...s,
      color: customColors[s.name] || s.color
    }));
  }, [sourceText, customColors]);

  const parsedTargets = useMemo(() => {
    return parseG25Coordinates(targetText);
  }, [targetText]);

  const handleColorChange = (sourceName: string, color: string) => {
    setCustomColors((prev) => ({
      ...prev,
      [sourceName]: color
    }));
  };

  const handleAppendSource = (text: string) => {
    setSourceText((prev) => {
      const cleanPrev = prev.trim();
      const cleanNew = text.trim();
      return cleanPrev ? `${cleanPrev}\n${cleanNew}` : cleanNew;
    });
    setActiveTab('SOURCE');
  };

  const handleLoadSource = (text: string) => {
    setSourceText(text);
    setActiveTab('SOURCE');
  };

  const handleLoadTarget = (text: string) => {
    setTargetText(text);
    setActiveTab('TARGET');
  };

  const tabs: { id: VahaduoTab; label: string; icon: React.ReactNode }[] = [
    { id: 'DATA', label: 'DATA', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'SOURCE', label: 'SOURCE', icon: <FileCode className="w-3.5 h-3.5" /> },
    { id: 'TARGET', label: 'TARGET', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'DISTANCE', label: 'DISTANCE', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'ORACLE', label: 'ORACLE', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'SINGLE', label: 'SINGLE', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'MULTI', label: 'MULTI', icon: <Table className="w-3.5 h-3.5" /> },
    { id: 'PCA', label: 'PCA', icon: <Orbit className="w-3.5 h-3.5" /> }
  ];

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card matching the global design */}
      <div className="p-5 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {onBackToGenome && (
            <button
              onClick={onBackToGenome}
              className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-700 transition-all flex items-center gap-1.5 text-xs font-mono"
              title="Volver al analizador de SNP"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Volver</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-white" />
              <h1 className="text-base sm:text-lg font-bold font-mono tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                <span>VAHADUO G25 TOOLS</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                  JS Suite v3.2
                </span>
              </h1>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
              Bioinformática de Genética de Poblaciones · Algoritmos Admixture NNLS y N-Way Oracle
            </p>
          </div>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
            <Cpu className="w-3.5 h-3.5 text-neutral-500" />
            <span>MÉTRICA: <strong>EUCLIDEAN (25D)</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-50 dark:bg-neutral-950 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-700 dark:text-neutral-300">
            <Activity className="w-3.5 h-3.5 text-emerald-500" />
            <span>{parsedSources.length} Sources / {parsedTargets.length} Targets</span>
          </div>
        </div>
      </div>

      {/* Top 7-Tab Navigation Bar */}
      <div className="bg-neutral-100 dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-1.5 overflow-x-auto">
        <div className="flex items-center min-w-max gap-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`btn-vahaduo-tab-${tab.id.toLowerCase()}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 rounded-lg text-xs font-mono font-bold uppercase transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Rendering */}
      <div className="min-h-[500px]">
        {activeTab === 'DATA' && (
          <VahaduoDataTab
            onLoadSource={handleLoadSource}
            onAppendSource={handleAppendSource}
            onLoadTarget={handleLoadTarget}
            currentSourceText={sourceText}
          />
        )}

        {activeTab === 'SOURCE' && (
          <VahaduoSourceTab
            sourceText={sourceText}
            onSourceTextChange={setSourceText}
            customColors={customColors}
            onColorChange={handleColorChange}
          />
        )}

        {activeTab === 'TARGET' && (
          <VahaduoTargetTab
            targetText={targetText}
            onTargetTextChange={setTargetText}
          />
        )}

        {activeTab === 'DISTANCE' && (
          <VahaduoDistanceTab
            targets={parsedTargets}
            sources={parsedSources}
            gradientThresholds={gradientThresholds}
            onGradientThresholdsChange={setGradientThresholds}
          />
        )}

        {activeTab === 'ORACLE' && (
          <VahaduoOracleTab
            targets={parsedTargets}
            sources={parsedSources}
            gradientThresholds={gradientThresholds}
            onGradientThresholdsChange={setGradientThresholds}
          />
        )}

        {activeTab === 'SINGLE' && (
          <VahaduoSingleTab
            targets={parsedTargets}
            sources={parsedSources}
            customColors={customColors}
            onColorChange={handleColorChange}
          />
        )}

        {activeTab === 'MULTI' && (
          <VahaduoMultiTab
            targets={parsedTargets}
            sources={parsedSources}
            customColors={customColors}
          />
        )}

        {activeTab === 'PCA' && (
          <VahaduoPcaTab
            targets={parsedTargets}
            sources={parsedSources}
            customColors={customColors}
            onColorChange={handleColorChange}
          />
        )}
      </div>
    </div>
  );
}
