import React, { useState, useEffect } from 'react';
import { useSiteData } from '../../context/SiteDataContext';
import { GoogleAdsConfig, AdsConversionEventType } from '../../types';
import { 
  trackGoogleAdsConversion, 
  generateAdsTxtContent, 
  downloadAdsTxtFile 
} from '../../services/googleAdsService';
import { 
  Megaphone, 
  Target, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Copy, 
  Download, 
  ExternalLink, 
  AlertTriangle, 
  HelpCircle, 
  RefreshCw, 
  Play, 
  ShieldCheck, 
  Code2, 
  BarChart3,
  DollarSign,
  Info
} from 'lucide-react';

export const AdminGoogleAdsTab: React.FC = () => {
  const { googleAdsConfig, updateGoogleAdsConfig, isSaving, saveStatus } = useSiteData();

  // Local state for editing form
  const [formData, setFormData] = useState<GoogleAdsConfig>(googleAdsConfig);
  const [copiedAdsTxt, setCopiedAdsTxt] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Conversion test simulation state
  const [simulatedEventType, setSimulatedEventType] = useState<AdsConversionEventType>('inquiry');
  const [simulatedValue, setSimulatedValue] = useState<number>(1500);
  const [simulatedCurrency, setSimulatedCurrency] = useState<string>('EUR');
  const [lastTriggeredLog, setLastTriggeredLog] = useState<{
    time: string;
    eventType: string;
    sendTo: string;
    payload: any;
  } | null>(null);

  // Synchronize local form when global config changes
  useEffect(() => {
    if (googleAdsConfig) {
      setFormData(googleAdsConfig);
    }
  }, [googleAdsConfig]);

  // Listen for live conversion events fired across the app
  useEffect(() => {
    const handleConversionEvent = (e: Event) => {
      const customEvent = e as CustomEvent<any>;
      if (customEvent.detail) {
        setLastTriggeredLog({
          time: customEvent.detail.timestamp || new Date().toLocaleTimeString(),
          eventType: customEvent.detail.eventType,
          sendTo: customEvent.detail.sendTo,
          payload: customEvent.detail.payload,
        });
      }
    };

    window.addEventListener('vitech_ads_conversion', handleConversionEvent);
    return () => {
      window.removeEventListener('vitech_ads_conversion', handleConversionEvent);
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateGoogleAdsConfig(formData);
    if (success) {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    }
  };

  const handleCopyAdsTxt = () => {
    const content = generateAdsTxtContent(formData.adSensePublisherId);
    navigator.clipboard.writeText(content);
    setCopiedAdsTxt(true);
    setTimeout(() => setCopiedAdsTxt(false), 2500);
  };

  const handleTriggerTestConversion = () => {
    trackGoogleAdsConversion(simulatedEventType, {
      value: simulatedValue,
      currency: simulatedCurrency,
      transactionId: `TEST-${Date.now().toString().slice(-6)}`,
    });
  };

  return (
    <div className="space-y-8 animate-fadeIn text-white">
      {/* Top Banner & Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/70 to-slate-900 border border-blue-500/30 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-blue-500/30">
              <Megaphone className="w-3.5 h-3.5" />
              <span>Marketing SEA & Régie Publicitaire</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Google Ads (Acquisition & Conversions) & Google AdSense
            </h2>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Configurez vos balises Google Ads (campagnes de recherche & retargeting) pour mesurer 
              vos prospects qualifiés, et activez la monétisation Google AdSense sur le blog technologique et la marketplace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Modifications Sauvegardées !</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer la Configuration</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Real-Time Status Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Google Ads SEA :</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              formData.adsConversionEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
            }`}>
              {formData.adsConversionEnabled ? 'Actif' : 'Inactif'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Google AdSense :</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              formData.adSenseEnabled ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-700 text-slate-400'
            }`}>
              {formData.adSenseEnabled ? 'Actif' : 'Désactivé'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Mode Aperçu/Test :</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              formData.testMode ? 'bg-amber-500/20 text-amber-300' : 'bg-purple-500/20 text-purple-300'
            }`}>
              {formData.testMode ? 'Mode Test' : 'Production'}
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Conformité ads.txt :</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">
              Généré
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* SECTION 1: GOOGLE ADS & CONVERSIONS */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>1. Google Ads (SEA, Suivi des Conversions & Retargeting)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Mesurez automatiquement le retour sur investissement (ROI) de vos campagnes publicitaires payantes.
                </p>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.adsConversionEnabled}
                onChange={(e) => setFormData({ ...formData, adsConversionEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-xs font-medium text-slate-300">
                {formData.adsConversionEnabled ? 'Activé' : 'Désactivé'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Identifiant du Compte Google Ads (ID Balise AW-)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.googleAdsId}
                  onChange={(e) => setFormData({ ...formData, googleAdsId: e.target.value })}
                  placeholder="ex: AW-11482938102"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:outline-none text-white text-sm font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400">
                Trouvé dans Google Ads &gt; <em>Outils et paramètres</em> &gt; <em>Balise Google</em> (commence généralement par <code>AW-</code>).
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Label de Conversion : Formulaire Devis / Contact (Lead)
              </label>
              <input
                type="text"
                value={formData.conversionLabelInquiry}
                onChange={(e) => setFormData({ ...formData, conversionLabelInquiry: e.target.value })}
                placeholder="ex: eK9jCN-33IsZEPaK7_Iq"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:outline-none text-white text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Déclenché quand un client soumet une demande de devis sur le site.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Label de Conversion : Rendez-vous 30 min (Consultation)
              </label>
              <input
                type="text"
                value={formData.conversionLabelBooking}
                onChange={(e) => setFormData({ ...formData, conversionLabelBooking: e.target.value })}
                placeholder="ex: mR2vCL_81IsZEPaK7_Iq"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:outline-none text-white text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Déclenché lors de la confirmation d'une session de cadrage technique.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Label de Conversion : Achat de Scripts / Licences (Vente)
              </label>
              <input
                type="text"
                value={formData.conversionLabelPurchase}
                onChange={(e) => setFormData({ ...formData, conversionLabelPurchase: e.target.value })}
                placeholder="ex: wP7xCK_42IsZEPaK7_Iq"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:outline-none text-white text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Déclenché lors d'un paiement de licence ou script sur la Marketplace.
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Label de Conversion : Simulateur / Estimateur de Devis (Intention forte)
              </label>
              <input
                type="text"
                value={formData.conversionLabelEstimate}
                onChange={(e) => setFormData({ ...formData, conversionLabelEstimate: e.target.value })}
                placeholder="ex: qZ5yDK_19IsZEPaK7_Iq"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-blue-500 focus:outline-none text-white text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Déclenché lorsqu'un prospect configure son budget dans l'estimateur de projet.
              </p>
            </div>
          </div>

          {/* Real-Time Conversion Simulator & Live Monitor */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <Play className="w-4 h-4 text-cyan-400" />
                <span>Simulateur &amp; Test en Direct du Tag de Conversion</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Permet de vérifier le déclenchement de gtag sans dépenser de budget publicitaire
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Événement :</label>
                <select
                  value={simulatedEventType}
                  onChange={(e) => setSimulatedEventType(e.target.value as AdsConversionEventType)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="inquiry">Demande / Devis Formulaire</option>
                  <option value="booking">Rendez-vous 30 Min</option>
                  <option value="purchase">Achat Marketplace</option>
                  <option value="estimate">Calcul Estimateur</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Valeur Monétaire :</label>
                <input
                  type="number"
                  value={simulatedValue}
                  onChange={(e) => setSimulatedValue(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Devise :</label>
                <select
                  value={simulatedCurrency}
                  onChange={(e) => setSimulatedCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="RWF">RWF (Frw)</option>
                  <option value="XOF">XOF (FCFA)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleTriggerTestConversion}
                  className="w-full px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Envoyer l'Événement</span>
                </button>
              </div>
            </div>

            {/* Last event fired logger */}
            {lastTriggeredLog && (
              <div className="p-3 rounded-xl bg-slate-900 border border-emerald-500/40 text-xs space-y-1 animate-fadeIn">
                <div className="flex items-center justify-between text-emerald-400 font-semibold">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Événement de conversion émis à {lastTriggeredLog.time}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">gtag('event', 'conversion', ...)</span>
                </div>
                <div className="font-mono text-[11px] text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800 mt-1">
                  send_to: <span className="text-cyan-300">{lastTriggeredLog.sendTo}</span> | 
                  valeur: <span className="text-amber-300">{lastTriggeredLog.payload.value} {lastTriggeredLog.payload.currency}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: GOOGLE ADSENSE & MONETIZATION */}
        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>2. Google AdSense (Monétisation &amp; Emplacements Publicitaires)</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Générez des revenus publicitaires passifs sur les pages à fort trafic (Blog Tech &amp; Marketplace de scripts).
                </p>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.adSenseEnabled}
                onChange={(e) => setFormData({ ...formData, adSenseEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
              <span className="ml-3 text-xs font-medium text-slate-300">
                {formData.adSenseEnabled ? 'AdSense Activé' : 'Désactivé'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                ID Éditeur Google AdSense (Publisher ID)
              </label>
              <input
                type="text"
                value={formData.adSensePublisherId}
                onChange={(e) => setFormData({ ...formData, adSensePublisherId: e.target.value })}
                placeholder="ex: ca-pub-3096798858530242"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:outline-none text-white text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Votre identifiant éditeur Google AdSense unique (commence par <code>ca-pub-</code>).
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                ID du Bloc d'Annonce : Tech Blog (In-Article / Leaderboard)
              </label>
              <input
                type="text"
                value={formData.blogBannerSlotId}
                onChange={(e) => setFormData({ ...formData, blogBannerSlotId: e.target.value })}
                placeholder="ex: 5482910394"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:outline-none text-white text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Bloc d'annonce inséré harmonieusement entre les articles de blog.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                ID du Bloc d'Annonce : Marketplace de Scripts
              </label>
              <input
                type="text"
                value={formData.scriptsMarketplaceSlotId}
                onChange={(e) => setFormData({ ...formData, scriptsMarketplaceSlotId: e.target.value })}
                placeholder="ex: 8291047281"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-amber-500 focus:outline-none text-white text-sm font-mono"
              />
              <p className="text-[11px] text-slate-400">
                Bannière publicitaire affichée sur la vitrine des scripts de code.
              </p>
            </div>

            {/* Test Mode / Safe Preview Switch */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Mode Aperçu Sécurisé (Test Mode)</div>
                  <div className="text-[11px] text-slate-400">
                    Affiche des encarts stylisés sans risquer de clics invalides
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.testMode}
                  onChange={(e) => setFormData({ ...formData, testMode: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded bg-slate-900 border-slate-700"
                />
              </div>
              <p className="text-[10px] text-amber-400/90 leading-relaxed">
                💡 Recommandé de garder le Mode Test actif tant que votre compte AdSense n'est pas pleinement validé par Google pour votre nom de domaine.
              </p>
            </div>
          </div>

          {/* ADS.TXT OFFICIAL GENERATOR */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>Fichier ads.txt Obligatoire Google AdSense</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyAdsTxt}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  {copiedAdsTxt ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copier ads.txt</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => downloadAdsTxtFile(formData.adSensePublisherId)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs text-white flex items-center gap-1.5 font-medium shadow transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Télécharger ads.txt</span>
                </button>
              </div>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
              <div className="text-[11px] text-slate-400 mb-1">Ligne officielle à déposer à la racine de votre domaine :</div>
              <code className="text-xs font-mono text-emerald-300 block select-all">
                {generateAdsTxtContent(formData.adSensePublisherId).trim()}
              </code>
            </div>
          </div>
        </div>

        {/* SECTION 3: STEP-BY-STEP INTEGRATION CHECKLIST */}
        <div className="bg-slate-900/60 rounded-3xl border border-slate-800/80 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
            <Info className="w-4 h-4 text-blue-400" />
            <span>Guide d'Accompagnement &amp; Bonnes Pratiques Google Ads</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px]">1</span>
                Balise Globale Google
              </div>
              <p>
                Le script central <code>gtag.js</code> est injecté dynamiquement dans l'en-tête HTML dès que vous renseignez votre ID <code>AW-</code>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px]">2</span>
                Conversions sans Code
              </div>
              <p>
                Chaque formulaire soumis, rendez-vous planifié ou achat de licence envoie l'événement <code>conversion</code> directement à Google Ads.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/60 space-y-2">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center text-[10px]">3</span>
                Règles AdSense
              </div>
              <p>
                Veillez à ce que vos bannières respectent la politique de non-incitation au clic et déposez le fichier <code>ads.txt</code> sur votre hébergement.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Enregistrement en cours...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Enregistrer les Paramètres Google Ads &amp; AdSense</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
