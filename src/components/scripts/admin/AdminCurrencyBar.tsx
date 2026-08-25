import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Coins,
  ArrowRightLeft,
  ChevronDown,
  Calculator,
  Check,
  TrendingUp,
  Receipt,
  DollarSign,
  Sparkles,
  Info,
  Globe2
} from 'lucide-react';
import { useCurrency, CurrencyCode, CURRENCIES_DATA } from '../../../context/CurrencyContext';

interface AdminCurrencyBarProps {
  invoicedEUR?: number;
  collectedEUR?: number;
  pendingEUR?: number;
  className?: string;
  variant?: 'full' | 'compact' | 'header';
}

export const AdminCurrencyBar: React.FC<AdminCurrencyBarProps> = ({
  invoicedEUR = 112500,
  collectedEUR = 95000,
  pendingEUR = 17500,
  className = '',
  variant = 'full'
}) => {
  const {
    currency,
    setCurrency,
    currencyOption,
    currenciesList,
    convertFromEUR,
    convertBetween,
    formatRawAmount,
    openConverterModal
  } = useCurrency();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [quickCalcAmount, setQuickCalcAmount] = useState<number>(1000);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick converted totals
  const convertedInvoiced = useMemo(() => convertFromEUR(invoicedEUR), [invoicedEUR, currency, convertFromEUR]);
  const convertedCollected = useMemo(() => convertFromEUR(collectedEUR), [collectedEUR, currency, convertFromEUR]);
  const convertedPending = useMemo(() => convertFromEUR(pendingEUR), [pendingEUR, currency, convertFromEUR]);

  // Major currencies for quick switcher pills
  const featuredCodes: CurrencyCode[] = ['XOF', 'EUR', 'USD', 'RWF', 'XAF', 'MAD'];

  if (variant === 'header') {
    return (
      <div className={`relative inline-flex items-center gap-2 ${className}`} ref={dropdownRef}>
        <div className="flex items-center bg-slate-900/90 border border-slate-800 rounded-xl p-1 shadow-inner">
          {/* Quick buttons */}
          <div className="hidden sm:flex items-center gap-1">
            {(['XOF', 'EUR', 'USD', 'RWF'] as CurrencyCode[]).map((cCode) => {
              const opt = CURRENCIES_DATA[cCode];
              const isSelected = currency === cCode;
              return (
                <button
                  key={cCode}
                  onClick={() => setCurrency(cCode)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  title={`${opt.name} (${opt.symbol})`}
                >
                  <span className="text-[11px] leading-none">{opt.flag}</span>
                  <span>{cCode}</span>
                </button>
              );
            })}
          </div>

          {/* Dropdown trigger */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs text-white font-mono font-bold transition cursor-pointer"
            title="Toutes les devises africaines et internationales"
          >
            <span className="text-sm leading-none">{currencyOption.flag}</span>
            <span className="text-amber-400">{currencyOption.code}</span>
            <span className="text-[11px] text-slate-400">({currencyOption.symbol})</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>
        </div>

        {/* Currency Converter Modal Trigger */}
        <button
          onClick={() => openConverterModal(1000)}
          className="p-2 rounded-xl bg-slate-900 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          title="Ouvrir le simulateur de devises Vitech FX"
        >
          <Calculator className="w-4 h-4" />
          <span className="hidden md:inline">Calculateur FX</span>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2.5 z-[250] text-xs animate-in fade-in">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 px-2 text-slate-300 font-bold">
              <span className="flex items-center gap-1.5 text-amber-400">
                <Globe2 className="w-4 h-4" />
                <span>Devises Disponibles ({currenciesList.length})</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Taux en temps réel</span>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {currenciesList.map((c) => {
                const isSelected = c.code === currency;
                return (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl leading-none">{c.flag}</span>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-white font-mono">{c.code}</span>
                          <span className="text-slate-400 text-[11px]">({c.symbol})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{c.name}</div>
                      </div>
                    </div>

                    <div className="text-right font-mono text-[10px]">
                      <span className="text-slate-400 block">1 € = {c.rateToEUR}</span>
                      {isSelected && <span className="text-amber-400 font-bold">Actif ✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full Widget Variant (placed inside Analytics / Invoicing overview)
  return (
    <div className={`p-5 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/90 to-slate-950 border border-slate-800 shadow-xl space-y-4 ${className}`}>
      
      {/* Top row: Title + Currency Switcher controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shadow-inner">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm sm:text-base text-white">
                Sélecteur de Devises &amp; Conversion Live (Vitech FX)
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                Taux Temps Réel
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Affichage dynamique et conversion instantanée des factures, règlements et chiffre d'affaires.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2 self-stretch sm:self-auto" ref={dropdownRef}>
          <button
            onClick={() => openConverterModal(1000)}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <Calculator className="w-4 h-4" />
            <span>Simulateur Complet</span>
          </button>
        </div>
      </div>

      {/* Featured Currencies Pill Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-2xl bg-slate-950/80 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-slate-400 font-medium px-2 hidden sm:inline">Devise active :</span>
          {featuredCodes.map((code) => {
            const opt = CURRENCIES_DATA[code];
            const isSelected = currency === code;
            return (
              <button
                key={code}
                onClick={() => setCurrency(code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-105 font-black'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800/60'
                }`}
              >
                <span className="text-sm leading-none">{opt.flag}</span>
                <span>{opt.code}</span>
                <span className={`text-[10px] ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>({opt.symbol})</span>
              </button>
            );
          })}
        </div>

        {/* Current Active Currency Exchange Rate Info */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-400" />
          <span>1 € = <strong className="text-white">{currencyOption.rateToEUR.toLocaleString()}</strong> {currencyOption.symbol} ({currencyOption.code})</span>
        </div>
      </div>

      {/* Live Financial Totals Snapshot Cards in Active Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Invoiced */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>C.A. Facturé ({currencyOption.code})</span>
            <Receipt className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-mono text-lg sm:text-xl font-bold text-white">
            {formatRawAmount(convertedInvoiced, currency)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Équivalent : {invoicedEUR.toLocaleString()} €
          </div>
        </div>

        {/* Total Collected */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Montant Encaissé ({currencyOption.code})</span>
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="font-mono text-lg sm:text-xl font-bold text-emerald-400">
            {formatRawAmount(convertedCollected, currency)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Équivalent : {collectedEUR.toLocaleString()} €
          </div>
        </div>

        {/* Total Pending */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>En Attente de Règlement ({currencyOption.code})</span>
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="font-mono text-lg sm:text-xl font-bold text-cyan-300">
            {formatRawAmount(convertedPending, currency)}
          </div>
          <div className="text-[10px] text-slate-500 font-mono">
            Équivalent : {pendingEUR.toLocaleString()} €
          </div>
        </div>
      </div>

    </div>
  );
};
