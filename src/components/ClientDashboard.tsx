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
  X
} from 'lucide-react';
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

            {/* Performance Graphs Mock / Diagnostics */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
              <h3 className="text-lg font-bold text-white">Diagnostics de Charge & Santé de l'Infrastructure</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sprint Burn-down velocity */}
                <div className="p-4 rounded-xl bg-[#020617] border border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Vélocité des Sprints (Story Points Livrés)
                  </span>
                  <div className="space-y-2.5">
                    {[
                      { sprint: 'Sprint 1 (Architecture & DB)', points: '42 / 42 pts', pct: 100, color: 'bg-cyan-400' },
                      { sprint: 'Sprint 2 (Core Engine & Kafka)', points: '58 / 58 pts', pct: 100, color: 'bg-cyan-400' },
                      { sprint: 'Sprint 3 (App Mobile Flutter)', points: '48 / 48 pts', pct: 100, color: 'bg-cyan-400' },
                      { sprint: 'Sprint 4 (Intégration Télécoms)', points: '34 / 50 pts', pct: 68, color: 'bg-blue-400' },
                    ].map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{s.sprint}</span>
                          <span className="font-mono text-cyan-400 font-bold">{s.points}</span>
                        </div>
                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className={`${s.color} h-full rounded-full`} style={{ width: `${s.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Security & Vulnerability Scanner */}
                <div className="p-4 rounded-xl bg-[#020617] border border-slate-800 space-y-3">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">
                    Rapport Continu DevSecOps (SonarQube & Trivy)
                  </span>
                  <div className="grid grid-cols-2 gap-2.5 text-center">
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-xl font-black text-emerald-400 font-mono">0</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Vulnérabilités Critiques</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-xl font-black text-cyan-400 font-mono">98.4%</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Couverture de Tests</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-xl font-black text-blue-400 font-mono">A+</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Note SSL/TLS</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                      <span className="text-xl font-black text-emerald-400 font-mono">0.02s</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Temps Moyen Requête</span>
                    </div>
                  </div>
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
    </section>
  );
};

