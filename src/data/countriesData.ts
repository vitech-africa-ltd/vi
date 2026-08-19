import { CurrencyCode } from '../context/CurrencyContext';

export interface CountryData {
  code: string; // ISO 2-letter
  name: string;
  nativeName: string;
  flag: string;
  continent: 'Africa' | 'Europe' | 'North America' | 'Middle East' | 'Asia' | 'Latin America' | 'Oceania';
  region: string;
  currency: CurrencyCode;
  currencySymbol: string;
  timezones: string[];
  localHub: string;
  hubCity: string;
  paymentMethods: string[];
  taxInfo: string;
  ndaJurisdiction: string;
  phonePrefix: string;
  isPopular?: boolean;
}

export const COUNTRIES_DATA: CountryData[] = [
  // Afrique de l'Ouest & Centrale
  {
    code: 'SN',
    name: 'Sénégal',
    nativeName: 'Sénégal (Sunugaal)',
    flag: '🇸🇳',
    continent: 'Africa',
    region: 'Afrique de l’Ouest (UEMOA)',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Dakar'],
    localHub: 'Hub Almadies & R&D Dakar',
    hubCity: 'Dakar',
    paymentMethods: ['Wave Sénégal', 'Orange Money', 'Free Money', 'Virement Bancaire UEMOA', 'Carte Visa/Mastercard'],
    taxInfo: 'Facturation normalisée DGID Sénégal (TVA 18% ou Exonération Export)',
    ndaJurisdiction: 'Tribunal de Commerce de Dakar (Droit OHADA)',
    phonePrefix: '+221',
    isPopular: true,
  },
  {
    code: 'CI',
    name: 'Côte d’Ivoire',
    nativeName: 'Côte d’Ivoire',
    flag: '🇨🇮',
    continent: 'Africa',
    region: 'Afrique de l’Ouest (UEMOA)',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Abidjan'],
    localHub: 'Hub Plateau & Tech Hub Abidjan',
    hubCity: 'Abidjan',
    paymentMethods: ['Wave CI', 'Orange Money CI', 'MTN MoMo', 'Moov Money', 'Virement UEMOA'],
    taxInfo: 'Facture Normalisée DGI Côte d’Ivoire',
    ndaJurisdiction: 'Tribunal de Commerce d’Abidjan (Droit OHADA)',
    phonePrefix: '+225',
    isPopular: true,
  },
  {
    code: 'RW',
    name: 'Rwanda',
    nativeName: 'Rwanda (u Rwanda)',
    flag: '🇷🇼',
    continent: 'Africa',
    region: 'Afrique de l’Est (EAC)',
    currency: 'RWF',
    currencySymbol: 'RWF',
    timezones: ['Africa/Kigali'],
    localHub: 'Silicon Hub Kigali & R&D Hub',
    hubCity: 'Kigali',
    paymentMethods: ['MTN Mobile Money Rwanda', 'Airtel Money Rwanda', 'BK Bank Transfer', 'Credit Card'],
    taxInfo: 'RRA EBM Certified Invoicing (18% VAT or Zero-rated Export)',
    ndaJurisdiction: 'Commercial Court of Kigali (Rwanda Law & Common Law)',
    phonePrefix: '+250',
    isPopular: true,
  },
  {
    code: 'CM',
    name: 'Cameroun',
    nativeName: 'Cameroun',
    flag: '🇨🇲',
    continent: 'Africa',
    region: 'Afrique Centrale (CEMAC)',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Douala', 'Africa/Lagos'],
    localHub: 'Antenne Douala & Yaoundé',
    hubCity: 'Douala',
    paymentMethods: ['MTN MoMo Cameroun', 'Orange Money CM', 'Virement CEMAC'],
    taxInfo: 'Facturation certifiée DGI Cameroun (CEMAC)',
    ndaJurisdiction: 'Juridiction OHADA CEMAC',
    phonePrefix: '+237',
    isPopular: true,
  },
  {
    code: 'GN',
    name: 'Guinée',
    nativeName: 'Guinée Conakry',
    flag: '🇬🇳',
    continent: 'Africa',
    region: 'Afrique de l’Ouest',
    currency: 'GNF',
    currencySymbol: 'GNF',
    timezones: ['Africa/Conakry'],
    localHub: 'Relais Technique Conakry (Hub Dakar)',
    hubCity: 'Conakry',
    paymentMethods: ['Orange Money Guinée', 'MTN MoMo GN', 'Virement Swift'],
    taxInfo: 'Régime Fiscal DNI République de Guinée',
    ndaJurisdiction: 'Droit Commercial OHADA',
    phonePrefix: '+224',
  },
  {
    code: 'MA',
    name: 'Maroc',
    nativeName: 'المملكة المغربية (Maroc)',
    flag: '🇲🇦',
    continent: 'Africa',
    region: 'Afrique du Nord (Maghreb)',
    currency: 'MAD',
    currencySymbol: 'DH',
    timezones: ['Africa/Casablanca'],
    localHub: 'Bureau Partenaire Casablanca Finance City',
    hubCity: 'Casablanca',
    paymentMethods: ['Carte Bancaire CMI', 'Virement Bancaire Maroc (Attijari / BCP / BMCE)', 'PayPal / Stripe'],
    taxInfo: 'Facture conforme DGI Maroc / ICE Entreprise',
    ndaJurisdiction: 'Tribunal de Commerce de Casablanca',
    phonePrefix: '+212',
    isPopular: true,
  },
  {
    code: 'KE',
    name: 'Kenya',
    nativeName: 'Kenya',
    flag: '🇰🇪',
    continent: 'Africa',
    region: 'East Africa (Silicon Savannah)',
    currency: 'KES',
    currencySymbol: 'KSh',
    timezones: ['Africa/Nairobi'],
    localHub: 'East Africa Tech Hub (Nairobi / Kigali)',
    hubCity: 'Nairobi',
    paymentMethods: ['M-Pesa Safaricom', 'Airtel Money Kenya', 'KCB / Equity Bank Wire', 'Stripe'],
    taxInfo: 'KRA iTax VAT Compliant Invoicing',
    ndaJurisdiction: 'High Court of Kenya (Commercial & Tax Division)',
    phonePrefix: '+254',
    isPopular: true,
  },
  {
    code: 'NG',
    name: 'Nigeria',
    nativeName: 'Nigeria',
    flag: '🇳🇬',
    continent: 'Africa',
    region: 'West Africa (Lagos Ecosystem)',
    currency: 'NGN',
    currencySymbol: '₦',
    timezones: ['Africa/Lagos'],
    localHub: 'Lagos Tech Gateway (West Africa)',
    hubCity: 'Lagos',
    paymentMethods: ['Paystack', 'Flutterwave', 'Bank Transfer (NIBSS)', 'USD Wire'],
    taxInfo: 'FIRS Nigeria TIN / VAT Invoicing',
    ndaJurisdiction: 'Federal High Court of Nigeria (Lagos)',
    phonePrefix: '+234',
    isPopular: true,
  },
  {
    code: 'CD',
    name: 'RD Congo',
    nativeName: 'République Démocratique du Congo',
    flag: '🇨🇩',
    continent: 'Africa',
    region: 'Afrique Centrale',
    currency: 'USD',
    currencySymbol: '$',
    timezones: ['Africa/Kinshasa', 'Africa/Lubumbashi'],
    localHub: 'Relais Grand Kivu & Kinshasa (Hub Kigali)',
    hubCity: 'Kinshasa / Goma',
    paymentMethods: ['M-Pesa Vodacom', 'Orange Money RDC', 'Airtel Money', 'Rawbank Wire', 'USD Cash/Wire'],
    taxInfo: 'Facture DGI RDC (Régime Export ou TVA locale)',
    ndaJurisdiction: 'Droit OHADA Kinshasa',
    phonePrefix: '+243',
    isPopular: true,
  },
  {
    code: 'ML',
    name: 'Mali',
    nativeName: 'Mali',
    flag: '🇲🇱',
    continent: 'Africa',
    region: 'Afrique de l’Ouest (UEMOA)',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Bamako'],
    localHub: 'Hub Almadies & R&D Dakar (Zone UEMOA)',
    hubCity: 'Bamako',
    paymentMethods: ['Orange Money Mali', 'Wave Mali', 'Moov Money ML', 'Virement UEMOA'],
    taxInfo: 'Facture Normalisée UEMOA',
    ndaJurisdiction: 'Droit OHADA Bamako',
    phonePrefix: '+223',
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    nativeName: 'Burkina Faso',
    flag: '🇧🇫',
    continent: 'Africa',
    region: 'Afrique de l’Ouest (UEMOA)',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Ouagadougou'],
    localHub: 'Hub Almadies Dakar / Abidjan',
    hubCity: 'Ouagadougou',
    paymentMethods: ['Orange Money BF', 'Moov Money BF', 'Coris Bank Wire'],
    taxInfo: 'Facture Normalisée UEMOA',
    ndaJurisdiction: 'Droit OHADA',
    phonePrefix: '+226',
  },
  {
    code: 'BJ',
    name: 'Bénin',
    nativeName: 'Bénin',
    flag: '🇧🇯',
    continent: 'Africa',
    region: 'Afrique de l’Ouest (UEMOA)',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Porto-Novo'],
    localHub: 'Hub Tech Abidjan / Dakar',
    hubCity: 'Cotonou',
    paymentMethods: ['MTN MoMo Bénin', 'Moov Money BJ', 'Celtiis Cash', 'Virement UEMOA'],
    taxInfo: 'Facture Normalisée e-MECeF Bénin',
    ndaJurisdiction: 'Droit OHADA Cotonou',
    phonePrefix: '+229',
  },
  {
    code: 'TG',
    name: 'Togo',
    nativeName: 'Togo',
    flag: '🇹🇬',
    continent: 'Africa',
    region: 'Afrique de l’Ouest (UEMOA)',
    currency: 'XOF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Lome'],
    localHub: 'Hub Tech Abidjan / Dakar',
    hubCity: 'Lomé',
    paymentMethods: ['T-Money Togo', 'Flooz Moov', 'Ecobank Wire', 'Virement UEMOA'],
    taxInfo: 'Facture Normalisée OTR Togo',
    ndaJurisdiction: 'Droit OHADA Lomé',
    phonePrefix: '+228',
  },
  {
    code: 'GA',
    name: 'Gabon',
    nativeName: 'Gabon',
    flag: '🇬🇦',
    continent: 'Africa',
    region: 'Afrique Centrale (CEMAC)',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Libreville'],
    localHub: 'Antenne CEMAC (Douala / Kigali)',
    hubCity: 'Libreville',
    paymentMethods: ['Airtel Money Gabon', 'Moov Money GA', 'BGFI Bank Wire'],
    taxInfo: 'Régime Fiscal CEMAC DGI Gabon',
    ndaJurisdiction: 'Droit OHADA Libreville',
    phonePrefix: '+241',
  },
  {
    code: 'CG',
    name: 'Congo-Brazzaville',
    nativeName: 'République du Congo',
    flag: '🇨🇬',
    continent: 'Africa',
    region: 'Afrique Centrale (CEMAC)',
    currency: 'XAF',
    currencySymbol: 'FCFA',
    timezones: ['Africa/Brazzaville'],
    localHub: 'Antenne CEMAC / Kigali',
    hubCity: 'Brazzaville',
    paymentMethods: ['MTN MoMo Congo', 'Airtel Money CG', 'Virement CEMAC'],
    taxInfo: 'Régime CEMAC DGI Congo',
    ndaJurisdiction: 'Droit OHADA Brazzaville',
    phonePrefix: '+242',
  },

  // Europe & Diaspora
  {
    code: 'FR',
    name: 'France',
    nativeName: 'France',
    flag: '🇫🇷',
    continent: 'Europe',
    region: 'Europe (Paris Hub)',
    currency: 'EUR',
    currencySymbol: '€',
    timezones: ['Europe/Paris'],
    localHub: 'Bureau de Liaison & Partenariats Paris',
    hubCity: 'Paris',
    paymentMethods: ['Virement Bancaire SEPA Instantané', 'Carte Bancaire CB / Visa / Mastercard', 'Prélèvement SEPA', 'Stripe B2B'],
    taxInfo: 'Exportation de Services B2B Hors UE (0% TVA - Art. 259 B du CGI) ou Facturation Internationale',
    ndaJurisdiction: 'Tribunal de Commerce de Paris (Droit Français & Européen)',
    phonePrefix: '+33',
    isPopular: true,
  },
  {
    code: 'BE',
    name: 'Belgique',
    nativeName: 'België / Belgique',
    flag: '🇧🇪',
    continent: 'Europe',
    region: 'Europe (Bruxelles)',
    currency: 'EUR',
    currencySymbol: '€',
    timezones: ['Europe/Brussels'],
    localHub: 'Bureau de Liaison Paris / Diaspora',
    hubCity: 'Bruxelles',
    paymentMethods: ['Virement SEPA', 'Bancontact', 'Carte Bancaire', 'Stripe'],
    taxInfo: 'Prestation Internationale Hors UE (0% TVA)',
    ndaJurisdiction: 'Droit Européen & Commercial',
    phonePrefix: '+32',
  },
  {
    code: 'CH',
    name: 'Suisse',
    nativeName: 'Schweiz / Suisse / Svizzera',
    flag: '🇨🇭',
    continent: 'Europe',
    region: 'Europe (Genève / Zurich)',
    currency: 'EUR',
    currencySymbol: 'EUR / CHF',
    timezones: ['Europe/Zurich'],
    localHub: 'Partenariats Fintech & Private Banking (Paris Hub)',
    hubCity: 'Genève / Zurich',
    paymentMethods: ['Virement Bancaire Suisse (IBAN CH)', 'SEPA EUR', 'TWINT / Stripe', 'Wire USD'],
    taxInfo: 'Prestation Internationale B2B Exonérée TVA Suisse',
    ndaJurisdiction: 'Cour Arbitrale de Genève ou Paris',
    phonePrefix: '+41',
    isPopular: true,
  },
  {
    code: 'GB',
    name: 'Royaume-Uni',
    nativeName: 'United Kingdom',
    flag: '🇬🇧',
    continent: 'Europe',
    region: 'UK & London Tech Hub',
    currency: 'GBP',
    currencySymbol: '£',
    timezones: ['Europe/London'],
    localHub: 'London Liaison & Anglophone Africa Hub',
    hubCity: 'London',
    paymentMethods: ['Faster Payments (BACS / CHAPS)', 'UK Debit/Credit Card', 'International Wire (GBP/USD)'],
    taxInfo: 'Zero-rated International Export of Software Services',
    ndaJurisdiction: 'English Commercial Law (London Court of International Arbitration)',
    phonePrefix: '+44',
    isPopular: true,
  },
  {
    code: 'DE',
    name: 'Allemagne',
    nativeName: 'Deutschland',
    flag: '🇩🇪',
    continent: 'Europe',
    region: 'Europe (Berlin / Francfort)',
    currency: 'EUR',
    currencySymbol: '€',
    timezones: ['Europe/Berlin'],
    localHub: 'Bureau de Liaison Paris Hub (Zone UE)',
    hubCity: 'Berlin',
    paymentMethods: ['SEPA-Überweisung', 'Kreditkarte', 'Sofort / Stripe'],
    taxInfo: 'Steuerfreie grenzüberschreitende Dienstleistung (0% MwSt)',
    ndaJurisdiction: 'Europäisches Handelsrecht',
    phonePrefix: '+49',
  },

  // Amérique du Nord
  {
    code: 'US',
    name: 'États-Unis',
    nativeName: 'United States of America',
    flag: '🇺🇸',
    continent: 'North America',
    region: 'USA & Silicon Valley Tech Gateway',
    currency: 'USD',
    currencySymbol: '$',
    timezones: ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles'],
    localHub: 'US / Global Advisory & Nearshore Pods',
    hubCity: 'New York / San Francisco',
    paymentMethods: ['US ACH Domestic Wire', 'Fedwire / International SWIFT USD', 'Stripe Corporate Card', 'Wise B2B'],
    taxInfo: 'US W-8BEN-E Compliant Software Services / 0% Withholding Foreign Contractor',
    ndaJurisdiction: 'Delaware / New York State Court Jurisdiction',
    phonePrefix: '+1',
    isPopular: true,
  },
  {
    code: 'CA',
    name: 'Canada',
    nativeName: 'Canada',
    flag: '🇨🇦',
    continent: 'North America',
    region: 'Canada (Montréal / Toronto)',
    currency: 'CAD',
    currencySymbol: 'CAD$',
    timezones: ['America/Toronto', 'America/Montreal', 'America/Vancouver'],
    localHub: 'Francophonie & Americas Pod',
    hubCity: 'Montréal',
    paymentMethods: ['Interac e-Transfer B2B', 'Direct Deposit / Wire CAD/USD', 'Credit Card (Stripe)'],
    taxInfo: 'Export of Intellectual Property & Tech Services (GST/PST 0% Zero-Rated)',
    ndaJurisdiction: 'Cour Supérieure du Québec / Ontario Commercial Court',
    phonePrefix: '+1',
    isPopular: true,
  },

  // Moyen-Orient & Asie
  {
    code: 'AE',
    name: 'Émirats Arabes Unis',
    nativeName: 'الإمارات العربية المتحدة (UAE)',
    flag: '🇦🇪',
    continent: 'Middle East',
    region: 'Middle East (Dubaï DIFC)',
    currency: 'USD',
    currencySymbol: 'USD / AED',
    timezones: ['Asia/Dubai'],
    localHub: 'Middle East & Africa Bridge (Kigali / Dubaï)',
    hubCity: 'Dubaï',
    paymentMethods: ['UAE Domestic Bank Transfer', 'USD SWIFT Wire', 'Corporate Credit Card'],
    taxInfo: '0% Corporate Tax Export of Digital Services',
    ndaJurisdiction: 'DIFC Courts Dubai / International Arbitration',
    phonePrefix: '+971',
    isPopular: true,
  },
  {
    code: 'CN',
    name: 'Chine',
    nativeName: '中国 (China)',
    flag: '🇨🇳',
    continent: 'Asia',
    region: 'Asie & Partenariats Internationaux',
    currency: 'USD',
    currencySymbol: 'USD / CNY',
    timezones: ['Asia/Shanghai', 'Asia/Hong_Kong'],
    localHub: 'International Gateway Pod',
    hubCity: 'Beijing / Hong Kong',
    paymentMethods: ['International Wire Transfer (SWIFT USD)', 'Letter of Credit B2B', 'UnionPay Global'],
    taxInfo: 'International Software Outsourcing Agreement',
    ndaJurisdiction: 'Hong Kong International Arbitration Centre (HKIAC)',
    phonePrefix: '+86',
  },
];

