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
import { ServiceItem, CaseStudy, BlogPost, Testimonial, OfficeHub, AIAssistantConfig } from '../types';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SiteDataContextType {
  companyInfo: typeof defaultCompanyInfo;
  services: ServiceItem[];
  caseStudies: CaseStudy[];
  blogPosts: BlogPost[];
  techHubs: OfficeHub[];
  testimonials: Testimonial[];
  aiConfig: AIAssistantConfig;
  isLoading: boolean;
  isSaving: boolean;
  saveStatus: string | null;

  // CMS update methods
  updateCompanyInfo: (data: Partial<typeof defaultCompanyInfo>) => Promise<boolean>;
  
  // AI Assistant CMS Config
  updateAiConfig: (data: Partial<AIAssistantConfig>) => Promise<boolean>;
  resetAiConfigToDefault: () => Promise<boolean>;

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

  // Reset to default factory data
  resetAllToFactoryDefaults: () => Promise<boolean>;
}

const SiteDataContext = createContext<SiteDataContextType | undefined>(undefined);

// Helper to load cached CMS data safely from localStorage
const getInitialCmsData = <T,>(key: string, fallback: T): T => {
  try {
    const saved = localStorage.getItem(`vitech_cms_${key}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(fallback) ? Array.isArray(parsed) : typeof parsed === 'object') {
        return parsed;
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

    await Promise.all([
      saveToFirestore('company_info', defaultCompanyInfo),
      saveToFirestore('services', defaultServices),
      saveToFirestore('case_studies', defaultCaseStudies),
      saveToFirestore('blog_posts', defaultBlogPosts),
      saveToFirestore('tech_hubs', defaultTechHubs),
      saveToFirestore('testimonials', defaultTestimonials),
      saveToFirestore('ai_config', DEFAULT_AI_CONFIG),
    ]);
    return true;
  };

  return (
    <SiteDataContext.Provider
      value={{
        companyInfo,
        services,
        caseStudies,
        blogPosts,
        techHubs,
        testimonials,
        aiConfig,
        isLoading,
        isSaving,
        saveStatus,
        updateCompanyInfo,
        updateAiConfig,
        resetAiConfigToDefault,
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
