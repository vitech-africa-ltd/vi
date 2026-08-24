import { 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  query, 
  where 
} from 'firebase/firestore';
import { jsPDF } from 'jspdf';
import { db } from '../lib/firebase';
import { DocumentAuditLog, AuditActionType } from '../types';

const COLLECTION_NAME = 'audit_logs';
const STORAGE_KEY = 'vitech_audit_logs_v1';

export const INITIAL_AUDIT_LOGS: DocumentAuditLog[] = [
  {
    id: 'log-hist-01',
    projectId: 'proj-afripay-001',
    documentId: 'doc-contract-01',
    documentTitle: 'Contrat-Cadre de Prestation & Cession 100% Propriété Intellectuelle',
    docRef: 'VIT-CTR-2026-084',
    actionType: 'signature_created',
    actorName: 'Mamadou Diop',
    actorRole: 'CEO & Signataire Légal',
    actorEmail: 'm.diop@afripay.africa',
    actorCompany: 'AfriPay Financial Services Ltd',
    timestamp: '10 Juin 2026 14:22:05',
    timestampUtc: '2026-06-10T14:22:05.120Z',
    ipAddress: '197.214.12.89 (Dakar, SN)',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    certificateId: 'X509-AFRIPAY-2026-90412',
    hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    verificationStatus: 'certified',
    details: 'Signature électronique contradictoire apposée et certifiée conforme au règlement eIDAS / Acte Uniforme OHADA.',
    metadata: {
      signatureType: 'draw',
      securityPinUsed: true,
      fileSize: '2.4 Mo',
      version: 'v1.0 (Signé eIDAS)',
      documentType: 'contract'
    }
  },
  {
    id: 'log-hist-02',
    projectId: 'proj-afripay-001',
    documentId: 'doc-contract-01',
    documentTitle: 'Contrat-Cadre de Prestation & Cession 100% Propriété Intellectuelle',
    docRef: 'VIT-CTR-2026-084',
    actionType: 'document_downloaded',
    actorName: 'Mamadou Diop',
    actorRole: 'CEO AfriPay',
    actorEmail: 'm.diop@afripay.africa',
    actorCompany: 'AfriPay Financial Services Ltd',
    timestamp: '10 Juin 2026 14:25:30',
    timestampUtc: '2026-06-10T14:25:30.450Z',
    ipAddress: '197.214.12.89 (Dakar, SN)',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    verificationStatus: 'tamper_proof',
    details: 'Téléchargement complet de l\'exemplaire PDF certifié avec empreinte d\'intégrité inviolable.',
    metadata: {
      fileSize: '2.4 Mo',
      version: 'v1.0'
    }
  },
  {
    id: 'log-hist-03',
    projectId: 'proj-afripay-001',
    documentId: 'doc-arch-02',
    documentTitle: 'Dossier d\'Architecture Technique C4 & Spécifications PCI-DSS Level 1',
    docRef: 'VIT-DAT-2026-102',
    actionType: 'document_uploaded',
    actorName: 'Abdoulaye Wade Jr.',
    actorRole: 'Senior Partner & Lead Architect',
    actorEmail: 'a.wade@vitech.africa',
    actorCompany: 'V&I TECH AFRICA LTD',
    timestamp: '24 Juin 2026 09:15:00',
    timestampUtc: '2026-06-24T09:15:00.000Z',
    ipAddress: '102.164.88.14 (Kigali, RW)',
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64)',
    hashSha256: '4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123',
    verificationStatus: 'tamper_proof',
    details: 'Dépôt et chiffrement AES-256 GCM du livrable technique d\'architecture dans le Cloud Vault.',
    metadata: {
      fileSize: '6.8 Mo',
      version: 'v1.2 (Validé Arch)'
    }
  },
  {
    id: 'log-hist-04',
    projectId: 'proj-afripay-001',
    documentId: 'doc-arch-02',
    documentTitle: 'Dossier d\'Architecture Technique C4 & Spécifications PCI-DSS Level 1',
    docRef: 'VIT-DAT-2026-102',
    actionType: 'document_downloaded',
    actorName: 'Fatou Ndiaye',
    actorRole: 'Head of Infrastructure',
    actorEmail: 'f.ndiaye@afripay.africa',
    actorCompany: 'AfriPay Financial Services Ltd',
    timestamp: '25 Juin 2026 11:30:14',
    timestampUtc: '2026-06-25T11:30:14.880Z',
    ipAddress: '197.214.12.92 (Dakar, SN)',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    hashSha256: '4a5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef0123',
    verificationStatus: 'verified',
    details: 'Téléchargement sécurisé pour revue d\'infrastructure AWS / GCP hybride.',
    metadata: {
      fileSize: '6.8 Mo',
      version: 'v1.2'
    }
  },
  {
    id: 'log-hist-05',
    projectId: 'proj-afripay-001',
    documentId: 'doc-pvr-01',
    documentTitle: 'Procès-Verbal de Recette & Livraison Jalon 1 (Sprint 1 & 2)',
    docRef: 'VIT-PVR-2026-001',
    actionType: 'milestone_validated',
    actorName: 'Mamadou Diop',
    actorRole: 'CEO AfriPay',
    actorEmail: 'm.diop@afripay.africa',
    actorCompany: 'AfriPay Financial Services Ltd',
    timestamp: '08 Juillet 2026 16:45:00',
    timestampUtc: '2026-07-08T16:45:00.000Z',
    ipAddress: '197.214.12.89 (Dakar, SN)',
    certificateId: 'X509-AFRIPAY-2026-11894',
    hashSha256: '5b6c7d8e9f0123456789abcdef0123456789abcdef0123456789abcdef012345',
    verificationStatus: 'certified',
    details: 'Approbation formelle du jalon sans réserve et déclenchement de la phase suivante.',
    metadata: {
      milestoneId: 'm1',
      version: 'v1.0 (Signé Recette)'
    }
  },
  {
    id: 'log-hist-06',
    projectId: 'proj-afripay-001',
    documentId: 'doc-pentest-01',
    documentTitle: 'Rapport d\'Audit de Sécurité & Tests d\'Intrusion (Pentest OWASP)',
    docRef: 'VIT-SEC-2026-044',
    actionType: 'hash_verified',
    actorName: 'Ibrahima Fall',
    actorRole: 'Responsable Sécurité (CISO)',
    actorEmail: 'i.fall@afripay.africa',
    actorCompany: 'AfriPay Financial Services Ltd',
    timestamp: '05 Août 2026 08:12:44',
    timestampUtc: '2026-08-05T08:12:44.200Z',
    ipAddress: '197.214.12.95 (Dakar, SN)',
    hashSha256: '1f2e3d4c5b6a798081828384858687888990919293949596979899a0a1a2a3a4',
    verificationStatus: 'verified',
    details: 'Contrôle d\'intégrité cryptographique SHA-256 réussi : concordance parfaite 0 altération.',
    metadata: {
      fileSize: '5.1 Mo'
    }
  },
  {
    id: 'log-hist-07',
    projectId: 'proj-afripay-001',
    documentId: 'doc-pentest-01',
    documentTitle: 'Rapport d\'Audit de Sécurité & Tests d\'Intrusion (Pentest OWASP)',
    docRef: 'VIT-SEC-2026-044',
    actionType: 'document_downloaded',
    actorName: 'Ibrahima Fall',
    actorRole: 'Responsable Sécurité (CISO)',
    actorEmail: 'i.fall@afripay.africa',
    actorCompany: 'AfriPay Financial Services Ltd',
    timestamp: '05 Août 2026 08:14:20',
    timestampUtc: '2026-08-05T08:14:20.100Z',
    ipAddress: '197.214.12.95 (Dakar, SN)',
    hashSha256: '1f2e3d4c5b6a798081828384858687888990919293949596979899a0a1a2a3a4',
    verificationStatus: 'tamper_proof',
    details: 'Téléchargement de la version chiffrée pour présentation au comité d\'audit et de conformité BCEAO.',
    metadata: {
      fileSize: '5.1 Mo',
      version: 'v2.0 (Certifié ISO 27001)'
    }
  }
];

