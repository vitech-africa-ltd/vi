import React, { useState, useRef } from 'react';
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
  Settings,
  FileCheck,
  FolderTree,
  ListTree,
  Edit3,
  X,
  Tag,
  Megaphone,
  Check,
  RefreshCw,
  Award,
  Save,
  Receipt,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ScriptProduct } from '../../data/scriptsData';
import { TeamMember } from '../../data/teamData';
import { scanZipArchive, generateMockZipForTesting, ZipScanResult } from '../../services/zipScannerService';
import { LiveVisitorCounterPro } from './admin/LiveVisitorCounterPro';
import { DailyDownloadTrendsChart } from './admin/DailyDownloadTrendsChart';
import { CategoryPerformanceChart } from './admin/CategoryPerformanceChart';
import { SecurityScanPassRateChart } from './admin/SecurityScanPassRateChart';
import { MonthlyInvoicingRevenueChart } from './admin/MonthlyInvoicingRevenueChart';
import { AiChatbotUsageStatsWidget } from './admin/AiChatbotUsageStatsWidget';
import { AdminCurrencyBar } from './admin/AdminCurrencyBar';
import { AdminInvoicingTab } from '../admin/AdminInvoicingTab';
import { useSiteData } from '../../context/SiteDataContext';

interface ScriptsAdminDashboardProps {
  onBackToMarketplace: () => void;
}

