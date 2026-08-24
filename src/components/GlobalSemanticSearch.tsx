import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Layers, 
  Code2, 
  Coins, 
  ShieldCheck, 
  Building2, 
  CornerDownLeft,
  Loader2,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SearchResult {
  id: string;
  title: string;
  category: string;
  tags: string[];
  snippet: string;
  route: string;
}

interface GlobalSemanticSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToView: (viewId: string) => void;
}

export const GlobalSemanticSearch: React.FC<GlobalSemanticSearchProps> = ({
  isOpen,
  onClose,
  onNavigateToView,
}) => {
  const [query, setQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  // Quick suggestions
  const suggestions = [
    { label: 'Core Banking & Mobile Money', query: 'Mobile Money fintech intégration' },
    { label: 'Tarifs Banque Mondiale', query: 'Tarifs devis 4 paliers' },
    { label: 'Application Desktop C# WPF', query: 'Logiciel Desktop WPF C# SQLite' },
    { label: 'Architecture Cloud Kubernetes', query: 'Kubernetes DevOps cloud résilience' },
    { label: 'Hub de Kigali & Paris', query: 'Hub Kigali Norrsken Station F Paris' },
    { label: 'Mode Offline-First', query: 'Mode hors-ligne SQLite synchronisation' },
  ];

  // Focus on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setResults([]);
      setAiSummary(null);
    }
  }, [isOpen]);

  // Keyboard shortcut listener (ESC to close, Enter to select first)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setAiSummary(null);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/semantic-search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: query.trim() }),
        });
        const data = await res.json();
        if (data.success) {
          setResults(data.results || []);
          setAiSummary(data.aiSummary || null);
        }
      } catch (err) {
        console.error('Semantic search failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 320);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = (route: string) => {
    onNavigateToView(route);
    onClose();
  };

  const filteredResults = results.filter((item) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'services') return item.category === 'services' || item.category === 'stack';
    if (activeCategory === 'pricing') return item.category === 'pricing';
    if (activeCategory === 'company') return item.category === 'company' || item.category === 'offices';
    if (activeCategory === 'faq') return item.category === 'faq' || item.category === 'security';
    return true;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-16 sm:pt-24 p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center gap-3 bg-slate-950/90 relative">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Recherche sémantique globale par IA (ex: Core Banking, tarifs, mode offline, SLA, C# WPF)..."
                className="w-full bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none font-medium"
              />
              {isLoading && (
                <Loader2 className="w-5 h-5 text-cyan-400 animate-spin shrink-0" />
              )}
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-mono px-2.5 py-1 border border-slate-700"
              >
                ESC
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="px-4 py-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs">
              {[
                { id: 'all', label: 'Tous les résultats' },
                { id: 'services', label: 'Services & Technologies' },
                { id: 'pricing', label: 'Tarifs & Paliers' },
                { id: 'company', label: 'Hubs & Organisation' },
                { id: 'faq', label: 'FAQ & Sécurité' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-800/70 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Main Content Area */}
            <div className="overflow-y-auto p-4 sm:p-5 space-y-4 flex-1">
              
              {/* Empty query state: Quick Suggestion Chips */}
              {!query.trim() && (
                <div className="space-y-4 py-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Suggestions de Recherche Fréquentes</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {suggestions.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setQuery(item.query)}
                        className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-800/50 text-left transition-all group flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <p className="text-xs font-bold text-white group-hover:text-cyan-300">
                            {item.label}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                            {item.query}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-950/60 border border-blue-500/20 text-xs text-slate-300 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-blue-600/20 text-cyan-400 shrink-0">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-white block">Recherche Sémantique Assistée par Gemini AI</span>
                      <span className="text-[11px] text-slate-400">
                        Indexation en temps réel de notre base de connaissances d'ingénierie, documentation d'architectures et tarifs Banque Mondiale.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Gemini AI Synthesis Answer */}
              {aiSummary && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-slate-950 to-emerald-950/30 border border-cyan-500/40 space-y-2 shadow-lg animate-in fade-in duration-300">
                  <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Synthèse Sémantique Intelligente (Gemini 3.7 Flash RAG) :</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {aiSummary}
                  </p>
                </div>
              )}

              {/* Matched Documents List */}
              {filteredResults.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 uppercase font-bold tracking-wider block">
                    Résultats Directs &amp; Documentation ({filteredResults.length})
                  </span>
                  <div className="space-y-2">
                    {filteredResults.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectResult(item.route)}
                        className="w-full p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800/60 text-left transition-all flex items-center justify-between gap-3 group cursor-pointer"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white group-hover:text-cyan-300">
                              {item.title}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono uppercase">
                              {item.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {item.snippet}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {item.tags.slice(0, 4).map((tag, tIdx) => (
                              <span
                                key={tIdx}
                                className="text-[9px] px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-cyan-400 font-semibold shrink-0 group-hover:translate-x-1 transition-transform">
                          <span className="text-[11px] hidden sm:inline">Consulter</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results found */}
              {query.trim() && !isLoading && filteredResults.length === 0 && (
                <div className="text-center py-10 space-y-2 text-slate-400">
                  <Search className="w-8 h-8 mx-auto text-slate-600" />
                  <p className="text-sm font-semibold text-slate-300">Aucun résultat exact trouvé pour "{query}"</p>
                  <p className="text-xs text-slate-500">
                    Essayez des termes plus généraux comme "devis", "mobile money", "kigali", "C#", ou "support 24/7".
                  </p>
                </div>
              )}

            </div>

            {/* Footer helper */}
            <div className="px-5 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <div className="flex items-center gap-3">
                <span>Navigation rapide au clavier</span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[9px]">ESC</kbd> pour fermer
                </span>
              </div>
              <span className="text-cyan-400/80 font-mono">V&amp;I TECH AFRICA • RAG Engine</span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
