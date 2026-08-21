import { ScriptProduct } from '../data/scriptsData';
import { ScriptInvoiceData, downloadScriptInvoicePDF } from '../utils/scriptInvoiceGenerator';

export type MomoProvider = 'mtn_momo' | 'airtel_money' | 'orange_money' | 'wave_ci' | 'stripe_card';

export interface MomoPaymentRequest {
  provider: MomoProvider;
  phoneNumber: string;
  customerName: string;
  customerEmail: string;
  product: ScriptProduct;
  currency: 'RWF' | 'USD' | 'EUR' | 'XOF';
  amountRWF: number;
  amountUSD: number;
}

export interface MomoTransactionResult {
  success: boolean;
  transactionId: string;
  orderReference: string;
  licenseKey: string;
  provider: MomoProvider;
  providerLabel: string;
  phoneNumber: string;
  customerName: string;
  customerEmail: string;
  amountPaid: string;
  timestamp: string;
  invoiceData: ScriptInvoiceData;
}

export interface ProviderInfo {
  id: MomoProvider;
  name: string;
  ussdCode: string;
  country: string;
  currency: string;
  brandColor: string;
  logoText: string;
  prefixes: string[];
}

export const MOMO_PROVIDERS: Record<MomoProvider, ProviderInfo> = {
  mtn_momo: {
    id: 'mtn_momo',
    name: 'MTN Mobile Money',
    ussdCode: '*182#',
    country: 'Rwanda / Panafricain',
    currency: 'RWF',
    brandColor: '#FFCC00',
    logoText: 'MTN MoMo',
    prefixes: ['078', '079', '25078', '25079', '78', '79', '077', '076']
  },
  airtel_money: {
    id: 'airtel_money',
    name: 'Airtel Money',
    ussdCode: '*182# / *500#',
    country: 'Rwanda / Afrique Centrale & Est',
    currency: 'RWF',
    brandColor: '#FF0000',
    logoText: 'Airtel Money',
    prefixes: ['072', '073', '25072', '25073', '72', '73', '075']
  },
  orange_money: {
    id: 'orange_money',
    name: 'Orange Money',
    ussdCode: '#144#',
    country: 'Sénégal / Côte d’Ivoire',
    currency: 'XOF',
    brandColor: '#FF7900',
    logoText: 'Orange Money',
    prefixes: ['070', '077', '22177', '22507']
  },
  wave_ci: {
    id: 'wave_ci',
    name: 'Wave Mobile Money',
    ussdCode: 'App Push',
    country: 'Sénégal & Côte d’Ivoire',
    currency: 'XOF',
    brandColor: '#1DC4FF',
    logoText: 'Wave',
    prefixes: ['221', '225']
  },
  stripe_card: {
    id: 'stripe_card',
    name: 'Carte Bancaire / Visa / Mastercard',
    ussdCode: '3D Secure',
    country: 'International',
    currency: 'USD',
    brandColor: '#6366F1',
    logoText: 'Stripe',
    prefixes: []
  }
};

/**
 * Auto-detect provider based on phone number prefix
 */
export function detectProviderFromPhone(phone: string): MomoProvider {
  const cleanPhone = phone.replace(/[\s\-\+\(\)]/g, '');
  for (const [providerKey, info] of Object.entries(MOMO_PROVIDERS)) {
    if (providerKey === 'stripe_card') continue;
    for (const prefix of info.prefixes) {
      if (cleanPhone.startsWith(prefix) || cleanPhone.includes(prefix)) {
        return providerKey as MomoProvider;
      }
    }
  }
  return 'mtn_momo';
}

/**
 * Generate cryptographic license key for the purchased product
 */
export function generateLicenseKey(productCategory: string): string {
  const catCode = productCategory.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase() || 'SCR';
  const seg1 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg2 = Math.random().toString(36).substring(2, 6).toUpperCase();
  const seg3 = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VITECH-${catCode}-${seg1}-${seg2}-${seg3}`;
}

/**
 * Simulates the real-time Mobile Money Payment Flow
 * Dispatches simulated USSD Push notification, verifies simulated PIN, and generates the PDF invoice.
 */
export async function executeMomoPayment(
  req: MomoPaymentRequest,
  onProgress?: (step: 'initiating' | 'ussd_push_sent' | 'pin_received' | 'confirming' | 'completed') => void
): Promise<MomoTransactionResult> {
  const providerInfo = MOMO_PROVIDERS[req.provider] || MOMO_PROVIDERS.mtn_momo;
  const now = new Date();
  const orderRef = `ORD-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const txnId = `${req.provider.substring(0, 3).toUpperCase()}-TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const licenseKey = generateLicenseKey(req.product.category);

  // Step 1: Initiating
  onProgress?.('initiating');
  await new Promise(r => setTimeout(r, 600));

  // Step 2: USSD Push Sent to Client Mobile
  onProgress?.('ussd_push_sent');
  await new Promise(r => setTimeout(r, 1000));

  // Step 3: PIN prompt processed
  onProgress?.('pin_received');
  await new Promise(r => setTimeout(r, 800));

  // Step 4: Webhook Confirmation
  onProgress?.('confirming');
  await new Promise(r => setTimeout(r, 600));

  // Step 5: Completed
  onProgress?.('completed');

  const invoiceData: ScriptInvoiceData = {
    invoiceNumber: `INV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    orderReference: orderRef,
    issueDate: now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    clientName: req.customerName || 'Client Vitech Développeur',
    clientEmail: req.customerEmail || 'client@vitechafrica.com',
    clientPhone: req.phoneNumber,
    paymentMethod: providerInfo.name,
    transactionRef: txnId,
    product: req.product,
    licenseKey: licenseKey,
    licenseType: 'Commerciale Standard',
    amountUSD: req.amountUSD,
    amountRWF: req.amountRWF,
    selectedCurrency: req.currency,
    taxRatePercent: 0
  };

  return {
    success: true,
    transactionId: txnId,
    orderReference: orderRef,
    licenseKey: licenseKey,
    provider: req.provider,
    providerLabel: providerInfo.name,
    phoneNumber: req.phoneNumber,
    customerName: req.customerName,
    customerEmail: req.customerEmail,
    amountPaid: req.currency === 'RWF' ? `${req.amountRWF.toLocaleString()} RWF` : `$${req.amountUSD} USD`,
    timestamp: now.toISOString(),
    invoiceData
  };
}
