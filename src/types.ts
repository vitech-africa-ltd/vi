export interface ServiceItem {
  id: string;
  title: string;
  shortDesc?: string;
  fullDesc?: string;
  description?: string;
  subtitle?: string;
  iconName?: string;
  icon?: string;
  category?: string;
  tags?: string[];
  features?: string[];
  deliverables?: string[];
  startingPrice: string;
  estimatedTimeline?: string;
  timeline?: string;
  sla?: string;
  techStack?: string[];
  technologies?: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  country: string;
  countryFlag: string;
  category: string;
  description?: string;
  summary?: string;
  challenge?: string;
  solution?: string;
  architecture?: string;
  results?: {
    label: string;
    value: string;
    subtext?: string;
  }[];
  impactMetric?: string;
  techStack?: string[];
  technologies?: string[];
  clientQuote?: {
    text: string;
    author: string;
    role: string;
    avatar?: string;
  };
  image: string;
  liveUrl?: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  tags?: string[];
  image: string;
  likes?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  country?: string;
  countryCode?: string;
  flag?: string;
  avatar?: string;
  content: string;
  rating: number;
  projectDelivered?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  specialty: string;
  country: string;
  avatar: string;
  bio: string;
  skills: string[];
}

export interface ProjectMilestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  status: 'completed' | 'in_progress' | 'upcoming';
  dueDate: string;
  deliverables: string[];
}

export interface VaultFile {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'code' | 'design' | 'doc' | 'archive';
  category: 'contracts' | 'specs' | 'deliverables' | 'security' | 'invoices';
  uploadedAt: string;
  version: string;
  encrypted: boolean;
  url?: string;
}

export interface TeamPermissionUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'tech_lead' | 'product_manager' | 'viewer';
  avatar: string;
  lastActive: string;
  permissions: {
    canViewCode: boolean;
    canDeployStaging: boolean;
    canDownloadInvoices: boolean;
    canManageAPIKeys: boolean;
    canManageTeam: boolean;
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'engineer';
  text: string;
  timestamp: string;
  isAi?: boolean;
  sources?: string[];
  escalatedToHuman?: boolean;
}

export interface AIAssistantConfig {
  assistantName: string;
  systemPrompt: string;
  welcomeMessage: string;
  tone: 'consultative' | 'technical' | 'executive' | 'concise';
  temperature: number;
  model: string;
  language: string;
  keyServices: string[];
  contactWhatsApp: string;
  contactEmail: string;
  enableDirectBooking: boolean;
  enablePricingEstimates: boolean;
  updatedAt?: string;
  updatedBy?: string;
}

export interface ContactDraft {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  projectType: string;
  targetPlatforms: string[];
  featuresNeeded: string[];
  budget: string;
  timeline: string;
  description: string;
  needNDA: boolean;
  lastSaved?: string;
}

export interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  serviceNeeded: string;
  budgetRange: string;
  timeline: string;
  projectDescription: string;
  ndaRequired: boolean;
}

export interface OfficeHub {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  title: string;
  address: string;
  position: { lat: number; lng: number };
  role: string;
  engineersCount: number;
  phone: string;
  leadArchitect: string;
  leadAvatar: string;
  specialization: string;
  tags: string[];
}
