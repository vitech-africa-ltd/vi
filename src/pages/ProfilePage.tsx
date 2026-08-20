import React, { useState } from 'react';
import { 
  Award, 
  Code2, 
  Globe, 
  GraduationCap, 
  Layers, 
  Briefcase, 
  Phone, 
  Mail, 
  MessageSquare, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { FounderSkillsSection } from '../components/FounderSkillsSection';
import { InternationalPricingSection } from '../components/InternationalPricingSection';
import { useTranslation } from '../context/LanguageContext';

interface ProfilePageProps {
  onNavigateToView: (viewId: string) => void;
  onOpenScheduleModal: () => void;
  onOpenChat: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onNavigateToView,
  onOpenScheduleModal,
  onOpenChat,
}) => {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState<'profile' | 'pricing'>('profile');

  return (
    <div className="pt-24 pb-16 bg-slate-950 text-white animate-in fade-in duration-300 min-h-screen">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 sm:py-20 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>Profil Professionnel, Compétences &amp; Grille Tarifaire 2026</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              Direction Technique &amp;{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                Ingénierie Logicielle
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Consultez le profil technique officiel du fondateur, la maîtrise des technologies clés (C# / .NET / WPF, Web Fullstack, PHP, Python, APIs &amp; Mobile Money), le cursus universitaire à l'ULK et la grille tarifaire internationale 2026 adaptée par la Banque Mondiale.
            </p>

            {/* Sub-navigation Switcher */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveSection('profile')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeSection === 'profile'
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Code2 className="w-4 h-4" />
                <span>Profil Technique &amp; Compétences</span>
              </button>

              <button
                onClick={() => setActiveSection('pricing')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
                  activeSection === 'pricing'
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>Grille Tarifaire Internationale (Banque Mondiale)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dynamic View Content */}
      {activeSection === 'profile' ? (
        <FounderSkillsSection
          onContactFounder={() => onNavigateToView('contact')}
        />
      ) : (
        <InternationalPricingSection
          onNavigateToEstimator={() => onNavigateToView('estimator')}
          onNavigateToContact={(subject) => onNavigateToView('contact')}
        />
      )}

      {/* Bottom Cross-Navigation Card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white">Prêt à concrétiser votre vision technologique ?</h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Nos ingénieurs et notre Direction Technique sont à votre écoute pour un cadrage technique gratuit de 30 minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToView('estimator')}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-blue-600/20"
            >
              <span>Calculer un devis</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenScheduleModal}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <span>Prendre rendez-vous</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
