export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: string;
  bio: string;
  avatar: string;
  location: string;
  skills: string[];
  socialLinks: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    email?: string;
  };
  highlightQuote?: string;
  featured: boolean;
}

export const INITIAL_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'vab-founder',
    name: 'Vab',
    role: 'Co-Founder & Chief Technology Officer (CTO)',
    department: 'Executive & Software Architecture',
    bio: 'Architecte logiciel chevronné et visionnaire tech. Expert en conception de systèmes distribués ultra-résilients, microservices haute performance, architectures Cloud DevOps et protocoles de paiement Mobile Money sécurisés à l échelle panafricaine.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    location: 'Kigali, Rwanda & Diaspora Tech',
    skills: ['Enterprise Software Architecture', 'PHP 8.4 & Laravel', 'Node.js & Go', 'Fintech Security', 'Distributed Systems'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      email: 'contact.vitechdev@gmail.com'
    },
    highlightQuote: 'Bâtir l infrastructure numérique qui connecte l Afrique au futur du développement mondial.',
    featured: true
  },
  {
    id: 'idriss-founder',
    name: 'Idriss',
    role: 'Co-Founder & Chief Executive Officer (CEO)',
    department: 'Strategy & Global Partnerships',
    bio: 'Stratège tech et entrepreneur panafricain. Dirige l expansion stratégique, les alliances institutionnelles et le développement commercial de Vitech Africa et de la marketplace Vitech Scripts à travers les pôles de Kigali, Dakar, Abidjan et Paris.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    location: 'Kigali, Rwanda & Panafrican Hubs',
    skills: ['Tech Leadership', 'SaaS Monetization', 'International Partnerships', 'Fintech Growth', 'Product Strategy'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      email: 'contact.vitechdev@gmail.com'
    },
    highlightQuote: 'L excellence de l ingénierie logicielle au service de la souveraineté technologique africaine.',
    featured: true
  },
  {
    id: 'lead-devsecops',
    name: 'Dr. Malik Sy',
    role: 'Head of Cybersecurity & DevSecOps',
    department: 'Security & Cloud Infrastructure',
    bio: 'Spécialiste certifié CISSP et CEH. Responsable des audits de sécurité de code source, de la conformité OWASP Top 10 et du déploiement des pipelines CI/CD zero-trust pour tous les scripts et plateformes Vitech.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    location: 'Dakar Hub, Sénégal',
    skills: ['DevSecOps', 'Penetration Testing', 'Kubernetes & Docker', 'OWASP Hardening', 'Zero Trust'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    featured: true
  },
  {
    id: 'lead-mobile-flutter',
    name: 'Amina Habimana',
    role: 'Principal Mobile & Cross-Platform Engineer',
    department: 'Mobile Engineering',
    bio: 'Lead Flutter & Cross-Platform. Pionnière des applications de mobilité urbaine, portefeuilles électroniques et systèmes offline-first optimisés pour les réseaux télécoms africains.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    location: 'Kigali Hub, Rwanda',
    skills: ['Flutter & Dart', 'Kotlin Native', 'Swift', 'WebSockets', 'Offline-First DB'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com',
      twitter: 'https://twitter.com'
    },
    featured: true
  },
  {
    id: 'lead-fullstack-ai',
    name: 'Yannick N’Goran',
    role: 'Senior Full-Stack & AI Systems Architect',
    department: 'AI & Data Engineering',
    bio: 'Ingénieur polyglotte spécialisé dans l intégration de modèles d IA générative, architectures microservices FastAPI / React et optimisation des requêtes de données à haute vélocité.',
    avatar: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80',
    location: 'Abidjan Hub, Côte d’Ivoire',
    skills: ['React 19 & Next.js', 'FastAPI & PyTorch', 'Gemini & RAG', 'PostgreSQL', 'Redis'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      github: 'https://github.com'
    },
    featured: false
  },
  {
    id: 'lead-ui-ux',
    name: 'Sarah El-Mansouri',
    role: 'Lead UI/UX & Motion Interaction Designer',
    department: 'Design & Experience',
    bio: 'Designer d interfaces premium "Pro Max". Conçoit les systèmes de design, animations micro-interactives, Dark/Light modes et expériences immersives inspirées de Stripe et Apple.',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80',
    location: 'Casablanca & Paris',
    skills: ['Design Systems', 'Figma Pro', 'Tailwind CSS', 'Framer Motion', 'Accessibility'],
    socialLinks: {
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com'
    },
    featured: false
  }
];
