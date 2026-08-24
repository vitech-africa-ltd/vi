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
  techCategory?: 'Cloud' | 'AI' | 'Web' | 'Mobile' | string;
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

export interface DigitalSignatureData {
  signerName: string;
  signerRole: string;
  signerEmail: string;
  signerCompany: string;
  signatureType: 'draw' | 'type' | 'upload';
  signatureDataUrl?: string;
  signedAt: string;
  timestampUtc: string;
  certificateId: string;
  verificationHash: string;
  ipAddress?: string;
  consentGiven: boolean;
  securityPin?: string;
  legalStatement?: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  docRef: string;
  documentType: 'contract' | 'spec' | 'audit' | 'delivery_report' | 'sla' | 'invoice' | 'nda';
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  hashSha256: string;
  version: string;
  encrypted: boolean;
  signatories?: string[];
  status: 'draft' | 'signed' | 'certified' | 'archived';
  uploadedAt: string;
  description: string;
  keyPoints?: string[];
  userId?: string;
  signatureRequired?: boolean;
  clientSignature?: DigitalSignatureData;
}

export type AuditActionType = 
  | 'signature_created' 
  | 'document_downloaded' 
  | 'document_viewed' 
  | 'document_uploaded' 
  | 'hash_verified' 
  | 'milestone_validated';

export interface DocumentAuditLog {
  id: string;
  projectId: string;
  documentId?: string;
  documentTitle?: string;
  docRef?: string;
  actionType: AuditActionType;
  actorName: string;
  actorRole: string;
  actorEmail?: string;
  actorCompany?: string;
  timestamp: string; // e.g. "24 Août 2026 10:45:12"
  timestampUtc: string; // ISO 8601 UTC
  ipAddress?: string;
  userAgent?: string;
  certificateId?: string;
  hashSha256?: string;
  verificationStatus: 'verified' | 'tamper_proof' | 'certified' | 'standard';
  details?: string;
  metadata?: {
    signatureType?: 'draw' | 'type' | 'upload';
    securityPinUsed?: boolean;
    fileSize?: string;
    version?: string;
    documentType?: string;
    milestoneId?: string;
    downloadSpeed?: string;
    clientPlatform?: string;
    [key: string]: any;
  };
}

export interface LiveAnnouncementConfig {
  enabled: boolean;
  badge: string;
  message: string;
  couponCode?: string;
  linkText?: string;
  targetView?: string;
  theme: 'emerald' | 'cyan' | 'amber' | 'purple' | 'rose';
  updatedAt?: string;
}

export type NotificationType = 
  | 'document_uploaded' 
  | 'document_signed' 
  | 'milestone_validated' 
  | 'audit_completed' 
  | 'security_alert' 
  | 'system_update';

export interface ClientNotification {
  id: string;
  projectId?: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  timestampUtc: string;
  read: boolean;
  docId?: string;
  docRef?: string;
  milestoneId?: string;
  actionUrl?: string;
  actionLabel?: string;
  actorName?: string;
}

export interface ClientProject {
  id: string;
  name: string;
  clientName: string;
  leadArchitect: string;
  status: string;
  currentSprint: string;
  overallProgress: number;
  startDate: string;
  targetDelivery: string;
  stagingUrl: string;
  repoUrl: string;
  budgetTotal: string;
  budgetSpent: string;
  estimatedHours?: number;
  spentHours?: number;
  milestones: ProjectMilestone[];
  vaultFiles?: VaultFile[];
  teamPermissions?: TeamPermissionUser[];
  telemetry?: {
    uptime: string;
    avgLatency: string;
    requestsTotal: string;
    errorRate: string;
    activeServerNodes: number;
    lastBackup: string;
  };
}

export type InvoiceStatus = 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
export type InvoiceType = 'invoice' | 'estimate' | 'deposit';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category?: 'development' | 'cloud' | 'audit' | 'consulting' | 'license';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  type: InvoiceType;
  clientName: string;
  clientCompany: string;
  clientEmail: string;
  clientAddress?: string;
  clientTaxId?: string;
  currency: string;
  currencySymbol: string;
  issueDate: string;
  dueDate: string;
  status: InvoiceStatus;
  items: InvoiceLineItem[];
  subtotal: number;
  taxRate: number; // e.g. 18 for 18% or 0
  taxAmount: number;
  totalAmount: number;
  depositPercentage?: number;
  paidAmount?: number;
  paymentMethod?: 'bank_transfer' | 'mtn_momo' | 'orange_money' | 'wave' | 'card' | 'crypto';
  paymentReference?: string;
  paidAt?: string;
  notes?: string;
  bankDetails?: {
    bankName: string;
    iban: string;
    swift: string;
    accountName: string;
    momoNumber?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ClientDraftReport {
  id: string;
  projectId: string;
  authorName: string;
  authorEmail: string;
  category: 'sprint_feedback' | 'milestone_approval' | 'incident_report' | 'feature_request' | 'governance_note';
  title: string;
  content: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  relatedMilestoneId?: string;
  actionItems?: string[];
  lastSavedAt: string;
  status: 'draft' | 'submitted' | 'archived';
}

