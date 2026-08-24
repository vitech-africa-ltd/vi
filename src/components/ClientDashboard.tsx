import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  CheckCircle, 
  Clock, 
  Download, 
  Upload, 
  FileText, 
  FolderLock, 
  Users, 
  Activity, 
  TrendingUp, 
  RefreshCw, 
  Plus, 
  ExternalLink, 
  Server,
  Layers,
  Search,
  Eye,
  X,
  LifeBuoy,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Lock,
  FileCheck,
  FileCode,
  Award,
  Hash,
  Filter,
  PenTool,
  Fingerprint,
  History,
  ScrollText
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { INITIAL_CLIENT_PROJECT } from '../data/companyData';
import { INITIAL_PROJECT_DOCUMENTS } from '../data/projectDocumentsData';
import { ProjectDocument, TeamPermissionUser, DocumentAuditLog } from '../types';
import { GeneratedPdfMetadata } from '../utils/pdfGenerator';
import { 
  subscribeToProjectDocuments, 
  saveProjectDocument, 
  downloadDocument 
} from '../services/projectDocumentsService';
import { 
  subscribeToAuditLogs, 
  logAuditEvent 
} from '../services/auditLogService';
import { DocumentSecureModal } from './DocumentSecureModal';
import { PdfViewerModal } from './PdfViewerModal';
import { ProjectProgressCharts } from './ProjectProgressCharts';
import { NotificationCenter } from './NotificationCenter';
import { AuditLogView } from './AuditLogView';
import { ClientFaqAiAssistant } from './ClientFaqAiAssistant';
import { VitechLogo } from './VitechLogo';

