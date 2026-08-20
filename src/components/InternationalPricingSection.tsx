import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Sparkles, 
  ShieldCheck, 
  Coins, 
  CreditCard, 
  Layers, 
  ChevronRight, 
  Check, 
  ArrowRight, 
  Download, 
  Printer, 
  Info, 
  HelpCircle,
  TrendingUp,
  MapPin,
  FileText
} from 'lucide-react';
import { 
  WORLD_BANK_TIERS, 
  INTERNATIONAL_PRICING_SERVICES, 
  WorldBankCategory,
  COUNTRY_WORLD_BANK_MAP,
  PRICING_POLICY_RULES,
  ServicePriceItem
} from '../data/internationalPricingData';
import { useCountry } from '../context/CountryContext';
import { useCurrency } from '../context/CurrencyContext';
import { useTranslation } from '../context/LanguageContext';

interface InternationalPricingSectionProps {
  onNavigateToEstimator?: (serviceId?: string) => void;
  onNavigateToContact?: (subject?: string) => void;
}

export const InternationalPricingSection: React.FC<InternationalPricingSectionProps> = ({
  onNavigateToEstimator,
  onNavigateToContact,
}) => {
  const { currentCountry, setCountry, openCountryModal } = useCountry();
  const { formatRawAmount } = useCurrency();
  const { t } = useTranslation();

  const [activeTier, setActiveTier] = useState<WorldBankCategory>('low');
  const [activeTab, setActiveTab] = useState<'tiers' | 'rwanda' | 'drc' | 'all-countries'>('tiers');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sync active tier with current visitor country if found
  React.useEffect(() => {
    const countryMapping = COUNTRY_WORLD_BANK_MAP[currentCountry.code];
    if (countryMapping) {
      setActiveTier(countryMapping.category);
    }
  }, [currentCountry.code]);

  const categories = [
    { id: 'all', label: 'Tous les Services (17)' },
    { id: 'design', label: '🎨 Design & Identité' },
    { id: 'web', label: '💻 Web & E-commerce' },
    { id: 'mobile-software', label: '📱 Mobile & Logiciels' },
    { id: 'infrastructure', label: '☁️ API & Hébergement' },
    { id: 'ai-security', label: '🛡️ IA & Cybersécurité' },
  ];

  const filteredServices = INTERNATIONAL_PRICING_SERVICES.filter(service => {
    const matchCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        service.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const currentTierInfo = WORLD_BANK_TIERS[activeTier];

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Background Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/40 text-blue-400 text-xs font-bold uppercase tracking-wider shadow-inner">
            <Globe className="w-3.5 h-3.5" />
            <span>Grille Tarifaire Internationale 2026 • Normes Banque Mondiale</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Tarifs Transparents Adaptés par{' '}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Marché &amp; Pays
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Pour assurer une équité totale et une compétitivité internationale, <strong className="text-white">V&amp;I TECH AFRICA LTD</strong> applique une structure tarifaire basée sur les 4 catégories économiques de la <strong>Banque Mondiale</strong>, complétée par des tarifs préférentiels pour le <strong>Rwanda (RWF)</strong> et la <strong>RDC (USD)</strong>.
          </p>
        </div>

        {/* Top Navigation Tabs: 4 World Bank Tiers vs Rwanda vs RDC vs 195 Countries */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveTab('tiers')}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tiers'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>4 Paliers Internationaux (Banque Mondiale)</span>
          </button>

          <button
            onClick={() => { setActiveTab('rwanda'); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'rwanda'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🇷🇼 Tarifs Spéciaux Rwanda (RWF)</span>
          </button>

          <button
            onClick={() => { setActiveTab('drc'); }}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'drc'
                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span>🇨🇩 Tarifs Spéciaux RDC (USD)</span>
          </button>
        </div>

        {/* Tier Selector Bar (If tab === 'tiers') */}
        {activeTab === 'tiers' && (
          <div className="mb-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {(Object.keys(WORLD_BANK_TIERS) as WorldBankCategory[]).map((tierKey) => {
                const tier = WORLD_BANK_TIERS[tierKey];
                const isActive = activeTier === tierKey;
                return (
                  <button
                    key={tierKey}
                    onClick={() => setActiveTier(tierKey)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? 'bg-gradient-to-b from-blue-950/80 to-slate-900 border-blue-500 shadow-xl shadow-blue-500/10'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950/90 text-slate-400'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xl">{tier.flagExamples.split(' ')[0]}</span>
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                          isActive ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {tier.gniPerCapita}
                        </span>
                      </div>
                      <h4 className={`text-sm font-extrabold ${isActive ? 'text-white' : 'text-slate-200'}`}>
                        {tier.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                        {tier.description}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{tier.flagExamples}</span>
                      {isActive && <Check className="w-4 h-4 text-blue-400" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Tier Card */}
            <div className="mt-4 p-4 sm:p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">
                    {currentTierInfo.name} — {currentTierInfo.badge}
                  </span>
                  <span className="text-xs text-cyan-400 font-mono">({currentTierInfo.gniPerCapita})</span>
                </div>
                <p className="text-xs text-slate-300">
                  <strong>Exemples de pays rattachés :</strong> {currentTierInfo.exampleCountries.join(', ')}
                </p>
                <p className="text-xs text-slate-400">
                  <strong>Moyens de paiement recommandés :</strong> {currentTierInfo.typicalPaymentMethods.join(' • ')}
                </p>
              </div>

              <button
                onClick={openCountryModal}
                className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-blue-400" />
                <span>Changer de Pays ({currentCountry.name} {currentCountry.flag})</span>
              </button>
            </div>
          </div>
        )}

        {/* Rwanda Special Banner */}
        {activeTab === 'rwanda' && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-slate-900 to-emerald-950/40 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇷🇼</span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Barème Tarifaire Spécial Rwanda (Facturation en RWF)
                  </h3>
                  <p className="text-xs text-emerald-300">
                    Pôle Kigali Norrsken House • Paiements instantanés via <strong>MTN Mobile Money Rwanda</strong> &amp; Virements BK
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 px-3 py-1.5 rounded-xl font-bold">
                Devise : RWF (Franc Rwandais)
              </div>
            </div>
          </div>
        )}

        {/* DRC Special Banner */}
        {activeTab === 'drc' && (
          <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/40 border border-cyan-500/40 space-y-2">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇨🇩</span>
                <div>
                  <h3 className="font-bold text-base text-white">
                    Barème Tarifaire Spécial RDC (Facturation simplifiée en USD)
                  </h3>
                  <p className="text-xs text-cyan-300">
                    Paiements directs via <strong>Airtel Money RDC</strong>, M-Pesa &amp; Virement Bancaire
                  </p>
                </div>
              </div>

              <div className="text-xs font-mono bg-cyan-950/80 text-cyan-400 border border-cyan-700/60 px-3 py-1.5 rounded-xl font-bold">
                Devise : USD ($ Dollar Américain)
              </div>
            </div>
          </div>
        )}

        {/* Search & Category Filter Bar */}
        <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer un service (ex: Logo, SaaS, Mobile...)"
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Services & Pricing Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80 shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800 font-semibold">
                <tr>
                  <th className="py-4 px-4 sm:px-6">Service &amp; Spécifications</th>
                  <th className="py-4 px-4">
                    {activeTab === 'rwanda' ? 'Tarif Rwanda (RWF)' : activeTab === 'drc' ? 'Tarif RDC (USD)' : `Tarif Marché (${currentTierInfo.name.split('/')[0].trim()})`}
                  </th>
                  <th className="py-4 px-4 hidden md:table-cell">Base de Facturation</th>
                  <th className="py-4 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredServices.map((service) => {
                  let displayPrice = service.lowIncome;
                  if (activeTab === 'rwanda') {
                    displayPrice = service.rwandaPriceRWF;
                  } else if (activeTab === 'drc') {
                    displayPrice = service.drcPriceUSD;
                  } else {
                    if (activeTier === 'low') displayPrice = service.lowIncome;
                    if (activeTier === 'lower-middle') displayPrice = service.lowerMiddleIncome;
                    if (activeTier === 'upper-middle') displayPrice = service.upperMiddleIncome;
                    if (activeTier === 'high') displayPrice = service.highIncome;
                  }

                  return (
                    <tr key={service.id} className="hover:bg-slate-900/60 transition-colors">
                      <td className="py-4 px-4 sm:px-6">
                        <div>
                          <div className="font-extrabold text-white text-sm sm:text-base flex items-center gap-2">
                            <span>{service.name}</span>
                          </div>
                          <p className="text-xs text-slate-400 mt-1 max-w-xl">
                            {service.description}
                          </p>
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="font-black text-sm sm:text-base text-cyan-400 font-mono bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-xl inline-block">
                          {displayPrice}
                        </div>
                      </td>

                      <td className="py-4 px-4 whitespace-nowrap hidden md:table-cell text-xs text-slate-400 font-medium">
                        {service.unit}
                      </td>

                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => onNavigateToEstimator ? onNavigateToEstimator(service.id) : null}
                          className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Estimer</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commercial Rules & Policy Notice */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Rule 1: Quotation Mechanism */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span>Règle Commerciale &amp; Devis Sur-Mesure</span>
            </h4>
            <div className="text-xs text-slate-300 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800">
              {PRICING_POLICY_RULES.formula}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {PRICING_POLICY_RULES.guaranteeNotice}
            </p>
          </div>

          {/* Rule 2: Payment Policy */}
          <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <span>Moyens de Paiement Internationaux Acceptés</span>
            </h4>
            <div className="text-xs text-slate-300 space-y-1">
              <p>🇷🇼 <strong>Rwanda :</strong> MTN Mobile Money (MoMo)</p>
              <p>🇨🇩 <strong>RDC :</strong> Airtel Money, M-Pesa</p>
              <p>🌍 <strong>International :</strong> Western Union, Virement Swift, Stripe, Cartes Bancaires</p>
            </div>
            <p className="text-xs text-slate-400">
              Échéancier type : 40% au lancement • 30% à mi-parcours (Sprint démo) • 30% à la livraison finale et remise des clés.
            </p>
          </div>

        </div>

        {/* CTA Banner */}
        <div className="mt-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-950/50 to-slate-900 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-extrabold text-white">
              Vous souhaitez un devis précis pour votre pays ?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Configurez vos spécifications ou contactez directement notre Direction Technique pour une proposition chiffrée sous 24h.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigateToEstimator ? onNavigateToEstimator() : null}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Ouvrir l'Estimateur</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateToContact ? onNavigateToContact("Demande de devis international") : null}
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              <span>Contacter la Direction</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
