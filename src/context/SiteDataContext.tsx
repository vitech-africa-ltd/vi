import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  COMPANY_INFO as defaultCompanyInfo, 
  SERVICES_DATA as defaultServices, 
  CASE_STUDIES_DATA as defaultCaseStudies, 
  OFFICES_HUBS_DATA as defaultTechHubs, 
  TESTIMONIALS_DATA as defaultTestimonials, 
  BLOG_POSTS_DATA as defaultBlogPosts,
  DEFAULT_AI_CONFIG,
} from '../data/companyData';
import { INITIAL_TEAM_MEMBERS, TeamMember } from '../data/teamData';
import { INITIAL_SCRIPTS, ScriptProduct } from '../data/scriptsData';
import { 
  ServiceItem, 
  CaseStudy, 
  BlogPost, 
  Testimonial, 
  OfficeHub, 
  AIAssistantConfig,
  LiveAnnouncementConfig,
  GoogleAdsConfig
} from '../types';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { DEFAULT_GOOGLE_ADS_CONFIG, initGoogleAdsScripts } from '../services/googleAdsService';

export const DEFAULT_ANNOUNCEMENT: LiveAnnouncementConfig = {
  enabled: true,
  badge: '🚀 VITECH 2026',
  message: 'Nouvelle suite Vitech Scripts & Passerelles Mobile Money Rwanda (MTN & Airtel) en ligne !',
  couponCode: 'KIGALI2026',
  linkText: 'Découvrir la Marketplace',
  targetView: 'scripts',
  theme: 'emerald',
  updatedAt: new Date().toISOString(),
};

interface SiteDataContextType {
  companyInfo: typeof defaultCompanyInfo;
  services: ServiceItem[];
  caseStudies: CaseStudy[];
  blogPosts: BlogPost[];
  techHubs: OfficeHub[];
  testimonials: Testimonial[];
  aiConfig: AIAssistantConfig;
  teamMembers: TeamMember[];
  scriptProducts: ScriptProduct[];
  liveAnnouncement: LiveAnnouncementConfig;
  googleAdsConfig: GoogleAdsConfig;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: string | null;

  // CMS update methods
  updateCompanyInfo: (data: Partial<typeof defaultCompanyInfo>) => Promise<boolean>;
  
  // AI Assistant CMS Config
  updateAiConfig: (data: Partial<AIAssistantConfig>) => Promise<boolean>;
  resetAiConfigToDefault: () => Promise<boolean>;

  // Google Ads & AdSense Config
  updateGoogleAdsConfig: (data: Partial<GoogleAdsConfig>) => Promise<boolean>;


  // Services
  addService: (service: ServiceItem) => Promise<boolean>;
  updateService: (service: ServiceItem) => Promise<boolean>;
  deleteService: (serviceId: string) => Promise<boolean>;

  // Case Studies / Portfolio
  addCaseStudy: (caseStudy: CaseStudy) => Promise<boolean>;
  updateCaseStudy: (caseStudy: CaseStudy) => Promise<boolean>;
  deleteCaseStudy: (id: string) => Promise<boolean>;

  // Blog Posts & Whitepapers
  addBlogPost: (post: BlogPost) => Promise<boolean>;
  updateBlogPost: (post: BlogPost) => Promise<boolean>;
  deleteBlogPost: (id: string) => Promise<boolean>;

  // Tech Hubs
  addTechHub: (hub: OfficeHub) => Promise<boolean>;
  updateTechHub: (hub: OfficeHub) => Promise<boolean>;
  deleteTechHub: (id: string) => Promise<boolean>;

  // Testimonials
  addTestimonial: (testimonial: Testimonial) => Promise<boolean>;
  updateTestimonial: (testimonial: Testimonial) => Promise<boolean>;
  deleteTestimonial: (id: string) => Promise<boolean>;

  // Team Members (Founders & Leads)
  addTeamMember: (member: TeamMember) => Promise<boolean>;
  updateTeamMember: (member: TeamMember) => Promise<boolean>;
  deleteTeamMember: (id: string) => Promise<boolean>;

  // Script Products (Marketplace)
  addScriptProduct: (product: ScriptProduct) => Promise<boolean>;
  updateScriptProduct: (product: ScriptProduct) => Promise<boolean>;
  deleteScriptProduct: (id: string) => Promise<boolean>;