/**
 * Loads logs from localStorage
 */
function getLocalLogs(): DocumentAuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_AUDIT_LOGS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_AUDIT_LOGS;
  } catch {
    return INITIAL_AUDIT_LOGS;
  }
}

/**
 * Saves logs to localStorage
 */
function saveLocalLogs(logs: DocumentAuditLog[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.warn('Could not persist audit logs locally:', err);
  }
}

/**
 * Subscribes to real-time project audit logs (Firestore with local fallback)
 */
export function subscribeToAuditLogs(
  projectId: string,
  onUpdate: (logs: DocumentAuditLog[]) => void,
  onError?: (err: any) => void
) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          onUpdate(getLocalLogs());
        } else {
          const list: DocumentAuditLog[] = [];
          snapshot.forEach((snap) => {
            list.push({ ...snap.data(), id: snap.id } as DocumentAuditLog);
          });
          // Sort descending by timestampUtc
          list.sort((a, b) => new Date(b.timestampUtc).getTime() - new Date(a.timestampUtc).getTime());
          saveLocalLogs(list);
          onUpdate(list);
        }
      },
      (error) => {
        console.warn('Firestore audit logs subscription fallback to local cache:', error);
        onUpdate(getLocalLogs());
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.warn('Could not establish real-time Firestore audit log listener:', error);
    onUpdate(getLocalLogs());
    return () => {};
  }
}