export const getCountryByCode = (code: string): CountryData => {
  const normalized = (code || '').trim().toUpperCase();
  return COUNTRIES_DATA.find((c) => c.code === normalized) || COUNTRIES_DATA[0];
};

export const detectVisitorCountry = (): CountryData => {
  try {
    // 1. Check local storage for user choice
    const saved = localStorage.getItem('vitech_user_country');
    if (saved) {
      const found = COUNTRIES_DATA.find((c) => c.code === saved);
      if (found) return found;
    }

    // 2. Check browser timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (userTimezone) {
      const matchByTz = COUNTRIES_DATA.find((c) => c.timezones.includes(userTimezone));
      if (matchByTz) return matchByTz;

      // Partial timezone match
      if (userTimezone.includes('Dakar')) return getCountryByCode('SN');
      if (userTimezone.includes('Abidjan')) return getCountryByCode('CI');
      if (userTimezone.includes('Kigali')) return getCountryByCode('RW');
      if (userTimezone.includes('Douala') || userTimezone.includes('Lagos')) return getCountryByCode('CM');
      if (userTimezone.includes('Casablanca')) return getCountryByCode('MA');
      if (userTimezone.includes('Nairobi')) return getCountryByCode('KE');
      if (userTimezone.includes('Paris')) return getCountryByCode('FR');
      if (userTimezone.includes('Brussels')) return getCountryByCode('BE');
      if (userTimezone.includes('Zurich') || userTimezone.includes('Geneva')) return getCountryByCode('CH');
      if (userTimezone.includes('London')) return getCountryByCode('GB');
      if (userTimezone.includes('New_York') || userTimezone.includes('Los_Angeles') || userTimezone.includes('Chicago')) return getCountryByCode('US');
      if (userTimezone.includes('Toronto') || userTimezone.includes('Montreal')) return getCountryByCode('CA');
      if (userTimezone.includes('Dubai')) return getCountryByCode('AE');
    }

    // 3. Check browser language (e.g. fr-SN, fr-CI, rw-RW, en-KE, en-US, fr-FR)
    const navLang = (navigator.language || '').toLowerCase();
    if (navLang.includes('-sn')) return getCountryByCode('SN');
    if (navLang.includes('-ci')) return getCountryByCode('CI');
    if (navLang.includes('-rw')) return getCountryByCode('RW');
    if (navLang.includes('-cm')) return getCountryByCode('CM');
    if (navLang.includes('-ma')) return getCountryByCode('MA');
    if (navLang.includes('-ke')) return getCountryByCode('KE');
    if (navLang.includes('-ng')) return getCountryByCode('NG');
    if (navLang.includes('-fr')) return getCountryByCode('FR');
    if (navLang.includes('-be')) return getCountryByCode('BE');
    if (navLang.includes('-ca')) return getCountryByCode('CA');
    if (navLang.includes('-us')) return getCountryByCode('US');
    if (navLang.includes('-gb')) return getCountryByCode('GB');
  } catch {
    // Fallback to default
  }

  return COUNTRIES_DATA[0]; // Default to Sénégal (SN)
};
