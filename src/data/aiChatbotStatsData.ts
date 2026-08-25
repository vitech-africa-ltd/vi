export interface AiChatUsageDailyPoint {
  date: string;
  dayLabel: string;
  totalQueries: number;
  resolvedByAi: number;
  escalatedToHuman: number;
  estimatedTimeSavedMinutes: number;
  estimatedTimeSavedHours: number;
  estimatedFinancialSavingsUSD: number;
  avgResponseTimeMs: number;
  satisfactionRate: number; // e.g. 97.5%
}

export interface AiTopicDistribution {
  id: string;
  name: string;
  description: string;
  queriesCount: number;
  percentage: number;
  avgTimeSavedMin: number;
  color: string;
  iconName: string;
}

export interface AiInteractionLog {
  id: string;
  timestamp: string;
  timeAgo: string;
  userMessage: string;
  botReply: string;
  category: string;
  clientInfo?: {
    location?: string;
    flag?: string;
    device?: string;
  };
  durationMs: number;
  timeSavedMin: number;
  status: 'resolved_ai' | 'escalated_human' | 'rag_grounded';
  modelUsed: string;
  sourcesUsed: string[];
}

export interface AiChatSummaryMetrics {
  totalQueriesProcessed: number;
  totalQueriesThisMonth: number;
  totalHoursSaved: number;
  totalMinutesSaved: number;
  totalFinancialSavingsUSD: number;
  totalFinancialSavingsRWF: number;
  automatedResolutionRate: number; // e.g. 89.2%
  humanEscalationRate: number; // e.g. 10.8%
  avgResponseTimeSeconds: number; // e.g. 1.25s
  avgManualTicketTimeMinutes: number; // e.g. 10 min
  hourlyDevCostUSD: number; // e.g. $35/h
  customerSatisfactionScore: number; // e.g. 96.8%
}

// 30 Days of realistic AI Chatbot Usage & Time Savings
export const GENERATE_30_DAYS_AI_STATS = (): AiChatUsageDailyPoint[] => {
  const points: AiChatUsageDailyPoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });

    // Growth progression over 30 days
    const baseFactor = 1 + (30 - i) * 0.04; // +4% growth
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const weekendMultiplier = isWeekend ? 0.75 : 1.15;
    
    // Controlled natural variance
    const noise = Math.sin(i * 1.5) * 8 + Math.cos(i * 0.8) * 5;
    const total = Math.max(35, Math.round((78 * baseFactor * weekendMultiplier) + noise));
    const escalated = Math.max(3, Math.round(total * (0.09 + (Math.sin(i) * 0.02))));
    const resolved = total - escalated;

    // Time saved calculation: ~10 minutes per query if answered manually by senior dev/support
    const timeSavedMin = total * 10;
    const timeSavedHours = Number((timeSavedMin / 60).toFixed(1));
    const financialSavingsUSD = Math.round(timeSavedHours * 35); // $35/h base rate

    const avgResponseTimeMs = Math.round(1100 + Math.sin(i * 2) * 250);
    const satisfactionRate = Number((95.5 + Math.cos(i * 0.5) * 3.5).toFixed(1));

    points.push({
      date: dateStr,
      dayLabel,
      totalQueries: total,
      resolvedByAi: resolved,
      escalatedToHuman: escalated,
      estimatedTimeSavedMinutes: timeSavedMin,
      estimatedTimeSavedHours: timeSavedHours,
      estimatedFinancialSavingsUSD: financialSavingsUSD,
      avgResponseTimeMs,
      satisfactionRate: Math.min(99.4, Math.max(92.0, satisfactionRate))
    });
  }

  return points;
};

// Distribution by client question categories
export const AI_TOPIC_DISTRIBUTION: AiTopicDistribution[] = [
  {
    id: 'pricing-quote',
    name: 'Tarifs & Devis Estimatifs 2026',
    description: 'Questions sur la grille tarifaire internationale, coûts par pays et devis instantanés',
    queriesCount: 945,
    percentage: 33.2,
    avgTimeSavedMin: 12,
    color: '#06b6d4', // Cyan
    iconName: 'DollarSign'
  },
  {
    id: 'architecture-stack',
    name: 'Architecture & Stack Technique',
    description: 'Conseils sur React 19, Flutter 3, NestJS, SQLite Offline-First, bases de données',
    queriesCount: 680,
    percentage: 23.9,
    avgTimeSavedMin: 15,
    color: '#3b82f6', // Blue
    iconName: 'Cpu'
  },
  {
    id: 'momo-fintech',
    name: 'Mobile Money & Passerelles de Paiement',
    description: 'Spécifications webhooks MTN MoMo, Wave, Orange Money, Airtel et conformité HMAC',
    queriesCount: 460,
    percentage: 16.2,
    avgTimeSavedMin: 11,
    color: '#10b981', // Emerald
    iconName: 'Zap'
  },
  {
    id: 'guarantees-ip',
    name: 'Propriété Intellectuelle (IP) & SLA',
    description: 'Cession 100% du code source, garantie 6 mois, NDA immédiat et contrat eIDAS',
    queriesCount: 380,
    percentage: 13.3,
    avgTimeSavedMin: 8,
    color: '#f59e0b', // Amber
    iconName: 'ShieldCheck'
  },
  {
    id: 'security-audit',
    name: 'Cybersécurité & Pentest OWASP',
    description: 'Chiffrement AES-256 du coffre-fort, scoring de vulnérabilités et conformité ISO 27001',
    queriesCount: 245,
    percentage: 8.6,
    avgTimeSavedMin: 14,
    color: '#ec4899', // Pink
    iconName: 'Lock'
  },
  {
    id: 'human-escalation',
    name: 'Mise en relation WhatsApp Direction',
    description: 'Demandes de rendez-vous d\'audit gratuit ou appel direct avec le Directeur Général',
    queriesCount: 137,
    percentage: 4.8,
    avgTimeSavedMin: 5,
    color: '#8b5cf6', // Purple
    iconName: 'Phone'
  }
];

