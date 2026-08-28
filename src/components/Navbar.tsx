import { Moon, Sun, Download, RefreshCw, Cpu, Dna } from 'lucide-react';
import { ThemeMode } from '../App';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '../i18n/LanguageContext';

interface NavbarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onReset: () => void;
  onExport: () => void;
  hasResults: boolean;
  fileName?: string;
  isVahaduoActive?: boolean;
  onToggleVahaduo?: () => void;
}

export function Navbar({
  theme,
  onThemeChange,
  onReset,
  onExport,
  hasResults,
  fileName,
  isVahaduoActive,
  onToggleVahaduo
}: NavbarProps) {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Brand identity - Clicking resets and takes user to home as initial state */}
        <button
          id="btn-brand-home"
          onClick={onReset}
          className="flex items-center gap-3 cursor-pointer group text-left transition-opacity hover:opacity-80 focus:outline-hidden"
          title="Ir al Inicio / Reiniciar Kit"
        >
          {/* Concentric Circle Logo Icon */}
          <div className="w-6 h-6 rounded-full bg-black dark:bg-white flex items-center justify-center p-1 shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-white dark:bg-black flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-black dark:bg-white"></div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight text-base sm:text-lg font-mono">
              {t('nav.brand')}
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-800">
              V1.0
            </span>
          </div>
        </button>

        {/* Center mode indicator */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 text-[11px] font-medium text-neutral-600 dark:text-neutral-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>{t('nav.localPrivacy')}</span>
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-2.5">
          {/* Quick Vahaduo G25 Suite toggle button */}
          {onToggleVahaduo && (
            <button
              id="btn-navbar-vahaduo-toggle"
              onClick={onToggleVahaduo}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono font-semibold rounded-full transition-all border cursor-pointer ${
                isVahaduoActive
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-xs'
                  : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
              title="Alternar entre Vahaduo G25 Suite y Análisis SNP"
            >
              {isVahaduoActive ? <Dna className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
              <span>{isVahaduoActive ? t('nav.seeGenome') : t('nav.vahaduo')}</span>
            </button>
          )}

          {hasResults && !isVahaduoActive && (
            <>
              <button
                id="btn-export-report"
                onClick={onExport}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-full bg-black dark:bg-white text-white dark:text-black hover:opacity-85 transition-opacity cursor-pointer shadow-xs"
                title="Exportar informe o imprimir"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.export')}</span>
              </button>

              <button
                id="btn-reset-analysis"
                onClick={onReset}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-full text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-900 border border-transparent hover:border-neutral-200 dark:border-neutral-800 transition-colors cursor-pointer"
                title="Cargar otro archivo"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t('nav.newKit')}</span>
              </button>
            </>
          )}

          {/* Theme Selector (Claro vs Oscuro) with crystal clear active state */}
          <div className="flex items-center bg-neutral-100 dark:bg-neutral-900 p-1 rounded-full border border-neutral-200 dark:border-neutral-800">
            <button
              id="theme-light-btn"
              onClick={() => onThemeChange('light')}
              className={`px-2.5 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer font-mono font-medium ${
                theme === 'light'
                  ? 'bg-white text-black shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
              title="Activar Modo Claro"
            >
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[11px]">{t('nav.light')}</span>
            </button>
            <button
              id="theme-dark-btn"
              onClick={() => onThemeChange('dark')}
              className={`px-2.5 py-1 rounded-full text-xs transition-all flex items-center gap-1.5 cursor-pointer font-mono font-medium ${
                theme === 'dark'
                  ? 'bg-neutral-800 text-white shadow-xs font-bold'
                  : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
              }`}
              title="Activar Modo Oscuro"
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px]">{t('nav.dark')}</span>
            </button>
          </div>

          {/* Language Selector placed to the right of dark mode */}
          <LanguageSelector />
        </div>

      </div>
    </header>
  );
}

