import React, { useState } from 'react';
import { 
  Sparkles, 
  Cpu, 
  Layers3, 
  Globe2, 
  Award, 
  Video, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Code2, 
  Terminal,
  Server,
  Zap
} from 'lucide-react';
import { FounderSkillsSection } from '../components/FounderSkillsSection';
import { SocialProofVideos } from '../components/SocialProofVideos';
import { InternationalPricingSection } from '../components/InternationalPricingSection';
import { TechHubsMap } from '../components/TechHubsMap';
import { OfficeHub } from '../types';

interface TechLabPageProps {
  onNavigateToView: (viewId: string) => void;
  onOpenScheduleModal: (hub?: OfficeHub) => void;
  onOpenChat: () => void;
}

export const TechLabPage: React.FC<TechLabPageProps> = ({
  onNavigateToView,
  onOpenScheduleModal,
  onOpenChat,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'skills' | 'demos' | 'pricing' | 'hubs'>('all');

  return (
    <div className="pt-24 pb-20 bg-slate-950 text-white min-h-screen animate-in fade-in duration-300">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Laboratoire R&amp;D • Stack Technique 2026 • Démonstrations en Direct</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Écosystème Technologique &amp;{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Pôle d'Innovation R&amp;D
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              Explorez en profondeur les fondations technologiques de Vitech Africa : nos matrices de compétences logicielles, nos démonstrations vidéo haute résolution, nos hubs panafricains et notre grille tarifaire internationale conforme aux standards de la Banque Mondiale.
            </p>

            {/* Quick Filter Switcher */}
            <div className="pt-4 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'all'
                    ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/20 font-black'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Layers3 className="w-4 h-4" />
                <span>Tout l'Écosystème</span>
              </button>

              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'skills'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Matrice Technique &amp; Compétences</span>
              </button>

              <button
                onClick={() => setActiveTab('demos')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'demos'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Démonstrations Vidéos &amp; Preuves</span>
              </button>

              <button
                onClick={() => setActiveTab('pricing')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'pricing'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Globe2 className="w-4 h-4" />
                <span>Tarifs Banque Mondiale</span>
              </button>

              <button
                onClick={() => setActiveTab('hubs')}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeTab === 'hubs'
                    ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Hubs Panafricains &amp; R&amp;D</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section 1: Founder & Engineering Skills Matrix */}
      {(activeTab === 'all' || activeTab === 'skills') && (
        <section id="section-skills" className="border-b border-slate-900/80">
          <FounderSkillsSection
            onContactFounder={() => onNavigateToView('contact')}
          />
        </section>
      )}

      {/* Section 2: Social Proof & Veo Video Demonstrations */}
      {(activeTab === 'all' || activeTab === 'demos') && (
        <section id="section-demos" className="border-b border-slate-900/80">
          <SocialProofVideos />
        </section>
      )}

      {/* Section 3: International World Bank 4-Tier Pricing Grid */}
      {(activeTab === 'all' || activeTab === 'pricing') && (
        <section id="section-pricing" className="border-b border-slate-900/80">
          <InternationalPricingSection
            onNavigateToEstimator={(serviceId) => onNavigateToView('estimator')}
            onNavigateToContact={() => onNavigateToView('contact')}
          />
        </section>
      )}

      {/* Section 4: Pan-African Tech Hubs Map */}
      {(activeTab === 'all' || activeTab === 'hubs') && (
        <section id="section-hubs">
          <TechHubsMap
            onScheduleCall={onOpenScheduleModal}
          />
        </section>
      )}

      {/* Bottom Conversion Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900 border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left shadow-2xl">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Architecture &amp; Cadrage Sur-Mesure</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Besoin d'une démonstration personnalisée ou d'une étude d'architecture ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Nos architectes logiciels vous accompagnent de la rédaction du cahier des charges jusqu'au déploiement en production.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <button
              onClick={() => onNavigateToView('estimator')}
              className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <span>Simulateur de Devis en Ligne</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenScheduleModal()}
              className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-700 cursor-pointer active:scale-95"
            >
              <span>Prendre Rendez-vous (30 min)</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
