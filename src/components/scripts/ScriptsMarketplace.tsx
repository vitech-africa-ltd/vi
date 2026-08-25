import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Code2, 
  Sparkles, 
  Download, 
  Star, 
  ShieldCheck, 
  Heart, 
  Eye, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  SlidersHorizontal, 
  Coins, 
  Users, 
  BookOpen, 
  Cpu, 
  Lock,
  Tag,
  X,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Smartphone,
  Server,
  Zap,
  Globe
} from 'lucide-react';
import { INITIAL_SCRIPTS, ScriptProduct } from '../../data/scriptsData';
import { ScriptProductDetailModal } from './ScriptProductDetailModal';
import { useCurrency } from '../../context/CurrencyContext';
import { useTranslation } from '../../context/LanguageContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSiteData } from '../../context/SiteDataContext';

interface ScriptsMarketplaceProps {
  onNavigateMemberSpace: () => void;
  onNavigateAdminSpace: () => void;
  onNavigateDeliverables: () => void;
  onNavigateTeam: () => void;
}

export const ScriptsMarketplace: React.FC<ScriptsMarketplaceProps> = ({
  onNavigateMemberSpace,
  onNavigateAdminSpace,
  onNavigateDeliverables,
  onNavigateTeam
}) => {
  const { currency, currencyOption } = useCurrency();
  const { t } = useTranslation();
  const { wishlistIds, isInWishlist, toggleWishlist, wishlistCount } = useWishlist();
  const { scriptProducts } = useSiteData();
  const products: ScriptProduct[] = useMemo(() => {
    return Array.isArray(scriptProducts) && scriptProducts.length > 0 ? scriptProducts : INITIAL_SCRIPTS;
  }, [scriptProducts]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Advanced Sidebar Filter States
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([]);
  const [pricePreset, setPricePreset] = useState<'all' | 'free' | 'under50' | '50to100' | 'over100'>('all');
  const [maxPrice, setMaxPrice] = useState<number>(150);
  const [securityFilter, setSecurityFilter] = useState<'all' | 'high_security'>('all');
  const [onlyWishlist, setOnlyWishlist] = useState<boolean>(false);
  const [onlyNew, setOnlyNew] = useState<boolean>(false);
  const [onlyMoMoReady, setOnlyMoMoReady] = useState<boolean>(false);

  // Sorting and View layout
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'newest' | 'price-asc' | 'price-desc'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProduct, setSelectedProduct] = useState<ScriptProduct | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Collapsible sidebar accordion sections
  const [collapsedSections, setCollapsedSections] = useState<{ [key: string]: boolean }>({
    languages: false,
    frameworks: false,
    price: false,
    security: false,
    special: false
  });

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Extract unique languages and frameworks dynamically with product counts
  const languageOptions = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach(p => {
      const lang = p.analysis.language;
      map.set(lang, (map.get(lang) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [products]);

  const frameworkOptions = useMemo(() => {
    const map = new Map<string, number>();
    products.forEach(p => {
      const fw = p.analysis.framework;
      map.set(fw, (map.get(fw) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [products]);

  const categories = useMemo(() => [
    { id: 'all', label: 'Tous les Scripts & Apps', count: (products || []).length },
    { id: 'php-laravel', label: 'PHP & Laravel Fintech', count: (products || []).filter(p => p && p.category === 'php-laravel').length },
    { id: 'mobile-flutter', label: 'Mobile Flutter & Dart', count: (products || []).filter(p => p && p.category === 'mobile-flutter').length },
    { id: 'fullstack-saas', label: 'Full-Stack SaaS Cloud', count: (products || []).filter(p => p && p.category === 'fullstack-saas').length },
    { id: 'python-django', label: 'Python IA & ML', count: (products || []).filter(p => p && p.category === 'python-django').length },
    { id: 'ui-templates', label: 'Templates UI / Bootstrap 5', count: (products || []).filter(p => p && p.category === 'ui-templates').length },
    { id: 'wordpress-plugins', label: 'Plugins WooCommerce', count: (products || []).filter(p => p && p.category === 'wordpress-plugins').length },
  ], [products]);

  // Active filters count calculation
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedLanguages.length > 0) count += selectedLanguages.length;
    if (selectedFrameworks.length > 0) count += selectedFrameworks.length;
    if (pricePreset !== 'all') count += 1;
    if (maxPrice < 150) count += 1;
    if (securityFilter !== 'all') count += 1;
    if (onlyWishlist) count += 1;
    if (onlyNew) count += 1;
    if (onlyMoMoReady) count += 1;
    if (selectedCategory !== 'all') count += 1;
    return count;
  }, [selectedLanguages, selectedFrameworks, pricePreset, maxPrice, securityFilter, onlyWishlist, onlyNew, onlyMoMoReady, selectedCategory]);

  const handleResetFilters = () => {
    setSelectedLanguages([]);
    setSelectedFrameworks([]);
    setPricePreset('all');
    setMaxPrice(150);
    setSecurityFilter('all');
    setOnlyWishlist(false);
    setOnlyNew(false);
    setOnlyMoMoReady(false);
    setSelectedCategory('all');
    setSearchQuery('');
  };

  const toggleLanguageFilter = (lang: string) => {
    setSelectedLanguages(prev => 
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const toggleFrameworkFilter = (fw: string) => {
    setSelectedFrameworks(prev => 
      prev.includes(fw) ? prev.filter(f => f !== fw) : [...prev, fw]
    );
  };

  // Main instant filtered and sorted products list
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // 1. Text Search
      const search = searchQuery.toLowerCase().trim();
      const matchesSearch = !search || (
        p.title.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.tagline.toLowerCase().includes(search) ||
        p.analysis.language.toLowerCase().includes(search) ||
        p.analysis.framework.toLowerCase().includes(search) ||
        p.tags.some(tag => tag.toLowerCase().includes(search))
      );

      // 2. Category
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

      // 3. Language
      const matchesLanguage = selectedLanguages.length === 0 || 
        selectedLanguages.some(l => p.analysis.language.toLowerCase().includes(l.toLowerCase()));

      // 4. Framework
      const matchesFramework = selectedFrameworks.length === 0 || 
        selectedFrameworks.some(f => p.analysis.framework.toLowerCase().includes(f.toLowerCase()));

      // 5. Price Preset & Max Range
      let matchesPricePreset = true;
      if (pricePreset === 'free') matchesPricePreset = p.isFree;
      else if (pricePreset === 'under50') matchesPricePreset = !p.isFree && p.priceUSD <= 50;
      else if (pricePreset === '50to100') matchesPricePreset = !p.isFree && p.priceUSD >= 50 && p.priceUSD <= 100;
      else if (pricePreset === 'over100') matchesPricePreset = !p.isFree && p.priceUSD > 100;

      const matchesMaxPrice = p.isFree || p.priceUSD <= maxPrice;

      // 6. Security (Certified A+ / Score >= 98)
      const matchesSecurity = securityFilter === 'all' || (p.analysis.securityScore >= 98);

      // 7. Special Toggles
      const matchesWishlist = !onlyWishlist || wishlistIds.includes(p.id);
      const matchesNew = !onlyNew || p.isNew;
      const matchesMoMo = !onlyMoMoReady || (
        p.tags.some(t => t.toLowerCase().includes('momo') || t.toLowerCase().includes('mtn') || t.toLowerCase().includes('airtel')) ||
        p.category === 'php-laravel' || p.category === 'wordpress-plugins'
      );

      return (
        matchesSearch && 
        matchesCategory && 
        matchesLanguage && 
        matchesFramework && 
        matchesPricePreset && 
        matchesMaxPrice && 
        matchesSecurity && 
        matchesWishlist && 
        matchesNew && 
        matchesMoMo
      );
    }).sort((a, b) => {
      if (sortBy === 'popular') return b.downloadsCount - a.downloadsCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return b.isNew ? -1 : 1;
      if (sortBy === 'price-asc') return a.priceUSD - b.priceUSD;
      if (sortBy === 'price-desc') return b.priceUSD - a.priceUSD;
      return 0;
    });
  }, [
    products, 
    searchQuery, 
    selectedCategory, 
    selectedLanguages, 
    selectedFrameworks, 
    pricePreset, 
    maxPrice, 
    securityFilter, 
    onlyWishlist, 
    onlyNew, 
    onlyMoMoReady, 
    wishlistIds, 
    sortBy
  ]);

  const handleOpenDetail = (prod: ScriptProduct) => {
    setSelectedProduct(prod);
    setIsDetailOpen(true);
  };

  const handleInstantBuy = (prod: ScriptProduct, method: string) => {
    console.log('Instant buy confirmed for:', prod.title, 'via', method);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Top Banner / Breadcrumb Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="font-bold text-cyan-400 flex items-center gap-1">
              <Code2 className="w-4 h-4" /> Vitech Scripts
            </span>
            <span>/</span>
            <span className="text-slate-200 font-medium">Place de Marché &amp; Codes Sources</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Wishlist Quick Counter Button */}
            <button
              onClick={() => {
                setOnlyWishlist(prev => !prev);
              }}
              className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                onlyWishlist
                  ? 'bg-rose-950 border-rose-500 text-rose-300 font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
              }`}
              title="Filtrer par mes favoris"
            >
              <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>Favoris ({wishlistCount})</span>
            </button>

            <button
              onClick={onNavigateDeliverables}
              className="px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/40 text-indigo-300 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Livrables &amp; Code PHP</span>
            </button>

            <button
              onClick={onNavigateMemberSpace}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Espace Membre</span>
            </button>

            <button
              onClick={onNavigateAdminSpace}
              className="px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
          <div className="absolute top-20 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Vitech Scripts Pro Max • Source Codes &amp; Architecture</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Place de Marché de <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
              Codes Sources &amp; Scripts Clé en Main
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Téléchargez des applications vérifiées et prêtes pour la production : passerelles Mobile Money (MTN MoMo, Airtel), architectures SaaS Laravel 11, apps Flutter et kits d'administration.
          </p>

          {/* Quick Stats Bar */}
          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-black text-white block">100%</span>
              <span className="text-[10px] text-slate-400 font-mono">Code OWASP Audité</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-black text-cyan-400 block">&lt; 2 min</span>
              <span className="text-[10px] text-slate-400 font-mono">Paiement MTN/Airtel</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-black text-emerald-400 block">PHP 8.4</span>
              <span className="text-[10px] text-slate-400 font-mono">MVC &amp; Clean Architecture</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xl font-black text-rose-400 block">{wishlistCount}</span>
              <span className="text-[10px] text-slate-400 font-mono">Favoris Sauvegardés</span>
            </div>
          </div>

          {/* Large Live Search Box */}
          <div className="pt-2 max-w-3xl mx-auto">
            <div className="relative flex items-center bg-slate-900 border-2 border-slate-800 focus-within:border-cyan-500 rounded-2xl p-2 shadow-2xl transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Rechercher par langage (PHP, Python, JS, Dart), framework (Laravel, Flutter, React), MoMo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-slate-500 hover:text-white mr-2 px-2 py-1 rounded bg-slate-800"
                >
                  Effacer
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CATALOG AREA WITH SIDEBAR FILTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-slate-800/80 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedCategory === cat.id ? 'bg-slate-950 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile Filter Toggle & Controls Bar */}
        <div className="py-2 mb-4 flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex items-center gap-3">
            {/* Mobile Filter Drawer Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-xs font-bold text-cyan-400 flex items-center gap-2 cursor-pointer shadow"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtres Avancés</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              <strong className="text-white">{filteredProducts.length}</strong> script{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Sort & Grid/List toggles */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Trier :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="popular">Plus Populaires / Ventes</option>
                <option value="rating">Mieux Notés (5★)</option>
                <option value="newest">Nouveautés 2026</option>
                <option value="price-asc">Prix Croissant ($ → $$$)</option>
                <option value="price-desc">Prix Décroissant ($$$ → $)</option>
              </select>
            </div>

            <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                title="Vue Grille"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
                title="Vue Liste"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Active Filters Badges Row */}
        {activeFiltersCount > 0 && (
          <div className="mb-6 p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-cyan-400" /> Filtres actifs :
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs">
                Catégorie : {categories.find(c => c.id === selectedCategory)?.label}
                <button onClick={() => setSelectedCategory('all')} className="hover:text-white ml-0.5">&times;</button>
              </span>
            )}

            {selectedLanguages.map((lang) => (
              <span key={lang} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs">
                Langage : {lang}
                <button onClick={() => toggleLanguageFilter(lang)} className="hover:text-red-400 ml-0.5">&times;</button>
              </span>
            ))}

            {selectedFrameworks.map((fw) => (
              <span key={fw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs">
                Framework : {fw}
                <button onClick={() => toggleFrameworkFilter(fw)} className="hover:text-red-400 ml-0.5">&times;</button>
              </span>
            ))}

            {pricePreset !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs">
                Prix : {pricePreset === 'free' ? 'Gratuit' : pricePreset === 'under50' ? '< $50' : pricePreset === '50to100' ? '$50 - $100' : '> $100'}
                <button onClick={() => setPricePreset('all')} className="hover:text-white ml-0.5">&times;</button>
              </span>
            )}

            {maxPrice < 150 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 text-xs">
                Max : ${maxPrice} USD
                <button onClick={() => setMaxPrice(150)} className="hover:text-white ml-0.5">&times;</button>
              </span>
            )}

            {securityFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs">
                OWASP ≥ 98/100
                <button onClick={() => setSecurityFilter('all')} className="hover:text-white ml-0.5">&times;</button>
              </span>
            )}

            {onlyWishlist && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950 text-rose-300 border border-rose-500/30 text-xs">
                Favoris uniquement
                <button onClick={() => setOnlyWishlist(false)} className="hover:text-white ml-0.5">&times;</button>
              </span>
            )}

            {onlyNew && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-500/30 text-xs">
                Nouveautés 2026
                <button onClick={() => setOnlyNew(false)} className="hover:text-white ml-0.5">&times;</button>
              </span>
            )}

            {onlyMoMoReady && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-500/30 text-xs">
                MoMo Ready
                <button onClick={() => setOnlyMoMoReady(false)} className="hover:text-white ml-0.5">&times;</button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="ml-auto text-xs text-rose-400 hover:text-rose-300 hover:underline flex items-center gap-1 cursor-pointer font-mono"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Tout réinitialiser</span>
            </button>
          </div>
        )}

        {/* TWO COLUMN LAYOUT: SIDEBAR + PRODUCT GRID/LIST */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= DESKTOP SIDEBAR ================= */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6 sticky top-28 bg-slate-900/60 p-5 rounded-3xl border border-slate-800">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <span>Filtres de Recherche</span>
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-[11px] text-cyan-400 hover:underline font-mono cursor-pointer"
                >
                  Effacer ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* 1. FILTER BY PROGRAMMING LANGUAGE */}
            <div className="space-y-3">
              <button
                onClick={() => toggleSection('languages')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <Code2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Langages de Code</span>
                </span>
                {collapsedSections.languages ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              {!collapsedSections.languages && (
                <div className="space-y-1.5 pt-1">
                  {languageOptions.map(({ name, count }) => {
                    const isSelected = selectedLanguages.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleLanguageFilter(name)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                            : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-cyan-500 border-cyan-500 text-slate-950' : 'border-slate-700 bg-slate-950'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span className="truncate">{name}</span>
                        </span>
                        <span className="text-[10px] font-mono opacity-70">({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 2. FILTER BY FRAMEWORK */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => toggleSection('frameworks')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Frameworks &amp; Stacks</span>
                </span>
                {collapsedSections.frameworks ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              {!collapsedSections.frameworks && (
                <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto scrollbar-thin">
                  {frameworkOptions.map(({ name, count }) => {
                    const isSelected = selectedFrameworks.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleFrameworkFilter(name)}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40'
                            : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700 bg-slate-950'
                          }`}>
                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                          </span>
                          <span className="truncate">{name}</span>
                        </span>
                        <span className="text-[10px] font-mono opacity-70">({count})</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3. FILTER BY PRICE RANGE */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => toggleSection('price')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Budget &amp; Tarification</span>
                </span>
                {collapsedSections.price ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              {!collapsedSections.price && (
                <div className="space-y-3 pt-1">
                  {/* Preset Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    {[
                      { id: 'all', label: 'Tous' },
                      { id: 'free', label: '100% Gratuit' },
                      { id: 'under50', label: '< $50 USD' },
                      { id: '50to100', label: '$50 - $100' },
                      { id: 'over100', label: '> $100 USD' }
                    ].map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => setPricePreset(preset.id as any)}
                        className={`px-2 py-1.5 rounded-lg border text-center transition-all cursor-pointer ${
                          pricePreset === preset.id
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Range Slider */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Prix max :</span>
                      <span className="text-cyan-400 font-bold">${maxPrice} USD</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={150}
                      step={5}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                    <div className="flex justify-between text-[10px] font-mono text-slate-500">
                      <span>$0</span>
                      <span>$75</span>
                      <span>$150+</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 4. SECURITY & OWASP CERTIFICATION */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => toggleSection('security')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Cybersécurité &amp; OWASP</span>
                </span>
                {collapsedSections.security ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>

              {!collapsedSections.security && (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => setSecurityFilter(prev => prev === 'high_security' ? 'all' : 'high_security')}
                    className={`w-full flex items-center gap-2 p-2 rounded-xl text-xs text-left border transition-all cursor-pointer ${
                      securityFilter === 'high_security'
                        ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-bold block text-white">Score OWASP ≥ 98/100</span>
                      <span className="text-[10px] text-slate-400">Certifié A+ sans vulnérabilité critique</span>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* 5. SPECIAL CRITERIA TOGGLES */}
            <div className="space-y-2 pt-3 border-t border-slate-800/80">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
                Critères Spécifiques
              </span>

              {/* Wishlist only */}
              <button
                onClick={() => setOnlyWishlist(!onlyWishlist)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  onlyWishlist ? 'bg-rose-950/60 border border-rose-500/40 text-rose-300 font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Heart className={`w-3.5 h-3.5 ${onlyWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                  <span>Mes Favoris ({wishlistCount})</span>
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${onlyWishlist ? 'bg-rose-500' : 'bg-slate-700'}`} />
              </button>

              {/* MoMo Ready */}
              <button
                onClick={() => setOnlyMoMoReady(!onlyMoMoReady)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  onlyMoMoReady ? 'bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                  <span>MTN / Airtel MoMo Ready</span>
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${onlyMoMoReady ? 'bg-amber-500' : 'bg-slate-700'}`} />
              </button>

              {/* New 2026 */}
              <button
                onClick={() => setOnlyNew(!onlyNew)}
                className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                  onlyNew ? 'bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-bold' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Nouveautés 2026</span>
                </span>
                <span className={`w-2.5 h-2.5 rounded-full ${onlyNew ? 'bg-cyan-500' : 'bg-slate-700'}`} />
              </button>
            </div>

          </aside>

          {/* ================= PRODUCT DISPLAY AREA ================= */}
          <main className="lg:col-span-9 space-y-6">

            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center space-y-4 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
                <Code2 className="w-12 h-12 text-slate-600 mx-auto" />
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Aucun script ne correspond à ces filtres</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Essayez de relâcher certains critères de recherche, de décocher les langages ou d'élargir la fourchette de prix.
                  </p>
                </div>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser tous les filtres</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* GRID VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const inWishlist = isInWishlist(p.id);
                  return (
                    <div
                      key={p.id}
                      className="group rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1"
                    >
                      {/* Image Cover with Badges & Wishlist Button */}
                      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                        <img
                          src={p.previewImage}
                          alt={p.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          {p.isNew && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500 text-slate-950 shadow">
                              NOUVEAU 2026
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-slate-950/80 backdrop-blur-md text-slate-200 border border-slate-700">
                            {p.analysis.language}
                          </span>
                        </div>

                        {/* Top Right: Heart Wishlist Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(p);
                          }}
                          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md border transition-all cursor-pointer shadow ${
                            inWishlist
                              ? 'bg-rose-950/90 border-rose-500 text-rose-400 scale-110'
                              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-900'
                          }`}
                          title={inWishlist ? 'Retirer des favoris' : 'Ajouter à la wishlist'}
                        >
                          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>

                        {/* Security Score Badge */}
                        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-950/85 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-[11px] font-mono font-bold">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>OWASP {p.analysis.securityScore}/100</span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-400">
                            <span className="font-mono text-cyan-400 font-semibold">{p.analysis.framework}</span>
                            <div className="flex items-center gap-1 text-amber-400 font-bold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              <span>{p.rating}</span>
                              <span className="text-slate-500 text-[10px]">({p.reviewsCount})</span>
                            </div>
                          </div>

                          <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                            {p.title}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {p.description}
                          </p>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 pt-1">
                          {p.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Price & Action Button */}
                        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                          <div>
                            {p.isFree ? (
                              <span className="text-base font-black text-emerald-400 font-mono">GRATUIT</span>
                            ) : (
                              <div>
                                <span className="text-lg font-black text-white">${p.priceUSD} USD</span>
                                <span className="text-[10px] font-mono text-cyan-400 block">≈ {p.priceRWF.toLocaleString()} RWF</span>
                              </div>
                            )}
                          </div>

                          <button
                            onClick={() => handleOpenDetail(p)}
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
                          >
                            <span>Détails &amp; Démo</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="space-y-4">
                {filteredProducts.map((p) => {
                  const inWishlist = isInWishlist(p.id);
                  return (
                    <div
                      key={p.id}
                      className="p-4 sm:p-5 rounded-3xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                    >
                      <div className="flex items-start sm:items-center gap-4 flex-1">
                        <div className="relative w-28 h-20 rounded-2xl overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                          <img
                            src={p.previewImage}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWishlist(p);
                            }}
                            className={`absolute top-1.5 right-1.5 p-1 rounded-lg backdrop-blur-md transition-colors ${
                              inWishlist ? 'bg-rose-950 text-rose-400' : 'bg-slate-950/70 text-slate-300 hover:text-rose-400'
                            }`}
                          >
                            <Heart className={`w-3 h-3 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                          </button>
                        </div>

                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-bold">
                              {p.analysis.language}
                            </span>
                            <span className="text-xs font-mono text-slate-400">{p.analysis.framework}</span>
                            <span className="text-xs text-amber-400 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400" /> {p.rating}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                              OWASP {p.analysis.securityScore}/100
                            </span>
                          </div>
                          <h3 className="font-bold text-sm sm:text-base text-white">{p.title}</h3>
                          <p className="text-xs text-slate-400 line-clamp-1">{p.tagline}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                        <div className="text-right">
                          {p.isFree ? (
                            <span className="text-sm font-black text-emerald-400 font-mono">GRATUIT</span>
                          ) : (
                            <div>
                              <span className="text-base font-black text-white">${p.priceUSD} USD</span>
                              <span className="text-[10px] font-mono text-cyan-400 block">{p.priceRWF.toLocaleString()} RWF</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenDetail(p)}
                          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <span>Voir le Script</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </main>

        </div>

      </section>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-[200] flex justify-end bg-slate-950/80 backdrop-blur-sm lg:hidden">
          <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full overflow-y-auto p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <h3 className="font-black text-base text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
                  <span>Filtres de Recherche</span>
                </h3>
                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Language Filters */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Langages de Programmation
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {languageOptions.map(({ name, count }) => {
                    const isSelected = selectedLanguages.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleLanguageFilter(name)}
                        className={`p-2 rounded-xl text-xs border text-left flex items-center justify-between ${
                          isSelected ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="truncate">{name}</span>
                        <span className="text-[10px] font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frameworks */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Frameworks &amp; Stacks
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {frameworkOptions.map(({ name, count }) => {
                    const isSelected = selectedFrameworks.includes(name);
                    return (
                      <button
                        key={name}
                        onClick={() => toggleFrameworkFilter(name)}
                        className={`p-2 rounded-xl text-xs border text-left flex items-center justify-between ${
                          isSelected ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                        }`}
                      >
                        <span className="truncate">{name}</span>
                        <span className="text-[10px] font-mono">({count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Price Presets & Max Slider */}
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Fourchette de Prix
                </span>
                <div className="grid grid-cols-2 gap-1.5 text-xs">
                  {[
                    { id: 'all', label: 'Tous' },
                    { id: 'free', label: 'Gratuit' },
                    { id: 'under50', label: '< $50' },
                    { id: '50to100', label: '$50 - $100' },
                    { id: 'over100', label: '> $100' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => setPricePreset(p.id as any)}
                      className={`p-2 rounded-xl border text-center ${
                        pricePreset === p.id ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-400">Max :</span>
                    <span className="text-cyan-400 font-bold">${maxPrice} USD</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={150}
                    step={5}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              {/* Special Toggles */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => setOnlyWishlist(!onlyWishlist)}
                  className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    onlyWishlist ? 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-500" />
                    <span>Favoris uniquement ({wishlistCount})</span>
                  </span>
                  {onlyWishlist && <Check className="w-4 h-4 text-rose-400" />}
                </button>

                <button
                  onClick={() => setSecurityFilter(securityFilter === 'high_security' ? 'all' : 'high_security')}
                  className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    securityFilter === 'high_security' ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold' : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>OWASP Score ≥ 98</span>
                  </span>
                  {securityFilter === 'high_security' && <Check className="w-4 h-4 text-emerald-400" />}
                </button>
              </div>

            </div>

            {/* Apply & Reset Buttons in Drawer */}
            <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs"
              >
                Réinitialiser
              </button>
              <button
                onClick={() => setIsMobileSidebarOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow"
              >
                Voir les ({filteredProducts.length}) résultats
              </button>
            </div>

          </div>
        </div>
      )}

      {/* PRODUCT DETAIL MODAL */}
      <ScriptProductDetailModal
        product={selectedProduct}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onInstantBuy={handleInstantBuy}
      />

    </div>
  );
};
