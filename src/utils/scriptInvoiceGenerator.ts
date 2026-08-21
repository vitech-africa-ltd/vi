import jsPDF from 'jspdf';
import { ScriptProduct } from '../data/scriptsData';

export interface ScriptInvoiceData {
  invoiceNumber: string;
  orderReference: string;
  issueDate: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  paymentMethod: 'MTN Mobile Money' | 'Airtel Money' | 'Carte Bancaire / Stripe' | 'Crypto' | string;
  transactionRef: string;
  product: ScriptProduct;
  licenseKey: string;
  licenseType: 'Commerciale Standard' | 'Multi-Domaines' | 'Entreprise Extended';
  amountUSD: number;
  amountRWF: number;
  amountXOF?: number;
  selectedCurrency: 'USD' | 'RWF' | 'EUR' | 'XOF';
  taxRatePercent?: number;
}

/**
 * Generate and download an official commercial PDF invoice for a purchased Vitech Script.
 */
export function generateScriptInvoicePDF(data: ScriptInvoiceData): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // Header Banner: Dark Navy
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line: Cyan
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Brand Name & Tagline
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('VITECH AFRICA — SCRIPTS & TECH MARKETPLACE', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(103, 232, 249); // cyan-300
  doc.text("Pôle d'Ingénierie Logicielle, Codes Sources Audités & Licences 2026", margin, 22);

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text('Siège : Rwanda Innovation City (Kigali) | Hubs : Dakar, Abidjan & Paris', margin, 28);
  doc.text('TIN/NIF : RW-9984712-A | Contact : contact.vitechdev@gmail.com | www.vitech-africa.com', margin, 34);

  // Top-Right Invoice Badge
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(pageWidth - margin - 65, 8, 65, 28, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text('FACTURE ACQUITTÉE', pageWidth - margin - 61, 15);

  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`N° Facture : ${data.invoiceNumber}`, pageWidth - margin - 61, 21);
  doc.setTextColor(203, 213, 225);
  doc.text(`Réf : ${data.orderReference}`, pageWidth - margin - 61, 26);
  doc.text(`Date : ${data.issueDate}`, pageWidth - margin - 61, 31);

  let currentY = 52;

  // Client & Transaction Info Cards (2 Columns)
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, contentWidth, 32, 2, 2, 'FD');

  // Left: Client info
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('CLIENT & BÉNÉFICIAIRE :', margin + 4, currentY + 7);

  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(data.clientName || 'Développeur / Entreprise Vérifiée', margin + 4, currentY + 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Email : ${data.clientEmail}`, margin + 4, currentY + 19);
  if (data.clientPhone) {
    doc.text(`Mobile : ${data.clientPhone}`, margin + 4, currentY + 25);
  } else {
    doc.text(`Statut : Utilisateur Enregistré Vitech`, margin + 4, currentY + 25);
  }

  // Right: Payment Details
  const rightColX = margin + contentWidth / 2 + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(30, 41, 59);
  doc.text('DÉTAILS DU RÈGLEMENT :', rightColX, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Mode : ${data.paymentMethod}`, rightColX, currentY + 13);
  doc.text(`Transaction ID : ${data.transactionRef}`, rightColX, currentY + 19);
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.setFont('helvetica', 'bold');
  doc.text('Statut : PAIEMENT CONFIRMÉ & VALIDÉ', rightColX, currentY + 25);

  currentY += 38;

  // Itemized Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, currentY, contentWidth, 8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text('ARTICLE & CODE SOURCE', margin + 4, currentY + 5.5);
  doc.text('TYPE DE LICENCE', margin + 95, currentY + 5.5);
  doc.text('SCORE SÉC.', margin + 140, currentY + 5.5);
  doc.text('PRIX TOTAL', margin + contentWidth - 22, currentY + 5.5);

  currentY += 8;

  // Item Row
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.rect(margin, currentY, contentWidth, 18, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.product.title.slice(0, 45), margin + 4, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Version : ${data.product.version} | Stack : ${data.product.analysis.language} (${data.product.analysis.framework})`, margin + 4, currentY + 12);

  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text(data.licenseType, margin + 95, currentY + 8);

  doc.setTextColor(6, 182, 212); // cyan-600
  doc.setFont('helvetica', 'bold');
  doc.text(`${data.product.analysis.securityScore}/100 (OWASP)`, margin + 140, currentY + 8);

  const displayPrice = data.selectedCurrency === 'RWF' 
    ? `${data.amountRWF.toLocaleString()} RWF` 
    : `$${data.amountUSD} USD`;
  doc.setTextColor(15, 23, 42);
  doc.text(displayPrice, margin + contentWidth - 22, currentY + 8);

  currentY += 24;

  // License Certificate Box
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(20, 184, 166); // teal-500
  doc.roundedRect(margin, currentY, contentWidth, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 118, 110); // teal-700
  doc.text('CERTIFICAT DE LICENCE NUMÉRIQUE COMMERCIAL :', margin + 4, currentY + 7);

  doc.setFont('courier', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`CLÉ OFFICIELLE : ${data.licenseKey}`, margin + 4, currentY + 14);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('• Cette clé de licence vous octroie les droits d exploitation commerciale perpétuelle du code source.', margin + 4, currentY + 20);
  doc.text('• Empreinte forensique de traçabilité injectée dans le fichier metadata du ZIP (.vitech-origin-meta.dat).', margin + 4, currentY + 25);
  doc.text('• Accès garanti aux correctifs de sécurité et mises à jour pendant 12 mois via l espace membre Vitech.', margin + 4, currentY + 30);

  currentY += 40;

  // Financial Summary Breakdown (Right side)
  const summaryX = margin + contentWidth - 85;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(summaryX, currentY, 85, 34, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Sous-total HT :', summaryX + 4, currentY + 7);
  doc.text(displayPrice, summaryX + 50, currentY + 7);

  doc.text('TVA / Taxe (0% Export Dev) :', summaryX + 4, currentY + 14);
  doc.text('0.00', summaryX + 50, currentY + 14);

  doc.setDrawColor(203, 213, 225);
  doc.line(summaryX + 4, currentY + 18, summaryX + 81, currentY + 18);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL RÉGLÉ :', summaryX + 4, currentY + 26);
  doc.setTextColor(6, 182, 212); // cyan-600
  doc.text(displayPrice, summaryX + 50, currentY + 26);

  currentY += 40;

  // Official Signature & Digital Seal Block
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 41, 59);
  doc.text('SCELLÉ NUMÉRIQUE & APPROBATION DIRECTION TECHNIQUE :', margin, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text('V&I Tech Africa Ltd — Pôle Sécurité des Systèmes & Passerelles MoMo', margin, currentY + 5);
  doc.text(`Généré électroniquement le ${data.issueDate} avec signature cryptographique certifiée.`, margin, currentY + 10);

  // Stamp Box
  doc.setDrawColor(6, 182, 212);
  doc.roundedRect(pageWidth - margin - 55, currentY - 4, 55, 20, 1.5, 1.5, 'D');
  doc.setTextColor(6, 182, 212);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.text('VITECH AFRICA VERIFIED', pageWidth - margin - 51, currentY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('GATEWAY: MTN/AIRTEL MOMO', pageWidth - margin - 51, currentY + 7);
  doc.text('AUTHENTICITY SEAL: SEC-2026', pageWidth - margin - 51, currentY + 12);

  // Footer text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text('Pour toute question ou support technique : contact.vitechdev@gmail.com | Support 24/7 Espace Membre Vitech Scripts.', margin, 285);

  return doc;
}

/**
 * Triggers instant download of the PDF invoice.
 */
export function downloadScriptInvoicePDF(data: ScriptInvoiceData): void {
  const doc = generateScriptInvoicePDF(data);
  doc.save(`Facture-VitechScripts-${data.invoiceNumber}.pdf`);
}
