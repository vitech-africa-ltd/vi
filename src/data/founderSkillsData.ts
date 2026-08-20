// ============================================================================
// V&I TECH AFRICA LTD — COMPÉTENCES PRINCIPALES, PROFIL & PROJETS TECHNIQUES
// Source de vérité officielle pour les compétences, l'ingénierie et le parcours
// ============================================================================

export interface TechnicalSkill {
  name: string;
  category: 'dev' | 'desktop' | 'digital' | 'soft';
  percentage?: number;
  level: string;
  iconName?: string;
  description?: string;
}

export interface FlagshipProject {
  id: string;
  title: string;
  subtitle: string;
  category: 'desktop' | 'digital-enterprise' | 'marketplace' | 'management';
  techStack: string[];
  features: string[];
  description: string;
  link?: string;
  badge?: string;
}

export interface EducationItem {
  degree: string;
  institution: string;
  location: string;
  campus: string;
  level: string;
  coreDisciplines: string[];
}

export interface JobOpportunityCategory {
  category: string;
  iconName: string;
  roles: string[];
}

export const FOUNDER_PROFILE = {
  role: 'Founder / Digital Solutions Developer',
  company: 'Vab&Idriss Tech / Vitech Africa',
  location: 'Rwanda (Kigali / Gisenyi)',
  availability: 'Disponibilité Immédiate',
  email: 'contact.vitechdev@gmail.com',
  phone: '+250 792 124 342',
  whatsapp: '+250 795 507 001',
  responsibilities: [
    "Conception et développement d'applications web & desktop modernes",
    "Développement de solutions numériques d'entreprise et digitalisation des processus",
    "Gestion de projets informatiques de bout en bout",
    "Création d'interfaces utilisateur (UI/UX) ergonomiques",
    "Intégration d'API complexes & passerelles Mobile Money (MTN MoMo, Airtel Money)",
    "Gestion et modélisation de bases de données relationnelles (SQL, MySQL, SQLite)",
    "Assistance technique, dépannage et maintenance informatique",
    "Communication avec les clients & accompagnement personnalisé",
    "Conception de supports professionnels et visuels marketing",
    "Recherche et implémentation de solutions adaptées aux contraintes métiers",
  ],
};

export const FOUNDER_EDUCATION: EducationItem = {
  degree: 'Bachelor / Licence – Computer Science / Software Engineering',
  institution: 'University of Kigali (ULK)',
  campus: 'Gisenyi Campus, Rwanda',
  location: 'Rwanda',
  level: 'Year 2 (En cours d\'excellence)',
  coreDisciplines: [
    'Programmation orientée objet & algorithmique avancée',
    'Génie logiciel & cycles de développement (SDLC)',
    'Bases de données relationnelles (SQL, MySQL, SQLite)',
    'Développement web moderne (Fullstack)',
    'Systèmes informatiques & réseaux',
    'Conception et modélisation de logiciels (UML)',
    'Architecture applicative & desktop',
  ],
};

