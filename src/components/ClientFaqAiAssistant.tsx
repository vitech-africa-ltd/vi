import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Server,
  Lock,
  Scale,
  CreditCard,
  Clock,
  CheckCircle2,
  ChevronDown,
  ArrowRight,
  Send,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  MessageSquare,
  FileCode,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  BookOpen,
  Zap,
  Share2,
  Layers,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ClientProject } from '../types';

interface ClientFaqAiAssistantProps {
  project?: ClientProject;
  onOpenAuditLog?: () => void;
  onOpenVault?: () => void;
}

interface AiFaqResponse {
  reply: string;
  keyPoints?: string[];
  category?: string;
  confidenceScore?: number;
  sources?: string[];
  suggestedFollowUps?: string[];
  timestamp?: string;
  isFallback?: boolean;
}

interface StaticTechnicalFaq {
  id: string;
  category: 'architecture' | 'security' | 'sla' | 'ip-contracts' | 'payments';
  categoryLabel: string;
  icon: React.ElementType;
  question: string;
  shortSummary: string;
  deepExplanation: string[];
  techHighlights: { label: string; value: string }[];
  tags: string[];
  officialDocRef: string;
}

const STATIC_TECHNICAL_FAQS: StaticTechnicalFaq[] = [
  {
    id: 'faq-offline-sqlite',
    category: 'architecture',
    categoryLabel: 'Architecture & Offline-First',
    icon: Cpu,
    question: 'Comment fonctionne le moteur de synchronisation SQLite / Offline-First en Afrique ?',
    shortSummary: 'Les données sont persistées localement en SQLite/WatermelonDB avec file d’attente d’actions (Action Queue) et synchronisation delta bidirectionnelle dès le retour du réseau.',
    deepExplanation: [
      'Toutes nos applications mobiles (Flutter / React Native) et logicielles C# intègrent une base SQLite locale chiffrée (SQLCipher). L’utilisateur peut exécuter des transactions, signer des bons ou consulter des données même sans connexion internet (0ms de latence).',
      'Lors de la reconnexion, un moteur de synchronisation d’arrière-plan transmet uniquement les enregistrements modifiés (Delta Sync) en appliquant un algorithme de résolution de conflit type CRDT / Vector Clocks avec réessais par Exponential Backoff.',
      'Ce procédé réduit la consommation de données mobiles de 80% par rapport à une architecture web conventionnelle.'
    ],
    techHighlights: [
      { label: 'Base locale', value: 'SQLite / SQLCipher (AES-256)' },
      { label: 'Résolution de conflit', value: 'CRDT / Vector Clocks' },
      { label: 'Protocole Sync', value: 'Delta REST / WebSockets' },
      { label: 'Économie Data', value: '-80% de bande passante' }
    ],
    tags: ['Offline-First', 'SQLite', 'Flutter', 'WatermelonDB', 'CRDT', 'Sync Delta'],
    officialDocRef: 'Spécification Technique : Architecture Offline-First & Synchronisation'
  },
  {
    id: 'faq-security-aes256',
    category: 'security',
    categoryLabel: 'Sécurité & Cryptographie',
    icon: Lock,
    question: 'Quelles sont les garanties sur le chiffrement AES-256, le Coffre-Fort et la conformité légale ?',
    shortSummary: 'Chiffrement symétrique AES-256-GCM au repos, TLS 1.3 en transit, et journal d’audit immuable avec empreinte cryptographique SHA-256 conforme eIDAS et OHADA.',
    deepExplanation: [
      'Le coffre-fort documentaire (Vault) utilise le chiffrement AES-256-GCM avec rotation automatique des clés d’accès hébergées sous Google Secret Manager et HashiCorp Vault.',
      'Chaque opération sensible (téléchargement de livrable, validation de jalon, modification d’autorisation) génère un hachage cryptographique SHA-256 chaîné en bloc immuable, garantissant l’inviolabilité du journal d’audit.',
      'Les signatures électroniques et accusés de réception générés dans le portail respectent les normes eIDAS (Union Européenne) et l’Acte Uniforme OHADA sur le Droit Commercial Général.'
    ],
    techHighlights: [
      { label: 'Chiffrement au repos', value: 'AES-256-GCM authentifié' },
      { label: 'Chiffrement en transit', value: 'TLS 1.3 avec Perfect Forward Secrecy' },
      { label: 'Audit Trail', value: 'Empreintes SHA-256 chaînées' },
      { label: 'Conformité légale', value: 'Normes eIDAS & Droit OHADA' }
    ],
    tags: ['AES-256', 'SHA-256', 'eIDAS', 'OHADA', 'OWASP Top 10', 'Vault Crypté'],
    officialDocRef: 'Spécification Sécurité : Cryptographie & Conformité eIDAS/OHADA'
  },
  {
    id: 'faq-sla-uptime-gtr',
    category: 'sla',
    categoryLabel: 'SLA 99.99% & Astreinte',
    icon: Clock,
    question: 'Quels sont les temps d’intervention (GTI / GTR) en cas d’incident et la politique de sauvegarde ?',
    shortSummary: 'SLA 99.99% contractuel, GTI < 15 min et GTR < 1h pour les incidents critiques P1, avec sauvegardes automatisées PITR (Point-in-Time Recovery) sur 30 jours.',
    deepExplanation: [
      'Notre centre de télémétrie surveille les serveurs 24/7/365 via Prometheus et Grafana avec des sondes de santé (Health Checks) déclenchées toutes les 30 secondes.',
      'Matrice d’intervention : Incident P1 (blocage critique) -> Prise en charge < 15 minutes et rétablissement < 1 heure. Incident P2 (majeur) -> GTR < 4 heures. Incident P3 -> < 24 heures.',
      'Les bases de données bénéficient d’une réplication multi-région active-passive et d’une sauvegarde continue avec RPO < 5 minutes et RTO < 15 minutes.'
    ],
    techHighlights: [
      { label: 'Disponibilité SLA', value: '99.99% d’Uptime contractuel' },
      { label: 'GTI Incident P1', value: '< 15 minutes' },
      { label: 'GTR Incident P1', value: '< 1 heure' },
      { label: 'RPO / RTO Sauvegardes', value: 'RPO < 5 min • RTO < 15 min' }
    ],
    tags: ['SLA 99.99%', 'GTR < 1h', 'GTI < 15min', 'Prometheus', 'Grafana', 'PITR Backup'],
    officialDocRef: 'Spécification SLA : Disponibilité 99.99% & Monitoring 24/7'
  },
  {
    id: 'faq-ip-git-warranty',
    category: 'ip-contracts',
    categoryLabel: 'Propriété Intellectuelle & Garantie',
    icon: Scale,
    question: 'Comment s’effectue la cession 100% de propriété intellectuelle (IP) et que couvre la garantie 6 mois ?',
    shortSummary: 'Cession intégrale et irréversible de l’ensemble des droits patrimoniaux et du code source Git dès règlement final, avec 6 mois de garantie corrective offerte.',
    deepExplanation: [
      'Dès la validation de la recette et le règlement du solde final, VITECH AFRICA transfère la propriété exclusive de l’intégralité des dépôts Git (GitHub/GitLab), schémas SQL, maquettes Figma et assets graphiques.',
      'La garantie corrective de 6 mois démarre à la signature du Procès-Verbal de Recette : toute anomalie de fonctionnement, régression ou bug est corrigé gratuitement en priorité absolue par l’équipe technique.',
      'Avant tout échange sur les spécifications, un Accord de Non-Divulgation (NDA) bilatéral strict est formalisé.'
    ],
    techHighlights: [
      { label: 'Propriété du code', value: '100% Client (Cession totale irréversible)' },
      { label: 'Dépôts Git', value: 'Transfert complet de l’organisation GitHub/GitLab' },
      { label: 'Garantie corrective', value: '6 Mois sans surcoût post-recette' },
      { label: 'Confidentialité', value: 'NDA Bilatéral préalable' }
    ],
    tags: ['Cession 100% IP', 'Garantie 6 Mois', 'Dépôt Git Privé', 'NDA', 'Agile Scrum'],
    officialDocRef: 'Cycle de Vie Projet, Transfert de Propriété (IP) & Garantie 6 Mois'
  },
  {
    id: 'faq-mobile-money-webhooks',
    category: 'payments',
    categoryLabel: 'Mobile Money & Webhooks API',
    icon: CreditCard,
    question: 'Comment sont sécurisés les paiements et notifications asynchrones (Wave, MTN MoMo, Orange) ?',
    shortSummary: 'Signature cryptographique HMAC-SHA256 sur les webhooks, fenêtres de tolérance temporelle anti-rejeu et traitement idempotent des transactions.',
    deepExplanation: [
      'Chaque notification de paiement (Wave, MTN MoMo, Orange Money, Airtel Money) est signée à l’aide d’une clé secrète partagée. Notre backend vérifie l’empreinte HMAC-SHA256 avant tout déblocage d’accès.',
      'Pour parer aux attaques par rejeu (Replay Attacks), les requêtes comportent un timestamp vérifié (< 300 secondes) et un identifiant unique (UUID v4) contrôlé en base pour garantir une stricte idempotence.',
      'En cas d’indisponibilité passagère, les webhooks sont réémis automatiquement selon une séquence exponentielle avec tableau de bord de réconciliation financière.'
    ],
    techHighlights: [
      { label: 'Passerelles', value: 'Wave • MTN MoMo • Orange Money • Airtel' },
      { label: 'Sécurité Webhooks', value: 'Signature HMAC-SHA256' },
      { label: 'Traitement', value: '100% Idempotent & Anti-Rejeu' },
      { label: 'Réconciliation', value: 'Grand livre automatisé quotidien' }
    ],
    tags: ['Mobile Money', 'Wave', 'MTN MoMo', 'Orange Money', 'HMAC-SHA256', 'Webhooks'],
    officialDocRef: 'Spécification Technique : Intégrations Mobile Money'
  }
];

