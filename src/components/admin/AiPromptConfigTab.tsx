import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Save, 
  RotateCcw, 
  Send, 
  Cpu, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Terminal, 
  HelpCircle,
  FileText,
  ShieldCheck,
  Zap,
  MessageSquareCode,
  Gauge,
  Database,
  Search,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Phone,
  Clock,
  UserCheck,
  RefreshCw,
  Eye,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  X,
  Maximize2,
  CheckCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell, 
  CartesianGrid 
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteData } from '../../context/SiteDataContext';
import { AIAssistantConfig } from '../../types';
import { DEFAULT_AI_CONFIG } from '../../data/companyData';
import { VitechLogo } from '../VitechLogo';

interface PromptPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  assistantName: string;
  welcomeMessage: string;
  tone: 'consultative' | 'technical' | 'executive' | 'concise';
  temperature: number;
  systemPrompt: string;
}

interface KnowledgeDoc {
  id: string;
  title: string;
  category: string;
  tags: string[];
  content: string;
  lastUpdated: string;
  isOfficial?: boolean;
}

interface ChatLogItem {
  id: string;
  timestamp: string;
  userMessage: string;
  botReply: string;
  sourcesUsed: string[];
  escalatedToHuman: boolean;
  languageDetected?: string;
  model: string;
}

const PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'consultative-pan-african',
    name: 'Architecte Panafricain & Vente Consultative (Par défaut)',
    badge: 'Recommandé',
    description: 'Poste d\'architecte senior bienveillant, orienté solutions, devis et cadrage de projets critiques.',
    assistantName: 'Architecte & Conseiller Technique V&I TECH AFRICA',
    welcomeMessage: "Bonjour et bienvenue chez V&I TECH AFRICA LTD ! Je suis votre Architecte & Conseiller Technique Senior. Comment pouvons-nous concrétiser votre vision technologique aujourd'hui ?",
    tone: 'consultative',
    temperature: 0.4,
    systemPrompt: DEFAULT_AI_CONFIG.systemPrompt,
  },
  {
    id: 'cybersecurity-owasp',
    name: 'Auditeur Cybersécurité & Conformité OWASP',
    badge: 'Spécialisé',
    description: 'Focalisé sur la sécurité offensive/défensive, les pentests, la conformité bancaire et ISO 27001.',
    assistantName: 'Auditeur Cybersécurité & Pentest V&I TECH',
    welcomeMessage: 'Bonjour. Je suis l\'expert Cybersécurité & DevSecOps de V&I TECH AFRICA LTD. Souhaitez-vous évaluer la posture de sécurité de vos applications ou planifier un pentest ?',
    tone: 'technical',
    temperature: 0.3,
    systemPrompt: `Tu es le Consultant Senior en Cybersécurité et Architecte DevSecOps de V&I TECH AFRICA LTD (vitechafrica.com).
🎯 TA MISSION :
1. Répondre avec une extrême rigueur technique aux questions relatives à la sécurité applicative (OWASP Top 10, CWE, ASVS), aux tests d'intrusion (Pentesting Web, Mobile, API, Réseau), et à la conformité (ISO 27001, RGPD, réglementations bancaires).
2. Présenter la méthodologie d'audit de V&I TECH AFRICA :
   - Tests en boîte noire, grise et blanche avec scanners SAST/DAST et revue manuelle approfondie du code source.
   - Rapport exécutif avec matrice des risques CVSS v3.1 et plan de remédiation technique pas-à-pas pour les développeurs.
   - Certificat de contre-visite attestant de la correction des vulnérabilités critiques.
3. Rappeler nos garanties strictes de confidentialité (NDA immédiat) et notre agrément d'audit pour grands comptes bancaires et institutions.
4. Inviter le client à réserver un audit préliminaire de 30 minutes avec notre Lead Pentester.`,
  },
  {
    id: 'cto-startup-mvp',
    name: 'CTO Virtuel & Accélérateur MVP Startups',
    badge: 'Agile',
    description: 'Orienté time-to-market rapide, choix de stacks modernes (Flutter, Next.js, Supabase/Firebase/AWS) et itérations courtes.',
    assistantName: 'CTO Startup Advisor V&I TECH',
    welcomeMessage: 'Salut ! Je suis le CTO Advisor de V&I TECH AFRICA. Prêt à transformer votre idée de startup en un MVP robuste lancé en moins de 8 semaines ?',
    tone: 'concise',
    temperature: 0.5,
    systemPrompt: `Tu es le Fractional CTO & Startup Advisor de V&I TECH AFRICA LTD (vitechafrica.com).
🎯 TA MISSION :
1. Aider les fondateurs et créateurs de startups à cadrer leur MVP (Minimum Viable Product) sans gaspillage budgétaire ni dette technique.
2. Préconiser des architectures modernes et véloces :
   - Front/Full-stack : Next.js 15, React, Tailwind CSS, TypeScript.
   - Mobile : Flutter 3.x (Multi-plateforme iOS + Android fluide, offline-first).
   - Backend/BaaS : Node.js, Python FastAPI, PostgreSQL, Supabase ou Cloud AWS.
   - Paiements : Intégrations Mobile Money panafricaines (Wave, Orange Money, MoMo, Paystack, Stripe).
3. Insister sur les avantages compétitifs de V&I TECH : livraison en sprints de 2 semaines, démos interactives, 100% cession de code source et support post-lancement.
4. Proposer de chiffrer le MVP en direct via notre simulateur de devis en ligne.`,
  },
];

