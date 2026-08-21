import jsPDF from 'jspdf';
import { CountryData } from '../data/countriesData';

export interface QuotePDFData {
  quoteRefNumber: string;
  issueDate: string;
  validUntil: string;
  clientName?: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  country: CountryData;
  serviceName: string;
  platforms: string[];
  features: string[];
  slaOption: string;
  timelineWeeks: number;
  totalEUR: number;
  formattedLocalPrice: string;
  formattedEURPrice: string;
  formattedUSDPrice: string;
}

export function generateQuotePDF(data: QuotePDFData) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;

  // Background Theme Accent Top Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Blue Accent Bar
  doc.setFillColor(37, 99, 235); // blue-600
  doc.rect(0, 42, pageWidth, 2.5, 'F');

  // Company Brand
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('V&I TECH AFRICA LTD', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text("Pôle d'Ingénierie Logicielle Panafricain & International", margin, 22);

  doc.setFontSize(7.5);
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`Hub Référent : ${data.country.localHub} (${data.country.hubCity})`, margin, 28);
  doc.text(`Contact Officiel : direction@vitech-africa.com | www.vitech-africa.com`, margin, 34);

  // Quote Reference Box in Top Right
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(pageWidth - margin - 60, 9, 60, 26, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(56, 189, 248); // cyan-400
  doc.text('DEVIS OFFICIEL', pageWidth - margin - 56, 16);

  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  doc.text(`Réf : ${data.quoteRefNumber}`, pageWidth - margin - 56, 22);
  doc.setTextColor(203, 213, 225);
  doc.text(`Date : ${data.issueDate}`, pageWidth - margin - 56, 27);
  doc.text(`Validité : ${data.validUntil}`, pageWidth - margin - 56, 32);

  // Body Start Y
  let currentY = 52;

  // Beneficiary & Territorial Framework (2 Columns Box)
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.roundedRect(margin, currentY, contentWidth, 30, 2, 2, 'FD');

  // Left Col: Client
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138); // blue-900
  doc.text('BÉNÉFICIAIRE / CLIENT :', margin + 4, currentY + 6);

  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42); // slate-900
  const clientTitle = data.clientCompany || data.clientName || 'Client Entreprise / Organisation';
  doc.text(clientTitle.slice(0, 45), margin + 4, currentY + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105); // slate-600
  if (data.clientEmail) doc.text(`Email : ${data.clientEmail}`, margin + 4, currentY + 18);
  if (data.clientPhone) doc.text(`Tél : ${data.clientPhone}`, margin + 4, currentY + 23);

  // Right Col: Territorial & Legal framework
  const rightColX = margin + (contentWidth / 2) + 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(30, 58, 138);
  doc.text('CADRE GÉOGRAPHIQUE & FISCAL :', rightColX, currentY + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Pays : ${data.country.name} (${data.country.region})`, rightColX, currentY + 12);
  doc.text(`Devise contractuelle : ${data.country.currency} (${data.country.currencySymbol})`, rightColX, currentY + 17);
  doc.text(`Juridiction NDA : ${data.country.ndaJurisdiction}`, rightColX, currentY + 22);

  currentY += 36;

  // Technical Scope Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 23, 42);
  doc.text('1. DÉTAIL DES PRESTATIONS & ARCHITECTURE LOGICIELLE', margin, currentY);

  currentY += 4;

  // Table Header
  doc.setFillColor(241, 245, 249); // slate-100
  doc.rect(margin, currentY, contentWidth, 7, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, currentY + 7, margin + contentWidth, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85); // slate-700
  doc.text('Composant & Livrable', margin + 3, currentY + 4.8);
  doc.text('Spécifications Techniques Incluses', margin + 55, currentY + 4.8);
  doc.text('Délai', margin + contentWidth - 18, currentY + 4.8);

  currentY += 7;

  // Table Row 1: Core Service
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(data.serviceName.slice(0, 32), margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  const specText = 'Conception UX/UI, architecture Cloud résiliente, tests automatisés & code source complet.';
  doc.text(specText, margin + 55, currentY + 5, { maxWidth: contentWidth - 75 });

  doc.setFont('helvetica', 'bold');
  doc.text(`${data.timelineWeeks} sem.`, margin + contentWidth - 16, currentY + 5);

  currentY += 10;
  doc.setDrawColor(241, 245, 249);
  doc.line(margin, currentY, margin + contentWidth, currentY);

  // Table Row 2: Platforms
  if (data.platforms.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Plateformes Cibles', margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(data.platforms.join(', '), margin + 55, currentY + 5, { maxWidth: contentWidth - 75 });

    doc.text('Inclus', margin + contentWidth - 16, currentY + 5);
    currentY += 9;
    doc.line(margin, currentY, margin + contentWidth, currentY);
  }

  // Table Row 3: Features
  if (data.features.length > 0) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text('Modules & Intégrations', margin + 3, currentY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(71, 85, 105);
    doc.text(data.features.join(' • '), margin + 55, currentY + 5, { maxWidth: contentWidth - 75 });

    doc.text('Inclus', margin + contentWidth - 16, currentY + 5);
    currentY += 12;
    doc.line(margin, currentY, margin + contentWidth, currentY);
  }

  // Table Row 4: SLA & Support
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('SLA & Support Dédié', margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`${data.slaOption} — Garantie contractuelle, monitoring proactif & astreinte 24/7.`, margin + 55, currentY + 5, { maxWidth: contentWidth - 75 });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 149, 193);
  doc.text('Garanti', margin + contentWidth - 16, currentY + 5);

  currentY += 12;

  // Pricing Summary Card
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, contentWidth, 24, 2, 2, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(147, 197, 253); // blue-300
  doc.text(`INVESTISSEMENT GLOBAL ESTIMÉ (${data.country.name.toUpperCase()}) :`, margin + 6, currentY + 7);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(52, 211, 153); // emerald-400
  doc.text(data.formattedLocalPrice, margin + 6, currentY + 16);

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Équivalent : ${data.formattedEURPrice} / ${data.formattedUSDPrice}`, margin + 6, currentY + 21);

  doc.setFontSize(8);
  doc.setTextColor(147, 197, 253);
  doc.text('Délai Global de Livraison :', margin + contentWidth - 55, currentY + 8);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text(`${data.timelineWeeks} Semaines (Sprints Agile)`, margin + contentWidth - 55, currentY + 16);

  currentY += 30;

  // Payment terms & Guarantees (2 boxes)
  const halfBoxWidth = (contentWidth - 4) / 2;

  // Box 1: Payment Schedule
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, currentY, halfBoxWidth, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('MODALITÉS DE RÈGLEMENT :', margin + 3, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text(`Moyens acceptés : ${data.country.paymentMethods.join(', ')}`, margin + 3, currentY + 10, { maxWidth: halfBoxWidth - 6 });
  doc.text('Échelonnement : 40% démarrage • 30% mi-parcours • 30% recette finale.', margin + 3, currentY + 18, { maxWidth: halfBoxWidth - 6 });

  // Box 2: Guarantees & IP
  doc.roundedRect(margin + halfBoxWidth + 4, currentY, halfBoxWidth, 26, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(30, 58, 138);
  doc.text('PROPRIÉTÉ INTELLECTUELLE & SLA :', margin + halfBoxWidth + 7, currentY + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);
  doc.text('Cession exclusive du code source, droits de PI et accès administrateurs dès règlement final.', margin + halfBoxWidth + 7, currentY + 10, { maxWidth: halfBoxWidth - 6 });
  doc.text('Accord de non-divulgation (NDA) inclus et opposable juridiquement.', margin + halfBoxWidth + 7, currentY + 18, { maxWidth: halfBoxWidth - 6 });

  currentY += 32;

  // Signatures Section
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, currentY, margin + contentWidth, currentY);
  currentY += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('Pour V&I TECH AFRICA LTD', margin, currentY);
  doc.text('Pour le Client (Bon pour accord & validation)', margin + contentWidth - 75, currentY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text('Direction Générale & Lead Architecture', margin, currentY + 4);
  doc.text('Signature & Cachet de l\'entreprise', margin + contentWidth - 75, currentY + 4);

  // Digital stamp badge
  doc.setFillColor(239, 246, 255);
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(margin, currentY + 8, 55, 10, 1, 1, 'FD');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(29, 78, 216);
  doc.text('✓ Cachet Électronique & Signature Certifiée', margin + 3, currentY + 14);

  // Client signature line
  doc.setDrawColor(148, 163, 184);
  doc.setLineDashPattern([2, 2], 0);
  doc.line(margin + contentWidth - 75, currentY + 18, margin + contentWidth, currentY + 18);
  doc.setLineDashPattern([], 0);

  // Footer Bottom Page
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Document généré par la plateforme V&I TECH AFRICA LTD • Tous droits réservés • Ce devis préliminaire est régi par nos Conditions Générales d\'Ingénierie.', margin, pageHeight - 8);

  // Save the document directly as PDF file
  const filename = `Devis_${data.country.code}_${data.quoteRefNumber}.pdf`;
  doc.save(filename);
  return filename;
}
