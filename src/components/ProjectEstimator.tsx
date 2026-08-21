import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Cpu, 
  Download,
  Send,
  Zap,
  Server,
  Smartphone,
  Globe,
  Layers,
  Coins,
  MapPin,
  Building2,
  CreditCard,
  FileText,
  Printer,
  ChevronDown
} from 'lucide-react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from '../context/LanguageContext';
import { useCountry } from '../context/CountryContext';
import { CountryQuoteModal } from './CountryQuoteModal';

interface ProjectEstimatorProps {
  initialServiceId?: string;
  onApplyEstimateToContact: (data: {
    projectType: string;
    features: string[];
    platforms: string[];
    sla: string;
    estimatedBudget: string;
    estimatedTimeline: string;
    countryName?: string;
    countryCurrency?: string;
  }) => void;
}

export const ProjectEstimator: React.FC<ProjectEstimatorProps> = ({
  initialServiceId,
  onApplyEstimateToContact,
}) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const { currentCountry, openCountryModal, isAutoDetected: isCountryAutoDetected } = useCountry();
  const { currency, currencyOption, formatCurrency, formatRawAmount, openConverterModal, convertFromEUR } = useCurrency();
  
  const [projectType, setProjectType] = useState<string>('web-saas');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['web']);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([
    'auth-mfa',
    'payment-africa',
    'analytics-dashboard',
  ]);
  const [slaLevel, setSlaLevel] = useState<string>('business');
  const [isFastTrack, setIsFastTrack] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiRecommendation, setAiRecommendation] = useState<any | null>(null);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialServiceId) {
      setProjectType(initialServiceId);
    }
  }, [initialServiceId]);

  const projectTypesList = [
    { id: 'web-saas', label: 'Plateforme Web & SaaS', basePriceEUR: 2800, baseWeeks: 6, icon: Globe },
    { id: 'mobile-apps', label: 'Application Mobile (iOS/Android)', basePriceEUR: 3500, baseWeeks: 8, icon: Smartphone },
    { id: 'cloud-devops', label: 'Infrastructure Cloud & Kubernetes', basePriceEUR: 2600, baseWeeks: 4, icon: Server },
    { id: 'ai-automation', label: 'IA Générative & RAG Entreprise', basePriceEUR: 4200, baseWeeks: 6, icon: Cpu },
    { id: 'cybersecurity-audit', label: 'Audit Sécurité & Pentest', basePriceEUR: 2400, baseWeeks: 3, icon: ShieldCheck },
    { id: 'ui-ux-design', label: 'UI/UX & Design System', basePriceEUR: 1800, baseWeeks: 4, icon: Layers },
  ];

  const platformsList = [
    { id: 'web', label: 'Web Responsive (Desktop & Mobile)', priceEUR: 0 },
    { id: 'ios', label: 'iOS Native / Flutter App', priceEUR: 900 },
    { id: 'android', label: 'Android Native / Flutter App', priceEUR: 800 },
    { id: 'api', label: 'API Microservices & Backend Dédié', priceEUR: 1200 },
  ];

  const featuresList = [
    { id: 'auth-mfa', label: 'Authentification Multi-Facteurs (2FA/MFA/Biométrie)', priceEUR: 450, weeks: 1 },
    { id: 'payment-africa', label: 'Passerelles Locales (Wave, Orange, M-Pesa, Stripe) & Cartes', priceEUR: 750, weeks: 1.5 },
    { id: 'analytics-dashboard', label: 'Tableau de Bord & Analytics Temps Réel', priceEUR: 650, weeks: 1 },
    { id: 'ai-integration', label: 'Moteur IA / LLM (RAG, Chatbot intelligent, OCR)', priceEUR: 1400, weeks: 2 },
    { id: 'offline-mode', label: 'Mode Hors-Ligne & Synchronisation locale (Offline-First)', priceEUR: 950, weeks: 1.5 },
    { id: 'multi-lang', label: 'Internationalisation & Multilingue (FR, EN, AR, ES, ZH)', priceEUR: 350, weeks: 0.5 },
    { id: 'cloud-security', label: 'Chiffrement AES-256 & Durcissement OWASP', priceEUR: 600, weeks: 1 },
    { id: 'realtime-collab', label: 'WebSockets & Collaboration Temps Réel', priceEUR: 850, weeks: 1.5 },
  ];

  const slaOptions = [
    { id: 'standard', label: 'Support Standard (8h/5j)', multiplier: 1.0, sub: 'Maintenance corrective & suivi' },
    { id: 'business', label: 'Support Business 24/7 & SLA 99.9%', multiplier: 1.15, sub: 'Surveillance proactive & astreinte dédiée' },
    { id: 'critical', label: 'Mission Critique & Infogérance Dédiée', multiplier: 1.30, sub: 'Intervention garantie < 15 min' },
  ];

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) 
        ? (prev.length > 1 ? prev.filter(p => p !== id) : prev)
        : [...prev, id]
    );
  };

  const toggleFeature = (id: string) => {
    setSelectedFeatures(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Calculate pricing in EUR
  const currentProjectTypeObj = projectTypesList.find(p => p.id === projectType) || projectTypesList[0];
  const basePriceEUR = currentProjectTypeObj.basePriceEUR;
  const platformsCostEUR = selectedPlatforms.reduce((acc, pId) => {
    const pObj = platformsList.find(p => p.id === pId);
    return acc + (pObj ? pObj.priceEUR : 0);
  }, 0);

  const featuresCostEUR = selectedFeatures.reduce((acc, fId) => {
    const fObj = featuresList.find(f => f.id === fId);
    return acc + (fObj ? fObj.priceEUR : 0);
  }, 0);

  let totalWeeks = currentProjectTypeObj.baseWeeks;
  selectedFeatures.forEach(fId => {
    const fObj = featuresList.find(f => f.id === fId);
    if (fObj) totalWeeks += fObj.weeks;
  });

  const slaObj = slaOptions.find(s => s.id === slaLevel) || slaOptions[1];
  let subtotalEUR = (basePriceEUR + platformsCostEUR + featuresCostEUR) * slaObj.multiplier;
  
  if (isFastTrack) {
    subtotalEUR *= 1.2;
    totalWeeks = Math.max(3, Math.round(totalWeeks * 0.7));
  }

  const roundedMinPriceEUR = Math.round(subtotalEUR * 0.9 / 50) * 50;
  const roundedMaxPriceEUR = Math.round(subtotalEUR * 1.15 / 50) * 50;
  const averagePriceEUR = Math.round((roundedMinPriceEUR + roundedMaxPriceEUR) / 2);

  // Convert to visitor's active currency
  const minConverted = convertFromEUR(roundedMinPriceEUR);
  const maxConverted = convertFromEUR(roundedMaxPriceEUR);
  const priceDisplay = `${formatRawAmount(minConverted, currency)} – ${formatRawAmount(maxConverted, currency)}`;
  const timelineDisplay = `${Math.round(totalWeeks)} à ${Math.round(totalWeeks + 2)} semaines`;

  // AI Architect Scoping Request
  const handleRequestAiScope = async () => {
    setIsAiLoading(true);
    try {
      const prompt = `Agis comme l'Architecte Logiciel Principal de V&I TECH AFRICA LTD. Analyse le projet suivant pour un client basé en ${currentCountry.name} (${currentCountry.region}) :
- Type de projet : ${currentProjectTypeObj.label}
- Plateformes cibles : ${selectedPlatforms.join(', ')}
- Modules sélectionnés : ${selectedFeatures.join(', ')}
- SLA : ${slaObj.label}
- Mode Fast-Track : ${isFastTrack ? 'Oui (-30% délais)' : 'Standard'}
- Budget estimé : ${priceDisplay}
- Hub régional de rattachement : ${currentCountry.localHub} (${currentCountry.hubCity})

Donne une recommandation d'architecture senior concise (en 3 points clés clairs) incluant la stack recommandée, les bonnes pratiques de sécurité/résilience adaptées à ${currentCountry.name}, et les jalons de livraison (Sprints).`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: prompt,
          conversationHistory: [],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiRecommendation(data.response || data.message);
      } else {
        setAiRecommendation(
          `Recommandation d'Architecture V&I TECH pour ${currentCountry.name} :\n1. Architecture Backend découplée & Microservices avec cache Redis et API Gateway haute disponibilité.\n2. Intégration optimisée des passerelles locales (${currentCountry.paymentMethods.slice(0, 2).join(', ')}) avec chiffrement AES-256.\n3. Déploiement CI/CD automatisé sous Kubernetes managé avec monitoring 24/7 supervisé par le ${currentCountry.localHub}.`
        );
      }
    } catch {
      setAiRecommendation(
        `Recommandation d'Architecture V&I TECH pour ${currentCountry.name} :\n1. Architecture Backend découplée & Microservices avec cache Redis et API Gateway haute disponibilité.\n2. Intégration optimisée des passerelles locales (${currentCountry.paymentMethods.slice(0, 2).join(', ')}) avec chiffrement AES-256.\n3. Déploiement CI/CD automatisé sous Kubernetes managé avec monitoring 24/7 supervisé par le ${currentCountry.localHub}.`
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleApplyToContact = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#3b82f6', '#10b981'],
      });
    } catch {
      // ignore
    }

    onApplyEstimateToContact({
      projectType: currentProjectTypeObj.label,
      platforms: selectedPlatforms.map(p => platformsList.find(pl => pl.id === p)?.label || p),
      features: selectedFeatures.map(f => featuresList.find(fl => fl.id === f)?.label || f),
      sla: slaObj.label,
      estimatedBudget: `${priceDisplay} (${currentCountry.name})`,
      estimatedTimeline: timelineDisplay,
      countryName: currentCountry.name,
      countryCurrency: currentCountry.currency,
    });

    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="estimator" className="py-20 bg-slate-950 relative overflow-hidden text-white">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[300px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Calculator className="w-3.5 h-3.5" />
            <span>{t('estimator.badge', 'Simulateur Transparent & Devis par Pays')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
            {t('estimator.title', 'Calculez le Budget & les Délais de Votre Futur Projet')}
          </h2>

          <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed">
            {t('estimator.subtitle', 'Obtenez une estimation budgétaire détaillée, le délai de livraison et les modalités financières adaptées précisément à votre pays et votre localisation.')}
          </p>
        </div>

        {/* VISITOR GEOLOCATION & COUNTRY SELECTOR BANNER */}
        <div className="mb-10 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950/60 to-slate-900 border border-blue-500/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-2xl shrink-0 shadow-inner">
              {currentCountry.flag}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t('estimator.countryDetected', 'Votre pays détecté')} :</span>
                </span>
                <strong className="text-white text-sm sm:text-base font-extrabold">
                  {currentCountry.name}
                </strong>
                {isCountryAutoDetected && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Auto-détecté
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Devise : <strong className="text-cyan-400 font-mono">{currentCountry.currency} ({currentCountry.currencySymbol})</strong></span>
                <span>•</span>
                <span>Hub : <strong className="text-blue-300">{currentCountry.localHub}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <button
              onClick={openCountryModal}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:border-blue-500"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t('estimator.changeCountry', 'Changer de pays / Localisation')}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Générer Devis Pays (PDF)</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Configurator (8 cols) + Result (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Project Type */}
            <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                  Étape 1 sur 4
                </span>
                <span className="text-xs text-slate-400">Architecture principale</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white">
                Quel type de système souhaitez-vous concevoir ?
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {projectTypesList.map((type) => {
                  const Icon = type.icon;
                  const isSelected = projectType === type.id;
                  return (
                    <div
                      key={type.id}
                      onClick={() => setProjectType(type.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-blue-950/70 border-cyan-500 text-white ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-950/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
                          {formatCurrency(type.basePriceEUR)}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-white">{type.label}</div>
                        <div className="text-[11px] text-slate-400 mt-1">Délai initial estimé : ~{type.baseWeeks} sem.</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Deployment Platforms */}
            <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                  Étape 2 sur 4
                </span>
                <span className="text-xs text-slate-400">Écosystèmes cibles</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white">
                Sélectionnez les plateformes de déploiement
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {platformsList.map((platform) => {
                  const isSelected = selectedPlatforms.includes(platform.id);
                  return (
                    <div
                      key={platform.id}
                      onClick={() => togglePlatform(platform.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-950/60 border-cyan-500 text-white ring-1 ring-cyan-500/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                          isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold">{platform.label}</div>
                          <div className="text-[11px] text-slate-400">
                            {platform.priceEUR === 0 ? 'Inclus de base' : `+ ${formatCurrency(platform.priceEUR)}`}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Technical Features & Modules */}
            <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                  Étape 3 sur 4
                </span>
                <span className="text-xs text-slate-400">Briques logicielles</span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white">
                Modules métiers & fonctionnalités avancées
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {featuresList.map((feat) => {
                  const isSelected = selectedFeatures.includes(feat.id);
                  return (
                    <div
                      key={feat.id}
                      onClick={() => toggleFeature(feat.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-950/30 border-emerald-500/80 text-white ring-1 ring-emerald-500/30'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start space-x-2.5">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border shrink-0 mt-0.5 ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950' : 'border-slate-700 bg-slate-900'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <div className="text-xs font-bold leading-tight">{feat.label}</div>
                          <div className="text-[11px] text-slate-400 mt-1">
                            + {formatCurrency(feat.priceEUR)} • +{feat.weeks} sem.
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: SLA & Fast Track Delivery */}
            <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
                  Étape 4 sur 4
                </span>
                <span className="text-xs text-slate-400">Niveau de Service &amp; Cadence</span>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block">
                  Niveau de Service (SLA) :
                </label>
                <div className="space-y-2">
                  {slaOptions.map((sla) => (
                    <div
                      key={sla.id}
                      onClick={() => setSlaLevel(sla.id)}
                      className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                        slaLevel === sla.id
                          ? 'bg-slate-800 border-emerald-500 text-white font-semibold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{sla.label}</span>
                        {slaLevel === sla.id && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5">{sla.sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 block">
                  Rythme de Livraison :
                </label>
                <div
                  onClick={() => setIsFastTrack(!isFastTrack)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isFastTrack
                      ? 'bg-amber-950/40 border-amber-500/80 text-amber-300 ring-1 ring-amber-500'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className={`w-4 h-4 ${isFastTrack ? 'text-amber-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold">Fast-Track Sprint Accéléré (-30% délais)</span>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isFastTrack ? 'bg-amber-500 border-amber-400 text-slate-950' : 'border-slate-700'
                    }`}>
                      {isFastTrack && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2">
                    Mobilisation d'une squad dédiée de Lead Developers en continu avec démos bi-hebdomadaires.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Live Calculated Estimate Card (4 cols) */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            <div className="rounded-3xl bg-slate-900 border border-emerald-500/40 p-6 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

              {/* Estimate Summary Header */}
              <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Devis Adapté ({currentCountry.name})
                  </span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Normes d'ingénierie &amp; devis officiel.</p>
                </div>
                <button
                  onClick={() => openConverterModal(averagePriceEUR)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 cursor-pointer"
                  title="Ouvrir le Convertisseur de Devises"
                >
                  <Coins className="w-4 h-4" />
                </button>
              </div>

              {/* Estimated Budget Box */}
              <div className="my-5 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="uppercase font-semibold">Budget Estimatif ({currentCountry.name})</span>
                  <span className="font-mono text-cyan-400 text-[11px] font-bold">{currentCountry.flag} {currencyOption.code}</span>
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono my-1 tracking-tight truncate">
                  {priceDisplay}
                </div>
                <span className="text-[10px] text-slate-500 block">
                  Paiement échelonné par Sprints validés ({currencyOption.symbol})
                </span>
              </div>

              {/* Timeline Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs mb-4">
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span>Délai Estimé :</span>
                </div>
                <span className="font-mono text-cyan-300 font-bold">{timelineDisplay}</span>
              </div>

              {/* Country Specific Hub & Payment Highlights */}
              <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs space-y-2 mb-4 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-blue-400" /> Hub Référent :
                  </span>
                  <strong className="text-white">{currentCountry.hubCity}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <CreditCard className="w-3.5 h-3.5 text-emerald-400" /> Paiement :
                  </span>
                  <span className="text-slate-200 truncate max-w-[150px]">
                    {currentCountry.paymentMethods.slice(0, 2).join(', ')}
                  </span>
                </div>
              </div>

              {/* Summary Points */}
              <div className="space-y-2 text-xs text-slate-300 mb-5">
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Périmètre :</span>
                  <span className="font-semibold text-white truncate max-w-[170px]">{currentProjectTypeObj.label}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Modules :</span>
                  <span className="font-mono text-emerald-400 font-bold">{selectedFeatures.length} fonctionnalités</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">SLA Contractuel :</span>
                  <span className="font-semibold text-white">{slaObj.label.split('(')[0]}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-slate-400">Propriété Code :</span>
                  <span className="font-semibold text-emerald-400">100% Client + NDA</span>
                </div>
              </div>

              {/* Primary Action to transfer to contact */}
              <motion.button
                id="apply-estimate-to-contact-btn"
                whileHover={{ scale: 1.025, boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                onClick={handleApplyToContact}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/25 cursor-pointer relative overflow-hidden group"
              >
                <span className="relative z-10">Valider &amp; Transférer au Formulaire</span>
                <Send className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
              </motion.button>

              {/* Official Country Quote PDF Modal Trigger */}
              <div className="mt-2.5">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setIsQuoteModalOpen(true)}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Télécharger le Devis Officiel {currentCountry.name} (PDF)</span>
                </motion.button>
              </div>

              {/* AI Architecture recommendation Trigger */}
              <div className="mt-2.5">
                <motion.button
                  id="ai-architecture-recommendation-btn"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleRequestAiScope}
                  disabled={isAiLoading}
                  className="w-full py-2.5 px-3 rounded-xl bg-cyan-950/40 hover:bg-cyan-900/40 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center justify-center space-x-2 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${isAiLoading ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isAiLoading ? 'Analyse par Gemini AI en cours...' : 'Générer l\'Architecture par IA'}</span>
                </motion.button>
              </div>

              {/* AI Recommendation display */}
              {aiRecommendation && (
                <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-cyan-500/40 text-xs space-y-2 animate-in fade-in">
                  <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Recommandation Architecte V&I TECH ({currentCountry.name}) :</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{aiRecommendation}</p>
                </div>
              )}

            </div>

            {/* Currency Converter shortcut widget */}
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-cyan-400" />
                <span>Facturation multidevise : FCFA, EUR, USD, GNF, RWF...</span>
              </div>
              <button
                onClick={() => openConverterModal(averagePriceEUR)}
                className="text-cyan-400 hover:text-cyan-300 font-bold underline cursor-pointer"
              >
                Convertir
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Country Official Quote Modal */}
      <CountryQuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        estimatorState={{
          serviceName: currentProjectTypeObj.label,
          platforms: selectedPlatforms.map(p => platformsList.find(pl => pl.id === p)?.label || p),
          features: selectedFeatures.map(f => featuresList.find(fl => fl.id === f)?.label || f),
          slaOption: slaObj.label,
          totalEUR: averagePriceEUR,
          timelineWeeks: Math.round(totalWeeks),
          clientName: user?.displayName || '',
          clientEmail: user?.email || '',
        }}
        onTransferToContact={handleApplyToContact}
      />

    </section>
  );
};