export const ClientDashboard: React.FC = () => {
  // Authentication & MFA Role Simulator
  const [activeRole, setActiveRole] = useState<'super_admin' | 'tech_lead' | 'product_manager' | 'viewer'>('super_admin');

  // Dashboard Navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'faq' | 'analytics' | 'permissions' | 'audit'>('overview');

  // Project state
  const [projectData, setProjectData] = useState(INITIAL_CLIENT_PROJECT);
  const [teamMembers, setTeamMembers] = useState<TeamPermissionUser[]>(INITIAL_CLIENT_PROJECT.teamPermissions);

  // Firestore Project Documents State
  const [documents, setDocuments] = useState<(ProjectDocument & { pdfData?: GeneratedPdfMetadata })[]>(INITIAL_PROJECT_DOCUMENTS);
  const [selectedDocForModal, setSelectedDocForModal] = useState<(ProjectDocument & { pdfData?: GeneratedPdfMetadata }) | null>(null);
  const [selectedDocForPdfModal, setSelectedDocForPdfModal] = useState<(ProjectDocument & { pdfData?: GeneratedPdfMetadata }) | null>(null);

  // Firestore Immutable Audit Trail State
  const [auditLogs, setAuditLogs] = useState<DocumentAuditLog[]>([]);

  // Milestones Filter
  const [milestoneFilter, setMilestoneFilter] = useState<'all' | 'completed' | 'in_progress' | 'upcoming'>('all');

  // Support Tickets State
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TICK-801', title: 'Ajout endpoint webhook notification MTN MoMo', status: 'resolved', priority: 'high', category: 'API', openedAt: 'Il y a 3j', resolvedAt: 'Il y a 1j', assignee: 'Lead Dev Vitech' },
    { id: 'TICK-802', title: 'Optimisation indexation SQLite mode offline', status: 'in_progress', priority: 'medium', category: 'Mobile', openedAt: 'Hier à 14h', assignee: 'Ingénieur Mobile' },
    { id: 'TICK-803', title: 'Configuration certificat mTLS passerelle bancaire', status: 'open', priority: 'critical', category: 'Sécurité', openedAt: 'Aujourd\'hui à 09h', assignee: 'DevSecOps Lead' },
    { id: 'TICK-804', title: 'Mise à jour export relevé comptable en PDF', status: 'resolved', priority: 'low', category: 'Reporting', openedAt: 'Il y a 5j', resolvedAt: 'Il y a 4j', assignee: 'Front Architect' },
  ]);

  const [showNewTicketModal, setShowNewTicketModal] = useState<boolean>(false);
  const [newTicketTitle, setNewTicketTitle] = useState<string>('');
  const [newTicketCategory, setNewTicketCategory] = useState<string>('API');
  const [newTicketPriority, setNewTicketPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');

  // Chart Datasets
  const weeklyActivityData = [
    { week: 'Sem 1', commits: 45, apiCalls: 12000, testsPassed: 98 },
    { week: 'Sem 2', commits: 68, apiCalls: 28000, testsPassed: 142 },
    { week: 'Sem 3', commits: 82, apiCalls: 45000, testsPassed: 210 },
    { week: 'Sem 4', commits: 95, apiCalls: 89000, testsPassed: 320 },
    { week: 'Sem 5', commits: 110, apiCalls: 135000, testsPassed: 415 },
    { week: 'Sem 6 (En cours)', commits: 124, apiCalls: 180000, testsPassed: 512 },
  ];

  const ticketStatusData = [
    { name: 'Résolus', count: supportTickets.filter(t => t.status === 'resolved').length, fill: '#10b981' },
    { name: 'En cours', count: supportTickets.filter(t => t.status === 'in_progress').length, fill: '#06b6d4' },
    { name: 'Ouverts', count: supportTickets.filter(t => t.status === 'open').length, fill: '#f59e0b' },
  ];

  const milestonesVelocityData = [
    { name: 'Sprint 1', prevu: 42, livre: 42 },
    { name: 'Sprint 2', prevu: 58, livre: 58 },
    { name: 'Sprint 3', prevu: 48, livre: 48 },
    { name: 'Sprint 4', prevu: 50, livre: 34 },
    { name: 'Sprint 5', prevu: 45, livre: 0 },
    { name: 'Sprint 6', prevu: 40, livre: 0 },
  ];
  
  // Real-time Vault upload simulator state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [fileFilter, setFileFilter] = useState<string>('all');
  const [searchVault, setSearchVault] = useState<string>('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  // New collaborator modal
  const [showAddMemberModal, setShowAddMemberModal] = useState<boolean>(false);
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [newMemberName, setNewMemberName] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<'super_admin' | 'tech_lead' | 'product_manager' | 'viewer'>('viewer');

  // Real-time Firestore sync on mount (Documents & Audit Trail)
  useEffect(() => {
    const unsubscribeDocs = subscribeToProjectDocuments(
      'proj-afripay-001',
      (syncedDocs) => {
        setDocuments(syncedDocs);
      }
    );

    const unsubscribeAudit = subscribeToAuditLogs(
      'proj-afripay-001',
      (syncedLogs) => {
        setAuditLogs(syncedLogs);
      }
    );

    return () => {
      if (typeof unsubscribeDocs === 'function') unsubscribeDocs();
      if (typeof unsubscribeAudit === 'function') unsubscribeAudit();
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Direct PDF Download handler with immutable Audit Trail registration
  const handleDownloadDoc = async (docItem: ProjectDocument & { pdfData?: GeneratedPdfMetadata }) => {
    try {
      downloadDocument(docItem);
      showNotification(`Téléchargement de "${docItem.fileName}" initié.`);

      // Log the download action
      await logAuditEvent({
        projectId: docItem.projectId || 'proj-afripay-001',
        documentId: docItem.id,
        documentTitle: docItem.title,
        docRef: docItem.docRef,
        actionType: 'document_downloaded',
        actorName: 'Mamadou Diop',
        actorRole: activeRole === 'super_admin' ? 'Super Administrateur Client' : activeRole === 'tech_lead' ? 'Tech Lead Client' : 'Auditeur / Finance',
        actorEmail: 'm.diop@afripay.africa',
        actorCompany: 'AfriPay Financial Services Ltd',
        hashSha256: docItem.hashSha256,
        verificationStatus: 'tamper_proof',
        details: `Téléchargement du document ${docItem.docRef} (${docItem.fileName}) depuis le coffre-fort documentaire.`,
        metadata: {
          fileSize: docItem.fileSize,
          version: docItem.version
        }
      });
    } catch (err) {
      console.error(err);
      showNotification(`Erreur lors du téléchargement de "${docItem.fileName}".`);
    }
  };

  // Sign-off / Recette validation action
  const handleValidateMilestone = async (milestoneId: string, milestoneTitle: string) => {
    const newDocId = `doc-pvr-${Date.now()}`;
    const newDoc: ProjectDocument = {
      id: newDocId,
      projectId: 'proj-afripay-001',
      milestoneId: milestoneId,
      title: `Procès-Verbal de Validation & Recette : ${milestoneTitle}`,
      docRef: `VIT-PVR-2026-${Math.floor(100 + Math.random() * 900)}`,
      documentType: 'delivery_report',
      fileName: `PV-Recette-${milestoneId}-Signe.pdf`,
      fileSize: '2.8 Mo',
      hashSha256: '7c89a012b345c678d901e234f567a890123456789abcdef0123456789abcdef0',
      version: 'v1.0 (Signé Recette)',
      encrypted: true,
      signatories: ['Client Approbateur (Mamadou Diop)', 'Abdoulaye Wade Jr. (Vitech)'],
      status: 'signed',
      uploadedAt: "Aujourd'hui",
      description: `Validation formelle et contradictoire des livrables techniques du ${milestoneTitle}.`,
      keyPoints: [
        'Recette technique validée par le client sans réserve',
        'Cession pleine et entière de la propriété intellectuelle du sprint',
        'Passage officiel à l\'étape suivante'
      ]
    };

    try {
      await saveProjectDocument(newDoc);

      // Record in audit log
      await logAuditEvent({
        projectId: 'proj-afripay-001',
        documentId: newDoc.id,
        documentTitle: newDoc.title,
        docRef: newDoc.docRef,
        actionType: 'signature_created',
        actorName: 'Mamadou Diop',
        actorRole: 'Directeur Général & Approbateur Recette',
        actorEmail: 'm.diop@afripay.africa',
        actorCompany: 'AfriPay Financial Services Ltd',
        certificateId: `VIT-PVR-CERT-${Date.now().toString(16).toUpperCase()}`,
        hashSha256: newDoc.hashSha256,
        verificationStatus: 'certified',
        details: `Signature et validation formelle du procès-verbal de recette pour le jalon "${milestoneTitle}".`,
        metadata: {
          milestoneId,
          milestoneTitle
        }
      });

      // Update milestone status locally
      setProjectData(prev => ({
        ...prev,
        milestones: prev.milestones.map(m => m.id === milestoneId ? { ...m, status: 'completed' as const, progress: 100 } : m)
      }));
      showNotification(`Jalon "${milestoneTitle}" validé avec succès ! Procès-verbal généré et archivé.`);
    } catch (e) {
      console.error(e);
      showNotification(`Jalon validé.`);
    }
  };

  // Upload simulator with Firestore saving
  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(async () => {
            setIsUploading(false);
            setUploadProgress(0);
            
            const newDoc: ProjectDocument = {
              id: `doc-${Date.now()}`,
              projectId: 'proj-afripay-001',
              title: file.name.replace(/\.[^/.]+$/, ''),
              docRef: `VIT-UPL-2026-${Math.floor(100 + Math.random() * 900)}`,
              documentType: file.name.includes('contrat') ? 'contract' : file.name.includes('audit') ? 'audit' : 'spec',
              fileName: file.name,
              fileSize: `${(file.size / (1024 * 1024)).toFixed(1)} Mo`,
              hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              version: 'v1.0 (Téléversé)',
              encrypted: true,
              signatories: ['Client Utilisateur'],
              status: 'signed',
              uploadedAt: "À l'instant",
              description: 'Document téléversé par le client et chiffré au repos en AES-256 GCM.',
            };

            await saveProjectDocument(newDoc);
            setDocuments(prev => [newDoc, ...prev]);
            showNotification(`Fichier "${file.name}" chiffré en AES-256 et synchronisé avec Firestore.`);
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  // Toggle user permission
  const handleTogglePermission = (userId: string, permKey: keyof TeamPermissionUser['permissions']) => {
    setTeamMembers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          return {
            ...user,
            permissions: {
              ...user.permissions,
              [permKey]: !user.permissions[permKey],
            },
          };
        }
        return user;
      })
    );
    showNotification('Permissions d’équipe mises à jour avec succès.');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberEmail || !newMemberName) return;

    const newMember: TeamPermissionUser = {
      id: `user-${Date.now()}`,
      name: newMemberName,
      email: newMemberEmail,
      role: newMemberRole,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      lastActive: "À l'instant",
      permissions: {
        canViewCode: newMemberRole === 'super_admin' || newMemberRole === 'tech_lead',
        canDeployStaging: newMemberRole === 'super_admin' || newMemberRole === 'tech_lead' || newMemberRole === 'product_manager',
        canDownloadInvoices: newMemberRole === 'super_admin' || newMemberRole === 'viewer',
        canManageAPIKeys: newMemberRole === 'super_admin',
        canManageTeam: newMemberRole === 'super_admin',
      },
    };

    setTeamMembers([...teamMembers, newMember]);
    setShowAddMemberModal(false);
    setNewMemberEmail('');
    setNewMemberName('');
    showNotification(`Collaborateur ${newMemberName} invité avec le rôle ${newMemberRole}.`);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketTitle.trim()) return;

    const newTicket = {
      id: `TICK-${Math.floor(805 + Math.random() * 100)}`,
      title: newTicketTitle.trim(),
      status: 'open',
      priority: newTicketPriority,
      category: newTicketCategory,
      openedAt: "À l'instant",
      assignee: 'Lead Support Vitech',
    };

    setSupportTickets((prev) => [newTicket, ...prev]);
    setNewTicketTitle('');
    setShowNewTicketModal(false);
    showNotification(`Ticket ${newTicket.id} ouvert avec succès. SLA de prise en charge < 15 min.`);
  };

  // Filter vault files & documents
  const filteredDocuments = documents.filter((docItem) => {
    const matchesCat = fileFilter === 'all' || 
      (fileFilter === 'contracts' && docItem.documentType === 'contract') ||
      (fileFilter === 'specs' && docItem.documentType === 'spec') ||
      (fileFilter === 'deliverables' && docItem.documentType === 'delivery_report') ||
      (fileFilter === 'security' && docItem.documentType === 'audit') ||
      (fileFilter === 'invoices' && docItem.documentType === 'invoice');
    
    const matchesSearch = docItem.title.toLowerCase().includes(searchVault.toLowerCase()) ||
                          docItem.fileName.toLowerCase().includes(searchVault.toLowerCase()) ||
                          (docItem.docRef && docItem.docRef.toLowerCase().includes(searchVault.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Filter milestones
  const filteredMilestones = projectData.milestones.filter(m => {
    if (milestoneFilter === 'completed') return m.status === 'completed';
    if (milestoneFilter === 'in_progress') return m.status === 'in_progress';
    if (milestoneFilter === 'upcoming') return m.status === 'upcoming';
    return true;
  });

  return (
    <section id="client-portal" className="py-16 bg-[#020617] text-slate-100 min-h-screen relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Notification Toast */}
        {notificationMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/80 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs animate-in slide-in-from-bottom-5">
            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Header with Security Badge & MFA Role Selector (High Density) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-5 pb-5 sm:pb-6 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-3 sm:gap-4">
            <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
              <VitechLogo variant="badge" size="lg" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                <span>Portail Client Sécurisé • V&amp;I TECH AFRICA LTD</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-50 tracking-tight leading-tight">
                Tableau de Bord &amp; Suivi de Projet
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Projet : <span className="text-cyan-400 font-semibold">{projectData.name}</span> | Lead Architect : <span className="text-slate-200">{projectData.leadArchitect}</span>
              </p>
            </div>
          </div>

          {/* Right Header: Notification Bell & Quick Role Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real-time Notifications Bell Popover */}
            <NotificationCenter 
              onNavigateTab={(tabKey) => {
                if (tabKey === 'audit-trail') setActiveTab('audit');
                else if (tabKey === 'milestones') setActiveTab('overview');
                else if (tabKey === 'vault') setActiveTab('vault');
              }}
              onOpenDocPreview={(docId) => {
                const foundDoc = documents.find(d => d.id === docId || d.docRef === docId);
                if (foundDoc) {
                  setSelectedDocForPdfModal(foundDoc);
                } else if (documents.length > 0) {
                  setSelectedDocForPdfModal(documents[0]);
                }
              }}
            />

            {/* Quick Role Switcher (High Density) */}
            <div className="bg-slate-900 p-2 sm:p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center gap-1.5 sm:gap-2">
              <div className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1">
                <KeyRound className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                <span>Profil Actif :</span>
              </div>
              <div className="flex flex-wrap items-center gap-1">
                {[
                  { id: 'super_admin', label: 'Super Admin' },
                  { id: 'tech_lead', label: 'Tech Lead' },
                  { id: 'product_manager', label: 'Product Owner' },
                  { id: 'viewer', label: 'Auditeur / Finance' },
                ].map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setActiveRole(role.id as any);
                      showNotification(`Session commutée sur le profil : ${role.label}`);
                    }}
                    className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all cursor-pointer ${
                      activeRole === role.id
                        ? 'bg-cyan-600 text-white font-bold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs (Fluid Responsive Scrolling / Wrapping) */}
        <div className="flex items-center gap-1.5 my-4 sm:my-6 border-b border-slate-800 pb-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Vue d’Ensemble & Jalons', icon: Activity, badge: `${projectData.milestones.length}` },
            { id: 'vault', label: 'Espace Documents & Vault Crypté', icon: FolderLock, badge: `${documents.length}` },
            { id: 'faq', label: 'FAQ Technique & IA RAG', icon: Sparkles, badge: 'Gemini 3.7' },
            { id: 'audit', label: 'Journal d’Audit & Traçabilité', icon: History, badge: `${auditLogs.length}` },
            { id: 'analytics', label: 'Télémétrie & Santé Système (99.99%)', icon: TrendingUp },
            { id: 'permissions', label: 'Gestion des Permissions Équipe', icon: Users, badge: `${teamMembers.length}` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center space-x-1.5 sm:space-x-2 transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950 font-bold'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-cyan-800 text-white font-bold' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & MILESTONES */}
        {activeTab === 'overview' && (
          <div className="space-y-5 sm:space-y-6">
            {/* Top Project Stat Cards - High Density */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-medium">Progression Globale</span>
                <div className="flex items-center justify-between">
                  <span className="text-lg sm:text-xl font-extrabold text-cyan-400 font-mono">
                    {projectData.overallProgress}%
                  </span>
                  <span className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    +3j
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${projectData.overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-medium">Sprint Actuel</span>
                <p className="text-xs sm:text-sm font-bold text-white truncate">Sprint 4 / 6</p>
                <span className="text-[10px] sm:text-xs text-blue-400 font-mono truncate block">Passerelles Mobile Money</span>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-medium">Budget Consommé</span>
                <p className="text-sm sm:text-base font-bold text-white font-mono">{projectData.budgetSpent}</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400">sur {projectData.budgetTotal} alloués</span>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 col-span-2 sm:col-span-1">
                <span className="text-[10px] sm:text-[11px] text-slate-400 uppercase font-medium">Environnement Staging</span>
                <a
                  href={projectData.stagingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-[11px] sm:text-xs font-semibold hover:bg-cyan-900/60 transition-colors"
                >
                  <span>Tester le Staging</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* EXECUTIVE PROJECT DOCUMENTS & CERTIFICATIONS BANNER (Requested Feature) */}
            <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/40 shadow-xl space-y-3.5 sm:space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      <FileCheck className="w-4 h-4" />
                    </span>
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-white">
                      Documents &amp; Livrables Officiels du Projet (Stockage Firestore Sécurisé)
                    </h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    Accédez, visualisez et téléchargez instantanément les contrats légaux de cession, diagrammes d'architecture C4, procès-verbaux de recette et rapports de pentest certifiés.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] sm:text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg border border-emerald-500/20 flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>6 Documents Certifiés</span>
                  </span>
                </div>
              </div>

              {/* Horizontal Quick-Access Document Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 pt-1">
                {documents.slice(0, 6).map((docItem) => (
                  <div 
                    key={docItem.id}
                    className="p-3 sm:p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-2.5 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-bold">
                          {docItem.docRef}
                        </span>
                        <span className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                          {docItem.fileSize}
                        </span>
                      </div>
                      <h4 className="text-[11px] sm:text-xs font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {docItem.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-slate-400 line-clamp-2">
                        {docItem.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-emerald-400 font-mono">
                        <Lock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span>AES-256</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedDocForPdfModal(docItem)}
                          className="px-2 sm:px-2.5 py-1 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 text-[10px] sm:text-xs font-semibold flex items-center gap-1 border border-cyan-500/30 transition-colors cursor-pointer"
                          title="Lecture Rapide PDF Multi-Pages"
                        >
                          <FileText className="w-3 h-3 text-cyan-400" />
                          <span>Lire PDF</span>
                        </button>
                        <button
                          onClick={() => setSelectedDocForModal(docItem)}
                          className="px-2 sm:px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] sm:text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
                          title="Aperçu Sécurisé & Signature"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Détails</span>
                        </button>
                        <button
                          onClick={() => handleDownloadDoc(docItem)}
                          className="px-2 sm:px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                          title="Télécharger PDF"
                        >
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* VISUAL PROJECT PROGRESS CHARTS (Requested Feature) */}
            <ProjectProgressCharts
              milestones={projectData.milestones}
              overallProgress={projectData.overallProgress}
              budgetSpent={projectData.budgetSpent}
              budgetTotal={projectData.budgetTotal}
            />

            {/* Milestones Timeline & Deliverables Inspection */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span>Feuille de Route des Sprints &amp; Jalons</span>
                    <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                      Agile 2 Semaines
                    </span>
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    Chaque sprint est validé par recette contradictoire avec remise des codes sources et documents certifiés.
                  </p>
                </div>

                {/* Milestone Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0">
                  {[
                    { id: 'all', label: 'Tous (6)' },
                    { id: 'completed', label: 'Validés (3)' },
                    { id: 'in_progress', label: 'En cours (1)' },
                    { id: 'upcoming', label: 'Planifiés (2)' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setMilestoneFilter(f.id as any)}
                      className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all cursor-pointer ${
                        milestoneFilter === f.id
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Milestones Cards List */}
              <div className="space-y-3 sm:space-y-4">
                {filteredMilestones.map((milestone, idx) => {
                  // Find documents attached to this milestone
                  const attachedDocs = documents.filter(d => d.milestoneId === milestone.id);

                  return (
                    <div
                      key={milestone.id}
                      className={`p-3.5 sm:p-5 rounded-xl border transition-all space-y-3 sm:space-y-4 ${
                        milestone.status === 'completed'
                          ? 'bg-[#020617]/90 border-cyan-500/25'
                          : milestone.status === 'in_progress'
                          ? 'bg-[#020617] border-cyan-500/70 shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500/40'
                          : 'bg-[#020617]/50 border-slate-800/80 opacity-80'
                      }`}
                    >
                      {/* Milestone Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                        <div className="flex items-start space-x-2.5 sm:space-x-3">
                          <div className={`p-1.5 sm:p-2 rounded-xl mt-0.5 shrink-0 ${
                            milestone.status === 'completed'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : milestone.status === 'in_progress'
                              ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 animate-pulse'
                              : 'bg-slate-800 text-slate-500 border border-slate-700'
                          }`}>
                            {milestone.status === 'completed' ? (
                              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 uppercase font-semibold">
                                Étape {idx + 1}
                              </span>
                              <span className={`text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase ${
                                milestone.status === 'completed'
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : milestone.status === 'in_progress'
                                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}>
                                {milestone.status === 'completed' ? 'Validé & Livré' : milestone.status === 'in_progress' ? 'En Cours' : 'Planifié'}
                              </span>

                              {milestone.status === 'completed' && (
                                <span className="text-[9px] sm:text-[10px] text-emerald-400 font-mono hidden sm:inline">
                                  ✓ Tests : 98.4%
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs sm:text-sm md:text-base font-bold text-white mt-0.5">
                              {milestone.title}
                            </h4>
                            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                              {milestone.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-900">
                          <span className="text-[9px] sm:text-[10px] text-slate-400 block">Échéance :</span>
                          <span className="text-[11px] sm:text-xs font-mono text-white font-bold">{milestone.dueDate}</span>
                          <span className="text-[10px] sm:text-[11px] font-mono text-cyan-400 font-semibold">{milestone.progress}% terminé</span>
                        </div>
                      </div>

                      {/* Milestone Progress Bar */}
                      <div className="w-full bg-slate-900 h-1.5 sm:h-2 rounded-full overflow-hidden border border-slate-800">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            milestone.status === 'completed'
                              ? 'bg-emerald-500'
                              : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                          }`}
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>

                      {/* Attached Documents & Deliverables Section (Requested Feature) */}
                      <div className="pt-2 border-t border-slate-800/80 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
                            <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                            <span>Documents &amp; Livrables PDF Associés :</span>
                          </span>

                          {milestone.status === 'in_progress' && (
                            <button
                              onClick={() => handleValidateMilestone(milestone.id, milestone.title)}
                              className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] sm:text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Valider la Recette</span>
                            </button>
                          )}
                        </div>

                        {/* Deliverables & Attached Official Documents Badges */}
                        <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
                          {/* Attached Firestore Documents */}
                          {attachedDocs.map((docItem) => (
                            <div 
                              key={docItem.id}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800/90 border border-cyan-500/40 text-xs transition-colors"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-semibold text-slate-100 text-[11px] truncate max-w-[200px]">
                                    {docItem.title}
                                  </span>
                                  {docItem.clientSignature ? (
                                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold flex items-center gap-0.5">
                                      <CheckCircle2 className="w-2 h-2" />
                                      Signé
                                    </span>
                                  ) : (
                                    <span className="text-[8px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold flex items-center gap-0.5">
                                      <PenTool className="w-2 h-2" />
                                      À Signer
                                    </span>
                                  )}
                                </div>
                                <span className="text-[9px] text-slate-400 font-mono">
                                  {docItem.docRef} • {docItem.fileSize}
                                </span>
                              </div>

                              <div className="flex items-center gap-1 ml-1.5">
                                <button
                                  onClick={() => setSelectedDocForModal(docItem)}
                                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                  title="Aperçu & Signature Sécurisée"
                                >
                                  <Eye className="w-3 h-3" />
                                </button>
                                {!docItem.clientSignature && (
                                  <button
                                    onClick={() => setSelectedDocForModal(docItem)}
                                    className="px-2 py-0.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                                    title="Signer numériquement"
                                  >
                                    <PenTool className="w-2.5 h-2.5" />
                                    <span>Signer</span>
                                  </button>
                                )}
                                <button
                                  onClick={() => handleDownloadDoc(docItem)}
                                  className="p-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                                  title="Télécharger PDF Certifié"
                                >
                                  <Download className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}

                          {/* Raw Deliverables Tags */}
                          {milestone.deliverables.map((deliv, dIdx) => (
                            <button
                              key={dIdx}
                              onClick={() => {
                                // Match or generate preview
                                const matchedDoc = attachedDocs[0] || documents[0];
                                setSelectedDocForModal(matchedDoc);
                              }}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900/80 text-slate-300 hover:text-cyan-300 hover:bg-slate-800 border border-slate-800 font-mono flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <Download className="w-3 h-3 text-slate-400" />
                              <span>{deliv}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* DYNAMIC FAQ & AI ASSISTANT PROMPT CALLOUT */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      Des questions sur l'architecture, le SLA ou la synchronisation SQLite ?
                    </h4>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
                      IA Gemini 3.7
                    </span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    Interrogez instantanément notre moteur FAQ intelligent groundé sur la documentation technique officielle VITECH AFRICA.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('faq')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition shadow-md shadow-cyan-950 cursor-pointer flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <span>Ouvrir la FAQ Technique &amp; IA</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: SECURE CLOUD STORAGE VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-4 sm:space-y-5">
            {/* Vault Header & Upload Zone */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 sm:space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderLock className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                    <h3 className="text-base sm:text-xl font-bold text-white">Espace de Stockage Crypté (Cloud Vault)</h3>
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-1">
                    Tous les contrats, diagrammes d'architecture, codes et factures sont chiffrés en AES-256 avec synchronisation temps réel Firestore.
                  </p>
                </div>

                {/* Upload Button */}
                <div className="relative shrink-0">
                  <input
                    type="file"
                    id="vault-file-upload-input"
                    onChange={handleSimulateUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="vault-file-upload-input"
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-[11px] sm:text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-950 cursor-pointer active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Déposer un document sécurisé</span>
                  </label>
                </div>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="p-3 rounded-xl bg-[#020617] border border-cyan-500/50 space-y-1.5">
                  <div className="flex justify-between text-xs text-cyan-300">
                    <span className="font-semibold flex items-center gap-2 text-[11px] sm:text-xs">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Chiffrement AES-256 et téléversement en cours...
                    </span>
                    <span className="font-mono font-bold text-xs">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-400 h-full rounded-full transition-all duration-200" 
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 pt-3 border-t border-slate-800">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher un document ou une réf..."
                    value={searchVault}
                    onChange={(e) => setSearchVault(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#020617] border border-slate-800 text-[11px] sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: 'Tous' },
                    { id: 'contracts', label: 'Contrats' },
                    { id: 'specs', label: 'Cahiers des charges' },
                    { id: 'deliverables', label: 'PV de Recette' },
                    { id: 'security', label: 'Audits OWASP' },
                    { id: 'invoices', label: 'Factures' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFileFilter(cat.id)}
                      className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium transition-all cursor-pointer ${
                        fileFilter === cat.id
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'bg-[#020617] text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Files Table */}
              <div className="divide-y divide-slate-800 rounded-xl overflow-hidden border border-slate-800 bg-[#020617]/80">
                {filteredDocuments.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center text-slate-500 text-xs space-y-2">
                    <FolderLock className="w-7 h-7 mx-auto text-slate-600" />
                    <p>Aucun document trouvé dans cette catégorie.</p>
                  </div>
                ) : (
                  filteredDocuments.map((docItem) => (
                    <div
                      key={docItem.id}
                      className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex items-start space-x-2.5 sm:space-x-3.5">
                        <div className="p-2 sm:p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white">{docItem.title}</h4>
                            {docItem.encrypted && (
                              <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                                AES-256
                              </span>
                            )}
                            <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                              eIDAS
                            </span>
                            {docItem.clientSignature ? (
                              <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                Signé
                              </span>
                            ) : (
                              <span className="text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold flex items-center gap-1">
                                <PenTool className="w-2.5 h-2.5" />
                                À Signer
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] sm:text-[11px] text-slate-400">
                            {docItem.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-400 font-mono pt-0.5">
                            <span className="text-cyan-300">{docItem.docRef}</span>
                            <span>•</span>
                            <span>{docItem.fileSize}</span>
                            <span>•</span>
                            <span>{docItem.version}</span>
                            <span>•</span>
                            <span>Émis le : {docItem.uploadedAt}</span>
                            {docItem.clientSignature && (
                              <>
                                <span>•</span>
                                <span className="text-emerald-400">Paraphe : {docItem.clientSignature.signerName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 sm:space-x-2 self-end sm:self-center shrink-0">
                        <button
                          onClick={() => setSelectedDocForPdfModal(docItem)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border border-cyan-500/30 cursor-pointer transition-colors"
                          title="Lecture Rapide PDF Multi-Pages"
                        >
                          <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-cyan-400" />
                          <span>Lire PDF</span>
                        </button>
                        <button
                          onClick={() => setSelectedDocForModal(docItem)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] sm:text-xs font-semibold flex items-center gap-1 sm:gap-1.5 border border-slate-800 cursor-pointer transition-colors"
                          title="Aperçu & Détails de Sécurité"
                        >
                          <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>Détails</span>
                        </button>
                        {!docItem.clientSignature && (
                          <button
                            onClick={() => setSelectedDocForModal(docItem)}
                            className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm cursor-pointer transition-colors"
                          >
                            <PenTool className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                            <span>Signer</span>
                          </button>
                        )}
                        <button
                          onClick={() => handleDownloadDoc(docItem)}
                          className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 shadow-sm cursor-pointer transition-colors"
                        >
                          <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                          <span>PDF</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB: DYNAMIC FAQ & AI ASSISTANT (RAG GROUNDED) */}
        {activeTab === 'faq' && (
          <ClientFaqAiAssistant
            project={projectData}
            onOpenAuditLog={() => setActiveTab('audit')}
            onOpenVault={() => setActiveTab('vault')}
          />
        )}

        {/* TAB 3: TELEMETRY & SYSTEM ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-5 sm:space-y-6">
            {/* Live Uptime SLA Status */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1">
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-400">
                  <span>Disponibilité SLA</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-cyan-400 font-mono">{projectData.telemetry.uptime}</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">Zéro coupure (30j)</span>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-400">
                  <span>Latence (P95)</span>
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-blue-400 font-mono">{projectData.telemetry.avgLatency}</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">Réseau Edge Cloudflare</span>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-400">
                  <span>Requêtes API</span>
                  <Server className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono">{projectData.telemetry.requestsTotal}</p>
                <span className="text-[9px] sm:text-[10px] text-slate-400 block truncate">Erreurs : {projectData.telemetry.errorRate}</span>
              </div>

              <div className="p-3 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <div className="flex justify-between items-center text-[10px] sm:text-xs text-slate-400">
                  <span>Noeuds Pods</span>
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-xl sm:text-2xl font-black text-white font-mono">{projectData.telemetry.activeServerNodes} Pods</p>
                <span className="text-[9px] sm:text-[10px] text-cyan-400 font-mono block truncate">Backup : {projectData.telemetry.lastBackup}</span>
              </div>
            </div>

            {/* Performance Graphs / Recharts Telemetry & Activity */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    <span>Activité Projet &amp; Trafic API en Temps Réel (Recharts)</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Volume de requêtes API et vélocité des commits Git par semaine.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Flux Live CI/CD</span>
                </div>
              </div>

              {/* AreaChart: API Calls & Commits */}
              <div className="h-64 sm:h-72 w-full bg-[#020617] p-3 rounded-2xl border border-slate-800/80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyActivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApi" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                      itemStyle={{ color: '#38bdf8' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                    <Area type="monotone" dataKey="apiCalls" name="Requêtes API" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorApi)" />
                    <Area type="monotone" dataKey="commits" name="Commits Git" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCommits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* 2-Column Grid: Sprints Velocity & Tickets Distribution */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                
                {/* Sprints Burn-down BarChart */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#020617] border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>Vélocité Story Points par Sprint</span>
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                      Agile Scrum
                    </span>
                  </div>
                  
                  <div className="h-52 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={milestonesVelocityData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                        <YAxis stroke="#64748b" fontSize={10} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                        <Bar dataKey="prevu" name="Points Prévus" fill="#334155" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="livre" name="Points Livrés" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Support Tickets PieChart & SLA Resolution */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#020617] border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <LifeBuoy className="w-4 h-4 text-amber-400" />
                      <span>Répartition des Tickets de Support</span>
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                      SLA Réponse &lt; 15 min
                    </span>
                  </div>

                  <div className="h-44 w-full flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={38}
                          outerRadius={65}
                          paddingAngle={5}
                          dataKey="count"
                        >
                          {ticketStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', color: '#fff' }}
                        />
                        <Legend wrapperStyle={{ fontSize: '10px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-800/80">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-sm font-black text-emerald-400 font-mono">
                        {supportTickets.filter(t => t.status === 'resolved').length}
                      </span>
                      <span className="text-[9px] text-slate-400 block">Résolus</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-sm font-black text-cyan-400 font-mono">
                        {supportTickets.filter(t => t.status === 'in_progress').length}
                      </span>
                      <span className="text-[9px] text-slate-400 block">En Cours</span>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-sm font-black text-amber-400 font-mono">
                        {supportTickets.filter(t => t.status === 'open').length}
                      </span>
                      <span className="text-[9px] text-slate-400 block">Ouverts</span>
                    </div>
                  </div>

                </div>

              </div>

              {/* Support Tickets Table & Action Button */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#020617] border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400" />
                      <span>Tickets de Support &amp; Demandes d'Évolution ({supportTickets.length})</span>
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Astreinte technique 24/7 et suivi des correctifs par nos leads architectes.
                    </p>
                  </div>

                  <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Créer un Ticket de Support</span>
                  </button>
                </div>

                <div className="divide-y divide-slate-800 rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-900/50 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-cyan-400">{ticket.id}</span>
                          <span className="text-xs font-semibold text-white">{ticket.title}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                            {ticket.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-slate-400">
                          <span>Ouvert : {ticket.openedAt}</span>
                          <span>Assigné : <strong className="text-slate-300">{ticket.assignee}</strong></span>
                          {ticket.resolvedAt && (
                            <span className="text-emerald-400 font-semibold">Résolu : {ticket.resolvedAt}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          ticket.priority === 'critical'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : ticket.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {ticket.priority}
                        </span>

                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          ticket.status === 'resolved'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : ticket.status === 'in_progress'
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {ticket.status === 'resolved' ? 'Résolu' : ticket.status === 'in_progress' ? 'En Traitement' : 'Ouvert'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 4: TEAM & FINE-GRAINED PERMISSIONS */}
        {activeTab === 'permissions' && (
          <div className="space-y-5">
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Gestion Fine des Accès &amp; Permissions Équipe</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Contrôlez précisément qui dans votre organisation peut accéder aux codes sources, aux environnements de staging, ou télécharger les factures.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddMemberModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-sm cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Inviter un collaborateur</span>
                </button>
              </div>

              {/* Members Table */}
              <div className="divide-y divide-slate-800 rounded-xl overflow-hidden border border-slate-800 bg-[#020617]/80">
                {teamMembers.map((member) => (
                  <div key={member.id} className="p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={member.avatar} 
                          alt={member.name}
                          className="w-9 h-9 rounded-full object-cover border border-cyan-500/40"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-xs font-bold text-white">{member.name}</h4>
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono uppercase">
                              {member.role.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{member.email} • Actif : {member.lastActive}</span>
                        </div>
                      </div>
                    </div>

                    {/* Permissions Switch Row */}
                    <div className="pt-1.5 flex flex-wrap items-center gap-2 text-xs">
                      {[
                        { key: 'canViewCode', label: 'Voir Code Git' },
                        { key: 'canDeployStaging', label: 'Déployer Staging' },
                        { key: 'canDownloadInvoices', label: 'Télécharger Factures' },
                        { key: 'canManageAPIKeys', label: 'Gérer Clés API' },
                      ].map((perm) => {
                        const isGranted = (member.permissions as any)[perm.key];
                        return (
                          <button
                            key={perm.key}
                            onClick={() => handleTogglePermission(member.id, perm.key as any)}
                            className={`px-2.5 py-1 rounded-md border flex items-center space-x-1.5 transition-all text-xs cursor-pointer ${
                              isGranted
                                ? 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300 font-semibold'
                                : 'bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isGranted ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                            <span>{perm.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: IMMUTABLE AUDIT TRAIL & TRACEABILITY LOG */}
        {activeTab === 'audit' && (
          <AuditLogView 
            projectId="proj-afripay-001"
            onExportLog={(format) => {
              showNotification(`Export du journal d'audit en format ${format.toUpperCase()} généré avec succès.`);
            }}
          />
        )}

      </div>

      {/* SECURE DOCUMENT MODAL (Aperçu, SHA-256, Signature & Téléchargement) */}
      <DocumentSecureModal
        document={selectedDocForModal}
        onClose={() => setSelectedDocForModal(null)}
        onDownloadSuccess={(docName) => showNotification(`Document "${docName}" téléchargé avec succès.`)}
        onDocumentSigned={(signedDoc) => {
          setDocuments(prev => prev.map(d => d.id === signedDoc.id ? signedDoc : d));
          setSelectedDocForModal(signedDoc);
          showNotification(`Document "${signedDoc.title}" signé numériquement avec succès (Certificat : ${signedDoc.clientSignature?.certificateId}).`);
        }}
      />

      {/* PDF QUICK-READER MODAL (Visualisation Haute Définition Multi-Pages & Signature) */}
      {selectedDocForPdfModal && (
        <PdfViewerModal
          document={selectedDocForPdfModal}
          onClose={() => setSelectedDocForPdfModal(null)}
          onDownloadSuccess={(docName) => showNotification(`Document "${docName}" téléchargé depuis le lecteur PDF.`)}
          onSignClick={() => {
            const docToSign = selectedDocForPdfModal;
            setSelectedDocForPdfModal(null);
            setSelectedDocForModal(docToSign);
          }}
        />
      )}

      {/* Modal Add Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Ajouter un Collaborateur</h3>
              <button 
                onClick={() => setShowAddMemberModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Nom complet :</label>
                <input
                  type="text"
                  required
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="Ex: Fatou Diallo"
                  className="w-full p-2 rounded-lg bg-[#020617] border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Adresse Email professionnelle :</label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  placeholder="f.diallo@entreprise.com"
                  className="w-full p-2 rounded-lg bg-[#020617] border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Rôle attribué :</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full p-2 rounded-lg bg-[#020617] border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="tech_lead">Tech Lead (Code &amp; Déploiement)</option>
                  <option value="product_manager">Product Manager (Suivi Sprints)</option>
                  <option value="viewer">Auditeur / Finance (Lecture &amp; Factures)</option>
                  <option value="super_admin">Super Administrateur (Tout pouvoir)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-500 text-xs cursor-pointer"
                >
                  Envoyer l'invitation MFA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Support Ticket */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Nouveau Ticket de Support Technique</h4>
              </div>
              <button
                onClick={() => setShowNewTicketModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Titre de la demande / incident :</label>
                <input
                  type="text"
                  required
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  placeholder="Ex: Demande d'accès sandbox MTN ou latence anormale"
                  className="w-full p-2.5 rounded-lg bg-[#020617] border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Catégorie :</label>
                <select
                  value={newTicketCategory}
                  onChange={(e) => setNewTicketCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#020617] border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="API">API &amp; Webhooks</option>
                  <option value="Mobile">Application Mobile (Flutter/iOS/Android)</option>
                  <option value="Sécurité">Sécurité &amp; Certificats</option>
                  <option value="Infrastructure">Infrastructure Cloud &amp; Base de données</option>
                  <option value="Reporting">Exportation &amp; Rapports Financiers</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Niveau d'Urgence / Criticité SLA :</label>
                <select
                  value={newTicketPriority}
                  onChange={(e) => setNewTicketPriority(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg bg-[#020617] border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="low">Faible — Demande d'évolution standard</option>
                  <option value="medium">Moyen — Incident non bloquant</option>
                  <option value="high">Élevé — Dégradation de service partielle (SLA 30 min)</option>
                  <option value="critical">Critique — Blocage complet de production (SLA 15 min)</option>
                </select>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-3.5 py-1.5 rounded-lg text-slate-400 hover:text-white text-xs cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-cyan-600 text-white font-bold hover:bg-cyan-500 text-xs cursor-pointer"
                >
                  Ouvrir le Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
