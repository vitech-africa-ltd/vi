import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Clock, 
  Search, 
  ChevronRight, 
  X, 
  Cloud, 
  Sparkles, 
  Globe, 
  Smartphone, 
  Layers, 
  Filter, 
  Tag, 
  Heart, 
  Share2, 
  Check, 
  RotateCcw,
  BookOpen
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { BlogPost } from '../types';

export type TechCategoryKey = 'all' | 'Cloud' | 'AI' | 'Web' | 'Mobile';

interface TechCategoryOption {
  key: TechCategoryKey;
  label: string;
  shortLabel: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  colorClasses: {
    active: string;
    badge: string;
    border: string;
    text: string;
    glow: string;
  };
}

const TECH_CATEGORIES: TechCategoryOption[] = [
  {
    key: 'all',
    label: 'Toutes les Technologies',
    shortLabel: 'Tous',
    description: 'Ensemble des publications et retours d’expérience R&D',
    icon: Layers,
    colorClasses: {
      active: 'bg-cyan-500 text-slate-950 shadow-cyan-500/30',
      badge: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/40',
      border: 'border-cyan-500/50',
      text: 'text-cyan-400',
      glow: 'from-cyan-500/20 to-blue-500/20',
    },
  },
  {
    key: 'Cloud',
    label: 'Cloud & DevOps',
    shortLabel: 'Cloud',
    description: 'Kubernetes, Microservices, FinOps, Terraform & Résilience',
    icon: Cloud,
    colorClasses: {
      active: 'bg-sky-500 text-slate-950 shadow-sky-500/30',
      badge: 'bg-sky-950/80 text-sky-300 border-sky-500/40',
      border: 'border-sky-500/50',
      text: 'text-sky-400',
      glow: 'from-sky-500/20 to-blue-600/20',
    },
  },
  {
    key: 'AI',
    label: 'Intelligence Artificielle',
    shortLabel: 'AI & Data',
    description: 'LLM, RAG, Gemini, Computer Vision & Agents Autonomes',
    icon: Sparkles,
    colorClasses: {
      active: 'bg-purple-500 text-slate-950 shadow-purple-500/30',
      badge: 'bg-purple-950/80 text-purple-300 border-purple-500/40',
      border: 'border-purple-500/50',
      text: 'text-purple-400',
      glow: 'from-purple-500/20 to-indigo-600/20',
    },
  },
  {
    key: 'Web',
    label: 'Ingénierie Web & SaaS',
    shortLabel: 'Web',
    description: 'Next.js, SSR, Micro-Frontends, PWA & Haute Performance',
    icon: Globe,
    colorClasses: {
      active: 'bg-emerald-500 text-slate-950 shadow-emerald-500/30',
      badge: 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40',
      border: 'border-emerald-500/50',
      text: 'text-emerald-400',
      glow: 'from-emerald-500/20 to-teal-600/20',
    },
  },
  {
    key: 'Mobile',
    label: 'Mobile & Offline-First',
    shortLabel: 'Mobile',
    description: 'Flutter, React Native, Mobile Money SDKs & Bases Embarquées',
    icon: Smartphone,
    colorClasses: {
      active: 'bg-amber-500 text-slate-950 shadow-amber-500/30',
      badge: 'bg-amber-950/80 text-amber-300 border-amber-500/40',
      border: 'border-amber-500/50',
      text: 'text-amber-400',
      glow: 'from-amber-500/20 to-orange-600/20',
    },
  },
];

