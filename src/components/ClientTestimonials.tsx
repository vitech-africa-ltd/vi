import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Quote, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  Award, 
  Sparkles,
  Pause,
  Play,
  TrendingUp,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { Testimonial } from '../types';

export const ClientTestimonials: React.FC = () => {
  const { testimonials } = useSiteData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Key metrics and impact map for added social proof credibility
  const metricsMap: Record<string, { metric: string; label: string }> = {
    '1': { metric: '99.99%', label: 'Disponibilité Core Banking' },
    '2': { metric: '< 2s', label: 'Validation MTN MoMo' },
    '3': { metric: '+340%', label: 'Flotte connectée en temps réel' },
    '4': { metric: '100%', label: 'Fonctionnement Offline & SQLite' },
    '5': { metric: '0 Erreur', label: 'Conformité Chiffrement Santé' },
    '6': { metric: '-60%', label: 'Coûts Cloud Kubernetes' },
    '7': { metric: '12 000+', label: 'Agriculteurs connectés sans 4G' },
    '8': { metric: 'x5', label: 'Capacité de trafic Black Friday' },
  };

  // Filtered testimonials
  const filteredList = useMemo(() => {
    if (!testimonials || testimonials.length === 0) return [];
    if (selectedCategory === 'all') return testimonials;
    if (selectedCategory === 'fintech') {
      return testimonials.filter(t => 
        t.projectDelivered?.toLowerCase().includes('banking') || 
        t.projectDelivered?.toLowerCase().includes('momo') ||
        t.projectDelivered?.toLowerCase().includes('paiement') ||
        t.projectDelivered?.toLowerCase().includes('fintech')
      );
    }
    if (selectedCategory === 'desktop') {
      return testimonials.filter(t => 
        t.projectDelivered?.toLowerCase().includes('c#') || 
        t.projectDelivered?.toLowerCase().includes('wpf') || 
        t.projectDelivered?.toLowerCase().includes('desktop') ||
        t.projectDelivered?.toLowerCase().includes('gestion')
      );
    }
    if (selectedCategory === 'mobile-cloud') {
      return testimonials.filter(t => 
        t.projectDelivered?.toLowerCase().includes('mobile') || 
        t.projectDelivered?.toLowerCase().includes('flutter') || 
        t.projectDelivered?.toLowerCase().includes('kubernetes') || 
        t.projectDelivered?.toLowerCase().includes('devops') || 
        t.projectDelivered?.toLowerCase().includes('saas')
      );
    }
    return testimonials;
  }, [testimonials, selectedCategory]);

  const total = filteredList.length;

  // Reset index if category filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [selectedCategory]);

  // Autoplay and progress bar interval
  useEffect(() => {
    if (!isAutoPlaying || total <= 1) return;

    const intervalTime = 6500; // 6.5 seconds per slide
    const stepTime = 50; // update progress every 50ms
    const stepIncrement = (stepTime / intervalTime) * 100;

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentIndex((idx) => (idx + 1) % total);
          return 0;
        }
        return prev + stepIncrement;
      });
    }, stepTime);

    return () => clearInterval(progressTimer);
  }, [isAutoPlaying, total, currentIndex]);

  const handlePrev = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  // Touch swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 50) {
      handleNext();
    } else if (diff < -50) {
      handlePrev();
    }
    setTouchStartX(null);
  };

  if (!filteredList || filteredList.length === 0) return null;

  const current: Testimonial = filteredList[currentIndex] || filteredList[0];
  const impact = metricsMap[current.id] || { metric: '5.0 / 5', label: 'Score Qualité Livrable' };

  return (
    <section 
      id="testimonials-section" 
      className="py-24 bg-slate-900 dark:bg-slate-950 text-white relative overflow-hidden border-t border-slate-800 transition-colors duration-200"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Subtle Ambient Background Lighting */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Témoignages Clients &amp; Références Panafricaines</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            La Confiance de nos Clients &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
              Partenaires
            </span>
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-300 dark:text-slate-400 leading-relaxed">
            De Kigali à Dakar, en passant par Goma, Abidjan, Casablanca et Paris, découvrez comment nos solutions logicielles et nos architectures Cloud accélèrent la croissance des entreprises.
          </p>

          {/* Filter Category Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              Tous les Avis ({testimonials.length})
            </button>

            <button
              onClick={() => setSelectedCategory('fintech')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'fintech'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              Fintech &amp; Mobile Money
            </button>

            <button
              onClick={() => setSelectedCategory('desktop')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'desktop'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              Logiciels Desktop &amp; C# WPF
            </button>

            <button
              onClick={() => setSelectedCategory('mobile-cloud')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'mobile-cloud'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              Mobile, SaaS &amp; Cloud
            </button>
          </div>
        </div>

        {/* Carousel Card with Smooth Animations */}
        <div 
          className="max-w-5xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="relative bg-slate-950/90 dark:bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-10 md:p-12 shadow-2xl backdrop-blur-xl transition-all">
            
            {/* Progress Bar for Autoplay */}
            {isAutoPlaying && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 rounded-t-3xl overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 transition-all duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Top Bar inside Testimonial Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Quote className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(current.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-200 ml-1.5 font-mono">5.0 / 5.0</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Avis client vérifié &amp; projet validé</span>
                  </p>
                </div>
              </div>

              {/* Impact Metric Pill */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Impact : {impact.metric}</span>
                <span className="text-emerald-400/70 text-[11px] hidden sm:inline">({impact.label})</span>
              </div>
            </div>

            {/* Main Quote Text */}
            <div className="py-8 sm:py-10">
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-100 leading-relaxed italic animate-in fade-in duration-300">
                "{current.content}"
              </p>
            </div>

            {/* Project Deliverable Banner */}
            {current.projectDelivered && (
              <div className="mb-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-950/50 border border-blue-800/60 text-xs text-blue-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-semibold">Livrable :</span>
                <span className="font-mono text-blue-200">{current.projectDelivered}</span>
              </div>
            )}

            {/* Author Footer & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-4">
                <img 
                  src={current.avatar} 
                  alt={current.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{current.name}</span>
                    {current.countryCode && (
                      <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-mono">
                        {current.countryCode}
                      </span>
                    )}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-blue-400">
                    {current.role}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{current.company}</span>
                    <span className="text-slate-600">•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{current.country}</span>
                  </p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                  title={isAutoPlaying ? "Mettre en pause le carrousel" : "Activer la lecture automatique"}
                  aria-label={isAutoPlaying ? "Pause carousel" : "Play carousel"}
                >
                  {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white border border-slate-700 hover:border-blue-500 transition-all shadow-md cursor-pointer"
                  aria-label="Témoignage précédent"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-xs font-mono text-slate-400 px-2 font-bold">
                  {currentIndex + 1} / {total}
                </span>

                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-blue-600 text-white border border-slate-700 hover:border-blue-500 transition-all shadow-md cursor-pointer"
                  aria-label="Témoignage suivant"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-2">
              {filteredList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setProgress(0);
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-gradient-to-r from-blue-500 to-emerald-400' 
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* Quick Client Thumbnail Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2.5 mt-6">
            {filteredList.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => {
                  setProgress(0);
                  setCurrentIndex(idx);
                }}
                className={`p-2 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                  currentIndex === idx
                    ? 'bg-blue-950/70 border-blue-500 ring-1 ring-blue-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-7 h-7 rounded-lg object-cover shrink-0 border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 overflow-hidden">
                  <p className="text-[11px] font-bold text-slate-200 truncate">{item.name.split(' ')[0]}</p>
                  <p className="text-[9px] text-slate-400 truncate">{item.countryCode || item.country}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Trust Guarantees Bar */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-950/60 dark:bg-slate-900/40 border border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">99.4%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Taux de satisfaction certifié</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Cession propriété intellectuelle</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">6 Hubs</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Kigali, Goma, Dakar, Paris...</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">6 Mois</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Garantie SLA &amp; support inclus</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
