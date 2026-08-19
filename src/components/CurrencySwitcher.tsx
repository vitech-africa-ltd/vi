import React, { useState, useRef, useEffect } from 'react';
import { useCurrency, CurrencyCode } from '../context/CurrencyContext';
import { 
  Coins, 
  ChevronDown, 
  Check, 
  Calculator,
  ArrowRightLeft
} from 'lucide-react';

interface CurrencySwitcherProps {
  variant?: 'header' | 'header-utility' | 'mobile' | 'compact';
  className?: string;
  showConverterTrigger?: boolean;
}

export const CurrencySwitcher: React.FC<CurrencySwitcherProps> = ({
  variant = 'header',
  className = '',
  showConverterTrigger = true,
}) => {
  const { currency, setCurrency, currencyOption, currenciesList, openConverterModal } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  // MOBILE DRAWER VARIANT
  if (variant === 'mobile') {
    return (
      <div className={`p-3.5 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md ${className}`}>
        <div className="flex items-center justify-between text-xs font-bold mb-2.5">
          <div className="flex items-center gap-1.5 text-cyan-400">
            <Coins className="w-4 h-4" />
            <span>Devise de Facturation &amp; Estimations</span>
          </div>
          <button
            onClick={() => openConverterModal()}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20"
          >
            <Calculator className="w-3 h-3" />
            <span>Convertisseur</span>
          </button>
        </div>

        {/* Major African and Global Currencies Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
          {currenciesList.map((c) => {
            const isSelected = c.code === currency;
            return (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                    : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-base leading-none mb-0.5">{c.flag}</span>
                <span className="font-mono text-[10px] tracking-tight">{c.code}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <span>Devise active : <strong className="text-white">{currencyOption.name} ({currencyOption.symbol})</strong></span>
          <span className="text-emerald-400 text-[10px] font-mono">Taux fixes &amp; transparents</span>
        </div>
      </div>
    );
  }

  // TOPBAR UTILITY HEADER VARIANT
  if (variant === 'header-utility') {
    return (
      <div className={`relative inline-block ${className}`} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] font-bold transition-all cursor-pointer hover:border-slate-700 shadow-2xs"
          title="Changer la devise d'affichage"
        >
          <span className="text-xs leading-none">{currencyOption.flag}</span>
          <span className="font-mono text-cyan-400 font-extrabold">{currencyOption.code}</span>
          <span className="text-slate-400 text-[10px]">({currencyOption.symbol})</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 text-white">
            <div className="px-3 py-2 border-b border-slate-800 mb-1.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                <Coins className="w-3.5 h-3.5 text-cyan-400" />
                <span>Devise Panafricaine &amp; Globale</span>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  openConverterModal();
                }}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 cursor-pointer"
                title="Ouvrir le simulateur de conversion complet"
              >
                <Calculator className="w-3 h-3" />
                <span>Calculateur</span>
              </button>
            </div>

            <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
              {currenciesList.map((c) => {
                const isSelected = c.code === currency;
                return (
                  <button
                    key={c.code}
                    onClick={() => handleSelect(c.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/30 text-cyan-300 border border-blue-500/40 font-bold'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg leading-none">{c.flag}</span>
                      <div>
                        <div className="font-bold flex items-center gap-1.5">
                          <span>{c.code}</span>
                          <span className="text-[11px] text-slate-400 font-normal">({c.symbol})</span>
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{c.region}</div>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 border-t border-slate-800/80 px-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  openConverterModal();
                }}
                className="w-full py-1.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Simuler une Conversion en Direct</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT COMPACT PILL VARIANT (FOR LIGHT HEADER)
  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-slate-100/90 hover:bg-slate-200/90 border border-slate-200 text-xs font-bold text-slate-800 transition-all cursor-pointer shadow-2xs hover:border-slate-300"
        title="Changer la devise de calcul"
      >
        <span className="text-sm leading-none">{currencyOption.flag}</span>
        <span className="font-mono text-blue-700 font-black">{currencyOption.code}</span>
        <ChevronDown className="w-3 h-3 text-slate-500" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="px-3 py-2 border-b border-slate-100 mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
              <Coins className="w-3.5 h-3.5 text-blue-600" />
              <span>Devise d'Affichage</span>
            </div>
            {showConverterTrigger && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openConverterModal();
                }}
                className="text-[10px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200 cursor-pointer flex items-center gap-1"
              >
                <Calculator className="w-3 h-3" />
                <span>Calculateur</span>
              </button>
            )}
          </div>

          <div className="space-y-1 max-h-64 overflow-y-auto pr-1">
            {currenciesList.map((c) => {
              const isSelected = c.code === currency;
              return (
                <button
                  key={c.code}
                  onClick={() => handleSelect(c.code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-blue-900 border border-blue-200 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none">{c.flag}</span>
                    <div>
                      <div className="font-bold flex items-center gap-1.5 text-slate-900">
                        <span>{c.code}</span>
                        <span className="text-slate-500 font-medium">({c.symbol})</span>
                      </div>
                      <div className="text-[10px] text-slate-500 line-clamp-1">{c.region}</div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-slate-100 px-1">
            <button
              onClick={() => {
                setIsOpen(false);
                openConverterModal();
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#1a44c2] hover:bg-[#1437a3] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-700/20 cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Ouvrir le Convertisseur de Budget</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
