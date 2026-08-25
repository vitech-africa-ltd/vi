import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  AreaChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import {
  Receipt,
  TrendingUp,
  DollarSign,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  BarChart3,
  Percent,
  Layers,
  Sparkles,
  Coins,
  Calculator
} from 'lucide-react';
import {
  GENERATE_12_MONTHS_INVOICING_DATA,
  MonthlyInvoicingAnalyticsPoint
} from '../../../data/adminAnalyticsData';
import { useCurrency, CurrencyCode } from '../../../context/CurrencyContext';

interface MonthlyInvoicingRevenueChartProps {
  className?: string;
  defaultCurrency?: CurrencyCode;
  compact?: boolean;
}

export const MonthlyInvoicingRevenueChart: React.FC<MonthlyInvoicingRevenueChartProps> = ({
  className = '',
  defaultCurrency,
  compact = false
}) => {
  const {
    currency: globalCurrency,
    setCurrency: setGlobalCurrency,
    currencyOption,
    currenciesList,
    convertFromEUR,
    formatRawAmount,
    openConverterModal
  } = useCurrency();

  const [data] = useState<MonthlyInvoicingAnalyticsPoint[]>(() => GENERATE_12_MONTHS_INVOICING_DATA());
  const [timeRange, setTimeRange] = useState<'12m' | '6m' | '2026'>('12m');
  const [chartView, setChartView] = useState<'composed' | 'area' | 'invoices'>('composed');

  // Filtered dataset converted using CurrencyContext
  const filteredData = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    let slice: MonthlyInvoicingAnalyticsPoint[] = [];
    if (timeRange === '6m') {
      slice = safeData.slice(Math.max(0, safeData.length - 6));
    } else if (timeRange === '2026') {
      slice = safeData.filter(d => d && d.monthKey && d.monthKey.startsWith('2026'));
    } else {
      slice = safeData;
    }

    return slice.map(item => ({
      ...item,
      invoicedRevenueConverted: convertFromEUR(item.invoicedRevenueEUR || 0),
      collectedRevenueConverted: convertFromEUR(item.collectedRevenueEUR || 0),
      pendingRevenueConverted: convertFromEUR(item.pendingRevenueEUR || 0),
      averageInvoiceValueConverted: convertFromEUR(item.averageInvoiceValueEUR || 0)
    }));
  }, [data, timeRange, globalCurrency, convertFromEUR]);

  // Aggregated KPIs
  const totalInvoiced = useMemo(() => filteredData.reduce((acc, d) => acc + d.invoicedRevenueConverted, 0), [filteredData]);
  const totalCollected = useMemo(() => filteredData.reduce((acc, d) => acc + d.collectedRevenueConverted, 0), [filteredData]);
  const totalPending = useMemo(() => filteredData.reduce((acc, d) => acc + d.pendingRevenueConverted, 0), [filteredData]);
  const totalInvoicesCount = useMemo(() => filteredData.reduce((acc, d) => acc + d.invoicesCount, 0), [filteredData]);
  const totalPaidInvoices = useMemo(() => filteredData.reduce((acc, d) => acc + d.paidInvoicesCount, 0), [filteredData]);
  const avgMonthlyRevenue = Math.round(totalInvoiced / (filteredData.length || 1));
  const avgInvoiceValue = Math.round(totalInvoiced / (totalInvoicesCount || 1));
  const overallCollectionRate = totalInvoiced > 0 ? ((totalCollected / totalInvoiced) * 100).toFixed(1) : '100';

  // Format money helper using global currency context
  const formatMoney = (val: number) => {
    return formatRawAmount(val, globalCurrency, { compact: false });
  };

  // Custom Recharts Tooltip
  const CustomInvoicingTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0]?.payload;
      if (!point) return null;

      return (
        <div className="p-4 rounded-2xl bg-slate-950/95 border border-amber-500/40 shadow-2xl space-y-2.5 text-xs backdrop-blur-md min-w-[240px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white font-mono flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              {point.fullMonthLabel}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-500/30">
              {point.invoicesCount} factures
            </span>
          </div>

          <div className="space-y-1.5 font-mono text-[11px]">
            <div className="flex items-center justify-between text-slate-200">
              <span className="text-slate-400">Total Facturé :</span>
              <span className="font-bold text-white">
                {formatRawAmount(point.invoicedRevenueConverted, globalCurrency)}
              </span>
            </div>

            <div className="flex items-center justify-between text-emerald-400">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Encaissé / Réglé :
              </span>
              <span className="font-bold">
                {formatRawAmount(point.collectedRevenueConverted, globalCurrency)}
              </span>
            </div>

            {point.pendingRevenueConverted > 0 && (
              <div className="flex items-center justify-between text-amber-400">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  En attente :
                </span>
                <span className="font-bold">
                  {formatRawAmount(point.pendingRevenueConverted, globalCurrency)}
                </span>
              </div>
            )}

            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-cyan-300">
              <span>Taux d'encaissement :</span>
              <span className="font-bold">{point.collectionRate}%</span>
            </div>

            <div className="flex items-center justify-between text-slate-400 text-[10px]">
              <span>Factures payées / en cours :</span>
              <span className="text-white">{point.paidInvoicesCount} payées · {point.pendingInvoicesCount} attente</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div id="monthly-invoicing-revenue-widget" className={`p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6 ${className}`}>
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <span>Chiffre d'Affaires &amp; Facturation Émise</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                  Live Currency Sync
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Suivi mensuel du chiffre d'affaires total facturé et montants encaissés convertis en temps réel ({currencyOption.name}).
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbars */}
        <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto">
          {/* Chart View Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setChartView('composed')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                chartView === 'composed'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>C.A. &amp; Factures</span>
            </button>
            <button
              onClick={() => setChartView('area')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                chartView === 'area'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Courbe C.A.</span>
            </button>
            <button
              onClick={() => setChartView('invoices')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                chartView === 'invoices'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Volume Factures</span>
            </button>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTimeRange('12m')}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-mono font-medium cursor-pointer ${
                timeRange === '12m' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              12 Mois
            </button>
            <button
              onClick={() => setTimeRange('6m')}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-mono font-medium cursor-pointer ${
                timeRange === '6m' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              6 Mois
            </button>
            <button
              onClick={() => setTimeRange('2026')}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-mono font-medium cursor-pointer ${
                timeRange === '2026' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2026
            </button>
          </div>

          {/* Quick Currency Selector Pills */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['EUR', 'USD', 'XOF', 'XAF', 'RWF'] as const).map(curr => (
              <button
                key={curr}
                onClick={() => setGlobalCurrency(curr)}
                className={`px-2 py-1.5 rounded-lg transition-all font-mono text-[11px] font-bold cursor-pointer flex items-center gap-1 ${
                  globalCurrency === curr ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
                title={`Convertir en ${curr}`}
              >
                <span>{curr}</span>
              </button>
            ))}
            <button
              onClick={() => openConverterModal()}
              className="px-2 py-1.5 text-slate-400 hover:text-amber-300 transition-colors"
              title="Calculateur de change complet"
            >
              <Calculator className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Metric 1: Total Invoiced */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>C.A. Total Facturé</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-mono text-lg sm:text-xl font-bold text-white">
            {formatMoney(totalInvoiced)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
            <TrendingUp className="w-3 h-3" />
            <span>+22.4% vs période précédente</span>
          </div>
        </div>

        {/* Metric 2: Total Collected */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Montant Encaissé (Reçu)</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-mono text-lg sm:text-xl font-bold text-emerald-400">
            {formatMoney(totalCollected)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span>Recouvrement :</span>
            <span className="text-emerald-400 font-bold">{overallCollectionRate}%</span>
          </div>
        </div>

        {/* Metric 3: Invoices Count */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Factures Émises</span>
            <Receipt className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="font-mono text-lg sm:text-xl font-bold text-cyan-400">
            {totalInvoicesCount} <span className="text-xs font-normal text-slate-400">factures</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span>Payées : <strong className="text-white">{totalPaidInvoices}</strong> / {totalInvoicesCount}</span>
          </div>
        </div>

        {/* Metric 4: Average Invoice Basket */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Panier Moyen / Facture</span>
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="font-mono text-lg sm:text-xl font-bold text-purple-400">
            {formatMoney(avgInvoiceValue)}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <span>Moyenne : ~{Math.round(totalInvoicesCount / (filteredData.length || 1))} fac./mois</span>
          </div>
        </div>
      </div>

      {/* Recharts Canvas */}
      <div className="h-72 sm:h-80 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {chartView === 'composed' ? (
            <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="colorPending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis
                dataKey="monthLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
              />
              {/* Left Y-Axis: Revenue in chosen currency */}
              <YAxis
                yAxisId="left"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                  return val;
                }}
                tickLine={false}
                axisLine={false}
              />
              {/* Right Y-Axis: Number of invoices */}
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#06b6d4"
                tick={{ fill: '#06b6d4', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(val) => `${val} fac.`}
                tickLine={false}
                axisLine={false}
                domain={[0, 'dataMax + 4']}
              />
              <Tooltip content={<CustomInvoicingTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
              />

              {/* Bars: Stacked Collected vs Pending Revenue */}
              <Bar
                yAxisId="left"
                dataKey="collectedRevenueConverted"
                name={`Encaissé (${currencyOption.symbol})`}
                stackId="revenue"
                fill="url(#colorCollected)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                yAxisId="left"
                dataKey="pendingRevenueConverted"
                name={`En Attente (${currencyOption.symbol})`}
                stackId="revenue"
                fill="url(#colorPending)"
                radius={[4, 4, 0, 0]}
              />

              {/* Line: Invoices Count (Right Axis) */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="invoicesCount"
                name="Factures Émises (Nb)"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: '#06b6d4', stroke: '#083344', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#38bdf8', stroke: '#fff', strokeWidth: 2 }}
              />
            </ComposedChart>
          ) : chartView === 'area' ? (
            <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorInvoicedArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="colorCollectedArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis
                dataKey="monthLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                tickFormatter={(val) => {
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                  if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                  return val;
                }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomInvoicingTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Area
                type="monotone"
                dataKey="invoicedRevenueConverted"
                name={`Total Facturé (${currencyOption.symbol})`}
                stroke="#f59e0b"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorInvoicedArea)"
              />
              <Area
                type="monotone"
                dataKey="collectedRevenueConverted"
                name={`Encaissé / Réglé (${currencyOption.symbol})`}
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorCollectedArea)"
              />
            </AreaChart>
          ) : (
            <ComposedChart data={filteredData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} vertical={false} />
              <XAxis
                dataKey="monthLabel"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomInvoicingTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: '12px', fontSize: '11px', fontFamily: 'monospace' }}
              />
              <Bar
                dataKey="paidInvoicesCount"
                name="Factures Réglées"
                stackId="fac"
                fill="#10b981"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="pendingInvoicesCount"
                name="Factures En Attente"
                stackId="fac"
                fill="#f59e0b"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="invoicesCount"
                name="Total Factures Émises"
                stroke="#38bdf8"
                strokeWidth={2.5}
                dot={{ fill: '#38bdf8', r: 4 }}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Info & OHADA / Banking summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Données synchronisées avec le module Facturation &amp; Devis V&amp;I Tech (Normes OHADA).</span>
        </div>
        <div className="font-mono text-[11px] text-slate-400 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-400">
            Taux direct : 1 EUR = {currencyOption.rateToEUR} {currencyOption.symbol} ({currencyOption.code})
          </span>
        </div>
      </div>

    </div>
  );
};

