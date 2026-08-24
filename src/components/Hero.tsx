import React from 'react';
import { 
  ArrowRight, 
  Globe, 
  Code2, 
  ShieldCheck, 
  Calendar,
  Smartphone,
  Server
} from 'lucide-react';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { VisitorCounterBadge } from './VisitorCounterBadge';

interface HeroProps {
  onExploreServices?: () => void;
  onOpenEstimator?: () => void;
  onOpenScheduleModal?: () => void;
  onNavigateToEstimator?: () => void;
  onNavigateToClientPortal?: () => void;
  onNavigateToPortfolio?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreServices,
  onOpenEstimator,
  onOpenScheduleModal,
  onNavigateToEstimator,
  onNavigateToClientPortal,
  onNavigateToPortfolio,
}) => {
  const { companyInfo } = useSiteData();
  const { t } = useTranslation();

  const handleServices = onExploreServices || (() => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  });

  const handleEstimator = onOpenEstimator || onNavigateToEstimator || (() => {
    document.getElementById('estimator')?.scrollIntoView({ behavior: 'smooth' });
  });

  const handleSchedule = onOpenScheduleModal || (() => {});

  const handlePortfolio = onNavigateToPortfolio || (() => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  });

  return (
    <section className="relative pt-20 pb-16 lg:pt-24 lg:pb-24 bg-slate-900 overflow-hidden">
      
      {/* Background Cityscape Skyline Image with Twilight Blue Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=80')`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-blue-950/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
      </div>

      {/* Main Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-10 sm:pt-14 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 text-left space-y-6">
            {/* Eyebrow / Tagline & Live Visitor Status */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-600/20 border border-blue-400/30 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>{companyInfo.name} • {companyInfo.motto}</span>
              </div>

              <VisitorCounterBadge variant="hero" />
            </div>

            {/* Bold Display Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] sm:leading-[1.1] drop-shadow-md">
              {t('hero.title1', 'L’Ingénierie Logicielle')} <br />
              <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
                {t('hero.title2', 'qui Propulse les Leaders en Afrique')}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-200 font-normal leading-relaxed max-w-2xl drop-shadow">
              {companyInfo.tagline || t('hero.desc')}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
              <button
                id="hero-our-services-btn"
                onClick={handleServices}
                className="bg-[#1a44c2] hover:bg-[#1437a3] text-white px-6 sm:px-8 py-3.5 rounded-2xl sm:rounded-full text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-xl shadow-blue-900/40 hover:shadow-2xl active:scale-95 transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>{t('hero.ctaServices', 'NOS SERVICES')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-estimator-btn"
                onClick={handleEstimator}
                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 py-3.5 rounded-2xl sm:rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all inline-flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <span>{t('hero.ctaEstimator', 'Devis en Ligne')}</span>
              </button>

              <button
                onClick={handleSchedule}
                className="text-cyan-300 hover:text-white px-4 py-3 sm:py-3.5 text-xs sm:text-sm font-bold tracking-wider uppercase inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{t('hero.ctaCall', 'Cadrage Technique (30 min)')}</span>
              </button>
            </div>

            {/* Real-time Platform Key Indicators */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-left">
              <div className="p-3 sm:p-0 rounded-xl bg-slate-950/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
                <div className="text-xl sm:text-2xl font-black text-white font-mono">{companyInfo.stats.uptimeSLA}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t('hero.statSla', 'Uptime SLA Garanti')}</div>
              </div>
              <div className="p-3 sm:p-0 rounded-xl bg-slate-950/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
                <div className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{companyInfo.stats.projectsCompleted}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t('hero.statProjects', 'Projets Déployés')}</div>
              </div>
              <div className="p-3 sm:p-0 rounded-xl bg-slate-950/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono">{companyInfo.stats.countriesServed}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t('hero.statCountries', 'Pays Couverts')}</div>
              </div>
              <div className="p-3 sm:p-0 rounded-xl bg-slate-950/40 sm:bg-transparent border border-slate-800/60 sm:border-0">
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">{companyInfo.stats.clientSatisfaction}</div>
                <div className="text-[10px] sm:text-[11px] text-slate-400 font-medium uppercase tracking-wider">{t('hero.statSatisfaction', 'Satisfaction Client')}</div>
              </div>
            </div>

          </div>

          {/* Right Hero Graphic Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-3xl p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Pôle d'Excellence</span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800 font-bold">
                  {companyInfo.headquarters}
                </span>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <Globe className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">Architecture Panafricaine &amp; Global Cloud</strong>
                    <span className="text-[11px] text-slate-400">Microservices, Kubernetes &amp; Multi-Régions</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">Mobile &amp; Fintech Scalable</strong>
                    <span className="text-[11px] text-slate-400">Paiements Mobile Money, Flutter &amp; Native</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-3">
                  <Server className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-white block font-bold">IA &amp; Automatisation d'Entreprise</strong>
                    <span className="text-[11px] text-slate-400">Modèles LLM, OCR &amp; Intégrations API</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePortfolio}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explorer les Réalisations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </section>
  );
};
