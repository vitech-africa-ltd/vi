import React, { useState, useEffect, useMemo } from 'react';
import { 
  Radio, 
  Users, 
  TrendingUp, 
  Activity, 
  Zap, 
  Globe, 
  Smartphone, 
  Laptop, 
  Tablet, 
  Sparkles, 
  Play, 
  Pause, 
  RefreshCw, 
  ArrowUpRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  INITIAL_GEO_VISITORS, 
  LIVE_VISITOR_ACTIVITY_FEED,
  LiveVisitorGeoNode 
} from '../../../data/adminAnalyticsData';
import confetti from 'canvas-confetti';

interface LiveVisitorCounterProProps {
  initialCount?: number;
}

export const LiveVisitorCounterPro: React.FC<LiveVisitorCounterProProps> = ({
  initialCount = 1472
}) => {
  const [visitorCount, setVisitorCount] = useState<number>(initialCount);
  const [prevCount, setPrevCount] = useState<number>(initialCount);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);
  const [peakToday, setPeakToday] = useState<number>(1894);
  const [total24h, setTotal24h] = useState<number>(24810);
  const [geoNodes, setGeoNodes] = useState<LiveVisitorGeoNode[]>(INITIAL_GEO_VISITORS);
  const [activityFeed, setActivityFeed] = useState(LIVE_VISITOR_ACTIVITY_FEED);
  const [pulseKey, setPulseKey] = useState<number>(0);
  const [lastDelta, setLastDelta] = useState<number>(+3);
  const [speedMultiplier, setSpeedMultiplier] = useState<'1x' | '2x' | 'turbo'>('1x');

  // Real-time dynamic visitor fluctuations
  useEffect(() => {
    if (!isLiveActive) return;

    const intervalTime = speedMultiplier === 'turbo' ? 1200 : speedMultiplier === '2x' ? 2200 : 3800;

    const timer = setInterval(() => {
      // Realistic random fluctuation (-4 to +7)
      const delta = Math.floor(Math.random() * 11) - 4;
      setLastDelta(delta);
      
      setVisitorCount(prev => {
        setPrevCount(prev);
        const next = Math.max(850, prev + delta);
        if (next > peakToday) setPeakToday(next);
        return next;
      });

      setTotal24h(prev => prev + Math.max(1, delta > 0 ? delta : 1));
      setPulseKey(prev => prev + 1);

      // Randomly update a geo node
      setGeoNodes(prev => {
        const idx = Math.floor(Math.random() * prev.length);
        const updated = [...prev];
        const current = updated[idx];
        const nodeDelta = Math.floor(Math.random() * 7) - 3;
        const newUsers = Math.max(10, current.activeUsers + nodeDelta);
        updated[idx] = {
          ...current,
          activeUsers: newUsers,
          trend: nodeDelta >= 0 ? 'up' : 'down'
        };
        return updated;
      });

      // Periodically inject fresh real-time events
      if (Math.random() > 0.4) {
        const events = [
          { text: 'Nouveau développeur connecté depuis Kigali (MTN MoMo)', flag: '🇷🇼', type: 'purchase' },
          { text: 'Consultation API VitechPay v3.2 depuis Nairobi', flag: '🇰🇪', type: 'browse' },
          { text: 'Scan de sécurité ZIP réussi (100% OWASP) depuis Abidjan', flag: '🇨🇮', type: 'scan' },
          { text: 'Téléchargement code source AfriRide Flutter depuis Douala', flag: '🇨🇲', type: 'download' },
          { text: 'Connexion développeur premium depuis Paris', flag: '🇫🇷', type: 'browse' },
          { text: 'Nouveau panier validé Airtel Money Rwanda (65,000 RWF)', flag: '🇷🇼', type: 'purchase' },
          { text: 'Inspection AST Microservice FastAPI depuis Kinshasa', flag: '🇨🇩', type: 'scan' }
        ];
        const randomEvt = events[Math.floor(Math.random() * events.length)];
        setActivityFeed(prev => [
          {
            id: `act-${Date.now()}`,
            text: randomEvt.text,
            time: 'À l\'instant',
            type: randomEvt.type,
            flag: randomEvt.flag
          },
          ...prev.slice(0, 5)
        ]);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isLiveActive, speedMultiplier, peakToday]);

  // Traffic Spike Simulator
  const handleSimulateSpike = () => {
    const spike = Math.floor(Math.random() * 45) + 35;
    setVisitorCount(prev => prev + spike);
    setLastDelta(+spike);
    setPulseKey(prev => prev + 1);
    setActivityFeed(prev => [
      {
        id: `act-${Date.now()}`,
        text: `⚡ Pic de trafic détecté : +${spike} développeurs simultanés (Campagne Newsletter & LinkedIn)`,
        time: 'À l\'instant',
        type: 'purchase',
        flag: '⚡'
      },
      ...prev.slice(0, 5)
    ]);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.3 } });
  };

  // Format numbers to string with digit array for 3D odometer effect
  const countDigits = useMemo(() => {
    return visitorCount.toLocaleString().split('');
  }, [visitorCount]);

  return (
    <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-slate-950 border border-cyan-500/30 shadow-2xl relative overflow-hidden space-y-6">
      
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Bar */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        
        {/* Live Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
                <span>Compteur de Visiteurs en Temps Réel</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  PRO MAX LIVE
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Streaming télémétrique actif • Kigali Edge Cloud &amp; WebSockets 2026</span>
            </p>
          </div>
        </div>

        {/* Live Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Speed selector */}
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setSpeedMultiplier('1x')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                speedMultiplier === '1x' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setSpeedMultiplier('2x')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                speedMultiplier === '2x' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              2x
            </button>
            <button
              onClick={() => setSpeedMultiplier('turbo')}
              className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                speedMultiplier === 'turbo' ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950' : 'text-slate-400 hover:text-amber-400'
              }`}
            >
              <Zap className="w-3 h-3" />
              <span>Turbo</span>
            </button>
          </div>

          {/* Toggle Pause / Resume */}
          <button
            onClick={() => setIsLiveActive(!isLiveActive)}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
              isLiveActive 
                ? 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-200' 
                : 'bg-emerald-500/20 hover:bg-emerald-500/30 border-emerald-500 text-emerald-300'
            }`}
            title={isLiveActive ? 'Mettre en pause le flux' : 'Reprendre le direct'}
          >
            {isLiveActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden sm:inline">{isLiveActive ? 'Pause' : 'Reprendre'}</span>
          </button>

          {/* Simulate Traffic Spike */}
          <button
            onClick={handleSimulateSpike}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-emerald-500 to-teal-400 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-500/20 active:scale-95 cursor-pointer transition-all"
          >
            <Flame className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
            <span>Simuler Pic (+40)</span>
          </button>
        </div>
      </div>

      {/* Hero Display: Pro Max Odometer & Key Live Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Main Odometer Counter Card */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950/90 border border-slate-800/90 relative overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                Développeurs Actifs en Direct
              </span>
            </div>
            
            {/* Live Delta Badge */}
            <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold transition-all ${
              lastDelta >= 0 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' 
                : 'bg-rose-950 text-rose-400 border border-rose-500/30'
            }`}>
              <TrendingUp className={`w-3 h-3 ${lastDelta < 0 ? 'rotate-180' : ''}`} />
              <span>{lastDelta >= 0 ? `+${lastDelta}` : lastDelta} / 3s</span>
            </div>
          </div>

          {/* Animated 3D Pro Digits Display */}
          <div className="flex items-center gap-1 sm:gap-2 py-2">
            {countDigits.map((char, index) => {
              if (char === ' ' || char === ',') {
                return (
                  <span key={index} className="text-3xl sm:text-5xl font-black text-slate-600 px-1">
                    ,
                  </span>
                );
              }
              return (
                <div 
                  key={`${index}-${char}-${pulseKey}`}
                  className="relative group w-12 sm:w-16 h-16 sm:h-20 rounded-xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700/80 flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.1),0_8px_16px_rgba(0,0,0,0.5)] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                >
                  {/* Glass highlight */}
                  <div className="absolute inset-x-0 top-0 h-1/2 bg-white/5 pointer-events-none border-b border-slate-800" />
                  
                  {/* Digital Character */}
                  <span className="text-3xl sm:text-5xl font-black font-mono tracking-tight bg-gradient-to-b from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(6,182,212,0.5)]">
                    {char}
                  </span>

                  {/* Corner metallic rivets */}
                  <div className="absolute top-1 left-1 w-1 h-1 rounded-full bg-slate-600/60" />
                  <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-slate-600/60" />
                  <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-slate-600/60" />
                  <div className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-slate-600/60" />
                </div>
              );
            })}

            <div className="ml-2 pl-2 border-l border-slate-800 flex flex-col justify-center">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-wide">Live</span>
              <span className="text-[10px] text-slate-400 font-mono">Sessions</span>
            </div>
          </div>

          {/* Real-time mini visual pulse equalizer */}
          <div className="flex items-center gap-1 pt-1">
            {[40, 65, 85, 55, 95, 70, 80, 60, 90, 75, 88, 62, 98, 72, 84, 58, 92, 68].map((h, i) => (
              <div 
                key={i} 
                className="flex-1 bg-cyan-500/30 hover:bg-cyan-400 rounded-full transition-all duration-300"
                style={{ 
                  height: `${Math.max(6, (h * (0.8 + (Math.sin(pulseKey + i) * 0.2))))}px`,
                  backgroundColor: i % 2 === 0 ? '#06b6d4' : '#10b981'
                }}
              />
            ))}
          </div>
        </div>

        {/* 3 Secondary KPI Cards */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 hover:border-cyan-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">Pic du Jour</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white font-mono block">
              {peakToday.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              <span>Record absolu 2026</span>
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 hover:border-emerald-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">Total 24h</span>
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono block">
              {total24h.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Visites uniques filtrées
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 hover:border-purple-500/40 transition-colors">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span className="font-mono">Rétention &amp; Devs</span>
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-purple-300 font-mono block">
              84.6%
            </span>
            <span className="text-[10px] text-cyan-400 font-mono">
              +18% de fidélité
            </span>
          </div>

        </div>

      </div>

      {/* Bottom Grid: Geographic Breakdown & Live Activity Stream & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
        
        {/* Country & City Traffic Nodes */}
        <div className="lg:col-span-7 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Répartition Géographique &amp; Latence Edge
              </h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">8 Nœuds Actifs</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {geoNodes.map(node => (
              <div 
                key={node.countryCode}
                className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-cyan-500/30 transition-all flex flex-col justify-between space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{node.flag}</span>
                    <div>
                      <span className="font-bold text-white block text-xs">{node.city}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{node.countryName}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-cyan-300 text-xs">{node.activeUsers} devs</span>
                    <span className="text-[10px] text-emerald-400 font-mono block">{node.avgLatencyMs}ms ping</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${node.percentage * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Activity Feed + Devices */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Live Activity Stream */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Flux d'Activité en Direct
                </h4>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div className="space-y-2">
              {activityFeed.slice(0, 4).map(act => (
                <div 
                  key={act.id} 
                  className="p-2 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-1 duration-300"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <span className="text-sm shrink-0">{act.flag}</span>
                    <span className="text-slate-300 text-[11px] truncate">{act.text}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono shrink-0">{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Breakdown */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-around text-center text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px]">
                <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                <span>Mobile MoMo</span>
              </div>
              <span className="font-black text-white font-mono">64%</span>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px]">
                <Laptop className="w-3.5 h-3.5 text-emerald-400" />
                <span>Desktop IDE</span>
              </div>
              <span className="font-black text-white font-mono">32%</span>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="space-y-0.5">
              <div className="flex items-center justify-center gap-1 text-slate-400 text-[11px]">
                <Tablet className="w-3.5 h-3.5 text-purple-400" />
                <span>API &amp; Tablettes</span>
              </div>
              <span className="font-black text-white font-mono">4%</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
