import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  BarChart3, 
  Layers, 
  ShieldCheck, 
  Activity, 
  Zap, 
  Calendar,
  DollarSign,
  Maximize2,
  Sparkles
} from 'lucide-react';
import { ProjectMilestone } from '../types';

interface ProjectProgressChartsProps {
  milestones: ProjectMilestone[];
  overallProgress?: number;
  budgetTotal?: string;
  budgetSpent?: string;
}

export const ProjectProgressCharts: React.FC<ProjectProgressChartsProps> = ({
  milestones,
  overallProgress = 68,
  budgetTotal = '$45,000 USD',
  budgetSpent = '$28,500 USD'
}) => {
  const [chartType, setChartType] = useState<'milestones' | 'velocity' | 'budget'>('milestones');

  // Milestone Progress Bar Chart Data
  const milestoneChartData = milestones.map((m, idx) => ({
    name: `Jalon ${idx + 1}`,
    shortTitle: m.title.length > 22 ? m.title.substring(0, 20) + '...' : m.title,
    fullTitle: m.title,
    progress: m.progress,
    target: 100,
    status: m.status,
    dueDate: m.dueDate,
    deliverablesCount: m.deliverables.length,
    statusLabel: m.status === 'completed' ? 'Validé & Livré' : m.status === 'in_progress' ? 'En Cours' : 'Planifié'
  }));

  // Velocity / Burn-up Chart Data (Sprint Velocity Story Points)
  const velocityData = [
    { sprint: 'Sprint 1', pointsTarget: 40, pointsDone: 40, cumulative: 40, velocity: '100%' },
    { sprint: 'Sprint 2', pointsTarget: 45, pointsDone: 45, cumulative: 85, velocity: '100%' },
    { sprint: 'Sprint 3', pointsTarget: 50, pointsDone: 50, cumulative: 135, velocity: '100%' },
    { sprint: 'Sprint 4 (Actuel)', pointsTarget: 48, pointsDone: 34, cumulative: 169, velocity: '71%' },
    { sprint: 'Sprint 5', pointsTarget: 52, pointsDone: 0, cumulative: 169, velocity: '0%' },
    { sprint: 'Sprint 6 (Final)', pointsTarget: 45, pointsDone: 0, cumulative: 169, velocity: '0%' },
  ];

  // Budget & Resource allocation per milestone
  const budgetAllocationData = [
    { name: 'Jalon 1 : Cadrage & Architecture C4', budget: 6500, spent: 6500, color: '#06b6d4' },
    { name: 'Jalon 2 : Core Engine & Auth ISO20022', budget: 9000, spent: 9000, color: '#3b82f6' },
    { name: 'Jalon 3 : Passerelles Mobile Money', budget: 11000, spent: 8500, color: '#10b981' },
    { name: 'Jalon 4 : Portails & Dashboards', budget: 7500, spent: 4500, color: '#f59e0b' },
    { name: 'Jalon 5 : Pentest OWASP & PCI-DSS', budget: 6000, spent: 0, color: '#8b5cf6' },
    { name: 'Jalon 6 : Mise en Prod Cloud AWS/GCP', budget: 5000, spent: 0, color: '#ec4899' },
  ];

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const inProgressCount = milestones.filter(m => m.status === 'in_progress').length;
  const upcomingCount = milestones.filter(m => m.status === 'upcoming').length;

  const pieData = [
    { name: 'Validés (100%)', value: completedCount, color: '#10b981' },
    { name: 'En cours', value: inProgressCount, color: '#06b6d4' },
    { name: 'Planifiés', value: upcomingCount, color: '#475569' },
  ];

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>Tableaux de Progression &amp; Métriques Sprints</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono hidden sm:inline">
                Recharts Live
              </span>
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
            Visualisation temps réel de l'avancement des jalons, de la vélocité Agile des sprints et de la consommation budgétaire.
          </p>
        </div>

        {/* Chart View Switcher */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0 self-start lg:self-auto overflow-x-auto no-scrollbar">
          <button
            onClick={() => setChartType('milestones')}
            className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              chartType === 'milestones'
                ? 'bg-cyan-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Taux par Jalon (%)</span>
          </button>

          <button
            onClick={() => setChartType('velocity')}
            className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              chartType === 'velocity'
                ? 'bg-cyan-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Vélocité Story Points</span>
          </button>

          <button
            onClick={() => setChartType('budget')}
            className={`px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
              chartType === 'budget'
                ? 'bg-cyan-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>Budget &amp; Effort</span>
          </button>
        </div>
      </div>

      {/* Primary Chart Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-stretch">
        {/* Main Chart Column (3 cols on lg) */}
        <div className="lg:col-span-3 bg-slate-950/80 rounded-xl p-3.5 sm:p-5 border border-slate-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs sm:text-sm font-bold text-slate-200 flex items-center gap-2">
              {chartType === 'milestones' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Avancement Détaillé par Jalon Contractuel (0 à 100%)</span>
                </>
              )}
              {chartType === 'velocity' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  <span>Courbe de Vélocité Agile &amp; Cumul des Story Points</span>
                </>
              )}
              {chartType === 'budget' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Allocation Budgétaire ($ USD) &amp; Consommation Réelle</span>
                </>
              )}
            </h4>
            <span className="text-[10px] text-slate-400 font-mono">
              Sprint Actuel : 4 / 6
            </span>
          </div>

          {/* VIEW 1: Milestones Progress Bar Chart */}
          {chartType === 'milestones' && (
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={milestoneChartData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `${v}%`}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(30, 41, 59, 0.4)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-cyan-500/40 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 max-w-xs">
                            <p className="font-bold text-white">{data.name} : {data.fullTitle}</p>
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800">
                              <span className="text-slate-400">Progression :</span>
                              <span className="font-mono font-bold text-cyan-400">{data.progress}%</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Statut :</span>
                              <span className="font-semibold text-emerald-400">{data.statusLabel}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Échéance :</span>
                              <span className="font-mono text-slate-300">{data.dueDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-slate-400">Livrables :</span>
                              <span className="font-mono text-slate-300">{data.deliverablesCount} livrables</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar 
                    dataKey="progress" 
                    radius={[6, 6, 0, 0]}
                    animationDuration={1200}
                  >
                    {milestoneChartData.map((entry, index) => {
                      const color = entry.progress === 100 
                        ? '#10b981' 
                        : entry.progress > 0 
                        ? '#06b6d4' 
                        : '#334155';
                      return <Cell key={`cell-${index}`} fill={color} />;
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* VIEW 2: Velocity & Cumulative Burn-up Area Chart */}
          {chartType === 'velocity' && (
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={velocityData}
                  margin={{ top: 10, right: 15, left: -20, bottom: 25 }}
                >
                  <defs>
                    <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="sprint" 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis 
                    stroke="#64748b" 
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(v) => `${v} pts`}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-cyan-500/40 p-3 rounded-xl shadow-2xl text-xs space-y-1.5">
                            <p className="font-bold text-white">{label}</p>
                            <p className="text-cyan-400 font-mono">
                              Cumul Story Points : <strong>{payload[0]?.value} pts</strong>
                            </p>
                            <p className="text-slate-400 text-[11px]">
                              Points sprint : {payload[0]?.payload.pointsDone} / {payload[0]?.payload.pointsTarget} pts
                            </p>
                            <p className="text-emerald-400 text-[11px] font-mono">
                              Vélocité : {payload[0]?.payload.velocity}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="top" 
                    height={30} 
                    formatter={(val) => (
                      <span className="text-xs text-slate-300 font-medium">{val === 'cumulative' ? 'Story Points Livrés' : 'Objectif'}</span>
                    )}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="cumulative" 
                    stroke="#06b6d4" 
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorCumulative)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* VIEW 3: Budget Allocation Bar Chart */}
          {chartType === 'budget' && (
            <div className="w-full h-64 sm:h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={budgetAllocationData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                  <XAxis 
                    type="number"
                    stroke="#64748b" 
                    fontSize={10}
                    tickFormatter={(v) => `$${v / 1000}k`}
                    tick={{ fill: '#94a3b8' }}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    width={130}
                    stroke="#64748b" 
                    fontSize={10}
                    tickLine={false}
                    tickFormatter={(v) => v.split(':')[0]}
                    tick={{ fill: '#cbd5e1' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl text-xs space-y-1">
                            <p className="font-bold text-white">{item.name}</p>
                            <div className="flex justify-between gap-4 text-slate-300">
                              <span>Budget Alloué :</span>
                              <strong className="text-white font-mono">${item.budget.toLocaleString()} USD</strong>
                            </div>
                            <div className="flex justify-between gap-4 text-slate-300">
                              <span>Budget Consommé :</span>
                              <strong className="text-cyan-400 font-mono">${item.spent.toLocaleString()} USD</strong>
                            </div>
                            <div className="flex justify-between gap-4 text-emerald-400 text-[11px] pt-1 border-t border-slate-800">
                              <span>Reste à engager :</span>
                              <span className="font-mono font-bold">${(item.budget - item.spent).toLocaleString()} USD</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="spent" name="Consommé" fill="#06b6d4" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="budget" name="Budget Total" fill="#334155" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Quick Legend Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                <span>100% Validé &amp; Livré</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                <span>En Cours (Sprint Actif)</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-700" />
                <span>Planifié</span>
              </span>
            </div>
            <span className="text-slate-300 font-mono text-[10px]">
              Taux de conformité : 100%
            </span>
          </div>
        </div>

        {/* Right Metric Summary Column (1 col on lg) */}
        <div className="space-y-3 flex flex-col justify-between">
          {/* Circular Donut Summary */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-center space-y-2">
            <span className="text-[10px] uppercase font-semibold text-slate-400 block">Répartition des Jalons</span>
            <div className="w-full h-28 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={30}
                    outerRadius={45}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-base font-black text-white font-mono">{overallProgress}%</span>
                <span className="text-[8px] text-slate-400 uppercase">Global</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-1 text-[10px] pt-1 border-t border-slate-900">
              <div>
                <span className="font-bold text-emerald-400 block">{completedCount}</span>
                <span className="text-slate-500 text-[9px]">Validés</span>
              </div>
              <div>
                <span className="font-bold text-cyan-400 block">{inProgressCount}</span>
                <span className="text-slate-500 text-[9px]">En cours</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block">{upcomingCount}</span>
                <span className="text-slate-500 text-[9px]">À venir</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Highlight Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Budget Consommé</span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">63.3%</span>
            </div>
            <p className="text-sm font-bold text-white font-mono">{budgetSpent}</p>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '63.3%' }} />
            </div>
            <span className="text-[10px] text-slate-400 block">Total contractuel : {budgetTotal}</span>
          </div>

          {/* Staging environment link card */}
          <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-300 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Sprint 4 En Cours de Test</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight">
              L'intégration des passerelles Wave &amp; Orange Money est active sur l'environnement de recette.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