// Rich Recent Customer Chatbot Interactions
export const INITIAL_AI_INTERACTION_LOGS: AiInteractionLog[] = [
  {
    id: 'chat-log-101',
    timestamp: '2026-08-25T08:52:14Z',
    timeAgo: 'Il y a 6 min',
    userMessage: 'Quels sont vos tarifs pour une application mobile Flutter avec paiement MTN MoMo au Rwanda ?',
    botReply: 'Pour une application mobile Flutter avec intégration MTN Mobile Money au Rwanda, nos forfaits démarrent à partir de 1 000 000 RWF (ou $800 USD en zone Low-Income). Cela inclut le fonctionnement Offline-First, les webhooks sécurisés HMAC SHA256 et 6 mois de garantie corrective avec 100% de cession de propriété intellectuelle.',
    category: 'Tarifs & Devis Estimatifs 2026',
    clientInfo: {
      location: 'Kigali, Rwanda',
      flag: '🇷🇼',
      device: 'Mobile (Android)'
    },
    durationMs: 1140,
    timeSavedMin: 12,
    status: 'resolved_ai',
    modelUsed: 'Google Gemini 3.7 Flash RAG',
    sourcesUsed: ['Grille Tarifaire Internationale 2026', 'Service : Applications Mobiles iOS & Android', 'Intégrations Mobile Money']
  },
  {
    id: 'chat-log-102',
    timestamp: '2026-08-25T08:35:40Z',
    timeAgo: 'Il y a 22 min',
    userMessage: 'Le code source est-il réellement cédé à 100% à la fin du projet ? Avons-nous les accès Git ?',
    botReply: 'Oui, absolument. Chez V&I TECH AFRICA LTD, la cession de Propriété Intellectuelle (100% IP) est totale dès le solde final. Vous recevez la pleine propriété du code source, des dépôts Git (GitHub/GitLab) avec historique des commits, des designs Figma et des bases de données.',
    category: 'Propriété Intellectuelle (IP) & SLA',
    clientInfo: {
      location: 'Dakar, Sénégal',
      flag: '🇸🇳',
      device: 'Desktop (Chrome)'
    },
    durationMs: 980,
    timeSavedMin: 8,
    status: 'resolved_ai',
    modelUsed: 'Google Gemini 3.7 Flash RAG',
    sourcesUsed: ['Garanties Légales, SLA et Propriété Intellectuelle']
  },
  {
    id: 'chat-log-103',
    timestamp: '2026-08-25T08:12:05Z',
    timeAgo: 'Il y a 45 min',
    userMessage: 'Je souhaite planifier un audit de cybersécurité pour notre fintech. Pouvez-vous me mettre en contact direct avec un ingénieur ?',
    botReply: 'Certainement ! Notre équipe d\'ingénierie et la Direction Générale sont à votre écoute. Vous pouvez échanger directement sur WhatsApp au +250 795 507 001 ou planifier un audit préliminaire gratuit de 30 minutes.',
    category: 'Mise en relation WhatsApp Direction',
    clientInfo: {
      location: 'Abidjan, Côte d\'Ivoire',
      flag: '🇨🇮',
      device: 'Desktop (macOS)'
    },
    durationMs: 820,
    timeSavedMin: 10,
    status: 'escalated_human',
    modelUsed: 'Google Gemini 3.7 Flash RAG',
    sourcesUsed: ['Service : Cybersécurité, Pentesting & OWASP', 'Direction & Escalade']
  },
  {
    id: 'chat-log-104',
    timestamp: '2026-08-25T07:44:18Z',
    timeAgo: 'Il y a 1h 15min',
    userMessage: 'Comment gérez-vous la synchronisation des données en zone sans réseau internet ?',
    botReply: 'Nous déployons une architecture Offline-First avec base locale SQLite / SQLCipher chiffrée AES-256. L\'application enregistre les opérations dans une Action Queue et transmet uniquement les deltas modifiés (Delta Sync) lors de la reconnexion avec algorithme de résolution de conflit type CRDT. Cela réduit l\'usage de données de 80%.',
    category: 'Architecture & Stack Technique',
    clientInfo: {
      location: 'Goma, RDC',
      flag: '🇨🇩',
      device: 'Mobile (iOS)'
    },
    durationMs: 1250,
    timeSavedMin: 15,
    status: 'resolved_ai',
    modelUsed: 'Google Gemini 3.7 Flash RAG',
    sourcesUsed: ['Spécification Technique : Architecture Offline-First & Synchronisation']
  },
  {
    id: 'chat-log-105',
    timestamp: '2026-08-25T06:50:32Z',
    timeAgo: 'Il y a 2h',
    userMessage: 'Quelle est la différence entre votre script VitechPay et une intégration API personnalisée ?',
    botReply: 'Le script VitechPay est un module prêt à déployer (Laravel 11 / Node.js) intégrant MTN MoMo, Wave et Orange Money avec gestion automatique des webhooks. Une intégration sur-mesure comprend l\'adaptation à vos règles métier spécifiques, votre ERP et un pipeline CI/CD dédié avec infogérance.',
    category: 'Mobile Money & Passerelles de Paiement',
    clientInfo: {
      location: 'Paris, France',
      flag: '🇫🇷',
      device: 'Desktop (Firefox)'
    },
    durationMs: 1100,
    timeSavedMin: 11,
    status: 'resolved_ai',
    modelUsed: 'Google Gemini 3.7 Flash RAG',
    sourcesUsed: ['Catalogue Scripts Fintech VitechPay', 'Service : Développement Web & SaaS']
  },
  {
    id: 'chat-log-106',
    timestamp: '2026-08-25T05:30:10Z',
    timeAgo: 'Il y a 3h',
    userMessage: 'Acceptez-vous les paiements par virement SWIFT et quelles sont vos devises acceptées ?',
    botReply: 'Oui, nous acceptons les virements bancaires SWIFT et SEPA, ainsi que les cartes d\'entreprise et le Mobile Money d\'entreprise. Nous facturons en EUR (€), USD ($), FCFA (XOF/XAF), RWF (Franc Rwandais) et MAD avec émission de factures proforma et attestations conformes.',
    category: 'Tarifs & Devis Estimatifs 2026',
    clientInfo: {
      location: 'Casablanca, Maroc',
      flag: '🇲🇦',
      device: 'Desktop (Windows)'
    },
    durationMs: 890,
    timeSavedMin: 9,
    status: 'resolved_ai',
    modelUsed: 'Google Gemini 3.7 Flash RAG',
    sourcesUsed: ['Tarifs, Devis et Modalités de Paiement']
  }
];