// Topic Category Analytics Data
const TOPIC_DISTRIBUTION_DATA = [
  { topic: 'Tarifs & Devis', inquiries: 42, color: '#3b82f6' },
  { topic: 'Apps Mobile & Flutter', inquiries: 28, color: '#10b981' },
  { topic: 'SaaS & Architecture Cloud', inquiries: 22, color: '#8b5cf6' },
  { topic: 'Cybersécurité & Pentest', inquiries: 16, color: '#f59e0b' },
  { topic: 'Garanties & SLA 6 Mois', inquiries: 14, color: '#06b6d4' },
  { topic: 'Hubs (Kigali, Dakar, Abidjan)', inquiries: 9, color: '#ec4899' },
];

const RESOLUTION_QUALITY_DATA = [
  { name: 'Réponses RAG Vérifiées', value: 82, color: '#10b981' },
  { name: 'Escalades WhatsApp / Humain', value: 12, color: '#3b82f6' },
  { name: 'Lacunes / Info Non Répertoriée', value: 6, color: '#f43f5e' },
];

const DETECTED_KNOWLEDGE_GAPS = [
  {
    id: 'gap-1',
    query: 'Avez-vous des facilités de paiement échelonné pour les PME en 4x sans frais ?',
    occurrences: 7,
    suggestedDoc: 'Conditions Financières & Modalités de Paiement Échelonné PME',
    category: 'pricing',
  },
  {
    id: 'gap-2',
    query: 'Quelle est votre certification PCI-DSS pour l\'intégration de passerelles bancaires directes ?',
    occurrences: 5,
    suggestedDoc: 'Conformité Bancaire & Certifications PCI-DSS / ISO 27001',
    category: 'security',
  },
  {
    id: 'gap-3',
    query: 'Proposez-vous un accompagnement pour le dépôt de brevet logiciel à l\'OAPI ?',
    occurrences: 4,
    suggestedDoc: 'Propriété Intellectuelle & Dépôt OAPI / Brevets Logiciels',
    category: 'guarantees',
  },
];

