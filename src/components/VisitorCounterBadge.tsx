import React, { useState } from 'react';
import { 
  Users, 
  Activity, 
  Globe, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Radio, 
  X, 
  Clock, 
  ChevronRight, 
  Flame,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { useVisitorCounter } from '../context/VisitorCounterContext';

interface VisitorCounterBadgeProps {
  variant?: 'floating' | 'inline' | 'hero' | 'footer';
  className?: string;
}

export const VisitorCounterBadge: React.FC<VisitorCounterBadgeProps> = ({
  variant = 'floating',
  className = ''
}) => {
  const { 
    totalVisits, 
    todayVisits, 
    uniqueVisitors, 
    activeNow, 
    countryStats, 
    recentActivities, 
    isLive,
    refreshStats 
  } = useVisitorCounter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRefreshing(true);
    await refreshStats();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Format large numbers with spaces
  const formatNumber = (num: number) => {
    return num.toLocaleString('fr-FR');
  };

  // 1. INLINE VARIANT (used in hero or sections)
  if (variant === 'inline' || variant === 'hero') {
    return (
      <>
        <div 
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 text-slate-200 text-xs shadow-md backdrop-blur-md cursor-pointer transition-all hover:scale-105 group ${className}`}
          title="Cliquez pour afficher les statistiques des visiteurs en direct"
        >
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold text-emerald-400 font-mono text-[11px]">{activeNow} en direct</span>
          </div>

          <span className="text-slate-600 text-[10px]">•</span>

          <div className="flex items-center gap-1 text-[11px] font-mono text-slate-300">
            <Users className="w-3 h-3 text-cyan-400" />
            <span className="font-bold text-white">{formatNumber(totalVisits)}</span>
            <span className="text-slate-400 hidden sm:inline">visites</span>
          </div>

          <ChevronRight className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-0.5" />
        </div>

        {/* Modal Detail */}
        {isModalOpen && renderModal()}
      </>
    );
  }

  // 2. FOOTER VARIANT
  if (variant === 'footer') {
    return (
      <>
        <div 
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center gap-3 p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 text-slate-300 text-xs shadow-lg cursor-pointer transition-all group ${className}`}
        >
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
              <Radio className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-sm font-mono">{formatNumber(totalVisits)}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 font-bold">
                  {activeNow} online
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Trafic mondial &amp; panafricain vérifié
              </p>
            </div>
          </div>

          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 ml-auto transition-transform group-hover:translate-x-0.5" />
        </div>

        {isModalOpen && renderModal()}
      </>
    );
  }

  // 3. FLOATING BADGE (Bottom left / subtle status indicator)
  return (
    <>
      <div 
        onClick={() => setIsModalOpen(true)}
        className={`fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[120] flex items-center gap-1.5 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-slate-950/90 border border-slate-800/90 hover:border-emerald-500/60 text-white shadow-2xl backdrop-blur-xl cursor-pointer transition-all hover:scale-105 group select-none ${className}`}
        title="Compteur de visiteurs en temps réel (Firestore)"
      >
        <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-500"></span>
        </span>

        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-mono">
          <span className="font-extrabold text-emerald-400">{activeNow}</span>
          <span className="text-slate-400 text-[10px] sm:text-[11px]">en direct</span>
        </div>

        <span className="text-slate-700 hidden xs:inline sm:inline">|</span>

        <div className="hidden xs:flex sm:flex items-center gap-1 text-[11px] sm:text-xs font-mono text-slate-300">
          <Users className="w-3 h-3 text-cyan-400" />
          <span className="font-bold text-white">{formatNumber(totalVisits)}</span>
        </div>

        <Activity className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 group-hover:text-emerald-400 transition-colors ml-0.5" />
      </div>

      {isModalOpen && renderModal()}
    </>
  );

  function renderModal() {
    return (
      <div 
        className="fixed inset-0 z-[220] flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in"
        onClick={() => setIsModalOpen(false)}
      >
        <div 
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl text-white space-y-6 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>Compteur de Visiteurs en Temps Réel</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                Statistiques d'Audience &amp; Trafic V&I Tech
              </h3>
              <p className="text-xs text-slate-400">
                Données synchronisées en direct avec Google Firestore &amp; CDN Cloudflare
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Actualiser les compteurs"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              </button>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 4-Stat Bento Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span>En direct</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                {activeNow}
              </div>
              <div className="text-[10px] text-emerald-300/80">Connectés actifs</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-cyan-400" />
                <span>Aujourd'hui</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">
                +{formatNumber(todayVisits)}
              </div>
              <div className="text-[10px] text-slate-400">Visites 24h</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-blue-400" />
                <span>Total Visites</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">
                {formatNumber(totalVisits)}
              </div>
              <div className="text-[10px] text-slate-400">Compteur certifié</div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-purple-400" />
                <span>Visiteurs Uniques</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">
                {formatNumber(uniqueVisitors)}
              </div>
              <div className="text-[10px] text-slate-400">IPs distinctes</div>
            </div>
          </div>

          {/* Regional Geographic Distribution */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Origine Géographique des Visites Panafricaines &amp; Monde</span>
              </h4>
              <span className="text-[11px] text-slate-500">Temps réel</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {countryStats.map((c) => (
                <div 
                  key={c.code}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base">{c.flag}</span>
                    <span className="font-semibold text-slate-200 truncate">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 font-mono">
                    <span className="text-slate-400">{formatNumber(c.visits)}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {c.activeNow} live
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Recent Activity Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Journal d'Activité Récente (Anonymisé)</span>
              </h4>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Flux en direct
              </span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {recentActivities.map((act) => (
                <div 
                  key={act.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/50 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span>{act.flag}</span>
                    <span className="font-medium text-slate-300">{act.location} :</span>
                    <span className="text-slate-400">{act.action}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0 font-mono">{act.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security & Verification note */}
          <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300/90 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-blue-400 shrink-0" />
            <p className="leading-relaxed">
              Compteur certifié avec protection anti-bot Cloudflare et stockage NoSQL persistant sur Google Firestore (Région Europe-West3 &amp; Edge Panafricain).
            </p>
          </div>

        </div>
      </div>
    );
  }
};