export const TECHNICAL_SKILLS_MATRIX: TechnicalSkill[] = [
  // Développement Web & Informatique
  { name: 'HTML / CSS', category: 'dev', percentage: 90, level: 'Expert (90%)', description: 'Intégration responsive, animations modernes et accessibilité' },
  { name: 'PHP', category: 'dev', percentage: 85, level: 'Avancé (85%)', description: 'Backends robustes, architecture MVC et scripts serveurs' },
  { name: 'API Integration', category: 'dev', percentage: 85, level: 'Avancé (85%)', description: 'Intégration RESTful, Webhooks, Mobile Money & services tiers' },
  { name: 'JavaScript', category: 'dev', percentage: 80, level: 'Avancé (80%)', description: 'DOM manipulation, ES6+, asynchronisme & logique front-end' },
  { name: 'TypeScript', category: 'dev', percentage: 80, level: 'Avancé (80%)', description: 'Typage strict, architectures modulaires et maintenance' },
  { name: 'SQL / MySQL / SQLite', category: 'dev', percentage: 80, level: 'Avancé (80%)', description: 'Schémas relationnels, requêtes optimisées et exports' },
  { name: 'Python', category: 'dev', percentage: 70, level: 'Maîtrisé (70%)', description: 'Automatisation, Tkinter GUI, scripts de traitement de données' },
  { name: 'C++', category: 'dev', percentage: 70, level: 'Maîtrisé (70%)', description: 'Algorithmique, structures de données et logique bas-niveau' },
  { name: 'Java', category: 'dev', percentage: 60, level: 'Intermédiaire (60%)', description: 'Programmation orientée objet et structures modulaires' },
  { name: 'C# / .NET / WPF', category: 'dev', percentage: 75, level: 'Intermédiaire / Solide', description: 'Applications desktop riches avec interfaces graphiques WPF modernes' },
  { name: 'React / Vite', category: 'dev', percentage: 75, level: 'Intermédiaire / Solide', description: 'Composants interactifs, SPA ultra-rapides et gestion d\'état' },
  { name: 'Laravel', category: 'dev', percentage: 75, level: 'Intermédiaire', description: 'Framework PHP moderne, ORM Eloquent et authentification' },
  { name: 'Bootstrap / Tailwind CSS', category: 'dev', percentage: 85, level: 'Avancé', description: 'Design systems, utilitaires CSS et interfaces soignées' },
  { name: 'Git / GitHub', category: 'dev', percentage: 85, level: 'Avancé', description: 'Contrôle de version, collaboration et gestion de dépôts' },
  { name: 'Maintenance & Dépannage IT', category: 'dev', percentage: 85, level: 'Avancé', description: 'Diagnostic matériel/logiciel, installation et assistance technique' },
];

export const DESKTOP_SYSTEMS_SKILLS = [
  "Développement d'applications desktop professionnelles",
  "C# / .NET / WPF (Windows Presentation Foundation)",
  "Python Tkinter & Interfaces graphiques",
  "Gestion et optimisation de bases de données locales (SQLite, MySQL)",
  "Export et traitement de données (Excel, PDF, CSV)",
  "Installation et configuration de logiciels d'entreprise",
  "Assistance directe aux utilisateurs et formation",
  "Diagnostic et résolution de pannes informatiques",
];

export const DIGITAL_SOLUTIONS_SKILLS = [
  "Intégration de paiements Mobile Money (MTN MoMo, Airtel Money, Wave)",
  "Développement de solutions web sur-mesure",
  "Digitalisation complète des processus métiers et formulaires",
  "Création de sites web professionnels (vitrine, corporate, e-commerce)",
  "Gestion de projets numériques agiles et suivi de livrables",
];

export const PROFESSIONAL_SOFT_SKILLS = [
  "Service clientèle et orientation satisfaction client",
  "Communication claire, professionnelle et proactive",
  "Travail en équipe et collaboration transverse",
  "Résolution méthodique de problèmes complexes",
  "Gestion rigoureuse des données et conformité",
  "Assistance administrative et organisationnelle",
  "Vente, négociation et présentation de solutions technologiques",
  "Adaptation rapide aux nouvelles technologies et exigences",
  "Capacité éprouvée de travail sous pression et respect des délais",
  "Apprentissage autonome continu et veille technologique",
];

