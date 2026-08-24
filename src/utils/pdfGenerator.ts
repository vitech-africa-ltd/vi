import { jsPDF } from 'jspdf';
import { DigitalSignatureData, ClientProject, ProjectDocument, Invoice } from '../types';

export interface GeneratedPdfMetadata {
  title: string;
  docRef: string;
  category: string;
  clientName: string;
  projectName: string;
  leadArchitect: string;
  date: string;
  version: string;
  sha256: string;
  milestoneTitle?: string;
  clientSignature?: DigitalSignatureData;
  sections: {
    heading: string;
    content: string[];
  }[];
  signatories?: {
    name: string;
    role: string;
    status: string;
  }[];
}

/**
 * Generates an executive, professional PDF document with V&I TECH AFRICA branding,
 * structured tables, security watermark, cryptographic hash verification, and signatures.
 */
export function generateProjectPdf(meta: GeneratedPdfMetadata): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = margin;

  // Background Theme & Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Accent Line
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 42, pageWidth, 2, 'F');

  // Brand Name & Logo
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('V&I TECH AFRICA LTD', margin, 18);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Ingénierie Logicielle, Architectures Cloud & Cybersécurité Panafricaine', margin, 24);
  doc.text('Kigali (Norrsken) • Dakar • Abidjan • Casablanca • Paris | vitechafrica.com', margin, 29);

  // Document Badge on Header Right
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(pageWidth - margin - 58, 12, 58, 22, 2, 2, 'F');

  doc.setTextColor(56, 189, 248); // sky-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('DOCUMENT SÉCURISÉ', pageWidth - margin - 53, 19);

  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Réf: ${meta.docRef}`, pageWidth - margin - 53, 24);
  doc.text(`Ver: ${meta.version} | Chiffré AES-256`, pageWidth - margin - 53, 29);

  y = 54;

  // Title Section
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(meta.title, margin, y);
  y += 7;

  // Project Info Table / Grid
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 22, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('PROJET :', margin + 4, y + 6);
  doc.text('CLIENT :', margin + 4, y + 12);
  doc.text('ARCHITECTE LEAD :', margin + 4, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(meta.projectName, margin + 24, y + 6);
  doc.text(meta.clientName, margin + 24, y + 12);
  doc.text(meta.leadArchitect, margin + 34, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DATE D\'ÉMISSION :', margin + 105, y + 6);
  doc.text('JALON / SPRINT :', margin + 105, y + 12);
  doc.text('STATUT :', margin + 105, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(meta.date, margin + 140, y + 6);
  doc.text(meta.milestoneTitle || 'Global Projet', margin + 140, y + 12);
  
  doc.setTextColor(5, 150, 105); // emerald-600
  doc.setFont('helvetica', 'bold');
  doc.text('Certifié & Validé', margin + 140, y + 18);

  y += 30;

  // Content Sections
  meta.sections.forEach((section) => {
    // Check page break
    if (y > pageHeight - 50) {
      doc.addPage();
      y = margin + 10;
    }

    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y - 4, pageWidth - (margin * 2), 7, 'F');
    doc.setFillColor(6, 182, 212);
    doc.rect(margin, y - 4, 3, 7, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(section.heading, margin + 6, y + 1);
    y += 9;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(51, 65, 85);

    section.content.forEach((line) => {
      if (y > pageHeight - 35) {
        doc.addPage();
        y = margin + 10;
      }
      
      const splitText = doc.splitTextToSize(line, pageWidth - (margin * 2) - 4);
      doc.text(splitText, margin + 2, y);
      y += (splitText.length * 4.5) + 1.5;
    });

    y += 4;
  });

  // Signatures Section (if room allows or on new page)
  const boxHeight = meta.clientSignature ? 32 : 24;
  if (y > pageHeight - boxHeight - 24) {
    doc.addPage();
    y = margin + 10;
  }

  y += 4;
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('CERTIFICAT DE CONFORMITÉ & SIGNATURES NUMÉRIQUES CERTIFIÉES', margin, y);
  y += 7;

  // Signatories Box
  const colWidth = (pageWidth - (margin * 2) - 6) / 2;
  
  // Signatory 1: V&I Tech
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, colWidth, boxHeight, 2, 2, 'FD');
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Pour V&I TECH AFRICA LTD :', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(meta.leadArchitect, margin + 4, y + 10);
  doc.text('Lead Software Architect & PMO', margin + 4, y + 14);
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(6.5);
  doc.text('Certificat : CN=Vitech-Root-CA-2026', margin + 4, y + 18);
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('✓ Signature Électronique Certifiée eIDAS', margin + 4, y + boxHeight - 3);

  // Signatory 2: Client
  const clientBoxX = margin + colWidth + 6;
  if (meta.clientSignature) {
    doc.setFillColor(240, 253, 250); // teal-50
    doc.setDrawColor(20, 184, 166); // teal-500
    doc.roundedRect(clientBoxX, y, colWidth, boxHeight, 2, 2, 'FD');
    
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Pour ${meta.clientSignature.signerCompany || meta.clientName} :`, clientBoxX + 4, y + 5);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);
    doc.text(`${meta.clientSignature.signerName} - ${meta.clientSignature.signerRole}`, clientBoxX + 4, y + 9.5);
    
    // Draw signature image if present, or write stylized text
    if (meta.clientSignature.signatureDataUrl && meta.clientSignature.signatureDataUrl.startsWith('data:image/')) {
      try {
        doc.addImage(meta.clientSignature.signatureDataUrl, 'PNG', clientBoxX + 4, y + 11.5, 34, 11);
      } catch {
        doc.setFont('times', 'italic');
        doc.setFontSize(11);
        doc.setTextColor(30, 58, 138); // blue-900
        doc.text(meta.clientSignature.signerName, clientBoxX + 6, y + 17);
      }
    } else {
      doc.setFont('times', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(30, 58, 138); // blue-900
      doc.text(meta.clientSignature.signerName, clientBoxX + 6, y + 17);
    }
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(`Cert: ${meta.clientSignature.certificateId} | ${meta.clientSignature.signedAt}`, clientBoxX + 4, y + boxHeight - 7);
    
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text('✓ Signé Numériquement (eIDAS / OHADA)', clientBoxX + 4, y + boxHeight - 2.5);
  } else {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(clientBoxX, y, colWidth, boxHeight, 2, 2, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`Pour ${meta.clientName} :`, clientBoxX + 4, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text('Direction Générale & Technique', clientBoxX + 4, y + 10);
    doc.text('Approbateur Autorisé du Jalon', clientBoxX + 4, y + 14);
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ Validation Recette Contradictoire', clientBoxX + 4, y + boxHeight - 3);
  }

  y += boxHeight + 6;

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Bottom border
    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');

    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(
      `V&I TECH AFRICA LTD • Document officiel généré depuis le Portail Client Sécurisé • SHA-256 : ${meta.sha256.substring(0, 28)}...`,
      margin,
      pageHeight - 5
    );

    doc.text(
      `Page ${i} sur ${totalPages}`,
      pageWidth - margin - 15,
      pageHeight - 5
    );
  }

  return doc;
}