export const ScriptsAdminDashboard: React.FC<ScriptsAdminDashboardProps> = ({
  onBackToMarketplace
}) => {
  const { 
    scriptProducts, 
    addScriptProduct, 
    updateScriptProduct, 
    deleteScriptProduct,
    teamMembers,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    liveAnnouncement,
    updateLiveAnnouncement,
    isSaving,
    saveStatus
  } = useSiteData();

  const [activeTab, setActiveTab] = useState<'analytics' | 'ai_stats' | 'products' | 'analyzer' | 'invoicing' | 'announcement' | 'momo' | 'newsletter' | 'team' | 'security'>('analytics');

  // Automated Script Analyzer State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedZipName, setUploadedZipName] = useState<string | null>(null);
  const [scanReport, setScanReport] = useState<ZipScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New Product Draft Form (from Analyzer or Manual)
  const [draftTitle, setDraftTitle] = useState('');
  const [draftPriceUSD, setDraftPriceUSD] = useState(49);
  const [draftPriceRWF, setDraftPriceRWF] = useState(65000);
  const [draftCategory, setDraftCategory] = useState<'php-laravel' | 'node-react' | 'mobile-flutter' | 'python-django' | 'wordpress-plugins' | 'ui-templates' | 'fullstack-saas'>('php-laravel');
  const [draftDescription, setDraftDescription] = useState('');

  // Manual Product Creation / Editing Modal
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<ScriptProduct> | null>(null);
  const [isNewProductMode, setIsNewProductMode] = useState(false);

  // Team Member Creation / Editing Modal
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isNewTeamMode, setIsNewTeamMode] = useState(false);

  // Announcement Form State
  const [announcementForm, setAnnouncementForm] = useState(liveAnnouncement);
  const [announcementSavedSuccess, setAnnouncementSavedSuccess] = useState(false);

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

  // Handle Real ZIP File Upload for In-Memory Scan
  const handleZipFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setUploadedZipName(file.name);
    setIsAnalyzing(true);
    setScanReport(null);

    try {
      const result = await scanZipArchive(file);
      setScanReport(result);

      // Auto-populate draft product info
      const cleanTitle = file.name.replace(/\.zip$/i, '').replace(/[-_]/g, ' ');
      setDraftTitle(`Vitech ${cleanTitle.charAt(0).toUpperCase() + cleanTitle.slice(1)}`);
      setDraftDescription(`Architecture logicielle professionnelle basée sur ${result.framework} (${result.language}). Inclut ${result.filesCount} fichiers sources audités et certifiés conformes OWASP.`);
      
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Scan error:', err);
      alert('Erreur lors du scan du fichier ZIP. Veuillez vérifier le fichier.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Quick Preset Simulator
  const handleSimulatePreset = async (presetType: 'laravel' | 'flutter' | 'fastapi', filename: string) => {
    setUploadedZipName(filename);
    setIsAnalyzing(true);
    setScanReport(null);

    try {
      const blob = await generateMockZipForTesting(presetType);
      const file = new File([blob], filename, { type: 'application/zip' });
      const result = await scanZipArchive(file);
      setScanReport(result);

      if (presetType === 'laravel') {
        setDraftTitle('VitechPay - Suite Fintech Laravel 11 & MTN MoMo');
        setDraftPriceUSD(49);
        setDraftPriceRWF(65000);
        setDraftCategory('php-laravel');
        setDraftDescription('Passerelle de paiement unifiée MTN Mobile Money Rwanda, Airtel Money et cartes bancaires avec webhooks sécurisés HMAC SHA256.');
      } else if (presetType === 'flutter') {
        setDraftTitle('AfriRide - Application VTC & Taxi Flutter 3.24');
        setDraftPriceUSD(89);
        setDraftPriceRWF(118000);
        setDraftCategory('mobile-flutter');
        setDraftDescription('Application mobile Flutter cross-platform pour VTC avec géolocalisation en temps réel, calcul d itinéraire et paiement MoMo.');
      } else {
        setDraftTitle('FinGuard AI - Détection de Fraude FastAPI & PyTorch');
        setDraftPriceUSD(99);
        setDraftPriceRWF(132000);
        setDraftCategory('python-django');
        setDraftDescription('Moteur de scoring de transactions financières en temps réel avec modèles ML conteneurisés Docker.');
      }

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Preset simulation error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Publish from Analyzer directly to global CMS & visitor marketplace
  const handlePublishAnalyzedProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanReport) return;

    const newProd: ScriptProduct = {
      id: `script-${Date.now()}`,
      slug: draftTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      title: draftTitle,
      tagline: `${scanReport.framework} • Score Sécurité ${scanReport.securityScore}/100`,
      description: draftDescription,
      fullDescription: `${draftDescription}\n\nArchitecture certifiée ${scanReport.owaspCompliance}. Livré avec documentation complète d installation, scripts de migration et tests unitaires.`,
      category: draftCategory,
      categoryLabel: draftCategory === 'php-laravel' ? 'PHP & Laravel Fintech' : draftCategory === 'mobile-flutter' ? 'Flutter & Mobile Apps' : 'Python & AI ML',
      priceUSD: draftPriceUSD,
      priceRWF: draftPriceRWF,
      isFree: draftPriceUSD === 0,
      isPopular: true,
      isNew: true,
      isPremium: draftPriceUSD > 40,
      previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'
      ],
      liveDemoUrl: 'https://demo.vitechafrica.com',
      analysis: {
        language: scanReport.language,
        framework: scanReport.framework,
        version: scanReport.frameworkVersion,
        fileSize: scanReport.fileSize,
        filesCount: scanReport.filesCount,
        linesOfCode: scanReport.linesOfCode,
        dependenciesCount: scanReport.dependencies.length,
        dependenciesList: scanReport.dependencies,
        difficulty: 'Intermediate',
        securityScore: scanReport.securityScore,
        qualityScore: 98,
        owaspCompliance: scanReport.owaspCompliance,
        testedPHPVersion: '8.4',
        testedNodeVersion: '20.x'
      },
      tags: [scanReport.language, scanReport.framework, 'Fintech', 'MTN MoMo', 'OWASP Certified'],
      compatibility: ['PHP 8.2+', 'Node 18+', 'MySQL 8', 'PostgreSQL 15', 'Docker'],
      changelog: [
        { version: '1.0.0', date: 'Aujourd\'hui', changes: ['Publication initiale vérifiée par Vitech Scanner'] }
      ],
      documentation: {
        quickStart: 'Décompressez le fichier ZIP et exécutez composer install ou npm install.',
        requirements: ['Git', 'Docker ou PHP/Node', 'Clés API MTN MoMo'],
        installationSteps: ['1. Cloner ou décompresser l archive', '2. Configurer le fichier .env', '3. Lancer les migrations'],
        envVariables: ['MOMO_SUBSCRIPTION_KEY=', 'MOMO_API_USER=', 'MOMO_TARGET_ENV=production']
      },
      rating: 5.0,
      reviewsCount: 1,
      reviews: [],
      likes: 12,
      dislikes: 0,
      views: 340,
      downloadsCount: 0,
      author: {
        name: 'Vitech Core Engineering',
        badge: 'Core Contributor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        verified: true
      },
      sampleCodeSnippet: '// Vitech Secure Transaction Engine\nconst payment = await vitechPay.initiateMomo({\n  phone: "250788123456",\n  amount: 65000,\n  currency: "RWF"\n});'
    };

    await addScriptProduct(newProd);

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 }
    });

    setScanReport(null);
    setUploadedZipName(null);
    setActiveTab('products');
  };

  // Open Manual Product Creator Modal
  const handleOpenNewProductModal = () => {
    setIsNewProductMode(true);
    setEditingProduct({
      id: `script-${Date.now()}`,
      slug: '',
      title: '',
      tagline: '',
      description: '',
      fullDescription: '',
      category: 'php-laravel',
      categoryLabel: 'PHP & Laravel Fintech',
      priceUSD: 49,
      priceRWF: 65000,
      isFree: false,
      isPopular: true,
      isNew: true,
      isPremium: true,
      previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      screenshots: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80'],
      liveDemoUrl: 'https://demo.vitechafrica.com',
      analysis: {
        language: 'PHP',
        framework: 'Laravel 11',
        version: '11.x',
        fileSize: '4.2 MB',
        filesCount: 128,
        linesOfCode: 14500,
        dependenciesCount: 18,
        dependenciesList: ['guzzlehttp/guzzle', 'ramsey/uuid', 'barryvdh/laravel-dompdf'],
        difficulty: 'Intermediate',
        securityScore: 99,
        qualityScore: 98,
        owaspCompliance: 'Certified A+'
      },
      tags: ['PHP', 'Laravel', 'Fintech', 'MTN MoMo'],
      compatibility: ['PHP 8.2+', 'MySQL 8', 'Docker'],
      changelog: [{ version: '1.0.0', date: new Date().toLocaleDateString('fr-FR'), changes: ['Version initiale'] }],
      documentation: {
        quickStart: 'composer install && cp .env.example .env',
        requirements: ['PHP 8.2+', 'Composer', 'MySQL'],
        installationSteps: ['1. Décompresser', '2. cp .env.example .env', '3. php artisan key:generate', '4. php artisan migrate'],
        envVariables: ['DB_DATABASE=vitech', 'MOMO_KEY=xxx']
      },
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      likes: 8,
      dislikes: 0,
      views: 120,
      downloadsCount: 0,
      author: {
        name: 'Vitech Core Engineering',
        badge: 'Core Contributor',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        verified: true
      },
      sampleCodeSnippet: '// Vitech Standard API Sample'
    });
    setIsProductModalOpen(true);
  };

  // Open Edit Product Modal
  const handleOpenEditProduct = (prod: ScriptProduct) => {
    setIsNewProductMode(false);
    setEditingProduct({ ...prod });
    setIsProductModalOpen(true);
  };

  // Save Product (Manual or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.title) return;

    const finalProduct: ScriptProduct = {
      ...(editingProduct as ScriptProduct),
      slug: editingProduct.slug || editingProduct.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      categoryLabel: editingProduct.category === 'php-laravel' ? 'PHP & Laravel Fintech' :
                     editingProduct.category === 'node-react' ? 'Node.js & React Fullstack' :
                     editingProduct.category === 'mobile-flutter' ? 'Flutter Mobile Apps' :
                     editingProduct.category === 'python-django' ? 'Python & AI ML' :
                     editingProduct.category === 'fullstack-saas' ? 'Fullstack SaaS Boilerplate' : 'Templates & Scripts'
    };

    if (isNewProductMode) {
      await addScriptProduct(finalProduct);
    } else {
      await updateScriptProduct(finalProduct);
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  // Open Team Member Modal
  const handleOpenNewTeamModal = () => {
    setIsNewTeamMode(true);
    setEditingMember({
      id: `member-${Date.now()}`,
      name: '',
      role: '',
      department: 'Software Engineering',
      bio: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      location: 'Kigali, Rwanda',
      skills: ['TypeScript', 'Node.js', 'DevOps'],
      socialLinks: {
        linkedin: 'https://linkedin.com',
        github: 'https://github.com',
        twitter: 'https://twitter.com',
        email: 'contact.vitechdev@gmail.com'
      },
      highlightQuote: '',
      featured: true
    });
    setIsTeamModalOpen(true);
  };

  const handleOpenEditTeam = (member: TeamMember) => {
    setIsNewTeamMode(false);
    setEditingMember({ ...member });
    setIsTeamModalOpen(true);
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name) return;

    const finalMember: TeamMember = {
      ...(editingMember as TeamMember),
      skills: Array.isArray(editingMember.skills) ? editingMember.skills : 
              typeof editingMember.skills === 'string' ? (editingMember.skills as string).split(',').map(s => s.trim()).filter(Boolean) : []
    };

    if (isNewTeamMode) {
      await addTeamMember(finalMember);
    } else {
      await updateTeamMember(finalMember);
    }

    setIsTeamModalOpen(false);
    setEditingMember(null);
  };

  // Save Announcement Form
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateLiveAnnouncement(announcementForm);
    setAnnouncementSavedSuccess(true);
    setTimeout(() => setAnnouncementSavedSuccess(false), 3000);
  };

  // Send Newsletter Campaign
  const handleSendNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterSentSuccess(true);
    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });
    setTimeout(() => {
      setNewsletterSentSuccess(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      
      {/* Top Header Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur sticky top-0 z-30 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToMarketplace}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Retour Marketplace</span>
          </button>
          <div>
            <h1 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              <span>Vitech Scripts Admin Studio</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PRO MAX
              </span>
            </h1>
            <span className="text-[11px] text-slate-400">
              Contrôle en temps réel du catalogue, des membres d'équipe, du scanner ZIP AST et des bannières visiteurs.
            </span>
          </div>
        </div>

        {/* Currency Switcher & Global Save Indicator */}
        <div className="flex flex-wrap items-center gap-3">
          <AdminCurrencyBar variant="header" />
          
          {saveStatus && (
            <span className="text-xs font-mono px-3 py-1 rounded-lg bg-emerald-950/80 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 animate-pulse">
              <CheckCircle2 className="w-3.5 h-3.5" />
              {saveStatus}
            </span>
          )}
          <button
            onClick={handleOpenNewProductModal}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Script</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex overflow-x-auto gap-2 border-b border-slate-800 pb-3 no-scrollbar text-xs font-semibold">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'analytics'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Statistiques &amp; Visiteurs Live</span>
          </button>

          <button
            onClick={() => setActiveTab('ai_stats')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'ai_stats'
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-slate-950 font-bold shadow-lg'
                : 'bg-slate-900 text-cyan-400 hover:text-white hover:bg-slate-800 border border-cyan-500/20'
            }`}
          >
            <Bot className="w-4 h-4 text-cyan-300" />
            <span>Stats IA &amp; Économies Temps</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-cyan-950 text-cyan-300 font-mono">
              Live
            </span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'products'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Catalogue Scripts ({scriptProducts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analyzer')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'analyzer'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Scanner ZIP Automatisé (AST)</span>
          </button>

          <button
            onClick={() => setActiveTab('announcement')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'announcement'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Bannière Promo Visiteurs</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'team'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Équipe &amp; Fondateurs ({teamMembers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('momo')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'momo'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Passerelles MoMo Rwanda</span>
          </button>

          <button
            onClick={() => setActiveTab('invoicing')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'invoicing'
                ? 'bg-amber-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Facturation &amp; Devis Clients</span>
          </button>

          <button
            onClick={() => setActiveTab('newsletter')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'newsletter'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Campagnes Email</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-2 ${
              activeTab === 'security'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Audit OWASP Top 10</span>
          </button>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">

        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <LiveVisitorCounterPro />
            <AiChatbotUsageStatsWidget />
            <AdminCurrencyBar variant="full" />
            <MonthlyInvoicingRevenueChart />
            <DailyDownloadTrendsChart />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryPerformanceChart />
              <SecurityScanPassRateChart />
            </div>
          </div>
        )}

        {/* TAB 1.5: AI STATS & SUPPORT SAVINGS (Dedicated View) */}
        {activeTab === 'ai_stats' && (
          <div className="space-y-6">
            <AiChatbotUsageStatsWidget />
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOG */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-sm text-white">Gestion du Catalogue en Temps Réel</span>
                <span className="text-xs text-slate-400 font-mono">({scriptProducts.length} scripts actifs)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenNewProductModal}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Script (Formulaire Complet)</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-900 shadow-xl">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400 bg-slate-950/60">
                  <tr>
                    <th className="p-4">Script / Produit</th>
                    <th className="p-4">Langage &amp; Framework</th>
                    <th className="p-4">Sécurité</th>
                    <th className="p-4">Prix USD / RWF</th>
                    <th className="p-4">Téléchargements</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {scriptProducts.map((prod) => (
                    <tr key={prod.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={prod.previewImage} alt="" className="w-12 h-9 rounded-lg object-cover bg-slate-950 border border-slate-800" />
                          <div>
                            <span className="font-bold text-white block">{prod.title}</span>
                            <span className="text-[10px] text-slate-500">{prod.categoryLabel}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono">
                        <span className="text-white font-bold">{prod.analysis.language}</span>
                        <span className="text-slate-400 block text-[11px]">{prod.analysis.framework}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                          {prod.analysis.owaspCompliance} ({prod.analysis.securityScore}/100)
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-white">
                        {prod.isFree ? (
                          <span className="text-emerald-400">Gratuit</span>
                        ) : (
                          <span>${prod.priceUSD} <span className="text-slate-400 font-normal">({prod.priceRWF.toLocaleString()} RWF)</span></span>
                        )}
                      </td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">{prod.downloadsCount}</td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-cyan-950 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                          title="Modifier le Script"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Supprimer définitivement "${prod.title}" ?`)) {
                              deleteScriptProduct(prod.id);
                            }
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
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

        {/* TAB 3: AUTOMATED ZIP SCANNER (AST) */}
        {activeTab === 'analyzer' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <span>Scanner de Scripts ZIP Automatisé (In-Memory AST Parser)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Déposez une archive ZIP de projet logiciel (Laravel, Flutter, Django, Node.js, React). Notre moteur extrait la structure de fichiers, calcule le nombre de lignes de code (LOC), audite les dépendances et génère la fiche de métadonnées pour la marketplace.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-cyan-500 bg-slate-950/60 text-center space-y-4 transition-all">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleZipFileChange}
                  accept=".zip,application/zip"
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold text-white">
                    Glissez-déposez votre archive ZIP ici ou cliquez pour parcourir
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono">
                    Supporte .zip jusqu'à 150 MB (Analyse mémoire sans envoi externe)
                  </p>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-2 cursor-pointer shadow transition-all active:scale-95"
                  >
                    <FileCode className="w-4 h-4" />
                    <span>Sélectionner un fichier ZIP local</span>
                  </button>
                </div>

                {/* Preset Quick Buttons */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-center gap-2">
                  <span className="text-xs text-slate-400 mr-2">Ou tester un échantillon :</span>
                  <button
                    type="button"
                    onClick={() => handleSimulatePreset('laravel', 'vitechpay_fintech_laravel11.zip')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-300 border border-slate-700 cursor-pointer transition-colors"
                  >
                    📦 vitechpay_laravel11.zip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePreset('flutter', 'afriride_flutter_uber_momo.zip')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-emerald-300 border border-slate-700 cursor-pointer transition-colors"
                  >
                    📦 afriride_flutter324.zip
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSimulatePreset('fastapi', 'finguard_ai_fastapi_pytorch.zip')}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-indigo-300 border border-slate-700 cursor-pointer transition-colors"
                  >
                    📦 finguard_fastapi_ml.zip
                  </button>
                </div>
              </div>

              {isAnalyzing && (
                <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-300 animate-pulse">
                  <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Analyse syntaxique AST en cours pour <strong>{uploadedZipName}</strong>...</span>
                </div>
              )}

              {/* Analysis Results Display */}
              {scanReport && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-5 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <h4 className="font-bold text-sm text-white">Rapport d'Audit Validé avec Succès</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                        {scanReport.owaspCompliance}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                      {uploadedZipName} ({scanReport.fileSize})
                    </span>
                  </div>

                  {/* Top KPIs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block font-mono text-[11px]">Langage Principal</span>
                      <span className="font-bold text-white text-sm">{scanReport.language}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block font-mono text-[11px]">Framework / Stack</span>
                      <span className="font-bold text-cyan-400 text-sm">{scanReport.framework}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block font-mono text-[11px]">Fichiers &amp; LOC</span>
                      <span className="font-bold text-white text-sm">{scanReport.filesCount} fichiers ({scanReport.linesOfCode.toLocaleString()} LOC)</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-slate-500 block font-mono text-[11px]">Score Sécurité OWASP</span>
                      <span className="font-bold text-emerald-400 text-sm">{scanReport.securityScore} / 100</span>
                    </div>
                  </div>

                  {/* Form to complete publishing */}
                  <form onSubmit={handlePublishAnalyzedProduct} className="space-y-4 pt-2 border-t border-slate-800">
                    <h5 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">Mettre ce Script en Ligne sur la Marketplace</h5>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-slate-400">Titre Commercial :</label>
                        <input
                          type="text"
                          required
                          value={draftTitle}
                          onChange={(e) => setDraftTitle(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-semibold"
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
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-slate-400">Prix MoMo (RWF) :</label>
                        <input
                          type="number"
                          value={draftPriceRWF}
                          onChange={(e) => setDraftPriceRWF(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-slate-400">Description :</label>
                      <textarea
                        rows={2}
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                        className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-white resize-none focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-98 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Publier ce Script Directement sur la Marketplace Visiteurs</span>
                    </button>
                  </form>

                </div>
              )}

            </div>
          </div>
        )}

        {/* TAB 4: LIVE ANNOUNCEMENT & PROMO BANNER CMS */}
        {activeTab === 'announcement' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-cyan-400" />
                    <span>Bannière Promo &amp; Mises à Jour en Temps Réel pour les Visiteurs</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Cette alerte s'affiche en haut de page pour tous les visiteurs du site dès que vous la publiez.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={announcementForm.enabled}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, enabled: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                  <span className="text-xs font-semibold text-white">
                    {announcementForm.enabled ? 'Active (Visible Visiteurs)' : 'Désactivée'}
                  </span>
                </div>
              </div>

              {announcementSavedSuccess && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bannière mise à jour et diffusée en direct à tous les visiteurs !</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSaveAnnouncement} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Badge / Événement :</label>
                    <input
                      type="text"
                      value={announcementForm.badge}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, badge: e.target.value })}
                      placeholder="ex: 🚀 VITECH 2026"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-semibold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Code Promo (Optionnel) :</label>
                    <input
                      type="text"
                      value={announcementForm.couponCode || ''}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, couponCode: e.target.value })}
                      placeholder="ex: KIGALI2026"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono font-bold uppercase"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Thème Couleur :</label>
                    <select
                      value={announcementForm.theme}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, theme: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="emerald">Émeraude (Fintech &amp; Pro)</option>
                      <option value="cyan">Cyan (Tech &amp; IA)</option>
                      <option value="amber">Ambre (Promo Flash)</option>
                      <option value="purple">Violet (Nouveautés Exclusives)</option>
                      <option value="rose">Rose (Offre Spéciale)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Texte du Message Annonce :</label>
                  <input
                    type="text"
                    required
                    value={announcementForm.message}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                    placeholder="Message clair et percutant..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Texte du Bouton CTA :</label>
                    <input
                      type="text"
                      value={announcementForm.linkText || ''}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, linkText: e.target.value })}
                      placeholder="ex: Découvrir les Scripts"
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Page Cible :</label>
                    <select
                      value={announcementForm.targetView || 'scripts'}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, targetView: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="scripts">Marketplace Scripts (/scripts)</option>
                      <option value="services">Services Numériques (/services)</option>
                      <option value="estimator">Simulateur de Devis (/estimator)</option>
                      <option value="contact">Formulaire de Contact (/contact)</option>
                      <option value="team">Équipe Vitech (/team)</option>
                      <option value="portfolio">Études de Cas (/portfolio)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Diffuser la Mise à Jour aux Visiteurs</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: TEAM MANAGEMENT */}
        {activeTab === 'team' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-amber-400" />
                  <span>Gestion des Membres de l'Équipe &amp; Fondateurs</span>
                </h3>
                <span className="text-xs text-slate-400">
                  Ces profils s'affichent publiquement sur la page /team et dans les fiches auteurs des scripts.
                </span>
              </div>

              <button
                onClick={handleOpenNewTeamModal}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Membre / Fondateur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img src={member.avatar} alt={member.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700" />
                      <div>
                        <h4 className="font-bold text-base text-white">{member.name}</h4>
                        <span className="text-xs text-amber-400 font-mono block font-semibold">{member.role}</span>
                        <span className="text-[10px] text-slate-500">{member.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">{member.bio}</p>

                    {member.highlightQuote && (
                      <blockquote className="p-2.5 rounded-xl bg-slate-950 text-[11px] italic text-slate-400 border border-slate-800">
                        "{member.highlightQuote}"
                      </blockquote>
                    )}

                    <div className="flex flex-wrap gap-1">
                      {member.skills.slice(0, 4).map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-lg text-[10px] font-mono bg-slate-950 text-slate-300 border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-mono text-slate-500">{member.department}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditTeam(member)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white cursor-pointer"
                        title="Modifier"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Supprimer ${member.name} ?`)) {
                            deleteTeamMember(member.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 cursor-pointer"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: MOMO GATEWAYS */}
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

            {/* Transactions Log */}
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

        {/* TAB 7: NEWSLETTER */}
        {activeTab === 'newsletter' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div>
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-400" />
                  <span>Moteur de Diffusion de Newsletters &amp; Alertes Promos</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Diffusez des annonces de nouveaux scripts ou des codes promos à 4,280 abonnés enregistrés.
                </p>
              </div>

              {newsletterSentSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Campagne envoyée avec succès à la file d'attente !</span>
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
                  <label className="text-slate-400 font-medium">Contenu du Message :</label>
                  <textarea
                    rows={6}
                    required
                    value={newsletterBody}
                    onChange={(e) => setNewsletterBody(e.target.value)}
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs resize-none focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-slate-500 font-mono">Désabonnement en 1 clic inclus</span>
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

        {/* TAB 8: INVOICING */}
        {activeTab === 'invoicing' && (
          <div className="space-y-6">
            <AdminInvoicingTab />
          </div>
        )}

        {/* TAB 9: SECURITY */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <SecurityScanPassRateChart />
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Statut des Modules de Sécurité &amp; Audit OWASP Top 10</span>
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

      {/* MODAL: SCRIPT PRODUCT FORM (CREATE / EDIT) */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FileCode className="w-5 h-5 text-cyan-400" />
                <span>{isNewProductMode ? 'Créer un Nouveau Script Logiciel' : 'Modifier le Script'}</span>
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Titre du Script :</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.title || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Catégorie :</label>
                  <select
                    value={editingProduct.category || 'php-laravel'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="php-laravel">PHP &amp; Laravel Fintech</option>
                    <option value="node-react">Node.js &amp; React Fullstack</option>
                    <option value="mobile-flutter">Flutter &amp; Mobile Apps</option>
                    <option value="python-django">Python &amp; Django / AI ML</option>
                    <option value="fullstack-saas">Fullstack SaaS Boilerplate</option>
                    <option value="ui-templates">UI Templates &amp; Dashboard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Prix ($ USD) :</label>
                  <input
                    type="number"
                    value={editingProduct.priceUSD || 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        priceUSD: val,
                        priceRWF: val * 1320,
                        isFree: val === 0
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Prix MoMo (RWF) :</label>
                  <input
                    type="number"
                    value={editingProduct.priceRWF || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, priceRWF: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Score Sécurité OWASP (0-100) :</label>
                  <input
                    type="number"
                    value={editingProduct.analysis?.securityScore || 99}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      analysis: {
                        ...(editingProduct.analysis as any),
                        securityScore: Number(e.target.value)
                      }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 font-mono font-bold focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Description Courte :</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Image de Preview (URL) :</label>
                  <input
                    type="text"
                    value={editingProduct.previewImage || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, previewImage: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Lien Démo Live (URL) :</label>
                  <input
                    type="text"
                    value={editingProduct.liveDemoUrl || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, liveDemoUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow"
                >
                  Enregistrer &amp; Synchroniser
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TEAM MEMBER FORM (CREATE / EDIT) */}
      {isTeamModalOpen && editingMember && (
        <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-amber-400" />
                <span>{isNewTeamMode ? 'Ajouter un Membre de l\'Équipe' : 'Modifier le Profil'}</span>
              </h3>
              <button
                onClick={() => setIsTeamModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTeamMember} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Nom Complet :</label>
                  <input
                    type="text"
                    required
                    value={editingMember.name || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Rôle / Titre :</label>
                  <input
                    type="text"
                    required
                    value={editingMember.role || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
                    placeholder="ex: Co-Founder & CTO"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 font-semibold focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Département :</label>
                  <input
                    type="text"
                    value={editingMember.department || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Localisation :</label>
                  <input
                    type="text"
                    value={editingMember.location || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, location: e.target.value })}
                    placeholder="ex: Kigali, Rwanda"
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Biographie Professionnelle :</label>
                <textarea
                  rows={3}
                  value={editingMember.bio || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, bio: e.target.value })}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-white resize-none focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-medium">Citation / Devise :</label>
                <input
                  type="text"
                  value={editingMember.highlightQuote || ''}
                  onChange={(e) => setEditingMember({ ...editingMember, highlightQuote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Avatar URL :</label>
                  <input
                    type="text"
                    value={editingMember.avatar || ''}
                    onChange={(e) => setEditingMember({ ...editingMember, avatar: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-medium">Email Direct :</label>
                  <input
                    type="email"
                    value={editingMember.socialLinks?.email || ''}
                    onChange={(e) => setEditingMember({
                      ...editingMember,
                      socialLinks: { ...(editingMember.socialLinks || {}), email: e.target.value }
                    })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsTeamModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
