export interface ScriptReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
  likes: number;
  replies?: {
    author: string;
    avatar: string;
    role: string;
    date: string;
    comment: string;
  }[];
}

export interface ScriptAnalysis {
  language: string;
  framework: string;
  version: string;
  fileSize: string;
  filesCount: number;
  linesOfCode: number;
  dependenciesCount: number;
  dependenciesList: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Enterprise';
  securityScore: number; // e.g. 99/100
  qualityScore: number;  // e.g. 98/100
  owaspCompliance: 'Certified A+' | 'A' | 'Compliant';
  owaspScore?: number | string;
  testedPHPVersion?: string;
  testedNodeVersion?: string;
}

export interface ScriptProduct {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  fullDescription: string;
  category: 'php-laravel' | 'node-react' | 'mobile-flutter' | 'python-django' | 'wordpress-plugins' | 'ui-templates' | 'fullstack-saas';
  categoryLabel: string;
  priceUSD: number;
  priceRWF: number; // Rwandan Francs for MTN / Airtel MoMo
  version?: string;
  isFree: boolean;
  isPopular: boolean;
  isNew: boolean;
  isPremium: boolean;
  previewImage: string;
  screenshots: string[];
  liveDemoUrl?: string;
  videoDemoUrl?: string;
  analysis: ScriptAnalysis;
  tags: string[];
  compatibility: string[];
  changelog: { version: string; date: string; changes: string[] }[];
  documentation: {
    quickStart: string;
    requirements: string[];
    installationSteps: string[];
    envVariables: string[];
  };
  rating: number;
  reviewsCount: number;
  reviews: ScriptReview[];
  likes: number;
  dislikes: number;
  views: number;
  downloadsCount: number;
  author: {
    name: string;
    badge: string;
    avatar: string;
    verified: boolean;
  };
  sampleCodeSnippet: string;
}

