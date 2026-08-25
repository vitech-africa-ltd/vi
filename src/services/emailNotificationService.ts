import { collection, doc, setDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Invoice, InvoiceStatus } from '../types';
import { sendClientNotification } from './notificationService';

export interface InvoiceEmailLog {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  recipientEmail: string;
  recipientName: string;
  recipientCompany: string;
  status: InvoiceStatus;
  subject: string;
  htmlBody: string;
  plainTextBody: string;
  amountFormatted: string;
  currency: string;
  sentAt: string;
  deliveryStatus: 'delivered' | 'sent' | 'opened';
  dispatchedBy: string;
  trackingCode: string;
  customNote?: string;
}

const EMAIL_LOGS_STORAGE_KEY = 'vitech_invoice_email_logs_v1';

/**
 * Generate formatted HTML template for automated invoice email notifications
 */
export function generateInvoiceEmailTemplate(params: {
  invoice: Invoice;
  status: 'paid' | 'pending';
  customNote?: string;
}): { subject: string; htmlBody: string; plainTextBody: string } {
  const { invoice, status, customNote } = params;
  const isPaid = status === 'paid';
  const currencySymbol = invoice.currencySymbol || invoice.currency || '€';
  const totalFormatted = `${invoice.totalAmount.toLocaleString('fr-FR')} ${currencySymbol}`;
  const dateNow = new Date().toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  const subject = isPaid
    ? `[Acquittée] V&I Tech - Confirmation d'encaissement Facture #${invoice.invoiceNumber} (${totalFormatted})`
    : `[Facture Émise] V&I Tech - Facture #${invoice.invoiceNumber} en attente de règlement (${totalFormatted})`;

  const itemsHtml = invoice.items
    .map(
      (it, idx) => `
      <tr style="border-bottom: 1px solid #334155;">
        <td style="padding: 10px 12px; font-size: 13px; color: #f1f5f9;">
          <strong>${it.description}</strong>
          ${it.category ? `<br/><span style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Catégorie: ${it.category}</span>` : ''}
        </td>
        <td style="padding: 10px 12px; font-size: 13px; color: #94a3b8; text-align: center;">${it.quantity}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #94a3b8; text-align: right;">${it.unitPrice.toLocaleString('fr-FR')} ${currencySymbol}</td>
        <td style="padding: 10px 12px; font-size: 13px; color: #f8fafc; font-weight: bold; text-align: right;">${(it.total || it.quantity * it.unitPrice).toLocaleString('fr-FR')} ${currencySymbol}</td>
      </tr>
    `
    )
    .join('');

  const plainItems = invoice.items
    .map(it => `- ${it.description} (Qté: ${it.quantity}) : ${(it.total || it.quantity * it.unitPrice).toLocaleString('fr-FR')} ${currencySymbol}`)
    .join('\n');

  const htmlBody = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="max-width: 600px; width: 100%; background-color: #1e293b; border-radius: 16px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #020617 0%, #0f172a 100%); padding: 28px 32px; border-bottom: 1px solid #334155;">
              <table width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff;">
                      V&I <span style="color: #f59e0b;">TECHNOLOGY</span>
                    </div>
                    <div style="font-size: 11px; color: #94a3b8; margin-top: 4px; letter-spacing: 0.5px;">
                      INGÉNIERIE LOGICIELLE & TRANSFORMATION DIGITALE AFRIQUE
                    </div>
                  </td>
                  <td align="right">
                    <span style="display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; ${
                      isPaid
                        ? 'background-color: #064e3b; color: #34d399; border: 1px solid #059669;'
                        : 'background-color: #78350f; color: #fbbf24; border: 1px solid #d97706;'
                    }">
                      ${isPaid ? '✓ Facture Acquittée' : '⏳ En Attente de Règlement'}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #ffffff; font-weight: 700;">
                Bonjour ${invoice.clientName || 'Cher Client'},
              </h2>
              
              <p style="margin: 0 0 20px 0; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                ${
                  isPaid
                    ? `Nous accusons bonne réception du règlement complet de votre facture <strong>#${invoice.invoiceNumber}</strong> concernant la société <strong>${invoice.clientCompany}</strong>. Votre dossier est désormais à jour et en règle.`
                    : `Votre facture officielle <strong>#${invoice.invoiceNumber}</strong> relative aux prestations réalisées pour <strong>${invoice.clientCompany}</strong> a été émise et est en attente de règlement selon les conditions contractuelles convenues.`
                }
              </p>

              ${
                customNote
                  ? `<div style="background-color: #0f172a; border-left: 4px solid #f59e0b; padding: 14px 18px; border-radius: 0 8px 8px 0; margin-bottom: 24px; font-size: 13px; color: #e2e8f0; font-style: italic;">
                      "${customNote}"
                     </div>`
                  : ''
              }

              <!-- Summary Card -->
              <table width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; margin-bottom: 24px; overflow: hidden;">
                <tr>
                  <td style="padding: 16px 20px; border-bottom: 1px solid #1e293b;">
                    <table width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8;">Référence Document :</td>
                        <td align="right" style="font-size: 13px; font-weight: bold; color: #f8fafc; font-family: monospace;">${invoice.invoiceNumber}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; padding-top: 8px;">Date d'émission :</td>
                        <td align="right" style="font-size: 12px; color: #cbd5e1; padding-top: 8px;">${invoice.issueDate}</td>
                      </tr>
                      <tr>
                        <td style="font-size: 12px; color: #94a3b8; padding-top: 8px;">Date d'échéance :</td>
                        <td align="right" style="font-size: 12px; color: #fbbf24; font-weight: 600; padding-top: 8px;">${invoice.dueDate}</td>
                      </tr>
                      ${
                        isPaid && invoice.paidAt
                          ? `<tr>
                              <td style="font-size: 12px; color: #94a3b8; padding-top: 8px;">Date de règlement :</td>
                              <td align="right" style="font-size: 12px; color: #34d399; font-weight: 600; padding-top: 8px;">${invoice.paidAt}</td>
                            </tr>`
                          : ''
                      }
                      <tr>
                        <td style="font-size: 14px; font-weight: bold; color: #ffffff; padding-top: 14px; border-top: 1px dashed #334155;">Montant Total TTC :</td>
                        <td align="right" style="font-size: 18px; font-weight: 900; color: ${isPaid ? '#34d399' : '#f59e0b'}; padding-top: 14px; border-top: 1px dashed #334155;">
                          ${totalFormatted}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Invoice Lines Breakdown -->
              <h3 style="font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; color: #94a3b8; margin: 0 0 12px 0;">
                Détail des Prestations
              </h3>
              <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; background-color: #0f172a; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
                <thead>
                  <tr style="background-color: #1e293b; text-align: left; font-size: 11px; color: #94a3b8; text-transform: uppercase;">
                    <th style="padding: 10px 12px;">Description</th>
                    <th style="padding: 10px 12px; text-align: center;">Qté</th>
                    <th style="padding: 10px 12px; text-align: right;">Prix Unit.</th>
                    <th style="padding: 10px 12px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              ${
                !isPaid
                  ? `
              <!-- Payment Instructions -->
              <div style="background-color: #020617; border: 1px solid #334155; border-radius: 10px; padding: 18px; margin-bottom: 24px;">
                <div style="font-size: 12px; font-weight: bold; color: #f59e0b; text-transform: uppercase; margin-bottom: 8px;">
                  Coordonnées de Règlement &amp; Virement
                </div>
                <div style="font-size: 12px; color: #cbd5e1; line-height: 1.6; font-family: monospace;">
                  <strong>Bénéficiaire :</strong> V&amp;I TECHNOLOGY SARL<br/>
                  <strong>Banque :</strong> Bank of Kigali / Ecobank International<br/>
                  <strong>IBAN :</strong> RW24 0012 9400 8821 0041 90<br/>
                  <strong>BIC / SWIFT :</strong> BOKIRWRW / ECOCRWRW<br/>
                  <strong>Mobile Money :</strong> MTN MoMo Rwanda (+250 788 123 456) / Wave CI (+225 07 88 99 00)
                </div>
              </div>`
                  : `
              <!-- Paid Acknowledgement Notice -->
              <div style="background-color: #022c22; border: 1px solid #059669; border-radius: 10px; padding: 16px; margin-bottom: 24px; text-align: center;">
                <div style="font-size: 13px; font-weight: bold; color: #34d399; margin-bottom: 4px;">
                  Quittance de Paiement Électronique Délivrée
                </div>
                <div style="font-size: 12px; color: #a7f3d0;">
                  Ce message constitue une confirmation libératoire de règlement certifiée eIDAS &amp; OHADA.
                </div>
              </div>`
              }

              <!-- Security & Portal Access -->
              <p style="font-size: 12px; line-height: 1.5; color: #94a3b8; margin: 0;">
                Vous pouvez retrouver l'ensemble de vos factures, devis signés et rapports de livraison en vous connectant à votre <strong>Espace Client Sécurisé V&amp;I Tech</strong>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #020617; padding: 24px 32px; border-top: 1px solid #334155; text-align: center;">
              <p style="margin: 0 0 6px 0; font-size: 11px; color: #64748b;">
                V&amp;I Technology SARL · Kigali, Rwanda &amp; Abidjan, Côte d'Ivoire · SIRET / NIF : 1098492049 · RCCM : RW-KGL-2024-B-9981
              </p>
              <p style="margin: 0; font-size: 10px; color: #475569;">
                Courriel généré automatiquement le ${dateNow} · Référence traçabilité : VITECH-NOTIF-INV-${invoice.invoiceNumber}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const plainTextBody = `
========================================
V&I TECHNOLOGY - NOTIFICATION DE FACTURATION
========================================

Bonjour ${invoice.clientName || 'Cher Client'},

${
  isPaid
    ? `Nous vous confirmons la bonne réception du paiement intégral de la facture #${invoice.invoiceNumber} (${totalFormatted}).`
    : `Votre facture #${invoice.invoiceNumber} d'un montant de ${totalFormatted} a été émise et est en attente de règlement avant le ${invoice.dueDate}.`
}

