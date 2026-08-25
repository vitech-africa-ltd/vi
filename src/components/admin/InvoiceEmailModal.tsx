import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Copy,
  Check,
  Eye,
  RefreshCw
} from 'lucide-react';
import { Invoice } from '../../types';
import {
  InvoiceEmailLog,
  generateInvoiceEmailTemplate,
  sendAutomatedInvoiceEmail,
  getInvoiceEmailLogs
} from '../../services/emailNotificationService';

interface InvoiceEmailModalProps {
  invoice: Invoice | null;
  isOpen: boolean;
  onClose: () => void;
  onEmailSent?: (log: InvoiceEmailLog) => void;
}

export const InvoiceEmailModal: React.FC<InvoiceEmailModalProps> = ({
  invoice,
  isOpen,
  onClose,
  onEmailSent
}) => {
  if (!isOpen || !invoice) return null;

  const [activeStatusPreview, setActiveStatusPreview] = useState<'paid' | 'pending'>(
    invoice.status === 'paid' ? 'paid' : 'pending'
  );
  const [customNote, setCustomNote] = useState<string>('');
  const [viewMode, setViewMode] = useState<'html' | 'text' | 'history'>('html');
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [emailLogs, setEmailLogs] = useState<InvoiceEmailLog[]>([]);

  useEffect(() => {
    setActiveStatusPreview(invoice.status === 'paid' ? 'paid' : 'pending');
    loadLogs();
  }, [invoice]);

  const loadLogs = async () => {
    if (!invoice) return;
    const logs = await getInvoiceEmailLogs(invoice.id);
    setEmailLogs(logs);
  };

  const { subject, htmlBody, plainTextBody } = generateInvoiceEmailTemplate({
    invoice,
    status: activeStatusPreview,
    customNote
  });

  const handleSendEmail = async () => {
    if (!invoice) return;
    setIsSending(true);
    try {
      const log = await sendAutomatedInvoiceEmail({
        invoice,
        newStatus: activeStatusPreview,
        customNote,
        actorName: 'Administrateur V&I Tech'
      });
      setSendSuccess(`E-mail envoyé avec succès à ${invoice.clientEmail} !`);
      setEmailLogs(prev => [log, ...prev]);
      if (onEmailSent) onEmailSent(log);
      setTimeout(() => setSendSuccess(null), 4000);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi de l'e-mail.");
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(plainTextBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Centre de Notification E-mail Client
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-500/30">
                  {invoice.invoiceNumber}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Destinataire : <strong className="text-white">{invoice.clientEmail}</strong> ({invoice.clientCompany})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar / Template selector */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          {/* Status template switcher */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-400">Modèle :</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setActiveStatusPreview('pending')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                  activeStatusPreview === 'pending'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>En attente de paiement</span>
              </button>
              <button
                onClick={() => setActiveStatusPreview('paid')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 font-medium cursor-pointer ${
                  activeStatusPreview === 'paid'
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Facture Payée (Acquittée)</span>
              </button>
            </div>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setViewMode('html')}
                className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'html' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Aperçu HTML</span>
              </button>
              <button
                onClick={() => setViewMode('text')}
                className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'text' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Texte Brut</span>
              </button>
              <button
                onClick={() => setViewMode('history')}
                className={`px-2.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                  viewMode === 'history' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Historique ({emailLogs.length})</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          
          {sendSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-lg animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{sendSuccess}</span>
            </div>
          )}

          {/* Subject Display */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
            <span className="text-slate-400 font-medium">Objet : </span>
            <span className="text-white font-semibold">{subject}</span>
          </div>

          {/* Custom Note input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Ajouter une note ou consigne personnalisée au message (optionnel) :</span>
              <span className="text-[10px] text-slate-500">Visible dans l'encadré de l'e-mail</span>
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="Ex: Merci pour votre confiance. Le livrable jalon 2 a été validé avec succès."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
            />
          </div>

          {/* View Mode: HTML Preview */}
          {viewMode === 'html' && (
            <div className="rounded-2xl border border-slate-800 overflow-hidden bg-slate-950 shadow-inner">
              <div className="px-4 py-2 bg-slate-950 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Rendu E-mail Responsif (Design System V&amp;I Tech Enterprise)
                </span>
                <span className="font-mono text-slate-500">HTML5 / Tables</span>
              </div>
              <iframe
                title="Email Preview"
                srcDoc={htmlBody}
                className="w-full h-[380px] bg-slate-950 border-0"
              />
            </div>
          )}

          {/* View Mode: Plain Text */}
          {viewMode === 'text' && (
            <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[380px]">
              <button
                onClick={handleCopyText}
                className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
              {plainTextBody}
            </div>
          )}

          {/* View Mode: History */}
          {viewMode === 'history' && (
            <div className="space-y-3">
              {emailLogs.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl text-slate-500 text-xs">
                  Aucun e-mail n'a encore été tracé pour cette facture.
                </div>
              ) : (
                emailLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'paid' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30' : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                        }`}>
                          {log.status === 'paid' ? 'Facture Acquittée' : 'En Attente'}
                        </span>
                        <span className="font-mono text-slate-400">{log.trackingCode}</span>
                      </div>
                      <span className="text-slate-500 text-[11px]">{new Date(log.sentAt).toLocaleString('fr-FR')}</span>
                    </div>

                    <div className="text-white font-medium">{log.subject}</div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Envoyé à : <strong className="text-slate-200">{log.recipientEmail}</strong></span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Statut : Délivré
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Tracé cryptographique &amp; copie d'archive envoyée à contact.vitechdev@gmail.com</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-xs font-semibold transition cursor-pointer"
            >
              Fermer
            </button>

            <button
              onClick={handleSendEmail}
              disabled={isSending}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-lg shadow-amber-950 cursor-pointer disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Envoi en cours...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Envoyer la Notification E-mail</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