  // Live Visitor Announcement Banner
  updateLiveAnnouncement: (announcement: Partial<LiveAnnouncementConfig>) => Promise<boolean>;

  // Reset to default factory data
  resetAllToFactoryDefaults: () => Promise<boolean>;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

// Helper to load cached CMS data safely from localStorage
const getInitialCmsData = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(`vitech_cms_${key}`);
    if (saved && saved !== 'undefined' && saved !== 'null') {
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback)) {
        if (Array.isArray(parsed)) return parsed as unknown as T;
      } else if (parsed && typeof parsed === 'object') {
        return { ...fallback, ...parsed } as T;
      }
    }
  } catch (e) {
    console.warn(`Could not read cached vitech_cms_${key}`, e);
  }
  return fallback;
};

export const SiteDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [companyInfo, setCompanyInfo] = useState<typeof defaultCompanyInfo>(() => 
    getInitialCmsData('company_info', defaultCompanyInfo)
  );
  const [services, setServices] = useState<ServiceItem[]>(() => 
    getInitialCmsData('services', defaultServices)
  );
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>(() => 
    getInitialCmsData('case_studies', defaultCaseStudies)
  );
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => 
    getInitialCmsData('blog_posts', defaultBlogPosts)
  );
  const [techHubs, setTechHubs] = useState<OfficeHub[]>(() => 
    getInitialCmsData('tech_hubs', defaultTechHubs)
  );
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => 
    getInitialCmsData('testimonials', defaultTestimonials)
  );
  const [aiConfig, setAiConfig] = useState<AIAssistantConfig>(() => 
    getInitialCmsData('ai_config', DEFAULT_AI_CONFIG)
  );
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() =>
    getInitialCmsData('team_members', INITIAL_TEAM_MEMBERS)
  );
  const [scriptProducts, setScriptProducts] = useState<ScriptProduct[]>(() =>
    getInitialCmsData('script_products', INITIAL_SCRIPTS)
  );
  const [liveAnnouncement, setLiveAnnouncement] = useState<LiveAnnouncementConfig>(() =>
    getInitialCmsData('live_announcement', DEFAULT_ANNOUNCEMENT)
  );
  const [googleAdsConfig, setGoogleAdsConfig] = useState<GoogleAdsConfig>(() =>
    getInitialCmsData('google_ads_config', DEFAULT_GOOGLE_ADS_CONFIG)
  );

  // Initialize and inject scripts when googleAdsConfig changes
  useEffect(() => {
    initGoogleAdsScripts(googleAdsConfig);
  }, [googleAdsConfig]);


  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Load Initial Data from Firestore & Real-Time Sync
  useEffect(() => {
    let unsubscribes: (() => void)[] = [];

    // Cross-tab & In-Memory Event Sync Listener
    const handleContentSync = (event: Event) => {
      const customEvent = event as CustomEvent<{ documentId: string; data: any }>;
      if (!customEvent.detail) return;
      const { documentId, data } = customEvent.detail;
      if (!data) return;

      if (documentId === 'company_info') setCompanyInfo((prev) => ({ ...prev, ...data }));
      if (documentId === 'services' && Array.isArray(data)) setServices(data);
      if (documentId === 'case_studies' && Array.isArray(data)) setCaseStudies(data);
      if (documentId === 'blog_posts' && Array.isArray(data)) setBlogPosts(data);
      if (documentId === 'tech_hubs' && Array.isArray(data)) setTechHubs(data);
      if (documentId === 'testimonials' && Array.isArray(data)) setTestimonials(data);
      if (documentId === 'ai_config') setAiConfig((prev) => ({ ...prev, ...data }));
      if (documentId === 'team_members' && Array.isArray(data)) setTeamMembers(data);
      if (documentId === 'script_products' && Array.isArray(data)) setScriptProducts(data);
      if (documentId === 'live_announcement') setLiveAnnouncement((prev) => ({ ...prev, ...data }));
      if (documentId === 'google_ads_config') setGoogleAdsConfig((prev) => ({ ...prev, ...data }));
    };

    const handleStorageEvent = (e: StorageEvent) => {
      if (!e.key || !e.newValue) return;
      try {
        const parsed = JSON.parse(e.newValue);
        if (e.key === 'vitech_cms_company_info') setCompanyInfo((prev) => ({ ...prev, ...parsed }));
        if (e.key === 'vitech_cms_services' && Array.isArray(parsed)) setServices(parsed);
        if (e.key === 'vitech_cms_case_studies' && Array.isArray(parsed)) setCaseStudies(parsed);
        if (e.key === 'vitech_cms_blog_posts' && Array.isArray(parsed)) setBlogPosts(parsed);
        if (e.key === 'vitech_cms_tech_hubs' && Array.isArray(parsed)) setTechHubs(parsed);
        if (e.key === 'vitech_cms_testimonials' && Array.isArray(parsed)) setTestimonials(parsed);
        if (e.key === 'vitech_cms_ai_config') setAiConfig((prev) => ({ ...prev, ...parsed }));
        if (e.key === 'vitech_cms_team_members' && Array.isArray(parsed)) setTeamMembers(parsed);
        if (e.key === 'vitech_cms_script_products' && Array.isArray(parsed)) setScriptProducts(parsed);
        if (e.key === 'vitech_cms_live_announcement') setLiveAnnouncement((prev) => ({ ...prev, ...parsed }));
        if (e.key === 'vitech_cms_google_ads_config') setGoogleAdsConfig((prev) => ({ ...prev, ...parsed }));
      } catch (err) {

        console.warn('Error syncing storage event:', err);
      }
    };

    window.addEventListener('vitech_content_sync', handleContentSync);
    window.addEventListener('storage', handleStorageEvent);

    const initContent = () => {
      try {
        if (!db) {
          setIsLoading(false);
          return;
        }

        // Load Company Info
        const compRef = doc(db, 'site_content', 'company_info');
        const unsubComp = onSnapshot(compRef, (snap) => {
          if (snap.exists() && snap.data()?.data) {
            const data = snap.data()?.data;
            setCompanyInfo((prev) => ({ ...prev, ...data }));
            try { localStorage.setItem('vitech_cms_company_info', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(compRef, { data: defaultCompanyInfo, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Company info listener:', err));
        unsubscribes.push(unsubComp);

        // Load Services
        const servRef = doc(db, 'site_content', 'services');
        const unsubServ = onSnapshot(servRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data)) {
            const data = snap.data()?.data;
            setServices(data);
            try { localStorage.setItem('vitech_cms_services', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(servRef, { data: defaultServices, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Services listener:', err));
        unsubscribes.push(unsubServ);

        // Load Portfolio
        const portRef = doc(db, 'site_content', 'case_studies');
        const unsubPort = onSnapshot(portRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data)) {
            const data = snap.data()?.data;
            setCaseStudies(data);
            try { localStorage.setItem('vitech_cms_case_studies', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(portRef, { data: defaultCaseStudies, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Case studies listener:', err));
        unsubscribes.push(unsubPort);

        // Load Blog Posts
        const blogRef = doc(db, 'site_content', 'blog_posts');
        const unsubBlog = onSnapshot(blogRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data)) {
            const data = snap.data()?.data;
            setBlogPosts(data);
            try { localStorage.setItem('vitech_cms_blog_posts', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(blogRef, { data: defaultBlogPosts, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Blog posts listener:', err));
        unsubscribes.push(unsubBlog);

        // Load Tech Hubs
        const hubsRef = doc(db, 'site_content', 'tech_hubs');
        const unsubHubs = onSnapshot(hubsRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data)) {
            const data = snap.data()?.data;
            setTechHubs(data);
            try { localStorage.setItem('vitech_cms_tech_hubs', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(hubsRef, { data: defaultTechHubs, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Tech hubs listener:', err));
        unsubscribes.push(unsubHubs);

        // Load Testimonials
        const testRef = doc(db, 'site_content', 'testimonials');
        const unsubTest = onSnapshot(testRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data)) {
            const data = snap.data()?.data;
            setTestimonials(data);
            try { localStorage.setItem('vitech_cms_testimonials', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(testRef, { data: defaultTestimonials, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Testimonials listener:', err));
        unsubscribes.push(unsubTest);

        // Load AI Config
        const aiRef = doc(db, 'site_content', 'ai_config');
        const unsubAi = onSnapshot(aiRef, (snap) => {
          if (snap.exists() && snap.data()?.data) {
            const data = snap.data()?.data;
            setAiConfig((prev) => ({ ...prev, ...data }));
            try { localStorage.setItem('vitech_cms_ai_config', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(aiRef, { data: DEFAULT_AI_CONFIG, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('AI config listener:', err));
        unsubscribes.push(unsubAi);

        // Load Team Members
        const teamRef = doc(db, 'site_content', 'team_members');
        const unsubTeam = onSnapshot(teamRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data)) {
            const data = snap.data()?.data;
            setTeamMembers(data);
            try { localStorage.setItem('vitech_cms_team_members', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(teamRef, { data: INITIAL_TEAM_MEMBERS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Team members listener:', err));
        unsubscribes.push(unsubTeam);

        // Load Script Products
        const scriptsRef = doc(db, 'site_content', 'script_products');
        const unsubScripts = onSnapshot(scriptsRef, (snap) => {
          if (snap.exists() && Array.isArray(snap.data()?.data)) {
            const data = snap.data()?.data;
            setScriptProducts(data);
            try { localStorage.setItem('vitech_cms_script_products', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(scriptsRef, { data: INITIAL_SCRIPTS, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Script products listener:', err));
        unsubscribes.push(unsubScripts);

        // Load Live Announcement
        const annRef = doc(db, 'site_content', 'live_announcement');
        const unsubAnn = onSnapshot(annRef, (snap) => {
          if (snap.exists() && snap.data()?.data) {
            const data = snap.data()?.data;
            setLiveAnnouncement((prev) => ({ ...prev, ...data }));
            try { localStorage.setItem('vitech_cms_live_announcement', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(annRef, { data: DEFAULT_ANNOUNCEMENT, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Live announcement listener:', err));
        unsubscribes.push(unsubAnn);

        // Load Google Ads & AdSense Config
        const adsRef = doc(db, 'site_content', 'google_ads_config');
        const unsubAds = onSnapshot(adsRef, (snap) => {
          if (snap.exists() && snap.data()?.data) {
            const data = snap.data()?.data;
            setGoogleAdsConfig((prev) => ({ ...prev, ...data }));
            try { localStorage.setItem('vitech_cms_google_ads_config', JSON.stringify(data)); } catch (e) {}
          } else if (!snap.exists()) {
            setDoc(adsRef, { data: DEFAULT_GOOGLE_ADS_CONFIG, updatedAt: new Date().toISOString() }, { merge: true }).catch(() => {});
          }
        }, (err) => console.warn('Google ads listener:', err));
        unsubscribes.push(unsubAds);


        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing site content listeners:', err);
        setIsLoading(false);
      }
    };

    initContent();

    return () => {
      window.removeEventListener('vitech_content_sync', handleContentSync);
      window.removeEventListener('storage', handleStorageEvent);
      unsubscribes.forEach((unsub) => unsub());
    };
  }, []);

  // Generic helper to persist to Firestore and LocalStorage
  const saveToFirestore = async (documentId: string, data: any): Promise<boolean> => {
    setIsSaving(true);
    setSaveStatus('Enregistrement et synchronisation en cours...');

    // 1. Instant local persistence and cross-tab broadcast
    try {
      localStorage.setItem(`vitech_cms_${documentId}`, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('vitech_content_sync', { detail: { documentId, data } }));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // 2. Persistent cloud sync via Firestore
    try {
      if (db) {
        const ref = doc(db, 'site_content', documentId);
        await setDoc(ref, {
          data,
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      setSaveStatus('Publié et synchronisé en temps réel avec succès !');
      setTimeout(() => setSaveStatus(null), 3000);
      return true;
    } catch (err) {
      console.warn(`Firestore sync note for site_content/${documentId}:`, err);
      // Even if offline or network error, local persistence succeeded
      setSaveStatus('Enregistré localement (Mode résilient actif)');
      setTimeout(() => setSaveStatus(null), 4000);
      return true;
    } finally {
      setIsSaving(false);
    }
  };

  // Company Info Actions
  const updateCompanyInfo = async (data: Partial<typeof defaultCompanyInfo>) => {
    const updated = { ...companyInfo, ...data };
    setCompanyInfo(updated);
    return await saveToFirestore('company_info', updated);
  };

  // Services Actions
  const addService = async (service: ServiceItem) => {
    const updated = [...services, service];
    setServices(updated);
    return await saveToFirestore('services', updated);
  };

  const updateService = async (service: ServiceItem) => {
    const updated = services.map((s) => (s.id === service.id ? service : s));
    setServices(updated);
    return await saveToFirestore('services', updated);
  };

  const deleteService = async (serviceId: string) => {
    const updated = services.filter((s) => s.id !== serviceId);
    setServices(updated);
    return await saveToFirestore('services', updated);
  };

  // Case Studies Actions
  const addCaseStudy = async (caseStudy: CaseStudy) => {
    const updated = [...caseStudies, caseStudy];
    setCaseStudies(updated);
    return await saveToFirestore('case_studies', updated);
  };

  const updateCaseStudy = async (caseStudy: CaseStudy) => {
    const updated = caseStudies.map((c) => (c.id === caseStudy.id ? caseStudy : c));
    setCaseStudies(updated);
    return await saveToFirestore('case_studies', updated);
  };

  const deleteCaseStudy = async (id: string) => {
    const updated = caseStudies.filter((c) => c.id !== id);
    setCaseStudies(updated);
    return await saveToFirestore('case_studies', updated);
  };

  // Blog Posts Actions
  const addBlogPost = async (post: BlogPost) => {
    const updated = [post, ...blogPosts];
    setBlogPosts(updated);
    return await saveToFirestore('blog_posts', updated);
  };

  const updateBlogPost = async (post: BlogPost) => {
    const updated = blogPosts.map((b) => (b.id === post.id ? post : b));
    setBlogPosts(updated);
    return await saveToFirestore('blog_posts', updated);
  };

  const deleteBlogPost = async (id: string) => {
    const updated = blogPosts.filter((b) => b.id !== id);
    setBlogPosts(updated);
    return await saveToFirestore('blog_posts', updated);
  };

  // Tech Hubs Actions
  const addTechHub = async (hub: OfficeHub) => {
    const updated = [...techHubs, hub];
    setTechHubs(updated);
    return await saveToFirestore('tech_hubs', updated);
  };

  const updateTechHub = async (hub: OfficeHub) => {
    const updated = techHubs.map((h) => (h.id === hub.id ? hub : h));
    setTechHubs(updated);
    return await saveToFirestore('tech_hubs', updated);
  };

  const deleteTechHub = async (id: string) => {
    const updated = techHubs.filter((h) => h.id !== id);
    setTechHubs(updated);
    return await saveToFirestore('tech_hubs', updated);
  };

  // Testimonials Actions
  const addTestimonial = async (testimonial: Testimonial) => {
    const updated = [...testimonials, testimonial];
    setTestimonials(updated);
    return await saveToFirestore('testimonials', updated);
  };

  const updateTestimonial = async (testimonial: Testimonial) => {
    const updated = testimonials.map((t) => (t.id === testimonial.id ? testimonial : t));
    setTestimonials(updated);
    return await saveToFirestore('testimonials', updated);
  };

  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    return await saveToFirestore('testimonials', updated);
  };

  // Team Members Actions
  const addTeamMember = async (member: TeamMember) => {
    const updated = [...teamMembers, member];
    setTeamMembers(updated);
    return await saveToFirestore('team_members', updated);
  };

  const updateTeamMember = async (member: TeamMember) => {
    const updated = teamMembers.map((m) => (m.id === member.id ? member : m));
    setTeamMembers(updated);
    return await saveToFirestore('team_members', updated);
  };

  const deleteTeamMember = async (id: string) => {
    const updated = teamMembers.filter((m) => m.id !== id);
    setTeamMembers(updated);
    return await saveToFirestore('team_members', updated);
  };

  // Script Products Actions
  const addScriptProduct = async (product: ScriptProduct) => {
    const updated = [product, ...scriptProducts];
    setScriptProducts(updated);
    return await saveToFirestore('script_products', updated);
  };

  const updateScriptProduct = async (product: ScriptProduct) => {
    const updated = scriptProducts.map((p) => (p.id === product.id ? product : p));
    setScriptProducts(updated);
    return await saveToFirestore('script_products', updated);
  };

  const deleteScriptProduct = async (id: string) => {
    const updated = scriptProducts.filter((p) => p.id !== id);
    setScriptProducts(updated);
    return await saveToFirestore('script_products', updated);
  };

  // Live Announcement Actions
  const updateLiveAnnouncement = async (announcement: Partial<LiveAnnouncementConfig>) => {
    const updated: LiveAnnouncementConfig = {
      ...liveAnnouncement,
      ...announcement,
      updatedAt: new Date().toISOString()
    };
    setLiveAnnouncement(updated);
    return await saveToFirestore('live_announcement', updated);
  };

  // AI Assistant CMS Actions
  const updateAiConfig = async (data: Partial<AIAssistantConfig>) => {
    const updated = { ...aiConfig, ...data, updatedAt: new Date().toISOString() };
    setAiConfig(updated);
    return await saveToFirestore('ai_config', updated);
  };

  const resetAiConfigToDefault = async () => {
    setAiConfig(DEFAULT_AI_CONFIG);
    return await saveToFirestore('ai_config', DEFAULT_AI_CONFIG);
  };

  // Factory Reset
  const resetAllToFactoryDefaults = async () => {
    setCompanyInfo(defaultCompanyInfo);
    setServices(defaultServices);
    setCaseStudies(defaultCaseStudies);
    setBlogPosts(defaultBlogPosts);
    setTechHubs(defaultTechHubs);
    setTestimonials(defaultTestimonials);
    setAiConfig(DEFAULT_AI_CONFIG);
    setTeamMembers(INITIAL_TEAM_MEMBERS);
    setScriptProducts(INITIAL_SCRIPTS);
    setLiveAnnouncement(DEFAULT_ANNOUNCEMENT);
    setGoogleAdsConfig(DEFAULT_GOOGLE_ADS_CONFIG);

    await Promise.all([
      saveToFirestore('company_info', defaultCompanyInfo),
      saveToFirestore('services', defaultServices),
      saveToFirestore('case_studies', defaultCaseStudies),
      saveToFirestore('blog_posts', defaultBlogPosts),
      saveToFirestore('tech_hubs', defaultTechHubs),
      saveToFirestore('testimonials', defaultTestimonials),
      saveToFirestore('ai_config', DEFAULT_AI_CONFIG),
      saveToFirestore('team_members', INITIAL_TEAM_MEMBERS),
      saveToFirestore('script_products', INITIAL_SCRIPTS),
      saveToFirestore('live_announcement', DEFAULT_ANNOUNCEMENT),
      saveToFirestore('google_ads_config', DEFAULT_GOOGLE_ADS_CONFIG),
    ]);
    return true;
  };

  // Google Ads & AdSense Config Actions
  const updateGoogleAdsConfig = async (data: Partial<GoogleAdsConfig>) => {
    const updated: GoogleAdsConfig = {
      ...googleAdsConfig,
      ...data,
      updatedAt: new Date().toISOString(),
    };
    setGoogleAdsConfig(updated);
    initGoogleAdsScripts(updated);
    return await saveToFirestore('google_ads_config', updated);
  };

  return (
    <SiteDataContext.Provider
      value={{
        companyInfo: companyInfo || defaultCompanyInfo,
        services: Array.isArray(services) && services.length > 0 ? services : defaultServices,
        caseStudies: Array.isArray(caseStudies) && caseStudies.length > 0 ? caseStudies : defaultCaseStudies,
        blogPosts: Array.isArray(blogPosts) && blogPosts.length > 0 ? blogPosts : defaultBlogPosts,
        techHubs: Array.isArray(techHubs) && techHubs.length > 0 ? techHubs : defaultTechHubs,
        testimonials: Array.isArray(testimonials) && testimonials.length > 0 ? testimonials : defaultTestimonials,
        aiConfig: aiConfig || DEFAULT_AI_CONFIG,
        teamMembers: Array.isArray(teamMembers) && teamMembers.length > 0 ? teamMembers : INITIAL_TEAM_MEMBERS,
        scriptProducts: Array.isArray(scriptProducts) && scriptProducts.length > 0 ? scriptProducts : INITIAL_SCRIPTS,
        liveAnnouncement: liveAnnouncement || DEFAULT_ANNOUNCEMENT,
        googleAdsConfig: googleAdsConfig || DEFAULT_GOOGLE_ADS_CONFIG,
        isLoading,
        isSaving,
        saveStatus,
        updateCompanyInfo,
        updateAiConfig,
        resetAiConfigToDefault,
        updateGoogleAdsConfig,
        addService,

        updateService,
        deleteService,
        addCaseStudy,
        updateCaseStudy,
        deleteCaseStudy,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        addTechHub,
        updateTechHub,
        deleteTechHub,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
        addScriptProduct,
        updateScriptProduct,
        deleteScriptProduct,
        updateLiveAnnouncement,
        resetAllToFactoryDefaults,
      }}
    >
      {children}
    </SiteDataContext.Provider>
  );
};

export const useSiteData = () => {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData must be used within a SiteDataProvider');
  }
  return context;
};
