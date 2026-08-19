import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CountryData, COUNTRIES_DATA, detectVisitorCountry, getCountryByCode } from '../data/countriesData';
import { useCurrency, CurrencyCode } from './CurrencyContext';

interface CountryContextType {
  currentCountry: CountryData;
  setCountry: (code: string) => void;
  countriesList: CountryData[];
  isCountryModalOpen: boolean;
  openCountryModal: () => void;
  closeCountryModal: () => void;
  isAutoDetected: boolean;
  getCountryQuoteDetails: (baseEUR: number) => {
    country: CountryData;
    amountInLocalCurrency: number;
    amountInEUR: number;
    amountInUSD: number;
    formattedLocal: string;
    formattedEUR: string;
    formattedUSD: string;
    hub: string;
    taxClause: string;
    jurisdiction: string;
    paymentMethods: string[];
  };
}

const CountryContext = createContext<CountryContextType | undefined>(undefined);

const LOCAL_STORAGE_COUNTRY_KEY = 'vitech_user_country';

export const CountryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { setCurrency, convertFromEUR, formatRawAmount } = useCurrency();
  const [currentCountry, setCurrentCountryState] = useState<CountryData>(() => detectVisitorCountry());
  const [isCountryModalOpen, setIsCountryModalOpen] = useState<boolean>(false);
  const [isAutoDetected, setIsAutoDetected] = useState<boolean>(true);

  // Initialize and synchronize country on mount
  useEffect(() => {
    const detected = detectVisitorCountry();
    const saved = localStorage.getItem(LOCAL_STORAGE_COUNTRY_KEY);
    if (saved) {
      const found = COUNTRIES_DATA.find((c) => c.code === saved);
      if (found) {
        setCurrentCountryState(found);
        setIsAutoDetected(false);
        setCurrency(found.currency);
        return;
      }
    }
    
    // Auto-detected
    setCurrentCountryState(detected);
    setIsAutoDetected(true);
    setCurrency(detected.currency);
  }, []);

  const setCountry = (code: string) => {
    const target = getCountryByCode(code);
    setCurrentCountryState(target);
    setIsAutoDetected(false);
    try {
      localStorage.setItem(LOCAL_STORAGE_COUNTRY_KEY, target.code);
    } catch {
      // LocalStorage fallback
    }

    // Automatically sync active currency to the country's national currency
    setCurrency(target.currency);
  };

  const openCountryModal = () => setIsCountryModalOpen(true);
  const closeCountryModal = () => setIsCountryModalOpen(false);

  const getCountryQuoteDetails = (baseEUR: number) => {
    const localAmount = convertFromEUR(baseEUR, currentCountry.currency);
    const eurAmount = baseEUR;
    const usdAmount = Math.round(baseEUR * 1.085);

    return {
      country: currentCountry,
      amountInLocalCurrency: localAmount,
      amountInEUR: eurAmount,
      amountInUSD: usdAmount,
      formattedLocal: formatRawAmount(localAmount, currentCountry.currency),
      formattedEUR: `${eurAmount.toLocaleString('fr-FR')} €`,
      formattedUSD: `$ ${usdAmount.toLocaleString('en-US')}`,
      hub: currentCountry.localHub,
      taxClause: currentCountry.taxInfo,
      jurisdiction: currentCountry.ndaJurisdiction,
      paymentMethods: currentCountry.paymentMethods,
    };
  };

  return (
    <CountryContext.Provider
      value={{
        currentCountry,
        setCountry,
        countriesList: COUNTRIES_DATA,
        isCountryModalOpen,
        openCountryModal,
        closeCountryModal,
        isAutoDetected,
        getCountryQuoteDetails,
      }}
    >
      {children}
    </CountryContext.Provider>
  );
};

export const useCountry = (): CountryContextType => {
  const context = useContext(CountryContext);
  if (!context) {
    throw new Error('useCountry must be used within a CountryProvider');
  }
  return context;
};
