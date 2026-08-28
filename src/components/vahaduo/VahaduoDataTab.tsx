import React, { useState, useMemo, useRef } from 'react';
import { PRESET_DATASETS, filterG25DatasetText, parseG25Coordinates } from '../../utils/vahaduoMath';
import { PresetDataset } from '../../types/vahaduo';
import { Search, ArrowRightCircle, Copy, Check, Download, Layers, Info, Upload, Plus, Trash2, X, FileText, Database } from 'lucide-react';

interface VahaduoDataTabProps {
  onLoadSource: (text: string) => void;
  onAppendSource: (text: string) => void;
  onLoadTarget: (text: string) => void;
  currentSourceText: string;
}

export function VahaduoDataTab({
  onLoadSource,
  onAppendSource,
  onLoadTarget
}: VahaduoDataTabProps) {
  // Custom user-inserted datasets stored in localStorage
  const [customDatasets, setCustomDatasets] = useState<PresetDataset[]>(() => {
    try {
      const saved = localStorage.getItem('vahaduo_custom_datasets');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const allDatasets = useMemo(() => {
    return [...PRESET_DATASETS, ...customDatasets];
  }, [customDatasets]);

  const [selectedPresetId, setSelectedPresetId] = useState<string>(() => {
    return customDatasets[0]?.id || '';
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newBaseName, setNewBaseName] = useState<string>('');
  const [newBaseCategory, setNewBaseCategory] = useState<string>('Personalizada');
  const [newBaseText, setNewBaseText] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedPreset = useMemo(() => {
    if (!allDatasets.length) return null;
    return allDatasets.find((d) => d.id === selectedPresetId) || allDatasets[0];
  }, [allDatasets, selectedPresetId]);

  // Apply advanced filter query to the preset's raw text
  const filteredText = useMemo(() => {
    if (!selectedPreset) return '';
    return filterG25DatasetText(selectedPreset.rawG25Text || '', searchQuery);
  }, [selectedPreset, searchQuery]);

  const parsedSamples = useMemo(() => {
    return parseG25Coordinates(filteredText);
  }, [filteredText]);

  const handleCopy = () => {
    if (!filteredText) return;
    navigator.clipboard.writeText(filteredText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!selectedPreset || !filteredText) return;
    const blob = new Blob([filteredText], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedPreset.id}_filtered.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Handle direct file upload from file picker
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = (event.target?.result as string) || '';
      const baseName = file.name.replace(/\.[^/.]+$/, '');
      const parsed = parseG25Coordinates(content);

      const newDataset: PresetDataset = {
        id: `custom_${Date.now()}`,
        name: baseName || 'Base Personalizada .txt',
        category: 'Archivo .TXT',
        description: `Importado desde archivo ${file.name} (${parsed.length} muestras G25).`,
        sampleCount: parsed.length,
        rawG25Text: content.trim()
      };

      const updated = [newDataset, ...customDatasets];
      setCustomDatasets(updated);
      try {
        localStorage.setItem('vahaduo_custom_datasets', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      setSelectedPresetId(newDataset.id);
      setIsModalOpen(false);
      setNewBaseText('');
      setNewBaseName('');
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSaveCustomBase = () => {
    if (!newBaseText.trim()) return;
    const parsed = parseG25Coordinates(newBaseText);
    const id = `custom_${Date.now()}`;
    const name = newBaseName.trim() || `Base Personalizada ${customDatasets.length + 1}`;

    const newDataset: PresetDataset = {
      id,
      name,
      category: newBaseCategory.trim() || 'Personalizada',
      description: `Base personalizada creada con ${parsed.length} coordenadas G25.`,
      sampleCount: parsed.length,
      rawG25Text: newBaseText.trim()
    };

    const updated = [newDataset, ...customDatasets];
    setCustomDatasets(updated);
    try {
      localStorage.setItem('vahaduo_custom_datasets', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    setSelectedPresetId(id);
    setIsModalOpen(false);
    setNewBaseText('');
    setNewBaseName('');
  };

  const handleDeleteCustomDataset = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = customDatasets.filter((d) => d.id !== id);
    setCustomDatasets(updated);
    try {
      localStorage.setItem('vahaduo_custom_datasets', JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    if (selectedPresetId === id) {
      setSelectedPresetId(updated[0]?.id || '');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Bar: Action to Insert custom .txt bases */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
        <div>
          <h3 className="font-bold text-xs text-neutral-900 dark:text-white uppercase tracking-wider font-mono">
            Bases de Coordenadas G25
          </h3>
          <p className="text-[11px] text-neutral-500 font-mono">
            Inserta tus propios archivos .txt con coordenadas G25 o pega colecciones de muestras
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.csv"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-3.5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            title="Importar archivo .txt o .csv con coordenadas G25"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>INSERTAR ARCHIVO .TXT</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-mono text-xs border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
            title="Pegar texto de coordenadas para crear una base"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>PEGAR BASE</span>
          </button>
        </div>
      </div>

      {/* Dataset Selector Cards or Empty Prompt */}
      {allDatasets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {allDatasets.map((preset) => {
            const isSelected = preset.id === selectedPresetId;
            const isCustom = preset.id.startsWith('custom_');

            return (
              <div
                key={preset.id}
                onClick={() => {
                  setSelectedPresetId(preset.id);
                  setSearchQuery('');
                }}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between gap-2 cursor-pointer relative group ${
                  isSelected
                    ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-xs'
                    : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${
                      isSelected
                        ? 'bg-neutral-800 dark:bg-neutral-200 text-white dark:text-black border-transparent'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                    }`}>
                      {preset.category}
                    </span>
                    
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[11px] font-mono ${isSelected ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-500'}`}>
                        {preset.sampleCount} pops
                      </span>
                      {isCustom && (
                        <button
                          onClick={(e) => handleDeleteCustomDataset(preset.id, e)}
                          className={`p-1 rounded hover:text-red-500 transition-colors ${
                            isSelected ? 'text-neutral-400 hover:text-red-400' : 'text-neutral-400'
                          }`}
                          title="Eliminar base personalizada"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <h4 className="font-bold text-xs mt-2 truncate">
                    {preset.name}
                  </h4>
                </div>
                <p className={`text-[11px] line-clamp-2 ${isSelected ? 'text-neutral-300 dark:text-neutral-700' : 'text-neutral-500 dark:text-neutral-400'}`}>
                  {preset.description}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 sm:p-12 bg-white dark:bg-neutral-900 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center space-y-3">
          <Database className="w-10 h-10 text-neutral-400 dark:text-neutral-600" />
          <h4 className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
            No hay bases de datos cargadas
          </h4>
          <p className="text-xs font-mono text-neutral-500 max-w-md">
            Haz clic en <strong>INSERTAR ARCHIVO .TXT</strong> o <strong>PEGAR BASE</strong> para añadir tus propios archivos de coordenadas G25 (formato <code>Nombre,c1,c2,...,c25</code>).
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-mono text-xs font-bold hover:opacity-90 cursor-pointer shadow-xs"
            >
              Cargar Archivo .txt
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-mono text-xs font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
            >
              Pegar Texto
            </button>
          </div>
        </div>
      )}

      {/* Dataset Filter & Action Controls Bar */}
      {selectedPreset && (
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Advanced Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar sintaxis: !excluir, ?prefijo, palabras..."
                className="w-full pl-9 pr-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-hidden"
              />
            </div>

            {/* Action transfer buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onLoadSource(filteredText)}
                disabled={!parsedSamples.length}
                className="px-3.5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 disabled:opacity-40 font-mono text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                title="Cargar como SOURCE reemplazando el contenido actual"
              >
                <ArrowRightCircle className="w-3.5 h-3.5" />
                <span>SOURCE</span>
              </button>

              <button
                onClick={() => onAppendSource(filteredText)}
                disabled={!parsedSamples.length}
                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-mono text-xs border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Añadir a SOURCE sin borrar lo que ya tienes"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>+ AÑADIR</span>
              </button>

              <button
                onClick={() => onLoadTarget(filteredText)}
                disabled={!parsedSamples.length}
                className="px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-mono text-xs border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 transition-all cursor-pointer"
                title="Cargar como TARGET"
              >
                <ArrowRightCircle className="w-3.5 h-3.5" />
                <span>TARGET</span>
              </button>

              <button
                onClick={handleCopy}
                disabled={!parsedSamples.length}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                title="Copiar texto filtrado"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleDownload}
                disabled={!parsedSamples.length}
                className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                title="Descargar archivo .txt"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Counter and Syntax Guide */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] font-mono text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800 gap-1">
            <div className="flex items-center gap-1.5">
              <Info className="w-3 h-3 text-neutral-400" />
              <span>Muestras filtradas: <strong>{parsedSamples.length}</strong> de {selectedPreset?.sampleCount || 0}</span>
            </div>
            <div className="text-[10px] text-neutral-400">
              Sintaxis: <code>!palabra</code> (excluir), <code>?prefijo</code> (comienza por), <code>espacio</code> (AND)
            </div>
          </div>
        </div>
      )}

      {/* Filtered Textarea Preview */}
      {selectedPreset && (
        <div className="relative">
          <textarea
            readOnly
            value={filteredText}
            rows={14}
            spellCheck={false}
            className="w-full p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-mono text-neutral-800 dark:text-neutral-200 focus:outline-hidden leading-relaxed resize-y select-all"
          />
          <div className="absolute bottom-3 right-3 text-[10px] font-mono text-neutral-500 bg-white dark:bg-neutral-900 px-2.5 py-1 rounded-md border border-neutral-200 dark:border-neutral-800 shadow-xs">
            Líneas: {parsedSamples.length}
          </div>
        </div>
      )}

      {/* Modal for Inserting custom coordinates text */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-2xl p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
                <h3 className="font-mono font-bold text-sm text-neutral-900 dark:text-white">
                  Insertar Base Personalizada de Coordenadas G25
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Nombre de la Base:</label>
                  <input
                    type="text"
                    value={newBaseName}
                    onChange={(e) => setNewBaseName(e.target.value)}
                    placeholder="Ej. Mi Colección Ibérica"
                    className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Categoría:</label>
                  <input
                    type="text"
                    value={newBaseCategory}
                    onChange={(e) => setNewBaseCategory(e.target.value)}
                    placeholder="Ej. Personalizada, Hierro, etc."
                    className="w-full p-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">
                  Coordenadas G25 (Formato: Nombre,c1,c2,...,c25):
                </label>
                <textarea
                  rows={8}
                  value={newBaseText}
                  onChange={(e) => setNewBaseText(e.target.value)}
                  placeholder={`Muestra_1,0.125,0.142,0.052,0.018,0.042,...\nMuestra_2,0.119,0.147,0.042,-0.007,0.044,...`}
                  className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-mono text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveCustomBase}
                disabled={!newBaseText.trim()}
                className="px-4 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black font-mono text-xs font-bold hover:opacity-90 disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Guardar Base
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
