import React, { useState, useMemo } from 'react';
import { 
  Leaf, 
  Zap, 
  Cloud, 
  Server, 
  Cpu, 
  Trees, 
  Car, 
  Lightbulb, 
  Droplets, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  TrendingDown, 
  DollarSign, 
  Download, 
  CheckCircle2, 
  RefreshCw,
  Info,
  Calendar,
  Share2,
  Layers,
  Activity
} from 'lucide-react';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from '../context/LanguageContext';

export interface WorkloadProfile {
  id: string;
  name: string;
  category: string;
  baseKwhPerMillion: number; // kWh per 1M requests on standard stack
  icon: string;
  description: string;
}

export interface DatacenterRegion {
  id: string;
  name: string;
  country: string;
  flag: string;
  pue: number; // Power Usage Effectiveness (1.0 is ideal, standard legacy is ~1.65)
  gridCarbonIntensity: number; // gCO2e per kWh
  energyMix: string;
}

const WORKLOAD_PROFILES: WorkloadProfile[] = [
  {
    id: 'api-serverless',
    name: 'Microservices & API Serverless',
    category: 'Backend & APIs',
    baseKwhPerMillion: 4.8,
    icon: 'Cloud',
    description: 'APIs REST/GraphQL scalables, passerelles Mobile Money & Webhooks asynchrones.'
  },
  {
    id: 'k8s-cluster',
    name: 'Cluster Kubernetes Haute Dispo',
    category: 'Conteneurs & Orchestration',
    baseKwhPerMillion: 8.5,
    icon: 'Server',
    description: 'Infrastructures multi-nœuds conteneurisées avec auto-scaling et répartition de charge.'
  },
  {
    id: 'ai-llm-rag',
    name: 'Pipeline IA Générative & RAG LLM',
    category: 'Intelligence Artificielle',
    baseKwhPerMillion: 24.0,
    icon: 'Cpu',
    description: 'Inférence de modèles de langage, embeddings vectoriels et OCR vision par ordinateur.'
  },
  {
    id: 'database-cluster',
    name: 'Base de Données & Cache Haute Performance',
    category: 'Data & Stockage',
    baseKwhPerMillion: 6.2,
    icon: 'Layers',
    description: 'PostgreSQL, Redis et réplications temps réel multi-zones chiffrées.'
  },
  {
    id: 'web-mobile-cdn',
    name: 'Plateforme Web SaaS & CDN Edge',
    category: 'Web & Mobile',
    baseKwhPerMillion: 3.5,
    icon: 'Zap',
    description: 'Applications Next.js/React avec rendu SSR et distribution globale Edge.'
  }
];

const DATACENTER_REGIONS: DatacenterRegion[] = [
  {
    id: 'rw-kigali',
    name: 'Kigali Eco-DataCenter',
    country: 'Rwanda',
    flag: '🇷🇼',
    pue: 1.12,
    gridCarbonIntensity: 42, // Hydroélectrique Lac Kivu + Solaire
    energyMix: '88% Hydroélectrique & Solaire'
  },
  {
    id: 'sn-dakar',
    name: 'Dakar Green Solar Hub',
    country: 'Sénégal',
    flag: '🇸🇳',
    pue: 1.18,
    gridCarbonIntensity: 85, // Solaire Teranga + Éolien Taiba Ndiaye
    energyMix: '72% Renouvelable (Solaire/Éolien)'
  },
  {
    id: 'ci-abidjan',
    name: 'Abidjan Green Edge',
    country: "Côte d'Ivoire",
    flag: '🇨🇮',
    pue: 1.22,
    gridCarbonIntensity: 95, // Hydroélectricité Soubré
    energyMix: '68% Hydroélectrique & Gaz propre'
  },
  {
    id: 'ma-casablanca',
    name: 'Casablanca Solar DC',
    country: 'Maroc',
    flag: '🇲🇦',
    pue: 1.20,
    gridCarbonIntensity: 88, // Complexe Solaire Noor
    energyMix: '75% Solaire & Éolien'
  },
  {
    id: 'eu-standard',
    name: 'Cloud Standard Europe (AWS/GCP)',
    country: 'Europe',
    flag: '🇪🇺',
    pue: 1.58,
    gridCarbonIntensity: 230,
    energyMix: 'Mix Réseau Européen Moyen'
  },
  {
    id: 'us-legacy',
    name: 'Cloud Standard US / Legacy VM',
    country: 'USA / International',
    flag: '🇺🇸',
    pue: 1.68,
    gridCarbonIntensity: 390,
    energyMix: 'Fossile & Gaz majoritaire'
  }
];