// Helper to calculate total summary
export function calculateAiStatsSummary(
  dailyPoints: AiChatUsageDailyPoint[],
  hourlyRateUSD = 35,
  avgMinutesPerTicket = 10
): AiChatSummaryMetrics {
  const totalQueries = dailyPoints.reduce((acc, p) => acc + p.totalQueries, 0);
  const totalResolved = dailyPoints.reduce((acc, p) => acc + p.resolvedByAi, 0);
  const totalEscalated = dailyPoints.reduce((acc, p) => acc + p.escalatedToHuman, 0);
  
  const totalMinutesSaved = totalQueries * avgMinutesPerTicket;
  const totalHoursSaved = Math.round(totalMinutesSaved / 60);
  const totalFinancialSavingsUSD = Math.round(totalHoursSaved * hourlyRateUSD);
  const totalFinancialSavingsRWF = Math.round(totalFinancialSavingsUSD * 1320);

  const resolutionRate = totalQueries > 0 ? Number(((totalResolved / totalQueries) * 100).toFixed(1)) : 89.2;
  const escalationRate = totalQueries > 0 ? Number(((totalEscalated / totalQueries) * 100).toFixed(1)) : 10.8;
  const avgLatency = Number((dailyPoints.reduce((acc, p) => acc + p.avgResponseTimeMs, 0) / (dailyPoints.length * 1000)).toFixed(2));
  const avgSatisfaction = Number((dailyPoints.reduce((acc, p) => acc + p.satisfactionRate, 0) / dailyPoints.length).toFixed(1));

  // Current month (last 30 days portion)
  const currentMonthQueries = dailyPoints.slice(dailyPoints.length - 14).reduce((acc, p) => acc + p.totalQueries, 0);

  return {
    totalQueriesProcessed: totalQueries,
    totalQueriesThisMonth: currentMonthQueries,
    totalHoursSaved,
    totalMinutesSaved,
    totalFinancialSavingsUSD,
    totalFinancialSavingsRWF,
    automatedResolutionRate: resolutionRate,
    humanEscalationRate: escalationRate,
    avgResponseTimeSeconds: avgLatency,
    avgManualTicketTimeMinutes: avgMinutesPerTicket,
    hourlyDevCostUSD: hourlyRateUSD,
    customerSatisfactionScore: avgSatisfaction
  };
}