export const ClientFaqAiAssistant: React.FC<ClientFaqAiAssistantProps> = ({
  project,
  onOpenAuditLog,
  onOpenVault
}) => {
  // State for AI Prompt Box
  const [userQuery, setUserQuery] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [currentAiResponse, setCurrentAiResponse] = useState<AiFaqResponse | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [copiedResponse, setCopiedResponse] = useState(false);
  const [feedbackVote, setFeedbackVote] = useState<'up' | 'down' | null>(null);

  // State for Static FAQ Browser
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [expandedFaqIds, setExpandedFaqIds] = useState<Record<string, boolean>>({
    'faq-offline-sqlite': true
  });

  // Query History for the active session
  const [sessionHistory, setSessionHistory] = useState<
    Array<{ question: string; response: AiFaqResponse; timestamp: string }>
  >([]);

  // Suggested Prompts
  const suggestedChips = [
    'Comment fonctionne la synchronisation SQLite en mode offline-first ?',
    'Quelles sont les garanties sur le chiffrement AES-256 et la conformité eIDAS ?',
    'Quel est le temps d’intervention (GTI / GTR) sous SLA 99.99% ?',
    'Comment s’effectue la cession 100% de la propriété intellectuelle du code ?',
    'Comment sécuriser les webhooks de paiement MTN MoMo et Wave ?',
    'Que couvre la garantie corrective de 6 mois après la recette ?'
  ];

  // Handle AI Search Submission
  const handleAskAi = async (queryToSubmit?: string) => {
    const questionText = (queryToSubmit || userQuery).trim();
    if (!questionText) return;

    setIsAiLoading(true);
    setAiError(null);
    setFeedbackVote(null);
    setCopiedResponse(false);

    try {
      const res = await fetch('/api/client-faq/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question: questionText,
          projectId: project?.id,
          projectCategory: project?.category,
          language: 'fr'
        })
      });

      if (!res.ok) {
        throw new Error(`Erreur serveur (${res.status})`);
      }

      const data: AiFaqResponse = await res.json();
      setCurrentAiResponse(data);

      // Add to session history
      setSessionHistory(prev => [
        {
          question: questionText,
          response: data,
          timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        },
        ...prev.slice(0, 9)
      ]);

      if (queryToSubmit) {
        setUserQuery(queryToSubmit);
      }
    } catch (err: any) {
      console.error('Failed to ask AI FAQ:', err);
      setAiError(
        'Impossible de contacter le moteur IA en ce moment. Vous pouvez consulter les fiches techniques ci-dessous ou joindre notre Lead Architecte sur WhatsApp au +250 795 507 001.'
      );
    } finally {
      setIsAiLoading(false);
    }
  };

  // Toggle static FAQ item
  const toggleFaq = (id: string) => {
    setExpandedFaqIds(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filtered Static FAQs
  const filteredFaqs = useMemo(() => {
    return STATIC_TECHNICAL_FAQS.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;

      if (!faqSearchQuery.trim()) return true;

      const q = faqSearchQuery.toLowerCase();
      return (
        item.question.toLowerCase().includes(q) ||
        item.shortSummary.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q)) ||
        item.categoryLabel.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, faqSearchQuery]);

  // Copy AI response to clipboard
  const handleCopyReply = () => {
    if (!currentAiResponse?.reply) return;
    navigator.clipboard.writeText(currentAiResponse.reply);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  return (
    <div className="space-y-8" id="client-faq-ai-assistant">
      
      {/* ========================================================
          HERO BANNER: DYNAMIC AI TECHNICAL ASSISTANT
      ======================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/80 border border-blue-500/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          
          {/* Header & Badges */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span>Assistant IA Technique • Groundé RAG</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                FAQ Technique &amp; Base de Connaissances VITECH
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
                Posez vos questions sur l’architecture logicielle, le chiffrement AES-256, le SLA 99.99%,
                les intégrations Mobile Money ou la cession 100% de propriété intellectuelle.
              </p>
            </div>

            {/* Live System Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>RAG VITECH 2026</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-[11px] font-bold text-blue-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Gemini 3.7 Flash</span>
              </div>
            </div>
          </div>

          {/* ========================================================
              INTERACTIVE AI SEARCH INPUT BOX
          ======================================================== */}
          <div className="space-y-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={userQuery}
                onChange={e => setUserQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !isAiLoading) {
                    handleAskAi();
                  }
                }}
                placeholder="Posez une question technique (ex: Comment fonctionne la synchronisation SQLite hors-ligne ?)"
                className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 focus:border-cyan-400 rounded-2xl py-3.5 pl-5 pr-32 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 shadow-inner backdrop-blur-md transition-all"
                disabled={isAiLoading}
              />
              <div className="absolute right-2 flex items-center gap-1.5">
                {userQuery && !isAiLoading && (
                  <button
                    onClick={() => setUserQuery('')}
                    className="p-1.5 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                    title="Effacer"
                  >
                    ×
                  </button>
                )}
                <button
                  onClick={() => handleAskAi()}
                  disabled={isAiLoading || !userQuery.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  {isAiLoading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Analyse...</span>
                    </>
                  ) : (
                    <>
                      <span>Interroger l’IA</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <BookOpen className="w-3 h-3 text-cyan-400" />
                <span>Suggestions de questions fréquentes :</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {suggestedChips.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAskAi(chip)}
                    disabled={isAiLoading}
                    className="text-left px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-200 text-xs font-medium transition cursor-pointer active:scale-95 truncate max-w-full sm:max-w-md"
                  >
                    💬 {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================
              AI RESPONSE CARD (GROUNDED IN VITECH DOCUMENTATION)
          ======================================================== */}
          <AnimatePresence>
            {isAiLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-6 rounded-2xl bg-slate-900/90 border border-cyan-500/30 space-y-3"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 animate-spin">
                    <Loader2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Recherche RAG &amp; Synthèse Technique en cours...</h4>
                    <p className="text-xs text-slate-400">
                      Extraction des spécifications officielles V&amp;I TECH AFRICA LTD (Architecture, Sécurité, SLA)...
                    </p>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 h-full w-2/3 animate-pulse" />
                </div>
              </motion.div>
            )}

            {aiError && !isAiLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-3"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">Information de connexion</p>
                  <p>{aiError}</p>
                </div>
              </motion.div>
            )}

            {currentAiResponse && !isAiLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 sm:p-6 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-xl space-y-5"
              >
                {/* Meta header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white">
                        {currentAiResponse.category || 'Réponse Technique Certifiée VITECH'}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        Indice de confiance RAG : <strong className="text-emerald-400">{currentAiResponse.confidenceScore || 98}%</strong>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyReply}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer"
                      title="Copier la réponse"
                    >
                      {copiedResponse ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copié !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-slate-400" />
                          <span>Copier</span>
                        </>
                      )}
                    </button>

                    <a
                      href="https://wa.me/250795507001"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-xs font-bold text-emerald-300 transition cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Lead Dev</span>
                    </a>
                  </div>
                </div>

                {/* Key Takeaways Cards */}
                {currentAiResponse.keyPoints && currentAiResponse.keyPoints.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {currentAiResponse.keyPoints.map((point, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-200 text-xs font-medium flex items-start gap-2"
                      >
                        <Zap className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Body Explanation */}
                <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-3 whitespace-pre-line">
                  {currentAiResponse.reply}
                </div>

                {/* Sources Used */}
                {currentAiResponse.sources && currentAiResponse.sources.length > 0 && (
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <FileText className="w-3 h-3 text-cyan-400" />
                      Sources documentaires vérifiées :
                    </span>
                    {currentAiResponse.sources.map((src, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[10px] font-medium text-slate-300"
                      >
                        📄 {src}
                      </span>
                    ))}
                  </div>
                )}

                {/* Feedback rating & follow-up questions */}
                <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">Cette réponse vous a-t-elle été utile ?</span>
                    <button
                      onClick={() => setFeedbackVote('up')}
                      className={`p-1.5 rounded-lg border transition ${
                        feedbackVote === 'up'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setFeedbackVote('down')}
                      className={`p-1.5 rounded-lg border transition ${
                        feedbackVote === 'down'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    {feedbackVote && (
                      <span className="text-[11px] text-emerald-400 font-bold ml-1">
                        Merci pour votre retour !
                      </span>
                    )}
                  </div>

                  {currentAiResponse.suggestedFollowUps && currentAiResponse.suggestedFollowUps.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Questions connexes :</span>
                      {currentAiResponse.suggestedFollowUps.slice(0, 2).map((q, qIdx) => (
                        <button
                          key={qIdx}
                          onClick={() => handleAskAi(q)}
                          className="px-2 py-1 rounded-md bg-blue-950/60 hover:bg-blue-900/60 border border-blue-500/30 text-[10px] font-bold text-cyan-300 transition"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ========================================================
          SECTION 2: BROWSE TECHNICAL SPECIFICATION FAQS
      ======================================================== */}
      <div className="space-y-6">
        
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>Fiches Techniques &amp; Architectures Prédocumentées</span>
            </h3>
            <p className="text-xs text-slate-400">
              Explorez les réponses détaillées et certifiées par nos Lead Développeurs et Architectes Cloud.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={faqSearchQuery}
              onChange={e => setFaqSearchQuery(e.target.value)}
              placeholder="Filtrer les fiches (ex: SQLite, SLA, AES)..."
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-400 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-400"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'all', label: 'Toutes les Fiches' },
            { id: 'architecture', label: 'Architecture & Offline-First' },
            { id: 'security', label: 'Sécurité & Chiffrement' },
            { id: 'sla', label: 'SLA & Astreinte 24/7' },
            { id: 'ip-contracts', label: 'Propriété & Garantie 6 Mois' },
            { id: 'payments', label: 'Mobile Money & Webhooks' }
          ].map(cat => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map(faq => {
              const isOpen = !!expandedFaqIds[faq.id];
              const Icon = faq.icon;

              return (
                <motion.div
                  key={faq.id}
                  layout
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-slate-900/95 border-cyan-500/40 shadow-xl'
                      : 'bg-slate-900/60 border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {/* Header Button */}
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none select-none group"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div
                        className={`p-2.5 rounded-xl border shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                            : 'bg-slate-800 border-slate-700 text-slate-400 group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                            {faq.categoryLabel}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                            Ref: {faq.officialDocRef}
                          </span>
                        </div>
                        <h4 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {faq.question}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-1">{faq.shortSummary}</p>
                      </div>
                    </div>

                    <div
                      className={`p-1.5 rounded-xl shrink-0 transition-transform ${
                        isOpen ? 'bg-cyan-500/20 text-cyan-300 rotate-180' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* Expandable Body */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-slate-800/80"
                      >
                        <div className="p-5 sm:p-6 space-y-4 text-xs sm:text-sm text-slate-300">
                          
                          {/* Summary pill */}
                          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs font-semibold flex items-start gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{faq.shortSummary}</span>
                          </div>

                          {/* Paragraphs */}
                          <div className="space-y-2 text-slate-300 leading-relaxed">
                            {faq.deepExplanation.map((p, pIdx) => (
                              <p key={pIdx}>{p}</p>
                            ))}
                          </div>

                          {/* Technical Highlights */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
                            {faq.techHighlights.map((h, hIdx) => (
                              <div
                                key={hIdx}
                                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1"
                              >
                                <div className="text-[10px] font-bold text-slate-400 uppercase">{h.label}</div>
                                <div className="text-xs font-black text-emerald-400">{h.value}</div>
                              </div>
                            ))}
                          </div>

                          {/* Footer Tags & AI Deep-Dive Trigger Button */}
                          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {faq.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="px-2 py-0.5 rounded-md bg-slate-800 text-[10px] font-medium text-slate-400"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            <button
                              onClick={() => {
                                setUserQuery(faq.question);
                                handleAskAi(faq.question);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition cursor-pointer"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Approfondir avec l’IA</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs space-y-2">
              <Search className="w-6 h-6 text-slate-500 mx-auto" />
              <p>Aucune fiche technique ne correspond à votre recherche.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setFaqSearchQuery('');
                }}
                className="text-cyan-400 hover:underline font-bold"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          SECTION 3: RECENT SESSION QUERIES (IF ANY)
      ======================================================== */}
      {sessionHistory.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>Historique de vos questions durant cette session</span>
          </h4>
          <div className="space-y-2">
            {sessionHistory.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentAiResponse(item.response);
                  setUserQuery(item.question);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between gap-3 text-xs cursor-pointer transition"
              >
                <span className="text-slate-300 font-medium truncate">💬 {item.question}</span>
                <span className="text-[10px] text-slate-400 shrink-0 font-bold">{item.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
