import React, { useState, useMemo } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend,
  ReferenceLine
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  Calendar, 
  Filter, 
  DollarSign, 
  Users, 
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { 
  GENERATE_30_DAYS_DOWNLOADS, 
  DailyDownloadPoint 
} from '../../../data/adminAnalyticsData';

export const DailyDownloadTrendsChart: React.FC = () => {
  const [data] = useState<DailyDownloadPoint[]>(() => GENERATE_30_DAYS_DOWNLOADS());
  const [filterMode, setFilterMode] = useState<'all' | 'premium' | 'free' | 'revenue'>('all');
  const [timeRange, setTimeRange] = useState<'30d' | '14d' | '7d'>('30d');

  // Filtered slice of data
  const filteredData = useMemo(() => {
    if (timeRange === '7d') return data.slice(data.length - 7);
    if (timeRange === '14d') return data.slice(data.length - 14);
    return data;
  }, [data, timeRange]);

  // Aggregate stats
  const totalDownloads = useMemo(() => filteredData.reduce((acc, p) => acc + p.totalDownloads, 0), [filteredData]);
  const totalPremium = useMemo(() => filteredData.reduce((acc, p) => acc + p.premiumDownloads, 0), [filteredData]);
  const totalFree = useMemo(() => filteredData.reduce((acc, p) => acc + p.freeDownloads, 0), [filteredData]);
  const totalRevenueUSD = useMemo(() => filteredData.reduce((acc, p) => acc + p.revenueUSD, 0), [filteredData]);
  const totalRevenueRWF = useMemo(() => filteredData.reduce((acc, p) => acc + p.revenueRWF, 0), [filteredData]);
  const avgDaily = Math.round(totalDownloads / filteredData.length);
  const peakDay = useMemo(() => {
    return filteredData.reduce((max, p) => p.totalDownloads > max.totalDownloads ? p : max, filteredData[0]);
  }, [filteredData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as DailyDownloadPoint;
      return (
        <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl space-y-2 text-xs backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-4">
            <span className="font-bold text-white font-mono">{point.dayLabel} ({point.date})</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              {point.uniqueDevs} devs
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between gap-4 text-cyan-400">
              <span>Total Téléchargements :</span>
              <span className="font-bold">{point.totalDownloads}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-emerald-400">
              <span>Scripts Payants (MoMo/Card) :</span>
              <span className="font-bold">{point.premiumDownloads}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-slate-400">
              <span>Scripts Open Source :</span>
              <span>{point.freeDownloads}</span>
            </div>
            <div className="pt-1 border-t border-slate-800 flex items-center justify-between gap-4 text-amber-400 font-bold">
              <span>Revenu Quotidien :</span>
              <span>${point.revenueUSD} USD ({point.revenueRWF.toLocaleString()} RWF)</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">
              Tendances Quotidiennes des Téléchargements (30 Derniers Jours)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              Recharts Area
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Suivi journalier du volume de téléchargements de bundles de code, licences et revenus générés.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                timeRange === '7d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              7J
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                timeRange === '14d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              14J
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-2.5 py-1 rounded-lg font-mono transition-all cursor-pointer ${
                timeRange === '30d' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              30J
            </button>
          </div>

          {/* Metric View Modes */}
          <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterMode === 'all' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => setFilterMode('premium')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterMode === 'premium' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Payants (MoMo)
            </button>
            <button
              onClick={() => setFilterMode('revenue')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                filterMode === 'revenue' ? 'bg-slate-800 text-amber-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Revenus ($)
            </button>
          </div>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-slate-400 block font-mono text-[11px]">Total Téléchargements ({timeRange})</span>
          <span className="text-xl font-black text-white font-mono mt-0.5 block">{totalDownloads.toLocaleString()}</span>
          <span className="text-[10px] text-cyan-400 font-mono">Moyenne : {avgDaily}/jour</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-slate-400 block font-mono text-[11px]">Revenu Total ({timeRange})</span>
          <span className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">${totalRevenueUSD.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 font-mono">≈ {totalRevenueRWF.toLocaleString()} RWF</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-slate-400 block font-mono text-[11px]">Mix Payant vs Gratuit</span>
          <span className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
            {Math.round((totalPremium / totalDownloads) * 100)}% Payant
          </span>
          <span className="text-[10px] text-slate-400 font-mono">{totalPremium} payants • {totalFree} libres</span>
        </div>

        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-slate-400 block font-mono text-[11px]">Pic Journalier</span>
          <span className="text-xl font-black text-purple-400 font-mono mt-0.5 block">
            {peakDay.totalDownloads} docs
          </span>
          <span className="text-[10px] text-purple-400/80 font-mono">{peakDay.dayLabel}</span>
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorPremium" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis 
              dataKey="dayLabel" 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={11} 
              tickLine={false}
              tickFormatter={(val) => filterMode === 'revenue' ? `$${val}` : `${val}`}
            />
            <Tooltip content={<CustomTooltip />} />
            
            <ReferenceLine 
              y={filterMode === 'revenue' ? Math.round(totalRevenueUSD / filteredData.length) : avgDaily} 
              stroke="#64748b" 
              strokeDasharray="4 4" 
              label={{ value: 'Moyenne', fill: '#94a3b8', fontSize: 10, position: 'right' }} 
            />

            {filterMode === 'all' && (
              <>
                <Area 
                  type="monotone" 
                  dataKey="totalDownloads" 
                  name="Total Téléchargements"
                  stroke="#06b6d4" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorTotal)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="premiumDownloads" 
                  name="Payants (MoMo)"
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#colorPremium)" 
                />
              </>
            )}

            {filterMode === 'premium' && (
              <Area 
                type="monotone" 
                dataKey="premiumDownloads" 
                name="Téléchargements Payants"
                stroke="#10b981" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorPremium)" 
              />
            )}

            {filterMode === 'revenue' && (
              <Area 
                type="monotone" 
                dataKey="revenueUSD" 
                name="Revenu ($ USD)"
                stroke="#f59e0b" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
