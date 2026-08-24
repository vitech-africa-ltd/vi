import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  X, 
  Check, 
  MapPin, 
  Coins, 
  Building2, 
  CreditCard, 
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useCountry } from '../context/CountryContext';
import { CountryData } from '../data/countriesData';

export const CountrySelectorModal: React.FC = () => {
  const { currentCountry, setCountry, countriesList, isCountryModalOpen, closeCountryModal, isAutoDetected } = useCountry();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('all');

  if (!isCountryModalOpen) return null;

  const filteredCountries = countriesList.filter((country) => {
    const matchesSearch = 
      country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.hubCity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.currency.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesContinent = 
      selectedContinent === 'all' || country.continent === selectedContinent;

    return matchesSearch && matchesContinent;
  });

  const handleSelect = (code: string) => {
    setCountry(code);
    closeCountryModal();
  };

  const continents = [
    { id: 'all', label: 'Tous les Pays' },
    { id: 'Africa', label: '🌍 Afrique' },
    { id: 'Europe', label: '🇪🇺 Europe' },
    { id: 'North America', label: '🌎 Amérique du Nord' },
    { id: 'Middle East', label: '🕌 Moyen-Orient & Asie' },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black text-white">
                  Sélectionnez Votre Pays / Localisation
                </h3>
                {isAutoDetected && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Auto-détecté
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Adapte instantanément les devis, la devise locale, les passerelles de paiement et le Hub d'ingénierie référent.
              </p>
            </div>
          </div>

          <button
            onClick={closeCountryModal}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Country Summary Banner */}
        <div className="px-5 sm:px-6 py-3 bg-slate-950/70 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Pays actuel :</span>
            <span className="text-lg">{currentCountry.flag}</span>
            <strong className="text-white">{currentCountry.name}</strong>
            <span className="text-cyan-400 font-mono font-bold bg-cyan-950/80 border border-cyan-800 px-2 py-0.5 rounded">
              {currentCountry.currency} ({currentCountry.currencySymbol})
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentCountry.localHub}</span>
          </div>
        </div>

        {/* Search & Continent Filters */}
        <div className="p-4 sm:p-5 border-b border-slate-800 space-y-3 bg-slate-900/60">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un pays (ex: Sénégal, France, Rwanda, Maroc, Canada, Kenya, Côte d'Ivoire...)"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-700/80 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {continents.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedContinent(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedContinent === c.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Countries Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh]">
          {filteredCountries.map((country) => {
            const isSelected = country.code === currentCountry.code;
            return (
              <div
                key={country.code}
                onClick={() => handleSelect(country.code)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-blue-950/60 border-blue-500 text-white shadow-lg ring-1 ring-blue-500/50'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl leading-none">{country.flag}</span>
                      <div>
                        <div className="font-bold text-sm text-white flex items-center gap-1.5">
                          <span>{country.name}</span>
                          {country.isPopular && (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                              Hub Actif
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{country.region}</div>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                      isSelected ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div className="space-y-1 pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                    <div className="flex items-center justify-between">
                      <span>Monnaie de devis :</span>
                      <strong className="text-cyan-400 font-mono font-bold">
                        {country.currency} ({country.currencySymbol})
                      </strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>Hub régional :</span>
                      <span className="text-slate-300">{country.hubCity}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span>Paiements :</span>
                      <span className="text-slate-300 truncate max-w-[170px]">
                        {country.paymentMethods.slice(0, 2).join(', ')}...
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 flex items-center justify-between text-[11px] font-bold text-blue-400 border-t border-slate-800/60">
                  <span>Sélectionner ce pays</span>
                  <span>→</span>
                </div>
              </div>
            );
          })}

          {filteredCountries.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400">
              <Globe className="w-8 h-8 mx-auto text-slate-600 mb-2" />
              <p className="text-sm font-bold">Aucun pays trouvé pour "{searchTerm}"</p>
              <p className="text-xs text-slate-500 mt-1">
                V&I TECH AFRICA délivre des projets partout dans le monde. Choisissez le pays le plus proche ou contactez-nous directement.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Facturation conforme &amp; Accords de confidentialité (NDA) multirégionaux</span>
          </div>

          <button
            onClick={closeCountryModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs cursor-pointer transition-colors"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
