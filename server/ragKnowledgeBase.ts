// ============================================================================
// V&I TECH AFRICA LTD - Knowledge Base & RAG Retrieval Engine
// Enterprise Knowledge Base for Grounded LLM Assistant
// ============================================================================

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'services' | 'pricing' | 'company' | 'security' | 'offices' | 'faq' | 'guarantees' | 'stack';
  tags: string[];
  content: string;
  lastUpdated: string;
  isOfficial: boolean;
}

export interface ChatLogEntry {
  id: string;
  timestamp: string;
  userMessage: string;
  botReply: string;
  sourcesUsed: string[];
  ipHash?: string;
  escalatedToHuman: boolean;
  languageDetected?: string;
  model: string;
}

// Initial Official Company Knowledge Base (Source of Truth)
export const OFFICIAL_KNOWLEDGE_DOCS: KnowledgeDocument[] = [
  {
    id: "vitech-overview",
    title: "Présentation Générale de V&I TECH AFRICA LTD",
    category: "company",
    tags: ["entreprise", "mission", "vision", "valeurs", "fondateur", "direction"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `V&I TECH AFRICA LTD (aussi appelée VITECH AFRICA) est une entreprise d'ingénierie logicielle et de transformation numérique de haute technologie.
Devise : "INNOVATE • DEVELOP • GROW"
Mission : Concevoir, développer et déployer des solutions technologiques de classe mondiale pour les entreprises, startups et gouvernements sur le continent africain et à l'international.
Directeur Général : Direction Générale V&I TECH AFRICA LTD (contact.vitechdev@gmail.com).
Téléphone officiel : +250 792 124 342
Ligne WhatsApp Direction : +250 795 507 001 (disponible Lun-Sam 08h00 - 20h00 GMT+2).
Email de contact : contact.vitechdev@gmail.com
Sièges & Hubs d'ingénierie :
- Kigali (Rwanda) : Norrsken House, KG 1 Roundabout
- Dakar (Sénégal) : Almadies Tech Hub, Route des Almadies
- Abidjan (Côte d'Ivoire) : Plateau Cyber Tower, Boulevard de la République
- Paris (France) : Station F, 5 Parvis Alan Turing
Chiffres clés : Plus de 140 projets livrés, présence dans 18 pays, SLA 99.99%, équipe de plus de 48 ingénieurs et architectes cloud certifiés.`
  },
  {
    id: "service-web-saas",
    title: "Service : Développement Web & Plateformes SaaS",
    category: "services",
    tags: ["web", "saas", "react", "nextjs", "nodejs", "python", "postgresql"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `Service Développement Web & SaaS sur-mesure par V&I TECH AFRICA LTD :
- Conception d'ERP d'entreprise, portails clients, marketplaces B2B/B2C et architectures SaaS multi-tenant.
- Technologies phares : React 19, Next.js 15, TypeScript, Tailwind CSS, Node.js (NestJS / Express), Python (FastAPI / Django), PostgreSQL, Redis, GraphQL.
- Caractéristiques : Rendu côté serveur (SSR), scores Core Web Vitals > 95/100, authentification multi-facteurs (MFA/RBAC), intégrations de passerelles de paiement panafricaines (Wave, Orange Money, MTN MoMo, Stripe, Paystack).
- Tarifs indicatifs : À partir de 2 500 € (ou équivalent en monnaie locale FCFA, RWF, MAD, USD).
- Délais moyens : 4 à 10 semaines selon la complexité.
- Livrables : Code source 100% cédé sous licence propriétaire, pipeline CI/CD automatisé, documentation OpenAPI/Swagger, 6 mois de garantie corrective incluse.`
  },
  {
    id: "service-mobile-apps",
    title: "Service : Applications Mobiles iOS & Android",
    category: "services",
    tags: ["mobile", "flutter", "react native", "ios", "android", "offline-first", "momo"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `Service Applications Mobiles Natives & Cross-Platform par V&I TECH AFRICA LTD :
- Développement d'applications mobiles haute performance avec Flutter 3 et React Native.
- Spécialité panafricaine : Architecture "Offline-First" (fonctionnement en zones à faible connectivité réseau avec synchronisation SQLite locale).
- Intégrations : Biométrie (FaceID / Empreinte), géolocalisation précise, push notifications (Firebase FCM), SDK de paiement Mobile Money.
- Tarifs indicatifs : À partir de 3 200 € (ou équivalent local).
- Délais moyens : 6 à 12 semaines.
- Livrables : Fichiers binaires signés (APK, AAB pour Google Play Store, IPA pour Apple App Store), code source documenté, tableau de bord de monitoring des crashs (Sentry), kit d'onboarding.`
  },
  {
    id: "service-cloud-devops",
    title: "Service : Cloud Architecture, DevOps & Infrastructure",
    category: "services",
    tags: ["cloud", "aws", "gcp", "azure", "docker", "kubernetes", "terraform", "ci-cd"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `Service Cloud Architecture & DevOps par V&I TECH AFRICA LTD :
- Conception d'infrastructures résilientes sur AWS (Amazon Web Services), Google Cloud Platform (GCP) et Microsoft Azure.
- Pratiques clés : Infrastructure as Code (Terraform), conteneurisation Docker & orchestration Kubernetes (EKS, GKE), pipelines CI/CD zero-downtime (GitHub Actions / GitLab CI).
- Haute Disponibilité : SLA contractuel à 99.99%, sauvegarde automatique multi-régions, équilibrage de charge dynamique et mise en cache Edge (Cloudflare CDN).
- Tarifs indicatifs : À partir de 1 800 € pour la mise en place ou l'audit d'infrastructure.
- Délais moyens : 2 à 6 semaines.`
  },
  {
    id: "service-ai-llm",
    title: "Service : Intelligence Artificielle, LLM & Automatisation",
    category: "services",
    tags: ["ia", "llm", "rag", "gemini", "chatbots", "machine learning", "computer vision"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `Service Intelligence Artificielle & Solutions LLM par V&I TECH AFRICA LTD :
- Intégration de modèles d'IA de dernière génération (Google Gemini, OpenAI GPT, Claude, Mistral) via des architectures d'entreprise sécurisées RAG (Retrieval-Augmented Generation).
- Domaines d'application : Chatbots assistants clients contextuels, analyse prédictive de données d'entreprise, reconnaissance optique de documents (OCR pour factures/pièces d'identité), vision par ordinateur.
- Sécurité : Aucune fuite de données d'entreprise vers des modèles publics, conformité RGPD, isolation stricte des bases vectorielles (Pinecone, ChromaDB, PGVector).
- Tarifs indicatifs : À partir de 2 900 €.
- Délais moyens : 4 à 8 semaines.`
  },
  {
    id: "service-cybersecurity",
    title: "Service : Cybersécurité, Pentesting & Conformité OWASP",
    category: "services",
    tags: ["securite", "pentest", "owasp", "audit", "iso27001", "vulnerabilites"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `Service Cybersécurité & Tests d'Intrusion (Pentest) par V&I TECH AFRICA LTD :
- Audits de sécurité exhaustifs conformes aux référentiels OWASP Top 10, SANS Top 25, et ISO 27001.
- Prestations : Tests d'intrusion boîte noire / grise / blanche (Web, Mobile, API, Réseau interne), analyse statique/dynamique du code (SAST/DAST), remédiation des failles.
- Livrable officiel : Rapport exécutif et rapport technique détaillé avec scoring CVSS v3.1, code snippets correctifs, et certificat de contre-visite attestant de la résolution des vulnérabilités.
- Tarifs indicatifs : À partir de 2 200 € selon le périmètre applicatif.`
  },
  {
    id: "guarantees-and-contracts",
    title: "Garanties Légales, SLA et Propriété Intellectuelle",
    category: "guarantees",
    tags: ["propriete intellectuelle", "garantie", "sla", "contrat", "nda", "confidentialite"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `Engagements et Garanties Officielles de V&I TECH AFRICA LTD :
1. Cession totale de Propriété Intellectuelle (100% IP) : Dès le règlement complet des factures, le client est propriétaire exclusif du code source, des designs, des algorithmes et des bases de données.
2. Garantie Corrective de 6 Mois : Tout bug ou anomalie technique non conforme au cahier des charges initial est corrigé gratuitement et en priorité pendant 6 mois suivant la livraison.
3. Accord de Confidentialité (NDA) Immédiat : Signature systématique d'un accord de non-divulgation avant même le début de l'analyse détaillée du projet.
4. Méthodologie Agile & Démos Quinzomadaires : Livraison par sprints de 2 semaines avec accès à un environnement de staging dédié pour tester l'avancement.
5. SLA Haute Disponibilité : Engagement de disponibilité serveur de 99.99% pour les infrastructures infogérées.`
  },
  {
    id: "pricing-estimator-faq",
    title: "Tarifs, Devis et Modalités de Paiement",
    category: "pricing",
    tags: ["prix", "devis", "modalites", "echeances", "facturation", "monnaies"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `Modalités Financières & Devis chez V&I TECH AFRICA LTD :
- Monnaies acceptées : EUR (€), USD ($), FCFA (XOF / XAF), RWF (Franc Rwandais), MAD (Dirham Marocain), GNF, GHS, KES.
- Échéancier standard des projets :
  * 40% à la signature du contrat et lancement du sprint de cadrage / design.
  * 30% à la validation du prototype interactif (MVP / version Beta sur staging).
  * 30% à la livraison finale, recette et mise en production.
- Moyens de paiement acceptés : Virement bancaire SWIFT/SEPA, cartes bancaires d'entreprise, Mobile Money d'entreprise (Wave Business, Orange Money Pro, MTN MoMo, M-Pesa).
- Facturation : Émission de factures proforma et factures officielles conformes aux normes fiscales locales (dont EBM au Rwanda et TVA selon localisation).`
  },
  {
    id: "international-pricing-world-bank-2026",
    title: "Grille Tarifaire Internationale 2026 (Normes Banque Mondiale)",
    category: "pricing",
    tags: ["grille", "tarifs", "banque mondiale", "rwanda", "rdc", "low income", "high income", "prix"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `GRILLE TARIFAIRE INTERNATIONALE 2026 (Basée sur les 4 Catégories Économiques de la Banque Mondiale) :

1. Marché Low-Income (Afrique & Pays à faible revenu : Rwanda, RDC, Burundi, Ouganda, etc.) :
- Logo Pro : $30 – $80
- Flyer / Poster : $15 – $50
- Carte de visite : $15 – $40
- Site Web Starter : $150 – $300
- Site Web Business Pro : $300 – $600
- E-commerce : $500 – $1,000
- Application Web SaaS : $700 – $2,000
- Logiciel sur-mesure Desktop : $800 – $3,000+
- Application Mobile iOS/Android : $800 – $3,500+
- Système de Gestion ERP : $700 – $3,000+
- UI/UX Design Figma : $100 – $500
- Marketing Digital : $100 – $500 / mois
- Nom de domaine + Hébergement : $50 – $150 / an
- Maintenance & Support : $50 – $300 / mois
- Intégration API & Mobile Money : $100 – $500+
- Solutions d'IA & RAG : $500 – $5,000+
- Cybersécurité : $200 – $2,000+

2. Marché Lower-Middle-Income (Kenya, Tanzanie, Ghana, Nigeria, Sénégal, Côte d'Ivoire, Maroc, Égypte, Inde...) :
- Logo : $50 – $150 | Flyer : $25 – $80 | Carte : $25 – $60
- Site Starter : $250 – $500 | Business : $500 – $1,000 | E-commerce : $800 – $1,800
- Web App SaaS : $1,000 – $3,500 | Logiciel : $1,500 – $5,000+ | Mobile App : $1,500 – $6,000+
- Système ERP : $1,200 – $5,000+ | UI/UX : $200 – $800 | Marketing : $200 – $800/m
- Domaine + Hébergement : $70 – $200/an | Maintenance : $100 – $500/m | API : $200 – $800+ | IA : $1,000 – $8,000+ | Sécurité : $400 – $3,000+

3. Marché Upper-Middle-Income (Afrique du Sud, Chine, Brésil, Mexique, Malaisie, Turquie, Thaïlande...) :
- Logo : $100 – $300 | Flyer : $50 – $150 | Carte : $50 – $120
- Site Starter : $500 – $1,000 | Business : $1,000 – $2,500 | E-commerce : $1,500 – $4,000
- Web App SaaS : $2,000 – $7,000 | Logiciel : $3,000 – $10,000+ | Mobile App : $3,000 – $12,000+
- Système ERP : $2,500 – $10,000+ | UI/UX : $500 – $2,000 | Marketing : $400 – $1,500/m
- Domaine + Hébergement : $100 – $300/an | Maintenance : $200 – $1,000/m | API : $500 – $2,000+ | IA : $2,000 – $15,000+ | Sécurité : $1,000 – $6,000+

4. Marché High-Income / International (USA, Canada, Royaume-Uni, France, Allemagne, Suisse, Belgique, EAU, Arabie Saoudite, Japon...) :
- Logo : $200 – $600 | Flyer : $100 – $300 | Carte : $80 – $200
- Site Starter : $800 – $1,500 | Business : $1,500 – $4,000 | E-commerce : $2,500 – $7,000
- Web App SaaS : $4,000 – $15,000+ | Logiciel : $5,000 – $25,000+ | Mobile App : $5,000 – $30,000+
- Système ERP : $4,000 – $20,000+ | UI/UX : $1,000 – $4,000 | Marketing : $800 – $3,000/m
- Domaine + Hébergement : $150 – $500/an | Maintenance : $300 – $1,500/m | API : $800 – $4,000+ | IA : $5,000 – $50,000+ | Sécurité : $2,000 – $15,000+

5. Tarifs Spéciaux Rwanda (en RWF) :
- Starter Website : 150,000 – 300,000 RWF | Business : 300,000 – 600,000 RWF | E-commerce : 500,000 – 1,200,000 RWF
- Web App : 700,000 – 2,500,000 RWF | Logiciel : 800,000 – 4,000,000+ RWF | Mobile App : 1,000,000 – 5,000,000+ RWF
- Logo : 30,000 – 100,000 RWF | Flyer : 15,000 – 50,000 RWF | UI/UX : 100,000 – 600,000 RWF | Maintenance : 50,000 – 300,000 RWF/m

6. Tarifs Spéciaux RDC (en USD) :
- Website : $150 – $600 | E-commerce : $500 – $1,000 | Web App : $700 – $2,000 | Mobile App : $800 – $3,500+ | Logiciel : $800 – $3,000+ | Logo : $30 – $80 | Design : $15 – $50 | Maintenance : $50 – $300/m

Moyens de paiement :
- Rwanda : MTN MoMo
- RDC : Airtel Money
- International : Western Union, Virement Swift, Cartes Bancaires.`
  },
  {
    id: "founder-skills-and-education",
    title: "Profil Technique, Compétences & Formation du Fondateur",
    category: "company",
    tags: ["fondateur", "competences", "cv", "formation", "ulk", "projets", "c#", "wpf", "php", "react"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `PROFIL TECHNIQUE ET COMPÉTENCES DU FONDATEUR / DIRECTION TECHNIQUE (V&I TECH AFRICA LTD) :

1. Formation Académique :
- Diplôme : Bachelor / Licence – Computer Science / Software Engineering
- Établissement : University of Kigali (ULK) – Gisenyi Campus, Rwanda (Niveau actuel : Year 2)
- Disciplines : Génie logiciel, Algorithmique & POO, Bases de données relationnelles (SQL, MySQL, SQLite), Conception UML, Développement web & desktop.

2. Compétences Techniques & Niveaux de Maîtrise :
- HTML / CSS : 90% (Expert)
- PHP : 85% (Avancé, architectures MVC, backends)
- API Integration : 85% (Avancé, Webhooks, passerelles de paiement)
- JavaScript & TypeScript : 80% (Avancé)
- SQL / MySQL / SQLite : 80% (Avancé, requêtes optimisées, exports)
- Python : 70% (Maîtrisé, Tkinter, scripts)
- C++ : 70% (Maîtrisé, algorithmique)
- Java : 60% (Intermédiaire)
- C# / .NET / WPF : Intermédiaire / Solide (Applications desktop, WPF UI, SQLite, Export Excel)
- React / Vite : Intermédiaire / Solide (SPA, composants modernes)
- Laravel : Intermédiaire
- Bootstrap / Tailwind CSS : 85% (Avancé)
- Git / GitHub : 85% (Avancé)
- Maintenance et dépannage informatique : 85% (Diagnostic matériel & logiciel)

3. Applications & Systèmes Desktop :
- Développement d'applications desktop professionnelles avec C# / .NET / WPF
- Interfaces graphiques Python Tkinter
- Gestion de bases de données locales (SQLite, MySQL)
- Export et traitement de données (Excel, PDF, CSV)
- Installation, configuration de logiciels et assistance utilisateurs

4. Solutions Numériques & Mobile Money :
- Intégration de passerelles Mobile Money (MTN MoMo au Rwanda, Airtel Money en RDC)
- Développement de solutions web et digitalisation de processus d'entreprise
- Création de sites web professionnels et e-commerce

5. Projets Phares Réalisés :
- "V&I Manager System" : Application desktop de gestion développée en C# / .NET / WPF avec SQLite embarquée, gestion des stocks et opérations, et export Excel automatisé.
- "Vitech Africa – Digital Solutions" : Plateforme technologique d'ingénierie et de transformation numérique (vitechafrica.vercel.app).
- "Vitech Scripts" : Marketplace numérique pour scripts, templates et solutions web prêtes à l'emploi.
- "SmartPharma / MyLibrary / Solutions de gestion" : Suites de gestion spécialisées.

6. Postes Recherchés & Disponibilité :
- Statut : Disponibilité Immédiate
- Postes cibles : Junior Software Developer, Web Developer, IT Support, IT Technician, Computer Operator, Technical Assistant, Data Assistant, Administration & Opérations, Vente / Commercial.`
  },
  {
    id: "escalation-and-support",
    title: "Canaux de Support et Escalade vers un Humain",
    category: "company",
    tags: ["contact", "support", "directeur", "whatsapp", "appel", "escalade", "humain"],
    lastUpdated: "2026-03-01",
    isOfficial: true,
    content: `Procédure de Contact Direct et Escalade Humaine chez V&I TECH AFRICA LTD :
- Si un visiteur demande à parler à un humain, à un ingénieur ou au Directeur Général :
  1. WhatsApp Direction Officiel : +250 795 507 001 (Lien direct : https://wa.me/250795507001).
  2. Ligne Téléphonique Directe : +250 792 124 342.
  3. Email Général : contact.vitechdev@gmail.com.
  4. Prise de Rendez-vous : Possibilité de réserver une session de cadrage technique gratuite de 30 minutes directement sur le site web.
- Horaires d'assistance : Du Lundi au Samedi, de 08h00 à 20h00 (GMT+2 / Kigali & GMT / Dakar-Abidjan). Support critique 24/7 disponible pour les clients sous contrat SLA.`
  }
];

// In-Memory Document Store with CRUD support for Admin CMS
let dynamicDocs: KnowledgeDocument[] = [...OFFICIAL_KNOWLEDGE_DOCS];
let chatAuditLogs: ChatLogEntry[] = [];

export function getKnowledgeDocs(): KnowledgeDocument[] {
  return dynamicDocs;
}

export function addOrUpdateKnowledgeDoc(doc: KnowledgeDocument): void {
  const index = dynamicDocs.findIndex((d) => d.id === doc.id);
  if (index >= 0) {
    dynamicDocs[index] = { ...doc, lastUpdated: new Date().toISOString().split('T')[0] };
  } else {
    dynamicDocs.push({
      ...doc,
      id: doc.id || `doc-${Date.now()}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      isOfficial: true,
    });
  }
}

export function deleteKnowledgeDoc(id: string): boolean {
  const initialLen = dynamicDocs.length;
  dynamicDocs = dynamicDocs.filter((d) => d.id !== id);
  return dynamicDocs.length < initialLen;
}

export function logChatMessage(entry: Omit<ChatLogEntry, 'id' | 'timestamp'>): void {
  const newEntry: ChatLogEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    timestamp: new Date().toISOString(),
    ...entry,
  };
  chatAuditLogs.unshift(newEntry);
  // Cap at 200 logs
  if (chatAuditLogs.length > 200) {
    chatAuditLogs = chatAuditLogs.slice(0, 200);
  }
}

export function getChatLogs(): ChatLogEntry[] {
  return chatAuditLogs;
}

// ----------------------------------------------------------------------------
// Simple, Fast, Dependency-Free TF-IDF / BM25-like Hybrid Keyword RAG Retriever
// ----------------------------------------------------------------------------
export interface RetrievalResult {
  doc: KnowledgeDocument;
  score: number;
  snippet: string;
}

export function retrieveRelevantDocuments(query: string, maxResults = 4): RetrievalResult[] {
  if (!query || typeof query !== 'string') return [];
  
  // Clean tokens
  const stopWords = new Set([
    'le', 'la', 'les', 'de', 'des', 'du', 'un', 'une', 'et', 'en', 'pour', 'sur', 'dans', 'par',
    'est', 'sont', 'que', 'qui', 'avec', 'vos', 'votre', 'notre', 'nos', 'ce', 'cette', 'ces',
    'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'to', 'in', 'for', 'with', 'you', 'your'
  ]);
  
  const queryTokens = query
    .toLowerCase()
    .replace(/[^\w\sàâäéèêëîïôöùûüçñ]/gi, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !stopWords.has(t));

  const scoredDocs: RetrievalResult[] = [];

  for (const doc of dynamicDocs) {
    let score = 0;
    const docTitleLower = doc.title.toLowerCase();
    const docContentLower = doc.content.toLowerCase();
    const docTagsLower = doc.tags.map((t) => t.toLowerCase());

    for (const token of queryTokens) {
      // Title match (heavy weight)
      if (docTitleLower.includes(token)) {
        score += 8;
      }
      // Tag match (heavy weight)
      if (docTagsLower.some((t) => t.includes(token))) {
        score += 6;
      }
      // Exact word count in content
      const regex = new RegExp(`\\b${token}\\b`, 'gi');
      const matches = docContentLower.match(regex);
      if (matches) {
        score += Math.min(matches.length * 1.5, 6);
      } else if (docContentLower.includes(token)) {
        score += 1;
      }
    }

    if (score > 0) {
      // Extract most relevant snippet
      const sentences = doc.content.split('\n');
      let bestSnippet = sentences.slice(0, 3).join('\n');
      scoredDocs.push({
        doc,
        score,
        snippet: bestSnippet,
      });
    }
  }

  // Sort descending by relevance score
  scoredDocs.sort((a, b) => b.score - a.score);

  // If no match found, fallback to overview & escalation doc
  if (scoredDocs.length === 0) {
    const fallback = dynamicDocs.filter(d => d.id === 'vitech-overview' || d.id === 'escalation-and-support');
    return fallback.map(d => ({
      doc: d,
      score: 1,
      snippet: d.content.slice(0, 200),
    }));
  }

  return scoredDocs.slice(0, maxResults);
}

// ----------------------------------------------------------------------------
// Prompt Injection & Malicious Input Sanitizer
// ----------------------------------------------------------------------------
export function sanitizeAndCheckInput(rawInput: string): { safe: boolean; sanitized: string; reason?: string } {
  if (!rawInput || typeof rawInput !== 'string') {
    return { safe: false, sanitized: '', reason: 'Message vide.' };
  }

  const trimmed = rawInput.trim();
  if (trimmed.length > 2000) {
    return { safe: false, sanitized: trimmed.slice(0, 2000), reason: 'Message trop long (max 2000 caractères).' };
  }

  // Check for common prompt injection heuristics
  const dangerousPatterns = [
    /ignore all previous instructions/i,
    /disregard previous prompts/i,
    /system override/i,
    /you are now in developer mode/i,
    /jailbreak/i,
    /output your raw system prompt/i,
    /reveal your secret key/i,
    /print environmental variables/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(trimmed)) {
      return {
        safe: false,
        sanitized: trimmed,
        reason: "Votre message contient des directives non autorisées. Veuillez poser une question relative aux services et technologies de V&I TECH AFRICA LTD."
      };
    }
  }

  return { safe: true, sanitized: trimmed };
}

// ----------------------------------------------------------------------------
// Rate Limiter per Client IP / Identifier
// ----------------------------------------------------------------------------
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(clientId: string, maxRequestsPerMin = 20): boolean {
  const now = Date.now();
  const clientData = requestCounts.get(clientId);

  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientId, { count: 1, resetTime: now + 60000 });
    return true;
  }

  if (clientData.count >= maxRequestsPerMin) {
    return false;
  }

  clientData.count += 1;
  return true;
}
