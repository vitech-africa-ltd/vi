import React, { useState } from 'react';
import { 
  Briefcase, 
  ArrowUpRight, 
  ChevronRight, 
  MapPin
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { CaseStudy } from '../types';
import { CaseStudyModal } from './CaseStudyModal';

interface PortfolioSectionProps {
  onStartProjectWithContext: (projectName: string) => void;
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ onStartProjectWithContext }) => {
  const { caseStudies } = useSiteData();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeModalStudy, setActiveModalStudy] = useState<CaseStudy | null>(null);

  const categories = [
    { id: 'all', label: 'Toutes les Réalisations' },
    { id: 'fintech', label: 'Fintech & Paiement' },
    { id: 'agritech', label: 'AgriTech & IA' },
    { id: 'healthtech', label: 'Santé & E2EE' },
    { id: 'saas', label: 'SaaS B2B & Fret' },
  ];

  const filteredStudies = activeCategory === 'all'
    ? caseStudies
    : caseStudies.filter(cs => cs.category?.toLowerCase().includes(activeCategory) || cs.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-slate-900 text-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('portfolio.badge', 'Portfolio & Études de Cas Détaillées')}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              {t('portfolio.title', 'Nos Réalisations d’Ingénierie Logicielle')}{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                en Afrique
              </span>
            </h2>
            <p className="text-slate-300 text-base">
              {t('portfolio.subtitle', 'Découvrez comment nous avons transformé des défis technologiques complexes en solutions digitales à fort impact.')}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudies.map((study) => {
            const techs = Array.isArray(study.technologies) 
              ? study.technologies 
              : Array.isArray(study.techStack) 
              ? study.techStack 
              : [];
            
            const impactMetric = study.impactMetric || (study.results && study.results.length > 0 ? `${study.results[0].label}: ${study.results[0].value}` : 'Haute Performance');
            const summaryText = study.summary || study.description || '';
            const flag = study.countryFlag || '🌍';
            const countryName = study.country || 'Afrique';
            const clientName = study.client || 'Partenaire Vitech';

            return (
              <div
                key={study.id}
                onClick={() => setActiveModalStudy(study)}
                className="group bg-slate-950/90 rounded-3xl border border-slate-800/90 hover:border-emerald-500/60 overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-emerald-950/40 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Cover Image Container */}
                <div className="relative h-60 overflow-hidden">
                  <img
                    src={study.image || 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'}
                    alt={study.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                  
                  {/* Floating Metric Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 rounded-full bg-slate-950/80 backdrop-blur-md border border-emerald-500/40 text-emerald-400 text-xs font-bold shadow-md">
                      {impactMetric}
                    </span>
                  </div>

                  {/* Country Flag Pill */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700 text-xs font-medium text-slate-200">
                    <span>{flag}</span>
                    <span className="hidden sm:inline">{countryName}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1 mb-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      <span>Client : {clientName}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {study.title}
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 line-clamp-3 leading-relaxed">
                      {summaryText}
                    </p>
                  </div>

                  {/* Technologies Stack Tags */}
                  <div className="space-y-4 pt-2">
                    <div className="flex flex-wrap gap-1.5">
                      {techs.slice(0, 4).map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300"
                        >
                          {tech}
                        </span>
                      ))}
                      {techs.length > 4 && (
                        <span className="px-2 py-1 text-[11px] text-slate-500 font-mono">
                          +{techs.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Read More Link */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-900 text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                      <span className="flex items-center gap-1">
                        Consulter l'architecture & les métriques
                        <ArrowUpRight className="w-4 h-4" />
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Case Study Full Modal */}
      {activeModalStudy && (
        <CaseStudyModal
          caseStudy={activeModalStudy}
          onClose={() => setActiveModalStudy(null)}
          onStartSimilarProject={(name) => {
            setActiveModalStudy(null);
            onStartProjectWithContext(name);
          }}
        />
      )}
    </section>
  );
};