export const FLAGSHIP_PROJECTS_DATA: FlagshipProject[] = [
  {
    id: 'vi-manager-system',
    title: 'V&I Manager System',
    subtitle: 'Application Desktop de Gestion d\'Entreprise Complète',
    category: 'desktop',
    techStack: ['C#', '.NET', 'WPF', 'SQLite', 'Excel Export Engine'],
    badge: 'Flagship Desktop Software',
    description: 'Application desktop robuste conçue pour la gestion des opérations d\'entreprise, le suivi des stocks, la facturation et l\'analyse de données avec base SQLite embarquée et export Excel automatisé.',
    features: [
      'Gestion complète des données et transactions opérationnelles',
      'Base de données locale SQLite haute performance sans configuration serveur requise',
      'Gestion des opérations, stocks et facturation client',
      'Module d\'export de données instantané vers Microsoft Excel / PDF',
      'Interface graphique moderne et intuitive avec C# WPF',
      'Visualisation analytique des données et graphiques récapitulatifs',
    ],
  },
  {
    id: 'vitech-africa-platform',
    title: 'Vitech Africa – Digital Solutions',
    subtitle: 'Projet Entrepreneurial & Plateforme Technologique',
    category: 'digital-enterprise',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Mobile Money API', 'Vite'],
    badge: 'Active Enterprise Platform',
    link: 'https://vitechafrica.vercel.app',
    description: 'Écosystème digital panafricain spécialisé dans la transformation numérique, le développement web d\'excellence, le design de marque et l\'intégration de solutions de paiement.',
    features: [
      'Développement web sur-mesure et architectures scalables',
      'Solutions numériques et digitalisation des processus',
      'Transformation digitale pour entreprises et institutions',
      'Design professionnel (UI/UX, identité de marque, chartes graphiques)',
      'Intégration de solutions de paiement panafricaines et internationales',
      'Prestations de services informatiques et infogérance',
    ],
  },
  {
    id: 'vitech-scripts',
    title: 'Vitech Scripts',
    subtitle: 'Marketplace Numérique de Scripts & Templates Clé en Main',
    category: 'marketplace',
    techStack: ['PHP', 'JavaScript', 'Tailwind CSS', 'MySQL', 'APIs'],
    badge: 'Digital Marketplace',
    description: 'Place de marché numérique destinée aux développeurs et entreprises, proposant des templates prêts à l\'emploi, des scripts réutilisables et des produits digitaux téléchargeables.',
    features: [
      'Catalogue de scripts informatiques et modules prêts à l\'emploi',
      'Templates web et tableaux de bord d\'administration',
      'Solutions web packagées et personnalisables',
      'Produits numériques avec livraison automatisée',
      'Services de développement et personnalisation à la demande',
    ],
  },
  {
    id: 'smartpharma-management',
    title: 'SmartPharma / MyLibrary / Solutions de Gestion',
    subtitle: 'Suite d\'Applications & Prototypes Spécialisés',
    category: 'management',
    techStack: ['C#', 'PHP', 'SQLite', 'MySQL', 'Bootstrap'],
    badge: 'Domain Management Suites',
    description: 'Développement de solutions applicatives ciblées pour résoudre des problématiques concrètes de gestion de stocks pharmaceutiques, catalogues de bibliothèques et suivi administratif.',
    features: [
      'SmartPharma : Gestion des ordonnances, péremptions de médicaments et stocks',
      'MyLibrary : Gestion des emprunts, catalogues d\'ouvrages et fiches membres',
      'Solutions de gestion sur-mesure pour PME et commerces locaux',
      'Interface intuitive adaptée aux utilisateurs non-techniques',
    ],
  },
];

export const OPEN_JOB_OPPORTUNITIES: JobOpportunityCategory[] = [
  {
    category: 'IT / Technologie & Ingénierie',
    iconName: 'Code2',
    roles: [
      'Junior Software Developer (Front-end, Back-end ou Fullstack)',
      'Web Developer (React, TypeScript, PHP, Laravel, HTML/CSS)',
      'IT Support & Assistance Technique',
      'IT Technician / Maintenance de parc informatique',
      'Computer Operator / Opérateur de saisie et de systèmes',
      'Technical Assistant / Support d\'ingénierie',
      'Data Entry / Data Assistant & Traitement de données',
    ],
  },
  {
    category: 'Administration & Opérations',
    iconName: 'Building2',
    roles: [
      'Administrative Assistant',
      'Operations Assistant',
      'Office Assistant / Gestion de bureau',
      'Data Clerk & Archivage numérique',
      'Store / Stock Assistant & Gestion des inventaires',
    ],
  },
  {
    category: 'Commercial, Vente & Service Client',
    iconName: 'Users',
    roles: [
      'Sales Representative',
      'Sales Assistant / Support commercial',
      'Customer Service & Relation client',
      'Business Development Assistant',
      'Digital Sales & Prospection numérique',
    ],
  },
  {
    category: 'Autres Opportunités & Missions Flexibles',
    iconName: 'Briefcase',
    roles: [
      'Field Assistant / Missions de terrain',
      'General Assistant',
      'Hotel / Restaurant Assistant',
      'Temporary / Contract Work (CDD, Freelance, Projets)',
    ],
  },
];
