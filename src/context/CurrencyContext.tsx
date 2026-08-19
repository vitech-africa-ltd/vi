import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

export type CurrencyCode = 'XOF' | 'XAF' | 'EUR' | 'USD' | 'GNF' | 'RWF' | 'MAD' | 'KES' | 'NGN' | 'CAD' | 'GBP';

export interface CurrencyOption {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  country: string;
  region: string;
  rateToEUR: number; // How many units of this currency equal 1 EUR
  symbolPosition: 'before' | 'after';
  decimals: number;
}

export const CURRENCIES_DATA: Record<CurrencyCode, CurrencyOption> = {
  XOF: {
    code: 'XOF',
    name: 'Franc CFA (UEMOA)',
    symbol: 'FCFA',
    flag: '🇸🇳',
    country: 'Sénégal / Côte d’Ivoire',
    region: 'Afrique de l’Ouest (UEMOA)',
    rateToEUR: 655.957,
    symbolPosition: 'after',
    decimals: 0,
  },
  XAF: {
    code: 'XAF',
    name: 'Franc CFA (CEMAC)',
    symbol: 'FCFA',
    flag: '🇨🇲',
    country: 'Cameroun / Gabon',
    region: 'Afrique Centrale (CEMAC)',
    rateToEUR: 655.957,
    symbolPosition: 'after',
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    country: 'Union Européenne',
    region: 'Europe / International',
    rateToEUR: 1.0,
    symbolPosition: 'after',
    decimals: 0,
  },
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    country: 'États-Unis',
    region: 'International & Global',
    rateToEUR: 1.085,
    symbolPosition: 'before',
    decimals: 0,
  },
  GNF: {
    code: 'GNF',
    name: 'Franc Guinéen',
    symbol: 'GNF',
    flag: '🇬🇳',
    country: 'Guinée Conakry',
    region: 'Afrique de l’Ouest',
    rateToEUR: 9350.0,
    symbolPosition: 'after',
    decimals: 0,
  },
  RWF: {
    code: 'RWF',
    name: 'Franc Rwandais',
    symbol: 'RWF',
    flag: '🇷🇼',
    country: 'Rwanda',
    region: 'Afrique de l’Est (Kigali Hub)',
    rateToEUR: 1540.0,
    symbolPosition: 'after',
    decimals: 0,
  },
  MAD: {
    code: 'MAD',
    name: 'Dirham Marocain',
    symbol: 'DH',
    flag: '🇲🇦',
    country: 'Maroc',
    region: 'Afrique du Nord (Casablanca)',
    rateToEUR: 10.85,
    symbolPosition: 'after',
    decimals: 0,
  },
  KES: {
    code: 'KES',
    name: 'Shilling Kenyan',
    symbol: 'KSh',
    flag: '🇰🇪',
    country: 'Kenya',
    region: 'Silicon Savannah (Nairobi)',
    rateToEUR: 142.5,
    symbolPosition: 'before',
    decimals: 0,
  },
  NGN: {
    code: 'NGN',
    name: 'Naira Nigérian',
    symbol: '₦',
    flag: '🇳🇬',
    country: 'Nigeria',
    region: 'Lagos Tech Ecosystem',
    rateToEUR: 1650.0,
    symbolPosition: 'before',
    decimals: 0,
  },
  CAD: {
    code: 'CAD',
    name: 'Dollar Canadien',
    symbol: 'CAD$',
    flag: '🇨🇦',
    country: 'Canada',
    region: 'Amérique du Nord',
    rateToEUR: 1.48,
    symbolPosition: 'before',
    decimals: 0,
  },
  GBP: {
    code: 'GBP',
    name: 'Livre Sterling',
    symbol: '£',
    flag: '🇬🇧',
    country: 'Royaume-Uni',
    region: 'Europe',
    rateToEUR: 0.855,
    symbolPosition: 'before',
    decimals: 0,
  },
};

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  currencyOption: CurrencyOption;
  currenciesList: CurrencyOption[];
  convertFromEUR: (amountEUR: number, targetCode?: CurrencyCode) => number;
  convertToEUR: (amountInCurrent: number, sourceCode?: CurrencyCode) => number;
  convertBetween: (amount: number, fromCode: CurrencyCode, toCode: CurrencyCode) => number;
  formatCurrency: (amountEUR: number, targetCode?: CurrencyCode, options?: { compact?: boolean; hideSymbol?: boolean }) => string;
  formatRawAmount: (amount: number, currencyCode: CurrencyCode, options?: { compact?: boolean; hideSymbol?: boolean }) => string;
  isConverterModalOpen: boolean;
  openConverterModal: (initialAmountEUR?: number) => void;
  closeConverterModal: () => void;
  converterInitialAmount: number;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'vitech_preferred_currency';

