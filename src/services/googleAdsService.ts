import { GoogleAdsConfig, AdsConversionEventType } from '../types';

export const DEFAULT_GOOGLE_ADS_CONFIG: GoogleAdsConfig = {
  adsConversionEnabled: true,
  googleAdsId: 'AW-11482938102',
  conversionLabelInquiry: 'eK9jCN-33IsZEPaK7_Iq',
  conversionLabelBooking: 'mR2vCL_81IsZEPaK7_Iq',
  conversionLabelPurchase: 'wP7xCK_42IsZEPaK7_Iq',
  conversionLabelEstimate: 'qZ5yDK_19IsZEPaK7_Iq',
  adSenseEnabled: true,
  adSensePublisherId: 'ca-pub-3096798858530242',
  autoAdsEnabled: true,
  blogBannerSlotId: '5482910394',
  scriptsMarketplaceSlotId: '8291047281',
  testMode: false,
  adsTxtCustom: 'google.com, pub-3096798858530242, DIRECT, f08c47fec0942fa0',
  updatedAt: new Date().toISOString(),
};

/**
 * Injects or updates Google Ads (gtag AW-) & Google AdSense scripts in the browser head
 */
export const initGoogleAdsScripts = (config: GoogleAdsConfig): void => {
  if (typeof window === 'undefined') return;

  // 1. Google Ads Conversion Tag (gtag.js)
  if (config.adsConversionEnabled && config.googleAdsId && config.googleAdsId.trim() !== '') {
    const trimmedAdsId = config.googleAdsId.trim();

    // Ensure dataLayer exists
    (window as any).dataLayer = (window as any).dataLayer || [];
    if (!(window as any).gtag) {
      (window as any).gtag = function () {
        (window as any).dataLayer.push(arguments);
      };
      (window as any).gtag('js', new Date());
    }

    // Configure the Google Ads Account ID
    try {
      (window as any).gtag('config', trimmedAdsId);
    } catch (e) {
      console.warn('Google Ads gtag config error:', e);
    }

    // Check if script tag exists
    const scriptSelector = `script[src*="googletagmanager.com/gtag/js?id=${trimmedAdsId}"]`;
    if (!document.querySelector(scriptSelector)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${trimmedAdsId}`;
      document.head.appendChild(script);
    }
  }

  // 2. Google AdSense Script
  if (config.adSenseEnabled && config.adSensePublisherId && config.adSensePublisherId.trim() !== '') {
    const pubId = config.adSensePublisherId.trim();
    const formattedPubId = pubId.startsWith('ca-pub-') ? pubId : `ca-pub-${pubId.replace(/^pub-/, '')}`;

    const adSenseScriptSelector = `script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPubId}"]`;
    if (!document.querySelector(adSenseScriptSelector)) {
      const adScript = document.createElement('script');
      adScript.async = true;
      adScript.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${formattedPubId}`;
      adScript.crossOrigin = 'anonymous';
      document.head.appendChild(adScript);
    }
  }
};

/**
 * Fires a Google Ads conversion event via gtag
 */
export const trackGoogleAdsConversion = (
  eventType: AdsConversionEventType,
  details?: {
    value?: number;
    currency?: string;
    transactionId?: string;
    customLabel?: string;
  }
): void => {
  if (typeof window === 'undefined') return;

  // Retrieve current active config from localStorage cache
  let config: GoogleAdsConfig = DEFAULT_GOOGLE_ADS_CONFIG;
  try {
    const saved = localStorage.getItem('vitech_cms_google_ads_config');
    if (saved) {
      config = { ...DEFAULT_GOOGLE_ADS_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    // fallback
  }

  if (!config.adsConversionEnabled || !config.googleAdsId) {
    return;
  }

  let conversionLabel = '';
  switch (eventType) {
    case 'inquiry':
      conversionLabel = config.conversionLabelInquiry || '';
      break;
    case 'booking':
      conversionLabel = config.conversionLabelBooking || '';
      break;
    case 'purchase':
      conversionLabel = config.conversionLabelPurchase || '';
      break;
    case 'estimate':
      conversionLabel = config.conversionLabelEstimate || '';
      break;
    case 'custom':
      conversionLabel = details?.customLabel || '';
      break;
  }

  const sendTo = conversionLabel
    ? `${config.googleAdsId.trim()}/${conversionLabel.trim()}`
    : config.googleAdsId.trim();

  const payload: Record<string, any> = {
    send_to: sendTo,
  };

  if (details?.value !== undefined && details.value > 0) {
    payload.value = details.value;
    payload.currency = details.currency || 'EUR';
  }

  if (details?.transactionId) {
    payload.transaction_id = details.transactionId;
  }

  // Trigger gtag event
  try {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'conversion', payload);
    }
  } catch (err) {
    console.warn('gtag conversion trigger error:', err);
  }

  // Dispatch custom event for UI feedback & monitoring in Admin Portal
  const eventPayload = {
    eventType,
    sendTo,
    payload,
    timestamp: new Date().toLocaleTimeString(),
    testMode: config.testMode,
  };

  window.dispatchEvent(
    new CustomEvent('vitech_ads_conversion', { detail: eventPayload })
  );
};

/**
 * Generate standard ads.txt compliant string
 */
export const generateAdsTxtContent = (publisherId: string): string => {
  const cleanPubId = publisherId.replace(/^(ca-)?pub-/, '');
  return `# ads.txt - V&I TECH AFRICA LTD
# Google AdSense authorized seller configuration
google.com, pub-${cleanPubId || '3096798858530242'}, DIRECT, f08c47fec0942fa0
`;
};

/**
 * Trigger immediate browser download of ads.txt
 */
export const downloadAdsTxtFile = (publisherId: string): void => {
  if (typeof window === 'undefined') return;
  const content = generateAdsTxtContent(publisherId);
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'ads.txt';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