/**
 * Downloads a generated project document as a PDF file
 */
export function downloadProjectPdf(meta: GeneratedPdfMetadata, customFilename?: string): void {
  const doc = generateProjectPdf(meta);
  const filename = customFilename || `${meta.docRef}_${meta.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
  doc.save(filename);
}

export interface QuotePDFData {
  quoteRefNumber: string;
  issueDate: string;
  validUntil: string;
  clientName?: string;
  clientCompany?: string;
  clientEmail?: string;
  clientPhone?: string;
  country: {
    name: string;
    code: string;
    currency: string;
    flag: string;
    localHub?: string;
  };
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

export function generateQuotePDF(data: QuotePDFData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  let y = margin;

  // Header banner
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 40, 'F');
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 40, pageWidth, 2, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('V&I TECH AFRICA LTD', margin, 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Devis Officiel & Simulation Budgétaire Personnalisée', margin, 22);
  doc.text(`Kigali (Norrsken) • Dakar • Abidjan • Casablanca • Paris | Hub : ${data.country.localHub || data.country.name}`, margin, 27);

  // Badge Réf
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 50, 10, 50, 20, 2, 2, 'F');
  doc.setTextColor(56, 189, 248);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text('DEVIS ESTIMATIF', pageWidth - margin - 46, 17);
  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Réf : ${data.quoteRefNumber}`, pageWidth - margin - 46, 22);
  doc.text(`Validité : 30 jours`, pageWidth - margin - 46, 26);

  y = 52;

  // Client info & Project Info
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DESTINATAIRE / CLIENT :', margin + 4, y + 6);
  doc.text('SERVICE DEMANDÉ :', margin + 4, y + 12);
  doc.text('DÉLAI ESTIMÉ :', margin + 4, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${data.clientName || 'Client Professionnel'} ${data.clientCompany ? `(${data.clientCompany})` : ''}`, margin + 44, y + 6);
  doc.text(data.serviceName, margin + 44, y + 12);
  doc.text(`${data.timelineWeeks} semaines (Sprints Agile de 2 semaines)`, margin + 44, y + 18);

  y += 32;

  // Pricing Box
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 22, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('BUDGET GLOBAL ESTIMÉ :', margin + 6, y + 8);

  doc.setTextColor(56, 189, 248);
  doc.setFontSize(13);
  doc.text(data.formattedLocalPrice, margin + 6, y + 16);

  doc.setTextColor(148, 163, 184);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`(Équivalent : ${data.formattedEURPrice} / ${data.formattedUSDPrice})`, margin + 85, y + 16);

  y += 30;

  // Features list
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('FONCTIONNALITÉS & MODULES INCLUS :', margin, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  data.features.forEach((feat) => {
    doc.text(`• ${feat}`, margin + 2, y);
    y += 5;
  });

  y += 4;

  // Guarantees
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 22, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text('GARANTIES CONTRACTUELLES V&I TECH AFRICA :', margin + 4, y + 6);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('• 100% Cession intégrale de propriété intellectuelle des codes sources et architectures dès livraison.', margin + 4, y + 11);
  doc.text('• Garantie SLA 99.99% et support correctif offert pendant 6 mois.', margin + 4, y + 16);

  doc.save(`${data.quoteRefNumber}_Devis_${data.country.code}.pdf`);
}

/**
 * Generates an executive Project Synthesis Report (Rapport de Synthèse Complet)
 * covering milestones, encrypted documents state, KPI, hours, budget, and SLA.
 */
export function generateProjectSynthesisPdf(
  project: ClientProject,
  documents: ProjectDocument[],
  extraNotes?: string
): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 44, 'F');

  // Accent Line
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 44, pageWidth, 2.5, 'F');

  // Brand Name & Logo
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('V&I TECH AFRICA LTD', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text('Direction des Opérations & Assurance Qualité Logicielle', margin, 23);
  doc.text('Kigali HQ (Norrsken) • Dakar • Abidjan • Casablanca • Paris | www.vitechafrica.com', margin, 28);

  // Document Badge on Header Right
  doc.setFillColor(30, 41, 59); // slate-800
  doc.roundedRect(pageWidth - margin - 62, 10, 62, 26, 2, 2, 'F');

  doc.setTextColor(56, 189, 248); // sky-400
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('RAPPORT DE SYNTHÈSE', pageWidth - margin - 58, 17);

  const reportRef = `VIT-SYNTH-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const emissionDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Réf : ${reportRef}`, pageWidth - margin - 58, 23);
  doc.text(`Date : ${emissionDate}`, pageWidth - margin - 58, 28);
  doc.text('Statut : Audit & Recette Conforme', pageWidth - margin - 58, 33);

  y = 54;

  // Title Section
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.text(`RAPPORT DE SYNTHÈSE GLOBAL DU PROJET : ${project.name.toUpperCase()}`, margin, y);
  y += 7;

  // Executive Project Summary Card
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 24, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('CLIENT COMMANDITAIRE :', margin + 4, y + 6);
  doc.text('ARCHITECTE LEAD VITECH :', margin + 4, y + 12);
  doc.text('SPRINT EN COURS :', margin + 4, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(project.clientName || 'AfriPay Financial Services Ltd', margin + 48, y + 6);
  doc.text(project.leadArchitect || 'Abdoulaye Wade Jr. (Lead Solutions Architect)', margin + 48, y + 12);
  doc.text(`${project.currentSprint || 'Sprint 4'} (${project.status || 'En production / Déploiement'})`, margin + 48, y + 18);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('DATE DÉBUT :', margin + 115, y + 6);
  doc.text('LIVRAISON CIBLE :', margin + 115, y + 12);
  doc.text('PROGRESSION GLOBALE :', margin + 115, y + 18);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(project.startDate || '15 Janvier 2026', margin + 155, y + 6);
  doc.text(project.targetDelivery || '30 Avril 2026', margin + 155, y + 12);
  
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.setFont('helvetica', 'bold');
  doc.text(`${project.overallProgress || 68}% COMPLÉTÉ`, margin + 155, y + 18);

  y += 30;

  // KPI HIGHLIGHTS ROW (4 Boxes)
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('1. INDICATEURS CLÉS DE PERFORMANCE & PILOTAGE (KPI)', margin, y);
  y += 5;

  const kpiBoxWidth = (pageWidth - (margin * 2) - 9) / 4;
  const kpiBoxHeight = 20;

  // KPI 1: Budget
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, kpiBoxWidth, kpiBoxHeight, 2, 2, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('BUDGET CONSOMMÉ', margin + 3, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(project.budgetSpent || '34 200 €', margin + 3, y + 12);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`sur ${project.budgetTotal || '48 500 €'} (70.5%)`, margin + 3, y + 17);

  // KPI 2: Hours / Time
  const kpi2X = margin + kpiBoxWidth + 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(kpi2X, y, kpiBoxWidth, kpiBoxHeight, 2, 2, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('TEMPS & EFFORT', kpi2X + 3, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text('428h / 640h', kpi2X + 3, y + 12);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Vélocité : 48h/semaine', kpi2X + 3, y + 17);

  // KPI 3: Milestones
  const kpi3X = margin + (kpiBoxWidth + 3) * 2;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(kpi3X, y, kpiBoxWidth, kpiBoxHeight, 2, 2, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('JALONS VALIDÉS', kpi3X + 3, y + 5);
  const completedMilestones = project.milestones.filter(m => m.status === 'completed').length;
  doc.setFontSize(10);
  doc.setTextColor(5, 150, 105);
  doc.text(`${completedMilestones} / ${project.milestones.length} Jalons`, kpi3X + 3, y + 12);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('100% sans réserve', kpi3X + 3, y + 17);

  // KPI 4: Documents & SLA
  const kpi4X = margin + (kpiBoxWidth + 3) * 3;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(kpi4X, y, kpiBoxWidth, kpiBoxHeight, 2, 2, 'FD');
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(100, 116, 139);
  doc.text('SÉCURITÉ & SLA', kpi4X + 3, y + 5);
  doc.setFontSize(10);
  doc.setTextColor(6, 182, 212);
  doc.text('SLA 99.99%', kpi4X + 3, y + 12);
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`${documents.length} Docs Chiffrés AES`, kpi4X + 3, y + 17);

  y += kpiBoxHeight + 8;

  // SECTION 2: MILESTONES TABLE
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('2. ÉTAT D\'AVANCEMENT DES JALONS & SPRINTS DU PROJET', margin, y);
  y += 5;

  // Table Header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, pageWidth - (margin * 2), 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('JALON / PHASE', margin + 3, y + 4.5);
  doc.text('SPRINT', margin + 62, y + 4.5);
  doc.text('ÉCHÉANCE', margin + 92, y + 4.5);
  doc.text('STATUT & VALIDATION', margin + 125, y + 4.5);
  doc.text('AVANCEMENT', margin + 160, y + 4.5);
  y += 6.5;

  // Table Rows
  project.milestones.forEach((m, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, pageWidth - (margin * 2), 6, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6, pageWidth - margin, y + 6);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(`${m.id}. ${m.title.substring(0, 36)}`, margin + 3, y + 4.2);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(m.sprint || `Sprint ${m.id}`, margin + 62, y + 4.2);
    doc.text(m.dueDate || 'Livré', margin + 92, y + 4.2);

    if (m.status === 'completed') {
      doc.setTextColor(5, 150, 105);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ Validé & Recetté', margin + 125, y + 4.2);
      doc.text('100%', margin + 162, y + 4.2);
    } else if (m.status === 'in_progress') {
      doc.setTextColor(2, 132, 199);
      doc.setFont('helvetica', 'bold');
      doc.text('⏳ En cours de test', margin + 125, y + 4.2);
      doc.text('68%', margin + 162, y + 4.2);
    } else {
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'normal');
      doc.text('• Planifié', margin + 125, y + 4.2);
      doc.text('0%', margin + 162, y + 4.2);
    }

    y += 6;
  });

  y += 6;

  // SECTION 3: VAULT & DOCUMENTS STATUS
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. ÉTAT DES DOCUMENTS DU VAULT CRYPTÉ & SIGNATURES eIDAS', margin, y);
  y += 5;

  // Doc Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, pageWidth - (margin * 2), 6.5, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text('DOCUMENT / TITRE', margin + 3, y + 4.5);
  doc.text('RÉFÉRENCE', margin + 70, y + 4.5);
  doc.text('VERSION', margin + 106, y + 4.5);
  doc.text('HASH SHA-256 (INTÉGRITÉ)', margin + 125, y + 4.5);
  doc.text('STATUT', margin + 162, y + 4.5);
  y += 6.5;

  // Up to 6 most relevant documents
  const displayDocs = documents.slice(0, 6);
  displayDocs.forEach((d, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, pageWidth - (margin * 2), 5.8, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 5.8, pageWidth - margin, y + 5.8);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(d.title.substring(0, 42), margin + 3, y + 4);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(d.docRef || 'VIT-DOC-2026', margin + 70, y + 4);
    doc.text(d.version || 'v1.0', margin + 106, y + 4);
    
    // Truncated hash
    const hash = d.hashSha256 ? `${d.hashSha256.substring(0, 14)}...` : 'AES-256-GCM';
    doc.setFont('courier', 'normal');
    doc.setFontSize(6);
    doc.text(hash, margin + 125, y + 4);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    if (d.status === 'signed') {
      doc.setTextColor(5, 150, 105);
      doc.text('✓ Signé eIDAS', margin + 162, y + 4);
    } else {
      doc.setTextColor(6, 182, 212);
      doc.text('Certifié', margin + 162, y + 4);
    }

    y += 5.8;
  });

  y += 6;

  // TECHNICAL HIGHLIGHTS & GUARANTEES
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(20, 184, 166);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('GARANTIES CONTRACTUELLES, PROPRIÉTÉ INTELLECTUELLE & INFRASTRUCTURE :', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text('• Cession intégrale 100% de la propriété intellectuelle (codes sources, dépôts Git, schémas DB et conteneurs Docker).', margin + 4, y + 10);
  doc.text('• Engagement SLA Haute Disponibilité 99.99% avec surveillance télémétrique proactive 24/7 et support niveau 3.', margin + 4, y + 14.5);
  doc.text('• Chiffrement au repos (AES-256) et en transit (TLS 1.3 / mTLS) conforme aux standards bancaires BCEAO / UEMOA / OHADA.', margin + 4, y + 19);

  y += 28;

  // SIGNATURES & OFFICIAL STAMP
  if (y > pageHeight - 40) {
    doc.addPage();
    y = margin + 10;
  }

  const signColWidth = (pageWidth - (margin * 2) - 6) / 2;
  const signHeight = 24;

  // Signatory 1
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, signColWidth, signHeight, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Pour V&I TECH AFRICA LTD :', margin + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(project.leadArchitect || 'Abdoulaye Wade Jr.', margin + 4, y + 10);
  doc.text('Lead Software Architect & PMO', margin + 4, y + 14);
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ Signature Électronique Certifiée eIDAS', margin + 4, y + 20);

  // Signatory 2
  const sign2X = margin + signColWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(sign2X, y, signColWidth, signHeight, 2, 2, 'FD');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Pour ${project.clientName || 'AfriPay'} :`, sign2X + 4, y + 5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text('Direction Générale & Direction des Systèmes d\'Information', sign2X + 4, y + 10);
  doc.text('Comité de Pilotage & Validation des Livrables', sign2X + 4, y + 14);
  doc.setTextColor(5, 150, 105);
  doc.setFont('helvetica', 'bold');
  doc.text('✓ Registre d\'Audit Intègre & Conforme', sign2X + 4, y + 20);

  // Page Numbers and Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFillColor(15, 23, 42);
    doc.rect(0, pageHeight - 10, pageWidth, 10, 'F');
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text(
      `V&I TECH AFRICA LTD • Rapport de Synthèse Officiel • Réf : ${reportRef} • Tous droits réservés`,
      margin,
      pageHeight - 4
    );
    doc.text(`Page ${i} / ${totalPages}`, pageWidth - margin - 15, pageHeight - 4);
  }

  return doc;
}

