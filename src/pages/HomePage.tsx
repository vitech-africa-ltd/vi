import React from 'react';
import { Hero } from '../components/Hero';
import { ServicesSection } from '../components/ServicesSection';
import { HomeScriptsTeaser } from '../components/HomeScriptsTeaser';
import { PortfolioSection } from '../components/PortfolioSection';
import { ClientTestimonials } from '../components/ClientTestimonials';
import { ContactSection } from '../components/ContactSection';
import { ContactFormData, OfficeHub } from '../types';
import { HelpCircle, ArrowRight, ShieldCheck, Coins, Sparkles, MessageSquare } from 'lucide-react';

interface HomePageProps {
  onNavigateToView: (viewId: string) => void;
  onSelectServiceForQuote: (serviceId: string) => void;
  onApplyEstimateToContact: (data: {
    projectType: string;
    features: string[];
    platforms: string[];
    sla: string;
    estimatedBudget: string;
    estimatedTimeline: string;
  }) => void;
  onStartProjectWithContext: (projectName: string) => void;
  onOpenScheduleModal: (hub?: OfficeHub) => void;
  onOpenChat: () => void;
  contactInitialData: Partial<ContactFormData>;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigateToView,
  onSelectServiceForQuote,
  onApplyEstimateToContact,
  onStartProjectWithContext,
  onOpenScheduleModal,
  onOpenChat,
  contactInitialData,
}) => {
  return (
    <div className="space-y-0 animate-in fade-in duration-300">
      {/* 1. Hero Section: Value proposition & direct actions */}
      <Hero
        onExploreServices={() => onNavigateToView('services')}
        onOpenEstimator={() => onNavigateToView('estimator')}
        onOpenScheduleModal={() => onOpenScheduleModal()}
        onNavigateToPortfolio={() => onNavigateToView('portfolio')}
        onNavigateToClientPortal={() => onNavigateToView('client-portal')}
      />

      {/* 2. Interactive Services Section: Core engineering capabilities */}
      <ServicesSection
        onSelectServiceForQuote={onSelectServiceForQuote}
      />

      {/* 3. Vitech Scripts Spotlight: Ready-to-deploy software source code marketplace */}
      <HomeScriptsTeaser
        onNavigateToScripts={() => onNavigateToView('scripts')}
      />

      {/* 4. Dynamic Portfolio & Case Studies: High impact African solutions */}
      <PortfolioSection
        onStartProjectWithContext={onStartProjectWithContext}
      />

      {/* 5. Interactive Client Testimonials & Social Proof */}
      <ClientTestimonials />

      {/* 6. FAQ Quick Assistance Banner / Teaser directing to Dedicated FAQ Page */}
      <section className="py-16 bg-slate-950 border-t border-slate-800/80 relative overflow-hidden text-slate-100">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/60 p-6 sm:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Questions Fréquentes &amp; Transparence</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Des questions techniques sur nos tarifs, délais ou la propriété du code ?
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                  Consultez notre Centre de Connaissances &amp; FAQ dédiée : nous détaillons la cession 100% de la propriété intellectuelle, le paiement par sprints en devises locales (Mobile Money / Virements), notre méthodologie Agile Scrum et nos garanties SLA.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Cession 100% Code &amp; NDA</span>
                  </div>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <Coins className="w-4 h-4 text-cyan-400" />
                    <span>Devises Panafricaines</span>
                  </div>
                  <span className="text-slate-600 hidden sm:inline">•</span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>Garantie 6 Mois Incluse</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
                <button
                  onClick={() => onNavigateToView('faq')}
                  className="w-full px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  <span>Accéder à la FAQ Dédiée</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onOpenChat}
                  className="w-full px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-cyan-400" />
                  <span>Poser une question en direct</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 7. Contact & Auto-Save Project Initiation */}
      <ContactSection
        initialData={contactInitialData}
      />
    </div>
  );
};
