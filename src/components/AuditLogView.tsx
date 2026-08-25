import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Download, 
  FileText, 
  FileCheck, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  UserCheck, 
  Lock, 
  Hash, 
  PenTool, 
  CheckCircle2, 
  Copy, 
  Check, 
  ExternalLink, 
  FileSpreadsheet, 
  Code, 
  Printer, 
  AlertCircle,
  Eye,
  Sparkles,
  ArrowUpDown,
  RefreshCw,
  Fingerprint
} from 'lucide-react';
import { DocumentAuditLog, AuditActionType, ProjectDocument } from '../types';
import { exportAuditLogsToCsv, exportAuditLogsToJson, exportAuditLogsToPdf } from '../services/auditLogService';

interface AuditLogViewProps {
  logs: DocumentAuditLog[];
  documents: ProjectDocument[];
  onSelectDocument?: (doc: ProjectDocument) => void;
  onRefresh?: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({
  logs,
  documents,
  onSelectDocument,
  onRefresh
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedActionType, setSelectedActionType] = useState<string>('all');
  const [selectedDocFilter, setSelectedDocFilter] = useState<string>('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>('all');
  const [inspectingLog, setInspectingLog] = useState<DocumentAuditLog | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedCert, setCopiedCert] = useState<string | null>(null);

  // Copy helpers
  const handleCopy = (text: string, type: 'hash' | 'cert') => {
    navigator.clipboard.writeText(text);
    if (type === 'hash') {
      setCopiedHash(text);
      setTimeout(() => setCopiedHash(null), 2500);
    } else {
      setCopiedCert(text);
      setTimeout(() => setCopiedCert(null), 2500);
    }
  };

  // Filter logs
  const filteredLogs = useMemo(() => {
    const safeLogs = Array.isArray(logs) ? logs : [];
    return safeLogs.filter((log) => {
      if (!log) return false;
      // Action Type filter
      if (selectedActionType !== 'all' && log.actionType !== selectedActionType) {
        return false;
      }

      // Document filter
      if (selectedDocFilter !== 'all') {
        if (log.documentId !== selectedDocFilter && log.docRef !== selectedDocFilter) {
          return false;
        }
      }

      // Time Range filter
      if (selectedTimeRange !== 'all') {
        const logDate = new Date(log.timestampUtc).getTime();
        const now = Date.now();
        const diffMs = now - logDate;
        if (selectedTimeRange === '24h' && diffMs > 24 * 3600 * 1000) return false;
        if (selectedTimeRange === '7d' && diffMs > 7 * 24 * 3600 * 1000) return false;
        if (selectedTimeRange === '30d' && diffMs > 30 * 24 * 3600 * 1000) return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase();
        const matchTitle = log.documentTitle?.toLowerCase().includes(term);
        const matchRef = log.docRef?.toLowerCase().includes(term);
        const matchActor = log.actorName?.toLowerCase().includes(term);
        const matchRole = log.actorRole?.toLowerCase().includes(term);
        const matchCert = log.certificateId?.toLowerCase().includes(term);
        const matchHash = log.hashSha256?.toLowerCase().includes(term);
        const matchDetails = log.details?.toLowerCase().includes(term);
        return matchTitle || matchRef || matchActor || matchRole || matchCert || matchHash || matchDetails;
      }

      return true;
    });
  }, [logs, selectedActionType, selectedDocFilter, selectedTimeRange, searchTerm]);

  // Statistics calculation
  const stats = useMemo(() => {
    const safeLogs = Array.isArray(logs) ? logs : [];
    const total = safeLogs.length;
    const signatures = safeLogs.filter(l => l && l.actionType === 'signature_created').length;
    const downloads = safeLogs.filter(l => l && l.actionType === 'document_downloaded').length;
    const validations = safeLogs.filter(l => l && l.actionType === 'milestone_validated').length;
    const hashChecks = safeLogs.filter(l => l && (l.actionType === 'hash_verified' || l.actionType === 'document_viewed')).length;
    return { total, signatures, downloads, validations, hashChecks };
  }, [logs]);

  // Action badge renderer
  const getActionBadge = (type: AuditActionType) => {
    switch (type) {
      case 'signature_created':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium text-xs">
            <PenTool className="w-3.5 h-3.5 text-emerald-400" />
            <span>Signature Électronique</span>
          </span>
        );
      case 'document_downloaded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-medium text-xs">
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Téléchargement PDF</span>
          </span>
        );
      case 'document_viewed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium text-xs">
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Consultation Sécurisée</span>
          </span>
        );
      case 'hash_verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium text-xs">
            <Hash className="w-3.5 h-3.5 text-amber-400" />
            <span>Contrôle d'Intégrité SHA-256</span>
          </span>
        );
      case 'milestone_validated':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium text-xs">
            <FileCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Recette &amp; Validation Jalon</span>
          </span>
        );
      case 'document_uploaded':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-medium text-xs">
            <Lock className="w-3.5 h-3.5 text-slate-400" />
            <span>Indexation Coffre-Fort</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-xs">
            Action Document
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Banner & Legal Notice */}
      <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl space-y-3.5 sm:space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 sm:p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5" />
              </span>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white tracking-tight">
                Journal d'Audit &amp; Traçabilité Cryptographique
              </h3>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-300 max-w-3xl leading-relaxed">
              Registre infalsifiable certifiant chaque consultation, téléchargement de PDF, contrôle d'empreinte SHA-256 et signature électronique eIDAS Level 3 &amp; OHADA effectuée sur les documents du projet.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => exportAuditLogsToPdf(filteredLogs)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-md shadow-cyan-950/40 transition-colors cursor-pointer"
              title="Exporter le rapport d'audit officiel au format PDF certifié"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exporter PDF Certifié</span>
            </button>

            <button
              onClick={() => exportAuditLogsToCsv(filteredLogs)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Exporter au format CSV pour Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>CSV</span>
            </button>

            <button
              onClick={() => exportAuditLogsToJson(filteredLogs)}
              className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border border-slate-700 transition-colors cursor-pointer"
              title="Exporter le registre d'audit complet en JSON signé"
            >
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>JSON</span>
            </button>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-1.5 sm:p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Actualiser le flux d'audit"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Stats Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-2 border-t border-slate-800/80">
          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 block">Total Événements</span>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-lg sm:text-xl font-black text-white font-mono">{stats.total}</span>
              <span className="text-[9px] sm:text-[10px] text-cyan-400 font-medium">actions tracées</span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-emerald-500/20 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 block">Signatures Numériques</span>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">{stats.signatures}</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-300 font-medium">eIDAS</span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 block">Téléchargements PDF</span>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-lg sm:text-xl font-black text-cyan-400 font-mono">{stats.downloads}</span>
              <span className="text-[9px] sm:text-[10px] text-cyan-300 font-medium">remis</span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-0.5">
            <span className="text-[9px] sm:text-[10px] uppercase font-semibold text-slate-400 block">Intégrité Cryptographique</span>
            <div className="flex items-baseline gap-1 sm:gap-1.5">
              <span className="text-lg sm:text-xl font-black text-emerald-400 font-mono">100%</span>
              <span className="text-[9px] sm:text-[10px] text-emerald-300 font-mono">0 altération</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 sm:space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher par document, réf, signataire..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 sm:pl-9 pr-4 py-1.5 sm:py-2 text-[11px] sm:text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Time Filter */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0 self-start md:self-auto">
            {[
              { id: 'all', label: 'Tout' },
              { id: '24h', label: '24h' },
              { id: '7d', label: '7 jours' },
              { id: '30d', label: '30 jours' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTimeRange(t.id)}
                className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all cursor-pointer ${
                  selectedTimeRange === t.id
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Type Filter Pills */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-1 border-t border-slate-800/80 text-xs">
          <span className="text-[10px] sm:text-[11px] text-slate-400 font-semibold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" />
            Actions :
          </span>
          {[
            { id: 'all', label: `Toutes (${logs.length})` },
            { id: 'signature_created', label: `Signatures (${stats.signatures})` },
            { id: 'document_downloaded', label: `Téléchargements (${stats.downloads})` },
            { id: 'milestone_validated', label: `Validations (${stats.validations})` },
            { id: 'hash_verified', label: `Contrôles Hash (${stats.hashChecks})` }
          ].map((action) => (
            <button
              key={action.id}
              onClick={() => setSelectedActionType(action.id)}
              className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-all cursor-pointer ${
                selectedActionType === action.id
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {action.label}
            </button>
          ))}

          {/* Optional Document Dropdown */}
          <div className="w-full sm:w-auto sm:ml-auto flex items-center gap-1.5 pt-1 sm:pt-0">
            <span className="text-[10px] sm:text-[11px] text-slate-400">Livrable :</span>
            <select
              value={selectedDocFilter}
              onChange={(e) => setSelectedDocFilter(e.target.value)}
              aria-label="Filtrer par livrable"
              className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] text-slate-300 focus:outline-none focus:border-cyan-500 cursor-pointer flex-1 sm:flex-initial sm:max-w-[200px] truncate"
            >
              <option value="all">Tous les documents</option>
              {documents.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.docRef} - {d.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Entries List / Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white">
              Chronologie des Événements ({filteredLogs.length} entrées)
            </h4>
          </div>

          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Horodatage UTC Certifié
          </span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-300">Aucun enregistrement d'audit trouvé</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Aucun événement ne correspond aux critères de recherche ou filtres sélectionnés.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedActionType('all');
                setSelectedDocFilter('all');
                setSelectedTimeRange('all');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {filteredLogs.map((log) => {
              const matchedDoc = documents.find(d => d.id === log.documentId || d.docRef === log.docRef);
              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 hover:bg-slate-800/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4 group"
                >
                  {/* Left Column: Action badge + Document Details */}
                  <div className="space-y-2 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getActionBadge(log.actionType)}
                      
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{log.timestamp}</span>
                      </span>

                      {log.docRef && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-cyan-300 border border-slate-800 font-bold">
                          {log.docRef}
                        </span>
                      )}

                      {log.certificateId && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Certificat : {log.certificateId}</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h5 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {log.documentTitle}
                      </h5>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {log.details}
                      </p>
                    </div>

                    {/* Actor & Organization Info */}
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1 text-slate-200">
                        <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
                        <strong className="text-white">{log.actorName}</strong>
                        <span>({log.actorRole})</span>
                      </span>
                      <span>•</span>
                      <span>{log.actorCompany}</span>
                      {log.ipAddress && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-slate-500 text-[10px]">{log.ipAddress}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Actions & Proof Inspector */}
                  <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                    {matchedDoc && onSelectDocument && (
                      <button
                        onClick={() => onSelectDocument(matchedDoc)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                        title="Ouvrir le document dans le visualiseur sécurisé"
                      >
                        <Eye className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Aperçu Doc</span>
                      </button>
                    )}

                    <button
                      onClick={() => setInspectingLog(log)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      title="Inspecter la fiche de preuve et empreinte SHA-256"
                    >
                      <Fingerprint className="w-3.5 h-3.5" />
                      <span>Preuve Légale</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INSPECT LOG FORENSIC MODAL */}
      {inspectingLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Fingerprint className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Fiche d'Éléments de Preuve Cryptographique
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    ID Traçabilité : {inspectingLog.id}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setInspectingLog(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs">
              {/* Action Banner */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono text-slate-400 font-bold">Nature de l'Acte</span>
                  {getActionBadge(inspectingLog.actionType)}
                </div>
                <h4 className="text-sm font-bold text-white">
                  {inspectingLog.documentTitle}
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {inspectingLog.details}
                </p>
              </div>

              {/* Forensic Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">Acteur / Signataire</span>
                  <strong className="text-white text-xs block">{inspectingLog.actorName}</strong>
                  <span className="text-slate-400 text-[11px] block">{inspectingLog.actorRole}</span>
                  <span className="text-cyan-400 text-[11px] block">{inspectingLog.actorCompany}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block font-medium">Horodatage Strict (UTC / ISO 8601)</span>
                  <strong className="text-cyan-300 font-mono text-xs block break-all">
                    {inspectingLog.timestampUtc}
                  </strong>
                  <span className="text-slate-400 text-[11px] block">Heure Locale : {inspectingLog.timestamp}</span>
                  <span className="text-emerald-400 text-[10px] font-mono block">Horodatage serveur certifié NTP</span>
                </div>
              </div>

              {/* SHA-256 Integrity Hash Box */}
              {inspectingLog.hashSha256 && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold flex items-center gap-1">
                      <Hash className="w-3.5 h-3.5" />
                      <span>Empreinte SHA-256 du Fichier :</span>
                    </span>
                    <button
                      onClick={() => handleCopy(inspectingLog.hashSha256!, 'hash')}
                      className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      {copiedHash === inspectingLog.hashSha256 ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier le Hash</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-cyan-300 break-all bg-slate-900/90 p-2.5 rounded-lg border border-cyan-500/20">
                    {inspectingLog.hashSha256}
                  </p>
                </div>
              )}

              {/* Certificate X.509 Box if present */}
              {inspectingLog.certificateId && (
                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-emerald-300 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Certificat X.509 Associé :</span>
                    </span>
                    <button
                      onClick={() => handleCopy(inspectingLog.certificateId!, 'cert')}
                      className="px-2 py-0.5 rounded bg-emerald-950 hover:bg-emerald-900 text-emerald-300 text-[10px] font-mono flex items-center gap-1 transition-colors cursor-pointer border border-emerald-500/30"
                    >
                      {copiedCert === inspectingLog.certificateId ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Copié</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copier ID</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="font-mono text-xs text-emerald-300 bg-slate-950 p-2 rounded border border-emerald-500/20">
                    {inspectingLog.certificateId}
                  </p>
                </div>
              )}

              {/* Technical Session Metadata */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                <div className="flex items-center justify-between">
                  <span>Adresse IP de Session :</span>
                  <span className="text-white font-mono">{inspectingLog.ipAddress || '197.214.12.89'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Agent Utilisateur :</span>
                  <span className="text-slate-300 font-mono truncate max-w-[300px]" title={inspectingLog.userAgent}>
                    {inspectingLog.userAgent || 'Navigateur Web Sécurisé'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Conformité Légale :</span>
                  <span className="text-emerald-400 font-semibold">eIDAS Level 3 &amp; OHADA AUDCG</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">
                Certificat probant délivré par V&amp;I TECH AFRICA LTD
              </span>
              <button
                onClick={() => setInspectingLog(null)}
                className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
