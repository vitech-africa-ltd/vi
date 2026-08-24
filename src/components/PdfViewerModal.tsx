import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Download, 
  ShieldCheck, 
  FileText, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  PenTool, 
  Maximize2, 
  Minimize2, 
  Search, 
  Printer, 
  Copy, 
  Check, 
  Lock, 
  UserCheck, 
  Sparkles,
  FileCheck,
  Eye,
  RotateCw
} from 'lucide-react';
import { ProjectDocument, DigitalSignatureData } from '../types';
import { GeneratedPdfMetadata, downloadProjectPdf } from '../utils/pdfGenerator';
import { VitechLogo } from './VitechLogo';
import { logAuditEvent } from '../services/auditLogService';

interface PdfViewerModalProps {
  document: ProjectDocument & { pdfData?: GeneratedPdfMetadata };
  onClose: () => void;
  onSignClick?: () => void;
  onDownloadSuccess?: (docName: string) => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  document: docItem,
  onClose,
  onSignClick,
  onDownloadSuccess
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [activeThumbTab, setActiveThumbTab] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = 3;

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

  const isClientSigned = Boolean(docItem.clientSignature || (docItem.status === 'signed' || docItem.status === 'certified'));

  // Log view on open
  useEffect(() => {
    logAuditEvent({
      projectId: docItem.projectId || 'proj-afripay-001',
      documentId: docItem.id,
      documentTitle: docItem.title,
      docRef: docItem.docRef,
      actionType: 'document_viewed',
      actorName: 'Mamadou Diop',
      actorRole: 'Client Auditeur (CEO)',
      actorCompany: 'AfriPay Financial Services Ltd',
      hashSha256: docItem.hashSha256,
      verificationStatus: 'verified',
      details: `Lecture rapide et inspection visuelle PDF avant signature du document "${docItem.title}".`
    });
  }, [docItem]);

  const handleDownload = () => {
    setIsDownloading(true);
    try {
      downloadProjectPdf(pdfData, docItem.fileName);
      if (onDownloadSuccess) onDownloadSuccess(docItem.title);

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
        details: `Exemplaire officiel de "${docItem.title}" téléchargé via le lecteur PDF intégré.`
      });
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(docItem.hashSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top PDF Reader Toolbar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Document Info */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">
                  {docItem.docRef}
                </span>
                <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                  {docItem.title}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Version {docItem.version} • Chiffré AES-256 GCM • SHA-256 Validé
              </p>
            </div>
          </div>

          {/* Center: Pagination & Zoom Controls */}
          <div className="flex items-center gap-2 bg-slate-900 px-2.5 py-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage <= 1}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Page précédente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-[11px] font-mono text-slate-300 px-1 font-bold">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage >= totalPages}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              title="Page suivante"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            <div className="h-4 w-px bg-slate-800 mx-1" />

            <button
              onClick={() => setZoomLevel(prev => Math.max(50, prev - 15))}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Zoom arrière"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-[10px] font-mono text-cyan-400 font-bold min-w-[36px] text-center">
              {zoomLevel}%
            </span>

            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
              className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              title="Zoom avant"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {!isClientSigned && onSignClick && (
              <button
                onClick={onSignClick}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-cyan-950 transition-all cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Signer le Document</span>
                <span className="sm:hidden">Signer</span>
              </button>
            )}

            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Télécharger l'exemplaire PDF"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Télécharger</span>
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer hidden sm:block"
              title="Plein écran"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Fermer le lecteur"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Reader Core Body */}
        <div className="flex-1 flex overflow-hidden bg-slate-950">
          {/* Thumbnails Sidebar */}
          <div className={`w-36 sm:w-44 bg-slate-900/90 border-r border-slate-800 p-3 space-y-3 overflow-y-auto hidden md:block shrink-0`}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vignettes PDF</span>
              <span className="text-[10px] text-cyan-400 font-mono font-bold">3 Pages</span>
            </div>

