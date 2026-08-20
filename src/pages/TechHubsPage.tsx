import React from 'react';
import { 
  Globe2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  Building, 
  Users, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { TechHubsMap } from '../components/TechHubsMap';
import { useSiteData } from '../context/SiteDataContext';
import { useTranslation } from '../context/LanguageContext';
import { OfficeHub } from '../types';

interface TechHubsPageProps {
  onScheduleCall: (hub?: OfficeHub) => void;
  onNavigateToView: (viewId: string) => void;
}

export const TechHubsPage: React.FC<TechHubsPageProps> = ({
  onScheduleCall,
  onNavigateToView,
}) => {
  const { techHubs, companyInfo } = useSiteData();
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 bg-slate-950 text-white animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-16 border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Globe2 className="w-3.5 h-3.5" />
              <span>{t('techHubs.heroBadge', 'Réseau Panafricain & International')}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
              {t('techHubs.heroTitle', 'Une Présence Stratégique à Travers les')}{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                {t('techHubs.heroTitleHighlight', 'Capitales Technologiques')}
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('techHubs.heroDesc', "De notre siège à Kigali aux pôles d'ingénierie de Dakar, Abidjan, Nairobi, Casablanca et notre antenne de liaison à Paris, nos équipes seniors sont au plus près de vos enjeux opérationnels.")}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => onScheduleCall()}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>{t('techHubs.heroCtaSchedule', 'Prendre RDV dans un de nos Hubs')}</span>
              </button>

              <button
                onClick={() => onNavigateToView('contact')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>{t('techHubs.heroCtaContact', 'Contacter la Direction Générale')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Interactive Map Component */}
      <TechHubsMap onScheduleCall={onScheduleCall} />

      {/* Detailed Hub Cards List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">{t('techHubs.officesBadge', 'Bureaux & Coordonnées')}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{t('techHubs.officesTitle', 'Nos Bureaux & Centres de R&D')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techHubs.map((hub) => (
            <div
              key={hub.id}
              className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 hover:border-cyan-500/60 shadow-xl transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{hub.flag || '🌍'}</span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                    {hub.role || 'Hub R&D'}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-black text-white">{hub.city}, {hub.country}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{hub.address}</span>
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('techHubs.team', 'Équipe')} : <strong>{hub.teamSize || '15+'}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{t('techHubs.specialty', 'Spécialité')} : <strong className="text-cyan-300">{hub.specialty}</strong></span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  onClick={() => onScheduleCall(hub)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('techHubs.bookVisit', 'Réserver une visite ou un RDV')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
