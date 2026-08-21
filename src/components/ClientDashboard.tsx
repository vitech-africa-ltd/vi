import React, { useState } from 'react';
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
  AlertCircle,
  CheckCircle2,
  Cpu
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
import { VaultFile, TeamPermissionUser } from '../types';
import { VitechLogo } from './VitechLogo';

export const ClientDashboard: React.FC = () => {
  // Authentication & MFA State
  const [activeRole, setActiveRole] = useState<'super_admin' | 'tech_lead' | 'product_manager' | 'viewer'>('super_admin');

  // Dashboard Sub-navigation Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'analytics' | 'permissions'>('overview');

  // Project state
  const [projectData] = useState(INITIAL_CLIENT_PROJECT);
  const [vaultFiles, setVaultFiles] = useState<VaultFile[]>(INITIAL_CLIENT_PROJECT.vaultFiles);
  const [teamMembers, setTeamMembers] = useState<TeamPermissionUser[]>(INITIAL_CLIENT_PROJECT.teamPermissions);

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

  const showNotification = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Upload simulator
  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsUploading(true);
    setUploadProgress(15);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setUploadProgress(0);
            const newVaultFile: VaultFile = {
              id: `vf-${Date.now()}`,
              name: file.name,
              size: `${(file.size / (1024 * 1024)).toFixed(1)} Mo`,
              type: file.name.endsWith('.pdf') ? 'pdf' : file.name.endsWith('.zip') ? 'archive' : 'doc',
              category: 'deliverables',
              uploadedAt: "À l'instant",
              version: 'v1.0 (Synchronisé)',
              encrypted: true,
            };
            setVaultFiles((prevFiles) => [newVaultFile, ...prevFiles]);
            showNotification(`Fichier "${file.name}" chiffré en AES-256 et synchronisé avec succès.`);
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

  // Filter vault files
  const filteredVaultFiles = vaultFiles.filter((f) => {
    const matchesCat = fileFilter === 'all' || f.category === fileFilter;
    const matchesSearch = f.name.toLowerCase().includes(searchVault.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <section id="client-portal" className="py-20 bg-[#020617] text-slate-100 min-h-screen relative border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Notification Toast */}
        {notificationMsg && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-cyan-500/80 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl flex items-center space-x-2.5 text-xs">
            <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{notificationMsg}</span>
          </div>
        )}

        {/* Header with Security Badge & MFA Role Selector (High Density) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-slate-800">
          <div className="flex items-start sm:items-center gap-4">
            <div className="p-1 rounded-2xl bg-slate-900 border border-slate-800 shrink-0">
              <VitechLogo variant="badge" size="lg" />
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-2 px-3 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-[11px] font-semibold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                <span>Portail Client V&amp;I TECH AFRICA LTD • MFA Active</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-50 tracking-tight">
                Tableau de Bord &amp; Suivi de Projet
              </h2>
              <p className="text-xs text-slate-400">
                Projet : <span className="text-cyan-400 font-semibold">{projectData.name}</span> | Lead Architect : <span className="text-slate-200">{projectData.leadArchitect}</span>
              </p>
            </div>
          </div>

          {/* Quick Role Switcher (High Density) */}
          <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center gap-2">
            <div className="text-xs text-slate-400 flex items-center gap-1">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>Rôle :</span>
            </div>
            <div className="flex items-center gap-1">
              {[
                { id: 'super_admin', label: 'Super Admin' },
                { id: 'tech_lead', label: 'Tech Lead' },
                { id: 'product_manager', label: 'Product Owner' },
                { id: 'viewer', label: 'Auditeur' },
              ].map((role) => (
                <button
                  key={role.id}
                  onClick={() => {
                    setActiveRole(role.id as any);
                    showNotification(`Session commutée sur le profil : ${role.label}`);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
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

        {/* Dashboard Navigation Tabs (High Density) */}
        <div className="flex flex-wrap gap-1.5 my-6 border-b border-slate-800 pb-3">
          {[
            { id: 'overview', label: 'Vue d’Ensemble & Jalons', icon: Activity },
            { id: 'vault', label: 'Espace Stockage Crypté (Cloud Vault)', icon: FolderLock, badge: `${vaultFiles.length}` },
            { id: 'analytics', label: 'Télémétrie & Santé Système (99.99%)', icon: TrendingUp },
            { id: 'permissions', label: 'Gestion des Permissions Équipe', icon: Users, badge: `${teamMembers.length}` },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-950'
                    : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive ? 'bg-cyan-800 text-white' : 'bg-slate-800 text-slate-300'
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
          <div className="space-y-6">
            {/* Top Project Stat Cards - High Density */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Progression Globale</span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-extrabold text-cyan-400 font-mono">
                    {projectData.overallProgress}%
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                    En avance de 3j
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${projectData.overallProgress}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Sprint Actuel</span>
                <p className="text-sm font-bold text-white truncate">Sprint 4 / 6</p>
                <span className="text-xs text-blue-400 font-mono block">Passerelles Mobile Money</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Budget Consommé</span>
                <p className="text-base font-bold text-white font-mono">{projectData.budgetSpent}</p>
                <span className="text-[10px] text-slate-400">sur {projectData.budgetTotal} alloués</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <span className="text-[11px] text-slate-400 uppercase font-medium">Environnement Staging</span>
                <a
                  href={projectData.stagingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-900/60 transition-colors"
                >
                  <span>Tester le Staging Live</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Milestones Timeline */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Feuille de Route des Sprints & Livrables</h3>
                  <p className="text-xs text-slate-400">Chaque sprint est validé par recette contradictoire avant mise en production.</p>
                </div>
                <button
                  onClick={() => showNotification("Rapport de sprint synchronisé avec votre espace client.")}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3 text-cyan-400" />
                  <span>Rafraîchir</span>
                </button>
              </div>

              <div className="space-y-3">
                {projectData.milestones.map((milestone, idx) => (
                  <div
                    key={milestone.id}
                    className={`p-4 rounded-xl border transition-all ${
                      milestone.status === 'completed'
                        ? 'bg-[#020617]/80 border-cyan-500/20'
                        : milestone.status === 'in_progress'
                        ? 'bg-[#020617] border-cyan-500/70 shadow-md shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                        : 'bg-[#020617]/40 border-slate-800/80 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start space-x-3">
                        <div className={`p-1.5 rounded-lg mt-0.5 ${
                          milestone.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : milestone.status === 'in_progress'
                            ? 'bg-cyan-500/15 text-cyan-400 animate-pulse'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {milestone.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Étape {idx + 1}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-semibold uppercase ${
                              milestone.status === 'completed'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : milestone.status === 'in_progress'
                                ? 'bg-cyan-500/15 text-cyan-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {milestone.status === 'completed' ? 'Validé & Livré' : milestone.status === 'in_progress' ? 'En Cours Actif' : 'Planifié'}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-0.5">{milestone.title}</h4>
                          <p className="text-xs text-slate-300 mt-0.5">{milestone.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[11px] text-slate-400 block">Échéance :</span>
                        <span className="text-xs font-mono text-white font-bold">{milestone.dueDate}</span>
                      </div>
                    </div>

                    {/* Deliverables tags */}
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5 items-center">
                        <span className="text-[10px] text-slate-400 mr-1">Livrables associés :</span>
                        {milestone.deliverables.map((deliv, dIdx) => (
                          <button
                            key={dIdx}
                            onClick={() => showNotification(`Téléchargement de "${deliv}" initié.`)}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 hover:text-cyan-400 hover:bg-slate-800 border border-slate-800 font-mono flex items-center gap-1 cursor-pointer"
                          >
                            <Download className="w-2.5 h-2.5 text-slate-400" />
                            <span>{deliv}</span>
                          </button>
                        ))}
                      </div>
                      <span className="text-xs font-mono font-bold text-cyan-400">{milestone.progress}% terminé</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SECURE CLOUD STORAGE VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-5">
            {/* Vault Header & Upload Zone */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderLock className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Espace de Stockage Crypté (Cloud Vault)</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Tous les contrats, diagrammes d'architecture, codes et factures sont chiffrés en AES-256 avec synchronisation temps réel.
                  </p>
                </div>

                {/* Upload Button */}
                <div className="relative">
                  <input
                    type="file"
                    id="vault-file-upload-input"
                    onChange={handleSimulateUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="vault-file-upload-input"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center space-x-1.5 shadow-md shadow-cyan-950 cursor-pointer active:scale-95"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Déposer un document sécurisé</span>
                  </label>
                </div>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="p-3.5 rounded-xl bg-[#020617] border border-cyan-500/50 space-y-1.5">
                  <div className="flex justify-between text-xs text-cyan-300">
                    <span className="font-semibold flex items-center gap-2 text-xs">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Chiffrement AES-256 et téléversement en cours...
                    </span>
                    <span className="font-mono font-bold">{uploadProgress}%</span>
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
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher un fichier..."
                    value={searchVault}
                    onChange={(e) => setSearchVault(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#020617] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                <div className="flex flex-wrap gap-1">
                  {[
                    { id: 'all', label: 'Tous' },
                    { id: 'contracts', label: 'Contrats & NDA' },
                    { id: 'specs', label: 'Cahiers des charges' },
                    { id: 'deliverables', label: 'Livrables & Code' },
                    { id: 'security', label: 'Audits OWASP' },
                    { id: 'invoices', label: 'Factures' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setFileFilter(cat.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
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
                {filteredVaultFiles.length === 0 ? (
                  <div className="p-6 text-center text-slate-500 text-xs">
                    Aucun document trouvé dans cette catégorie.
                  </div>
                ) : (
                  filteredVaultFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-900/60 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-white">{file.name}</h4>
                            {file.encrypted && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30 font-mono">
                                AES-256
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                            <span>{file.size}</span>
                            <span>•</span>
                            <span>{file.version}</span>
                            <span>•</span>
                            <span>Ajouté : {file.uploadedAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5 self-end sm:self-center">
                        <button
                          onClick={() => showNotification(`Aperçu sécurisé du document "${file.name}" généré.`)}
                          className="p-1.5 rounded-md bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 border border-slate-800 cursor-pointer"
                          title="Aperçu"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => showNotification(`Téléchargement de "${file.name}" terminé.`)}
                          className="px-2.5 py-1 rounded-md bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 text-xs font-semibold flex items-center gap-1 border border-cyan-500/30 cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>Télécharger</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: TELEMETRY & SYSTEM ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Live Uptime SLA Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-slate-900 border border-cyan-500/30 space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Disponibilité SLA</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <p className="text-2xl font-black text-cyan-400 font-mono">{projectData.telemetry.uptime}</p>
                <span className="text-[10px] text-slate-400 block">Zéro interruption enregistrée (30 derniers jours)</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Latence Moyenne (P95)</span>
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <p className="text-2xl font-black text-blue-400 font-mono">{projectData.telemetry.avgLatency}</p>
                <span className="text-[10px] text-slate-400 block">Réseau Edge Cloudflare & AWS</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Requêtes API Traitées</span>
                  <Server className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-2xl font-black text-white font-mono">{projectData.telemetry.requestsTotal}</p>
                <span className="text-[10px] text-slate-400 block">Taux d'erreur : {projectData.telemetry.errorRate}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Noeuds Conteneurs Actifs</span>
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <p className="text-2xl font-black text-white font-mono">{projectData.telemetry.activeServerNodes} Pods K8s</p>
                <span className="text-[10px] text-cyan-400 font-mono block">Dernier Backup : {projectData.telemetry.lastBackup}</span>
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
                  <h3 className="text-lg font-bold text-white">Gestion Fine des Accès & Permissions Équipe</h3>
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

      </div>

      {/* Modal Add Member */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
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
                  <option value="tech_lead">Tech Lead (Code & Déploiement)</option>
                  <option value="product_manager">Product Manager (Suivi Sprints)</option>
                  <option value="viewer">Auditeur / Finance (Lecture & Factures)</option>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
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

