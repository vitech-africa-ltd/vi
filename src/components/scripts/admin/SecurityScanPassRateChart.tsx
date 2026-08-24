import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Lock, 
  FileCheck,
  Server,
  Zap
} from 'lucide-react';
import { 
  GENERATE_30_DAYS_SECURITY_SCANS, 
  DailySecurityScanPoint 
} from '../../../data/adminAnalyticsData';

export const SecurityScanPassRateChart: React.FC = () => {
  const [data] = useState<DailySecurityScanPoint[]>(() => GENERATE_30_DAYS_SECURITY_SCANS());
  const [viewMode, setViewMode] = useState<'passRate' | 'scansVolume' | 'vulnerabilities'>('passRate');

  // Aggregations
  const totalScans = useMemo(() => data.reduce((acc, p) => acc + p.totalScans, 0), [data]);
  const totalPassed = useMemo(() => data.reduce((acc, p) => acc + p.passedScans, 0), [data]);
  const totalFlagged = useMemo(() => data.reduce((acc, p) => acc + p.flaggedScans, 0), [data]);
  const totalVulnsPrevented = useMemo(() => data.reduce((acc, p) => acc + p.vulnerabilitiesPrevented, 0), [data]);
  const avgPassRate = ((totalPassed / totalScans) * 100).toFixed(1);
  const avgScanTime = Math.round(data.reduce((acc, p) => acc + p.avgScanDurationMs, 0) / data.length);

  // Custom tooltip
  const CustomScanTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as DailySecurityScanPoint;
      return (
        <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-emerald-500/40 shadow-2xl space-y-2 text-xs backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-4">
            <span className="font-bold text-white font-mono">{point.dayLabel} ({point.date})</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              {point.passRatePercentage}% Succès
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between gap-4 text-emerald-400 font-bold">
              <span>Scans Conformes (OWASP A+) :</span>
              <span>{point.passedScans} / {point.totalScans}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-rose-400">
              <span>Alertes / Risques Bloqués :</span>
              <span>{point.vulnerabilitiesPrevented} vulnérabilités</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-cyan-400">
              <span>Temps Moyen d'Analyse AST :</span>
              <span>{point.avgScanDurationMs} ms</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">
              Taux de Réussite des Scans de Sécurité Serveur (30 Derniers Jours)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              OWASP Guard 100%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit statique AST continu des scripts uploadés et bundles distribués aux développeurs.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('passRate')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'passRate' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Taux de Réussite (%)
          </button>
          <button
            onClick={() => setViewMode('scansVolume')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'scansVolume' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Volume de Scans
          </button>
          <button
            onClick={() => setViewMode('vulnerabilities')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              viewMode === 'vulnerabilities' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Failles Bloquées
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-slate-400 block font-mono text-[11px]">Taux Global de Succès</span>
          <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">{avgPassRate}%</span>
          <span className="text-[10px] text-emerald-400/80 font-mono">Conformité Grade A+</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-slate-400 block font-mono text-[11px]">Total Scans Effectués (30j)</span>
          <span className="text-xl font-black text-white font-mono mt-0.5 block">{totalScans.toLocaleString()}</span>
          <span className="text-[10px] text-cyan-400 font-mono">{totalPassed} validés sans erreur</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-slate-400 block font-mono text-[11px]">Vulnérabilités Neutralisées</span>
          <span className="text-xl font-black text-rose-400 font-mono mt-0.5 block">{totalVulnsPrevented}</span>
          <span className="text-[10px] text-slate-400 font-mono">Injections SQL &amp; Secrets bloqués</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-slate-400 block font-mono text-[11px]">Latence Moyenne d'Analyse</span>
          <span className="text-xl font-black text-cyan-400 font-mono mt-0.5 block">{avgScanTime} ms</span>
          <span className="text-[10px] text-cyan-400/80 font-mono">Inspection AST en mémoire</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'vulnerabilities' ? (
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="dayLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip content={<CustomScanTooltip />} />
              <Bar dataKey="vulnerabilitiesPrevented" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Failles Bloquées" />
            </BarChart>
          ) : (
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPassRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="dayLabel" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis 
                stroke="#64748b" 
                fontSize={11} 
                domain={viewMode === 'passRate' ? [90, 100] : [0, 'auto']}
                tickLine={false}
                tickFormatter={(v) => viewMode === 'passRate' ? `${v}%` : `${v}`}
              />
              <Tooltip content={<CustomScanTooltip />} />
              
              {viewMode === 'passRate' && (
                <>
                  <ReferenceLine 
                    y={95} 
                    stroke="#eab308" 
                    strokeDasharray="3 3" 
                    label={{ value: 'Seuil SLA 95%', fill: '#eab308', fontSize: 10, position: 'right' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="passRatePercentage" 
                    name="Taux de Réussite (%)"
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#colorPassRate)" 
                  />
                </>
              )}

              {viewMode === 'scansVolume' && (
                <Area 
                  type="monotone" 
                  dataKey="totalScans" 
                  name="Volume de Scans Journaliers"
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorScans)" 
                />
              )}
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Security Rule Breakdown Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 text-[11px]">SQL Injection Scanner : <strong>0 faux-positifs</strong></span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 text-[11px]">API Key Leak Detector : <strong>100% Détection</strong></span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 text-[11px]">CSRF &amp; Webhook Guard : <strong>Conforme</strong></span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-300 text-[11px]">Watermark Signature : <strong>SHA-256 Validé</strong></span>
        </div>
      </div>

    </div>
  );
};
