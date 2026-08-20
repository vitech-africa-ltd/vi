import React from 'react';
import { 
  Layers, 
  ArrowRight, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Smartphone, 
  Cloud, 
  CheckCircle2, 
  Calendar,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { ServicesSection } from '../components/ServicesSection';
import { InternationalPricingSection } from '../components/InternationalPricingSection';
import { FounderSkillsSection } from '../components/FounderSkillsSection';
import { FaqSection } from '../components/FaqSection';
import { useTranslation } from '../context/LanguageContext';

interface ServicesPageProps {
  onSelectServiceForQuote: (serviceId: string) => void;
  onOpenScheduleModal: () => void;
  onNavigateToView: (viewId: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onSelectServiceForQuote,
  onOpenScheduleModal,
  onNavigateToView,
}) => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 bg-slate-50 animate-in fade-in duration-300">
      
      {/* Dedicated Page Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>{t('services.heroBadge', "Catalogue des Services & Pôles d'Ingénierie")}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {t('services.heroTitle', 'Des Solutions Logicielle & Cloud')}{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                {t('services.heroTitleHighlight', 'Conçues pour Durer')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('services.heroDesc', "De l'architecture de plateformes SaaS scalables au développement d'applications mobiles panafricaines, en passant par les audits de cybersécurité et l'intégration de modèles IA génératifs.")}
            </p>

            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateToView('estimator')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('services.heroCtaQuote', 'Simuler un devis de projet')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenScheduleModal}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>{t('services.heroCtaCall', 'Réserver un cadrage technique')}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Services Component */}
      <ServicesSection onSelectServiceForQuote={onSelectServiceForQuote} />

      {/* International 4-Tier Pricing Grid */}
      <InternationalPricingSection
        onNavigateToEstimator={onSelectServiceForQuote}
        onNavigateToContact={() => onNavigateToView('contact')}
      />

      {/* Founder & Engineering Technical Competencies */}
      <FounderSkillsSection
        onContactFounder={() => onNavigateToView('contact')}
      />

      {/* Technical Standards Guarantee Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 font-mono">{t('services.guaranteeBadge', "Engagements d'Excellence")}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">{t('services.guaranteeTitle', 'Nos Standards Contractuels & Qualité')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('services.propTitle', 'Code 100% Propriété Client')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('services.propDesc', 'Cession totale des droits d’auteur, du code source et de la propriété intellectuelle dès la livraison finale. Dépôts privés et documentation d\'architecture inclus.')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('services.slaTitle', 'Haute Disponibilité & SLA 99.99%')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('services.slaDesc', 'Infrastructures Cloud redondantes (AWS, Google Cloud) avec astreinte technique 24/7 et temps de rétablissement garantis.')}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{t('services.warrantyTitle', 'Garantie Corrective 6 Mois')}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('services.warrantyDesc', 'Accompagnement post-lancement avec prise en charge prioritaire de tout incident technique sans surcoût.')}
            </p>
          </div>
        </div>
      </div>

      {/* FAQ on Services */}
      <FaqSection onOpenChat={onOpenScheduleModal} onOpenEstimator={() => onNavigateToView('estimator')} />

    </div>
  );
};
