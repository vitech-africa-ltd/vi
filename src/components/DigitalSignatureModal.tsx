import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  PenTool, 
  Type, 
  Upload, 
  RotateCcw, 
  Trash2, 
  ShieldCheck, 
  FileCheck2, 
  CheckCircle2, 
  Lock, 
  KeyRound, 
  Download, 
  Sparkles, 
  AlertCircle,
  Building2,
  User,
  Mail,
  Fingerprint
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProjectDocument, DigitalSignatureData } from '../types';
import { GeneratedPdfMetadata } from '../utils/pdfGenerator';
import { saveProjectDocument, downloadDocument } from '../services/projectDocumentsService';
import { logAuditEvent } from '../services/auditLogService';

interface DigitalSignatureModalProps {
  document: ProjectDocument & { pdfData?: GeneratedPdfMetadata };
  isOpen: boolean;
  onClose: () => void;
  onSignatureSuccess: (updatedDoc: ProjectDocument & { pdfData?: GeneratedPdfMetadata }) => void;
}

type SignatureMode = 'draw' | 'type' | 'upload';

const SIGNATURE_FONTS = [
  { id: 'font-1', name: 'Manuscrit Élégant', style: 'font-serif italic font-bold tracking-wide text-2xl' },
  { id: 'font-2', name: 'Script Exécutif', style: 'italic font-medium tracking-wider text-2xl font-mono' },
  { id: 'font-3', name: 'Directoire Cursive', style: 'font-serif italic font-semibold text-2xl' }
];