export const TechBlogSection: React.FC = () => {
  const { blogPosts } = useSiteData();
  const { t } = useTranslation();

  const [selectedTech, setSelectedTech] = useState<TechCategoryKey>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Helper to normalize and identify the technology category for any post
  const resolveTechCategory = (post: BlogPost): TechCategoryKey => {
    if (post.techCategory) {
      const tc = post.techCategory.toLowerCase();
      if (tc.includes('cloud') || tc.includes('devops') || tc.includes('k8s') || tc.includes('aws')) return 'Cloud';
      if (tc.includes('ai') || tc.includes('ia') || tc.includes('intelligence') || tc.includes('rag') || tc.includes('llm')) return 'AI';
      if (tc.includes('web') || tc.includes('saas') || tc.includes('react') || tc.includes('frontend')) return 'Web';
      if (tc.includes('mobile') || tc.includes('flutter') || tc.includes('android') || tc.includes('ios')) return 'Mobile';
    }

    const fullSearchText = `${post.category || ''} ${(post.tags || []).join(' ')} ${post.title} ${post.excerpt}`.toLowerCase();

    if (
      fullSearchText.includes('ai') ||
      fullSearchText.includes('intelligence artificielle') ||
      fullSearchText.includes('gemini') ||
      fullSearchText.includes('rag') ||
      fullSearchText.includes('llm') ||
      fullSearchText.includes('vision') ||
      fullSearchText.includes('ocr') ||
      fullSearchText.includes('deep learning')
    ) {
      return 'AI';
    }

    if (
      fullSearchText.includes('mobile') ||
      fullSearchText.includes('flutter') ||
      fullSearchText.includes('react native') ||
      fullSearchText.includes('offline-first') ||
      fullSearchText.includes('sqlite') ||
      fullSearchText.includes('mobile money') ||
      fullSearchText.includes('android') ||
      fullSearchText.includes('ios')
    ) {
      return 'Mobile';
    }

    if (
      fullSearchText.includes('cloud') ||
      fullSearchText.includes('kubernetes') ||
      fullSearchText.includes('devops') ||
      fullSearchText.includes('terraform') ||
      fullSearchText.includes('finops') ||
      fullSearchText.includes('kafka') ||
      fullSearchText.includes('microservices') ||
      fullSearchText.includes('aws') ||
      fullSearchText.includes('gcp') ||
      fullSearchText.includes('docker')
    ) {
      return 'Cloud';
    }

    if (
      fullSearchText.includes('web') ||
      fullSearchText.includes('next.js') ||
      fullSearchText.includes('react') ||
      fullSearchText.includes('saas') ||
      fullSearchText.includes('frontend') ||
      fullSearchText.includes('pwa') ||
      fullSearchText.includes('typescript') ||
      fullSearchText.includes('tailwind')
    ) {
      return 'Web';
    }

    return 'Web';
  };

  // Counts per technology category
  const techCounts = useMemo(() => {
    const counts: Record<TechCategoryKey, number> = {
      all: blogPosts.length,
      Cloud: 0,
      AI: 0,
      Web: 0,
      Mobile: 0,
    };

    blogPosts.forEach((post) => {
      const cat = resolveTechCategory(post);
      if (counts[cat] !== undefined) {
        counts[cat]++;
      }
    });

    return counts;
  }, [blogPosts]);

  // Dynamic tags list filtered by selected technology
  const availableTags = useMemo(() => {
    const relevantPosts = selectedTech === 'all' 
      ? blogPosts 
      : blogPosts.filter(p => resolveTechCategory(p) === selectedTech);

    const tagSet = new Set<string>();
    relevantPosts.forEach(p => {
      (p.tags || []).forEach(t => {
        const trimmed = t.trim();
        if (trimmed.length > 0) tagSet.add(trimmed);
      });
    });

    return ['all', ...Array.from(tagSet)];
  }, [blogPosts, selectedTech]);

  // Main filtered posts collection
  const filteredPosts = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return blogPosts.filter((post) => {
      const postTech = resolveTechCategory(post);
      const matchesTech = selectedTech === 'all' || postTech === selectedTech;

      const matchesTag = selectedTag === 'all' || (post.tags && post.tags.some(t => t.toLowerCase() === selectedTag.toLowerCase()));

      const matchesSearch = !q || 
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        (post.category && post.category.toLowerCase().includes(q)) ||
        (post.author && typeof post.author === 'object' && post.author.name && post.author.name.toLowerCase().includes(q)) ||
        (post.tags && post.tags.some(t => t.toLowerCase().includes(q)));

      return matchesTech && matchesTag && matchesSearch;
    });
  }, [blogPosts, selectedTech, selectedTag, searchQuery]);

  const handleResetFilters = () => {
    setSelectedTech('all');
    setSelectedTag('all');
    setSearchQuery('');
  };

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleShare = (post: BlogPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const getAuthorName = (author: any): string => {
    if (!author) return 'Équipe Vitech Africa';
    if (typeof author === 'string') return author;
    if (typeof author === 'object' && author.name) return String(author.name);
    return 'Équipe Vitech Africa';
  };

  const getAuthorRole = (post: any): string => {
    if (post.authorRole) return String(post.authorRole);
    if (post.author && typeof post.author === 'object' && post.author.role) return String(post.author.role);
    return 'Lead Software Architect';
  };

  const getAuthorAvatar = (post: any): string | undefined => {
    if (post.authorAvatar) return post.authorAvatar;
    if (post.author && typeof post.author === 'object' && post.author.avatar) return post.author.avatar;
    return undefined;
  };

  const getCategoryBadgeStyle = (cat: TechCategoryKey) => {
    const config = TECH_CATEGORIES.find(c => c.key === cat);
    return config ? config.colorClasses : TECH_CATEGORIES[0].colorClasses;
  };

  return (
    <section id="blog" className="py-20 bg-slate-950 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-10 gap-6 border-b border-slate-800/80 pb-8">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>{t('blog.badge', "Publications & R&D Logicielle")}</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {t('blog.title', "Articles & Analyses d'Ingénierie")}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Panafricaine
              </span>
            </h2>
            
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explorez nos études de cas techniques classées par domaine d'ingénierie : architectures Cloud résilientes, modèles d'IA souverains, applications Web modernes et solutions mobiles Offline-First.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder={t('blog.searchPlaceholder', 'Rechercher une technologie, un article...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-colors"
                title="Effacer la recherche"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* PRIMARY TECHNOLOGY FILTER BAR (Cloud, AI, Web, Mobile, All) */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filtrer par Pôle Technologique :</span>
            </div>
            
            {(selectedTech !== 'all' || selectedTag !== 'all' || searchQuery !== '') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser les filtres</span>
              </button>
            )}
          </div>

          {/* Large Technology Switcher Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TECH_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedTech === cat.key;
              const count = techCounts[cat.key] || 0;

              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setSelectedTech(cat.key);
                    setSelectedTag('all'); // reset subtag when switching category
                  }}
                  className={`group relative p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? `bg-slate-900 border-slate-700 shadow-xl ring-2 ring-offset-2 ring-offset-slate-950 ${cat.colorClasses.border}`
                      : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className={`p-2 rounded-xl border transition-colors ${
                      isSelected 
                        ? `${cat.colorClasses.badge}`
                        : 'bg-slate-950 border-slate-800 text-slate-400 group-hover:text-white'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>

                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                      isSelected
                        ? `${cat.colorClasses.active}`
                        : 'bg-slate-950 text-slate-400 border border-slate-800'
                    }`}>
                      {count}
                    </span>
                  </div>

                  <div>
                    <div className={`text-sm font-bold leading-snug ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                      {cat.label}
                    </div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                      {cat.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECONDARY SUB-TAGS FILTER PILLS */}
        {availableTags.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 no-scrollbar">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold pr-2 shrink-0">
              <Tag className="w-3 h-3 text-cyan-400" />
              <span>Tags :</span>
            </div>
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  selectedTag === tag
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-900/90 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {tag === 'all' ? 'Tous les tags' : `#${tag}`}
              </button>
            ))}
          </div>
        )}

        {/* ACTIVE FILTERS SUMMARY / RESULTS COUNTER */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-6 px-1">
          <div>
            Affichage de <span className="font-bold text-cyan-400">{filteredPosts.length}</span> article{filteredPosts.length > 1 ? 's' : ''}
            {selectedTech !== 'all' && (
              <> dans le domaine <strong className="text-white">"{TECH_CATEGORIES.find(c => c.key === selectedTech)?.label}"</strong></>
            )}
            {selectedTag !== 'all' && (
              <> tagué <strong className="text-cyan-300">#{selectedTag}</strong></>
            )}
            {searchQuery && (
              <> correspondant à <strong className="text-white">"{searchQuery}"</strong></>
            )}
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredPosts.length === 0 && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-12 text-center max-w-xl mx-auto my-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Aucun article ne correspond à votre sélection</h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Essayez de modifier votre mot-clé de recherche, de sélectionner un autre pôle technologique ou d'élargir les critères.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              Afficher tous les articles
            </button>
          </div>
        )}

        {/* BLOG POSTS GRID */}
        {filteredPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              const authorName = getAuthorName(post.author);
              const authorRole = getAuthorRole(post);
              const postTech = resolveTechCategory(post);
              const badgeStyle = getCategoryBadgeStyle(postTech);
              const isLiked = !!likedPosts[post.id];
              const likesCount = (post.likes || 120) + (isLiked ? 1 : 0);

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 hover:border-cyan-500/50 p-6 flex flex-col justify-between space-y-6 shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <div className="space-y-4">
                    
                    {/* Header Badges: Technology + Read time */}
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${badgeStyle.badge}`}>
                        {postTech === 'Cloud' && <Cloud className="w-3 h-3" />}
                        {postTech === 'AI' && <Sparkles className="w-3 h-3" />}
                        {postTech === 'Web' && <Globe className="w-3 h-3" />}
                        {postTech === 'Mobile' && <Smartphone className="w-3 h-3" />}
                        <span>{postTech}</span>
                      </span>

                      <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                      {post.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-slate-400 text-xs sm:text-sm line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-slate-800/80">
                    
                    {/* Tag list */}
                    <div className="flex flex-wrap gap-1.5">
                      {post.tags?.slice(0, 4).map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-lg bg-slate-950 text-[11px] font-mono text-slate-400 border border-slate-800"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Author & Read Action */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2.5">
                        {getAuthorAvatar(post) ? (
                          <img
                            src={getAuthorAvatar(post)}
                            alt={authorName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-700"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center font-bold text-xs">
                            {authorName.charAt(0)}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-200">{authorName}</div>
                          <div className="text-[10px] text-slate-400 line-clamp-1">{authorRole}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-cyan-400 font-bold group-hover:translate-x-1 transition-transform shrink-0">
                        <span>Lire</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* FULL ARTICLE MODAL READER */}
      {selectedPost && (
        <div 
          className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedPost(null)}
        >
          <div 
            className="max-w-3xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
              title="Fermer la publication"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-6">
              
              {/* Header Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs">
                {(() => {
                  const cat = resolveTechCategory(selectedPost);
                  const style = getCategoryBadgeStyle(cat);
                  return (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${style.badge}`}>
                      {cat === 'Cloud' && <Cloud className="w-3.5 h-3.5" />}
                      {cat === 'AI' && <Sparkles className="w-3.5 h-3.5" />}
                      {cat === 'Web' && <Globe className="w-3.5 h-3.5" />}
                      {cat === 'Mobile' && <Smartphone className="w-3.5 h-3.5" />}
                      <span>{cat} • {selectedPost.category}</span>
                    </span>
                  );
                })()}
                <span className="text-slate-400 font-mono">{selectedPost.date}</span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400 font-mono">{selectedPost.readTime} de lecture</span>
              </div>

              {/* Title */}
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                {selectedPost.title}
              </h2>

              {/* Author & Metadata Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800 gap-4">
                <div className="flex items-center space-x-3">
                  {getAuthorAvatar(selectedPost) ? (
                    <img 
                      src={getAuthorAvatar(selectedPost)} 
                      alt={getAuthorName(selectedPost.author)}
                      className="w-11 h-11 rounded-full object-cover border border-cyan-500/40"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-slate-800 border border-slate-700 text-cyan-400 flex items-center justify-center font-bold text-sm">
                      {getAuthorName(selectedPost.author).charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-white text-sm">{getAuthorName(selectedPost.author)}</div>
                    <div className="text-xs text-slate-400">{getAuthorRole(selectedPost)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleLike(selectedPost.id)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      likedPosts[selectedPost.id]
                        ? 'bg-rose-950 border-rose-500 text-rose-400'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedPosts[selectedPost.id] ? 'fill-rose-500' : ''}`} />
                    <span>{(selectedPost.likes || 120) + (likedPosts[selectedPost.id] ? 1 : 0)}</span>
                  </button>

                  <button
                    onClick={() => handleShare(selectedPost)}
                    className="px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Lien copié !' : 'Partager'}</span>
                  </button>
                </div>
              </div>

              {/* Article Content */}
              <div className="prose prose-invert max-w-none text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
                <p className="text-base text-slate-200 font-medium italic border-l-2 border-cyan-400 pl-4 py-1">
                  {selectedPost.excerpt}
                </p>
                <div className="pt-4 text-slate-300 space-y-4 whitespace-pre-line leading-relaxed">
                  {selectedPost.content || selectedPost.excerpt}
                </div>
              </div>

              {/* Tags in reader */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-800/80 flex flex-wrap gap-2 items-center">
                  <span className="text-xs text-slate-400 font-bold uppercase">Technologies abordées :</span>
                  {selectedPost.tags.map((t, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-400">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer Modal Action */}
              <div className="pt-6 border-t border-slate-800 flex justify-between items-center">
                <span className="text-xs text-slate-400">
                  © 2026 V&amp;I TECH AFRICA LTD • Tous droits réservés
                </span>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-cyan-600/20"
                >
                  Fermer l'article
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  );
};