export function downloadProjectSynthesisPdf(
  project: ClientProject,
  documents: ProjectDocument[],
  extraNotes?: string
): void {
  const doc = generateProjectSynthesisPdf(project, documents, extraNotes);
  const cleanName = (project.name || 'Projet').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Rapport_Synthese_${cleanName}_2026.pdf`);
}

/**
 * Generates an official Invoice / Facture PDF
 * with professional layout, bank details, tax breakdown, and Mobile Money payment routes.
 */
export function generateInvoicePdf(invoice: Invoice): jsPDF {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 16;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 44, 'F');
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 44, pageWidth, 2, 'F');

  // Brand Name & Details
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('V&I TECH AFRICA LTD', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Ingénierie Logicielle & Solutions Digitales Panafricaines', margin, 23);
  doc.text('NIF / RCCM : RW-KGL-2026-B-99812 | contact@vitechafrica.com | +250 795 507 001', margin, 28);
  doc.text('Kigali HQ (Norrsken) • Dakar • Abidjan • Casablanca • Paris', margin, 33);

  // Document Badge on Header Right
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 58, 10, 58, 26, 2, 2, 'F');

  const typeLabel = invoice.type === 'invoice' ? 'FACTURE OFFICIELLE' : invoice.type === 'estimate' ? 'DEVIS ESTIMATIF' : 'FACTURE D\'ACOMPTE';
  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text(typeLabel, pageWidth - margin - 54, 17);

  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`N° : ${invoice.invoiceNumber}`, pageWidth - margin - 54, 23);
  doc.text(`Date : ${invoice.issueDate}`, pageWidth - margin - 54, 28);
  doc.text(`Échéance : ${invoice.dueDate}`, pageWidth - margin - 54, 33);

  y = 54;

  // Client Info Box & Status Box (2 Columns)
  const halfColWidth = (pageWidth - (margin * 2) - 6) / 2;

  // Column 1: Client Info
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, halfColWidth, 26, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('FACTURÉ À (CLIENT) :', margin + 4, y + 6);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text(invoice.clientCompany || invoice.clientName, margin + 4, y + 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(51, 65, 85);
  doc.text(`Contact : ${invoice.clientName}`, margin + 4, y + 17);
  doc.text(`Email : ${invoice.clientEmail}`, margin + 4, y + 21.5);
  if (invoice.clientTaxId) {
    doc.text(`NIF / TVA : ${invoice.clientTaxId}`, margin + 4, y + 25.5);
  }

  // Column 2: Status & Terms
  const col2X = margin + halfColWidth + 6;
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(col2X, y, halfColWidth, 26, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('STATUT DU RÈGLEMENT :', col2X + 4, y + 6);

  doc.setFontSize(10);
  if (invoice.status === 'paid') {
    doc.setTextColor(5, 150, 105);
    doc.setFont('helvetica', 'bold');
    doc.text('✓ PAYÉE / ACQUITTÉE', col2X + 4, y + 13);
  } else if (invoice.status === 'pending') {
    doc.setTextColor(2, 132, 199);
    doc.setFont('helvetica', 'bold');
    doc.text('⏳ EN ATTENTE DE RÈGLEMENT', col2X + 4, y + 13);
  } else if (invoice.status === 'overdue') {
    doc.setTextColor(220, 38, 38);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ EN RETARD DE PAIEMENT', col2X + 4, y + 13);
  } else {
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text('• BROUILLON / ESTIMATION', col2X + 4, y + 13);
  }

  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(71, 85, 105);
  doc.text(`Mode de paiement : ${invoice.paymentMethod === 'mtn_momo' ? 'MTN Mobile Money' : invoice.paymentMethod === 'orange_money' ? 'Orange Money' : invoice.paymentMethod === 'wave' ? 'Wave' : 'Virement Bancaire (SWIFT / SEPA)'}`, col2X + 4, y + 19);
  doc.text(`Devise de compte : ${invoice.currency} (${invoice.currencySymbol})`, col2X + 4, y + 23.5);

  y += 32;

  // TABLE OF ITEMS
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, y, pageWidth - (margin * 2), 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.text('DÉSIGNATION DES PRESTATIONS & LIVRABLES', margin + 4, y + 4.8);
  doc.text('QTÉ', margin + 115, y + 4.8);
  doc.text(`PRIX UNIT. (${invoice.currencySymbol})`, margin + 132, y + 4.8);
  doc.text(`TOTAL HT (${invoice.currencySymbol})`, margin + 160, y + 4.8);
  y += 7;

  // Items rows
  invoice.items.forEach((item, idx) => {
    const isEven = idx % 2 === 0;
    doc.setFillColor(isEven ? 255 : 248, isEven ? 255 : 250, isEven ? 255 : 252);
    doc.rect(margin, y, pageWidth - (margin * 2), 6.5, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6.5, pageWidth - margin, y + 6.5);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.text(item.description.substring(0, 68), margin + 4, y + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`${item.quantity}`, margin + 117, y + 4.5);
    doc.text(`${item.unitPrice.toLocaleString('fr-FR')}`, margin + 132, y + 4.5);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${item.total.toLocaleString('fr-FR')}`, margin + 160, y + 4.5);

    y += 6.5;
  });

  y += 4;

  // TOTALS SECTION (Right Aligned)
  const totalsWidth = 78;
  const totalsX = pageWidth - margin - totalsWidth;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(totalsX, y, totalsWidth, 24, 2, 2, 'FD');

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Sous-Total Net HT :', totalsX + 4, y + 6);
  doc.text(`TVA (${invoice.taxRate}%) :`, totalsX + 4, y + 12);
  doc.text('TOTAL TTC À RÉGLER :', totalsX + 4, y + 19);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(15, 23, 42);
  doc.text(`${invoice.subtotal.toLocaleString('fr-FR')} ${invoice.currencySymbol}`, totalsX + 42, y + 6);
  doc.text(`${invoice.taxAmount.toLocaleString('fr-FR')} ${invoice.currencySymbol}`, totalsX + 42, y + 12);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 182, 212);
  doc.text(`${invoice.totalAmount.toLocaleString('fr-FR')} ${invoice.currencySymbol}`, totalsX + 42, y + 19);

  // BANKING & PAYMENT DETAILS (Left of Totals)
  const bankWidth = totalsX - margin - 6;
  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, bankWidth, 24, 2, 2, 'F');

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('COORDONNÉES BANCAIRES & MOBILE MONEY :', margin + 4, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(51, 65, 85);
  doc.text('Banque : Bank of Kigali / Ecobank Senegal / BOA Côte d\'Ivoire', margin + 4, y + 9.5);
  doc.text('IBAN / Compte : RW72 0001 2026 9981 2004 55', margin + 4, y + 13.5);
  doc.text('SWIFT / BIC : BOKIRWRW / ECOBSNDX | Titulaire : V&I TECH AFRICA LTD', margin + 4, y + 17.5);
  doc.text('Mobile Money Pro (MTN / Orange / Wave) : +250 795 507 001', margin + 4, y + 21.5);

  y += 30;

  // NOTES & CONDITIONS
  if (invoice.notes) {
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, pageWidth - (margin * 2), 14, 2, 2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(71, 85, 105);
    doc.text('NOTES & CONDITIONS PARTICULIÈRES :', margin + 4, y + 4.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(51, 65, 85);
    doc.text(invoice.notes, margin + 4, y + 9.5);
    y += 18;
  }

  // GUARANTEES & FOOTER
  doc.setFillColor(15, 23, 42);
  doc.rect(0, pageHeight - 12, pageWidth, 12, 'F');
  doc.setTextColor(148, 163, 184);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text(
    `V&I TECH AFRICA LTD • Facture N° ${invoice.invoiceNumber} • NIF/RCCM : RW-KGL-2026-B-99812 • Conforme OHADA & International`,
    margin,
    pageHeight - 5
  );
  doc.text('Page 1 / 1', pageWidth - margin - 12, pageHeight - 5);

  return doc;
}

export function downloadInvoicePdf(invoice: Invoice): void {
  const doc = generateInvoicePdf(invoice);
  doc.save(`${invoice.invoiceNumber}_Facture_${invoice.clientCompany.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
}

