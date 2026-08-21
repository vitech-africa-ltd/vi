import React, { useState } from 'react';
import { 
  BarChart3, 
  Layers, 
  Users, 
  DollarSign, 
  Cpu, 
  UploadCloud, 
  FileCode, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Plus, 
  Mail, 
  Send, 
  Search, 
  ArrowLeft, 
  Eye, 
  ExternalLink,
  Sparkles,
  Phone,
  Key,
  Globe,
  Settings
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import confetti from 'canvas-confetti';
import { INITIAL_SCRIPTS, ScriptProduct } from '../../data/scriptsData';
import { INITIAL_TEAM_MEMBERS, TeamMember } from '../../data/teamData';

interface ScriptsAdminDashboardProps {
  onBackToMarketplace: () => void;
}

export const ScriptsAdminDashboard: React.FC<ScriptsAdminDashboardProps> = ({
  onBackToMarketplace
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'analyzer' | 'momo' | 'newsletter' | 'team' | 'security'>('analytics');
  const [productsList, setProductsList] = useState<ScriptProduct[]>(INITIAL_SCRIPTS);
  const [teamList, setTeamList] = useState<TeamMember[]>(INITIAL_TEAM_MEMBERS);

  // Automated Script Analyzer State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedZipName, setUploadedZipName] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    language: string;
    framework: string;
    version: string;
    filesCount: number;
    linesOfCode: number;
    fileSize: string;
    dependencies: string[];
    difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise';
    securityScore: number;
    qualityScore: number;
    owaspGrade: string;
  } | null>(null);

  // New Product Draft Form
  const [draftTitle, setDraftTitle] = useState('');
  const [draftPriceUSD, setDraftPriceUSD] = useState(49);
  const [draftPriceRWF, setDraftPriceRWF] = useState(65000);
  const [draftCategory, setDraftCategory] = useState<'php-laravel' | 'node-react' | 'mobile-flutter' | 'python-django' | 'wordpress-plugins' | 'ui-templates' | 'fullstack-saas'>('php-laravel');
  const [draftDescription, setDraftDescription] = useState('');

  // Newsletter State
  const [newsletterSubject, setNewsletterSubject] = useState('🔥 Nouveauté Vitech Scripts : Nouveau Moteur Mobile Money disponible !');
  const [newsletterAudience, setNewsletterAudience] = useState<'all' | 'buyers' | 'free_users'>('all');
  const [newsletterBody, setNewsletterBody] = useState('Bonjour à toute la communauté Vitech Africa,\n\nNous venons de déployer une mise à jour majeure sur notre suite fintech VitechPay v3.2.0.\n\nProfitez de -20% avec le code promo KIGALI2026.');
  const [newsletterSentSuccess, setNewsletterSentSuccess] = useState(false);

  // Mobile Money Transactions (MTN & Airtel Rwanda)
  const [momoTransactions, setMomoTransactions] = useState([
    {
      id: 'MOMO-RW-9941',
      phone: '250788123456',
      amountRWF: 65000,
      amountUSD: 49,
      provider: 'MTN Mobile Money',
      status: 'SUCCESS',
      product: 'VitechPay Gateway Suite',
      time: 'Il y a 12 min'
    },
    {
      id: 'MOMO-RW-9938',
      phone: '250722987654',
      amountRWF: 118000,
      amountUSD: 89,
      provider: 'Airtel Money',
      status: 'SUCCESS',
      product: 'AfriRide Flutter App',
      time: 'Il y a 45 min'
    },
    {
      id: 'MOMO-RW-9930',
      phone: '250788445566',
      amountRWF: 132000,
      amountUSD: 99,
      provider: 'MTN Mobile Money',
      status: 'SUCCESS',
      product: 'OmniCloud Telemedicine',
      time: 'Il y a 2 heures'
    }
  ]);

  // Analytics Chart Data
  const revenueData = [
    { month: 'Jan', revenueUSD: 3200, revenueRWF: 4200000, downloads: 140 },
    { month: 'Fév', revenueUSD: 4800, revenueRWF: 6300000, downloads: 210 },
    { month: 'Mar', revenueUSD: 6100, revenueRWF: 8000000, downloads: 290 },
    { month: 'Avr', revenueUSD: 7900, revenueRWF: 10400000, downloads: 380 },
    { month: 'Mai', revenueUSD: 11200, revenueRWF: 14800000, downloads: 540 },
    { month: 'Juin', revenueUSD: 15400, revenueRWF: 20300000, downloads: 720 },
  ];

  const categoryDistribution = [
    { name: 'PHP / Laravel', value: 40, color: '#06b6d4' },
    { name: 'Flutter Mobile', value: 25, color: '#3b82f6' },
    { name: 'Full-Stack SaaS', value: 20, color: '#10b981' },
    { name: 'Python IA', value: 15, color: '#8b5cf6' },
  ];

  // Automatic ZIP / Code Analyzer Simulation
  const handleSimulateZipUpload = (presetName: string) => {
    setIsAnalyzing(true);
    setUploadedZipName(presetName);

    setTimeout(() => {
      setIsAnalyzing(false);
      let res;
      if (presetName.includes('PHP') || presetName.includes('Laravel') || presetName.includes('Pay')) {
        res = {
          language: 'PHP 8.4',
          framework: 'Laravel 11 / Vanilla MVC',
          version: 'v3.2.0',
          filesCount: 142,
          linesOfCode: 24800,
          fileSize: '14.8 MB',
          dependencies: ['guzzlehttp/guzzle', 'stripe/stripe-php', 'mpdf/mpdf', 'firebase/php-jwt'],
          difficulty: 'Enterprise' as const,
          securityScore: 99,
          qualityScore: 98,
          owaspGrade: 'Certified A+'
        };
        setDraftTitle('Vitech Enterprise PHP Script');
        setDraftCategory('php-laravel');
        setDraftPriceUSD(49);
        setDraftPriceRWF(65000);
      } else if (presetName.includes('Flutter')) {
        res = {
          language: 'Dart & TypeScript',
          framework: 'Flutter 3.24 / Node.js 20',
          version: 'v4.0.1',
          filesCount: 380,
          linesOfCode: 56400,
          fileSize: '48.2 MB',
          dependencies: ['flutter_bloc', 'google_maps_flutter', 'socket_io_client', 'geolocator'],
          difficulty: 'Enterprise' as const,
          securityScore: 98,
          qualityScore: 99,
          owaspGrade: 'Certified A+'
        };
        setDraftTitle('AfriRide Flutter VTC & MoMo App');
        setDraftCategory('mobile-flutter');
        setDraftPriceUSD(89);
        setDraftPriceRWF(118000);
      } else {
        res = {
          language: 'Python 3.12',
          framework: 'FastAPI / PyTorch',
          version: 'v1.5.0',
          filesCount: 110,
          linesOfCode: 18500,
          fileSize: '85.4 MB',
          dependencies: ['fastapi', 'torch', 'scikit-learn', 'redis'],
          difficulty: 'Advanced' as const,
          securityScore: 99,
          qualityScore: 97,
          owaspGrade: 'Certified A+'
        };
        setDraftTitle('FinGuard AI Anti-Fraud Microservice');
        setDraftCategory('python-django');
        setDraftPriceUSD(129);
        setDraftPriceRWF(172000);
      }

      setAnalysisResult(res);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    }, 1500);
  };

  const handlePublishAnalyzedProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!analysisResult) return;

    const newProd: ScriptProduct = {
      id: `script-${Date.now()}`,
      slug: draftTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title: draftTitle || 'Nouveau Script Vitech',
      tagline: 'Code source de production audité et certifié',
      description: draftDescription || 'Script haute performance prêt au déploiement immédiat.',
      fullDescription: draftDescription || 'Architecture propre, sécurisée avec injection automatique des mentions légales et intégration Mobile Money.',
      category: draftCategory,
      categoryLabel: draftCategory === 'php-laravel' ? 'PHP & Laravel' : 'Mobile Flutter',
      priceUSD: draftPriceUSD,
      priceRWF: draftPriceRWF,
      isFree: draftPriceUSD === 0,
      isPopular: false,
      isNew: true,
      isPremium: draftPriceUSD > 0,
      previewImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80'
      ],
      analysis: {
        language: analysisResult.language,
        framework: analysisResult.framework,
        version: analysisResult.version,
        fileSize: analysisResult.fileSize,
        filesCount: analysisResult.filesCount,
        linesOfCode: analysisResult.linesOfCode,
        dependenciesCount: analysisResult.dependencies.length,
        dependenciesList: analysisResult.dependencies,
        difficulty: analysisResult.difficulty,
        securityScore: analysisResult.securityScore,
        qualityScore: analysisResult.qualityScore,
        owaspCompliance: analysisResult.owaspGrade as any
      },
      tags: ['Production', 'Vitech Scripts', analysisResult.language],
      compatibility: ['Linux', 'Docker', 'cPanel', 'Cloud'],
      changelog: [{ version: analysisResult.version, date: new Date().toISOString().split('T')[0], changes: ['Publication initiale vérifiée'] }],
      documentation: {
        quickStart: 'Décompressez l archive, installez les dépendances et configurez .env.',
        requirements: ['PHP 8.2+ ou Node.js 20+'],
        installationSteps: ['1. Décompresser', '2. Configurer .env', '3. Lancer en production'],
        envVariables: ['APP_NAME="Vitech App"', 'DB_HOST=127.0.0.1']
      },
      rating: 5.0,
      reviewsCount: 1,
      reviews: [],
      likes: 1,
      dislikes: 0,
      views: 12,
      downloadsCount: 0,
      author: {
        name: 'Vitech Core Engineering',
        badge: 'Admin Author',
        avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=120&q=80',
        verified: true
      },
      sampleCodeSnippet: `<?php\n// Script initialisé automatiquement via Vitech Inspector Engine\nnamespace Vitech\\App;\n\nclass CoreController {\n    public function index() {\n        return ['status' => 'success', 'timestamp' => time()];\n    }\n}`
    };

    setProductsList([newProd, ...productsList]);
    setActiveTab('products');
    setUploadedZipName(null);
    setAnalysisResult(null);

    confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
  };

  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSentSuccess(true);
    setTimeout(() => setNewsletterSentSuccess(false), 4000);
    confetti({ particleCount: 50, spread: 50 });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-1">
            <button
              onClick={onBackToMarketplace}
              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono mb-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Retour à la Marketplace</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Cpu className="w-7 h-7 text-cyan-400" />
              <span>Tableau de Bord Super Admin Vitech Scripts</span>
            </h1>
            <p className="text-xs text-slate-400">
              Contrôle global : Analyseur automatique de ZIP, passerelles MoMo, gestion des produits et diffusion newsletter.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('analyzer')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer active:scale-95 transition-all"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Analyser &amp; Uploader un ZIP</span>
            </button>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Revenu Total (2026)</span>
            <span className="text-2xl font-black text-emerald-400 block">$48,600 USD</span>
            <span className="text-[10px] text-slate-400 font-mono">≈ 64,150,000 RWF</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Total Scripts Publiés</span>
            <span className="text-2xl font-black text-white block">{productsList.length}</span>
            <span className="text-[10px] text-cyan-400 font-mono">100% OWASP Top 10</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Transactions MoMo Rwanda</span>
            <span className="text-2xl font-black text-cyan-400 block">1,842</span>
            <span className="text-[10px] text-emerald-400 font-mono">99.8% Taux de succès</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <span className="text-xs text-slate-400 font-mono">Abonnés Newsletter</span>
            <span className="text-2xl font-black text-amber-400 block">4,280</span>
            <span className="text-[10px] text-slate-400 font-mono">Développeurs &amp; Startups</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-slate-800 flex items-center gap-2 sm:gap-6 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
          {[
            { id: 'analytics', label: 'Analytique & Revenus', icon: BarChart3 },
            { id: 'analyzer', label: 'Analyseur Automatique ZIP (IA)', icon: UploadCloud, badge: 'IA' },
            { id: 'products', label: `Gestion des Scripts (${productsList.length})`, icon: Layers },
            { id: 'momo', label: 'Passerelles Mobile Money', icon: Phone, badge: 'MTN/Airtel' },
            { id: 'newsletter', label: 'Moteur Newsletter', icon: Mail },
            { id: 'team', label: `Membres de l'Équipe (${teamList.length})`, icon: Users },
            { id: 'security', label: 'Sécurité & Audit OWASP', icon: ShieldCheck }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Monthly Revenue Chart */}
              <div className="lg:col-span-8 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white">Croissance des Ventes Mensuelles ($ USD)</h3>
                    <p className="text-[11px] text-slate-400">Transactions MTN MoMo, Airtel Money et Stripe cumulées</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    +42% ce mois
                  </span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                      <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="revenueUSD" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white">Répartition par Catégorie</h3>
                  <p className="text-[11px] text-slate-400">Volume de téléchargements</p>
                </div>

                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {categoryDistribution.map((c, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-slate-300 truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: AUTOMATIC ZIP & SCRIPT ANALYZER */}
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <span>Moteur Vitech Inspector : Analyseur Automatique de Code Source</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Déposez une archive ZIP de votre script ou application. L'IA analyse instantanément le langage, framework, dépendances, calcule le score de sécurité OWASP et le score de qualité du code.
                  </p>
                </div>
              </div>

              {/* Upload Dropzone Simulator */}
              <div className="p-8 border-2 border-dashed border-slate-700 hover:border-cyan-500/80 rounded-2xl bg-slate-950/60 text-center space-y-4 transition-all">
                <UploadCloud className="w-12 h-12 text-cyan-400 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Glissez-déposez votre archive ZIP ici</h4>
                  <p className="text-xs text-slate-500">Formats supportés : .zip, .tar.gz (Max 150 MB)</p>
                </div>

                {/* Preset Quick Buttons for Instant Simulation */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs text-slate-400 mr-2">Tester un preset d'analyse :</span>
                  <button
                    type="button"
                    onClick={() => handleSimulateZipUpload('vitechpay_fintech_laravel11.zip')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 cursor-pointer"
                  >
                    📦 vitechpay_laravel11.zip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateZipUpload('afriride_flutter_uber_momo.zip')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-slate-700 cursor-pointer"
                  >
                    📦 afriride_flutter324.zip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulateZipUpload('finguard_ai_fastapi_pytorch.zip')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 border border-slate-700 cursor-pointer"
                  >
                    📦 finguard_fastapi_ml.zip
                  </button>
                </div>
              </div>

              {isAnalyzing && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-300">
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Analyse syntaxique AST en cours pour <strong>{uploadedZipName}</strong> (détection des dépendances et vulnérabilités OWASP)...</span>
                </div>
              )}

              {/* Analysis Results Display */}
              {analysisResult && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-sm text-white">Rapport d'Analyse Validé</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {analysisResult.owaspGrade}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-slate-400">{uploadedZipName}</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block font-mono">Langage Détecté</span>
                      <span className="font-bold text-white text-sm">{analysisResult.language}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block font-mono">Framework</span>
                      <span className="font-bold text-cyan-400 text-sm">{analysisResult.framework}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block font-mono">Lignes de Code (LOC)</span>
                      <span className="font-bold text-white text-sm">{analysisResult.linesOfCode.toLocaleString()}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block font-mono">Score Sécurité</span>
                      <span className="font-bold text-emerald-400 text-sm">{analysisResult.securityScore} / 100</span>
                    </div>
                  </div>

                  {/* Form to complete publishing */}
                  <form onSubmit={handlePublishAnalyzedProduct} className="space-y-4 pt-2 border-t border-slate-800">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Compléter les informations de mise en vente</h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400">Titre du Script :</label>
                        <input
                          type="text"
                          required
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400">Prix ($ USD) :</label>
                        <input
                          type="number"
                          value={draftPriceUSD}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setDraftPriceUSD(val);
                            setDraftPriceRWF(val * 1320);
                          }}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400">Prix (RWF Mobile Money) :</label>
                        <input
                          type="number"
                          value={draftPriceRWF}
                          onChange={(e) => setDraftPriceRWF(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400">Description commerciale :</label>
                      <textarea
                        rows={2}
                        placeholder="Description attrayante pour les acheteurs..."
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white resize-none focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow active:scale-98 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Publier ce Script sur la Marketplace Vitech</span>
                    </button>
                  </form>

                </div>
              )}

            </div>

          </div>
        )}

        {/* TAB 3: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 bg-slate-950/60">
                  <tr>
                    <th className="p-4">Script / Produit</th>
                    <th className="p-4">Langage &amp; Framework</th>
                    <th className="p-4">Version</th>
                    <th className="p-4">Sécurité</th>
                    <th className="p-4">Prix USD / RWF</th>
                    <th className="p-4">Ventes</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {productsList.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.previewImage} alt="" className="w-10 h-7 rounded-lg object-cover bg-slate-950" />
                          <div>
                            <span className="font-bold text-white block">{prod.title}</span>
                            <span className="text-[10px] text-slate-500">{prod.categoryLabel}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono">{prod.analysis.language} ({prod.analysis.framework})</td>
                      <td className="p-4 font-mono text-cyan-400">{prod.analysis.version}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          OWASP {prod.analysis.securityScore}/100
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        {prod.isFree ? 'Gratuit' : `$${prod.priceUSD} (${prod.priceRWF.toLocaleString()} RWF)`}
                      </td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">{prod.downloadsCount}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setProductsList(productsList.filter(p => p.id !== prod.id))}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: MOBILE MONEY GATEWAYS */}
        {activeTab === 'momo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-3xl bg-slate-900 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">MTN Mobile Money Rwanda (MoMo API v2.1)</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    Opérationnel
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Connexion USSD Push STK active (*182#) avec vérification de signature HMAC SHA-256 sur les webhooks.
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  Subscription Key : momo_prod_84fa98...<br />
                  Callback URL : https://scripts.vitechafrica.com/api/v1/momo/callback
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-rose-400" />
                    <h3 className="font-bold text-sm text-white">Airtel Money Rwanda API</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    Opérationnel
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Paiements directs (*500#) avec réconciliation automatique et déblocage de licence instantané.
                </p>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300">
                  Client ID : airtel_rw_live_3811...<br />
                  Callback URL : https://scripts.vitechafrica.com/api/v1/airtel/callback
                </div>
              </div>
            </div>

            {/* Live Webhook Logs */}
            <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
              <h4 className="font-bold text-sm text-white">Flux des Transactions Récentes en Temps Réel</h4>
              <div className="divide-y divide-slate-800">
                {momoTransactions.map(tx => (
                  <div key={tx.id} className="py-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center font-mono font-bold text-cyan-400">
                        RW
                      </div>
                      <div>
                        <span className="font-bold text-white block">{tx.product}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{tx.phone} • {tx.provider}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-bold text-emerald-400 font-mono block">+{tx.amountRWF.toLocaleString()} RWF (${tx.amountUSD})</span>
                      <span className="text-[10px] text-slate-500">{tx.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NEWSLETTER ENGINE */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-cyan-400" />
                    <span>Moteur de Diffusion de Newsletters &amp; Alertes Promos</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Diffusez des annonces de nouveaux scripts ou des codes promos à 4,280 abonnés enregistrés.
                  </p>
                </div>
              </div>

              {newsletterSentSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Campagne envoyée avec succès à la file d'attente (Queue) !</span>
                </div>
              )}

              <form onSubmit={handleSendNewsletter} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Segment d'audience :</label>
                    <select
                      value={newsletterAudience}
                      onChange={(e) => setNewsletterAudience(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">Tous les Abonnés (4,280 inscrits)</option>
                      <option value="buyers">Clients Acheteurs Uniquement (1,842 membres)</option>
                      <option value="free_users">Utilisateurs Scripts Gratuits (2,438 membres)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Objet de l'Email :</label>
                    <input
                      type="text"
                      required
                      value={newsletterSubject}
                      onChange={(e) => setNewsletterSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Contenu du Message (HTML &amp; Markdown supporté) :</label>
                  <textarea
                    rows={6}
                    required
                    value={newsletterBody}
                    onChange={(e) => setNewsletterBody(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs resize-none focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">Désabonnement en 1 clic inclus automatiquement</span>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow cursor-pointer active:scale-95 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Lancer la Campagne Email</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: TEAM MANAGEMENT */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Membres de l'Équipe Affichés Publiquement</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamList.map(member => (
                <div key={member.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover border border-slate-700" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{member.name}</h4>
                      <span className="text-[11px] text-cyan-400 font-mono block">{member.role}</span>
                      <span className="text-[10px] text-slate-500">{member.location}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2">{member.bio}</p>

                  <div className="flex flex-wrap gap-1">
                    {member.skills.slice(0, 3).map((s, i) => (
                      <span key={i} className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SECURITY & OWASP */}
        {activeTab === 'security' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Statut de Sécurité &amp; Audit OWASP Top 10</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Protection Injection SQL (PDO Prepared) :</span>
                  <span className="text-emerald-400 font-bold font-mono">100% ACTIF</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Echappement XSS &amp; CSP Headers :</span>
                  <span className="text-emerald-400 font-bold font-mono">100% ACTIF</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Jeton CSRF &amp; Idempotence Webhooks :</span>
                  <span className="text-emerald-400 font-bold font-mono">100% ACTIF</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">Watermark &amp; Copyright Injection Auto :</span>
                  <span className="text-emerald-400 font-bold font-mono">100% ACTIF</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