            {/* Page 1 Thumbnail */}
            <div
              onClick={() => setCurrentPage(1)}
              className={`p-2 rounded-xl border transition-all cursor-pointer space-y-1 text-center ${
                currentPage === 1
                  ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950'
              }`}
            >
              <div className="w-full aspect-[1/1.4] bg-white rounded shadow-sm p-1 flex flex-col justify-between text-left select-none pointer-events-none">
                <div className="h-2 w-12 bg-slate-900 rounded-xs mb-1" />
                <div className="space-y-0.5">
                  <div className="h-1 w-full bg-slate-300 rounded-xs" />
                  <div className="h-1 w-3/4 bg-slate-200 rounded-xs" />
                  <div className="h-1 w-1/2 bg-slate-200 rounded-xs" />
                </div>
                <div className="h-2 w-full bg-cyan-100 border border-cyan-300 rounded-xs" />
              </div>
              <span className="text-[10px] font-bold text-slate-300 block">Page 1 : Synthèse</span>
            </div>

            {/* Page 2 Thumbnail */}
            <div
              onClick={() => setCurrentPage(2)}
              className={`p-2 rounded-xl border transition-all cursor-pointer space-y-1 text-center ${
                currentPage === 2
                  ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950'
              }`}
            >
              <div className="w-full aspect-[1/1.4] bg-white rounded shadow-sm p-1 flex flex-col justify-between text-left select-none pointer-events-none">
                <div className="h-1.5 w-16 bg-slate-900 rounded-xs mb-1" />
                <div className="space-y-1">
                  <div className="h-1 w-full bg-slate-300 rounded-xs" />
                  <div className="h-1 w-full bg-slate-200 rounded-xs" />
                  <div className="h-1 w-5/6 bg-slate-200 rounded-xs" />
                  <div className="h-1 w-full bg-slate-200 rounded-xs" />
                  <div className="h-1 w-2/3 bg-slate-200 rounded-xs" />
                </div>
                <div className="h-1.5 w-12 bg-slate-400 rounded-xs" />
              </div>
              <span className="text-[10px] font-bold text-slate-300 block">Page 2 : Spécifications</span>
            </div>

