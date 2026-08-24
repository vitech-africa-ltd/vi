import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ShieldCheck, 
  Coins, 
  Code2, 
  Clock, 
  Lock, 
  MessageSquare, 
  Sparkles, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Globe2, 
  CreditCard, 
  Scale, 
  Layers, 
  Cpu, 
  Calendar,
  BookOpen,
  Mail,
  ChevronRight,
  FileCheck2,
  Terminal,
  Zap,
  Smartphone,
  Server,
  Laptop,
  FileCode
} from 'lucide-react';
import { FaqSection } from '../components/FaqSection';
import { TechBlogSection } from '../components/TechBlogSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCountry } from '../context/CountryContext';
import { useSiteData } from '../context/SiteDataContext';
import { OfficeHub } from '../types';

interface FaqPageProps {
  onOpenChat: () => void;
  onOpenScheduleModal: (hub?: OfficeHub) => void;
  onNavigateToView: (viewId: string) => void;
  onSelectServiceForQuote?: (serviceId: string) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({
  onOpenChat,
  onOpenScheduleModal,
  onNavigateToView,
  onSelectServiceForQuote,
}) => {
  const { t } = useTranslation();
  const { currencyOption } = useCurrency();
  const { currentCountry } = useCountry();
  const { companyInfo } = useSiteData();

  const [selectedServiceCategory, setSelectedServiceCategory] = useState<string>('all');

  const keyGuarantees = [
    {
      icon: Scale,
      title: 'Propriété 100% Client & Git',
      desc: 'Cession contractuelle totale et irréversible de l’ensemble du code source, dépôts privés et licences à la livraison.',
      badge: 'Garantie Juridique'
    },
    {
      icon: Coins,
      title: `Facturation en ${currencyOption.code}`,
      desc: `Paiement échelonné par Sprints validés (30% / 50% / 20%) en devises locales et Mobile Money (${currentCountry.name}).`,
      badge: 'Transparence Prix'
    },
    {
      icon: ShieldCheck,
      title: 'SLA 99.99% & Garantie 6 Mois',
      desc: 'Maintenance corrective prioritaire sans surcoût post-lancement et monitoring d’infrastructure Cloud 24/7.',
      badge: 'Qualité Certifiée'
    },
    {
      icon: Clock,
      title: 'Livraison MVP en 4 à 8 Semaines',
      desc: 'Méthodologie Agile Scrum avec démos bimensuelles sur serveurs de staging et accès continu au portail client.',
      badge: 'Agilité & Cadence'
    }
  ];

  const quickServicesList = [
    { id: 'web-saas', label: 'Web & SaaS Next.js', icon: Globe2 },
    { id: 'mobile', label: 'Mobile Offline-First', icon: Smartphone },
    { id: 'csharp-desktop', label: 'C# .NET & Desktop', icon: Laptop },
    { id: 'cloud-devops', label: 'Cloud & FinOps', icon: Server },
    { id: 'ai-automation', label: 'IA & RAG Gemini', icon: Cpu },
    { id: 'cybersecurity', label: 'Cybersécurité & Audit', icon: ShieldCheck },
  ];

  return (
    <div className="pt-24 pb-16 bg-slate-950 text-slate-100 min-h-screen animate-in fade-in duration-300">
      
      {/* ========================================================
          PAGE HERO BANNER & BREADCRUMB
      ======================================================== */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-20 overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6 font-medium">
            <button 
              onClick={() => onNavigateToView('home')} 
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Accueil
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-cyan-400 font-semibold">Foire Aux Questions (FAQ) &amp; Centre d'Aide</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider shadow-sm">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Centre de Connaissances Techniques &amp; Support V&amp;I Tech Africa</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Foire Aux Questions &amp;{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Architecture des Services
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Consultez nos réponses directes sur les aspects juridiques, la tarification en devises panafricaines, les stacks technologiques modernes (React, Next.js, Flutter, C# WPF, Cloud &amp; IA), la propriété intellectuelle et les garanties SLA.
            </p>

            {/* Direct Action Fast Buttons */}
            <div className="pt-4 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigateToView('estimator')}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Simuler un devis en ligne</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenScheduleModal()}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Prendre RDV avec un Architecte (30 min)</span>
              </button>

              <button
                onClick={onOpenChat}
                className="px-5 py-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Poser une question en direct</span>
              </button>
            </div>

          </div>

          {/* Quick Pillars Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyGuarantees.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-cyan-500/40 transition-all duration-300 backdrop-blur-md space-y-2.5 shadow-lg group"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-cyan-400 group-hover:bg-cyan-500/20 group-hover:border-cyan-500/40 group-hover:text-cyan-300 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* ========================================================
          MAIN FAQ ACCORDION SECTION (DYNAMICALLY CONTEXTUALIZED)
      ======================================================== */}
      <FaqSection
        onOpenChat={onOpenChat}
        onOpenEstimator={() => onNavigateToView('estimator')}
        onOpenScheduleModal={onOpenScheduleModal}
        onNavigateToView={onNavigateToView}
        onSelectServiceForQuote={onSelectServiceForQuote}
        initialCategory={selectedServiceCategory}
      />

      {/* ========================================================
          TECHNICAL DISPATCH & DEPORTED SECONDARY SECTIONS
      ======================================================== */}
      
      {/* 1. Technical Engineering Blog & Thought Leadership */}
      <div className="border-t border-slate-800/80 bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Publications &amp; Documentation Approfondie</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Approfondir avec nos Guides d'Ingénierie
              </h2>
            </div>
            <button
              onClick={() => onNavigateToView('blog')}
              className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline self-start sm:self-auto cursor-pointer"
            >
              <span>Voir tous les articles R&amp;D</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <TechBlogSection />
      </div>

      {/* 2. Newsletter & Technical Resources Digest */}
      <div className="border-t border-slate-800/80">
        <NewsletterSection />
      </div>

      {/* 3. Direct Contact & Escalation Help Box */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 p-8 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-5 h-5 text-cyan-400" />
              <span>Vous avez un cahier des charges spécifique ou un appel d'offres ?</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Transmettez vos spécifications fonctionnelles ou réservez une session de cadrage technique confidentielle avec notre Direction Générale et nos Directeurs de Projets.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigateToView('contact')}
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              Formulaire de Contact Dédié
            </button>
            <button
              onClick={() => onOpenScheduleModal()}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all cursor-pointer"
            >
              Planifier un Appel
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
