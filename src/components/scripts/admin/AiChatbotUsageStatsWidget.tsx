import React, { useState, useMemo, useEffect } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  Bot,
  Sparkles,
  Clock,
  TrendingUp,
  DollarSign,
  Zap,
  CheckCircle2,
  Phone,
  Search,
  RefreshCw,
  Download,
  Filter,
  Sliders,
  HelpCircle,
  ArrowUpRight,
  ShieldCheck,
  Cpu,
  Layers,
  ChevronDown,
  MessageSquare,
  Globe,
  Award,
  Calendar
} from 'lucide-react';
import {
  GENERATE_30_DAYS_AI_STATS,
  AI_TOPIC_DISTRIBUTION,
  INITIAL_AI_INTERACTION_LOGS,
  AiChatUsageDailyPoint,
  AiTopicDistribution,
  AiInteractionLog,
  calculateAiStatsSummary
} from '../../../data/aiChatbotStatsData';

export const AiChatbotUsageStatsWidget: React.FC = () => {
  // Configurable Parameters for Time & Financial Savings
  const [hourlyRateUSD, setHourlyRateUSD] = useState<number>(35);
  const [avgMinutesPerTicket, setAvgMinutesPerTicket] = useState<number>(10);
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('30d');
  const [chartViewMode, setChartViewMode] = useState<'queries' | 'timeSaved' | 'combined'>('combined');
  
  // Search and filter for live stream
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [showConfigDrawer, setShowConfigDrawer] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Data state
  const [dailyData, setDailyData] = useState<AiChatUsageDailyPoint[]>(() => GENERATE_30_DAYS_AI_STATS());
  const [interactionLogs, setInteractionLogs] = useState<AiInteractionLog[]>(() => {
    try {
      const saved = localStorage.getItem('vitech_ai_chat_logs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...INITIAL_AI_INTERACTION_LOGS];
        }
      }
    } catch (e) {}
    return INITIAL_AI_INTERACTION_LOGS;
  });

  // Listen to live chat updates from LiveChatWidget
  useEffect(() => {
    const handleChatUpdate = () => {
      try {
        const saved = localStorage.getItem('vitech_ai_chat_logs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            setInteractionLogs([...parsed, ...INITIAL_AI_INTERACTION_LOGS]);
          }
        }
      } catch (e) {}
    };

    window.addEventListener('vitech_ai_chat_updated', handleChatUpdate);
    return () => window.removeEventListener('vitech_ai_chat_updated', handleChatUpdate);
  }, []);

  // Fetch real chat logs from backend API if available
  const refreshLogsFromBackend = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/chat/logs');
      if (res.ok) {
        const data = await res.json();
        if (data.logs && Array.isArray(data.logs) && data.logs.length > 0) {
          const mappedLogs: AiInteractionLog[] = data.logs.map((l: any) => ({
            id: l.id || `log-${Date.now()}`,
            timestamp: l.timestamp || new Date().toISOString(),
            timeAgo: 'Récemment',
            userMessage: l.userMessage,
            botReply: l.botReply,
            category: l.sourcesUsed?.[0] || 'Conseil Général RAG',
            clientInfo: {
              location: 'Afrique / International',
              flag: '🌍',
              device: 'Web Browser'
            },
            durationMs: 1200,
            timeSavedMin: 10,
            status: l.escalatedToHuman ? 'escalated_human' : 'resolved_ai',
            modelUsed: l.model || 'Google Gemini 3.7 Flash RAG',
            sourcesUsed: l.sourcesUsed || ['Base de Connaissances V&I TECH']
          }));

          setInteractionLogs((prev) => {
            const combined = [...mappedLogs, ...prev];
            // Deduplicate by userMessage + timestamp
            const unique = Array.from(new Map(combined.map(item => [item.userMessage + item.timestamp, item])).values());
            return unique.slice(0, 50);
          });
        }
      }
    } catch (err) {
      console.log('Using local analytics store.');
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // Filtered dataset for charts
  const filteredDailyData = useMemo(() => {
    const sliceCount = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    return dailyData.slice(dailyData.length - sliceCount).map(point => {
      const timeSavedMin = point.totalQueries * avgMinutesPerTicket;
      const timeSavedHours = Number((timeSavedMin / 60).toFixed(1));
      const financialUSD = Math.round(timeSavedHours * hourlyRateUSD);
      return {
        ...point,
        estimatedTimeSavedMinutes: timeSavedMin,
        estimatedTimeSavedHours: timeSavedHours,
        estimatedFinancialSavingsUSD: financialUSD
      };
    });
  }, [dailyData, timeRange, avgMinutesPerTicket, hourlyRateUSD]);

  // Overall KPI Summary
  const summaryMetrics = useMemo(() => {
    return calculateAiStatsSummary(filteredDailyData, hourlyRateUSD, avgMinutesPerTicket);
  }, [filteredDailyData, hourlyRateUSD, avgMinutesPerTicket]);

  // Filtered interaction logs
  const filteredLogs = useMemo(() => {
    return interactionLogs.filter(log => {
      const matchSearch = searchQuery === '' || 
        log.userMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.botReply.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategoryFilter === 'all' || log.category === selectedCategoryFilter;
      const matchStatus = selectedStatusFilter === 'all' || log.status === selectedStatusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [interactionLogs, searchQuery, selectedCategoryFilter, selectedStatusFilter]);

  // CSV Export for Executive Reporting
  const exportStatsCSV = () => {
    const headers = ['Date', 'Total Requêtes', 'Résolu par IA', 'Escalades WhatsApp', 'Minutes Économisées', 'Heures Économisées', 'Économies ($ USD)'];
    const rows = filteredDailyData.map(d => [
      d.date,
      d.totalQueries,
      d.resolvedByAi,
      d.escalatedToHuman,
      d.estimatedTimeSavedMinutes,
      d.estimatedTimeSavedHours,
      d.estimatedFinancialSavingsUSD
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `vitech_ai_usage_time_savings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Custom Chart Tooltip
  const CustomAnalyticsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload as AiChatUsageDailyPoint;
      return (
        <div className="p-3.5 rounded-2xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl space-y-2 text-xs backdrop-blur-md min-w-[240px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 gap-4">
            <span className="font-bold text-white font-mono">{point.dayLabel} ({point.date})</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">
              <Bot className="w-3 h-3" />
              <span>Gemini RAG</span>
            </span>
          </div>

          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex items-center justify-between gap-4 text-cyan-400">
              <span>Requêtes Clients Traitées :</span>
              <span className="font-bold">{point.totalQueries}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-emerald-400">
              <span>Résolues à 100% par IA :</span>
              <span className="font-bold">{point.resolvedByAi} ({((point.resolvedByAi / point.totalQueries) * 100).toFixed(0)}%)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-amber-400">
              <span>Escaladées Direction WhatsApp :</span>
              <span className="font-bold">{point.escalatedToHuman}</span>
            </div>
            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-4 text-purple-300 font-bold">
              <span>Temps Économisé :</span>
              <span>{point.estimatedTimeSavedHours}h ({point.estimatedTimeSavedMinutes} min)</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-emerald-300 font-bold">
              <span>Gain Financier Estimé :</span>
              <span>${point.estimatedFinancialSavingsUSD} USD</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
      
      {/* 1. HEADER & CONTROLS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-inner">
              <Bot className="w-4 h-4" />
            </div>
            <h3 className="font-black text-base sm:text-lg text-white flex items-center gap-2">
              <span>Statistiques d'Utilisation de l'IA &amp; Économies de Temps</span>
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>Gemini 3.7 Flash RAG</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Monitoring Live</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-3xl">
            Mesure en continu le volume de requêtes traitées par l'Assistant IA, le taux d'autonomie opérationnelle et les heures de travail d'ingénierie économisées pour l'équipe technique.
          </p>
        </div>

        {/* Action Buttons & Quick Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Time range selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '7d' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              7J
            </button>
            <button
              onClick={() => setTimeRange('14d')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '14d' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              14J
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                timeRange === '30d' ? 'bg-cyan-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              30J
            </button>
          </div>

          {/* Config Drawer Toggle (ROI Simulator) */}
          <button
            onClick={() => setShowConfigDrawer(!showConfigDrawer)}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              showConfigDrawer
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="Ajuster les paramètres de calcul du temps et ROI"
          >
            <Sliders className="w-3.5 h-3.5 text-purple-400" />
            <span>Paramètres ROI</span>
          </button>

          {/* Refresh button */}
          <button
            onClick={refreshLogsFromBackend}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer disabled:opacity-50"
            title="Rafraîchir les métriques d'IA"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          {/* Export CSV button */}
          <button
            onClick={exportStatsCSV}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Exporter les statistiques d'utilisation en CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* 2. ROI & TIME SAVINGS CONFIG DRAWER (Collapsible) */}
      {showConfigDrawer && (
        <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-purple-400" />
              <span>Simulateur de Gains Opérationnels &amp; Rentabilité IA</span>
            </span>
            <span className="text-[11px] text-slate-400">
              Modifiez ces hypothèses pour recalculer instantanément les économies nettes.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Avg minutes per manual ticket */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Temps moyen par réponse manuelle de support :</span>
                <span className="font-mono font-bold text-cyan-400">{avgMinutesPerTicket} minutes / requête</span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={avgMinutesPerTicket}
                onChange={(e) => setAvgMinutesPerTicket(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>3 min (réponse ultra-courte)</span>
                <span>10 min (standard IT)</span>
                <span>30 min (audit complet)</span>
              </div>
            </div>

            {/* Hourly rate of senior engineer */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Coût horaire chargé d'un ingénieur / conseiller :</span>
                <span className="font-mono font-bold text-emerald-400">${hourlyRateUSD} USD / heure</span>
              </div>
              <input
                type="range"
                min="15"
                max="100"
                step="5"
                value={hourlyRateUSD}
                onChange={(e) => setHourlyRateUSD(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>$15/h (Support N1)</span>
                <span>$35/h (Ingénieur Dev)</span>
                <span>$100/h (Architecte Senior)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. CORE SUMMARY KPI CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Total Requêtes Traitées */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-cyan-500/30 relative overflow-hidden group hover:border-cyan-500/60 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Requêtes IA Traitées</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>+24%</span>
            </span>
          </div>
          <div className="mt-3 space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
              {summaryMetrics.totalQueriesProcessed.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1">
              <span className="text-cyan-400 font-bold">{summaryMetrics.totalQueriesThisMonth}</span>
              <span>requêtes sur les 14 derniers jours</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Latence moyenne IA :</span>
            <span className="text-cyan-300 font-bold">{summaryMetrics.avgResponseTimeSeconds}s</span>
          </div>
        </div>

        {/* KPI 2: Économies de Temps Estimées */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-purple-500/30 relative overflow-hidden group hover:border-purple-500/60 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Temps Économisé</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-500/30">
              Productivité
            </span>
          </div>
          <div className="mt-3 space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-purple-300 font-mono tracking-tight">
              {summaryMetrics.totalHoursSaved.toLocaleString()}h <span className="text-lg font-normal text-slate-400">{summaryMetrics.totalMinutesSaved % 60}m</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ≈ <span className="text-purple-300 font-bold">{(summaryMetrics.totalHoursSaved / 8).toFixed(1)} jours</span> ouvrés d'ingénieur libérés
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Base de calcul :</span>
            <span className="text-purple-300 font-bold">{avgMinutesPerTicket} min / ticket</span>
          </div>
        </div>

        {/* KPI 3: Économies Financières Estimées */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 relative overflow-hidden group hover:border-emerald-500/60 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Économies Financières</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              ROI Positif
            </span>
          </div>
          <div className="mt-3 space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono tracking-tight">
              ${summaryMetrics.totalFinancialSavingsUSD.toLocaleString()} <span className="text-xs font-normal text-slate-400">USD</span>
            </div>
            <div className="text-[11px] text-slate-400">
              ≈ <span className="text-emerald-300 font-bold">{summaryMetrics.totalFinancialSavingsRWF.toLocaleString()} RWF</span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Taux horaire ingénieur :</span>
            <span className="text-emerald-300 font-bold">${hourlyRateUSD}/h</span>
          </div>
        </div>

        {/* KPI 4: Taux d'Autonomie & Résolution IA */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 relative overflow-hidden group hover:border-amber-500/60 transition-all shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Autonomie IA Résolutive</span>
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-500/30">
              CSAT {summaryMetrics.customerSatisfactionScore}%
            </span>
          </div>
          <div className="mt-3 space-y-0.5">
            <div className="text-2xl sm:text-3xl font-black text-amber-300 font-mono tracking-tight">
              {summaryMetrics.automatedResolutionRate}%
            </div>
            <div className="text-[11px] text-slate-400">
              Résolu instantanément sans intervention humaine
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Escalades WhatsApp :</span>
            <span className="text-amber-400 font-bold">{summaryMetrics.humanEscalationRate}%</span>
          </div>
        </div>

      </div>

      {/* 4. CHARTS SECTION (EVOLUTION TEMPORELLE & REPARTITION THEMATIQUE) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left (2 cols): Time Series Evolution */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span className="font-bold text-xs text-white uppercase tracking-wider">
                Évolution Quotidienne : Volume Traité vs Heures Économisées ({timeRange})
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px]">
              <button
                onClick={() => setChartViewMode('combined')}
                className={`px-2.5 py-1 rounded transition ${
                  chartViewMode === 'combined' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Combiné
              </button>
              <button
                onClick={() => setChartViewMode('queries')}
                className={`px-2.5 py-1 rounded transition ${
                  chartViewMode === 'queries' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Requêtes Seules
              </button>
              <button
                onClick={() => setChartViewMode('timeSaved')}
                className={`px-2.5 py-1 rounded transition ${
                  chartViewMode === 'timeSaved' ? 'bg-purple-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Heures Économisées
              </button>
            </div>
          </div>

          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredDailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotalQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorTimeSaved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomAnalyticsTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  formatter={(val) => <span className="text-slate-300 text-xs">{val}</span>} 
                />

                {(chartViewMode === 'combined' || chartViewMode === 'queries') && (
                  <Area
                    type="monotone"
                    dataKey="totalQueries"
                    name="Requêtes Traitées"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTotalQueries)"
                  />
                )}

                {(chartViewMode === 'combined' || chartViewMode === 'queries') && (
                  <Area
                    type="monotone"
                    dataKey="resolvedByAi"
                    name="Résolues par IA"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    fillOpacity={1}
                    fill="url(#colorResolved)"
                  />
                )}

                {(chartViewMode === 'combined' || chartViewMode === 'timeSaved') && (
                  <Area
                    type="monotone"
                    dataKey="estimatedTimeSavedHours"
                    name="Heures Économisées (h)"
                    stroke="#a855f7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorTimeSaved)"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right (1 col): Topic Distribution Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-1 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-purple-400" />
              <span className="font-bold text-xs text-white uppercase tracking-wider">
                Thématiques des Questions Clients
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ventilation par centre d'intérêt &amp; temps moyen économisé par question.
            </p>
          </div>

          {/* Topic distribution list with visual bars */}
          <div className="space-y-2.5">
            {AI_TOPIC_DISTRIBUTION.map((topic) => (
              <div key={topic.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-200 font-medium truncate">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: topic.color }} />
                    <span className="truncate">{topic.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 font-bold shrink-0 ml-2">
                    {topic.percentage}% ({topic.queriesCount})
                  </span>
                </div>
                {/* Progress bar */}
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${topic.percentage}%`, backgroundColor: topic.color }} 
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Économie moyenne : +{topic.avgTimeSavedMin} min</span>
                  <span className="text-slate-400">~{Math.round((topic.queriesCount * topic.avgTimeSavedMin) / 60)}h économisées</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2 mt-2">
            <Award className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Top intérêt : <strong>33.2%</strong> des questions concernent les tarifs internationaux &amp; devis immédiats.</span>
          </div>
        </div>

      </div>

      {/* 5. LIVE INTERACTION STREAM & AUDIT FEED */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyan-400" />
            <h4 className="font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
              Flux en Direct des Interactions Clients &amp; Temps Économisé par Requête
            </h4>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
              ({filteredLogs.length} interactions)
            </span>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une question..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500 transition w-44 sm:w-56"
              />
            </div>

            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="all">Tous les statuts</option>
              <option value="resolved_ai">✓ Résolu par IA</option>
              <option value="escalated_human">📞 Escalade WhatsApp</option>
            </select>
          </div>
        </div>

        {/* Feed Cards List */}
        <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1 no-scrollbar">
          {filteredLogs.length === 0 ? (
            <div className="p-8 text-center bg-slate-950/60 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-1">
              <HelpCircle className="w-6 h-6 mx-auto text-slate-500 mb-2" />
              <p>Aucune interaction ne correspond à votre filtre de recherche.</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2.5 shadow"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {log.clientInfo?.flag && <span className="text-sm">{log.clientInfo.flag}</span>}
                    <span className="text-xs font-bold text-white">
                      {log.clientInfo?.location || 'Visiteur Portal'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">• {log.timeAgo}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800">
                      {log.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950/80 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3" />
                      <span>+{log.timeSavedMin} min économisées</span>
                    </span>

                    {log.status === 'resolved_ai' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-bold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Résolu par IA ({log.durationMs}ms)</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-bold">
                        <Phone className="w-3 h-3 text-amber-400" />
                        <span>Lead WhatsApp</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* User Prompt & AI Response Snippet */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-2 text-slate-200">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30 shrink-0 mt-0.5 font-bold">
                      Client
                    </span>
                    <p className="font-semibold text-slate-100">{log.userMessage}</p>
                  </div>

                  <div className="flex items-start gap-2 text-slate-400 pl-4 border-l-2 border-cyan-500/30">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-emerald-400 border border-slate-800 shrink-0 mt-0.5 font-bold">
                      Gemini RAG
                    </span>
                    <p className="line-clamp-2 text-slate-300 text-[11px] leading-relaxed">
                      {log.botReply}
                    </p>
                  </div>
                </div>

                {/* RAG Sources Footer */}
                {log.sourcesUsed && log.sourcesUsed.length > 0 && (
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[10px] text-slate-500 font-mono">
                    <span>Sources RAG mobilisées :</span>
                    {log.sourcesUsed.map((src, idx) => (
                      <span key={idx} className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-400 border border-slate-800">
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
};
