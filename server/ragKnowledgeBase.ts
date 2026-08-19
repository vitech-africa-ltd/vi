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
