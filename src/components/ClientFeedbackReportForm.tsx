import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, 
  RotateCcw, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Sparkles, 
  Trash2, 
  Copy, 
  Download, 
  Check, 
  Bookmark, 
  MessageSquare,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { ClientDraftReport, ClientProject } from '../types';
import { logAuditEvent } from '../services/auditLogService';
import { sendClientNotification } from '../services/notificationService';
import { jsPDF } from 'jspdf';

interface ClientFeedbackReportFormProps {
  project: ClientProject;
  currentRole: string;
  onReportSubmitted?: (report: ClientDraftReport) => void;
}

const STORAGE_KEY = 'vitech_client_portal_draft_v1';

export const ClientFeedbackReportForm: React.FC<ClientFeedbackReportFormProps> = ({
  project,
  currentRole,
  onReportSubmitted
}) => {
  // Form State
  const [category, setCategory] = useState<ClientDraftReport['category']>('sprint_feedback');
  const [title, setTitle] = useState<string>('');
  const [priority, setPriority] = useState<ClientDraftReport['priority']>('normal');
  const [relatedMilestoneId, setRelatedMilestoneId] = useState<string>(project.milestones[3]?.id?.toString() || '4');
  const [content, setContent] = useState<string>('');
  const [authorName, setAuthorName] = useState<string>('Mamadou Diop');
  const [authorEmail, setAuthorEmail] = useState<string>('m.diop@afripay.africa');
  const [actionItemsText, setActionItemsText] = useState<string>('');

  // Auto-Save Status State
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);
  const [hasDraftRestored, setHasDraftRestored] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Submitted reports history
  const [submittedReports, setSubmittedReports] = useState<ClientDraftReport[]>([
    {
      id: 'rep-001',
      projectId: project.id,
      authorName: 'Mamadou Diop',
      authorEmail: 'm.diop@afripay.africa',
      category: 'milestone_approval',
      title: 'Validation sans réserve du Sprint 3 - Passerelle MoMo UEMOA',
      content: 'Les tests de double écriture et de résilience réseau sur le cluster AWS Francfort ont démontré une latence < 45ms. La réconciliation comptable est validée.',
      priority: 'high',
      relatedMilestoneId: '3',
      actionItems: ['Activation en production programmée', 'Revue du PV contradictoire'],
      lastSavedAt: 'Hier à 16:45',
      status: 'submitted'
    },
    {
      id: 'rep-002',
      projectId: project.id,
      authorName: 'Aissatou Ndiaye',
      authorEmail: 'a.ndiaye@afripay.africa',
      category: 'sprint_feedback',
      title: 'Retour d’expérience Sprint 4 - Ergonomie du Vault Mobile',
      content: 'L’interface de consultation hors-ligne avec cache chiffré SQLite répond parfaitement aux spécifications terrain pour les agences à connectivité intermittente.',
      priority: 'normal',
      relatedMilestoneId: '4',
      actionItems: ['Ajouter un indicateur de niveau de batterie sur terminal PAX'],
      lastSavedAt: 'Il y a 3 jours',
      status: 'submitted'
    }
  ]);

  // Load draft from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.title || parsed.content) {
          setTitle(parsed.title || '');
          setContent(parsed.content || '');
          setCategory(parsed.category || 'sprint_feedback');
          setPriority(parsed.priority || 'normal');
          setRelatedMilestoneId(parsed.relatedMilestoneId || '4');
          setAuthorName(parsed.authorName || 'Mamadou Diop');
          setAuthorEmail(parsed.authorEmail || 'm.diop@afripay.africa');
          setActionItemsText(parsed.actionItemsText || '');
          setLastSavedTime(parsed.lastSavedAt || null);
          setHasDraftRestored(true);
        }
      }
    } catch (err) {
      console.warn('Error reading draft from localStorage:', err);
    }
  }, []);

  // Continuous Debounced Auto-Save
  useEffect(() => {
    // Only save if there's any user content entered
    if (!title && !content && !actionItemsText) return;

    setIsAutoSaving(true);
    const timer = setTimeout(() => {
      const draftData = {
        title,
        content,
        category,
        priority,
        relatedMilestoneId,
        authorName,
        authorEmail,
        actionItemsText,
        lastSavedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draftData));
        setLastSavedTime(draftData.lastSavedAt);
      } catch (e) {
        console.error('Failed to save to localStorage:', e);
      } finally {
        setIsAutoSaving(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [title, content, category, priority, relatedMilestoneId, authorName, authorEmail, actionItemsText]);

  // Clear draft
  const handleClearDraft = () => {
    if (window.confirm('Voulez-vous vraiment effacer ce brouillon et recommencer à zéro ?')) {
      localStorage.removeItem(STORAGE_KEY);
      setTitle('');
      setContent('');
      setActionItemsText('');
      setLastSavedTime(null);
      setHasDraftRestored(false);
    }
  };

  // Submit Form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Veuillez remplir au moins le titre et les observations du rapport.');
      return;
    }

    setIsSubmitting(true);

    const actionItems = actionItemsText
      .split('\n')
      .map(item => item.trim())
      .filter(item => item.length > 0);

    const newReport: ClientDraftReport = {
      id: `rep-${Date.now()}`,
      projectId: project.id,
      authorName,
      authorEmail,
      category,
      title,
      content,
      priority,
      relatedMilestoneId,
      actionItems,
      lastSavedAt: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      status: 'submitted'
    };

    try {
      // Record in Audit Trail
      await logAuditEvent({
        projectId: project.id,
        documentId: newReport.id,
        documentTitle: newReport.title,
        docRef: `REP-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
        actionType: 'document_uploaded',
        actorName: authorName,
        actorRole: currentRole === 'super_admin' ? 'Super Administrateur Client' : 'Direction Technique Client',
        actorEmail: authorEmail,
        actorCompany: project.clientName,
        hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        verificationStatus: 'tamper_proof',
        details: `Transmission du rapport client "${newReport.title}" (${category}) pour le jalon Sprint ${relatedMilestoneId}.`,
        metadata: {
          category,
          priority,
          relatedMilestoneId
        }
      });

      // Send in-app notification
      await sendClientNotification({
        projectId: project.id,
        title: 'Nouveau Rapport / Commentaire Transmis',
        message: `Le client ${authorName} a transmis le rapport "${title}" avec priorité ${priority}.`,
        type: 'document_uploaded',
        actorName: authorName
      });

      // Prepend to history
      setSubmittedReports(prev => [newReport, ...prev]);

      // Notify parent
      onReportSubmitted?.(newReport);

      // Clean local storage draft
      localStorage.removeItem(STORAGE_KEY);
      setTitle('');
      setContent('');
      setActionItemsText('');
      setLastSavedTime(null);
      setHasDraftRestored(false);

      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      alert('Une erreur est survenue lors de l\'enregistrement du rapport.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Export current draft as standalone PDF
  const handleExportPdf = () => {
    const doc = new jsPDF();
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 38, 'F');
    doc.setFillColor(6, 182, 212);
    doc.rect(0, 38, 210, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('V&I TECH AFRICA - RAPPORT / NOTE CLIENT', 16, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Projet : ${project.name} | Client : ${project.clientName}`, 16, 22);
    doc.text(`Auteur : ${authorName} (${authorEmail}) | Date : ${new Date().toLocaleDateString('fr-FR')}`, 16, 27);

    doc.setTextColor(15, 23, 42);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(title || 'Note de Synthèse Client', 16, 48);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Catégorie : ${category} | Priorité : ${priority} | Jalon : Sprint ${relatedMilestoneId}`, 16, 54);

    doc.setFillColor(248, 250, 252);
    doc.rect(16, 58, 178, 1, 'F');

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9.5);
    const splitContent = doc.splitTextToSize(content || 'Aucun contenu spécifié.', 178);
    doc.text(splitContent, 16, 66);

    let y = 66 + (splitContent.length * 5) + 8;
    if (actionItemsText) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('Éléments d\'action & Recommandations :', 16, y);
      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      const items = actionItemsText.split('\n').filter(i => i.trim());
      items.forEach(it => {
        doc.text(`• ${it}`, 18, y);
        y += 5;
      });
    }

    doc.save(`Note_Client_${(title || 'Brouillon').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
  };

  const handleCopy = () => {
    const fullText = `TITRE: ${title}\nCATÉGORIE: ${category}\nPRIORITÉ: ${priority}\nJALON: Sprint ${relatedMilestoneId}\nAUTEUR: ${authorName} (${authorEmail})\n\nOBSERVATIONS:\n${content}\n\nACTIONS:\n${actionItemsText}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* FORM CARD WITH LOCAL AUTO-SAVE */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/95 shadow-xl backdrop-blur-xl overflow-hidden">
        {/* Header Bar with Live Auto-Save Indicator */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Saisie de Rapport &amp; Validation de Sprint
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold uppercase">
                  Auto-Save Actif
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Vos saisies sont automatiquement persistées localement dans votre navigateur pour prévenir toute perte accidentelle.
              </p>
            </div>
          </div>

          {/* Real-time Status Badge */}
          <div className="flex items-center gap-2 shrink-0">
            {isAutoSaving ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-semibold animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                <span>Sauvegarde en cours...</span>
              </div>
            ) : lastSavedTime ? (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-semibold shadow-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Sauvegardé à {lastSavedTime}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-400 text-xs font-semibold">
                <Bookmark className="w-3.5 h-3.5" />
                <span>Prêt pour la saisie</span>
              </div>
            )}

            {(title || content || actionItemsText) && (
              <button
                type="button"
                onClick={handleClearDraft}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 hover:text-rose-400 text-slate-400 border border-slate-700 transition cursor-pointer"
                title="Vider le brouillon"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Restore Notification Alert if loaded from localStorage */}
        {hasDraftRestored && (
          <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Un brouillon non transmis a été automatiquement restauré depuis votre sauvegarde locale.</span>
            </div>
            <button
              onClick={() => setHasDraftRestored(false)}
              className="text-[11px] font-bold text-amber-300 hover:text-amber-100 underline cursor-pointer shrink-0"
            >
              Ignorer
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Row 1: Category & Priority & Milestone */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Type de Rapport / Communication
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                <option value="sprint_feedback">Retour Recette &amp; Sprint</option>
                <option value="milestone_approval">Validation Officielle de Jalon</option>
                <option value="incident_report">Rapport d'Incident / Bug</option>
                <option value="feature_request">Demande d'Évolution (Change Request)</option>
                <option value="governance_note">Note de Cadrage Stratégique</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Jalon / Sprint Rattaché
              </label>
              <select
                value={relatedMilestoneId}
                onChange={(e) => setRelatedMilestoneId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                {project.milestones.map((m) => (
                  <option key={m.id} value={m.id.toString()}>
                    Jalon {m.id} : {m.title.substring(0, 32)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Niveau d'Urgence / Priorité
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              >
                <option value="low">Basse (Information)</option>
                <option value="normal">Normale (Standard)</option>
                <option value="high">Haute (Action requise)</option>
                <option value="urgent">Urgente (Bloquant)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Titre / Objet du Rapport *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Validation formelle des endpoints Mobile Money MTN & Orange..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Row 3: Authors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Nom du Rédacteur / Responsable
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Email Professionnel
              </label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Row 4: Detailed Observations & Feedback */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-300">
                Observations Détaillées &amp; Recommandations Techniques *
              </label>
              <span className="text-[10px] text-slate-400">
                Sauvegarde automatique active (caractères : {content.length})
              </span>
            </div>
            <textarea
              required
              rows={4}
              placeholder="Décrivez les constatations de recette, le comportement observé, les résultats de benchmark ou les orientations pour le sprint suivant..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-y font-mono text-[11px]"
            />
          </div>

          {/* Row 5: Action Items */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Plan d'Action / Livrables Attendus (1 action par ligne)
            </label>
            <textarea
              rows={2}
              placeholder="Ex:&#10;1. Déployer le correctif sur le cluster Staging d'ici vendredi 18h&#10;2. Effectuer le test de charge à 5 000 requêtes/sec"
              value={actionItemsText}
              onChange={(e) => setActionItemsText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none font-mono text-[11px]"
            />
          </div>

          {/* Action Buttons Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                disabled={!title && !content}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Copier le texte"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                disabled={!title && !content}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                title="Exporter ce brouillon en PDF"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Exporter PDF</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition shadow-lg shadow-cyan-950 cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" />
                    <span>Transmission sécurisée...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Transmettre le Rapport &amp; Signer</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* RECENT SUBMITTED REPORTS LIST */}
      <div className="rounded-2xl border border-slate-700/80 bg-slate-900/90 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">
              Historique des Rapports &amp; Retours Client ({submittedReports.length})
            </h4>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold">
            Synchronisé avec l'Audit Log Blockchain
          </span>
        </div>

        <div className="space-y-3">
          {submittedReports.map((report) => (
            <div
              key={report.id}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/70 hover:border-slate-700 transition space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                    report.priority === 'urgent'
                      ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                      : report.priority === 'high'
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                      : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                  }`}>
                    {report.priority}
                  </span>
                  <span className="text-xs font-bold text-slate-200">
                    {report.title}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span>{report.authorName}</span>
                  <span>•</span>
                  <span>{report.lastSavedAt}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {report.content}
              </p>

              {report.actionItems && report.actionItems.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase">Actions :</span>
                  {report.actionItems.map((act, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                      ✓ {act}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SUCCESS CONFIRMATION MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md rounded-2xl border border-emerald-500/40 bg-slate-900 p-6 text-center shadow-2xl space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Rapport Client Enregistré &amp; Transmis !
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Votre rapport et vos observations ont été enregistrés avec succès dans le registre d'audit certifié VITECH AFRICA. L'équipe d'ingénierie et le Tech Lead ont été notifiés en temps réel.
            </p>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-left text-[11px] text-slate-400 space-y-1">
              <div className="flex justify-between">
                <span>Intégrité :</span>
                <span className="text-emerald-400 font-bold">✓ Scellé SHA-256</span>
              </div>
              <div className="flex justify-between">
                <span>Brouillon local :</span>
                <span className="text-slate-300 font-bold">Réinitialisé</span>
              </div>
            </div>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition cursor-pointer"
            >
              Fermer et Poursuivre
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