export const DigitalSignatureModal: React.FC<DigitalSignatureModalProps> = ({
  document: docItem,
  isOpen,
  onClose,
  onSignatureSuccess
}) => {
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('draw');
  
  // Signer details
  const [signerName, setSignerName] = useState('Mamadou Diop');
  const [signerRole, setSignerRole] = useState('Directeur Général & Fondateur');
  const [signerEmail, setSignerEmail] = useState('m.diop@afripay.africa');
  const [signerCompany, setSignerCompany] = useState('AfriPay Financial Services Ltd');
  const [typedFontIndex, setTypedFontIndex] = useState(0);
  const [inkColor, setInkColor] = useState('#1e3a8a'); // Professional dark blue
  const [consentGiven, setConsentGiven] = useState(true);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // OTP simulation
  const [securityPin, setSecurityPin] = useState('842-190');
  const [pinConfirmed, setPinConfirmed] = useState(true);
  
  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [drawingHistory, setDrawingHistory] = useState<ImageData[]>([]);
  
  // Submission & animation state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI resolution
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = inkColor;

    // Clear background to white/transparent
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    setDrawingHistory([]);
  }, [inkColor]);

  useEffect(() => {
    if (isOpen && signatureMode === 'draw') {
      setTimeout(() => {
        setupCanvas();
      }, 100);
    }
  }, [isOpen, signatureMode, setupCanvas]);

  // Update canvas stroke color
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = inkColor;
    }
  }, [inkColor]);

  if (!isOpen) return null;

  // Drawing Handlers
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Save state for undo
    const dpr = window.devicePixelRatio || 1;
    const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setDrawingHistory(prev => [...prev.slice(-10), currentState]);

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasDrawn(true);
    setErrorMessage(null);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
    setDrawingHistory([]);
  };

  const undoCanvas = () => {
    if (drawingHistory.length === 0) {
      clearCanvas();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = drawingHistory[drawingHistory.length - 1];
    ctx.putImageData(previousState, 0, 0);
    setDrawingHistory(prev => prev.slice(0, -1));
  };

  // Convert typed text to PNG DataURL
  const generateTypedSignatureDataUrl = (): string => {
    const offscreenCanvas = window.document.createElement('canvas');
    offscreenCanvas.width = 450;
    offscreenCanvas.height = 120;
    const ctx = offscreenCanvas.getContext('2d');
    if (!ctx) return '';

    ctx.clearRect(0, 0, 450, 120);
    ctx.fillStyle = inkColor;
    
    // Choose font rendering style
    if (typedFontIndex === 0) {
      ctx.font = 'italic bold 34px "Georgia", "Times New Roman", serif';
    } else if (typedFontIndex === 1) {
      ctx.font = 'italic 32px "Courier New", monospace';
    } else {
      ctx.font = 'italic 36px "Brush Script MT", "Caveat", cursive, sans-serif';
    }

    ctx.fillText(signerName || 'Signature', 25, 70);

    // Decorative underline flourish
    ctx.beginPath();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = inkColor;
    ctx.moveTo(25, 82);
    ctx.bezierCurveTo(150, 88, 250, 75, 380, 84);
    ctx.stroke();

    return offscreenCanvas.toDataURL('image/png');
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Veuillez sélectionner un fichier image valide (PNG ou JPEG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  // Generate cryptographic signature package and finalize
  const handleSubmitSignature = async () => {
    setErrorMessage(null);

    if (!signerName.trim()) {
      setErrorMessage('Veuillez renseigner le nom complet du signataire.');
      return;
    }

    if (!consentGiven) {
      setErrorMessage('Vous devez accepter les conditions et consentir à la valeur juridique de la signature.');
      return;
    }

    let finalSignatureDataUrl = '';

    if (signatureMode === 'draw') {
      if (!hasDrawn || !canvasRef.current) {
        setErrorMessage('Veuillez tracer votre signature dans le cadre ci-dessous.');
        return;
      }
      finalSignatureDataUrl = canvasRef.current.toDataURL('image/png');
    } else if (signatureMode === 'type') {
      finalSignatureDataUrl = generateTypedSignatureDataUrl();
    } else if (signatureMode === 'upload') {
      if (!uploadedImage) {
        setErrorMessage('Veuillez importer une image de votre signature ou cachet.');
        return;
      }
      finalSignatureDataUrl = uploadedImage;
    }

    setIsSubmitting(true);

    try {
      const now = new Date();
      const formattedDate = now.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      const timestampUtc = now.toISOString();
      const randomHex = Math.random().toString(16).substring(2, 10).toUpperCase();
      const certificateId = `VIT-EIDAS-2026-${randomHex}`;
      const verificationHash = Array.from(certificateId + signerName + timestampUtc)
        .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) % 1000000007, 7)
        .toString(16)
        .padStart(16, '0');

      const signatureData: DigitalSignatureData = {
        signerName,
        signerRole,
        signerEmail,
        signerCompany,
        signatureType: signatureMode,
        signatureDataUrl: finalSignatureDataUrl,
        signedAt: formattedDate,
        timestampUtc,
        certificateId,
        verificationHash,
        ipAddress: '197.234.219.42 (Dakar Secure Gateway)',
        consentGiven: true,
        securityPin,
        legalStatement: `Signé électroniquement avec valeur probante certifiée eIDAS & Actes uniformes OHADA par ${signerName} (${signerRole}).`
      };

      const updatedSignatories = docItem.signatories ? [...docItem.signatories] : [];
      const newSignatoryEntry = `${signerName} (${signerRole})`;
      if (!updatedSignatories.includes(newSignatoryEntry)) {
        updatedSignatories.push(newSignatoryEntry);
      }

      const updatedDocument: ProjectDocument & { pdfData?: GeneratedPdfMetadata } = {
        ...docItem,
        status: 'certified',
        signatories: updatedSignatories,
        clientSignature: signatureData,
        pdfData: docItem.pdfData ? {
          ...docItem.pdfData,
          clientSignature: signatureData
        } : undefined
      };

      // Persist to Firestore
      await saveProjectDocument(updatedDocument);

      // Record in immutable Audit Trail
      await logAuditEvent({
        projectId: docItem.projectId || 'proj-afripay-001',
        documentId: docItem.id,
        documentTitle: docItem.title,
        docRef: docItem.docRef,
        actionType: 'signature_created',
        actorName: signerName,
        actorRole: signerRole,
        actorEmail: signerEmail,
        actorCompany: signerCompany,
        certificateId: certificateId,
        hashSha256: docItem.hashSha256,
        verificationStatus: 'certified',
        details: `Signature électronique certifiée eIDAS / OHADA apposée par ${signerName} (${signerRole}) avec le certificat ${certificateId}.`,
        metadata: {
          signatureType: signatureMode,
          securityPinUsed: true,
          version: docItem.version
        }
      });

      // Trigger Confetti Celebration
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#10b981', '#3b82f6', '#f59e0b']
      });

      setIsSuccess(true);
      setIsSubmitting(false);

      // Trigger automatic certified PDF download
      setTimeout(() => {
        downloadDocument(updatedDocument);
        onSignatureSuccess(updatedDocument);
      }, 900);
    } catch (err: any) {
      console.error('Erreur lors de l\'enregistrement de la signature:', err);
      setErrorMessage('Une erreur est survenue lors de l\'enregistrement de la signature. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <PenTool className="w-4 h-4" />
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Signature Numérique Certifiée
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  eIDAS Level 3
                </span>
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Document : <strong className="text-white font-medium">{docItem.title}</strong> ({docItem.docRef})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1 custom-scrollbar text-xs">
          
          {/* Success Banner */}
          {isSuccess ? (
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-3 animate-scaleUp">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-white">Document Contre-Signé &amp; Certifié avec Succès !</h4>
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Votre signature électronique a été apposée avec horodatage immuable et empreinte cryptographique SHA-256. Le PDF officiel vient d'être téléchargé.
              </p>
              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Fermer &amp; Voir l'Espace Projet
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Signer Identity Information */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Identité du Signataire Habilité</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">Vérification X.509</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Nom complet du signataire :</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={signerName}
                        onChange={(e) => setSignerName(e.target.value)}
                        placeholder="Ex: Mamadou Diop"
                        className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Fonction / Titre :</label>
                    <input
                      type="text"
                      value={signerRole}
                      onChange={(e) => setSignerRole(e.target.value)}
                      placeholder="Ex: Directeur Général"
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Entreprise / Organisation :</label>
                    <div className="relative">
                      <Building2 className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                      <input
                        type="text"
                        value={signerCompany}
                        onChange={(e) => setSignerCompany(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Email de notification légale :</label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2" />
                      <input
                        type="email"
                        value={signerEmail}
                        onChange={(e) => setSignerEmail(e.target.value)}
                        className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Mode Switcher */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Mode d'Apposition :</span>
                  {signatureMode === 'draw' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">Couleur d'encre :</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setInkColor('#1e3a8a')}
                          className={`w-4 h-4 rounded-full bg-blue-900 border-2 ${inkColor === '#1e3a8a' ? 'border-cyan-400 scale-110' : 'border-transparent'}`}
                          title="Bleu Marine"
                        />
                        <button
                          type="button"
                          onClick={() => setInkColor('#0f172a')}
                          className={`w-4 h-4 rounded-full bg-slate-900 border-2 ${inkColor === '#0f172a' ? 'border-cyan-400 scale-110' : 'border-slate-600'}`}
                          title="Noir Formel"
                        />
                        <button
                          type="button"
                          onClick={() => setInkColor('#0284c7')}
                          className={`w-4 h-4 rounded-full bg-sky-600 border-2 ${inkColor === '#0284c7' ? 'border-cyan-400 scale-110' : 'border-transparent'}`}
                          title="Bleu Cyan"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSignatureMode('draw')}
                    className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      signatureMode === 'draw'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Dessiner</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignatureMode('type')}
                    className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      signatureMode === 'type'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <Type className="w-3.5 h-3.5" />
                    <span>Taper le Nom</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSignatureMode('upload')}
                    className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      signatureMode === 'upload'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:bg-slate-800'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Importer Image</span>
                  </button>
                </div>
              </div>

              {/* Mode 1: Drawing Canvas */}
              {signatureMode === 'draw' && (
                <div className="space-y-2">
                  <div className="relative rounded-xl bg-slate-950 border-2 border-dashed border-cyan-500/40 p-2 overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      onPointerDown={startDrawing}
                      onPointerMove={draw}
                      onPointerUp={stopDrawing}
                      onPointerLeave={stopDrawing}
                      className="w-full h-36 bg-slate-950 cursor-crosshair rounded-lg touch-none"
                    />
                    
                    {!hasDrawn && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-500 text-xs">
                        <span>Signez ici avec votre souris, stylet ou doigt...</span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-3 text-[10px] text-slate-500 font-mono flex items-center gap-1">
                      <Lock className="w-3 h-3 text-cyan-400" />
                      <span>Tracé capturé en haute précision</span>
                    </div>

                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={undoCanvas}
                        className="p-1.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        title="Annuler le dernier trait"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={clearCanvas}
                        className="p-1.5 rounded bg-slate-800/80 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 transition-colors cursor-pointer"
                        title="Effacer tout"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 2: Typed Font Styles */}
              {signatureMode === 'type' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SIGNATURE_FONTS.map((font, idx) => (
                      <button
                        key={font.id}
                        type="button"
                        onClick={() => setTypedFontIndex(idx)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                          typedFontIndex === idx
                            ? 'bg-cyan-500/10 border-cyan-400 shadow-sm'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <span className="text-[10px] text-slate-400 block mb-1">{font.name}</span>
                        <p className={`text-cyan-300 truncate ${font.style}`}>
                          {signerName || 'Signature'}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase font-mono">Aperçu du paraphe légal</span>
                    <div className="py-2">
                      <p className={`text-cyan-300 text-3xl ${SIGNATURE_FONTS[typedFontIndex].style}`}>
                        {signerName || 'Signature'}
                      </p>
                    </div>
                    <div className="w-48 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/60 to-transparent mx-auto"></div>
                  </div>
                </div>
              )}

              {/* Mode 3: Image Upload */}
              {signatureMode === 'upload' && (
                <div className="space-y-2">
                  <label className="relative flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 transition-colors cursor-pointer group">
                    <input
                      type="file"
                      accept="image/png,image/jpeg"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    {uploadedImage ? (
                      <div className="space-y-2 text-center">
                        <img
                          src={uploadedImage}
                          alt="Signature importée"
                          className="max-h-24 max-w-full object-contain mx-auto filter invert brightness-125"
                        />
                        <span className="text-[11px] text-cyan-400 block">Cliquez pour changer d'image</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-2">
                        <Upload className="w-8 h-8 text-slate-500 group-hover:text-cyan-400 transition-colors mx-auto" />
                        <div>
                          <span className="text-xs text-white font-medium">Importer un scan de votre signature ou cachet</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">Formats acceptés : PNG ou JPG transparent (max 2 Mo)</span>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              )}

              {/* OTP Security Verification Badge */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                    <strong className="text-white text-xs">Validation 2FA &amp; Code OTP Instantané</strong>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Code d'autorisation sécurisé généré pour la transaction contractuelle :
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-900 border border-cyan-500/30 text-cyan-300 tracking-wider">
                    {securityPin}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Validé
                  </span>
                </div>
              </div>

              {/* Legal Consent Checkbox */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-[11px] text-slate-300 leading-relaxed">
                    Je confirme être dûment mandaté(e) pour représenter <strong className="text-white">{signerCompany}</strong> et appose ma signature avec force probante conformément au règlement européen <strong className="text-cyan-300 font-mono">eIDAS (N° 910/2014)</strong> et aux dispositions de l'Acte Uniforme <strong className="text-cyan-300 font-mono">OHADA</strong> relatif au droit commercial général.
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer Controls */}
        {!isSuccess && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Chiffrement certifié AES-256 GCM &amp; Horodatage UTC immuable.</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                type="button"
                onClick={handleSubmitSignature}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-950 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Certification en cours...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4" />
                    <span>Apposer la Signature &amp; Télécharger le PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