            {/* Page 3 Thumbnail */}
            <div
              onClick={() => setCurrentPage(3)}
              className={`p-2 rounded-xl border transition-all cursor-pointer space-y-1 text-center ${
                currentPage === 3
                  ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950'
              }`}
            >
              <div className="w-full aspect-[1/1.4] bg-white rounded shadow-sm p-1 flex flex-col justify-between text-left select-none pointer-events-none">
                <div className="h-1.5 w-14 bg-slate-900 rounded-xs" />
                <div className="space-y-0.5">
                  <div className="h-1 w-full bg-slate-200 rounded-xs" />
                  <div className="h-1 w-4/5 bg-slate-200 rounded-xs" />
                </div>
                <div className="grid grid-cols-2 gap-0.5">
                  <div className="h-3 bg-emerald-100 border border-emerald-400 rounded-xs" />
                  <div className="h-3 bg-cyan-100 border border-cyan-400 rounded-xs" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-slate-300 block flex items-center justify-center gap-1">
                <span>Page 3 : Signatures</span>
                {isClientSigned && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </span>
            </div>
          </div>

          {/* Main Document Canvas Viewer Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start bg-[#0b0f19]">
            <div 
              className="bg-white text-slate-900 shadow-2xl rounded-sm transition-all duration-200 relative overflow-hidden"
              style={{
                width: `${Math.round(720 * (zoomLevel / 100))}px`,
                minHeight: `${Math.round(1020 * (zoomLevel / 100))}px`,
                fontSize: `${Math.max(10, Math.round(12 * (zoomLevel / 100)))}px`
              }}
            >
              {/* Security Watermark on Background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none rotate-[-35deg]">
                <span className="text-7xl font-black font-mono">V&amp;I TECH AFRICA • CERTIFIÉ eIDAS</span>
              </div>

              {/* PDF Header Band */}
              <div className="bg-[#0f172a] text-white p-6 flex items-center justify-between border-b-2 border-cyan-500">
                <div className="flex items-center gap-3">
                  <VitechLogo variant="badge" size="md" />
                  <div>
                    <h1 className="text-base font-black tracking-wider text-white">V&amp;I TECH AFRICA LTD</h1>
                    <p className="text-[10px] text-slate-400">Ingénierie Logicielle, Architectures Cloud &amp; Cybersécurité</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold bg-slate-800 px-2 py-0.5 rounded text-cyan-400 border border-slate-700 inline-block">
                    RÉF: {docItem.docRef}
                  </span>
                  <p className="text-[9px] text-slate-400 font-mono mt-1">Conforme eIDAS Level 3 &amp; OHADA</p>
                </div>
              </div>

              {/* PAGE 1 CONTENT */}
              {currentPage === 1 && (
                <div className="p-8 space-y-6">
                  {/* Category & Title */}
                  <div className="space-y-1 pb-4 border-b border-slate-200">
                    <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-cyan-700 block">
                      {pdfData.category}
                    </span>
                    <h2 className="text-xl font-black text-slate-900 leading-snug">
                      {pdfData.title}
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed pt-1">
                      {docItem.description}
                    </p>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Projet Contractuel :</span>
                      <strong className="text-slate-800">{pdfData.projectName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Client Bénéficiaire :</span>
                      <strong className="text-slate-800">{pdfData.clientName}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Lead Architect :</span>
                      <strong className="text-cyan-800">{pdfData.leadArchitect}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Date de Publication :</span>
                      <span className="text-slate-800 font-mono">{pdfData.date}</span>
                    </div>
                  </div>

                  {/* Document Summary / Key Highlights */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Engagements Contractuels &amp; Portée du Livrable</span>
                    </h3>

                    <div className="space-y-2">
                      {docItem.keyPoints?.map((pt, i) => (
                        <div key={i} className="p-3 bg-slate-50 border-l-2 border-l-cyan-600 rounded-r text-xs text-slate-700 flex items-start gap-2">
                          <span className="text-cyan-600 font-bold">•</span>
                          <span>{pt}</span>
                        </div>
                      )) || (
                        <p className="text-xs text-slate-600">
                          Ce document certifie la conformité technique, l'intégrité architecturale et la cession des droits de propriété intellectuelle.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Cryptographic Seal Box */}
                  <div className="p-3.5 bg-slate-900 text-white rounded-lg space-y-1.5 font-mono text-[10px]">
                    <div className="flex items-center justify-between">
                      <span className="text-cyan-400 font-bold flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>EMPREINTE SHA-256 DU FICHIER (64 CARACTÈRES HEX)</span>
                      </span>
                      <button
                        onClick={handleCopyHash}
                        className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                      >
                        {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedHash ? 'Copié !' : 'Copier'}</span>
                      </button>
                    </div>
                    <p className="text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                      {docItem.hashSha256}
                    </p>
                  </div>
                </div>
              )}

              {/* PAGE 2 CONTENT */}
              {currentPage === 2 && (
                <div className="p-8 space-y-6">
                  <div className="pb-3 border-b border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">SECTION TECHNIQUE &amp; JURIDIQUE</span>
                    <h3 className="text-base font-black text-slate-900">Clauses de Propriété &amp; Spécifications Fonctionnelles</h3>
                  </div>

                  <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <FileCheck className="w-3.5 h-3.5 text-cyan-600" />
                        <span>1. Cession Exclusive 100% de la Propriété Intellectuelle (Art. 82 OHADA)</span>
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        V&amp;I TECH AFRICA LTD cède de manière irrévocable, exclusive et définitive l’intégralité des droits patrimoniaux d’auteur, codes sources, architectures, scripts de déploiement et modèles de données relatifs au présent livrable au bénéfice exclusif de {pdfData.clientName}.
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>2. Conformité PCI-DSS Level 1 &amp; ISO 20022</span>
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Les flux transactionnels respectent les normes internationales de sécurisation bancaire : chiffrement AES-256 GCM au repos, TLS 1.3 en transit, tokenisation des données sensibles et absence de stockage de cryptogrammes visuels (CVV).
                      </p>
                    </div>

                    <div className="p-3.5 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                      <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                        <span>3. Garantie de Maintenance &amp; SLA 99.98%</span>
                      </h4>
                      <p className="text-[11px] text-slate-600">
                        Prise en charge des anomalies critiques (P0) en moins de 15 minutes, réplication multi-régionale (Norrsken Kigali / Dakar / Paris) et tests d'intrusion trimestriels documentés.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PAGE 3 CONTENT */}
              {currentPage === 3 && (
                <div className="p-8 space-y-6">
                  <div className="pb-3 border-b border-slate-200">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold">PAGE D'ATTESTATION &amp; VALIDATION</span>
                    <h3 className="text-base font-black text-slate-900">Signatures Électroniques eIDAS &amp; Acte de Clôture</h3>
                  </div>

                  {/* Signatures Dual Block */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Architect Signature */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Pour V&amp;I TECH AFRICA LTD</span>
                      <div className="h-16 flex items-center justify-center bg-white rounded border border-slate-200 p-2">
                        <span className="font-serif italic text-base text-cyan-900 font-bold">Abdoulaye Wade Jr.</span>
                      </div>
                      <div className="text-[10px] text-slate-600 space-y-0.5 font-mono">
                        <p><strong>Signataire :</strong> Abdoulaye Wade Jr.</p>
                        <p><strong>Qualité :</strong> Senior Partner &amp; Lead Architect</p>
                        <p className="text-emerald-700 font-bold">Certificat : X509-VIT-2026-ARCH</p>
                      </div>
                    </div>

                    {/* Client Signature */}
                    <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">Pour {pdfData.clientName}</span>
                      
                      {isClientSigned ? (
                        <>
                          <div className="h-16 flex items-center justify-center bg-white rounded border border-emerald-200 p-2 relative overflow-hidden">
                            {docItem.clientSignature?.signatureDataUrl ? (
                              <img 
                                src={docItem.clientSignature.signatureDataUrl} 
                                alt="Signature Client" 
                                className="max-h-12 object-contain"
                              />
                            ) : (
                              <span className="font-serif italic text-base text-emerald-900 font-bold">
                                {docItem.clientSignature?.signerName || 'Mamadou Diop'}
                              </span>
                            )}
                            <div className="absolute right-1 bottom-1 text-[8px] bg-emerald-100 text-emerald-800 px-1 py-0.5 rounded font-mono font-bold">
                              eIDAS Signé
                            </div>
                          </div>
                          <div className="text-[10px] text-slate-600 space-y-0.5 font-mono">
                            <p><strong>Signataire :</strong> {docItem.clientSignature?.signerName || 'Mamadou Diop'}</p>
                            <p><strong>Qualité :</strong> {docItem.clientSignature?.signerRole || 'CEO AfriPay'}</p>
                            <p className="text-emerald-700 font-bold">
                              Certificat : {docItem.clientSignature?.certificateId || 'X509-AFRIPAY-2026-90412'}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="h-28 flex flex-col items-center justify-center bg-white rounded border-2 border-dashed border-cyan-300 p-3 text-center space-y-2">
                          <p className="text-[11px] text-slate-500 font-medium">Signature client en attente d'approbation</p>
                          {onSignClick && (
                            <button
                              onClick={onSignClick}
                              className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-bold flex items-center gap-1 shadow-sm cursor-pointer"
                            >
                              <PenTool className="w-3 h-3" />
                              <span>Signer Maintenant</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Regulatory Disclaimer */}
                  <div className="p-3 bg-slate-100 rounded text-[9px] text-slate-500 leading-tight">
                    Ce document électronique et les signatures associées bénéficient de la même valeur juridique probante qu'un écrit papier sous seing privé conformément à l'Acte Uniforme OHADA sur le Droit Commercial Général et au Règlement Européen eIDAS (UE) n° 910/2014.
                  </div>
                </div>
              )}

              {/* PDF Footer Band on Every Page */}
              <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-[9px] text-slate-500 font-mono">
                <span>V&amp;I TECH AFRICA LTD • Document officiel confidentiel</span>
                <span>Page {currentPage} sur {totalPages}</span>
                <span className="hidden sm:inline">Réf: {docItem.docRef}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
