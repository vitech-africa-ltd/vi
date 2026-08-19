import React, { useState, useEffect, useRef } from 'react';
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
  CheckCircle2
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { Testimonial } from '../types';

export const ClientTestimonials: React.FC = () => {
  const { testimonials } = useSiteData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const total = testimonials.length;

  useEffect(() => {
    if (!isAutoPlaying || total <= 1) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 6000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, total]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  if (!testimonials || testimonials.length === 0) return null;

  const currentTestimonial: Testimonial = testimonials[currentIndex] || testimonials[0];

  return (
    <section id="testimonials-section" className="py-24 bg-slate-950 text-white relative overflow-hidden border-t border-slate-800/80">
      {/* Background Subtle Ambient Glows */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-400 text-xs font-bold tracking-wider uppercase mb-4">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Preuve Sociale &amp; Références Panafricaines</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
            Ce que disent les <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">Leaders &amp; CTOs</span> qui nous font confiance
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 leading-relaxed">
            De Dakar à Kigali, en passant par Abidjan, Casablanca et Paris, découvrez les retours d'expérience sur nos livraisons de plateformes critiques, apps mobiles et architectures cloud.
          </p>
        </div>

        {/* Testimonials Slider Container */}
        <div className="max-w-5xl mx-auto">
          <div className="relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 rounded-3xl border border-slate-800 p-6 sm:p-10 md:p-14 shadow-2xl backdrop-blur-xl transition-all">
            
            {/* Top Bar inside Card */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-8 border-b border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Quote className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-amber-400">
                    {[...Array(currentTestimonial.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="text-xs font-bold text-slate-300 ml-1.5">5.0 / 5.0</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Retour d'expérience certifié V&amp;I TECH</span>
                  </p>
                </div>
              </div>

              {currentTestimonial.projectDelivered && (
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-blue-300">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Projet : {currentTestimonial.projectDelivered}</span>
                </div>
              )}
            </div>

            {/* Main Quote Content */}
            <div className="py-8 sm:py-10">
              <p className="text-lg sm:text-xl md:text-2xl font-medium text-slate-100 leading-relaxed italic">
                "{currentTestimonial.content}"
              </p>
            </div>

            {/* Author Profile Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-6 border-t border-slate-800/80">
              <div className="flex items-center gap-4">
                <img 
                  src={currentTestimonial.avatar} 
                  alt={currentTestimonial.name}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-500/40 shadow-lg"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span>{currentTestimonial.name}</span>
                    {currentTestimonial.countryCode && (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                        {currentTestimonial.countryCode}
                      </span>
                    )}
                  </h4>
                  <p className="text-xs sm:text-sm font-semibold text-blue-400">
                    {currentTestimonial.role}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentTestimonial.company}</span>
                    <span className="text-slate-600">•</span>
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentTestimonial.country}</span>
                  </p>
                </div>
              </div>

              {/* Slider Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="p-2.5 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
                  title={isAutoPlaying ? "Mettre en pause le défilement" : "Activer le défilement automatique"}
                  aria-label={isAutoPlaying ? "Pause autoplay" : "Play autoplay"}
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

                <span className="text-xs font-mono text-slate-400 px-2">
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
            <div className="flex items-center justify-center gap-2 mt-8 pt-4">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx 
                      ? 'w-8 bg-gradient-to-r from-blue-500 to-amber-400' 
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                  aria-label={`Aller au témoignage ${idx + 1}`}
                />
              ))}
            </div>

          </div>

          {/* Quick client thumb selector strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-6">
            {testimonials.map((item, idx) => (
              <button
                key={item.id || idx}
                onClick={() => setCurrentIndex(idx)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                  currentIndex === idx
                    ? 'bg-slate-900 border-blue-500 ring-1 ring-blue-500 shadow-md'
                    : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <img 
                  src={item.avatar} 
                  alt={item.name} 
                  className="w-8 h-8 rounded-xl object-cover shrink-0 border border-slate-700"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0 overflow-hidden">
                  <p className="text-xs font-bold text-slate-200 truncate">{item.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-slate-400 truncate">{item.company}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Social Proof Trust Badges Bar */}
          <div className="mt-12 p-6 rounded-2xl bg-slate-900/40 border border-slate-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">99.4%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Taux de satisfaction client</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">100%</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Cession propriété intellectuelle</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">6 Hubs</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Dakar, Kigali, Abidjan, Paris...</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">6 Mois</p>
              <p className="text-xs text-slate-400 mt-1 font-medium">Garantie &amp; support offerts</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