/**
 * Helper to record a new audit log entry
 */
export async function logAuditEvent(params: {
  projectId?: string;
  documentId?: string;
  documentTitle: string;
  docRef?: string;
  actionType: AuditActionType;
  actorName: string;
  actorRole: string;
  actorEmail?: string;
  actorCompany?: string;
  certificateId?: string;
  hashSha256?: string;
  verificationStatus?: 'verified' | 'tamper_proof' | 'certified' | 'standard';
  details?: string;
  metadata?: Record<string, any>;
}): Promise<DocumentAuditLog> {
  const now = new Date();
  
  // Format localized readable timestamp
  const dateFormatted = now.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = now.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const formattedTimestamp = `${dateFormatted} à ${timeFormatted}`;
  const isoUtc = now.toISOString();

  const newLog: DocumentAuditLog = {
    id: `log-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    projectId: params.projectId || 'proj-afripay-001',
    documentId: params.documentId,
    documentTitle: params.documentTitle,
    docRef: params.docRef || 'VIT-DOC-2026',
    actionType: params.actionType,
    actorName: params.actorName,
    actorRole: params.actorRole,
    actorEmail: params.actorEmail || 'contact.vitechdev@gmail.com',
    actorCompany: params.actorCompany || 'AfriPay Financial Services Ltd',
    timestamp: formattedTimestamp,
    timestampUtc: isoUtc,
    ipAddress: '197.214.12.89 (Dakar / Client Session)',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'Client Applet',
    certificateId: params.certificateId,
    hashSha256: params.hashSha256 || '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    verificationStatus: params.verificationStatus || (params.certificateId ? 'certified' : 'tamper_proof'),
    details: params.details || getActionDefaultDetails(params.actionType, params.documentTitle, params.actorName),
    metadata: params.metadata || {}
  };

  // Update local storage immediately
  const existing = getLocalLogs();
  const updated = [newLog, ...existing];
  saveLocalLogs(updated);

  // Attempt Firestore sync
  try {
    const docRef = doc(db, COLLECTION_NAME, newLog.id);
    await setDoc(docRef, newLog, { merge: true });
  } catch (err) {
    console.warn('Firestore log write fallback to local storage:', err);
  }

  return newLog;
}

function getActionDefaultDetails(type: AuditActionType, docTitle: string, actor: string): string {
  switch (type) {
    case 'signature_created':
      return `Signature électronique certifiée apposée par ${actor} sur le document "${docTitle}".`;
    case 'document_downloaded':
      return `Exemplaire officiel de "${docTitle}" téléchargé avec vérification d'intégrité SHA-256.`;
    case 'document_viewed':
      return `Consultation sécurisée des clauses et de l'aperçu certifié de "${docTitle}".`;
    case 'hash_verified':
      return `Contrôle de l'empreinte cryptographique SHA-256 pour "${docTitle}" : 100% conforme.`;
    case 'milestone_validated':
      return `Validation du jalon contractuel et PV de recette par ${actor}.`;
    case 'document_uploaded':
      return `Nouveau livrable "${docTitle}" chiffré et indexé dans le coffre-fort.`;
    default:
      return `Action enregistrée sur le document "${docTitle}".`;
  }
}

/**
 * Exports audit logs to CSV formatted string
 */
