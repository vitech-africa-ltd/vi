import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Search, 
  ShieldCheck, 
  Coins, 
  Code2, 
  Clock, 
  Lock, 
  MessageSquare, 
  Sparkles, 
  Phone, 
  CheckCircle2, 
  ArrowRight, 
  Globe2, 
  CreditCard, 
  Scale, 
  Layers, 
  Cpu, 
  ThumbsUp, 
  ThumbsDown, 
  Maximize2, 
  Minimize2, 
  RefreshCw,
  MapPin,
  Calendar,
  Smartphone,
  Server,
  Terminal,
  FileCode,
  Shield,
  Zap,
  FolderGit2,
  CheckCircle,
  ExternalLink,
  Laptop
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCountry } from '../context/CountryContext';
import { useSiteData } from '../context/SiteDataContext';
import { OfficeHub } from '../types';

export interface FaqItem {
  id: string;
  category: 
    | 'all' 
    | 'web-saas' 
    | 'mobile' 
    | 'csharp-desktop' 
    | 'cloud-devops' 
    | 'ai-automation' 
    | 'cybersecurity' 
    | 'pricing-payment' 
    | 'ip-legal' 
    | 'method-sla'
    | 'scripts-store';
  categoryLabel: string;
  serviceBadge?: string;
  icon: React.ElementType;
  question: string;
  isContextual?: boolean;
  getDynamicAnswer: (ctx: {
    countryName: string;
    countryFlag: string;
    localHub: string;
    hubCity: string;
    currencyCode: string;
    currencySymbol: string;
    currencyName: string;
    paymentMethods: string[];
    ndaJurisdiction: string;
    taxInfo: string;
    mvpPrice: string;
    sprintPrice: string;
    desktopPrice: string;
    cloudPrice: string;
    aiPrice: string;
    auditPrice: string;
  }) => {
    summary: string;
    paragraphs: string[];
    highlights?: { label: string; value: string }[];
    tags: string[];
    actionCta?: {
      label: string;
      icon?: React.ElementType;
      actionType: 'converter' | 'country' | 'estimator' | 'chat' | 'schedule' | 'services' | 'scripts';
      serviceId?: string;
    };
  };
}

