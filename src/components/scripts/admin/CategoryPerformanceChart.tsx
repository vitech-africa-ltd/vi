import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  Layers, 
  TrendingUp, 
  DollarSign, 
  Star, 
  ShieldCheck, 
  Sparkles,
  ArrowUpRight,
  Code2
} from 'lucide-react';
import { 
  CATEGORY_PERFORMANCE_METRICS, 
  CategoryPerformanceData 
} from '../../../data/adminAnalyticsData';

export const CategoryPerformanceChart: React.FC = () => {
  const [metricMode, setMetricMode] = useState<'revenue' | 'downloads' | 'conversion'>('revenue');
  const categories = CATEGORY_PERFORMANCE_METRICS;

  // Total summary calculations
  const totalRevenue = categories.reduce((sum, c) => sum + c.revenueUSD, 0);
  const totalDownloads = categories.reduce((sum, c) => sum + c.totalDownloads, 0);
  const avgConversion = (categories.reduce((sum, c) => sum + c.conversionRate, 0) / categories.length).toFixed(1);

  // Custom Bar Tooltip
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload as CategoryPerformanceData;
      return (
        <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl space-y-2 text-xs backdrop-blur-md">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-bold text-white text-xs">{data.categoryName}</span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between gap-4 text-emerald-400 font-bold">
              <span>Chiffre d'Affaires :</span>
              <span>${data.revenueUSD.toLocaleString()} USD ({data.revenueRWF.toLocaleString()} RWF)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-cyan-400">
              <span>Téléchargements Totaux :</span>
              <span>{data.totalDownloads.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-amber-400">
              <span>Taux de Conversion :</span>
              <span>{data.conversionRate}%</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-purple-400">
              <span>Conformité OWASP Moyenne :</span>
              <span>{data.owaspComplianceAvg}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
      
      {/* Header & Toggle Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">
              Performance par Catégorie de Script (Top Performers)
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              Recharts Bar
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Analyse comparative de rentabilité, de demande de code source et de rétention développeur.
          </p>
        </div>

        {/* View mode selector */}
        <div className="flex items-center rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setMetricMode('revenue')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              metricMode === 'revenue' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Revenus ($ USD)
          </button>
          <button
            onClick={() => setMetricMode('downloads')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              metricMode === 'downloads' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Téléchargements
          </button>
          <button
            onClick={() => setMetricMode('conversion')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              metricMode === 'conversion' ? 'bg-purple-500 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Taux Conversion (%)
          </button>
        </div>
      </div>

      {/* Main Chart + Mini Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Left: Recharts Bar Chart */}
        <div className="lg:col-span-8 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={categories} 
              layout="vertical"
              margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
              <XAxis 
                type="number" 
                stroke="#64748b" 
                fontSize={11} 
                tickFormatter={(v) => metricMode === 'revenue' ? `$${v / 1000}k` : metricMode === 'conversion' ? `${v}%` : `${v}`}
              />
              <YAxis 
                type="category" 
                dataKey="categoryName" 
                stroke="#cbd5e1" 
                fontSize={11} 
                width={120}
                tickLine={false}
              />
              <Tooltip content={<CustomBarTooltip />} />
              <Bar 
                dataKey={metricMode === 'revenue' ? 'revenueUSD' : metricMode === 'downloads' ? 'totalDownloads' : 'conversionRate'}
                radius={[0, 8, 8, 0]}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right: Ranked Insights & Top Leaderboard */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1 border-b border-slate-800">
            <span>Catégorie</span>
            <span>Part du CA</span>
          </div>

          <div className="space-y-2">
            {categories.map((cat, idx) => {
              const sharePercent = Math.round((cat.revenueUSD / totalRevenue) * 100);
              return (
                <div 
                  key={cat.categoryId}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-500 w-4">#{idx + 1}</span>
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    <div>
                      <span className="font-bold text-white block text-[11px] truncate">{cat.categoryName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {cat.totalDownloads} downloads • ★ {cat.averageRating}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-bold text-emerald-400 font-mono text-[11px] block">
                      ${cat.revenueUSD.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">{sharePercent}% CA</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Benchmark Strip */}
      <div className="pt-2 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>Top Catégorie : <strong>PHP &amp; Laravel</strong> (Leader en volume MoMo Rwanda)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Plus Forte Croissance : <strong>Full-Stack SaaS</strong> (+34% MoM)</span>
        </div>
        <div className="flex items-center gap-2 text-slate-300">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <span>Conformité Sécurité : <strong>99.1% OWASP</strong> sur l'ensemble du catalogue</span>
        </div>
      </div>

    </div>
  );
};
