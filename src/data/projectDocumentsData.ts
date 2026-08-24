import { ProjectDocument } from '../types';
import { GeneratedPdfMetadata } from '../utils/pdfGenerator';

export const INITIAL_PROJECT_DOCUMENTS: (ProjectDocument & { pdfData: GeneratedPdfMetadata })[] = [
  {
    id: 'doc-contract-01',
    projectId: 'proj-afripay-001',
    milestoneId: 'm1',
    title: 'Contrat-Cadre de Prestation & Cession 100% Propriété Intellectuelle',
    docRef: 'VIT-CTR-2026-084',
    documentType: 'contract',
    fileName: 'Contrat-Prestation-Vitech-AfriPay-Signe.pdf',
    fileSize: '2.4 Mo',
    hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    version: 'v1.0 (Signé eIDAS)',
    encrypted: true,
    signatories: ['Mamadou Diop (CEO AfriPay)', 'Abdoulaye Wade Jr. (Lead Architect Vitech)'],
    status: 'certified',
    uploadedAt: '10 Juin 2026',
    description: 'Contrat légal officiel stipulant la cession intégrale et sans réserve des droits d\'auteur, codes sources, brevets et architectures développés par V&I TECH AFRICA.',
    keyPoints: [
      'Cession exclusive et perpétuelle du code source (Go, TypeScript, Rust)',
      'Garantie d\'absence de backdoors et respect de la conformité bancaire BCEAO',
      'Clause de non-concurrence et confidentialité absolue',
      'Engagement de support correctif gratuit pendant 6 mois'
    ],
    pdfData: {
      title: 'CONTRAT DE PRESTATION LOGICIELLE & CESSION DE PROPRIÉTÉ INTELLECTUELLE',
      docRef: 'VIT-CTR-2026-084',
      category: 'Contrat Juridique & Propriété Intellectuelle',
      clientName: 'AfriPay Financial Services Ltd (Sénégal / UEMOA)',
      projectName: 'AfriPay Core Switch Payment Platform',
      leadArchitect: 'Abdoulaye Wade Jr. (Senior Partner & Lead Architect)',
      date: '10 Juin 2026',
      version: 'v1.0 (Signé eIDAS)',
      sha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      milestoneTitle: 'Jalon 1 : Cadrage & Architecture',
      sections: [
        {
          heading: 'ARTICLE 1 : OBJET DE LA PRESTATION & PÉRIMÈTRE TECHNIQUE',
          content: [
            'Le présent contrat régit la conception, l\'ingénierie logicielle, le déploiement Cloud sécurisé et la mise en production du switch de paiement panafricain haute performance pour le compte de la société AFRI PAY FINANCIAL SERVICES LTD.',
            'V&I TECH AFRICA LTD s\'engage à mobiliser une équipe dédiée d\'architectes logiciels seniors, ingénieurs sécurité et spécialistes DevOps pour mener à bien les 6 sprints du projet.'
          ]
        },
        {
          heading: 'ARTICLE 2 : CESSION TOTALE ET EXCLUSIVE DE LA PROPRIÉTÉ INTELLECTUELLE',
          content: [
            'Conformément aux engagements de V&I TECH AFRICA LTD, la totalité des codes sources, schémas de bases de données, scripts Terraform, conteneurs Docker, tests unitaires et documentations techniques développés deviennent la propriété pleine, entière et exclusive du CLIENT dès le règlement des jalons.',
            'Le CLIENT dispose du droit inaliénable de modifier, distribuer, auditer ou monétiser la solution sans aucune redevance ultérieure.'
          ]
        },
        {
          heading: 'ARTICLE 3 : NIVEAU DE SERVICE (SLA) & RÉSILIENCE 99.99%',
          content: [
            'L\'architecture logicielle est garantie pour supporter un débit minimum de 5 000 transactions par seconde (TPS) avec un temps de réponse P95 inférieur à 85 millisecondes.',
            'En cas d\'anomalie bloquante de sévérité 1 (P0), l\'astreinte 24/7 de V&I TECH s\'engage sur un temps de prise en charge < 15 minutes et une remédiation < 2 heures.'
          ]
        }
      ]
    }
  },
  {
    id: 'doc-spec-02',
    projectId: 'proj-afripay-001',
    milestoneId: 'm1',
    title: 'Cahier des Charges Fonctionnel & Architecture Technique C4',
    docRef: 'VIT-SPC-2026-012',
    documentType: 'spec',
    fileName: 'Cahier-Des-Charges-Technique-AfriPay-v2.pdf',
    fileSize: '8.1 Mo',
    hashSha256: '2c6a465997d196360f73de8f90e4ff806c93fcfd74e6134ee7e37a86770d1002',
    version: 'v2.2 Validé',
    encrypted: true,
    signatories: ['Koffi Mensah (Tech Lead AfriPay)', 'Abdoulaye Wade Jr. (Vitech)'],
    status: 'certified',
    uploadedAt: '12 Juin 2026',
    description: 'Document d\'architecture logicielle exhaustive : modèles de données PostgreSQL partitionnés, topologie microservices Go, bus Kafka et passerelles Mobile Money.',
    keyPoints: [
      'Diagrammes C4 (Context, Container, Component, Code)',
      'Spécifications OpenAPI 3.1 & protocoles Webhook mTLS',
      'Politique de partitionnement des bases multi-pays (SN, CI, ML, BF)',
      'Stratégie de reprise après sinistre (RPO < 1s, RTO < 30s)'
    ],
    pdfData: {
      title: 'SPÉCIFICATIONS TECHNIQUES DÉTAILLÉES & ARCHITECTURE C4',
      docRef: 'VIT-SPC-2026-012',
      category: 'Spécifications Techniques & C4 Model',
      clientName: 'AfriPay Financial Services Ltd',
      projectName: 'AfriPay Core Switch Payment Platform',
      leadArchitect: 'Abdoulaye Wade Jr.',
      date: '12 Juin 2026',
      version: 'v2.2 Validé',
      sha256: '2c6a465997d196360f73de8f90e4ff806c93fcfd74e6134ee7e37a86770d1002',
      milestoneTitle: 'Jalon 1 : Architecture & C4 System Context',
      sections: [
        {
          heading: '1. TOPOLOGIE SYSTÈME & MODÈLE ÉVÉNEMENTIEL (EVENT-DRIVEN)',
          content: [
            'Le système est articulé autour d\'un cluster Apache Kafka distribué avec Event Sourcing. Chaque opération de paiement génère un événement immuable "PaymentInitiated", "RiskScored", "RoutingDispatched" et "PaymentSettled".',
            'La persistance est assurée par un cluster PostgreSQL 16 partitionné par pays, avec sharding automatique et réplication synchrone sur 3 zones de disponibilité.'
          ]
        },
        {
          heading: '2. SCHÉMA DE SÉCURITÉ ZERO-TRUST & CHIFFREMENT DES SECRETS',
          content: [
            'Toutes les clés privées et secrets d\'API opérateurs sont stockés dans HashiCorp Vault avec rotation automatisée tous les 30 jours.',
            'Les communications inter-microservices sont encapsulées dans un Service Mesh Istio avec mTLS strict (chiffrement TLS 1.3 avec validation croisée des certificats X.509).'
          ]
        },
        {
          heading: '3. SPÉCIFICATIONS DES WEBHOOKS ET DES RETRIES EXPONENTIELS',
          content: [
            'Algorithme de retry avec jitter exponentiel (1s, 5s, 30s, 5m, 30m, 2h) et file Dead-Letter Queue (DLQ) monitorée par Prometheus pour garantir 100% de délivrabilité des notifications marchands.'
          ]
        }
      ]
    }
  },
  {
    id: 'doc-delivery-03',
    projectId: 'proj-afripay-001',
    milestoneId: 'm2',
    title: 'Procès-Verbal de Recette Technique : Microservices & Switch Transactionnel',
    docRef: 'VIT-PVR-2026-022',
    documentType: 'delivery_report',
    fileName: 'PV-Recette-Sprint-2-Core-Switch.pdf',
    fileSize: '3.6 Mo',
    hashSha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
    version: 'v1.0 (Signé)',
    encrypted: true,
    signatories: ['Awa Ndiaye (PM AfriPay)', 'Jean-Paul Habimana (QA Lead Vitech)'],
    status: 'signed',
    uploadedAt: '05 Juillet 2026',
    description: 'Rapport de validation formelle de la recette contradictoire du moteur de transactionnel Go avec 100% des tests de régression passants.',
    keyPoints: [
      '512 tests unitaires et d\'intégration automatisés exécutés (100% succès)',
      'Test de montée en charge validé à 6 200 TPS sur environnement Staging',
      'Couverture de code globale mesurée à 98.4%',
      'Zéro anomalie critique résiduelle'
    ],
    pdfData: {
      title: 'PROCES-VERBAL DE RECETTE CONTRADICTOIRE - SPRINT 2',
      docRef: 'VIT-PVR-2026-022',
      category: 'Procès-Verbal de Recette & Livraison',
      clientName: 'AfriPay Financial Services Ltd',
      projectName: 'AfriPay Core Switch Payment Platform',
      leadArchitect: 'Jean-Paul Habimana (Lead QA & Security)',
      date: '05 Juillet 2026',
      version: 'v1.0 (Signé)',
      sha256: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0',
      milestoneTitle: 'Jalon 2 : Moteur de Routage Microservices Go',
      sections: [
        {
          heading: '1. RÉSULTATS DES TESTS DE VALIDATION FONCTIONNELLE',
          content: [
            'L\'ensemble des 42 scénarios d\'usage validés conjointement lors du sprint review ont été testés avec succès : création de portefeuille marchand, routage dynamique par coût opérateur le plus bas, et rollback transactionnel en 2 phases (2PC).',
            'Toutes les exigences du cahier des charges relatives au jalon 2 sont déclarées conformes et prêtes pour l\'interconnexion aux opérateurs.'
          ]
        },
        {
          heading: '2. MÉTRIQUES DE PERFORMANCE & LATENCE CONSTATÉES',
          content: [
            'Débit maximum soutenu : 6 200 requêtes / seconde avec 0.00% d\'erreurs HTTP 5xx.',
            'Latence moyenne : 34ms | Latence P99 : 78ms sur cluster Kubernetes multi-zones.',
            'Empreinte mémoire des microservices Go : < 45 Mo par réplica.'
          ]
        }
      ]
    }
  },
  {
    id: 'doc-spec-04',
    projectId: 'proj-afripay-001',
    milestoneId: 'm3',
    title: 'Spécifications Techniques : Passerelles Mobile Money & USSD Unified API',
    docRef: 'VIT-SPC-2026-033',
    documentType: 'spec',
    fileName: 'Specs-Passerelles-Mobile-Money-USSD-v1.8.pdf',
    fileSize: '5.2 Mo',
    hashSha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
    version: 'v1.8 Validé',
    encrypted: true,
    signatories: ['Koffi Mensah (Tech Lead)', 'Fatoumata Traoré (Mobile Lead Vitech)'],
    status: 'certified',
    uploadedAt: '24 Juillet 2026',
    description: 'Documentation exhaustive des intégrations directes Wave, Orange Money Sénégal/CI, MTN Mobile Money, Moov et M-Pesa.',
    keyPoints: [
      'Protocoles de signature HMAC-SHA256 pour chaque opérateur',
      'Gestion automatique des codes USSD Push (Push STK) et timeouts',
      'Moteur de réconciliation bancaire journalière automatique (CSV/MT940)',
      'Détection anti-fraude basée sur la vélocité des transferts'
    ],
    pdfData: {
      title: 'SPÉCIFICATIONS INTÉGRATIONS MOBILE MONEY & CONNECTEURS TÉLÉCOMS',
      docRef: 'VIT-SPC-2026-033',
      category: 'Spécifications Passerelles de Paiement',
      clientName: 'AfriPay Financial Services Ltd',
      projectName: 'AfriPay Core Switch Payment Platform',
      leadArchitect: 'Fatoumata Traoré (Lead Mobile & Payment Gateways)',
      date: '24 Juillet 2026',
      version: 'v1.8 Validé',
      sha256: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
      milestoneTitle: 'Jalon 3 : Passerelles Mobile Money & Télécoms',
      sections: [
        {
          heading: '1. CONNECTEURS OPÉRATEURS OPÉRATIONNELS',
          content: [
            'Wave Sénégal & Côte d\'Ivoire : intégration directe par Webhook temps réel et QR Code dynamique.',
            'Orange Money (OM API 3.0) : authentification OAuth2, génération d\'OTP et push USSD transactionnel.',
            'MTN MoMo API : gestion du X-Reference-Id asynchrone et callback bancaire mTLS.'
          ]
        },
        {
          heading: '2. PROTOCOLE DE RÉCONCILIATION ET GESTION DES LITIGES',
          content: [
            'Génération automatisée des rapports de compensation à minuit (UTC) au format ISO 20022 et MT940.',
            'Workflow automatisé de remboursement partiel ou total en moins de 300 millisecondes.'
          ]
        }
      ]
    }
  },
  {
    id: 'doc-audit-05',
    projectId: 'proj-afripay-001',
    milestoneId: 'm4',
    title: 'Rapport d\'Audit de Cybersécurité & Tests d\'Intrusion OWASP Top 10',
    docRef: 'VIT-AUD-2026-055',
    documentType: 'audit',
    fileName: 'Rapport-Audit-Securite-Intermediaire-OWASP.pdf',
    fileSize: '4.8 Mo',
    hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    version: 'v1.0 Certifié',
    encrypted: true,
    signatories: ['Cabinet Audit Externe', 'Jean-Paul Habimana (DevSecOps Lead Vitech)'],
    status: 'certified',
    uploadedAt: '08 Août 2026',
    description: 'Rapport de pentest boîte grise : revue des vulnérabilités OWASP API Top 10, tests d\'injection SQL, conformité mTLS et protection contre le brute-force.',
    keyPoints: [
      'Score de sécurité global : 96.8 / 100 (Excellence Sécuritaire)',
      'Zéro vulnérabilité critique ou élevée résiduelle',
      'Protection WAF Cloudflare avec limitation de taux stricte',
      'Validation de la conformité de chiffrement des données au repos (AES-256)'
    ],
    pdfData: {
      title: 'RAPPORT D\'AUDIT DE CYBERSÉCURITÉ & PENTEST CONTRADICTOIRE',
      docRef: 'VIT-AUD-2026-055',
      category: 'Audit Sécurité & Conformité OWASP',
      clientName: 'AfriPay Financial Services Ltd',
      projectName: 'AfriPay Core Switch Payment Platform',
      leadArchitect: 'Jean-Paul Habimana (DevSecOps Lead)',
      date: '08 Août 2026',
      version: 'v1.0 Certifié',
      sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      milestoneTitle: 'Jalon 4 : Sécurité, Pentest & Audit Cryptographique',
      sections: [
        {
          heading: '1. RÉSULTATS DES TESTS D\'INTRUSION (OWASP API SECURITY TOP 10)',
          content: [
            'API1:2023 - Broken Object Level Authorization (BOLA) : CONFORME (Contrôle d\'accès RBAC strict).',
            'API2:2023 - Broken Authentication : CONFORME (Tokens JWT signés asymétriquement en Ed25519 avec expiration 15 min).',
            'API3:2023 - Broken Object Property Level Authorization : CONFORME (Validation des schémas JSON stricte).',
            'API4:2023 - Unrestricted Resource Consumption : CONFORME (Rate Limiting par IP et par Client API).'
          ]
        },
        {
          heading: '2. RECOMMANDATIONS APPLIQUÉES & DURCISSEMENT VALIDÉ',
          content: [
            'Activation du HSTS (HTTP Strict Transport Security) avec max-age=31536000 et includeSubDomains.',
            'Isolation étanche des conteneurs via profils AppArmor et Seccomp stricts sous Kubernetes non-root.'
          ]
        }
      ]
    }
  },
  {
    id: 'doc-sla-06',
    projectId: 'proj-afripay-001',
    milestoneId: 'm5',
    title: 'Certificat de Garantie SLA 99.99% & Maintenance Proactive 6 Mois',
    docRef: 'VIT-SLA-2026-099',
    documentType: 'sla',
    fileName: 'Certificat-Garantie-SLA-Vitech-AfriPay.pdf',
    fileSize: '1.9 Mo',
    hashSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    version: 'v1.0 Officiel',
    encrypted: true,
    signatories: ['Direction Générale V&I TECH AFRICA', 'Direction AfriPay'],
    status: 'certified',
    uploadedAt: '15 Août 2026',
    description: 'Engagement solennel de disponibilité continue, astreinte téléphonique VIP 24/7 et prise en charge intégrale de tous les correctifs post-lancement.',
    keyPoints: [
      'Garantie de disponibilité contractuelle de 99.99%',
      'Support technique et correction de bugs garantie pendant 6 mois sans frais',
      'Mises à jour de sécurité et patchs mensuels appliqués sans interruption de service',
      'Ligne d\'urgence directe avec les Lead Architects'
    ],
    pdfData: {
      title: 'CERTIFICAT D\'ENGAGEMENT SLA & GARANTIE DE MAINTENANCE PROACTIVE',
      docRef: 'VIT-SLA-2026-099',
      category: 'Garantie Contractuelle SLA & Support 24/7',
      clientName: 'AfriPay Financial Services Ltd',
      projectName: 'AfriPay Core Switch Payment Platform',
      leadArchitect: 'Abdoulaye Wade Jr. (Senior Partner & Lead Architect)',
      date: '15 Août 2026',
      version: 'v1.0 Officiel',
      sha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
      milestoneTitle: 'Global Projet & Engagement Garantie',
      sections: [
        {
          heading: '1. ENGAGEMENT DE DISPONIBILITÉ CONTRACTUELLE (99.99%)',
          content: [
            'V&I TECH AFRICA LTD certifie que l\'infrastructure de la plateforme AfriPay Payment Switch bénéficie d\'une garantie de disponibilité de 99.99%, soit moins de 4 minutes et 23 secondes d\'interruption non planifiée par mois.',
            'Tout incident fait l\'objet d\'un rapport post-mortem détaillé sous 48 heures ouvrées.'
          ]
        },
        {
          heading: '2. COUVERTURE DE LA GARANTIE DE 6 MOIS',
          content: [
            'Tous les composants logiciels livrés sont couverts par une garantie totale contre les vices cachés, anomalies de code ou régressions pendant 6 mois à compter de la recette finale.',
            'L\'équipe Vitech prend en charge gratuitement les correctifs, optimisations de performances et adaptations réglementaires nécessaires.'
          ]
        }
      ]
    }
  }
];
