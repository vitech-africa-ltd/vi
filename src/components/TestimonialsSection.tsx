import React from 'react';
import { 
  Quote, 
  Star, 
  Award
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';

export const TestimonialsSection: React.FC = () => {
  const { testimonials } = useSiteData();

  return (
    <section className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Confiance &amp; Témoignages Leaders</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            Ce que Disent les Directeurs Techniques &amp;{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              Fondateurs
            </span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg">
            Ils nous confient leurs applications critiques, leurs infrastructures bancaires et leurs systèmes à forte charge.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="p-8 rounded-3xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-6 shadow-xl relative"
            >
              <Quote className="w-8 h-8 text-emerald-500/40 absolute top-6 right-6" />

              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(t.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-slate-300 italic leading-relaxed">
                  "{t.content}"
                </p>
              </div>

              {/* Author and Project Delivered */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center space-x-3">
                  {t.avatar && (
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-11 h-11 rounded-full object-cover border border-emerald-500/40"
                      referrerPolicy="no-referrer"
                    />
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{t.name}</span>
                      <span>{t.flag}</span>
                    </h4>
                    <p className="text-xs text-slate-400">{t.role} • {t.company}</p>
                  </div>
                </div>

                {t.projectDelivered && (
                  <div className="text-[11px] font-mono text-emerald-400/90 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                    Projet livré : {t.projectDelivered}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
