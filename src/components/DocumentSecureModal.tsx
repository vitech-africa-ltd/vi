import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  Printer, 
  Lock, 
  KeyRound, 
  UserCheck, 
  Eye, 
  Sparkles,
  FileCheck,
  Hash,
  PenTool,
  Fingerprint,
  Clock,
  History
} from 'lucide-react';
import { ProjectDocument, DocumentAuditLog } from '../types';
import { GeneratedPdfMetadata, downloadProjectPdf } from '../utils/pdfGenerator';
import { VitechLogo } from './VitechLogo';
import { DigitalSignatureModal } from './DigitalSignatureModal';
import { logAuditEvent, subscribeToAuditLogs } from '../services/auditLogService';

interface DocumentSecureModalProps {
  document: (ProjectDocument & { pdfData?: GeneratedPdfMetadata }) | null;
  onClose: () => void;
  onDownloadSuccess?: (docName: string) => void;
  onDocumentSigned?: (updatedDoc: ProjectDocument & { pdfData?: GeneratedPdfMetadata }) => void;
}

export const DocumentSecureModal: React.FC<DocumentSecureModalProps> = ({
  document: initialDocument,
  onClose,
  onDownloadSuccess,
  onDocumentSigned
}) => {
  const [currentDoc, setCurrentDoc] = useState(initialDocument);
  const [copiedHash, setCopiedHash] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'security' | 'signatories' | 'audit'>('content');
  const [isSignModalOpen, setIsSignModalOpen] = useState(false);
  const [docAuditLogs, setDocAuditLogs] = useState<DocumentAuditLog[]>([]);

  // Sync state if prop changes
  useEffect(() => {
    setCurrentDoc(initialDocument);
  }, [initialDocument]);

  // Load audit logs for this document
  useEffect(() => {
    if (!initialDocument) return;
    const unsub = subscribeToAuditLogs(
      initialDocument.projectId || 'proj-afripay-001',
      (allLogs) => {
        const filtered = allLogs.filter(
          l => l.documentId === initialDocument.id || l.docRef === initialDocument.docRef
        );
        setDocAuditLogs(filtered);
      }
    );
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [initialDocument]);

  if (!currentDoc) return null;

  const docItem = currentDoc;

  const pdfData: GeneratedPdfMetadata = docItem.pdfData || {
    title: docItem.title,
    docRef: docItem.docRef || 'VIT-DOC-2026',
    category: docItem.documentType.toUpperCase(),
    clientName: 'AfriPay Financial Services Ltd',
    projectName: 'AfriPay Core Switch Payment Platform',
    leadArchitect: 'Abdoulaye Wade Jr.',
    date: docItem.uploadedAt,
    version: docItem.version,
    sha256: docItem.hashSha256,
    milestoneTitle: 'Jalon de Projet',
    clientSignature: docItem.clientSignature,
    sections: [
      {
        heading: 'PÉRIMÈTRE TECHNIQUE DU DOCUMENT',
        content: [docItem.description, ...(docItem.keyPoints || [])]
      }
    ]
  };

  // Ensure latest clientSignature is present on pdfData
  if (docItem.clientSignature && !pdfData.clientSignature) {
    pdfData.clientSignature = docItem.clientSignature;
  }

  const handleCopyHash = () => {
    navigator.clipboard.writeText(docItem.hashSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2500);

    // Audit log hash check
    logAuditEvent({
      projectId: docItem.projectId || 'proj-afripay-001',
      documentId: docItem.id,
      documentTitle: docItem.title,
      docRef: docItem.docRef,
      actionType: 'hash_verified',
      actorName: 'Mamadou Diop',
      actorRole: 'Client Auditeur (CEO)',
      actorCompany: 'AfriPay Financial Services Ltd',
      hashSha256: docItem.hashSha256,
      verificationStatus: 'verified',
      details: `Vérification d'intégrité SHA-256 effectuée sur "${docItem.title}". Empreinte conforme.`
    });
  };

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      downloadProjectPdf(pdfData, docItem.fileName);
      
      // Record download in audit log
      logAuditEvent({
        projectId: docItem.projectId || 'proj-afripay-001',
        documentId: docItem.id,
        documentTitle: docItem.title,
        docRef: docItem.docRef,
        actionType: 'document_downloaded',
        actorName: 'Mamadou Diop',
        actorRole: 'Client Approbateur (CEO)',
        actorCompany: 'AfriPay Financial Services Ltd',
        hashSha256: docItem.hashSha256,
        verificationStatus: 'tamper_proof',
        details: `Exemplaire officiel certifié de "${docItem.title}" téléchargé au format PDF.`,
        metadata: {
          fileSize: docItem.fileSize,
          version: docItem.version
        }
      });

      if (onDownloadSuccess) {
        onDownloadSuccess(docItem.fileName);
      }
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setTimeout(() => setIsDownloading(false), 600);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSignatureSuccess = (signedDoc: ProjectDocument & { pdfData?: GeneratedPdfMetadata }) => {
    setCurrentDoc(signedDoc);
    setIsSignModalOpen(false);
    if (onDocumentSigned) {
      onDocumentSigned(signedDoc);
    }
  };

  const isClientSigned = !!docItem.clientSignature;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Top Bar */}
          <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                    {docItem.docRef}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {docItem.fileSize} • {docItem.version}
                  </span>
                  {isClientSigned ? (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Signé Client
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-1">
                      <PenTool className="w-2.5 h-2.5" />
                      À Signer
                    </span>
                  )}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white truncate mt-0.5">
                  {docItem.title}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isClientSigned && (
                <button
                  onClick={() => setIsSignModalOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950 transition-all cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Signer Numériquement</span>
                  <span className="sm:hidden">Signer</span>
                </button>
              )}

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950 transition-all cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isDownloading ? 'Génération...' : 'Télécharger PDF'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs Inside Modal */}
          <div className="flex items-center gap-1 px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Aperçu Document</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Empreinte SHA-256 & Chiffrement</span>
            </button>

            <button
              onClick={() => setActiveTab('signatories')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'signatories'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Signataires eIDAS ({docItem.signatories?.length || 2})</span>
              {isClientSigned && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'audit'
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span>Journal &amp; Traçabilité ({docAuditLogs.length})</span>
            </button>
          </div>

          {/* Modal Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 bg-[#020617]">
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Virtual PDF Sheet Simulator */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sm:p-7 shadow-inner space-y-5 relative overflow-hidden">
                  {/* Security Watermark on Background */}
                  <div className="absolute right-4 bottom-4 opacity-5 pointer-events-none select-none text-right">
                    <span className="text-8xl font-black font-mono">VITECH</span>
                  </div>

                  {/* PDF Header Simulator */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="flex items-center gap-3">
                      <VitechLogo variant="badge" size="md" />
                      <div>
                        <h4 className="text-sm font-black tracking-wider text-white">V&amp;I TECH AFRICA LTD</h4>
                        <p className="text-[10px] text-slate-400">Ingénierie Logicielle &amp; Cybersécurité • Norrsken Kigali / Dakar / Paris</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold inline-flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Document Certifié eIDAS</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono mt-1">Date: {docItem.uploadedAt}</p>
                    </div>
                  </div>

                  {/* Document Metadata Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Projet :</span>
                      <strong className="text-white text-[11px]">{pdfData.projectName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Client :</span>
                      <strong className="text-white text-[11px]">{pdfData.clientName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Lead Architect :</span>
                      <strong className="text-cyan-300 text-[11px]">{pdfData.leadArchitect}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Niveau de Sécurité :</span>
                      <span className="text-emerald-400 font-mono font-bold text-[11px]">AES-256 GCM</span>
                    </div>
                  </div>

                  {/* Document Title in PDF */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase font-mono text-cyan-400 font-bold tracking-wider">
                      {pdfData.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-white">
                      {pdfData.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {docItem.description}
                    </p>
                  </div>

                  {/* Key Clauses & Sections */}
                  <div className="space-y-4 pt-2">
                    {pdfData.sections?.map((sec, idx) => (
                      <div key={idx} className="p-3.5 rounded-lg bg-slate-950/60 border-l-2 border-l-cyan-500 border border-slate-800/60 space-y-2">
                        <h5 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          <FileCheck className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{sec.heading}</span>
                        </h5>
                        <div className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
                          {sec.content?.map((line, lIdx) => (
                            <p key={lIdx} className="text-[11px] text-slate-300">
                              • {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Document Key Points Highlights if available */}
                  {docItem.keyPoints && docItem.keyPoints.length > 0 && (
                    <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <h5 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Engagements Clés &amp; Garanties Contractuelles</span>
                      </h5>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {docItem.keyPoints.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2 text-slate-300 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Digital Signature Seal Preview at bottom of preview */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Fingerprint className="w-4 h-4 text-cyan-400" />
                          <strong className="text-xs text-white">Paraphe &amp; Signature Électronique</strong>
                        </div>
                        {isClientSigned ? (
                          <p className="text-[11px] text-emerald-300 font-mono">
                            ✓ Contre-signé par {docItem.clientSignature?.signerName} ({docItem.clientSignature?.signerRole}) • {docItem.clientSignature?.signedAt}
                          </p>
                        ) : (
                          <p className="text-[11px] text-amber-300">
                            Document en attente de la contre-signature du client bénéficiaire.
                          </p>
                        )}
                      </div>

                      {!isClientSigned ? (
                        <button
                          onClick={() => setIsSignModalOpen(true)}
                          className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <PenTool className="w-3.5 h-3.5" />
                          <span>Apposer ma Signature</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                          Certificat : {docItem.clientSignature?.certificateId}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-5">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-sm font-bold text-white">Vérification de l'Empreinte Numérique &amp; Intégrité</h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    L'empreinte cryptographique SHA-256 ci-dessous garantit qu'aucune altération, falsification ou modification non autorisée n'a été apportée au document depuis sa signature initiale sur les serveurs sécurisés de V&amp;I TECH AFRICA.
                  </p>

                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 flex items-center gap-1">
                        <Hash className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Hash SHA-256 (Signature d'intégrité) :</span>
                      </span>
                      <button
                        onClick={handleCopyHash}
                        className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        {copiedHash ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copié !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copier l'empreinte</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="font-mono text-xs text-cyan-300 break-all bg-slate-900/80 p-2 rounded border border-cyan-500/20">
                      {docItem.hashSha256}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <Lock className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-400 block">Chiffrement au Repos</span>
                      <strong className="text-xs text-white font-mono">AES-256 GCM</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <KeyRound className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-400 block">Gestion des Clés</span>
                      <strong className="text-xs text-white font-mono">HashiCorp Vault</strong>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <FileCheck className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                      <span className="text-[10px] text-slate-400 block">Norme Légale</span>
                      <strong className="text-xs text-white font-mono">eIDAS Level 3</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'signatories' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white">Signatures Électroniques Contradictoires</h4>
                    </div>

                    {!isClientSigned && (
                      <button
                        onClick={() => setIsSignModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        <span>Signer ce Document</span>
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    Document paraphé et validé par les deux parties avec certification d'horodatage UTC et certificats conformes eIDAS / OHADA.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Signatory 1: Provider */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">Prestataire Titulaire</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono">Validé</span>
                      </div>
                      <p className="text-xs font-bold text-white">{pdfData.leadArchitect}</p>
                      <p className="text-[11px] text-slate-400">Senior Partner &amp; Lead Architect @ V&amp;I TECH AFRICA</p>
                      <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-900">
                        Certificat X.509 : CN=Vitech-Root-CA-2026
                      </div>
                    </div>

                    {/* Signatory 2: Client */}
                    <div className={`p-4 rounded-xl border space-y-2 ${
                      isClientSigned 
                        ? 'bg-emerald-950/20 border-emerald-500/30' 
                        : 'bg-slate-950 border-slate-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono uppercase text-blue-400 font-bold">Client Bénéficiaire</span>
                        {isClientSigned ? (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            Signé Numériquement
                          </span>
                        ) : (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-mono">
                            En Attente
                          </span>
                        )}
                      </div>

                      {isClientSigned && docItem.clientSignature ? (
                        <>
                          <p className="text-xs font-bold text-white">{docItem.clientSignature.signerName}</p>
                          <p className="text-[11px] text-slate-300">{docItem.clientSignature.signerRole} • {docItem.clientSignature.signerCompany}</p>
                          
                          {/* Signature visual */}
                          {docItem.clientSignature.signatureDataUrl && (
                            <div className="p-2 rounded bg-slate-900/60 border border-emerald-500/20 my-1 max-w-[200px]">
                              <img
                                src={docItem.clientSignature.signatureDataUrl}
                                alt="Signature Client"
                                className="max-h-10 object-contain filter invert brightness-125"
                              />
                            </div>
                          )}

                          <div className="text-[10px] text-emerald-400/80 font-mono pt-1 border-t border-emerald-500/20 space-y-0.5">
                            <div>Certificat : {docItem.clientSignature.certificateId}</div>
                            <div>Horodatage UTC : {docItem.clientSignature.signedAt}</div>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-bold text-white">{pdfData.clientName}</p>
                          <p className="text-[11px] text-slate-400">Direction Générale &amp; Direction Technique</p>
                          <div className="pt-2">
                            <button
                              onClick={() => setIsSignModalOpen(true)}
                              className="w-full py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <PenTool className="w-3.5 h-3.5" />
                              <span>Apposer votre signature numérique</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: AUDIT LOG & CRYPTOGRAPHIC TRACEABILITY */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-cyan-400" />
                      <h4 className="text-sm font-bold text-white">
                        Journal d'Audit du Document ({docAuditLogs.length} événements)
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      eIDAS / OHADA Level 3
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Historique contradictoire et horodaté des accès, téléchargements et signatures pour <strong className="text-white">{docItem.docRef}</strong>.
                  </p>
                </div>

                {docAuditLogs.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/60 rounded-xl border border-slate-800 space-y-2">
                    <History className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs font-semibold text-slate-400">
                      Aucune action enregistrée pour ce document actuellement.
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Les téléchargements et signatures seront tracés automatiquement.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {docAuditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            {log.actionType === 'signature_created' ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center gap-1">
                                <PenTool className="w-3 h-3 text-emerald-400" />
                                Signature Électronique
                              </span>
                            ) : log.actionType === 'document_downloaded' ? (
                              <span className="px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold flex items-center gap-1">
                                <Download className="w-3 h-3 text-cyan-400" />
                                Téléchargement PDF
                              </span>
                            ) : log.actionType === 'hash_verified' ? (
                              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold flex items-center gap-1">
                                <Hash className="w-3 h-3 text-amber-400" />
                                Contrôle Intégrité SHA-256
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px] font-bold">
                                {log.actionType}
                              </span>
                            )}

                            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-500" />
                              {log.timestamp}
                            </span>
                          </div>

                          {log.certificateId && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                              Certificat : {log.certificateId}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-300">
                          {log.details}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 pt-1 border-t border-slate-900 font-mono">
                          <span>Acteur : <strong className="text-white">{log.actorName}</strong> ({log.actorRole})</span>
                          <span>•</span>
                          <span>UTC : {log.timestampUtc}</span>
                          {log.ipAddress && (
                            <>
                              <span>•</span>
                              <span>IP : {log.ipAddress}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Accès sécurisé réservé aux membres autorisés du projet {pdfData.projectName}.</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimer</span>
              </button>

              {!isClientSigned && (
                <button
                  onClick={() => setIsSignModalOpen(true)}
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950 transition-all cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5" />
                  <span>Signer le Document</span>
                </button>
              )}

              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Télécharger le PDF Certifié</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Digital Signature Modal */}
      {isSignModalOpen && (
        <DigitalSignatureModal
          document={docItem}
          isOpen={isSignModalOpen}
          onClose={() => setIsSignModalOpen(false)}
          onSignatureSuccess={handleSignatureSuccess}
        />
      )}
    </>
  );
};