interface FaqSectionProps {
  onOpenChat?: () => void;
  onOpenEstimator?: () => void;
  onOpenScheduleModal?: (hub?: OfficeHub) => void;
  onNavigateToView?: (viewId: string) => void;
  onSelectServiceForQuote?: (serviceId: string) => void;
  initialCategory?: string;
  className?: string;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenChat,
  onOpenEstimator,
  onOpenScheduleModal,
  onNavigateToView,
  onSelectServiceForQuote,
  initialCategory = 'all',
  className = '',
}) => {
  const { t } = useTranslation();
  const { currencyOption, openConverterModal, formatCurrency } = useCurrency();
  const { currentCountry, openCountryModal } = useCountry();
  const { companyInfo, techHubs } = useSiteData();

  const [activeCategory, setActiveCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-pricing-context': true,
    'faq-web-saas': true,
  });
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, 'up' | 'down'>>({});

  // Dynamic context values computed in real-time
  const contextData = useMemo(() => {
    return {
      countryName: currentCountry.name,
      countryFlag: currentCountry.flag,
      localHub: currentCountry.localHub || 'Hub Panafricain V&I Tech',
      hubCity: currentCountry.hubCity || 'Kigali',
      currencyCode: currencyOption.code,
      currencySymbol: currencyOption.symbol,
      currencyName: currencyOption.name,
      paymentMethods: currentCountry.paymentMethods || ['Virement Bancaire', 'Mobile Money', 'Carte Visa/Mastercard'],
      ndaJurisdiction: currentCountry.ndaJurisdiction || 'Tribunal de Commerce International (Droit OHADA & OHADA)',
      taxInfo: currentCountry.taxInfo || 'Facturation certifiée conforme aux normes fiscales nationales',
      mvpPrice: formatCurrency(2500),
      sprintPrice: formatCurrency(600),
      desktopPrice: formatCurrency(1800),
      cloudPrice: formatCurrency(2800),
      aiPrice: formatCurrency(4000),
      auditPrice: formatCurrency(3500),
    };
  }, [currentCountry, currencyOption, formatCurrency]);

  const toggleItem = (id: string) => {
    setOpenItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleVote = (id: string, vote: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    setHelpfulVotes(prev => ({
      ...prev,
      [id]: prev[id] === vote ? (undefined as unknown as 'up') : vote,
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    faqItems.forEach(item => {
      allOpen[item.id] = true;
    });
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenItems({});
  };

  const handleCtaAction = (action: { actionType: string; serviceId?: string }) => {
    switch (action.actionType) {
      case 'converter':
        openConverterModal(2500);
        break;
      case 'country':
        openCountryModal();
        break;
      case 'estimator':
        if (action.serviceId && onSelectServiceForQuote) {
          onSelectServiceForQuote(action.serviceId);
        } else if (onOpenEstimator) {
          onOpenEstimator();
        } else if (onNavigateToView) {
          onNavigateToView('estimator');
        }
        break;
      case 'chat':
        if (onOpenChat) onOpenChat();
        break;
      case 'schedule':
        if (onOpenScheduleModal) {
          const matchedHub = techHubs.find(h => h.city.toLowerCase().includes(contextData.hubCity.toLowerCase()));
          onOpenScheduleModal(matchedHub);
        }
        break;
      case 'services':
        if (onNavigateToView) onNavigateToView('services');
        break;
      case 'scripts':
        if (onNavigateToView) onNavigateToView('scripts');
        break;
    }
  };

  // Comprehensive FAQ list covering all services, technical details & legal aspects of Vitech Africa
  const faqItems: FaqItem[] = useMemo(() => [
    // 1. SERVICES WEB & SAAS
    {
      id: 'faq-web-saas',
      category: 'web-saas',
      categoryLabel: 'Web & SaaS',
      serviceBadge: 'Pôle Web Élite',
      icon: Globe2,
      question: 'Quelles sont vos compétences sur le développement d’applications Web & SaaS haute performance ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Nous concevons des plateformes web complexes, des ERP d’entreprise et des SaaS scalables avec Next.js 15, React 19, TypeScript et NestJS.',
        paragraphs: [
          'Notre équipe d’ingénieurs seniors développe des architectures modernes en Server-Side Rendering (SSR) et Progressive Web Apps (PWA) garantissant des scores Core Web Vitals supérieurs à 95/100.',
          `Pour vos projets en ${ctx.countryName}, nos architectures intègrent dès la conception le multi-tenant, la gestion fine des rôles (RBAC), des bases PostgreSQL partitionnées avec cache Redis ultra-rapide et l’intégration de paiements panafricains.`,
          `Un projet Web/SaaS démarre à partir de ${ctx.mvpPrice} avec livraison en 4 à 10 semaines clés en main.`
        ],
        highlights: [
          { label: 'Stack Frontend', value: 'Next.js 15 • React 19 • Tailwind CSS' },
          { label: 'Stack Backend', value: 'Node.js (NestJS) • Python FastAPI • Go' },
          { label: 'Base de données', value: 'PostgreSQL • Redis • Vector DB' },
          { label: 'Performance', value: 'Temps de chargement < 800ms' }
        ],
        tags: ['Next.js 15', 'React 19', 'TypeScript', 'PostgreSQL', 'Multi-tenant', 'Microservices'],
        actionCta: {
          label: 'Simuler un devis Web / SaaS',
          icon: Code2,
          actionType: 'estimator',
          serviceId: 'web-saas'
        }
      })
    },

    // 2. APPLICATIONS MOBILES & OFFLINE-FIRST
    {
      id: 'faq-mobile-apps',
      category: 'mobile',
      categoryLabel: 'Applications Mobiles',
      serviceBadge: 'Pôle Mobile Multiplateforme',
      icon: Smartphone,
      question: 'Comment gérez-vous le mode hors-ligne (Offline-First) et les connexions réseau instables en Afrique ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Toutes nos applications mobiles Flutter & React Native intègrent une base de données locale (SQLite / WatermelonDB) avec synchronisation bidirectionnelle résiliente.',
        paragraphs: [
          'En Afrique, la connectivité peut fluctuer. Nos architectures permettent aux utilisateurs de créer des transactions, saisir des rapports et naviguer même sans connexion internet. Dès que le réseau est rétabli, un moteur de synchronisation en arrière-plan réconcilie les données sans conflit avec le serveur central.',
          'Nous optimisons également la taille des binaires (APK < 25 Mo) et la consommation des données mobiles pour maximiser le taux d’adoption de vos utilisateurs sur iOS et Android.',
          'Nous prenons en charge la publication complète et certifiée sur Google Play Store et Apple App Store.'
        ],
        highlights: [
          { label: 'Technologies', value: 'Flutter 3 (Dart) • React Native' },
          { label: 'Base locale', value: 'SQLite • WatermelonDB • Hive' },
          { label: 'Gestion réseau', value: 'Mode Hors-Ligne 100% Fonctionnel' },
          { label: 'Déploiement', value: 'App Store & Google Play certifié' }
        ],
        tags: ['Flutter 3', 'Offline-First', 'iOS & Android', 'Sync Background', 'Mobile Money'],
        actionCta: {
          label: 'Estimer mon application mobile',
          icon: Smartphone,
          actionType: 'estimator',
          serviceId: 'mobile-apps'
        }
      })
    },

    // 3. SOLUTIONS C# .NET & WPF DESKTOP
    {
      id: 'faq-csharp-desktop',
      category: 'csharp-desktop',
      categoryLabel: 'C# .NET & Desktop',
      serviceBadge: 'Pôle Desktop & Systèmes de Caisse',
      icon: Laptop,
      question: 'Proposez-vous des logiciels de gestion de caisse (POS), microfinance et ERP Desktop en C# .NET / WPF ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Oui, V&I Tech dispose d’une expertise historique en ingénierie logicielle Desktop C# .NET 8 / WPF / WinUI pour les commerces, cliniques et institutions financières.',
        paragraphs: [
          'Nos logiciels de bureau fonctionnent en totale autonomie sans connexion internet requise. Ils communiquent directement avec les périphériques matériels : imprimantes thermiques de reçus (Epson, Bixolon), scanners de codes-barres 1D/2D, tiroirs-caisses et terminaux de paiement.',
          'Idéal pour les supermarchés, pharmacies, hôtels, stations-service et agences de microfinance nécessitant une vitesse d’exécution instantanée (zéro latence) et une robustesse à toute épreuve.',
          `Tarifs indicatifs : Solution logicielle C# sur-mesure dès ${ctx.desktopPrice} avec licence illimitée et formation des caissiers/gestionnaires.`
        ],
        highlights: [
          { label: 'Langage & Framework', value: 'C# .NET 8 • WPF • WinUI 3' },
          { label: 'Périphériques', value: 'Imprimantes thermiques ESC/POS • Scanners' },
          { label: 'Base de données', value: 'SQL Server • SQLite Local • PostgreSQL' },
          { label: 'Fonctionnement', value: '100% Autonome / Hors-Ligne' }
        ],
        tags: ['C# .NET 8', 'WPF', 'Logiciel de Caisse', 'Microfinance', 'Périphériques POS', 'Hors-Ligne'],
        actionCta: {
          label: 'Demander un devis logiciel C# WPF',
          icon: Laptop,
          actionType: 'estimator',
          serviceId: 'csharp-desktop'
        }
      })
    },

    // 4. CLOUD ARCHITECTURE, DEVOPS & FINOPS
    {
      id: 'faq-cloud-devops',
      category: 'cloud-devops',
      categoryLabel: 'Cloud & DevOps',
      serviceBadge: 'Pôle Cloud & Éco-Conception',
      icon: Server,
      question: 'Comment optimisez-vous les coûts Cloud (FinOps) et la tolérance aux pannes sur AWS / GCP ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Nous réduisons vos factures d’hébergement de 30% à 50% grâce à des architectures serverless, conteneurs Docker/Kubernetes et instances réservées auto-scalables.',
        paragraphs: [
          'Nos ingénieurs certifiés AWS et Google Cloud mettent en place des pipelines CI/CD automatisés assurant des déploiements sans interruption de service (Zero-Downtime Blue/Green).',
          'Chaque infrastructure inclut un monitoring proactif 24/7 (Prometheus, Grafana) avec alertes instantanées sur Telegram/Slack, des sauvegardes géoredistribuées et un plan de reprise d’activité (PRA) éprouvé.',
          `De plus, notre approche Green Cloud optimise la consommation de calcul pour minimiser l’empreinte carbone des serveurs hébergeant vos utilisateurs en ${ctx.countryName}.`
        ],
        highlights: [
          { label: 'Fournisseurs Cloud', value: 'AWS • Google Cloud Platform • Azure' },
          { label: 'Conteneurs', value: 'Docker • Kubernetes (EKS / GKE)' },
          { label: 'Économie constatée', value: '-30% à -50% sur facture mensuelle' },
          { label: 'Disponibilité', value: 'SLA 99.99% avec redondance multi-région' }
        ],
        tags: ['AWS', 'GCP', 'Kubernetes', 'Terraform', 'FinOps', 'CI/CD Zero-Downtime'],
        actionCta: {
          label: 'Audit & Devis Cloud DevOps',
          icon: Server,
          actionType: 'estimator',
          serviceId: 'cloud-devops'
        }
      })
    },

    // 5. INTELLIGENCE ARTIFICIELLE & AUTOMATISATION
    {
      id: 'faq-ai-automation',
      category: 'ai-automation',
      categoryLabel: 'IA & Automatisation',
      serviceBadge: 'Pôle Intelligence Artificielle',
      icon: Cpu,
      question: 'Comment intégrez-vous l’IA générative (Google Gemini, RAG) et l’automatisation documentaire dans nos métiers ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Nous déployons des agents IA sécurisés connectés à vos données privées d’entreprise via des architectures RAG (Retrieval-Augmented Generation) et OCR intelligent.',
        paragraphs: [
          'Cas d’usage concrets développés par V&I Tech : Assistants conversationnels multilingues adaptés aux contextes panafricains (Français, Anglais, Swahili, Wolof, Arabe), extraction automatique de données sur cartes nationales d’identité, passeports et factures, scoring prédictif de risque crédit et automatisation des workflows administratifs.',
          'Vos données d’entreprise restent strictement confidentielles et ne sont jamais utilisées pour réentraîner des modèles publics.',
          `Projets IA sur-mesure à partir de ${ctx.aiPrice} avec API sécurisée et dashboard de supervision en temps réel.`
        ],
        highlights: [
          { label: 'Modèles supportés', value: 'Google Gemini 3.7 / Flash • OpenAI GPT-4o • Mistral' },
          { label: 'Architecture', value: 'RAG Vectoriel (Pinecone / pgvector)' },
          { label: 'Confidentialité', value: '100% Chiffré & Cloisonné' },
          { label: 'Multilingue', value: 'Français, Anglais, Swahili, Wolof, Arabe' }
        ],
        tags: ['Gemini AI', 'RAG Vectoriel', 'OCR Intelligent', 'Scoring Crédit', 'Agents Autonomes'],
        actionCta: {
          label: 'Tester & Estimer une solution IA',
          icon: Sparkles,
          actionType: 'estimator',
          serviceId: 'ai-automation'
        }
      })
    },

    // 6. CYBERSÉCURITÉ, PENTEST & AUDIT
    {
      id: 'faq-cybersecurity',
      category: 'cybersecurity',
      categoryLabel: 'Cybersécurité & Audit',
      serviceBadge: 'Pôle Sécurité Offensive & Défensive',
      icon: ShieldCheck,
      question: 'Comment protégez-vous nos systèmes contre les cyberattaques et respectez-vous les normes de sécurité bancaire ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Nos experts en sécurité offensive réalisent des tests d’intrusion (pentests) approfondis et durcissent vos applications selon les standards OWASP Top 10.',
        paragraphs: [
          'Nous auditons le code source (SAST/DAST), les API, les applications mobiles et les serveurs Cloud. Nous mettons en œuvre le chiffrement de bout en bout (AES-256 / TLS 1.3), l’authentification forte (MFA / 2FA / WebAuthn) et la gestion des clés secrètes via HashiCorp Vault.',
          `À l’issue de chaque mission, nous délivrons un rapport complet d’audit exécutif et technique accompagné d’un certificat officiel de conformité de sécurité applicative pour vos partenaires financiers et régulateurs en ${ctx.countryName}.`
        ],
        highlights: [
          { label: 'Méthodologie', value: 'OWASP Top 10 • Pentesting Boîte Noire/Blanche' },
          { label: 'Chiffrement', value: 'AES-256 • TLS 1.3 • Clés KMS / Vault' },
          { label: 'Livrables', value: 'Rapport certifié & Plan de remédiation' },
          { label: 'Astreinte', value: 'Intervention d’urgence 24/7' }
        ],
        tags: ['Pentesting', 'OWASP Top 10', 'Chiffrement AES-256', 'MFA', 'Audit de Code'],
        actionCta: {
          label: 'Planifier un Pentest / Audit',
          icon: Shield,
          actionType: 'estimator',
          serviceId: 'cybersecurity-audit'
        }
      })
    },

    // 7. TARIFICATION, DEVISES & MOYENS DE PAIEMENT
    {
      id: 'faq-pricing-context',
      category: 'pricing-payment',
      categoryLabel: 'Tarifs & Paiements',
      serviceBadge: 'Transparence Financière',
      icon: Coins,
      isContextual: true,
      question: `Quels sont vos tarifs en ${contextData.currencyCode} (${contextData.currencySymbol}) et les modes de paiement acceptés en ${contextData.countryName} ?`,
      getDynamicAnswer: (ctx) => ({
        summary: `Nos devis et contrats sont libellés directement en devises locales (${ctx.currencyCode}) ou internationales (EUR, USD) avec paiement échelonné par Sprints validés.`,
        paragraphs: [
          `Pour les clients et entreprises en ${ctx.countryName} (${ctx.countryFlag}), vous pouvez régler vos prestations via les méthodes suivantes : ${ctx.paymentMethods.join(', ')}.`,
          `Grille tarifaire indicative : Cadrage technique & MVP dès ${ctx.mvpPrice}, TMA mensuelle dès ${ctx.sprintPrice}/mois. Chaque projet est réglé par jalons transparents : 30% d’acompte au démarrage, versements intermédiaires conditionnés à la validation des démos en staging, et solde de 20% à la livraison du code source.`,
          `Chaque paiement donne lieu à l’émission d’une facture commerciale certifiée conforme : "${ctx.taxInfo}".`
        ],
        highlights: [
          { label: 'Devise Active', value: `${ctx.currencyCode} (${ctx.currencySymbol})` },
          { label: 'Paiement local', value: ctx.paymentMethods.slice(0, 3).join(' • ') },
          { label: 'Échelonnement', value: '30% / 50% / 20% par Sprint' },
          { label: 'Cadrage initial', value: '100% Gratuit & Sans engagement' }
        ],
        tags: [ctx.currencyCode, ctx.countryName, 'Mobile Money', 'Facturation par Sprints', 'Virement SWIFT/SEPA'],
        actionCta: {
          label: `Convertir & Simuler en ${ctx.currencyCode}`,
          icon: Coins,
          actionType: 'converter'
        }
      })
    },

    // 8. PROPRIÉTÉ INTELLECTUELLE, CESSION DU CODE & NDA
    {
      id: 'faq-ip-context',
      category: 'ip-legal',
      categoryLabel: 'Propriété & Juridique',
      serviceBadge: 'Garantie Juridique Totale',
      icon: Scale,
      isContextual: true,
      question: 'Qui détient la propriété intellectuelle du code source et signez-vous un accord de confidentialité (NDA) ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Vous devenez le propriétaire exclusif à 100% de l’intégralité du code source, des dépôts Git, des maquettes et des assets dès le règlement final.',
        paragraphs: [
          'Tous nos contrats intègrent une clause formelle de cession intégrale, irréversible et sans réserve de l’ensemble des droits patrimoniaux d’auteur et de propriété intellectuelle.',
          `Avant le moindre échange sur votre cahier des charges, nous signons systématiquement un Accord de Non-Divulgation (NDA) bilatéral strict. Pour vos contrats avec V&I Tech, la juridiction de référence compétente est : ${ctx.ndaJurisdiction}.`,
          'À la livraison, les dépôts privés GitHub/GitLab, les clés d’accès aux serveurs de production et toutes les documentations techniques vous sont intégralement transférés.'
        ],
        highlights: [
          { label: 'Propriété du Code', value: '100% Client (Cession totale irréversible)' },
          { label: 'Confidentialité', value: 'NDA Bilatéral préalable obligatoire' },
          { label: 'Accès Git', value: 'Dépôts GitHub/GitLab Privés transférés' },
          { label: 'Juridiction légale', value: ctx.ndaJurisdiction }
        ],
        tags: ['Cession 100% Code', 'NDA Bilatéral', 'Dépôt Git Privé', 'Droit OHADA / International'],
        actionCta: {
          label: 'Demander un modèle de NDA',
          icon: ShieldCheck,
          actionType: 'chat'
        }
      })
    },

    // 9. MÉTHODOLOGIE AGILE, SPRINTS & SLA POST-LANCEMENT
    {
      id: 'faq-method-sla',
      category: 'method-sla',
      categoryLabel: 'Méthodologie & SLA',
      serviceBadge: 'Cadence & Qualité Certifiée',
      icon: Clock,
      question: 'Quelle est votre méthodologie de suivi de projet et quelles garanties offrez-vous après la mise en production ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Nous appliquons la méthodologie Agile Scrum avec des sprints de 14 jours, un portail client dédié en temps réel et une garantie corrective de 6 mois incluse.',
        paragraphs: [
          'Chaque client dispose d’un accès 24/7 à son Portail Client V&I Tech pour suivre le tableau Kanban des tâches, valider les jalons, tester les versions sur serveur de staging et échanger en continu avec le Lead Developer.',
          'Garantie & SLA : Tout projet bénéficie d’une garantie corrective de 6 mois sans surcoût post-lancement. Pour les environnements critiques, nous proposons des contrats de Tierce Maintenance Applicative (TMA) avec astreinte technique 24/7 et garantie de temps de rétablissement (GTR < 1h pour incidents bloquants).'
        ],
        highlights: [
          { label: 'Cycle de développement', value: 'Sprints Agile Scrum de 2 semaines' },
          { label: 'Garantie incluse', value: '6 Mois de maintenance corrective sans surcoût' },
          { label: 'Disponibilité SLA', value: '99.99% d’Uptime garanti' },
          { label: 'Suivi transparent', value: 'Portail Client & Staging bimensuel' }
        ],
        tags: ['Agile Scrum', 'Sprints 2 semaines', 'Garantie 6 mois', 'SLA 99.99%', 'Portail Client'],
        actionCta: {
          label: 'Prendre RDV avec un Lead Architecte',
          icon: Calendar,
          actionType: 'schedule'
        }
      })
    },

    // 10. CATALOGUE DE SCRIPTS & MODULES PRÊTS À L'EMPLOI
    {
      id: 'faq-scripts-store',
      category: 'scripts-store',
      categoryLabel: 'Scripts & Marketplace',
      serviceBadge: 'Accélérateur Technique',
      icon: FileCode,
      question: 'Que propose votre Catalogue de Scripts & Composants prêts à l’emploi pour développeurs et entreprises ?',
      getDynamicAnswer: (ctx) => ({
        summary: 'Notre catalogue rassemble des composants logiciels autonomes, des passerelles de paiement panafricaines et des modèles C# / React prêts à intégrer en quelques minutes.',
        paragraphs: [
          'Pour accélérer vos déploiements sans réinventer la roue, nous mettons à disposition des modules testés et documentés : passerelles Mobile Money (Wave, Orange Money, MTN MoMo), modules d’authentification biométrique, connecteurs d’imprimantes thermiques ESC/POS pour C# WPF, et templates SaaS complets.',
          'Chaque script est fourni avec son code source complet, sa documentation pas-à-pas et bénéficie de mises à jour gratuites pendant 12 mois.'
        ],
        highlights: [
          { label: 'Disponibilité', value: 'Téléchargement instantané du code source' },
          { label: 'Documentation', value: 'Guide d’installation & exemples concrets' },
          { label: 'Compatibilité', value: 'React, Node.js, Flutter, C# .NET' },
          { label: 'Support technique', value: 'Assistance par nos ingénieurs incluse' }
        ],
        tags: ['Marketplace Scripts', 'Passerelle Wave/Orange/MTN', 'Module C# POS', 'Code Source Prêt'],
        actionCta: {
          label: 'Explorer le Catalogue de Scripts',
          icon: FileCode,
          actionType: 'scripts'
        }
      })
    }
  ], [contextData]);

  // Categories config for filters
  const categories = useMemo(() => [
    { id: 'all', label: 'Toutes les Questions', count: faqItems.length },
    { id: 'web-saas', label: 'Web & SaaS', count: faqItems.filter(i => i.category === 'web-saas').length },
    { id: 'mobile', label: 'Applications Mobiles', count: faqItems.filter(i => i.category === 'mobile').length },
    { id: 'csharp-desktop', label: 'C# .NET & Desktop', count: faqItems.filter(i => i.category === 'csharp-desktop').length },
    { id: 'cloud-devops', label: 'Cloud & DevOps', count: faqItems.filter(i => i.category === 'cloud-devops').length },
    { id: 'ai-automation', label: 'IA & Automatisation', count: faqItems.filter(i => i.category === 'ai-automation').length },
    { id: 'cybersecurity', label: 'Cybersécurité', count: faqItems.filter(i => i.category === 'cybersecurity').length },
    { id: 'pricing-payment', label: `Tarifs & ${contextData.currencyCode}`, count: faqItems.filter(i => i.category === 'pricing-payment').length },
    { id: 'ip-legal', label: 'Propriété & NDA', count: faqItems.filter(i => i.category === 'ip-legal').length },
    { id: 'method-sla', label: 'Méthode & SLA', count: faqItems.filter(i => i.category === 'method-sla').length },
    { id: 'scripts-store', label: 'Scripts & Modules', count: faqItems.filter(i => i.category === 'scripts-store').length },
  ], [faqItems, contextData.currencyCode]);

  // Real-time search and category filtering
  const filteredFaqs = useMemo(() => {
    return faqItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const answerObj = item.getDynamicAnswer(contextData);

      const inQuestion = item.question.toLowerCase().includes(query);
      const inSummary = answerObj.summary.toLowerCase().includes(query);
      const inParagraphs = answerObj.paragraphs.some(p => p.toLowerCase().includes(query));
      const inTags = answerObj.tags.some(t => t.toLowerCase().includes(query));
      const inCat = item.categoryLabel.toLowerCase().includes(query);
      const inBadge = (item.serviceBadge || '').toLowerCase().includes(query);

      return inQuestion || inSummary || inParagraphs || inTags || inCat || inBadge;
    });
  }, [faqItems, activeCategory, searchQuery, contextData]);

  return (
    <section id="faq" className={`py-20 bg-slate-950 text-slate-100 relative border-t border-slate-800/80 overflow-hidden ${className}`}>
      
      {/* Decorative ambient glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================
            SECTION HEADER & DYNAMIC CONTEXT PILL
        ======================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-black uppercase tracking-wider shadow-sm">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>{t('faq.badge', 'Centre de Connaissances & Transparence')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Questions Fréquentes sur nos <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Services &amp; Architectures
            </span>
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t('faq.subtitle', 'Propriété du code à 100%, modalités de paiement en devises locales, méthodologie Agile Scrum et garanties contractuelles : des réponses directes et sans ambiguïté.')}
          </p>

          {/* DYNAMIC CONTEXTUAL BANNER BAR */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-md shadow-lg shadow-black/40">
              
              {/* Context Tag: Country */}
              <button
                onClick={openCountryModal}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition hover:border-cyan-500/50 cursor-pointer group"
                title="Modifier le pays détecté"
              >
                <span className="text-base">{contextData.countryFlag}</span>
                <span>{contextData.countryName}</span>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  {contextData.hubCity}
                </span>
                <RefreshCw className="w-3 h-3 text-slate-400 group-hover:rotate-180 transition-transform duration-500 ml-0.5" />
              </button>

              {/* Context Tag: Currency */}
              <button
                onClick={() => openConverterModal(2500)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-bold text-slate-200 transition hover:border-emerald-500/50 cursor-pointer group"
                title="Convertir les prix"
              >
                <Coins className="w-3.5 h-3.5 text-emerald-400" />
                <span>Devise : <strong className="text-emerald-300">{contextData.currencyCode}</strong> ({contextData.currencySymbol})</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                  Taux Live
                </span>
              </button>

              {/* Context Tag: Legal / NDA */}
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="text-[11px]">Cession 100% &amp; NDA Garanti</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            SEARCH & CONTROLS TOOLBAR
        ======================================================== */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          
          <div className="flex flex-col sm:flex-row items-center gap-3">
            
            {/* Interactive Real-Time Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`Rechercher une question (ex: ${contextData.currencyCode}, Flutter, C# WPF, propriété du code, délais, Mobile Money)...`}
                className="w-full bg-slate-900/90 border border-slate-700 hover:border-slate-600 focus:border-cyan-400 rounded-2xl py-3 pl-11 pr-10 text-xs sm:text-sm text-white placeholder-slate-400 shadow-md focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded-md transition cursor-pointer"
                >
                  Effacer
                </button>
              )}
            </div>

            {/* Bulk Expand / Collapse Controls */}
            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={handleExpandAll}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer shadow-sm"
                title="Tout déplier"
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Tout déplier</span>
              </button>

              <button
                onClick={handleCollapseAll}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 text-xs font-bold text-slate-300 hover:text-white transition cursor-pointer shadow-sm"
                title="Tout replier"
              >
                <Minimize2 className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">Tout replier</span>
              </button>
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2 pt-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
                    ${isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-1 ring-blue-400'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                    }
                  `}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive ? 'bg-blue-800/80 text-blue-100' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================
            DYNAMIC FAQ ACCORDION LIST WITH MOTION ANIMATIONS
        ======================================================== */}
        <div className="max-w-4xl mx-auto space-y-3.5">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = !!openItems[faq.id];
              const Icon = faq.icon;
              const answer = faq.getDynamicAnswer(contextData);
              const vote = helpfulVotes[faq.id];

              return (
                <motion.div
                  key={faq.id}
                  layout
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className={`
                    rounded-2xl border transition-all duration-300 overflow-hidden backdrop-blur-md
                    ${isOpen 
                      ? 'border-cyan-500/50 bg-slate-900/95 shadow-xl shadow-cyan-950/20 ring-1 ring-cyan-500/30' 
                      : 'border-slate-800/90 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80'
                    }
                  `}
                >
                  {/* ACCORDION HEADER BUTTON */}
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none select-none group"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-start gap-3.5 sm:gap-4 min-w-0">
                      
                      {/* Icon Box */}
                      <div className={`
                        flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300
                        ${isOpen 
                          ? 'border-cyan-500/40 bg-cyan-500/20 text-cyan-300 shadow-md shadow-cyan-500/10' 
                          : 'border-slate-700 bg-slate-800/80 text-slate-400 group-hover:border-slate-600 group-hover:text-slate-200'
                        }
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>

                      {/* Question Content */}
                      <div className="space-y-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                            {faq.categoryLabel}
                          </span>
                          {faq.serviceBadge && (
                            <span className="text-[10px] font-semibold text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/30">
                              {faq.serviceBadge}
                            </span>
                          )}
                          {faq.isContextual && (
                            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                              <span>{contextData.countryFlag}</span>
                              <span>Personnalisé</span>
                            </span>
                          )}
                        </div>

                        <h3 className={`text-sm sm:text-base font-bold transition-colors leading-snug ${
                          isOpen ? 'text-white' : 'text-slate-200 group-hover:text-cyan-300'
                        }`}>
                          {faq.question}
                        </h3>
                      </div>
                    </div>

                    {/* Chevron Toggle Pill */}
                    <div className={`
                      p-2 rounded-xl shrink-0 transition-all duration-300
                      ${isOpen 
                        ? 'bg-cyan-500/20 text-cyan-300 rotate-180 border border-cyan-500/40' 
                        : 'bg-slate-800 text-slate-400 border border-slate-700 group-hover:border-slate-600 group-hover:text-white'
                      }
                    `}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {/* ACCORDION EXPANDABLE BODY WITH FLUID MOTION */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ 
                          height: 'auto', 
                          opacity: 1,
                          transition: {
                            height: { duration: 0.35, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.25, delay: 0.05 }
                          }
                        }}
                        exit={{ 
                          height: 0, 
                          opacity: 0,
                          transition: {
                            height: { duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.15 }
                          }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/80 space-y-4">
                          
                          {/* Key Takeaway / Executive Summary */}
                          <div className="mt-3 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-xs font-semibold flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{answer.summary}</span>
                          </div>

                          {/* Paragraphs */}
                          <div className="space-y-2.5 text-slate-300 leading-relaxed">
                            {answer.paragraphs.map((p, idx) => (
                              <p key={idx}>{p}</p>
                            ))}
                          </div>

                          {/* Highlights Grid */}
                          {answer.highlights && answer.highlights.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                              {answer.highlights.map((h, hIdx) => (
                                <div 
                                  key={hIdx} 
                                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-2"
                                >
                                  <span className="text-[11px] font-medium text-slate-400">{h.label}</span>
                                  <span className="text-xs font-bold text-emerald-400 text-right">{h.value}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Interactive In-Answer Action CTA (if available) */}
                          {answer.actionCta && (
                            <div className="pt-2">
                              <button
                                onClick={() => answer.actionCta && handleCtaAction(answer.actionCta)}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                              >
                                {answer.actionCta.icon && <answer.actionCta.icon className="w-3.5 h-3.5" />}
                                <span>{answer.actionCta.label}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}

                          {/* Footer Tag Cloud & Helpful Rating Feedback */}
                          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            
                            {/* Tags */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {answer.tags.map((tag, tIdx) => (
                                <span
                                  key={tIdx}
                                  className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-slate-800/80 text-slate-300 border border-slate-700"
                                >
                                  ✓ {tag}
                                </span>
                              ))}
                            </div>

                            {/* Helpful Feedback Widget */}
                            <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
                              <span className="text-[11px]">Cette réponse vous a-t-elle aidé ?</span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={(e) => handleVote(faq.id, 'up', e)}
                                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                    vote === 'up' 
                                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-emerald-400'
                                  }`}
                                  title="Oui, utile"
                                >
                                  <ThumbsUp className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={(e) => handleVote(faq.id, 'down', e)}
                                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                                    vote === 'down' 
                                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-rose-400'
                                  }`}
                                  title="Non, pas assez précis"
                                >
                                  <ThumbsDown className="w-3 h-3" />
                                </button>
                              </div>
                              {vote && (
                                <span className="text-[10px] font-bold text-emerald-400 animate-in fade-in">
                                  Merci !
                                </span>
                              )}
                            </div>

                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="bg-slate-900/60 rounded-3xl p-10 border border-slate-800 text-center space-y-4 backdrop-blur-md">
              <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Aucune question ne correspond à votre recherche</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Aucun résultat pour « {searchQuery} » dans cette catégorie. Essayez d'autres mots-clés ou posez votre question directement à nos architectes logiciels.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer transition"
                >
                  Réinitialiser les filtres
                </button>
                <button
                  onClick={onOpenChat}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-md shadow-blue-600/30 cursor-pointer transition"
                >
                  Poser ma question en direct
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            BOTTOM DIRECT FAST ASSISTANCE CTA CARD
        ======================================================== */}
        <div className="mt-14 max-w-4xl mx-auto rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950/60 p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            
            <div className="space-y-2.5 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Support &amp; Cadrage Live</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white">
                Une question technique spécifique sur votre projet ?
              </h4>

              <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                Nos directeurs techniques et lead developers analysent votre cahier des charges et répondent en direct sur WhatsApp ou par Live Chat.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={onOpenChat}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ouvrir le Live Chat</span>
              </button>

              <button
                onClick={() => {
                  if (onOpenScheduleModal) {
                    const matchedHub = techHubs.find(h => h.city.toLowerCase().includes(contextData.hubCity.toLowerCase()));
                    onOpenScheduleModal(matchedHub);
                  }
                }}
                className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span>Réserver un Appel 30 min</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