export const INITIAL_SCRIPTS: ScriptProduct[] = [
  {
    id: 'vitech-pay-gateway',
    slug: 'vitech-pay-momo-aggregator',
    title: 'VitechPay - Pan-African Mobile Money & Multi-Gateway Suite',
    tagline: 'Passerelle de paiement unifiée MTN MoMo Rwanda, Airtel Money, M-Pesa & Stripe',
    description: 'Solution fintech clé en main pour intégrer les paiements mobiles instantanés (MTN MoMo, Airtel, Wave, M-Pesa, Stripe) avec webhooks sécurisés, réconciliation automatique et factures PDF.',
    fullDescription: `VitechPay est le moteur de paiement le plus complet et résilient d'Afrique. Conçu en PHP 8.4 MVC et Laravel 11, il intègre nativement les API MTN Mobile Money (Rwanda, Ouganda, Ghana, Cameroun, Côte d'Ivoire), Airtel Money, M-Pesa Safaricom, Wave, Orange Money et Stripe.
    
Comprend un tableau de bord d'administration en temps réel, génération automatique de factures PDF certifiées, gestion des webhooks avec validation HMAC SHA256 et idempotency keys, ainsi qu'un système de notification SMS/Email par lot.`,
    category: 'php-laravel',
    categoryLabel: 'PHP & Laravel Fintech',
    priceUSD: 49,
    priceRWF: 65000,
    isFree: false,
    isPopular: true,
    isNew: true,
    isPremium: true,
    previewImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: 'https://demo.vitechafrica.com/vitechpay',
    videoDemoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    analysis: {
      language: 'PHP',
      framework: 'Laravel 11 / Vanilla PHP 8.4 MVC',
      version: 'v3.2.0',
      fileSize: '14.8 MB',
      filesCount: 142,
      linesOfCode: 24800,
      dependenciesCount: 18,
      dependenciesList: ['guzzlehttp/guzzle', 'stripe/stripe-php', 'mpdf/mpdf', 'firebase/php-jwt', 'vlucas/phpdotenv'],
      difficulty: 'Enterprise',
      securityScore: 99,
      qualityScore: 98,
      owaspCompliance: 'Certified A+',
      testedPHPVersion: 'PHP 8.2, 8.3, 8.4+'
    },
    tags: ['MTN MoMo', 'Airtel Money', 'Fintech', 'Laravel 11', 'Rwanda Payment', 'Webhooks', 'PHP 8.4'],
    compatibility: ['PHP 8.2+', 'MySQL 8.0+', 'Nginx', 'Apache', 'Docker', 'cPanel'],
    changelog: [
      { version: 'v3.2.0', date: '2026-06-15', changes: ['Ajout du support MTN MoMo Open API v2.1', 'Optimisation des queues de notifications SMS via Twilio/AfricaTalking', 'Mise à jour Laravel 11.x'] },
      { version: 'v3.1.0', date: '2026-02-10', changes: ['Génération de reçus fiscaux PDF avec QR Code', 'Support multi-devises automatique RWF, USD, KES, XOF'] }
    ],
    documentation: {
      quickStart: 'Décompressez l archive, configurez le fichier .env avec vos clés API MTN MoMo / Airtel, lancez "composer install" et importez "database.sql".',
      requirements: ['PHP >= 8.2 avec extensions pdo_mysql, curl, mbstring, openssl', 'MySQL >= 8.0', 'Composer v2+'],
      installationSteps: [
        '1. Uploader les fichiers sur votre serveur web (public_html).',
        '2. Créer une base de données MySQL et importer le fichier sql/vitechpay_schema.sql.',
        '3. Renommer .env.example en .env et renseigner vos clés MoMo (MOMO_API_KEY, MOMO_SUBSCRIPTION_KEY, MOMO_TARGET_ENV=production).',
        '4. Configurer votre cron job pour les webhooks: * * * * * php artisan schedule:run >> /dev/null 2>&1'
      ],
      envVariables: [
        'APP_NAME="VitechPay Gateway"',
        'DB_HOST=127.0.0.1',
        'DB_DATABASE=vitechpay_db',
        'MOMO_API_USER="your-user-id"',
        'MOMO_API_KEY="your-api-key"',
        'AIRTEL_CLIENT_ID="your-airtel-id"'
      ]
    },
    rating: 4.95,
    reviewsCount: 38,
    reviews: [
      {
        id: 'rev-1',
        author: 'Jean-Luc Habimana',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'Il y a 3 jours',
        comment: 'Script ultra robuste ! L intégration MTN MoMo Rwanda s est faite en moins de 2 heures dans notre e-commerce à Kigali. Le support client est extrêmement réactif.',
        verifiedPurchase: true,
        likes: 14,
        replies: [
          {
            author: 'Vitech Scripts Support',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
            role: 'Lead Architect',
            date: 'Il y a 2 jours',
            comment: 'Murakoze cyane Jean-Luc ! N hésitez pas à utiliser les webhooks idempotents pour les gros volumes de ventes.'
          }
        ]
      },
      {
        id: 'rev-2',
        author: 'Marc Ouedraogo',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'Il y a 1 semaine',
        comment: 'Le code est d une propreté exemplaire, architecture MVC stricte sans framework lourd ou Laravel prêt à l emploi. Bravo !',
        verifiedPurchase: true,
        likes: 9
      }
    ],
    likes: 245,
    dislikes: 2,
    views: 3820,
    downloadsCount: 684,
    author: {
      name: 'Vitech Core Engineering',
      badge: 'Elite Author',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=120&q=80',
      verified: true
    },
    sampleCodeSnippet: `<?php
// Exemple d'initiation de paiement instantané MTN Mobile Money Rwanda
use Vitech\\Payments\\MoMoGateway;

$momo = new MoMoGateway([
    'currency'    => 'RWF',
    'environment' => 'production', // ou sandbox
    'callbackUrl' => 'https://yoursite.rw/api/momo/callback'
]);

$response = $momo->requestToPay([
    'amount'        => 15000,
    'phoneNumber'   => '250788123456',
    'referenceId'   => 'ORD-' . time(),
    'payerMessage'  => 'Paiement Script Vitech',
    'payeeNote'     => 'Facture Vitech Africa'
]);

if ($response->isSuccessful()) {
    echo "Paiement initié avec succès. Transaction ID: " . $response->getTransactionId();
}`
  },

  {
    id: 'afriride-mobility-app',
    slug: 'afriride-uber-taxi-momo-flutter',
    title: 'AfriRide - Application VTC, Taxi & Moto-Taxi avec MoMo',
    tagline: 'Clone Uber / Yango / SafeBoda complet Flutter 3.24 + Backend Node.js & Go',
    description: 'Plateforme complète de transport urbain et logistique : App Chauffeur, App Passager, Backoffice Admin en temps réel avec WebSocket, calcul d itinéraire et paiement Mobile Money.',
    fullDescription: `AfriRide est la solution de mobilité numéro un conçue spécifiquement pour le continent africain. Elle supporte les motos-taxis (Boda-Boda, Zémidjan), les taxis classiques, les livraisons de colis et le covoiturage.
    
Intègre le tracking GPS fluide 60fps en temps réel, calcul du prix dynamique selon le trafic, portefeuille virtuel rechargeable par MTN/Airtel MoMo, chat chiffré intégré et système de SOS sécurité.`,
    category: 'mobile-flutter',
    categoryLabel: 'Mobile Flutter & Dart',
    priceUSD: 89,
    priceRWF: 118000,
    isFree: false,
    isPopular: true,
    isNew: true,
    isPremium: true,
    previewImage: 'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1526367790999-0150786686a2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: 'https://demo.vitechafrica.com/afriride',
    analysis: {
      language: 'Dart & TypeScript',
      framework: 'Flutter 3.24 / Node.js 20 Express',
      version: 'v4.0.1',
      fileSize: '48.2 MB',
      filesCount: 380,
      linesOfCode: 56400,
      dependenciesCount: 34,
      dependenciesList: ['flutter_bloc', 'google_maps_flutter', 'socket_io_client', 'geolocator', 'http', 'shared_preferences'],
      difficulty: 'Enterprise',
      securityScore: 98,
      qualityScore: 99,
      owaspCompliance: 'Certified A+',
      testedNodeVersion: 'v18, v20, v22'
    },
    tags: ['Flutter', 'Uber Clone', 'Boda Boda', 'GPS Tracking', 'Mobile Money', 'Socket.IO'],
    compatibility: ['iOS 14+', 'Android 8.0+', 'Node.js 20+', 'PostgreSQL / PostGIS'],
    changelog: [
      { version: 'v4.0.1', date: '2026-07-01', changes: ['Support Flutter 3.24 & Material 3', 'Optimisation batterie pour le tracking chauffeur en arrière-plan', 'Support MTN MoMo push STK'] }
    ],
    documentation: {
      quickStart: 'Ouvrez le dossier Flutter dans VS Code, lancez "flutter pub get" et configurez l adresse de votre serveur Node.js dans constants.dart.',
      requirements: ['Flutter SDK 3.24+', 'Node.js 20+', 'Google Maps API Key', 'PostgreSQL avec PostGIS'],
      installationSteps: [
        '1. Déployer le backend Node.js (npm install && npm start).',
        '2. Lier votre base PostgreSQL avec les migrations Prisma fournies.',
        '3. Compiler les applications Flutter Android (APK/AAB) et iOS avec votre certificat.'
      ],
      envVariables: [
        'PORT=5000',
        'DATABASE_URL="postgresql://user:pass@localhost:5432/afriride_db"',
        'GOOGLE_MAPS_SERVER_KEY="AIzaSy..."',
        'JWT_SECRET="super-secret-key-32chars"'
      ]
    },
    rating: 4.98,
    reviewsCount: 52,
    reviews: [
      {
        id: 'rev-3',
        author: 'Cedric M.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'Il y a 5 jours',
        comment: 'Application déployée pour une flotte de 40 motards à Douala. Zéro bug, l algorithme de dispatch fonctionne à merveille.',
        verifiedPurchase: true,
        likes: 18
      }
    ],
    likes: 310,
    dislikes: 4,
    views: 4920,
    downloadsCount: 512,
    author: {
      name: 'Vitech Mobile Labs',
      badge: 'Certified Developer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      verified: true
    },
    sampleCodeSnippet: `// Configuration de la connexion temps réel chauffeur - passager
import 'package:socket_io_client/socket_io_client.dart' as IO;

class RideSocketService {
  late IO.Socket socket;

  void connect(String token, String rideId) {
    socket = IO.io('https://api.afriride.com', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': true,
      'auth': {'token': token}
    });

    socket.on('driverLocationUpdate', (data) {
      print('Chauffeur position: lat \${data["lat"]}, lng \${data["lng"]}');
    });
  }
}`
  },

  {
    id: 'omnicloud-telemedicine-saas',
    slug: 'omnicloud-telemedicine-hospital-saas',
    title: 'OmniCloud Health - Dossier Médical & Téléconsultation WebRTC',
    tagline: 'SaaS Hospitalier complet avec visioconsultation chiffrée, ordonnances & MoMo',
    description: 'Plateforme complète de gestion clinique : téléconsultation HD chiffrée de bout en bout, dossier patient informatisé (DPI), gestion des rendez-vous, facturation Mobile Money et ordonnances sécurisées.',
    fullDescription: `OmniCloud Health répond aux normes internationales HIPAA et RGPD pour la gestion des données de santé. Développé avec React 19, Node.js et WebRTC Mesh sécurisé, il permet aux cliniques, hôpitaux et praticiens indépendants de gérer leur activité de A à Z.
    
Inclus : signature électronique des prescriptions, intégration des laboratoires d analyse, paiement d honoraires par MTN/Airtel MoMo et portail patient multi-langues.`,
    category: 'fullstack-saas',
    categoryLabel: 'Full-Stack SaaS & Cloud',
    priceUSD: 99,
    priceRWF: 132000,
    isFree: false,
    isPopular: true,
    isNew: false,
    isPremium: true,
    previewImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: 'https://demo.vitechafrica.com/health',
    analysis: {
      language: 'TypeScript & Node.js',
      framework: 'React 19 / Express / WebRTC',
      version: 'v2.8.0',
      fileSize: '32.1 MB',
      filesCount: 290,
      linesOfCode: 42000,
      dependenciesCount: 28,
      dependenciesList: ['react', 'lucide-react', 'simple-peer', 'socket.io', 'prisma', 'pdfmake', 'bcryptjs'],
      difficulty: 'Advanced',
      securityScore: 100,
      qualityScore: 98,
      owaspCompliance: 'Certified A+',
      testedNodeVersion: 'v20, v22 LTS'
    },
    tags: ['Telemedicine', 'React 19', 'WebRTC', 'Healthcare', 'SaaS', 'HIPAA'],
    compatibility: ['Chrome', 'Firefox', 'Safari', 'Edge', 'iOS Web', 'Android Web'],
    changelog: [
      { version: 'v2.8.0', date: '2026-05-20', changes: ['WebRTC chiffré E2EE', 'Prescription numérique avec QR Code d authentification'] }
    ],
    documentation: {
      quickStart: 'Exécutez "npm install", lancez "npm run db:push" et démarrez avec "npm run dev".',
      requirements: ['Node.js 20+', 'PostgreSQL ou MySQL 8', 'Certificat SSL HTTPS obligatoire pour WebRTC'],
      installationSteps: [
        '1. Cloner le repository.',
        '2. Remplir le .env avec vos informations de base de données.',
        '3. Lancer les migrations Prisma.',
        '4. Démarrer le serveur de production.'
      ],
      envVariables: [
        'DATABASE_URL="mysql://root:pass@localhost:3306/omnihealth"',
        'WEBRTC_STUN_SERVER="stun:stun.l.google.com:19302"',
        'JWT_SECRET="health-jwt-secret-key"'
      ]
    },
    rating: 4.92,
    reviewsCount: 29,
    reviews: [
      {
        id: 'rev-4',
        author: 'Dr. Amina Touré',
        avatar: 'https://images.unsplash.com/photo-1594824813589-389f41df0a7b?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'Il y a 2 semaines',
        comment: 'La qualité audio/vidéo WebRTC est bluffante même avec une connexion 3G/4G instable. Nos médecins l utilisent quotidiennement à Bamako.',
        verifiedPurchase: true,
        likes: 12
      }
    ],
    likes: 189,
    dislikes: 1,
    views: 3100,
    downloadsCount: 420,
    author: {
      name: 'Vitech Health Systems',
      badge: 'MedTech Verified',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      verified: true
    },
    sampleCodeSnippet: `// WebRTC Mesh Peer Connection Handshake
import Peer from 'simple-peer';

export function createPatientConsultationPeer(initiator, stream, onSignal) {
  const peer = new Peer({
    initiator,
    trickle: false,
    stream
  });

  peer.on('signal', data => onSignal(data));
  return peer;
}`
  },

  {
    id: 'finguard-ai-fraud-detector',
    slug: 'finguard-ai-fraud-anti-money-laundering',
    title: 'FinGuard AI - Détecteur de Fraude & Anti-Blanchiment (AML)',
    tagline: 'Microservice IA temps réel de détection d anomalies financières Python / FastAPI',
    description: 'Moteur d intelligence artificielle pour banques, microfinances et fintechs. Analyse les patterns de transactions, score le risque en <50ms et génère des alertes automatisées.',
    fullDescription: `FinGuard AI est un pipeline d intelligence artificielle entraîné sur des millions de transactions de paiement mobile et bancaire. Conçu avec Python 3.12, FastAPI et PyTorch / XGBoost, il calcule un score de risque de 0 à 100 pour chaque flux financier.
    
Comprend une interface web moderne React avec graphes de relations entre comptes, export de rapports conformité pour la Banque Centrale et blocage préventif automatisé.`,
    category: 'python-django',
    categoryLabel: 'Python & IA Machine Learning',
    priceUSD: 129,
    priceRWF: 172000,
    isFree: false,
    isPopular: false,
    isNew: true,
    isPremium: true,
    previewImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: 'https://demo.vitechafrica.com/finguard',
    analysis: {
      language: 'Python 3.12 & TypeScript',
      framework: 'FastAPI / React / PyTorch / Redis',
      version: 'v1.5.0',
      fileSize: '85.4 MB',
      filesCount: 110,
      linesOfCode: 18500,
      dependenciesCount: 22,
      dependenciesList: ['fastapi', 'uvicorn', 'torch', 'scikit-learn', 'xgboost', 'redis', 'pydantic'],
      difficulty: 'Enterprise',
      securityScore: 99,
      qualityScore: 97,
      owaspCompliance: 'Certified A+'
    },
    tags: ['Python', 'FastAPI', 'Machine Learning', 'Fintech', 'AML', 'Fraud Detection'],
    compatibility: ['Python 3.10+', 'Docker', 'Kubernetes', 'Linux Ubuntu / Debian'],
    changelog: [
      { version: 'v1.5.0', date: '2026-06-01', changes: ['Intégration du modèle Graph Neural Network pour détection de mules financières', 'Temps d inférence optimisé à 28ms'] }
    ],
    documentation: {
      quickStart: 'docker-compose up -d et accédez à l interface sur http://localhost:8000/docs.',
      requirements: ['Docker & Docker Compose', 'Python 3.12+', 'Redis 7+'],
      installationSteps: [
        '1. Cloner le repository.',
        '2. Lancer "pip install -r requirements.txt".',
        '3. Démarrer l API avec "uvicorn app.main:app --workers 4".'
      ],
      envVariables: [
        'REDIS_URL="redis://localhost:6379/0"',
        'MODEL_WEIGHTS_PATH="./models/finguard_v15.pt"',
        'RISK_ALERT_THRESHOLD=75'
      ]
    },
    rating: 4.97,
    reviewsCount: 18,
    reviews: [
      {
        id: 'rev-5',
        author: 'Kouamé B.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'Il y a 3 semaines',
        comment: 'Performance redoutable. Nous avons stoppé une vague de faux paiements MoMo dès la première semaine de test.',
        verifiedPurchase: true,
        likes: 16
      }
    ],
    likes: 142,
    dislikes: 0,
    views: 2200,
    downloadsCount: 189,
    author: {
      name: 'Vitech AI Research Group',
      badge: 'AI Specialist',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=120&q=80',
      verified: true
    },
    sampleCodeSnippet: `# FastAPI Endpoint for Real-time Fraud Scoring
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import torch

app = FastAPI(title="FinGuard AI Engine")

class TransactionPayload(BaseModel):
    account_id: str
    amount: float
    destination_msisdn: str
    velocity_10m: int
    hour_of_day: int

@app.post("/api/v1/score")
async def evaluate_transaction(txn: TransactionPayload):
    # Inférence Machine Learning sub-50ms
    risk_score = 12.4 # Calculé via PyTorch
    is_flagged = risk_score > 70.0
    return {
        "status": "APPROVED" if not is_flagged else "CHALLENGE_REQUIRED",
        "risk_score": risk_score,
        "action": "ALLOW" if not is_flagged else "MFA_SMS_TRIGGER"
    }`
  },

  {
    id: 'proclean-admin-bootstrap-kit',
    slug: 'proclean-bootstrap-tailwind-admin-kit',
    title: 'ProClean UI - Kit Admin Pro Max Bootstrap 5 & Tailwind',
    tagline: 'Template d administration ultra rapide, Dark/Light mode & 80+ composants prêts',
    description: 'Template dashboard moderne, ultra réactif, propre et commenté. Inclut graphiques interactifs (ApexCharts / Recharts), tableaux avec filtres avancés, formulaires validés et zéro dépendance superflue.',
    fullDescription: `ProClean UI est le starter kit d interface par excellence. Développé en HTML5 / SCSS / Bootstrap 5 et compatible Tailwind CSS, il offre un design d une clarté absolue inspiré d Apple et Stripe.
    
Idéal pour vos backoffices, portails SaaS, ERP et dashboards d administration. Livré avec fichiers sources SCSS organisés et variables CSS modulaires.`,
    category: 'ui-templates',
    categoryLabel: 'HTML5 / SCSS & Templates UI',
    priceUSD: 0,
    priceRWF: 0,
    isFree: true,
    isPopular: true,
    isNew: false,
    isPremium: false,
    previewImage: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: 'https://demo.vitechafrica.com/proclean',
    analysis: {
      language: 'HTML5, CSS3, JavaScript ES6',
      framework: 'Bootstrap 5.3 / SCSS / Tailwind Ready',
      version: 'v2.4.0',
      fileSize: '4.2 MB',
      filesCount: 65,
      linesOfCode: 8900,
      dependenciesCount: 4,
      dependenciesList: ['bootstrap', 'lucide-icons', 'apexcharts', 'flatpickr'],
      difficulty: 'Beginner',
      securityScore: 100,
      qualityScore: 99,
      owaspCompliance: 'Certified A+'
    },
    tags: ['Free', 'Bootstrap 5', 'Tailwind', 'Admin Dashboard', 'Dark Mode', 'HTML5'],
    compatibility: ['All Modern Browsers', 'Mobile', 'Tablet', 'Desktop'],
    changelog: [
      { version: 'v2.4.0', date: '2026-05-10', changes: ['Support complet Dark/Light mode persistant en localStorage', 'Nouvelle page de profil & sécurité'] }
    ],
    documentation: {
      quickStart: 'Ouvrez index.html dans n importe quel navigateur ou intégrez les fichiers SCSS dans votre build pipeline.',
      requirements: ['Navigateur web moderne ou Node.js / Sass compiler pour modifier le SCSS.'],
      installationSteps: [
        '1. Télécharger et extraire l archive ZIP.',
        '2. Lancer index.html.',
        '3. Personnaliser les variables SCSS dans /scss/_variables.scss.'
      ],
      envVariables: []
    },
    rating: 4.88,
    reviewsCount: 76,
    reviews: [
      {
        id: 'rev-6',
        author: 'Samuel K.',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'Il y a 1 mois',
        comment: 'Incroyable que ce template soit 100% gratuit ! Les animations et le dark mode sont ultra soignés.',
        verifiedPurchase: true,
        likes: 31
      }
    ],
    likes: 540,
    dislikes: 1,
    views: 8900,
    downloadsCount: 2450,
    author: {
      name: 'Vitech Design Guild',
      badge: 'UI/UX Master',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      verified: true
    },
    sampleCodeSnippet: `<!-- Structure d'une carte KPI ProClean UI -->
<div class="card bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500 transition-all">
  <div class="d-flex align-items-center justify-content-between">
    <span class="text-xs text-slate-400 font-medium">Revenu Quotidien (RWF)</span>
    <span class="badge bg-emerald-950 text-emerald-400 border border-emerald-500/30">+14.2%</span>
  </div>
  <h3 class="text-2xl font-bold text-white mt-2">1,450,000 RWF</h3>
  <div class="text-xs text-slate-500 mt-1">Transactions validées instantanément</div>
</div>`
  },

  {
    id: 'supershop-multivendor-laravel',
    slug: 'supershop-ecommerce-multivendor-script',
    title: 'SuperShop - Place de Marché Multi-Vendeurs E-Commerce',
    tagline: 'Marketplace complète Laravel 11, app vendeur, gestion des stocks & MoMo',
    description: 'Plateforme e-commerce multi-vendeurs avec commissions configurables, gestion des livraisons, paiements MTN / Airtel MoMo et facturation automatique pour chaque boutique.',
    fullDescription: `SuperShop transforme votre projet en un véritable Amazon / Jumia panafricain. Chaque vendeur dispose d un tableau de bord privé pour ajouter ses produits, gérer ses stocks, suivre ses commandes et demander ses retraits de fonds (payouts).
    
Inclut moteur de recherche élastique, coupons promo, gestion des avis clients, notifications WhatsApp pour les commandes et calcul automatique des taxes locales.`,
    category: 'php-laravel',
    categoryLabel: 'PHP & Laravel',
    priceUSD: 59,
    priceRWF: 78000,
    isFree: false,
    isPopular: true,
    isNew: false,
    isPremium: true,
    previewImage: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1556742049-0a67e55722c0?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: 'https://demo.vitechafrica.com/supershop',
    analysis: {
      language: 'PHP 8.4',
      framework: 'Laravel 11 / Livewire 3 / Tailwind',
      version: 'v4.1.0',
      fileSize: '24.6 MB',
      filesCount: 310,
      linesOfCode: 38000,
      dependenciesCount: 20,
      dependenciesList: ['laravel/framework', 'livewire/livewire', 'spatie/laravel-permission', 'stripe/stripe-php'],
      difficulty: 'Intermediate',
      securityScore: 98,
      qualityScore: 98,
      owaspCompliance: 'Certified A+'
    },
    tags: ['Laravel', 'Marketplace', 'Multi-Vendor', 'E-Commerce', 'Mobile Money', 'Shop'],
    compatibility: ['PHP 8.2+', 'MySQL 8.0+', 'Redis', 'Apache / Nginx'],
    changelog: [
      { version: 'v4.1.0', date: '2026-04-18', changes: ['Intégration Livewire 3 pour panier instantané sans rechargement', 'Support paiement par QR Code Mobile Money'] }
    ],
    documentation: {
      quickStart: 'composer install && npm install && php artisan migrate --seed',
      requirements: ['PHP 8.2+', 'MySQL 8+', 'Composer 2+'],
      installationSteps: [
        '1. Cloner ou uploader l archive.',
        '2. Créer la base de données.',
        '3. Lancer les migrations et seeds initiaux.',
        '4. Configurer le cron job pour les rapports de ventes.'
      ],
      envVariables: [
        'APP_NAME="SuperShop Marketplace"',
        'DB_DATABASE=supershop_db'
      ]
    },
    rating: 4.91,
    reviewsCount: 44,
    reviews: [
      {
        id: 'rev-7',
        author: 'Fatou Diagne',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'Il y a 2 semaines',
        comment: 'Très simple à configurer, nos 60 vendeurs à Dakar gèrent leurs boutiques sans aucune difficulté.',
        verifiedPurchase: true,
        likes: 11
      }
    ],
    likes: 215,
    dislikes: 3,
    views: 3400,
    downloadsCount: 470,
    author: {
      name: 'Vitech Core Engineering',
      badge: 'Elite Author',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=120&q=80',
      verified: true
    },
    sampleCodeSnippet: `<?php
// Distribution des commissions multi-vendeurs avec déduction automatique
namespace App\\Services;

class MarketplaceCommissionService {
    public function processPayout($orderItem) {
        $vendorRate = 0.90; // 90% pour le vendeur, 10% pour la plateforme
        $vendorAmount = $orderItem->total_price * $vendorRate;
        $platformFee = $orderItem->total_price * (1 - $vendorRate);

        $orderItem->vendor->wallet->credit($vendorAmount, 'Vente de commande #' . $orderItem->order_id);
        return ['vendor_paid' => $vendorAmount, 'platform_fee' => $platformFee];
    }
}`
  },

  {
    id: 'wp-momo-gateway-plugin',
    slug: 'wp-woocommerce-momo-airtel-rwanda-plugin',
    title: 'WooCommerce MTN & Airtel Money Rwanda Plugin Pro',
    tagline: 'Plugin WordPress officiel pour accepter les paiements mobiles instantanés',
    description: 'Le plugin le plus léger et sécurisé pour connecter WooCommerce aux API MTN Mobile Money et Airtel Money au Rwanda et en Afrique de l Est. Validation instantanée des commandes.',
    fullDescription: `Permet à vos clients WooCommerce de payer directement depuis leur téléphone avec demande de validation PIN (USSD Push STK). Mise à jour automatique de la commande en "En cours de traitement" dès réception du webhook.
    
Compatible avec toutes les versions de WordPress 6.x et WooCommerce 8.x/9.x. Zéro conflit, code optimisé et traduction française/anglaise/kinyarwanda incluse.`,
    category: 'wordpress-plugins',
    categoryLabel: 'WordPress & WooCommerce',
    priceUSD: 29,
    priceRWF: 38000,
    isFree: false,
    isPopular: false,
    isNew: true,
    isPremium: true,
    previewImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80'
    ],
    liveDemoUrl: 'https://demo.vitechafrica.com/wp-momo',
    analysis: {
      language: 'PHP 8.2+ & WordPress API',
      framework: 'WordPress Plugin Boilerplate / OOP',
      version: 'v2.1.0',
      fileSize: '1.2 MB',
      filesCount: 18,
      linesOfCode: 2400,
      dependenciesCount: 0,
      dependenciesList: ['Native WordPress HTTP API'],
      difficulty: 'Beginner',
      securityScore: 100,
      qualityScore: 99,
      owaspCompliance: 'Certified A+'
    },
    tags: ['WordPress', 'WooCommerce', 'Plugin', 'MTN MoMo', 'Airtel Money', 'Rwanda'],
    compatibility: ['WordPress 6.0+', 'WooCommerce 8.0+', 'PHP 7.4 to 8.4'],
    changelog: [
      { version: 'v2.1.0', date: '2026-06-25', changes: ['Support WooCommerce High-Performance Order Storage (HPOS)', 'Rapports de réconciliation dans l admin WP'] }
    ],
    documentation: {
      quickStart: 'Uploadez le fichier zip dans Extensions > Ajouter > Téléverser, puis entrez vos clés API dans Réglages WooCommerce > Paiements.',
      requirements: ['WordPress 6.0+', 'WooCommerce 8.0+', 'Clés Marchand MTN ou Airtel'],
      installationSteps: [
        '1. Aller dans Extensions > Ajouter une extension.',
        '2. Téléverser le fichier vitech-momo-woocommerce.zip.',
        '3. Activer l extension.',
        '4. Renseigner votre Subscription Key et User ID.'
      ],
      envVariables: []
    },
    rating: 4.96,
    reviewsCount: 31,
    reviews: [
      {
        id: 'rev-8',
        author: 'Patrick K.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
        rating: 5,
        date: 'Il y a 1 semaine',
        comment: 'Installé en 5 minutes sur notre boutique de Kigali, les commandes passent instantanément en payées sans faille !',
        verifiedPurchase: true,
        likes: 8
      }
    ],
    likes: 165,
    dislikes: 1,
    views: 2800,
    downloadsCount: 340,
    author: {
      name: 'Vitech Core Engineering',
      badge: 'Elite Author',
      avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=120&q=80',
      verified: true
    },
    sampleCodeSnippet: `<?php
/**
 * WooCommerce MTN MoMo Payment Gateway Class
 */
class WC_Gateway_Vitech_MoMo extends WC_Payment_Gateway {
    public function __construct() {
        $this->id = 'vitech_momo';
        $this->method_title = 'MTN Mobile Money Rwanda (Vitech)';
        $this->has_fields = true;
        $this->init_form_fields();
        $this->init_settings();
    }

    public function process_payment($order_id) {
        $order = wc_get_order($order_id);
        // Envoi de la requête USSD push MTN
        return array(
            'result'   => 'success',
            'redirect' => $this->get_return_url($order)
        );
    }
}`
  }
];
