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
  ExternalLink,
  MapPin,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTranslation } from '../context/LanguageContext';
import { useCurrency } from '../context/CurrencyContext';
import { useCountry } from '../context/CountryContext';
import { useSiteData } from '../context/SiteDataContext';
import { OfficeHub } from '../types';

interface FaqItem {
  id: string;
  category: 'all' | 'pricing' | 'payment' | 'dev' | 'ip' | 'method' | 'sla' | 'ai';
  categoryLabel: string;
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
  }) => {
    summary: string;
    paragraphs: string[];
    highlights?: { label: string; value: string }[];
    tags: string[];
    actionCta?: {
      label: string;
      icon?: React.ElementType;
      actionType: 'converter' | 'country' | 'estimator' | 'chat' | 'schedule';
    };
  };
}

interface FaqSectionProps {
  onOpenChat?: () => void;
  onOpenEstimator?: () => void;
  onOpenScheduleModal?: (hub?: OfficeHub) => void;
  onNavigateToView?: (viewId: string) => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({
  onOpenChat,
  onOpenEstimator,
  onOpenScheduleModal,
  onNavigateToView,
}) => {
  const { t } = useTranslation();
  const { currencyOption, openConverterModal, formatCurrency } = useCurrency();
  const { currentCountry, openCountryModal } = useCountry();
  const { companyInfo, techHubs } = useSiteData();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-pricing-context': true,
    'faq-payment-context': true,
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

  const handleCtaAction = (actionType: 'converter' | 'country' | 'estimator' | 'chat' | 'schedule') => {
    switch (actionType) {
      case 'converter':
        openConverterModal(2500);
        break;
      case 'country':
        openCountryModal();
        break;
      case 'estimator':
        if (onOpenEstimator) onOpenEstimator();
        else if (onNavigateToView) onNavigateToView('estimator');
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
    }
  };

  const faqItems: FaqItem[] = [
    {
      id: 'faq-pricing-context',
      category: 'pricing',
      categoryLabel: 'Tarification & Devises',
      icon: Coins,
      isContextual: true,
      question: `Quels sont les tarifs, forfaits et modalités de facturation en ${contextData.currencyCode} (${contextData.currencySymbol}) pour un projet en ${contextData.countryName} ?`,
      getDynamicAnswer: (ctx) => ({
        summary: `Nos devis et contrats sont libellés directement dans votre devise locale (${ctx.currencyName} - ${ctx.currencyCode}) avec une politique tarifaire claire et échelonnée par sprints validés.`,
        paragraphs: [
          `Pour vos projets en ${ctx.countryName} (${ctx.countryFlag}), nous adaptons la grille tarifaire à l'écosystème local. Un cadrage technique et MVP démarre généralement à partir de ${ctx.mvpPrice}, incluant l'architecture logicielle, le design UI/UX, le développement complet et le déploiement.`,
          `Le règlement s'effectue en toute sécurité par jalons techniques : 30% d'acompte au cadrage, des versements intermédiaires conditionnés à la validation des démos bimensuelles en direct sur serveur de staging, et le solde de 20% à la livraison finale du code source.`,
          `Les forfaits de Tierce Maintenance Applicative (TMA) et astreinte débutent à environ ${ctx.sprintPrice}/mois selon le périmètre applicatif.`
        ],
        highlights: [
          { label: `Devise Active`, value: `${ctx.currencyCode} (${ctx.currencySymbol})` },
          { label: `Tarif MVP indicatif`, value: `Dès ${ctx.mvpPrice}` },
          { label: `Échelonnement`, value: `30% / 50% / 20% par Sprint` },
          { label: `Cadrage initial`, value: `100% Gratuit & Sans engagement` }
        ],
        tags: [ctx.currencyCode, ctx.countryName, 'Facturation par Sprints', 'Sans frais cachés'],
        actionCta: {
          label: `Convertir & Simuler en ${ctx.currencyCode}`,
          icon: Coins,
          actionType: 'converter'
        }
      })
    },
    {
      id: 'faq-payment-context',
      category: 'payment',
      categoryLabel: 'Moyens de Paiement Locaux',
      icon: CreditCard,
      isContextual: true,
      question: `Quelles passerelles et moyens de paiement sont supportés pour ${ctxFallback => ctxFallback.countryName} (${contextData.countryFlag}) ?`,
      getDynamicAnswer: (ctx) => ({
        summary: `Nous acceptons l'ensemble des moyens de paiement institutionnels et mobiles opérant en ${ctx.countryName}.`,
        paragraphs: [
          `Pour vos règlements en ${ctx.countryName} (${ctx.countryFlag}), vous pouvez utiliser les méthodes suivantes : ${ctx.paymentMethods.join(', ')}.`,
          `Nous prenons également en charge les virements bancaires internationaux (SWIFT / SEPA), les virements bancaires régionaux ainsi que les cartes bancaires internationales (Visa, Mastercard, American Express).`,
          `Chaque transaction génère une facture commerciale certifiée avec mentions légales : "${ctx.taxInfo}".`
        ],
        highlights: [
          { label: `Moyens locaux`, value: ctx.paymentMethods.slice(0, 3).join(' • ') },
          { label: `Sécurité`, value: `Chiffrement bancaire TLS 1.3 & PCI-DSS` },
          { label: `Conformité Fiscale`, value: ctx.taxInfo.split('(')[0] }
        ],
        tags: [...ctx.paymentMethods.slice(0, 3), 'Mobile Money', 'Virement SWIFT/SEPA'],
        actionCta: {
          label: `Changer de pays / Hub régional`,
          icon: Globe2,
          actionType: 'country'
        }
      })
    },
    {
      id: 'faq-ip-context',
      category: 'ip',
      categoryLabel: 'Propriété Intellectuelle & Juridiction',
      icon: Scale,
      isContextual: true,
      question: `Qui possède la propriété intellectuelle du code et quelle est la juridiction légale compétente ?`,
      getDynamicAnswer: (ctx) => ({
        summary: `Vous êtes le propriétaire exclusif à 100% de l'intégralité du code source, des designs et des assets dès la livraison.`,
        paragraphs: [
          `Nos contrats prévoient une clause de cession intégrale, exclusive et sans réserve de tous les droits de propriété intellectuelle et droits d'auteur afférents au projet. À la livraison finale, l'ensemble des dépôts Git privés (GitHub/GitLab), clés de chiffrement et documentations d'architecture vous sont intégralement transférés.`,
          `Avant tout échange confidentiel ou transmission de cahier des charges, nous signons un Accord de Non-Divulgation (NDA) bilatéral strict. Pour vos contrats, la juridiction de référence est : ${ctx.ndaJurisdiction}.`
        ],
        highlights: [
          { label: `Propriété du Code`, value: `100% Client (Cession totale)` },
          { label: `Accord préalable`, value: `NDA Bilatéral signé` },
          { label: `Juridiction contractuelle`, value: ctx.ndaJurisdiction }
        ],
        tags: ['Cession 100%', 'NDA Bilatéral', 'Dépôt Git Privé', 'Propriété Exclusive'],
        actionCta: {
          label: `Demander notre modèle de NDA`,
          icon: ShieldCheck,
          actionType: 'chat'
        }
      })
    },
    {
      id: 'faq-hub-presence',
      category: 'method',
      categoryLabel: 'Présence Locale & Hubs R&D',
      icon: MapPin,
      isContextual: true,
      question: `Où sont situés vos ingénieurs et comment s'organise l'accompagnement pour ${contextData.countryName} ?`,
      getDynamicAnswer: (ctx) => ({
        summary: `Vous bénéficiez d'une équipe dédiée opérant depuis notre réseau panafricain avec ancrage local via notre ${ctx.localHub}.`,
        paragraphs: [
          `Pour les clients et partenaires basés en ${ctx.countryName} (${ctx.countryFlag}), le suivi de votre projet est coordonné par les architectes de notre ${ctx.localHub} et nos centres d'excellence (Kigali, Dakar, Abidjan, Douala, Casablanca, Paris).`,
          `Nous combinons la proximité relationnelle d'ingénieurs basés sur votre fuseau horaire avec la puissance de frappe de nos pôles de R&D spécialisés en Cloud, Mobile et Intelligence Artificielle. Vous pouvez organiser des ateliers de cadrage en visioconférence ou en présentiel selon vos besoins.`
        ],
        highlights: [
          { label: `Hub Régional`, value: ctx.localHub },
          { label: `Fuseau Horaire`, value: `Temps réel (GMT / GMT+1 / GMT+2)` },
          { label: `Temps de réponse`, value: `< 15 min en astreinte technique` }
        ],
        tags: [ctx.localHub, 'Fuseau aligné', 'Ateliers Présentiel/Visio', 'Support 24/7'],
        actionCta: {
          label: `Prendre RDV avec un Lead Architecte`,
          icon: Calendar,
          actionType: 'schedule'
        }
      })
    },
    {
      id: 'faq-tech-stack',
      category: 'dev',
      categoryLabel: 'Technologies & Architecture',
      icon: Code2,
      question: `Quelles sont les technologies et architectures logicielles utilisées par V&I Tech ?`,
      getDynamicAnswer: () => ({
        summary: `Nous développons exclusivement sur des technologies modernes, pérennes, hautement scalables et sécurisées.`,
        paragraphs: [
          `Frontend & Web : React 19, Next.js 15, TypeScript, Tailwind CSS, architectures Jamstack et Progressive Web Apps (PWA).`,
          `Mobile Multiplateforme : Flutter et React Native avec synchronisation en mode Offline-First (idéal pour les environnements réseau à connectivité variable).`,
          `Backend & APIs : Node.js (NestJS/Express), Python (FastAPI, Django), Go pour les microservices à haute fréquence. Bases de données PostgreSQL, Redis, Firestore et solutions d'indexation vectorielle (Pinecone, pgvector).`,
          `Cloud & DevOps : Architectures serverless et conteneurisées Kubernetes/Docker déployées sur Google Cloud Platform (GCP), AWS ou serveurs souverains sécurisés.`
        ],
        highlights: [
          { label: `Mobile`, value: `Flutter & React Native (Offline-First)` },
          { label: `Web & SaaS`, value: `Next.js 15 / React 19 / TypeScript` },
          { label: `Backend`, value: `NestJS / FastAPI / PostgreSQL / Redis` },
          { label: `Cloud`, value: `GCP / AWS / Docker / Kubernetes` }
        ],
        tags: ['Next.js 15', 'Flutter', 'TypeScript', 'PostgreSQL', 'Docker', 'GCP / AWS'],
        actionCta: {
          label: `Consulter notre catalogue de services`,
          icon: Layers,
          actionType: 'estimator'
        }
      })
    },
    {
      id: 'faq-method-delais',
      category: 'method',
      categoryLabel: 'Méthodologie & Délais de Livraison',
      icon: Clock,
      question: `Quelle est votre méthode de gestion de projet et quels sont les délais moyens de livraison ?`,
      getDynamicAnswer: () => ({
        summary: `Nous appliquons la méthodologie Agile Scrum avec des sprints de 2 semaines et des livraisons continues.`,
        paragraphs: [
          `Chaque projet est découpé en Sprints itératifs de 14 jours. Vous disposez d'un accès personnel à votre Portail Client 24/7 avec tableau Kanban interactif, suivi des jalons en temps réel, accès direct aux versions de staging et démonstrations régulières.`,
          `Délais indicatifs : Un MVP (Produit Minimum Viable) fonctionnel est généralement livré en 4 à 8 semaines. Les plateformes d'entreprise ou architectures SaaS complexes nécessitent entre 8 et 16 semaines.`
        ],
        highlights: [
          { label: `Cadence`, value: `Sprints Agile de 2 semaines` },
          { label: `MVP Rapide`, value: `4 à 8 semaines clés en main` },
          { label: `Transparence`, value: `Portail Client & Staging 24/7` }
        ],
        tags: ['Agile Scrum', 'Sprints 2 semaines', 'Staging continu', 'Portail Dédié']
      })
    },
    {
      id: 'faq-ai-automation',
      category: 'ai',
      categoryLabel: 'Intelligence Artificielle & Automatisation',
      icon: Cpu,
      question: `Comment intégrez-vous l'Intelligence Artificielle générative et l'automatisation dans nos applications ?`,
      getDynamicAnswer: () => ({
        summary: `Nous concevons des solutions d'IA sur-mesure combinant modèles de langage (LLMs), RAG et vision par ordinateur.`,
        paragraphs: [
          `Nos ingénieurs intègrent les modèles de pointe (Google Gemini 2.5/Flash, OpenAI GPT-4o, Claude 3.5, Mistral AI) connectés à vos propres bases de connaissances grâce à des architectures RAG (Retrieval-Augmented Generation) hautement sécurisées.`,
          `Cas d'usage concrets : Assistants conversationnels multilingues adaptés aux dialectes africains (Français, Anglais, Wolof, Swahili, Arabe), OCR intelligent de pièces d'identité et factures, scoring prédictif de crédit, analyse automatisée de documents juridiques et moteurs de recommandation e-commerce.`
        ],
        highlights: [
          { label: `Modèles IA`, value: `Google Gemini / GPT-4o / Claude 3.5 / Mistral` },
          { label: `Architecture`, value: `RAG Vectoriel sécurisé & Local` },
          { label: `Multilingue`, value: `Français, Anglais, Wolof, Swahili, Arabe` }
        ],
        tags: ['Gemini AI', 'RAG & Vecteurs', 'OCR & Vision', 'Chatbots Métiers']
      })
    },
    {
      id: 'faq-sla-garantie',
      category: 'sla',
      categoryLabel: 'Garantie & Support Post-Lancement',
      icon: ShieldCheck,
      question: `Quels engagements de service (SLA) et garanties offrez-vous après la mise en production ?`,
      getDynamicAnswer: () => ({
        summary: `Tout projet livré bénéficie contractuellement d'une garantie corrective de 3 à 6 mois et d'un SLA jusqu'à 99.99%.`,
        paragraphs: [
          `Durant la période de garantie, toute anomalie ou bug technique est corrigé immédiatement et sans surcoût par nos équipes.`,
          `Au-delà, nos contrats de Tierce Maintenance Applicative (TMA) incluent le monitoring d'infrastructure 24h/24 et 7j/7, la gestion proactive des mises à jour de sécurité (correctifs OWASP), les sauvegardes automatiques journalières géodistribuées et une astreinte d'ingénieurs avec un temps de réponse garanti (GTR < 1h pour incidents critiques).`
        ],
        highlights: [
          { label: `Garantie Incluse`, value: `3 à 6 mois de garantie intégrale` },
          { label: `Disponibilité SLA`, value: `Jusqu'à 99.99% d'Uptime garanti` },
          { label: `Temps de Réaction`, value: `< 1h sur incidents critiques` }
        ],
        tags: ['Garantie 6 mois', 'SLA 99.99%', 'Monitoring 24/7', 'TMA Proactive']
      })
    }
  ];

  const categories = [
    { id: 'all', label: 'Toutes les Questions', count: faqItems.length },
    { id: 'pricing', label: `Tarifs & ${contextData.currencyCode}`, count: faqItems.filter(i => i.category === 'pricing').length },
    { id: 'payment', label: `Paiements ${contextData.countryName}`, count: faqItems.filter(i => i.category === 'payment').length },
    { id: 'ip', label: 'Propriété & Juridique', count: faqItems.filter(i => i.category === 'ip').length },
    { id: 'dev', label: 'Technologies & Stacks', count: faqItems.filter(i => i.category === 'dev').length },
    { id: 'method', label: 'Méthodologie & Délais', count: faqItems.filter(i => i.category === 'method').length },
    { id: 'ai', label: 'IA & Automatisation', count: faqItems.filter(i => i.category === 'ai').length },
    { id: 'sla', label: 'Garanties & SLA', count: faqItems.filter(i => i.category === 'sla').length },
  ];

  const filteredFaqs = useMemo(() => {
    return faqItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const query = searchQuery.toLowerCase();
      const questionText = typeof item.question === 'function' ? (item.question as any)(contextData) : item.question;
      const answerObj = item.getDynamicAnswer(contextData);

      const inQuestion = questionText.toLowerCase().includes(query);
      const inSummary = answerObj.summary.toLowerCase().includes(query);
      const inParagraphs = answerObj.paragraphs.some(p => p.toLowerCase().includes(query));
      const inTags = answerObj.tags.some(t => t.toLowerCase().includes(query));
      const inCat = item.categoryLabel.toLowerCase().includes(query);

      return inQuestion || inSummary || inParagraphs || inTags || inCat;
    });
  }, [faqItems, activeCategory, searchQuery, contextData]);

  return (
    <section id="faq" className="py-24 bg-slate-950 text-slate-100 relative border-t border-slate-800/80 overflow-hidden">
      
      {/* Dynamic Background Light Effects */}
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

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            {t('faq.title', 'Tout Ce Que Vous Devez Savoir')}
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t('faq.subtitle', 'Propriété du code à 100%, modalités de paiement en devises locales, méthodologie Agile Scrum et garanties contractuelles : des réponses claires adaptées à votre contexte.')}
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
                <span className="text-[11px]">NDA & Cession 100% Garantie</span>
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
                placeholder={`Rechercher une question (ex: ${contextData.currencyCode}, propriété du code, délais, Mobile Money)...`}
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
                    flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer
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
                                onClick={() => answer.actionCta && handleCtaAction(answer.actionCta.actionType)}
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
                <span>Support & Architecture Live</span>
              </div>

              <h4 className="text-xl sm:text-2xl font-black text-white">
                Une question technique non listée sur votre projet ?
              </h4>

              <p className="text-xs sm:text-sm text-slate-400 max-w-lg leading-relaxed">
                Nos directeurs techniques et lead developers analysent votre cahier des charges et répondent en moins de 15 minutes sur WhatsApp ou par Live Chat.
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
