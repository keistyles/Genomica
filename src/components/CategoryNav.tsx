import { Activity, Dna, Pill, User, HeartPulse, Globe, Cpu, Search, Filter } from 'lucide-react';
import { TraitCategory } from '../types/genetics';
import { useLanguage } from '../i18n/LanguageContext';

interface CategoryNavProps {
  selectedCategory: TraitCategory | 'all';
  onSelectCategory: (category: TraitCategory | 'all') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  countsByCategory: Record<string, number>;
}

export function CategoryNav({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  countsByCategory
}: CategoryNavProps) {
  const { t } = useLanguage();

  const categories: { id: TraitCategory; label: string; icon: typeof Activity; description: string }[] = [
    {
      id: 'health_vulnerability',
      label: t('category.health_vulnerability', 'Vulnerabilidad a condiciones de salud'),
      icon: Activity,
      description: t('category.health_vulnerability_desc', 'Riesgo poligénico para enfermedades complejas y cardiovasculares')
    },
    {
      id: 'hereditary_conditions',
      label: t('category.hereditary_conditions', 'Condiciones hereditarias'),
      icon: Dna,
      description: t('category.hereditary_conditions_desc', 'Estado de portador monogénico y variantes autosómicas')
    },
    {
      id: 'pharmacology',
      label: t('category.pharmacology', 'Farmacología'),
      icon: Pill,
      description: t('category.pharmacology_desc', 'Respuesta metabólica y recomendaciones de dosificación')
    },
    {
      id: 'personal_traits',
      label: t('category.personal_traits', 'Rasgos personales'),
      icon: User,
      description: t('category.personal_traits_desc', 'Fenotipos físicos, color de ojos, pelo, cerumen y biomarcadores')
    },
    {
      id: 'wellness',
      label: t('category.wellness', 'Wellness'),
      icon: HeartPulse,
      description: t('category.wellness_desc', 'Nutrición, lactosa, cafeína, vitaminas y rendimiento físico')
    },
    {
      id: 'ancestry',
      label: t('category.ancestry', 'Ancestralidad'),
      icon: Globe,
      description: t('category.ancestry_desc', 'Composición continental, linaje materno, linaje paterno y Neandertal')
    },
    {
      id: 'vahaduo',
      label: t('category.vahaduo', 'Vahaduo G25 Tools'),
      icon: Cpu,
      description: t('category.vahaduo_desc', 'Coordenadas G25, Admixture NNLS, Oracle 2-10 Way y Heatmap')
    }
  ];

  return (
    <div className="space-y-4">
      {/* Category Primary Grid / Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count =
            cat.id === 'vahaduo'
              ? `7 ${t('category.tabs', 'pestañas')}`
              : countsByCategory[cat.id] ?? (cat.id === 'ancestry' ? `4 ${t('category.subpanels', 'subpaneles')}` : 0);

          return (
            <button
              key={cat.id}
              id={`cat-nav-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex flex-col items-start justify-between p-3.5 rounded-2xl border transition-all text-left group cursor-pointer ${
                isSelected
                  ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black shadow-sm'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/70 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-850'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <div className={`p-2 rounded-xl ${
                  isSelected
                    ? 'bg-neutral-800 dark:bg-neutral-100 text-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isSelected
                    ? 'bg-neutral-800 dark:bg-neutral-200 text-neutral-100 dark:text-neutral-900'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400'
                }`}>
                  {typeof count === 'number' ? `${count} ${t('category.items', 'items')}` : count}
                </span>
              </div>
              <div>
                <p className="text-xs font-semibold leading-snug line-clamp-2">
                  {cat.label}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Filter and Search Bar (only relevant for trait lists) */}
      {selectedCategory !== 'ancestry' && (
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500" />
            <input
              id="search-traits-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t('category.searchPlaceholder', 'Buscar por condición, gen (MTHFR, COMT, AR, CFTR, CYP2D6) o rsID...')}
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-black dark:focus:border-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              >
                {t('category.clear', 'Limpiar')}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 hidden sm:inline flex items-center gap-1">
              <Filter className="w-3 h-3" />
              {t('category.filter', 'Filtro')}:
            </span>
            {[
              { id: 'all', label: t('category.filterAll', 'Todos') },
              { id: 'elevated', label: t('category.filterElevated', 'Elevado / Variante') },
              { id: 'moderate', label: t('category.filterModerate', 'Moderado') },
              { id: 'protective', label: t('category.filterProtective', 'Protector / Ausente') }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onStatusFilterChange(item.id)}
                className={`px-3.5 py-1.5 text-xs rounded-full font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === item.id
                    ? 'bg-black text-white dark:bg-white dark:text-black font-semibold'
                    : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
