import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { G25Sample } from '../../types/vahaduo';
import { parseG25Coordinates } from '../../utils/vahaduoMath';
import { buildPcaPopulationGroups, Point2D } from '../../utils/vahaduoPca';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  EyeOff,
  Download,
  Search,
  Palette,
  Info,
  Maximize2,
  Minimize2,
  Scaling,
  Crosshair
} from 'lucide-react';

interface VahaduoPcaTabProps {
  targets: G25Sample[];
  sources: G25Sample[];
  customColors: Record<string, string>;
  onColorChange: (sourceName: string, color: string) => void;
}

export function VahaduoPcaTab({
  targets,
  sources,
  customColors,
  onColorChange
}: VahaduoPcaTabProps) {
  // Dimensions for X and Y axes (0 = PC1, 1 = PC2, ..., 24 = PC25)
  const [xDim, setXDim] = useState<number>(0);
  const [yDim, setYDim] = useState<number>(1);
  const [invertX, setInvertX] = useState<boolean>(false);
  const [invertY, setInvertY] = useState<boolean>(false);

  // Scale mode: ISOTROPIC (1:1 true Euclidean metric) vs AUTO_FIT (prevents point crowding/saturation)
  const [scaleMode, setScaleMode] = useState<'ISOTROPIC' | 'AUTO_FIT'>('ISOTROPIC');

  // Visual toggles
  const [showHulls, setShowHulls] = useState<boolean>(true);
  const [showCentroids, setShowCentroids] = useState<boolean>(true);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showIndividualDots, setShowIndividualDots] = useState<boolean>(true);
  const [showLines, setShowLines] = useState<boolean>(true);
  const [showTargets, setShowTargets] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [groupByPrefix, setGroupByPrefix] = useState<boolean>(true);

  // Full-screen state
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Custom coordinate input from top bar (like in vahaduo g25views/#Custom)
  const [customInputText, setCustomInputText] = useState<string>('');
  const [customSamples, setCustomSamples] = useState<G25Sample[]>([]);

  // Hidden population groups set (for toggling in legend)
  const [hiddenGroups, setHiddenGroups] = useState<Set<string>>(new Set());
  const [legendSearch, setLegendSearch] = useState<string>('');

  // Hover state for tooltip
  const [hoveredItem, setHoveredItem] = useState<{
    name: string;
    group: string;
    x: number;
    y: number;
    screenX: number;
    screenY: number;
    isTarget?: boolean;
  } | null>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mainWrapperRef = useRef<HTMLDivElement | null>(null);

  // Listen for native fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNativeFs = Boolean(document.fullscreenElement);
      if (!isNativeFs && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (mainWrapperRef.current?.requestFullscreen) {
        mainWrapperRef.current.requestFullscreen().catch(() => {
          setIsFullscreen(true);
        });
      }
      setIsFullscreen(true);
    } else {
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {
          setIsFullscreen(false);
        });
      }
      setIsFullscreen(false);
    }
  };

  // Parse custom coordinate string if entered
  const handleApplyCustomInput = () => {
    if (!customInputText.trim()) {
      setCustomSamples([]);
      return;
    }
    const parsed = parseG25Coordinates(customInputText);
    if (parsed.length > 0) {
      setCustomSamples(parsed);
    }
  };

  // Build population groups
  const populationGroups = useMemo(() => {
    return buildPcaPopulationGroups(sources, xDim, yDim, groupByPrefix, customColors);
  }, [sources, xDim, yDim, groupByPrefix, customColors]);

  // Combine targets and any custom sample(s)
  const activeTargets = useMemo(() => {
    const list = [...targets, ...customSamples];
    return list;
  }, [targets, customSamples]);

  // Calculate global bounding box for data
  const dataBounds = useMemo(() => {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    let hasData = false;

    // From sources
    for (const group of populationGroups) {
      if (hiddenGroups.has(group.name)) continue;
      for (const p of group.points) {
        hasData = true;
        const px = invertX ? -p.x : p.x;
        const py = invertY ? -p.y : p.y;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }
    }

    // From targets
    if (showTargets) {
      for (const t of activeTargets) {
        hasData = true;
        const rawX = t.coords[xDim] !== undefined ? t.coords[xDim] : 0;
        const rawY = t.coords[yDim] !== undefined ? t.coords[yDim] : 0;
        const px = invertX ? -rawX : rawX;
        const py = invertY ? -rawY : rawY;
        if (px < minX) minX = px;
        if (px > maxX) maxX = px;
        if (py < minY) minY = py;
        if (py > maxY) maxY = py;
      }
    }

    if (!hasData) {
      return { minX: -0.05, maxX: 0.05, minY: -0.05, maxY: 0.05 };
    }

    // Add balanced 8% margin around bounds to avoid edge clipping
    const rawSpanX = Math.max(maxX - minX, 0.005);
    const rawSpanY = Math.max(maxY - minY, 0.005);
    const marginX = rawSpanX * 0.08;
    const marginY = rawSpanY * 0.08;

    return {
      minX: minX - marginX,
      maxX: maxX + marginX,
      minY: minY - marginY,
      maxY: maxY + marginY
    };
  }, [populationGroups, hiddenGroups, activeTargets, showTargets, xDim, yDim, invertX, invertY]);

  // Viewport dimensions
  const viewWidth = isFullscreen ? 1280 : 960;
  const viewHeight = isFullscreen ? 800 : 640;
  const padding = 55;

  const plotCenterX = viewWidth / 2;
  const plotCenterY = viewHeight / 2;
  const plotWidth = viewWidth - padding * 2;
  const plotHeight = viewHeight - padding * 2;

  // Midpoints & Spans for 1:1 aspect ratio mapping or Auto-fit
  const dataMidX = (dataBounds.minX + dataBounds.maxX) / 2;
  const dataMidY = (dataBounds.minY + dataBounds.maxY) / 2;
  const dataSpanX = Math.max(dataBounds.maxX - dataBounds.minX, 0.005);
  const dataSpanY = Math.max(dataBounds.maxY - dataBounds.minY, 0.005);

  // Scales for Isotropic vs Auto-Fit
  const isotropicScale = Math.min(plotWidth / dataSpanX, plotHeight / dataSpanY) * 0.92;
  const autoFitScaleX = (plotWidth / dataSpanX) * 0.92;
  const autoFitScaleY = (plotHeight / dataSpanY) * 0.92;

  const currentScaleX = (scaleMode === 'ISOTROPIC' ? isotropicScale : autoFitScaleX) * zoom;
  const currentScaleY = (scaleMode === 'ISOTROPIC' ? isotropicScale : autoFitScaleY) * zoom;

  // Dynamic marker sizing to prevent saturation on zoom
  const dotRadius = Math.max(1.6, 3.8 / Math.pow(zoom, 0.42));
  const centroidRadius = Math.max(2.4, 5.0 / Math.pow(zoom, 0.42));
  const targetDiamondSize = Math.max(3.2, 7.5 / Math.pow(zoom, 0.42));
  const labelFontSize = Math.max(7.5, 10 / Math.pow(zoom, 0.25));

  // Coordinate mapper from G25 PC to SVG viewport
  const mapToScreen = useCallback(
    (pcX: number, pcY: number): Point2D => {
      const adjX = invertX ? -pcX : pcX;
      const adjY = invertY ? -pcY : pcY;

      const screenX = plotCenterX + (adjX - dataMidX) * currentScaleX + pan.x;
      // Cartesian Y is inverted for screen (up is positive)
      const screenY = plotCenterY - (adjY - dataMidY) * currentScaleY + pan.y;

      return { x: screenX, y: screenY };
    },
    [invertX, invertY, dataMidX, dataMidY, currentScaleX, currentScaleY, pan.x, pan.y, plotCenterX, plotCenterY]
  );

  // Dynamic Cartesian Grid Generator
  const gridInfo = useMemo(() => {
    const visibleDataSpanX = viewWidth / currentScaleX;
    const rawStep = visibleDataSpanX / 9;

    const stepOptions = [0.0005, 0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5];
    let step = 0.05;
    for (const opt of stepOptions) {
      if (opt >= rawStep) {
        step = opt;
        break;
      }
    }

    const minVisibleX = dataMidX - (plotCenterX + pan.x) / currentScaleX;
    const maxVisibleX = dataMidX + (viewWidth - plotCenterX - pan.x) / currentScaleX;
    const minVisibleY = dataMidY - (viewHeight - plotCenterY - pan.y) / currentScaleY;
    const maxVisibleY = dataMidY + (plotCenterY + pan.y) / currentScaleY;

    const firstTickX = Math.floor(minVisibleX / step) * step;
    const lastTickX = Math.ceil(maxVisibleX / step) * step;
    const firstTickY = Math.floor(minVisibleY / step) * step;
    const lastTickY = Math.ceil(maxVisibleY / step) * step;

    const xTicks: number[] = [];
    for (let x = firstTickX; x <= lastTickX + 1e-7; x += step) {
      xTicks.push(Number(x.toFixed(6)));
    }

    const yTicks: number[] = [];
    for (let y = firstTickY; y <= lastTickY + 1e-7; y += step) {
      yTicks.push(Number(y.toFixed(6)));
    }

    return { step, xTicks, yTicks };
  }, [currentScaleX, currentScaleY, dataMidX, dataMidY, pan.x, pan.y, viewWidth, viewHeight, plotCenterX, plotCenterY]);

  // Reset zoom and pan to fit
  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom anchored to mouse position
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.18 : 0.85;
    const newZoom = Math.min(Math.max(zoom * zoomFactor, 0.15), 40);

    const scaleRatio = newZoom / zoom;
    const newPanX = mouseX - (mouseX - pan.x - plotCenterX) * scaleRatio - plotCenterX;
    const newPanY = mouseY - (mouseY - pan.y - plotCenterY) * scaleRatio - plotCenterY;

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  // Toggle population visibility
  const toggleGroupVisibility = (groupName: string) => {
    setHiddenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  const handleShowAll = () => setHiddenGroups(new Set());
  const handleHideAll = () => {
    const all = new Set(populationGroups.map((g) => g.name));
    setHiddenGroups(all);
  };

  // Filtered groups for legend search
  const filteredGroups = useMemo(() => {
    if (!legendSearch.trim()) return populationGroups;
    const q = legendSearch.toLowerCase().trim();
    return populationGroups.filter((g) => g.name.toLowerCase().includes(q));
  }, [populationGroups, legendSearch]);

  // Export SVG handler
  const handleExportSVG = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vahaduo_PCA_PC${xDim + 1}_vs_PC${yDim + 1}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Origin point on screen
  const originScreen = mapToScreen(0, 0);

  return (
    <div
      ref={mainWrapperRef}
      className={`space-y-4 animate-in fade-in duration-200 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-neutral-950 p-4 overflow-y-auto' : ''
      }`}
    >
      {/* Top Quick Coordinate Input Bar (as in vahaduo.github.io/g25views/#Custom) */}
      <div className="p-3.5 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-2">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-mono font-bold text-neutral-800 dark:text-neutral-200 shrink-0">
              CUSTOM G25:
            </span>
            <input
              type="text"
              value={customInputText}
              onChange={(e) => setCustomInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleApplyCustomInput()}
              placeholder="Pega coordenada (ej: Mi_Target,0.125,0.142,-0.021,0.015...)"
              className="flex-1 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-neutral-900 dark:focus:border-white focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleApplyCustomInput}
              disabled={!customInputText.trim()}
              className="px-4 py-1.5 rounded-lg bg-black dark:bg-white text-white dark:text-black font-mono text-xs font-bold hover:opacity-90 disabled:opacity-40 transition-all cursor-pointer shadow-xs"
            >
              TRAZAR
            </button>
            {customSamples.length > 0 && (
              <button
                onClick={() => {
                  setCustomSamples([]);
                  setCustomInputText('');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 font-mono text-xs hover:bg-red-200 transition-all cursor-pointer"
              >
                LIMPIAR ({customSamples.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main PCA Layout: Left Canvas/Controls + Right Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left 3 Cols: SVG Plot Stage & Toolbar */}
        <div className="lg:col-span-3 space-y-3">
          {/* PCA Toolbar Controls */}
          <div className="p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Dimension Selection & Scale Mode */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 font-bold">X:</span>
                <select
                  value={xDim}
                  onChange={(e) => setXDim(Number(e.target.value))}
                  className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 text-xs text-neutral-900 dark:text-white font-mono font-bold"
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <option key={i} value={i}>
                      PC {i + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setInvertX(!invertX)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    invertX
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-transparent shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  title="Invertir dirección eje X"
                >
                  INV
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-neutral-500 font-bold">Y:</span>
                <select
                  value={yDim}
                  onChange={(e) => setYDim(Number(e.target.value))}
                  className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-md px-2 py-1 text-xs text-neutral-900 dark:text-white font-mono font-bold"
                >
                  {Array.from({ length: 25 }).map((_, i) => (
                    <option key={i} value={i}>
                      PC {i + 1}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setInvertY(!invertY)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                    invertY
                      ? 'bg-neutral-900 dark:bg-white text-white dark:text-black border-transparent shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                  title="Invertir dirección eje Y"
                >
                  INV
                </button>
              </div>

              {/* Scale mode: Isotropic vs Auto-Fit */}
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-lg">
                <button
                  onClick={() => setScaleMode('ISOTROPIC')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    scaleMode === 'ISOTROPIC'
                      ? 'bg-white dark:bg-neutral-950 text-black dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
                  title="Escala isométrica 1:1 (Métrica euclidiana real)"
                >
                  1:1 Isótropo
                </button>
                <button
                  onClick={() => setScaleMode('AUTO_FIT')}
                  className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    scaleMode === 'AUTO_FIT'
                      ? 'bg-white dark:bg-neutral-950 text-black dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-black dark:hover:text-white'
                  }`}
                  title="Ajuste óptimo al lienzo (Evita saturación y dispersa puntos)"
                >
                  Auto-Ajuste
                </button>
              </div>
            </div>

            {/* Visual Feature Toggles */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setShowHulls(!showHulls)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                  showHulls
                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold border-transparent'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                }`}
                title="Mostrar u ocultar polígonos convexos (Convex Hulls)"
              >
                Hulls
              </button>

              <button
                onClick={() => setShowLabels(!showLabels)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                  showLabels
                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold border-transparent'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                }`}
                title="Mostrar nombres de poblaciones"
              >
                Etiquetas
              </button>

              <button
                onClick={() => setShowIndividualDots(!showIndividualDots)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                  showIndividualDots
                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold border-transparent'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                }`}
                title="Mostrar muestras individuales"
              >
                Muestras
              </button>

              <button
                onClick={() => setShowLines(!showLines)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                  showLines
                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold border-transparent'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                }`}
                title="Trazar líneas de muestra a centroide"
              >
                Líneas
              </button>

              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                  showGrid
                    ? 'bg-black dark:bg-white text-white dark:text-black font-bold border-transparent'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                }`}
                title="Mostrar cuadrícula cartesiana con ejes numéricos"
              >
                Grid
              </button>

              {activeTargets.length > 0 && (
                <button
                  onClick={() => setShowTargets(!showTargets)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                    showTargets
                      ? 'bg-black dark:bg-white text-white dark:text-black font-bold border-transparent'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                  }`}
                  title="Mostrar u ocultar Target(s)"
                >
                  Targets ({activeTargets.length})
                </button>
              )}
            </div>

            {/* Zoom, Fullscreen & Export Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom((z) => Math.min(z * 1.25, 40))}
                className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                title="Zoom in (+)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoom((z) => Math.max(z * 0.8, 0.15))}
                className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                title="Zoom out (-)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetView}
                className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                title="Restablecer vista centrada"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleFullscreen}
                className={`p-1.5 rounded-lg flex items-center gap-1 text-xs font-mono transition-all cursor-pointer ${
                  isFullscreen
                    ? 'bg-amber-500 text-black font-bold shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
                title="Pantalla Completa (Full Screen)"
              >
                {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isFullscreen ? 'Salir' : 'Pantalla Completa'}</span>
              </button>
              <button
                onClick={handleExportSVG}
                className="p-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                title="Exportar gráfica SVG de alta resolución"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG PCA Viewport Container */}
          <div
            ref={containerRef}
            className={`relative w-full bg-white dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-inner ${
              isFullscreen ? 'h-[75vh]' : 'h-[580px]'
            }`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            {sources.length === 0 && targets.length === 0 && customSamples.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2 text-neutral-500 font-mono">
                <Info className="w-8 h-8 text-neutral-400" />
                <p className="text-xs">No hay datos de coordenadas G25 para visualizar.</p>
                <p className="text-[11px] text-neutral-400">
                  Carga muestras en la pestaña DATA, SOURCE o TARGET para generar la proyección PCA.
                </p>
              </div>
            ) : (
              <svg
                ref={svgRef}
                viewBox={`0 0 ${viewWidth} ${viewHeight}`}
                className="w-full h-full"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  {/* Glow filter for Target diamonds */}
                  <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <clipPath id="plot-area">
                    <rect x="0" y="0" width={viewWidth} height={viewHeight} />
                  </clipPath>
                </defs>

                {/* 0. Precise Cartesian Grid & Axes (matching Vahaduo Views) */}
                {showGrid && (
                  <g className="opacity-30 dark:opacity-30">
                    {/* Vertical Grid Lines & Numbers */}
                    {gridInfo.xTicks.map((xVal, idx) => {
                      const screenPt = mapToScreen(xVal, 0);
                      const isZero = Math.abs(xVal) < 1e-7;
                      return (
                        <g key={`x_grid_${idx}`}>
                          <line
                            x1={screenPt.x}
                            y1={0}
                            x2={screenPt.x}
                            y2={viewHeight}
                            stroke={isZero ? 'currentColor' : '#888888'}
                            strokeWidth={isZero ? 1.5 : 0.75}
                            strokeDasharray={isZero ? undefined : '2 2'}
                            className={isZero ? 'text-neutral-900 dark:text-neutral-100 opacity-60' : ''}
                          />
                          <text
                            x={screenPt.x}
                            y={viewHeight - 8}
                            textAnchor="middle"
                            className="font-mono text-[9px] font-semibold fill-neutral-600 dark:fill-neutral-400 pointer-events-none"
                          >
                            {xVal.toFixed(3)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Horizontal Grid Lines & Numbers */}
                    {gridInfo.yTicks.map((yVal, idx) => {
                      const screenPt = mapToScreen(0, yVal);
                      const isZero = Math.abs(yVal) < 1e-7;
                      return (
                        <g key={`y_grid_${idx}`}>
                          <line
                            x1={0}
                            y1={screenPt.y}
                            x2={viewWidth}
                            y2={screenPt.y}
                            stroke={isZero ? 'currentColor' : '#888888'}
                            strokeWidth={isZero ? 1.5 : 0.75}
                            strokeDasharray={isZero ? undefined : '2 2'}
                            className={isZero ? 'text-neutral-900 dark:text-neutral-100 opacity-60' : ''}
                          />
                          <text
                            x={12}
                            y={screenPt.y + 3}
                            textAnchor="start"
                            className="font-mono text-[9px] font-semibold fill-neutral-600 dark:fill-neutral-400 pointer-events-none"
                          >
                            {yVal.toFixed(3)}
                          </text>
                        </g>
                      );
                    })}

                    {/* Prominent Crosshair at (0, 0) Origin */}
                    <circle
                      cx={originScreen.x}
                      cy={originScreen.y}
                      r={3}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.5}
                      className="text-neutral-700 dark:text-neutral-300 opacity-80"
                    />
                  </g>
                )}

                {/* 1. Population Convex Hulls (Polygons) */}
                {showHulls &&
                  populationGroups.map((group) => {
                    if (hiddenGroups.has(group.name)) return null;
                    if (group.hull.length < 3) return null;

                    const pathData = group.hull
                      .map((pt, idx) => {
                        const s = mapToScreen(pt.x, pt.y);
                        return `${idx === 0 ? 'M' : 'L'} ${s.x} ${s.y}`;
                      })
                      .join(' ') + ' Z';

                    return (
                      <path
                        key={`hull_${group.id}`}
                        d={pathData}
                        fill={group.color}
                        fillOpacity={0.16}
                        stroke={group.color}
                        strokeWidth={1.5}
                        strokeOpacity={0.8}
                        className="transition-all duration-150 hover:fill-opacity-30"
                      />
                    );
                  })}

                {/* 2. Population Spider Lines (sample to centroid) */}
                {showLines &&
                  populationGroups.map((group) => {
                    if (hiddenGroups.has(group.name)) return null;
                    const centerScreen = mapToScreen(group.centroid.x, group.centroid.y);

                    return group.points.map((pt, idx) => {
                      const ptScreen = mapToScreen(pt.x, pt.y);
                      return (
                        <line
                          key={`line_${group.id}_${idx}`}
                          x1={centerScreen.x}
                          y1={centerScreen.y}
                          x2={ptScreen.x}
                          y2={ptScreen.y}
                          stroke={group.color}
                          strokeWidth={0.8}
                          strokeOpacity={0.45}
                        />
                      );
                    });
                  })}

                {/* 3. Individual Sample Scatter Dots with anti-saturation radius */}
                {showIndividualDots &&
                  populationGroups.map((group) => {
                    if (hiddenGroups.has(group.name)) return null;

                    return group.samples.map((sample, idx) => {
                      const rawX = sample.coords[xDim] !== undefined ? sample.coords[xDim] : 0;
                      const rawY = sample.coords[yDim] !== undefined ? sample.coords[yDim] : 0;
                      const s = mapToScreen(rawX, rawY);

                      return (
                        <circle
                          key={`sample_${group.id}_${idx}`}
                          cx={s.x}
                          cy={s.y}
                          r={dotRadius}
                          fill={group.color}
                          stroke="#ffffff"
                          strokeWidth={0.8}
                          className="cursor-pointer hover:opacity-100 transition-all shadow-xs"
                          onMouseEnter={(e) => {
                            const rect = containerRef.current?.getBoundingClientRect();
                            setHoveredItem({
                              name: sample.name,
                              group: group.name,
                              x: rawX,
                              y: rawY,
                              screenX: e.clientX - (rect?.left || 0),
                              screenY: e.clientY - (rect?.top || 0),
                              isTarget: false
                            });
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        />
                      );
                    });
                  })}

                {/* 4. Population Centroids & Labels */}
                {populationGroups.map((group) => {
                  if (hiddenGroups.has(group.name)) return null;
                  const c = mapToScreen(group.centroid.x, group.centroid.y);

                  return (
                    <g key={`centroid_${group.id}`}>
                      {showCentroids && (
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r={centroidRadius}
                          fill={group.color}
                          stroke="#000000"
                          strokeWidth={1.5}
                          className="cursor-pointer shadow-sm transition-all"
                          onMouseEnter={(e) => {
                            const rect = containerRef.current?.getBoundingClientRect();
                            setHoveredItem({
                              name: `[Centroid] ${group.name}`,
                              group: group.name,
                              x: group.centroid.x,
                              y: group.centroid.y,
                              screenX: e.clientX - (rect?.left || 0),
                              screenY: e.clientY - (rect?.top || 0)
                            });
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        />
                      )}

                      {showLabels && (
                        <text
                          x={c.x}
                          y={c.y - (centroidRadius + 3)}
                          textAnchor="middle"
                          fill="currentColor"
                          style={{
                            fontSize: `${labelFontSize}px`,
                            paintOrder: 'stroke',
                            stroke: 'var(--color-bg-base, #ffffff)',
                            strokeWidth: 2.5
                          }}
                          className="font-mono font-bold fill-neutral-900 dark:fill-neutral-100 pointer-events-none drop-shadow-sm"
                        >
                          {group.name}
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* 5. Highlighted Target Samples (Diamond with glowing effect) */}
                {showTargets &&
                  activeTargets.map((target, idx) => {
                    const rawX = target.coords[xDim] !== undefined ? target.coords[xDim] : 0;
                    const rawY = target.coords[yDim] !== undefined ? target.coords[yDim] : 0;
                    const s = mapToScreen(rawX, rawY);
                    const td = targetDiamondSize;

                    return (
                      <g key={`target_${idx}`} className="cursor-pointer">
                        {/* Target Marker Pin / Star / Diamond */}
                        <polygon
                          points={`${s.x},${s.y - td * 1.2} ${s.x + td},${s.y} ${s.x},${s.y + td * 1.2} ${s.x - td},${s.y}`}
                          fill="#ef4444"
                          stroke="#ffffff"
                          strokeWidth={1.8}
                          filter="url(#glow)"
                          onMouseEnter={(e) => {
                            const rect = containerRef.current?.getBoundingClientRect();
                            setHoveredItem({
                              name: target.name,
                              group: 'TARGET',
                              x: rawX,
                              y: rawY,
                              screenX: e.clientX - (rect?.left || 0),
                              screenY: e.clientY - (rect?.top || 0),
                              isTarget: true
                            });
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        />
                        <text
                          x={s.x}
                          y={s.y + td * 1.2 + 9}
                          textAnchor="middle"
                          style={{
                            fontSize: `${Math.max(9, labelFontSize + 1)}px`,
                            paintOrder: 'stroke',
                            stroke: 'var(--color-bg-base, #ffffff)',
                            strokeWidth: 2.5
                          }}
                          className="font-mono font-extrabold fill-red-600 dark:fill-red-400 pointer-events-none drop-shadow-md"
                        >
                          ★ {target.name}
                        </text>
                      </g>
                    );
                  })}

                {/* Viewport Axis Labels */}
                <text
                  x={viewWidth - 15}
                  y={viewHeight - 20}
                  textAnchor="end"
                  className="font-mono text-[11px] font-bold fill-neutral-700 dark:fill-neutral-300"
                >
                  PC{xDim + 1} {invertX ? '(Invertido)' : ''} →
                </text>
                <text
                  x={15}
                  y={22}
                  textAnchor="start"
                  className="font-mono text-[11px] font-bold fill-neutral-700 dark:fill-neutral-300"
                >
                  ↑ PC{yDim + 1} {invertY ? '(Invertido)' : ''} ({scaleMode === 'ISOTROPIC' ? '1:1 Isótropo' : 'Auto-Ajuste'})
                </text>
              </svg>
            )}

            {/* Hover Tooltip Box */}
            {hoveredItem && (
              <div
                style={{
                  left: `${Math.min(hoveredItem.screenX + 15, viewWidth - 180)}px`,
                  top: `${Math.max(hoveredItem.screenY - 10, 10)}px`
                }}
                className="absolute pointer-events-none z-30 bg-black/95 text-white p-2.5 rounded-lg border border-neutral-700 shadow-xl font-mono text-[11px] space-y-0.5 max-w-xs animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="font-bold truncate text-yellow-300">
                  {hoveredItem.isTarget && '★ '}
                  {hoveredItem.name}
                </div>
                <div className="text-[10px] text-neutral-400">
                  Grupo: <strong>{hoveredItem.group}</strong>
                </div>
                <div className="text-[10px] text-neutral-300 flex justify-between gap-3 pt-0.5 border-t border-neutral-800">
                  <span>PC{xDim + 1}: {hoveredItem.x.toFixed(6)}</span>
                  <span>PC{yDim + 1}: {hoveredItem.y.toFixed(6)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Interactive Populations Legend & Color Customizer */}
        <div className="p-4 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
              <span className="text-xs font-mono uppercase font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-neutral-500" />
                Poblaciones ({populationGroups.length})
              </span>

              <div className="flex items-center gap-1 text-[10px] font-mono">
                <button
                  onClick={handleShowAll}
                  className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Todas
                </button>
                <button
                  onClick={handleHideAll}
                  className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Ninguna
                </button>
              </div>
            </div>

            {/* Search population in legend */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={legendSearch}
                onChange={(e) => setLegendSearch(e.target.value)}
                placeholder="Buscar población..."
                className="w-full pl-8 pr-2.5 py-1.5 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-xs font-mono text-neutral-900 dark:text-white focus:outline-hidden"
              />
            </div>

            {/* Population Items List with color picker & visibility toggle */}
            <div className="max-h-[400px] overflow-y-auto space-y-1.5 pr-1 divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredGroups.length === 0 ? (
                <div className="text-center text-xs font-mono text-neutral-400 py-4">
                  No se encontraron poblaciones.
                </div>
              ) : (
                filteredGroups.map((group) => {
                  const isVisible = !hiddenGroups.has(group.name);
                  return (
                    <div
                      key={group.id}
                      className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 group"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        {/* Interactive Color Box */}
                        <label
                          className="relative w-4 h-4 rounded-full shrink-0 cursor-pointer overflow-hidden border border-black/20 dark:border-white/20 shadow-2xs"
                          style={{ backgroundColor: group.color }}
                          title="Cambiar color personalizado"
                        >
                          <input
                            type="color"
                            value={group.color}
                            onChange={(e) => onColorChange(group.name, e.target.value)}
                            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                          />
                        </label>

                        {/* Population Name */}
                        <span
                          onClick={() => toggleGroupVisibility(group.name)}
                          className={`text-xs font-mono truncate cursor-pointer transition-colors ${
                            isVisible
                              ? 'text-neutral-900 dark:text-neutral-100 group-hover:text-neutral-600'
                              : 'text-neutral-400 dark:text-neutral-600 line-through'
                          }`}
                        >
                          {group.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded">
                          {group.samples.length}
                        </span>

                        <button
                          onClick={() => toggleGroupVisibility(group.name)}
                          className="p-1 rounded text-neutral-400 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                          title={isVisible ? 'Ocultar' : 'Mostrar'}
                        >
                          {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom Settings toggle (Group by prefix) */}
          <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-[11px] font-mono space-y-1.5 text-neutral-500">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={groupByPrefix}
                onChange={(e) => setGroupByPrefix(e.target.checked)}
                className="rounded accent-black dark:accent-white"
              />
              <span>Agrupar por prefijo de población</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
