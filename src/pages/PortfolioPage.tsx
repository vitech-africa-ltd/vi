import React from 'react';
import { 
  Briefcase, 
  ArrowRight, 
  Calendar
} from 'lucide-react';
import { PortfolioSection } from '../components/PortfolioSection';
import { TestimonialsSection } from '../components/TestimonialsSection';
import { useTranslation } from '../context/LanguageContext';

interface PortfolioPageProps {
  onStartProjectWithContext: (projectName: string) => void;
  onOpenScheduleModal: () => void;
  onNavigateToView: (viewId: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  onStartProjectWithContext,
  onOpenScheduleModal,
  onNavigateToView,
}) => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 bg-slate-50 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{t('portfolio.heroBadge', 'Études de Cas & Systèmes en Production')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {t('portfolio.heroTitle', 'Découvrez Nos Réalisations Majeures &')}{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                {t('portfolio.heroTitleHighlight', 'Impacts Mesurés')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('portfolio.heroDesc', 'Des applications financières à fort volume de transactions aux plateformes logistiques et médicales, découvrez comment nos ingénieurs ont résolu des défis techniques complexes.')}
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateToView('estimator')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('portfolio.heroCtaQuote', 'Chiffrer un projet similaire')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenScheduleModal}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span>{t('portfolio.heroCtaTechDir', 'Discuter avec notre Direction Technique')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Portfolio Component */}
      <PortfolioSection onStartProjectWithContext={onStartProjectWithContext} />

      {/* Testimonials */}
      <TestimonialsSection />

    </div>
  );
};