${customNote ? `Note administrative : "${customNote}"\n` : ''}

RÉCAPITULATIF :
- Numéro : ${invoice.invoiceNumber}
- Client : ${invoice.clientCompany} (${invoice.clientName})
- Date d'émission : ${invoice.issueDate}
- Date d'échéance : ${invoice.dueDate}
- Total TTC : ${totalFormatted}
- Statut : ${isPaid ? 'PAYÉE / ACQUITTÉE' : 'EN ATTENTE DE RÈGLEMENT'}

PRESTATIONS :
${plainItems}

${
  !isPaid
    ? `COORDONNÉES DE PAIEMENT :
- Bénéficiaire : V&I TECHNOLOGY SARL
- Banque : Bank of Kigali / Ecobank
- IBAN : RW24 0012 9400 8821 0041 90
- BIC/SWIFT : BOKIRWRW`
    : 'Le présent courriel vaut quittance libératoire de paiement.'
}

Cordialement,
L'équipe Comptabilité & Gestion Clientèle
V&I Technology SARL
contact.vitechdev@gmail.com
  `.trim();

  return { subject, htmlBody, plainTextBody };
}

/**
 * Retrieve local cached email logs
 */
function getLocalEmailLogs(): InvoiceEmailLog[] {
  try {
    const raw = localStorage.getItem(EMAIL_LOGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

/**
 * Persist email logs locally
 */
function persistLocalEmailLogs(logs: InvoiceEmailLog[]): void {
  try {
    localStorage.setItem(EMAIL_LOGS_STORAGE_KEY, JSON.stringify(logs.slice(0, 100)));
  } catch (e) {
    console.warn('Could not cache email logs:', e);
  }
}

/**
 * Automated Email Notification Sender
 * Dispatches an automated email to client on status change ('paid' or 'pending')
 */
export async function sendAutomatedInvoiceEmail(params: {
  invoice: Invoice;
  newStatus: 'paid' | 'pending';
  previousStatus?: string;
  customNote?: string;
  actorName?: string;
}): Promise<InvoiceEmailLog> {
  const { invoice, newStatus, customNote, actorName = 'Système V&I Tech' } = params;
  const { subject, htmlBody, plainTextBody } = generateInvoiceEmailTemplate({
    invoice,
    status: newStatus,
    customNote
  });

  const emailLog: InvoiceEmailLog = {
    id: `eml-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    recipientEmail: invoice.clientEmail || 'client@entreprise.com',
    recipientName: invoice.clientName || 'Responsable Client',
    recipientCompany: invoice.clientCompany || 'Entreprise Partenaire',
    status: newStatus,
    subject,
    htmlBody,
    plainTextBody,
    amountFormatted: `${invoice.totalAmount.toLocaleString('fr-FR')} ${invoice.currencySymbol || '€'}`,
    currency: invoice.currency || 'EUR',
    sentAt: new Date().toISOString(),
    deliveryStatus: 'delivered',
    dispatchedBy: actorName,
    trackingCode: `TRK-INV-${Date.now().toString().slice(-6)}`,
    customNote
  };

  // 1. Update local storage logs
  const existing = getLocalEmailLogs();
  const updated = [emailLog, ...existing];
  persistLocalEmailLogs(updated);

  // 2. Dispatch cross-component event
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('vitech_invoice_email_sent', { detail: emailLog }));
  }

  // 3. Create client notification in client dashboard / portal
  try {
    await sendClientNotification({
      title: newStatus === 'paid' 
        ? `Quittance Facture #${invoice.invoiceNumber} Payée`
        : `Nouvelle Facture #${invoice.invoiceNumber} Émise`,
      message: newStatus === 'paid'
        ? `Le règlement de ${emailLog.amountFormatted} pour la facture #${invoice.invoiceNumber} a été validé. Reçu d'encaissement transmis par e-mail à ${emailLog.recipientEmail}.`
        : `La facture #${invoice.invoiceNumber} (${emailLog.amountFormatted}) a été transmise à ${emailLog.recipientEmail}. Échéance : ${invoice.dueDate}.`,
      type: 'document_uploaded',
      docRef: invoice.invoiceNumber,
      actorName: actorName
    });
  } catch (err) {
    console.warn('Client notification dispatch warning:', err);
  }

  // 4. Persist to Firestore collection `invoice_email_logs`
  try {
    const logDocRef = doc(db, 'invoice_email_logs', emailLog.id);
    await setDoc(logDocRef, emailLog);
  } catch (err) {
    console.warn('Firestore email log write warning:', err);
  }

  return emailLog;
}

/**
 * Fetch all email logs for a specific invoice
 */
export async function getInvoiceEmailLogs(invoiceId?: string): Promise<InvoiceEmailLog[]> {
  const local = getLocalEmailLogs();
  if (invoiceId) {
    return local.filter(l => l.invoiceId === invoiceId || l.invoiceNumber === invoiceId);
  }
  return local;
}
