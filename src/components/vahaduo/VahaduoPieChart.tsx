import React, { useState, useEffect } from 'react';
import { SingleAdmixtureComponent } from '../../types/vahaduo';

interface VahaduoPieChartProps {
  components: SingleAdmixtureComponent[];
  targetName: string;
  distance: number;
}

export function VahaduoPieChart({ components, targetName, distance }: VahaduoPieChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });

  useEffect(() => {
    const checkTheme = () => {
      if (typeof document !== 'undefined') {
        setIsDark(document.documentElement.classList.contains('dark'));
      }
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const filtered = components.filter((c) => c.percentage > 0);
  const total = filtered.reduce((acc, c) => acc + c.percentage, 0);

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-neutral-500 font-mono text-xs">
        No hay componentes activos para graficar
      </div>
    );
  }

  // Calculate SVG arc paths
  const size = 320;
  const center = size / 2;
  const radius = size * 0.42;
  const innerRadius = size * 0.22; // Donut style for ultra-clean look

  let cumulativeAngle = -Math.PI / 2; // Start from top 12 o'clock

  const slices = filtered.map((item, idx) => {
    const fraction = item.percentage / total;
    const isFullCircle = fraction >= 0.9999 || filtered.length === 1;
    const angle = isFullCircle ? 2 * Math.PI : fraction * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + angle;
    cumulativeAngle = endAngle;

    let pathData = '';
    let lx = center;
    let ly = center - (radius + innerRadius) / 2;

    if (isFullCircle) {
      // Seamless full 360-degree donut ring using two 180-deg semi-circular arcs
      const topOuterY = center - radius;
      const botOuterY = center + radius;
      const topInnerY = center - innerRadius;
      const botInnerY = center + innerRadius;

      pathData = `
        M ${center} ${topOuterY}
        A ${radius} ${radius} 0 1 1 ${center} ${botOuterY}
        A ${radius} ${radius} 0 1 1 ${center} ${topOuterY}
        M ${center} ${topInnerY}
        A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${botInnerY}
        A ${innerRadius} ${innerRadius} 0 1 0 ${center} ${topInnerY}
        Z
      `;
      lx = center;
      ly = center - (radius + innerRadius) / 2;
    } else {
      // Outer arc points
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);

      // Inner arc points
      const ix1 = center + innerRadius * Math.cos(endAngle);
      const iy1 = center + innerRadius * Math.sin(endAngle);
      const ix2 = center + innerRadius * Math.cos(startAngle);
      const iy2 = center + innerRadius * Math.sin(startAngle);

      const largeArc = angle > Math.PI ? 1 : 0;

      // SVG path for donut slice
      pathData = `
        M ${x1} ${y1}
        A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
        L ${ix1} ${iy1}
        A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix2} ${iy2}
        Z
      `;

      // Midpoint for label
      const midAngle = startAngle + angle / 2;
      const labelRadius = radius * 0.72;
      lx = center + labelRadius * Math.cos(midAngle);
      ly = center + labelRadius * Math.sin(midAngle);
    }

    return {
      ...item,
      pathData,
      color: item.color || '#4f46e5',
      fraction,
      lx,
      ly,
      isLargeEnoughForLabel: fraction > 0.06 || isFullCircle
    };
  });

  const centerBg = isDark ? '#111113' : '#ffffff';
  const centerBorder = isDark ? '#27272a' : '#e4e4e7';
  const centerLabel = isDark ? '#a1a1aa' : '#71717a';
  const centerVal = isDark ? '#ffffff' : '#09090b';

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white shadow-xs">
      {/* Interactive Pie SVG */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="drop-shadow-md"
        >
          {slices.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g key={slice.sourceName}>
                <path
                  d={slice.pathData}
                  fill={slice.color}
                  stroke={isDark ? '#171717' : '#ffffff'}
                  strokeWidth="2"
                  style={{
                    opacity: hoveredIdx !== null && !isHovered ? 0.45 : 1,
                    transform: isHovered ? 'scale(1.03)' : 'scale(1)',
                    transformOrigin: `${center}px ${center}px`,
                    transition: 'all 0.2s ease-out',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
                {slice.isLargeEnoughForLabel && (
                  <text
                    x={slice.lx}
                    y={slice.ly}
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    style={{
                      fontFamily: 'monospace',
                      filter: 'drop-shadow(0px 1px 2px rgba(0,0,0,0.9))',
                      pointerEvents: 'none'
                    }}
                  >
                    {slice.percentage.toFixed(2)}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Central Donut Hole Info with Explicit Safe SVG Colors */}
          <circle
            cx={center}
            cy={center}
            r={innerRadius - 2}
            fill={centerBg}
            stroke={centerBorder}
            strokeWidth="1.5"
          />
          <text
            x={center}
            y={center - 10}
            fill={centerLabel}
            fontSize="9"
            fontWeight="bold"
            letterSpacing="0.05em"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: 'monospace' }}
          >
            DISTANCIA G25
          </text>
          <text
            x={center}
            y={center + 10}
            fill={centerVal}
            fontSize="13.5"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontFamily: 'monospace' }}
          >
            {(distance * 100).toFixed(4)}%
          </text>
        </svg>

        {/* Floating Tooltip when hovering slice */}
        {hoveredIdx !== null && (
          <div className="absolute -bottom-2 bg-neutral-900 text-white dark:bg-white dark:text-black border border-neutral-700 dark:border-neutral-200 px-3 py-1 rounded-full text-xs font-mono shadow-xl z-20">
            {slices[hoveredIdx].sourceName}: <span className="font-bold">{slices[hoveredIdx].percentage.toFixed(2)}%</span>
          </div>
        )}
      </div>

      {/* Breakdown Legend with Custom Color Swatches */}
      <div className="flex-1 w-full space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <span className="text-xs font-mono uppercase tracking-widest text-neutral-900 dark:text-white font-bold">
            Poblaciones Fuente (Desglose Admixture)
          </span>
          <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
            Objetivo: <strong className="text-neutral-900 dark:text-white">{targetName}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
          {slices.map((slice, idx) => (
            <div
              key={slice.sourceName}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                hoveredIdx === idx
                  ? 'bg-neutral-100 dark:bg-neutral-800 border-black dark:border-white shadow-xs'
                  : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700'
              }`}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate" title={slice.sourceName}>
                  {slice.sourceName}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-neutral-900 dark:text-white ml-2 shrink-0">
                {slice.percentage.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-neutral-500 border-t border-neutral-200 dark:border-neutral-800">
          <span>Total suma: <strong className="text-neutral-800 dark:text-neutral-200">{total.toFixed(2)}%</strong></span>
          <span>Modelo: Non-Negative Least Squares (25-dim)</span>
        </div>
      </div>
    </div>
  );
}
