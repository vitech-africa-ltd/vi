import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Cloud, 
  Cpu, 
  ShieldCheck, 
  Layout, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  ChevronRight, 
  Layers, 
  CheckCircle2,
  Lock,
  Coins,
  ArrowRightLeft
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { ServiceItem } from '../types';

interface ServicesSectionProps {
  onSelectServiceForQuote: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForQuote }) => {
  const { services } = useSiteData();
  const { t } = useTranslation();
  const { formatCurrency, currencyOption, openConverterModal } = useCurrency();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(services[0] || null);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const currentService = selectedService || services[0];

  const getIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Globe': return Globe;
      case 'Smartphone': return Smartphone;
      case 'Cloud': return Cloud;
      case 'Cpu': return Cpu;
      case 'ShieldCheck': return ShieldCheck;
      case 'Layout': return Layout;
      default: return Layers;
    }
  };

  const formatServicePrice = (priceStr?: string) => {
    if (!priceStr) return formatCurrency(2500);
    const num = parseInt(priceStr.replace(/[^0-9]/g, ''), 10);
    if (isNaN(num) || num === 0) return priceStr;
    return formatCurrency(num);
  };

  const filteredServices = activeFilter === 'all' 
    ? services 
    : services.filter(s => {
        if (activeFilter === 'dev') return s.category === 'web' || s.category === 'mobile' || s.id?.includes('web') || s.id?.includes('mobile');
        if (activeFilter === 'cloud') return s.category === 'cloud' || s.category === 'security' || s.id?.includes('cloud') || s.id?.includes('cyber');
        if (activeFilter === 'ai') return s.category === 'ai' || s.id?.includes('ai');
        return true;
      });

  return (
    <section id="services" className="py-20 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 relative overflow-hidden border-t border-slate-200 dark:border-slate-800 transition-colors duration-200">
      
      {/* Decorative background gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/50 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-100/40 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-500/30 text-blue-800 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{t('services.badge', 'Pôles d’Ingénierie & R&D')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            {t('services.title', 'Solutions Technologiques Sur-Mesure')}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('services.subtitle', 'De l’architecture logicielle critique à l’automatisation intelligente par IA, nos équipes d’ingénieurs seniors délivrent des systèmes scalables et pérennes.')}
          </p>

          {/* Filter Pills & Currency info */}
          <div className="flex flex-wrap justify-center items-center gap-2 pt-4">
            {[
              { id: 'all', label: t('services.allCategories', 'Tous les Domaines') },
              { id: 'dev', label: 'Web & Mobile Apps' },
              { id: 'cloud', label: 'Cloud & Sécurité' },
              { id: 'ai', label: 'IA & Automatisation' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-[#1a44c2] text-white shadow-md'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}

            <button
              onClick={() => openConverterModal()}
              className="px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Convertir les prix dans une autre devise"
            >
              <Coins className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />
              <span>Tarifs en <strong className="text-blue-700 dark:text-cyan-300 font-mono">{currencyOption.flag} {currencyOption.code}</strong></span>
              <ArrowRightLeft className="w-3 h-3 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Interactive Dual-Panel Services Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Service Selector List */}
          <div className="lg:col-span-5 space-y-3">
            {filteredServices.map(service => {
              const IconComponent = getIcon(service.icon || service.iconName);
              const isSelected = currentService?.id === service.id;

              return (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`p-4 sm:p-5 rounded-2xl transition-all cursor-pointer border ${
                    isSelected
                      ? 'bg-white dark:bg-slate-900 border-blue-600 dark:border-blue-500 shadow-xl ring-2 ring-blue-600/10'
                      : 'bg-white/80 dark:bg-slate-900/70 hover:bg-white dark:hover:bg-slate-900 border-slate-200 dark:border-slate-800/90 hover:border-slate-300 dark:hover:border-slate-700 shadow-xs'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-colors ${
                      isSelected ? 'bg-[#1a44c2] text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400">
                          {service.subtitle}
                        </span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 font-mono">
                          {formatServicePrice(service.startingPrice)}
                        </span>
                      </div>

                      <h3 className="text-base font-black text-slate-900 dark:text-white mt-0.5 truncate">
                        {service.title}
                      </h3>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-1">
                        {service.description || service.shortDesc}
                      </p>
                    </div>

                    <ChevronRight className={`w-5 h-5 shrink-0 self-center transition-transform ${
                      isSelected ? 'text-blue-600 dark:text-cyan-400 translate-x-1' : 'text-slate-400'
                    }`} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right: Detailed Technical Spec & Contractual Deliverables */}
          {currentService && (
            <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 static lg:sticky lg:top-28 text-slate-900 dark:text-slate-100">
              
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span>{t('services.ctaDetails', 'Fiche Technique & Livrables')}</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                    {currentService.title}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t('services.startingAt', 'À partir de')}</div>
                  <div className="text-2xl font-black text-[#1a44c2] dark:text-cyan-400 font-mono">
                    {formatServicePrice(currentService.startingPrice)}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{t('services.timeline', 'Délais')} : {currentService.timeline || currentService.estimatedTimeline}</span>
                  </div>
                </div>
              </div>

              {/* Service Full Description */}
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {currentService.description || currentService.fullDesc}
              </p>

              {/* Grid: Core Features vs Contractual Deliverables */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                
                {/* Features */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{t('services.featuresTitle', 'Capacités & Fonctionnalités')}</span>
                  </h4>
                  <ul className="space-y-2">
                    {currentService.features?.map((feat, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Contractual Deliverables */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>{t('services.deliverablesTitle', 'Livrables Contractuels')}</span>
                  </h4>
                  <ul className="space-y-2">
                    {currentService.deliverables?.map((deliv, idx) => (
                      <li key={idx} className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1.5 shrink-0" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Tech Stack Pills */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Technologies Maîtrisées &amp; Frameworks
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(currentService.technologies || currentService.techStack || []).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-mono font-medium border border-slate-200 dark:border-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Eco Impact Quick Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🌿</span>
                  <div className="text-xs">
                    <p className="font-bold text-emerald-900 dark:text-emerald-300">
                      Infrastructures Éco-Conçues &amp; Bas Carbone
                    </p>
                    <p className="text-emerald-700 dark:text-emerald-400/80 text-[11px]">
                      Jusqu'à -80% de CO₂e grâce à nos architectures légères &amp; serveurs hydro-solaires.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const el = document.getElementById('eco-estimator');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shrink-0 transition-colors shadow-sm cursor-pointer"
                >
                  Calculer l'impact
                </button>
              </div>

              {/* CTA Action */}
              <div className="pt-2">
                <button
                  onClick={() => onSelectServiceForQuote(currentService.id)}
                  className="w-full bg-[#1a44c2] hover:bg-[#1437a3] text-white py-3.5 px-6 rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-blue-700/20 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('services.ctaConfigure', 'Configurer ce service dans le simulateur de devis')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

    </section>
  );
};