export const CurrencyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY) as CurrencyCode;
      if (saved && CURRENCIES_DATA[saved]) {
        return saved;
      }
    } catch {
      // Fallback
    }
    return 'XOF'; // Default to West African CFA Franc (Dakar / Abidjan HQ)
  });

  const [isConverterModalOpen, setIsConverterModalOpen] = useState(false);
  const [converterInitialAmount, setConverterInitialAmount] = useState<number>(2500);

  const setCurrency = (code: CurrencyCode) => {
    if (CURRENCIES_DATA[code]) {
      setCurrencyState(code);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, code);
      } catch {
        // LocalStorage fallback
      }
    }
  };

  const currencyOption = useMemo(() => CURRENCIES_DATA[currency] || CURRENCIES_DATA.XOF, [currency]);
  const currenciesList = useMemo(() => Object.values(CURRENCIES_DATA), []);

  const convertFromEUR = (amountEUR: number, targetCode?: CurrencyCode): number => {
    const target = targetCode ? (CURRENCIES_DATA[targetCode] || currencyOption) : currencyOption;
    return Math.round(amountEUR * target.rateToEUR);
  };

  const convertToEUR = (amountInCurrent: number, sourceCode?: CurrencyCode): number => {
    const source = sourceCode ? (CURRENCIES_DATA[sourceCode] || currencyOption) : currencyOption;
    if (source.rateToEUR === 0) return amountInCurrent;
    return amountInCurrent / source.rateToEUR;
  };

  const convertBetween = (amount: number, fromCode: CurrencyCode, toCode: CurrencyCode): number => {
    const from = CURRENCIES_DATA[fromCode] || CURRENCIES_DATA.EUR;
    const to = CURRENCIES_DATA[toCode] || CURRENCIES_DATA.XOF;
    const amountEUR = from.rateToEUR !== 0 ? amount / from.rateToEUR : amount;
    return Math.round(amountEUR * to.rateToEUR);
  };

  const formatRawAmount = (amount: number, currencyCode: CurrencyCode, options?: { compact?: boolean; hideSymbol?: boolean }): string => {
    const target = CURRENCIES_DATA[currencyCode] || CURRENCIES_DATA.XOF;
    
    // Formatting with thousands space separator (e.g. 1 500 000)
    const formattedNum = new Intl.NumberFormat('fr-FR', {
      maximumFractionDigits: target.decimals,
      notation: options?.compact && amount >= 1000000 ? 'compact' : 'standard',
    }).format(amount);

    if (options?.hideSymbol) {
      return formattedNum;
    }

    if (target.symbolPosition === 'before') {
      return `${target.symbol} ${formattedNum}`;
    }
    return `${formattedNum} ${target.symbol}`;
  };

  const formatCurrency = (amountEUR: number, targetCode?: CurrencyCode, options?: { compact?: boolean; hideSymbol?: boolean }): string => {
    const target = targetCode ? (CURRENCIES_DATA[targetCode] || currencyOption) : currencyOption;
    const converted = convertFromEUR(amountEUR, target.code);
    return formatRawAmount(converted, target.code, options);
  };

  const openConverterModal = (initialAmountEUR: number = 2500) => {
    setConverterInitialAmount(initialAmountEUR);
    setIsConverterModalOpen(true);
  };

  const closeConverterModal = () => {
    setIsConverterModalOpen(false);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyOption,
        currenciesList,
        convertFromEUR,
        convertToEUR,
        convertBetween,
        formatCurrency,
        formatRawAmount,
        isConverterModalOpen,
        openConverterModal,
        closeConverterModal,
        converterInitialAmount,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
