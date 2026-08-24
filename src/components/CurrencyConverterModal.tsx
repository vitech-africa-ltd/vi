import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  Coins, 
  Sparkles, 
  Check, 
  Copy, 
  Calculator, 
  ShieldCheck, 
  Globe2, 
  ChevronRight,
  TrendingUp,
  Info
} from 'lucide-react';
import { useCurrency, CurrencyCode, CURRENCIES_DATA } from '../context/CurrencyContext';

interface CurrencyConverterModalProps {
  onApplyBudgetToEstimator?: (amountEUR: number) => void;
}

export const CurrencyConverterModal: React.FC<CurrencyConverterModalProps> = ({
  onApplyBudgetToEstimator,
}) => {
  const { 
    isConverterModalOpen, 
    closeConverterModal, 
    converterInitialAmount, 
    currenciesList, 
    convertBetween, 
    formatRawAmount,
    setCurrency,
    currency: activeSiteCurrency
  } = useCurrency();

  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('EUR');
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('XOF');
  const [amountInput, setAmountInput] = useState<string>('2500');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (converterInitialAmount) {
      setAmountInput(converterInitialAmount.toString());
      setFromCurrency('EUR');
      setToCurrency(activeSiteCurrency !== 'EUR' ? activeSiteCurrency : 'XOF');
    }
  }, [converterInitialAmount, isConverterModalOpen, activeSiteCurrency]);

  if (!isConverterModalOpen) return null;

  const numAmount = parseFloat(amountInput) || 0;
  const convertedResult = convertBetween(numAmount, fromCurrency, toCurrency);

  const fromOption = CURRENCIES_DATA[fromCurrency] || CURRENCIES_DATA.EUR;
  const toOption = CURRENCIES_DATA[toCurrency] || CURRENCIES_DATA.XOF;

  // Single unit rate
  const singleUnitRate = convertBetween(1, fromCurrency, toCurrency);

  // Quick preset budgets
  const presetsEUR = [
    { label: '500 €', val: 500, desc: 'Audit Rapide / Cadrage' },
    { label: '1 500 €', val: 1500, desc: 'Sprint UI/UX & MVP' },
    { label: '3 000 €', val: 3000, desc: 'App Mobile ou Web App' },
    { label: '5 000 €', val: 5000, desc: 'SaaS Complet / Switch' },
    { label: '10 000 €', val: 10000, desc: 'Système Critique Panafricain' },
    { label: '25 000 €', val: 25000, desc: 'Scale-up & Infrastructure Enterprise' },
  ];

  const presetsXOF = [
    { label: '500k FCFA', val: 500000, desc: 'Audit Technique' },
    { label: '1M FCFA', val: 1000000, desc: 'Sprint MVP' },
    { label: '2M FCFA', val: 2000000, desc: 'Plateforme Web / Mobile' },
    { label: '3.5M FCFA', val: 3500000, desc: 'Application Métier' },
    { label: '7M FCFA', val: 7000000, desc: 'Projet Fintech & Switch' },
    { label: '15M FCFA', val: 15000000, desc: 'Système Panafricain' },
  ];

  const currentPresets = fromCurrency === 'XOF' || fromCurrency === 'XAF' ? presetsXOF : presetsEUR;

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmountInput(convertedResult.toString());
  };

  const handleCopyResult = () => {
    const textToCopy = `${formatRawAmount(numAmount, fromCurrency)} = ${formatRawAmount(convertedResult, toCurrency)}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyToEstimator = () => {
    // Convert to EUR base for project estimator
    const amountEUR = fromCurrency === 'EUR' 
      ? numAmount 
      : convertBetween(numAmount, fromCurrency, 'EUR');
    
    // Set site active currency to destination
    setCurrency(toCurrency);
    closeConverterModal();

    if (onApplyBudgetToEstimator) {
      onApplyBudgetToEstimator(amountEUR);
    } else {
      const estimatorEl = document.getElementById('estimator');
      if (estimatorEl) {
        estimatorEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl shadow-2xl text-white relative my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="p-6 sm:p-8 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-blue-950/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">Convertisseur de Devises Tech</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                  Taux Fixes &amp; Transparents
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Panafricain &amp; International (UEMOA, CEMAC, Rwanda, Maroc, Kenya, Europe, USA)
              </p>
            </div>
          </div>

          <button
            onClick={closeConverterModal}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Main Dual Converter Box */}
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center bg-slate-950/80 p-5 sm:p-6 rounded-3xl border border-slate-800 shadow-inner">
            
            {/* FROM COLUMN (5 cols) */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Montant Initial</span>
                <span>{fromOption.country}</span>
              </div>

              <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-2xl p-2.5 focus-within:border-blue-500 transition-colors">
                <input
                  type="number"
                  min="0"
                  step="10"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  className="w-full bg-transparent text-xl sm:text-2xl font-black text-white focus:outline-none px-2 font-mono"
                  placeholder="0"
                />
                
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                  className="bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
                >
                  {currenciesList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-[11px] text-slate-500 pl-1">
                {fromOption.name} • <span className="text-slate-400">{fromOption.region}</span>
              </div>
            </div>

            {/* SWAP BUTTON (1 col) */}
            <div className="md:col-span-1 flex justify-center py-2 md:py-0">
              <button
                onClick={handleSwap}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 active:scale-90 transition-all cursor-pointer"
                title="Inverser les devises"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            {/* TO COLUMN (5 cols) */}
            <div className="md:col-span-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Équivalence Convertie</span>
                <span>{toOption.country}</span>
              </div>

              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/40 rounded-2xl p-2.5">
                <div className="w-full px-2 text-xl sm:text-2xl font-black text-cyan-300 font-mono truncate">
                  {formatRawAmount(convertedResult, toCurrency, { hideSymbol: true })}
                </div>

                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                  className="bg-slate-800 text-white font-bold text-xs px-3 py-2 rounded-xl border border-slate-700 focus:outline-none cursor-pointer"
                >
                  {currenciesList.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} ({c.symbol})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pl-1">
                <span>{toOption.name}</span>
                <span className="font-mono text-emerald-400 font-bold">1 {fromCurrency} = {singleUnitRate} {toCurrency}</span>
              </div>
            </div>

          </div>

          {/* Quick Amount Presets */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span>Montants Fréquents &amp; Formats de Projets</span>
              <span className="text-[11px] text-slate-500">Cliquez pour tester</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              {currentPresets.map((p) => (
                <button
                  key={p.label}
                  onClick={() => setAmountInput(p.val.toString())}
                  className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    numAmount === p.val
                      ? 'bg-blue-600/30 border-blue-500 text-cyan-300 shadow-md font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-black">{p.label}</div>
                  <div className="text-[10px] text-slate-500 truncate">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* All Hubs Multi-Currency Live Comparison Grid */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Globe2 className="w-3.5 h-3.5 text-blue-400" />
                <span>Ventilation Immédiate par Hub Panafricain &amp; International</span>
              </span>
              <button
                onClick={handleCopyResult}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier la conversion'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {currenciesList.map((c) => {
                const converted = convertBetween(numAmount, fromCurrency, c.code);
                const isSelectedTo = c.code === toCurrency;

                return (
                  <button
                    key={c.code}
                    onClick={() => setToCurrency(c.code)}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelectedTo
                        ? 'bg-blue-900/30 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                        : 'bg-slate-950/90 border-slate-800 hover:bg-slate-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <div className="flex items-center gap-1 font-bold text-slate-200">
                        <span className="text-sm">{c.flag}</span>
                        <span>{c.code}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{c.symbol}</span>
                    </div>
                    <div className="text-sm font-black text-white font-mono truncate">
                      {formatRawAmount(converted, c.code)}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {c.country}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal / Guarantees Note */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <span className="font-bold text-slate-200">Garantie Contractuelle Vitech Africa :</span> Les devis et contrats signés sont indexés dans la devise locale de votre choix (XOF, XAF, EUR, USD, RWF, MAD). Le taux de change est verrouillé à la signature sans frais cachés ni réévaluation unilatérale.
            </div>
          </div>

          {/* Actions Bottom Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-800">
            <div className="text-xs text-slate-400 text-center sm:text-left">
              Valeur équivalente : <strong className="text-cyan-400 font-mono">{formatRawAmount(convertedResult, toCurrency)}</strong>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                onClick={closeConverterModal}
                className="w-1/2 sm:w-auto px-5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
              >
                Fermer
              </button>

              <button
                onClick={handleApplyToEstimator}
                className="w-1/2 sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-slate-950 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Utiliser dans le Devis</span>
                <ChevronRight className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