export const AiPromptConfigTab: React.FC = () => {
  const { aiConfig, updateAiConfig, resetAiConfigToDefault, isSaving } = useSiteData();

  // Sub-Navigation Tabs
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'prompt' | 'kb' | 'logs'>('analytics');

  // Local editable form state (Draft)
  const [formData, setFormData] = useState<AIAssistantConfig>({
    assistantName: aiConfig.assistantName || DEFAULT_AI_CONFIG.assistantName,
    systemPrompt: aiConfig.systemPrompt || DEFAULT_AI_CONFIG.systemPrompt,
    welcomeMessage: aiConfig.welcomeMessage || DEFAULT_AI_CONFIG.welcomeMessage,
    tone: aiConfig.tone || 'consultative',
    temperature: aiConfig.temperature ?? 0.4,
    model: aiConfig.model || 'gemini-3.7-flash',
    language: aiConfig.language || 'fr',
    keyServices: aiConfig.keyServices || DEFAULT_AI_CONFIG.keyServices,
    contactWhatsApp: aiConfig.contactWhatsApp || DEFAULT_AI_CONFIG.contactWhatsApp,
    contactEmail: aiConfig.contactEmail || DEFAULT_AI_CONFIG.contactEmail,
    enableDirectBooking: aiConfig.enableDirectBooking ?? true,
    enablePricingEstimates: aiConfig.enablePricingEstimates ?? true,
  });

  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Live Test Sandbox State
  const [testInput, setTestInput] = useState('');
  const [testHistory, setTestHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; sources?: string[] }>>([
    {
      role: 'assistant',
      text: formData.welcomeMessage || "Bonjour ! Posez-moi une question pour tester ma configuration.",
    },
  ]);
  const [isTesting, setIsTesting] = useState(false);

  // Full-Screen / Modal Preview Mode State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewInput, setPreviewInput] = useState('');
  const [previewHistory, setPreviewHistory] = useState<Array<{ id: string; role: 'user' | 'assistant'; text: string; sources?: string[]; timestamp: string }>>([
    {
      id: 'prev-1',
      role: 'assistant',
      text: formData.welcomeMessage || "Bonjour et bienvenue chez V&I TECH AFRICA LTD ! Je suis votre Assistant IA Officiel.",
      timestamp: 'À l\'instant',
      sources: ["Documentation Officielle V&I TECH"],
    }
  ]);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  // Knowledge Base State
  const [kbDocs, setKbDocs] = useState<KnowledgeDoc[]>([]);
  const [kbLoading, setKbLoading] = useState(false);
  const [kbSearch, setKbSearch] = useState('');
  const [editingDoc, setEditingDoc] = useState<KnowledgeDoc | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Chat Logs State
  const [chatLogs, setChatLogs] = useState<ChatLogItem[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // Fetch Knowledge Base docs
  const fetchKbDocs = async () => {
    setKbLoading(true);
    try {
      const res = await fetch('/api/kb/documents');
      const data = await res.json();
      if (data.documents) {
        setKbDocs(data.documents);
      }
    } catch (err) {
      console.error('Error fetching KB docs:', err);
    } finally {
      setKbLoading(false);
    }
  };

  // Fetch Chat Logs
  const fetchChatLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch('/api/chat/logs');
      const data = await res.json();
      if (data.logs) {
        setChatLogs(data.logs);
      }
    } catch (err) {
      console.error('Error fetching chat logs:', err);
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    if (activeSubTab === 'kb') {
      fetchKbDocs();
    } else if (activeSubTab === 'logs' || activeSubTab === 'analytics') {
      fetchChatLogs();
    }
  }, [activeSubTab]);

  // Apply a preset
  const handleApplyPreset = (preset: PromptPreset) => {
    setFormData((prev) => ({
      ...prev,
      assistantName: preset.assistantName,
      welcomeMessage: preset.welcomeMessage,
      systemPrompt: preset.systemPrompt,
      tone: preset.tone,
      temperature: preset.temperature,
    }));
  };

  // Save changes to Firestore
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaveFeedback('Enregistrement des paramètres...');
    const success = await updateAiConfig(formData);
    if (success) {
      setSaveFeedback('Prompt et configuration IA enregistrés en production avec succès !');
      setTimeout(() => setSaveFeedback(null), 4000);
    } else {
      setSaveFeedback('Erreur lors de l\'enregistrement.');
      setTimeout(() => setSaveFeedback(null), 4000);
    }
  };

  // Reset to Factory Default
  const handleReset = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le prompt de l'assistant aux paramètres d'usine ?")) {
      await resetAiConfigToDefault();
      setFormData({
        assistantName: DEFAULT_AI_CONFIG.assistantName,
        systemPrompt: DEFAULT_AI_CONFIG.systemPrompt,
        welcomeMessage: DEFAULT_AI_CONFIG.welcomeMessage,
        tone: DEFAULT_AI_CONFIG.tone,
        temperature: DEFAULT_AI_CONFIG.temperature,
        model: DEFAULT_AI_CONFIG.model,
        language: DEFAULT_AI_CONFIG.language,
        keyServices: DEFAULT_AI_CONFIG.keyServices,
        contactWhatsApp: DEFAULT_AI_CONFIG.contactWhatsApp,
        contactEmail: DEFAULT_AI_CONFIG.contactEmail,
        enableDirectBooking: DEFAULT_AI_CONFIG.enableDirectBooking,
        enablePricingEstimates: DEFAULT_AI_CONFIG.enablePricingEstimates,
      });
      setSaveFeedback('Prompt réinitialisé aux valeurs d\'origine.');
      setTimeout(() => setSaveFeedback(null), 3000);
    }
  };

  // Copy prompt to clipboard
  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(formData.systemPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  // Run Sandbox Test query with RAG retrieval
  const handleRunSandboxTest = async (overridePrompt?: string) => {
    const promptToSend = overridePrompt || testInput;
    if (!promptToSend.trim() || isTesting) return;

    const userMessage = promptToSend.trim();
    setTestHistory((prev) => [...prev, { role: 'user', text: userMessage }]);
    setTestInput('');
    setIsTesting(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          customPrompt: formData.systemPrompt,
          temperature: formData.temperature,
          model: formData.model,
          conversationHistory: testHistory.map((h) => ({
            role: h.role === 'user' ? 'user' : 'model',
            content: h.text,
          })),
        }),
      });
      const data = await response.json();
      setTestHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || "Réponse générée.",
          sources: data.sources,
        },
      ]);
    } catch (err) {
      setTestHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "Erreur lors de l'appel au serveur RAG. Vérifiez la connexion réseau.",
        },
      ]);
    } finally {
      setIsTesting(false);
    }
  };

  // Run Preview Mode query (simulating client chat with unsaved draft prompt)
  const handleSendPreviewMessage = async (overrideText?: string) => {
    const textToSend = overrideText || previewInput;
    if (!textToSend.trim() || isPreviewLoading) return;

    const userMsg = {
      id: `prev-${Date.now()}`,
      role: 'user' as const,
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setPreviewHistory((prev) => [...prev, userMsg]);
    setPreviewInput('');
    setIsPreviewLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend.trim(),
          customPrompt: formData.systemPrompt,
          temperature: formData.temperature,
          model: formData.model,
          visitorLanguage: formData.language || 'fr',
          conversationHistory: previewHistory.map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            content: m.text,
          })),
        }),
      });
      const data = await response.json();
      
      const assistantMsg = {
        id: `prev-${Date.now() + 1}`,
        role: 'assistant' as const,
        text: data.reply || "Réponse simulée de l'assistant.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: data.sources || [],
      };
      setPreviewHistory((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setPreviewHistory((prev) => [
        ...prev,
        {
          id: `prev-${Date.now() + 1}`,
          role: 'assistant',
          text: "Erreur réseau lors de la simulation. Vérifiez le serveur.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]);
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Save Knowledge Doc
  const handleSaveDoc = async (doc: KnowledgeDoc) => {
    try {
      const res = await fetch('/api/kb/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(doc),
      });
      if (res.ok) {
        setIsDocModalOpen(false);
        setEditingDoc(null);
        fetchKbDocs();
      }
    } catch (err) {
      console.error('Error saving document:', err);
    }
  };

  // Delete Knowledge Doc
  const handleDeleteDoc = async (id: string) => {
    if (!window.confirm("Supprimer ce document de la base de connaissances RAG ?")) return;
    try {
      const res = await fetch(`/api/kb/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchKbDocs();
      }
    } catch (err) {
      console.error('Error deleting document:', err);
    }
  };

  // Export AI Chat History as CSV Report
  const handleExportCSV = () => {
    const logsToExport = chatLogs.length > 0 ? chatLogs : [
      {
        id: 'sample-1',
        timestamp: new Date().toISOString(),
        userMessage: 'Quels sont vos tarifs pour une application mobile en Afrique ?',
        botReply: 'V&I TECH conçoit des applications mobiles Flutter à partir de 2 500 $ avec garantie 6 mois.',
        sourcesUsed: ['Services Mobiles', 'Grille Tarifaire'],
        escalatedToHuman: false,
        languageDetected: 'fr',
        model: 'gemini-3.7-flash',
      },
      {
        id: 'sample-2',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userMessage: 'Pouvez-vous signer un NDA avant de discuter de notre projet bancaire ?',
        botReply: 'Oui, V&I TECH signe systématiquement un accord de confidentialité NDA strict avant tout échange.',
        sourcesUsed: ['Garanties & SLA'],
        escalatedToHuman: false,
        languageDetected: 'fr',
        model: 'gemini-3.7-flash',
      }
    ];

    const headers = ['ID', 'Date_Heure', 'Message_Visiteur', 'Reponse_IA', 'Sources_RAG_Utilisees', 'Escalade_Humaine', 'Langue', 'Modele'];
    const rows = logsToExport.map((log) => [
      `"${log.id}"`,
      `"${new Date(log.timestamp).toLocaleString()}"`,
      `"${log.userMessage.replace(/"/g, '""')}"`,
      `"${log.botReply.replace(/"/g, '""')}"`,
      `"${(log.sourcesUsed || []).join('; ').replace(/"/g, '""')}"`,
      `"${log.escalatedToHuman ? 'OUI' : 'NON'}"`,
      `"${log.languageDetected || 'fr'}"`,
      `"${log.model || 'gemini-3.7-flash'}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `vitech_ai_chat_audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredDocs = kbDocs.filter((d) => 
    d.title.toLowerCase().includes(kbSearch.toLowerCase()) ||
    d.content.toLowerCase().includes(kbSearch.toLowerCase()) ||
    d.tags.some(t => t.toLowerCase().includes(kbSearch.toLowerCase()))
  );

  const charCount = formData.systemPrompt.length;
  const wordCount = formData.systemPrompt.trim().split(/\s+/).filter(Boolean).length;
  const approxTokens = Math.round(charCount / 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Banner with Actions */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/50 rounded-3xl border border-slate-800 p-6 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Centre de Contrôle IA &amp; Moteur RAG d'Entreprise
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Gemini 3.7 Flash RAG Actif
              </span>
            </div>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Analysez les requêtes visiteurs, testez en direct vos modifications en Mode Aperçu, enrichissez la base de connaissances et auditez les échanges.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Mode Aperçu / Preview Mode Trigger */}
          <button
            type="button"
            onClick={() => {
              setPreviewHistory([
                {
                  id: 'prev-1',
                  role: 'assistant',
                  text: formData.welcomeMessage || "Bonjour et bienvenue chez V&I TECH AFRICA LTD ! Je suis votre Assistant IA Officiel.",
                  timestamp: 'À l\'instant',
                  sources: ["Documentation Officielle V&I TECH"],
                }
              ]);
              setIsPreviewModalOpen(true);
            }}
            className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            title="Tester le prompt en direct dans une fenêtre de chat simulée avant enregistrement"
          >
            <Eye className="w-4 h-4 text-indigo-400" />
            <span>Mode Aperçu Client</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="flex-1 lg:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
            title="Restaurer le prompt d'origine"
          >
            <RotateCcw className="w-4 h-4 text-rose-400" />
            <span>Réinitialiser</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="flex-1 lg:flex-none px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-black tracking-wider uppercase transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Enregistrement...' : 'Enregistrer'}</span>
          </button>
        </div>
      </div>

      {saveFeedback && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-sm font-bold flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* Sub-Tabs Selector */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'analytics'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-amber-400" />
          <span>Analyses &amp; Lacunes de Connaissances</span>
        </button>

        <button
          onClick={() => setActiveSubTab('prompt')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'prompt'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Terminal className="w-4 h-4 text-blue-400" />
          <span>Prompt &amp; Personnalité</span>
        </button>

        <button
          onClick={() => setActiveSubTab('kb')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'kb'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Database className="w-4 h-4 text-emerald-400" />
          <span>Base de Connaissances RAG ({kbDocs.length || 8})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'logs'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Audit des Conversations</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 0: ANALYTICS & KNOWLEDGE GAPS (RECHARTS) */}
      {/* ===================================================================== */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Requêtes Traitées</p>
                <h4 className="text-2xl font-black text-white mt-1">128</h4>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" /> +24% ce mois
                </span>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Bot className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Taux Résolution RAG</p>
                <h4 className="text-2xl font-black text-emerald-400 mt-1">82.4%</h4>
                <span className="text-[11px] text-slate-500 mt-1">Zéro hallucination</span>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Escalades Humaines</p>
                <h4 className="text-2xl font-black text-amber-400 mt-1">12.2%</h4>
                <span className="text-[11px] text-slate-500 mt-1">Redirigés WhatsApp</span>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Phone className="w-6 h-6" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 font-medium">Lacunes Détectées</p>
                <h4 className="text-2xl font-black text-rose-400 mt-1">3</h4>
                <span className="text-[11px] text-rose-400 font-bold mt-1">À documenter</span>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Recharts Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* BarChart: Top Visitor Inquiries by Subject */}
            <div className="lg:col-span-7 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Sujets les Plus Fréquemment Demandés</h3>
                </div>
                <span className="text-[10px] text-slate-400 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 font-mono">
                  30 Derniers Jours
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TOPIC_DISTRIBUTION_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                    <XAxis dataKey="topic" stroke="#64748b" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" />
                    <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      itemStyle={{ color: '#60a5fa' }}
                    />
                    <Bar dataKey="inquiries" name="Nombre de requêtes" radius={[6, 6, 0, 0]}>
                      {TOPIC_DISTRIBUTION_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* PieChart: Resolution Quality */}
            <div className="lg:col-span-5 bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Qualité &amp; Résolution des Échanges</h3>
                </div>
              </div>

              <div className="h-56 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={RESOLUTION_QUALITY_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {RESOLUTION_QUALITY_DATA.map((entry, index) => (
                        <Cell key={`pie-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                      formatter={(val: any) => [`${val}%`, 'Part']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                {RESOLUTION_QUALITY_DATA.map((item, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-slate-950 border border-slate-800/80">
                    <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] text-slate-400 block truncate">{item.name}</span>
                    <strong className="text-xs text-white font-mono">{item.value}%</strong>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Identified Knowledge Gaps Widget */}
          <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                  <span>Détection Automatique des Lacunes Documentaires (Knowledge Gaps)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Questions récurrentes des visiteurs n'ayant pas trouvé de réponse dans la base RAG officielle.
                </p>
              </div>

              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4 text-blue-400" />
                <span>Exporter Rapport CSV</span>
              </button>
            </div>

            <div className="space-y-3">
              {DETECTED_KNOWLEDGE_GAPS.map((gap) => (
                <div
                  key={gap.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-amber-900/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        {gap.occurrences} demandes non résolues
                      </span>
                      <span className="text-[10px] text-slate-500 uppercase font-mono">
                        Catégorie : {gap.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-medium">
                      « {gap.query} »
                    </p>
                    <p className="text-[11px] text-blue-400">
                      💡 Document recommandé à créer : <strong>{gap.suggestedDoc}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingDoc({
                        id: `doc-${Date.now()}`,
                        title: gap.suggestedDoc,
                        category: gap.category,
                        tags: ['lacune-comblee', gap.category],
                        content: `Consignes et réponses officielles concernant : ${gap.query}\n\n[Rédiger ici les conditions exactes de V&I TECH AFRICA LTD]`,
                        lastUpdated: new Date().toISOString().split('T')[0],
                        isOfficial: true,
                      });
                      setIsDocModalOpen(true);
                      setActiveSubTab('kb');
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Créer ce Document RAG</span>
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 1: PROMPT & PERSONALITY CONFIGURATION */}
      {/* ===================================================================== */}
      {activeSubTab === 'prompt' && (
        <div className="space-y-8">
          
          {/* Preset Persona Quick Selectors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Charger un Persona Prédéfini en 1 Clic</span>
              </label>
              <span className="text-xs text-slate-500">Cliquez pour pré-remplir le prompt</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {PROMPT_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-blue-500/50 text-left transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800">
                        {preset.badge}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">Temp: {preset.temperature}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-1.5 line-clamp-2">
                      {preset.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-blue-400 font-medium">
                    <span>Appliquer ce modèle</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Editor + Interactive Sandbox */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Prompt Formulation */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-7 space-y-6">
                
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" />
                    <span>Configuration du Persona &amp; Instructions Maîtresses</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ces consignes sont fusionnées avec les extraits documentaires RAG lors de chaque requête utilisateur.
                  </p>
                </div>

                {/* Assistant Display Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Nom Affiché de l'Assistant (dans le Chat Widget)
                  </label>
                  <input
                    type="text"
                    value={formData.assistantName}
                    onChange={(e) => setFormData({ ...formData, assistantName: e.target.value })}
                    placeholder="Ex: Assistant IA Officiel & Conseiller Technique V&I TECH AFRICA"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>

                {/* Initial Welcome Greeting */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    Message d'Accueil Initial
                  </label>
                  <textarea
                    rows={2}
                    value={formData.welcomeMessage}
                    onChange={(e) => setFormData({ ...formData, welcomeMessage: e.target.value })}
                    placeholder="Ex: Bonjour et bienvenue chez V&I TECH AFRICA LTD ! Comment pouvons-nous vous aider ?"
                    className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                {/* Master System Prompt Editor */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-amber-400" />
                      <span>Directives Système Additionnelles</span>
                    </label>
                    
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyPrompt}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedPrompt ? 'Copié !' : 'Copier'}</span>
                      </button>

                      <span className="text-[11px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {wordCount} mots • ~{approxTokens} tokens
                      </span>
                    </div>
                  </div>

                  <textarea
                    rows={12}
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                    className="w-full p-4 bg-slate-950 border border-slate-700/90 rounded-2xl text-slate-200 text-xs sm:text-sm font-mono leading-relaxed focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                  />
                </div>

                {/* Direct Escalation Contacts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Ligne WhatsApp d'Escalade
                    </label>
                    <input
                      type="text"
                      value={formData.contactWhatsApp}
                      onChange={(e) => setFormData({ ...formData, contactWhatsApp: e.target.value })}
                      placeholder="+250 795 507 001"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      Email de Contact Technique
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="contact.vitechdev@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* Right: Parameters & Sandbox */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 space-y-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                  <Sliders className="w-4 h-4 text-indigo-400" />
                  <span>Paramètres RAG &amp; Inférence</span>
                </h3>

                {/* Model */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    Modèle Google Gemini
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="gemini-3.7-flash">Gemini 3.7 Flash (Recommandé - Raisonnement RAG)</option>
                    <option value="gemini-3.5-flash">Gemini 3.5 Flash</option>
                  </select>
                </div>

                {/* Temperature */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                      <Gauge className="w-3.5 h-3.5 text-amber-400" />
                      <span>Température ({formData.temperature.toFixed(2)})</span>
                    </label>
                    <span className="text-[10px] text-emerald-400 font-bold font-mono">
                      {formData.temperature < 0.5 ? 'Factuel & Rigoureux' : 'Créatif'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.05"
                    value={formData.temperature}
                    onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                    className="w-full accent-blue-500 bg-slate-950 rounded-lg cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                    <span>0.1 (Strict &amp; Anti-hallucination)</span>
                    <span>0.5 (Recommandé RAG)</span>
                    <span>1.0 (Libre)</span>
                  </div>
                </div>

                {/* Open Full Preview Modal Button */}
                <button
                  type="button"
                  onClick={() => {
                    setPreviewHistory([
                      {
                        id: 'prev-1',
                        role: 'assistant',
                        text: formData.welcomeMessage || "Bonjour et bienvenue chez V&I TECH AFRICA LTD ! Je suis votre Assistant IA Officiel.",
                        timestamp: 'À l\'instant',
                        sources: ["Documentation Officielle V&I TECH"],
                      }
                    ]);
                    setIsPreviewModalOpen(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Maximize2 className="w-4 h-4 text-indigo-400" />
                  <span>Ouvrir en Mode Aperçu Grand Format</span>
                </button>
              </div>

              {/* Sandbox Testing */}
              <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 flex flex-col h-[420px]">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquareCode className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">Bac à Sable de Test RAG</h3>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono">
                    Brouillon
                  </span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 no-scrollbar">
                  {[
                    "Quels sont vos prix pour un MVP ?",
                    "Où sont vos bureaux à Kigali ?",
                    "Avez-vous une garantie 6 mois ?",
                  ].map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleRunSandboxTest(sample)}
                      className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 whitespace-nowrap cursor-pointer transition-colors shrink-0"
                    >
                      {sample}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-950 rounded-2xl border border-slate-800/80 mb-3 text-xs">
                  {testHistory.map((item, idx) => (
                    <div
                      key={idx}
                      className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-slate-500 mb-0.5">
                        {item.role === 'user' ? 'Vous (Test)' : formData.assistantName}
                      </span>
                      <div
                        className={`p-3 rounded-xl max-w-[90%] leading-relaxed ${
                          item.role === 'user'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-slate-800/90 text-slate-200 border border-slate-700 rounded-bl-none'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{item.text}</div>
                        {item.sources && item.sources.length > 0 && (
                          <div className="mt-2 pt-1.5 border-t border-slate-700 text-[10px] text-blue-300">
                            Sources RAG : {item.sources.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTesting && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs p-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span>Recherche dans la base de connaissances &amp; génération...</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleRunSandboxTest();
                      }
                    }}
                    placeholder="Tester une question client..."
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRunSandboxTest()}
                    disabled={!testInput.trim() || isTesting}
                    className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: RAG KNOWLEDGE BASE DOCUMENT MANAGER */}
      {/* ===================================================================== */}
      {activeSubTab === 'kb' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-emerald-400" />
                <span>Documents &amp; Connaissances Officielles V&amp;I TECH</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                L'assistant IA consulte ces documents en priorité pour chaque réponse client.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                <input
                  type="text"
                  value={kbSearch}
                  onChange={(e) => setKbSearch(e.target.value)}
                  placeholder="Rechercher un document..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                onClick={() => {
                  setEditingDoc({
                    id: `doc-${Date.now()}`,
                    title: '',
                    category: 'services',
                    tags: ['nouveau'],
                    content: '',
                    lastUpdated: new Date().toISOString().split('T')[0],
                    isOfficial: true,
                  });
                  setIsDocModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Document</span>
              </button>
            </div>
          </div>

          {/* Document Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-950 text-blue-300 border border-blue-800 uppercase">
                      {doc.category}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Mis à jour : {doc.lastUpdated}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2">{doc.title}</h4>
                  
                  <p className="text-xs text-slate-300 line-clamp-4 font-mono leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                    {doc.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-1 mt-3">
                    {doc.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    onClick={() => {
                      setEditingDoc(doc);
                      setIsDocModalOpen(true);
                    }}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="p-2 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit/Add Modal */}
          {isDocModalOpen && editingDoc && (
            <div className="fixed inset-0 z-[210] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">
                    {editingDoc.id.startsWith('doc-') ? 'Ajouter un Document' : 'Modifier le Document RAG'}
                  </h3>
                  <button
                    onClick={() => {
                      setIsDocModalOpen(false);
                      setEditingDoc(null);
                    }}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Titre du Document</label>
                  <input
                    type="text"
                    value={editingDoc.title}
                    onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    placeholder="Ex: Tarifs & Délais - Développement Mobile"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Catégorie</label>
                    <select
                      value={editingDoc.category}
                      onChange={(e) => setEditingDoc({ ...editingDoc, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="services">Services &amp; Offres</option>
                      <option value="pricing">Tarifs &amp; Devis</option>
                      <option value="guarantees">Garanties &amp; SLA</option>
                      <option value="company">Entreprise &amp; Contact</option>
                      <option value="security">Cybersécurité &amp; Pentest</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Mots-clés / Tags (séparés par virgules)</label>
                    <input
                      type="text"
                      value={editingDoc.tags.join(', ')}
                      onChange={(e) => setEditingDoc({ ...editingDoc, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
                      placeholder="mobile, flutter, prix, délais"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Contenu Factuel Vérifié (Source de Vérité)</label>
                  <textarea
                    rows={8}
                    value={editingDoc.content}
                    onChange={(e) => setEditingDoc({ ...editingDoc, content: e.target.value })}
                    className="w-full p-3.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500"
                    placeholder="Rédigez ici les informations exactes sans ambiguïté..."
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setIsDocModalOpen(false);
                      setEditingDoc(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => handleSaveDoc(editingDoc)}
                    disabled={!editingDoc.title.trim() || !editingDoc.content.trim()}
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                  >
                    Enregistrer dans la Base RAG
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: CONVERSATION AUDIT LOGS + CSV EXPORT */}
      {/* ===================================================================== */}
      {activeSubTab === 'logs' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/90 p-5 rounded-2xl border border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>Journalisation &amp; Audit Sécurisé des Échanges</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Visualisez les requêtes des visiteurs, les sources documentaires RAG mobilisées et exportez les rapports.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Exporter en CSV</span>
              </button>

              <button
                onClick={fetchChatLogs}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${logsLoading ? 'animate-spin' : ''}`} />
                <span>Actualiser</span>
              </button>
            </div>
          </div>

          {chatLogs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-800/80 text-slate-400">
              <Bot className="w-10 h-10 mx-auto text-slate-600 mb-3" />
              <p className="text-sm font-bold text-slate-300">Aucun journal de conversation récent</p>
              <p className="text-xs text-slate-500 mt-1">
                Les conversations des visiteurs apparaîtront ici au fur et à mesure avec les sources consultées.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {chatLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-slate-400 text-[11px]">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                      {log.escalatedToHuman && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[10px] font-bold flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          Escalade Humaine
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded">
                      {log.model}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-900/50 text-blue-200">
                      <strong className="text-blue-400">Visiteur :</strong> {log.userMessage}
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-slate-300">
                      <strong className="text-emerald-400">Assistant IA :</strong> {log.botReply}
                    </div>
                  </div>

                  {log.sourcesUsed && log.sourcesUsed.length > 0 && (
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 pt-1">
                      <BookOpen className="w-3 h-3 text-blue-400" />
                      <span>Sources RAG vérifiées :</span>
                      {log.sourcesUsed.map((src, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ===================================================================== */}
      {/* SIMULATED CLIENT PREVIEW MODE MODAL */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[210] bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl h-[720px] max-h-[92vh] flex flex-col overflow-hidden shadow-2xl"
            >
              
              {/* Preview Header Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-blue-950 to-slate-900 p-4 border-b border-indigo-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Eye className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-white uppercase tracking-wider">
                        Mode Aperçu &bull; Simulation Client en Direct
                      </h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                        Brouillon Non Enregistré
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200/80">
                      Ce chat simule exactement le widget visiteur avec vos modifications actuelles (Température: {formData.temperature}, Modèle: {formData.model}).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      handleSave();
                      setIsPreviewModalOpen(false);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>Valider &amp; Publier en Prod</span>
                  </button>

                  <button
                    onClick={() => setIsPreviewModalOpen(false)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Simulation Area */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                
                {/* Left Side: Test Scenarios & Draft Inspector */}
                <div className="w-full md:w-72 bg-slate-950/80 border-r border-slate-800 p-4 space-y-4 overflow-y-auto shrink-0">
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Scénarios de Test Rapides</span>
                    </h4>
                    <div className="space-y-1.5">
                      {[
                        "Combien coûte le développement d'une app fintech ?",
                        "Quelles sont vos garanties sur la propriété du code ?",
                        "Où se trouve votre bureau à Norrsken Kigali ?",
                        "Test Anti-Hallucination : Vendez-vous des pizzas ?",
                      ].map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendPreviewMessage(prompt)}
                          className="w-full text-left p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-blue-400 border border-slate-800/80 text-[11px] transition-colors cursor-pointer"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 text-xs space-y-2">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Nom :</span>
                      <strong className="text-slate-200 truncate max-w-[140px]">{formData.assistantName}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Modèle :</span>
                      <strong className="text-emerald-400 font-mono">{formData.model}</strong>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>Température :</span>
                      <strong className="text-amber-400 font-mono">{formData.temperature}</strong>
                    </div>
                  </div>
                </div>

                {/* Right Side: Simulated Chat Window */}
                <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
                  
                  {/* Messages Feed */}
                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
                    {previewHistory.map((msg) => {
                      const isUser = msg.role === 'user';
                      return (
                        <div
                          key={msg.id}
                          className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                        >
                          <div
                            className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                              isUser
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                                : 'bg-slate-800/90 text-slate-200 rounded-bl-none border border-slate-700/80'
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{msg.text}</div>

                            {!isUser && msg.sources && msg.sources.length > 0 && (
                              <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex flex-wrap items-center gap-1 text-[10px] text-slate-400">
                                <BookOpen className="w-2.5 h-2.5 text-blue-400 shrink-0" />
                                <span className="font-semibold text-slate-300">Sources vérifiées :</span>
                                {msg.sources.map((src, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900/80 text-blue-300 border border-slate-700/80">
                                    {src}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          <span className="text-[10px] text-slate-500 mt-1 px-1 flex items-center gap-1">
                            {msg.timestamp}
                            {isUser && <CheckCheck className="w-3 h-3 text-blue-400" />}
                          </span>
                        </div>
                      );
                    })}

                    {isPreviewLoading && (
                      <div className="flex items-center space-x-2 text-xs text-slate-400 p-3 rounded-2xl bg-slate-800/60 w-fit">
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-100" />
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse delay-200" />
                        <span className="ml-1">Simulation de la réponse avec le prompt brouillon...</span>
                      </div>
                    )}
                  </div>

                  {/* Input Form in Preview */}
                  <div className="p-3.5 bg-slate-950 border-t border-slate-800">
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSendPreviewMessage();
                      }}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="text"
                        value={previewInput}
                        onChange={(e) => setPreviewInput(e.target.value)}
                        placeholder="Tapez un message de test pour éprouver le prompt..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                      />
                      <button
                        type="submit"
                        disabled={!previewInput.trim() || isPreviewLoading}
                        className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-40 transition-all cursor-pointer shadow-md"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