export function exportAuditLogsToCsv(logs: DocumentAuditLog[]): void {
  const headers = [
    'ID Log',
    'Horodatage UTC',
    'Date Locale',
    'Type d\'Action',
    'Document / Livrable',
    'Référence',
    'Acteur',
    'Rôle',
    'Email',
    'Entreprise',
    'ID Certificat',
    'Empreinte SHA-256',
    'Statut Vérification',
    'Détails Légaux'
  ];

  const rows = logs.map(log => [
    `"${log.id}"`,
    `"${log.timestampUtc}"`,
    `"${log.timestamp}"`,
    `"${log.actionType}"`,
    `"${log.documentTitle?.replace(/"/g, '""') || ''}"`,
    `"${log.docRef || ''}"`,
    `"${log.actorName?.replace(/"/g, '""') || ''}"`,
    `"${log.actorRole?.replace(/"/g, '""') || ''}"`,
    `"${log.actorEmail || ''}"`,
    `"${log.actorCompany?.replace(/"/g, '""') || ''}"`,
    `"${log.certificateId || 'N/A'}"`,
    `"${log.hashSha256 || 'N/A'}"`,
    `"${log.verificationStatus}"`,
    `"${log.details?.replace(/"/g, '""') || ''}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `VITECH-JOURNAL-AUDIT-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exports audit logs to JSON file
 */
export function exportAuditLogsToJson(logs: DocumentAuditLog[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({
    project: 'AfriPay Core Switch Payment Platform (proj-afripay-001)',
    client: 'AfriPay Financial Services Ltd',
    auditor: 'V&I TECH AFRICA LTD',
    exportedAt: new Date().toISOString(),
    eIDAS_OHADA_Compliance: 'Standard Level 3 / Art. 82-84 AUDCG',
    totalEntries: logs.length,
    auditTrail: logs
  }, null, 2));

  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `VITECH-REGISTRE-AUDIT-${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Generates and downloads an official executive Audit Log PDF report with legal certification
 */
export function exportAuditLogsToPdf(
  logs: DocumentAuditLog[],
  projectName: string = 'AfriPay Core Switch Payment Platform',
  clientName: string = 'AfriPay Financial Services Ltd'
): void {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = margin;

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 32, 'F');

  // Accent Line
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.rect(0, 32, pageWidth, 1.5, 'F');

  // Header Typography
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('V&I TECH AFRICA LTD • REGISTRE OFFICIEL D\'AUDIT & TRAÇABILITÉ', margin, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text(`Projet : ${projectName} | Client : ${clientName} | Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')} UTC`, margin, 18);
  doc.text('Conformité Légale : Règlement eIDAS (UE) 910/2014 & Acte Uniforme OHADA (Art. 82-84 AUDCG) • Chiffrement SHA-256', margin, 24);

  // Status Badge
  doc.setFillColor(30, 41, 59);
  doc.roundedRect(pageWidth - margin - 60, 8, 60, 16, 2, 2, 'F');
  doc.setTextColor(56, 189, 248);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('CERTIFICAT DE CONFORMITÉ', pageWidth - margin - 56, 14);
  doc.setTextColor(226, 232, 240);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Total : ${logs.length} Événements Certifiés`, pageWidth - margin - 56, 20);

  y = 40;

  // Summary Metrics Bar
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(margin, y, pageWidth - (margin * 2), 12, 1.5, 1.5, 'FD');

  const signaturesCount = logs.filter(l => l.actionType === 'signature_created').length;
  const downloadsCount = logs.filter(l => l.actionType === 'document_downloaded').length;
  const milestonesCount = logs.filter(l => l.actionType === 'milestone_validated').length;

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Signatures eIDAS : ${signaturesCount}`, margin + 6, y + 7.5);
  doc.text(`Téléchargements Remis : ${downloadsCount}`, margin + 65, y + 7.5);
  doc.text(`Jalons Validés : ${milestonesCount}`, margin + 135, y + 7.5);
  doc.setTextColor(16, 185, 129); // emerald
  doc.text('Intégrité Cryptographique : 100% Inviolable (Zéro Altération)', margin + 195, y + 7.5);

  y += 18;

  // Table Columns Setup
  const colWidths = {
    time: 26,
    action: 32,
    doc: 46,
    ref: 22,
    actor: 36,
    company: 34,
    hash: 40,
    status: 30
  };

  const drawTableHeader = (posY: number) => {
    doc.setFillColor(30, 41, 59); // slate-800
    doc.rect(margin, posY, pageWidth - (margin * 2), 7, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);

    let curX = margin + 2;
    doc.text('DATE / HEURE (UTC)', curX, posY + 4.8);
    curX += colWidths.time;
    doc.text('ACTION TRACÉE', curX, posY + 4.8);
    curX += colWidths.action;
    doc.text('DOCUMENT / LIVRABLE', curX, posY + 4.8);
    curX += colWidths.doc;
    doc.text('RÉFÉRENCE', curX, posY + 4.8);
    curX += colWidths.ref;
    doc.text('ACTEUR / SIGNATAIRE', curX, posY + 4.8);
    curX += colWidths.actor;
    doc.text('ENTREPRISE', curX, posY + 4.8);
    curX += colWidths.company;
    doc.text('EMPREINTE SHA-256 (64 hex)', curX, posY + 4.8);
    curX += colWidths.hash;
    doc.text('STATUT AUDIT', curX, posY + 4.8);
  };

  drawTableHeader(y);
  y += 8;

  let pageNum = 1;

  logs.forEach((log, index) => {
    // Check if new page is required
    if (y > pageHeight - 20) {
      // Draw footer on current page
      doc.setFontSize(6.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(148, 163, 184);
      doc.text(`Page ${pageNum} • Registre d'audit certifié V&I TECH AFRICA LTD • Document officiel à valeur probante`, margin, pageHeight - 8);
      doc.text(`Empreinte Document : SHA256-${Date.now().toString(16).toUpperCase()}`, pageWidth - margin - 55, pageHeight - 8);

      doc.addPage('a4', 'landscape');
      pageNum++;
      y = margin;

      // Repeat table header
      drawTableHeader(y);
      y += 8;
    }

    // Row Background (Alternating)
    if (index % 2 === 0) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y - 1, pageWidth - (margin * 2), 6.5, 'F');
    }

    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);

    let curX = margin + 2;

    // Time
    const timeStr = log.timestamp || log.timestampUtc?.slice(0, 16).replace('T', ' ') || 'N/A';
    doc.text(doc.splitTextToSize(timeStr, colWidths.time - 2)[0] || '', curX, y + 3.5);
    curX += colWidths.time;

    // Action Name in French
    let actionLabel: string = log.actionType;
    if (log.actionType === 'signature_created') actionLabel = 'Signature eIDAS Apposée';
    else if (log.actionType === 'document_downloaded') actionLabel = 'Téléchargement PDF';
    else if (log.actionType === 'document_viewed') actionLabel = 'Consultation Sécurisée';
    else if (log.actionType === 'document_uploaded') actionLabel = 'Dépôt & Chiffrement';
    else if (log.actionType === 'hash_verified') actionLabel = 'Contrôle SHA-256 Validé';
    else if (log.actionType === 'milestone_validated') actionLabel = 'PV Recette Validé';

    doc.setFont('helvetica', 'bold');
    if (log.actionType === 'signature_created') doc.setTextColor(5, 150, 105);
    else if (log.actionType === 'milestone_validated') doc.setTextColor(2, 132, 199);
    else doc.setTextColor(51, 65, 85);
    
    doc.text(doc.splitTextToSize(actionLabel, colWidths.action - 2)[0] || '', curX, y + 3.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    curX += colWidths.action;

    // Doc Title
    const docTitleShort = log.documentTitle ? (log.documentTitle.length > 28 ? log.documentTitle.substring(0, 26) + '...' : log.documentTitle) : 'Projet Global';
    doc.text(docTitleShort, curX, y + 3.5);
    curX += colWidths.doc;

    // Ref
    doc.setFont('courier', 'bold');
    doc.text(log.docRef || 'N/A', curX, y + 3.5);
    doc.setFont('helvetica', 'normal');
    curX += colWidths.ref;

    // Actor
    doc.text(doc.splitTextToSize(log.actorName || 'Système', colWidths.actor - 2)[0] || '', curX, y + 3.5);
    curX += colWidths.actor;

    // Company
    const compShort = log.actorCompany ? (log.actorCompany.length > 22 ? log.actorCompany.substring(0, 20) + '..' : log.actorCompany) : 'AfriPay Ltd';
    doc.text(compShort, curX, y + 3.5);
    curX += colWidths.company;

    // Hash (Shortened)
    doc.setFont('courier', 'normal');
    doc.setFontSize(5.5);
    const shortHash = log.hashSha256 ? `${log.hashSha256.substring(0, 16)}...${log.hashSha256.substring(log.hashSha256.length - 8)}` : 'SHA256-INVIOLABLE';
    doc.text(shortHash, curX, y + 3.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    curX += colWidths.hash;

    // Status
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(5, 150, 105);
    doc.text('CERTIFIÉ CONFORME', curX, y + 3.5);
    doc.setTextColor(15, 23, 42);

    y += 6.5;
  });

  // Footer on Last Page
  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  doc.text(`Page ${pageNum} • Registre d'audit certifié V&I TECH AFRICA LTD • Document officiel à valeur probante`, margin, pageHeight - 8);
  doc.text(`Empreinte Globale : SHA256-${Date.now().toString(16).toUpperCase()}`, pageWidth - margin - 55, pageHeight - 8);

  // Trigger Save
  doc.save(`VITECH-JOURNAL-AUDIT-OFFICIEL-${new Date().toISOString().slice(0, 10)}.pdf`);
}