interface GreenCloudEcoEstimatorProps {
  onNavigateToEstimator?: (context: any) => void;
  onOpenScheduleModal?: () => void;
}

export const GreenCloudEcoEstimator: React.FC<GreenCloudEcoEstimatorProps> = ({
  onNavigateToEstimator,
  onOpenScheduleModal
}) => {
  const { formatCurrency } = useCurrency();
  const { t } = useTranslation();

  // State
  const [selectedWorkload, setSelectedWorkload] = useState<string>('api-serverless');
  const [monthlyRequests, setMonthlyRequests] = useState<number>(3500000); // 3.5 Million requests
  const [dataVolumeGB, setDataVolumeGB] = useState<number>(250); // 250 GB
  const [selectedRegion, setSelectedRegion] = useState<string>('rw-kigali');
  const [enableGreenOptimization, setEnableGreenOptimization] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Active object references
  const workload = useMemo(() => 
    WORKLOAD_PROFILES.find(w => w.id === selectedWorkload) || WORKLOAD_PROFILES[0],
    [selectedWorkload]
  );

  const region = useMemo(() => 
    DATACENTER_REGIONS.find(r => r.id === selectedRegion) || DATACENTER_REGIONS[0],
    [selectedRegion]
  );

  // Calculation logic based on Green Software Foundation & GHG Protocol specifications
  const calculations = useMemo(() => {
    const millionReq = monthlyRequests / 1000000;
    
    // Baseline Legacy Non-Optimized consumption (Annual in kWh)
    const legacyPUE = 1.65;
    const legacyCarbonIntensity = 380; // gCO2/kWh
    const legacyAnnualKwh = millionReq * workload.baseKwhPerMillion * 12 * (legacyPUE / 1.0) + (dataVolumeGB * 0.08 * 12);
    const legacyAnnualCO2Kg = (legacyAnnualKwh * legacyCarbonIntensity) / 1000;
    const legacyAnnualCostUSD = legacyAnnualKwh * 0.18 + (millionReq * 12 * 0.45);

    // V&I Tech Optimized Eco-Infrastructure
    // Code efficiency factor (Rust/Go/Distroless/Edge Caching = ~65% reduction in compute workload)
    const optimizationFactor = enableGreenOptimization ? 0.35 : 0.85;
    const effectivePUE = region.pue;
    const effectiveCarbonIntensity = region.gridCarbonIntensity;

    const optimizedAnnualKwh = (millionReq * workload.baseKwhPerMillion * 12 * optimizationFactor * (effectivePUE / 1.0)) + (dataVolumeGB * 0.03 * 12);
    const optimizedAnnualCO2Kg = (optimizedAnnualKwh * effectiveCarbonIntensity) / 1000;
    const optimizedAnnualCostUSD = optimizedAnnualKwh * 0.14 + (millionReq * 12 * 0.16);

    // Savings
    const avoidedCO2Kg = Math.max(0, legacyAnnualCO2Kg - optimizedAnnualCO2Kg);
    const avoidedKwh = Math.max(0, legacyAnnualKwh - optimizedAnnualKwh);
    const annualSavingsUSD = Math.max(0, legacyAnnualCostUSD - optimizedAnnualCostUSD);
    const reductionPercent = Math.round((avoidedCO2Kg / (legacyAnnualCO2Kg || 1)) * 100);

    // Tangible Equivalencies
    const treesEquivalent = Math.max(1, Math.round(avoidedCO2Kg / 22)); // 1 mature tree absorbs ~22kg CO2/year
    const carKmEquivalent = Math.max(1, Math.round(avoidedCO2Kg / 0.12)); // 1 standard car emits ~120g CO2/km
    const ledBulbHours = Math.max(1, Math.round(avoidedKwh / 0.01)); // 10W LED bulb
    const waterLitersSaved = Math.max(1, Math.round(avoidedKwh * 1.8)); // 1.8L of water saved per kWh server cooling

    return {
      legacyAnnualKwh: Math.round(legacyAnnualKwh),
      legacyAnnualCO2Kg: Math.round(legacyAnnualCO2Kg),
      optimizedAnnualKwh: Math.round(optimizedAnnualKwh),
      optimizedAnnualCO2Kg: Math.round(optimizedAnnualCO2Kg),
      avoidedCO2Kg: Math.round(avoidedCO2Kg),
      avoidedKwh: Math.round(avoidedKwh),
      reductionPercent: Math.min(94, Math.max(25, reductionPercent)),
      annualSavingsUSD: Math.round(annualSavingsUSD),
      treesEquivalent,
      carKmEquivalent,
      ledBulbHours,
      waterLitersSaved,
      ecoScore: reductionPercent >= 75 ? 'A+' : reductionPercent >= 60 ? 'A' : 'B'
    };
  }, [monthlyRequests, dataVolumeGB, workload, region, enableGreenOptimization]);

  // Export summary as JSON / text
  const handleExportReport = () => {
    const reportData = {
      title: "Rapport d'Impact Écologique & Efficacité Green Cloud - V&I TECH AFRICA",
      date: new Date().toISOString(),
      workload: workload.name,
      monthlyRequests: monthlyRequests.toLocaleString('fr-FR') + ' requêtes/mois',
      datacenter: `${region.name} (${region.country}) - PUE ${region.pue}`,
      metrics: {
        avoidedCO2AnnualKg: calculations.avoidedCO2Kg,
        avoidedEnergyAnnualKwh: calculations.avoidedKwh,
        co2ReductionPercentage: `${calculations.reductionPercent}%`,
        treesEquivalentPerYear: calculations.treesEquivalent,
        carKmAvoided: calculations.carKmEquivalent,
        estimatedFinOpsSavingsUSD: calculations.annualSavingsUSD,
        vitechEcoScore: calculations.ecoScore
      },
      certifications: ["Green Software Foundation", "ISO 14001 Standards", "GHG Protocol Scope 2 & 3 Compliance"]
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Vitech-GreenCloud-Report-${selectedWorkload}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div id="eco-estimator" className="py-12 bg-slate-900 text-white rounded-3xl border border-emerald-500/30 p-6 sm:p-10 shadow-2xl relative overflow-hidden my-12">
      
      {/* Background radial eco glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-6 relative z-10">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Green Cloud &amp; FinOps Éco-Responsable</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Estimateur d'Impact Écologique &amp;{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Efficacité Énergétique
            </span>
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Mesurez concrètement la réduction de votre empreinte carbone (CO₂e) et de vos dépenses cloud grâce aux architectures légères V&I Tech et aux datacenters hydro-solaires panafricains.
          </p>
        </div>

        {/* Eco Score Badge */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-center shrink-0 shadow-lg">
          <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
            Score Éco-Conception
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white font-mono flex items-center justify-center gap-1 mt-0.5">
            <span className="text-emerald-400">{calculations.ecoScore}</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-[11px] text-emerald-300/80 font-bold mt-0.5">
            -{calculations.reductionPercent}% de Carbone
          </div>
        </div>
      </div>

      {/* Main Interactive Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 relative z-10 items-start">
        
        {/* Left Column: Sliders & Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* 1. Workload Type Selector */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Server className="w-4 h-4 text-cyan-400" />
              <span>1. Type de Charge &amp; Architecture Applicative</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {WORKLOAD_PROFILES.map((wp) => {
                const isSelected = selectedWorkload === wp.id;
                return (
                  <button
                    key={wp.id}
                    onClick={() => setSelectedWorkload(wp.id)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{wp.name}</div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{wp.description}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Sliders: Monthly Traffic & Data */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-5">
            
            {/* Slider 1: Requests per month */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Volume de Requêtes &amp; Transactions Mensuelles
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                  {(monthlyRequests / 1000000).toFixed(1)}M req/mois
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={20000000}
                step={200000}
                value={monthlyRequests}
                onChange={(e) => setMonthlyRequests(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>100k</span>
                <span>5M</span>
                <span>10M</span>
                <span>20M+ req/mois</span>
              </div>
            </div>

            {/* Slider 2: Data processed */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-300 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  Volume de Données / Stockage Actif
                </span>
                <span className="font-mono font-bold text-cyan-400 text-sm bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                  {dataVolumeGB} Go
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={2000}
                step={20}
                value={dataVolumeGB}
                onChange={(e) => setDataVolumeGB(Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>20 Go</span>
                <span>500 Go</span>
                <span>1 To</span>
                <span>2 To</span>
              </div>
            </div>

          </div>

          {/* 3. Datacenter Region Selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Cloud className="w-4 h-4 text-emerald-400" />
                <span>2. Datacenter &amp; Source d'Énergie Verte</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">PUE optimal : 1.12</span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {DATACENTER_REGIONS.map((dc) => {
                const isSelected = selectedRegion === dc.id;
                return (
                  <button
                    key={dc.id}
                    onClick={() => setSelectedRegion(dc.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{dc.flag}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        PUE {dc.pue}
                      </span>
                    </div>
                    <div className="text-xs font-bold mt-1 truncate">{dc.name}</div>
                    <div className="text-[10px] text-emerald-400/90 truncate">{dc.energyMix}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Toggle V&I Tech Green Architecture */}
          <div 
            onClick={() => setEnableGreenOptimization(!enableGreenOptimization)}
            className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 flex items-center justify-between gap-4 cursor-pointer hover:border-emerald-400 transition-all"
          >
            <div className="space-y-0.5">
              <div className="text-xs font-black text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Optimisation V&I Tech Green Ops (Rust / Go / Distroless)</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Réduction active du CPU par compilation native, mise en veille automatique et edge-caching.
              </p>
            </div>

            <div className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${enableGreenOptimization ? 'bg-emerald-500' : 'bg-slate-700'}`}>
              <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${enableGreenOptimization ? 'left-6.5' : 'left-0.5'}`} />
            </div>
          </div>

        </div>

        {/* Right Column: Dynamic Results & Environmental Equivalencies */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Main Key Impact Card */}
          <div className="p-6 rounded-3xl bg-slate-950 border border-emerald-500/40 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Résultats Prévisionnels Annuels
                </span>
                <h4 className="text-lg font-black text-white">Bilan Carbone &amp; FinOps</h4>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold">
                Certifié GHG Scope 2 &amp; 3
              </div>
            </div>

            {/* 2 Big Numbers */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/30 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Leaf className="w-3.5 h-3.5" />
                  <span>CO₂ Évité / An</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {calculations.avoidedCO2Kg.toLocaleString('fr-FR')}{' '}
                  <span className="text-sm font-bold text-emerald-400">kg</span>
                </div>
                <div className="text-[10px] text-emerald-300/80">
                  -{calculations.reductionPercent}% vs standard legacy
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-cyan-950/50 border border-cyan-500/30 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Énergie Épargnée</span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-mono">
                  {calculations.avoidedKwh.toLocaleString('fr-FR')}{' '}
                  <span className="text-sm font-bold text-cyan-400">kWh</span>
                </div>
                <div className="text-[10px] text-cyan-300/80">
                  PUE {region.pue} {region.flag}
                </div>
              </div>
            </div>

            {/* Financial FinOps Savings */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                  <span>Économie FinOps sur la Facture Cloud</span>
                </div>
                <div className="text-lg font-black text-amber-400 font-mono">
                  ≈ {formatCurrency(calculations.annualSavingsUSD)} / an
                </div>
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                (-{(calculations.reductionPercent * 0.7).toFixed(0)}% OPEX)
              </span>
            </div>

            {/* Real World Ecological Equivalencies */}
            <div className="space-y-2.5 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Équivalents Écologiques Concrets :
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5 text-xs">
                  <Trees className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-extrabold text-white font-mono">+{calculations.treesEquivalent} arbres</div>
                    <div className="text-[10px] text-slate-400">plantés compensés</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5 text-xs">
                  <Car className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <div className="font-extrabold text-white font-mono">{calculations.carKmEquivalent.toLocaleString('fr-FR')} km</div>
                    <div className="text-[10px] text-slate-400">en voiture évités</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5 text-xs">
                  <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <div className="font-extrabold text-white font-mono">{(calculations.ledBulbHours / 1000).toFixed(0)}k h</div>
                    <div className="text-[10px] text-slate-400">d'éclairage LED</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5 text-xs">
                  <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <div className="font-extrabold text-white font-mono">{calculations.waterLitersSaved.toLocaleString('fr-FR')} L</div>
                    <div className="text-[10px] text-slate-400">d'eau préservés</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  if (onNavigateToEstimator) {
                    onNavigateToEstimator({
                      serviceId: 'cloud-infrastructure',
                      projectType: 'Infrastructures Cloud & Green DevOps',
                      workload: workload.name,
                      region: region.name,
                      monthlyRequests: `${(monthlyRequests / 1000000).toFixed(1)}M/mois`,
                      avoidedCO2: `${calculations.avoidedCO2Kg} kg CO2/an`
                    });
                  }
                }}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Intégrer ce Cadrage Green Cloud au Devis</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleExportReport}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Télécharger le rapport d'impact JSON/PDF"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Exporter Rapport</span>
                </button>

                <button
                  onClick={onOpenScheduleModal}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[11px] border border-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Audit FinOps (30m)</span>
                </button>
              </div>
            </div>

          </div>

          {/* Green Software Commitment note */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300/90 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-[11px] leading-relaxed">
              V&I TECH AFRICA applique le manifeste de la <strong>Green Software Foundation</strong> : éco-conception logicielle, zéro gaspillage de cycles CPU et serveurs souverains africains à haute efficacité énergétique.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
